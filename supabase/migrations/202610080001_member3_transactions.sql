-- Member 3's isolated schema. Apply once using the team's Supabase SQL editor.
-- Authoritative booking prices and participants must be inserted by a trusted
-- booking backend/service role, never supplied by a payment client.
begin;
create table public.transaction_bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id),
  provider_id uuid not null references auth.users(id),
  provider_name text not null,
  service text not null,
  date_time text not null,
  amount numeric(12,2) not null check (amount > 0),
  status text not null default 'Confirmed' check (status in ('Confirmed','En Route','Arrived','In Progress','Completed')),
  created_at timestamptz not null default now(),
  check (customer_id <> provider_id)
);
create table public.transaction_payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.transaction_bookings(id),
  customer_id uuid not null references auth.users(id),
  amount numeric(12,2) not null check (amount > 0),
  method text not null check (method = 'Cash on Delivery'),
  status text not null default 'pending_collection' check (status in ('pending_collection','collected')),
  created_at timestamptz not null default now()
);
create table public.transaction_messages (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.transaction_bookings(id),
  sender_id uuid not null references auth.users(id),
  body text not null check (char_length(trim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);
create table public.transaction_reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.transaction_bookings(id),
  customer_id uuid not null references auth.users(id),
  rating integer not null check (rating between 1 and 5),
  comment text not null default '' check (char_length(comment) <= 2000),
  tags text[] not null default '{}' check (tags <@ array['Punctual','Professional','Clean Work','Fair Price']::text[]),
  created_at timestamptz not null default now(),
  unique (booking_id, customer_id)
);
create index on public.transaction_bookings(customer_id);
create index on public.transaction_bookings(provider_id);
create index on public.transaction_messages(booking_id, created_at);
alter table public.transaction_bookings enable row level security;
alter table public.transaction_payments enable row level security;
alter table public.transaction_messages enable row level security;
alter table public.transaction_reviews enable row level security;
revoke all on public.transaction_bookings, public.transaction_payments, public.transaction_messages, public.transaction_reviews from anon, authenticated;
grant select on public.transaction_bookings, public.transaction_payments to authenticated;
grant select, insert, delete on public.transaction_messages to authenticated;
grant select, insert, update, delete on public.transaction_reviews to authenticated;
grant all on public.transaction_bookings, public.transaction_payments, public.transaction_messages, public.transaction_reviews to service_role;
create policy booking_participants on public.transaction_bookings for select to authenticated
  using (auth.uid() in (customer_id, provider_id));
create policy payment_participants on public.transaction_payments for select to authenticated
  using (exists (select 1 from public.transaction_bookings b where b.id = booking_id and auth.uid() in (b.customer_id, b.provider_id)));
create policy message_participants on public.transaction_messages for select to authenticated
  using (exists (select 1 from public.transaction_bookings b where b.id = booking_id and auth.uid() in (b.customer_id, b.provider_id)));
create policy message_send on public.transaction_messages for insert to authenticated
  with check (sender_id = auth.uid() and exists (select 1 from public.transaction_bookings b where b.id = booking_id and auth.uid() in (b.customer_id,b.provider_id)));
create policy message_delete on public.transaction_messages for delete to authenticated using (sender_id = auth.uid());
create policy review_read on public.transaction_reviews for select to authenticated
  using (exists (select 1 from public.transaction_bookings b where b.id = booking_id and auth.uid() in (b.customer_id,b.provider_id)));
create policy review_create on public.transaction_reviews for insert to authenticated
  with check (customer_id = auth.uid() and exists (select 1 from public.transaction_bookings b where b.id = booking_id and b.customer_id = auth.uid() and b.status = 'Completed'));
create policy review_edit on public.transaction_reviews for update to authenticated
  using (customer_id = auth.uid())
  with check (customer_id = auth.uid() and exists (select 1 from public.transaction_bookings b where b.id = booking_id and b.customer_id = auth.uid() and b.status = 'Completed'));
create policy review_delete on public.transaction_reviews for delete to authenticated using (customer_id = auth.uid());

create function public.transaction_record_cash_payment(target_booking uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare b public.transaction_bookings;
begin
  select * into b from public.transaction_bookings where id = target_booking for update;
  if b.id is null or auth.uid() is distinct from b.customer_id then raise exception 'Booking unavailable'; end if;
  insert into public.transaction_payments(booking_id,customer_id,amount,method)
    values (b.id,b.customer_id,b.amount,'Cash on Delivery') on conflict (booking_id) do nothing;
end;
$$;
create function public.transaction_advance_booking(target_booking uuid, next_status text) returns void
language plpgsql security definer set search_path = '' as $$
declare b public.transaction_bookings;
declare stages text[] := array['Confirmed','En Route','Arrived','In Progress','Completed'];
begin
  select * into b from public.transaction_bookings where id = target_booking for update;
  if b.id is null or auth.uid() is distinct from b.provider_id then raise exception 'Only the assigned provider can update status'; end if;
  if array_position(stages,next_status) is null or array_position(stages,next_status) <> array_position(stages,b.status) + 1 then raise exception 'Invalid status transition'; end if;
  update public.transaction_bookings set status = next_status where id = b.id;
end;
$$;
revoke all on function public.transaction_record_cash_payment(uuid), public.transaction_advance_booking(uuid,text) from public, anon;
grant execute on function public.transaction_record_cash_payment(uuid), public.transaction_advance_booking(uuid,text) to authenticated;

-- Realtime is scoped by the row policies above.
alter publication supabase_realtime add table public.transaction_bookings, public.transaction_messages, public.transaction_reviews, public.transaction_payments;
commit;
