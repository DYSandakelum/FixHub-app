import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SupabaseClient } from '@supabase/supabase-js';
import { bookingStages, type BookingStage, type PaymentMethod } from '@/constants/transaction';

export type Booking = { id: string; providerName: string; service: string; dateTime: string; amount: number; status: BookingStage; paid: boolean };
export type Message = { id: string; body: string; mine: boolean; createdAt: string };
export type Review = { id: string; rating: number; comment: string; tags: string[] };
export type TransactionData = { booking: Booking; messages: Message[]; review: Review | null };
export const DEMO_ID = 'demo';
const demo = (): TransactionData => ({
  booking: { id: DEMO_ID, providerName: 'Prasanna Perera', service: 'Plumbing Repair', dateTime: 'Wed, Oct 17 @ 11:00 AM', amount: 3500, status: 'En Route', paid: false },
  messages: [
    { id: 'welcome', body: 'Hello! I am currently on my way to your location. I should arrive in about 10 minutes.', mine: false, createdAt: '2026-10-08T04:55:00Z' },
    { id: 'reply', body: 'Perfect, thank you for the update! I will make sure the gate is unlocked for you.', mine: true, createdAt: '2026-10-08T04:57:00Z' },
  ], review: null,
});
export const initialTransaction = demo;
let client: SupabaseClient | undefined;
async function backend() {
  if (!process.env.EXPO_PUBLIC_SUPABASE_URL || !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) throw new Error('Add your team’s Supabase environment values to load a real booking.');
  client ??= (await import('./supabase')).supabase;
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new Error('Please sign in before opening this booking.');
  return { client, userId: data.user.id };
}
function check(error: { message: string } | null) { if (error) throw new Error(error.message); }
const storageKey = 'fixhub.member3.demo.v1';

export async function loadTransaction(id: string): Promise<TransactionData> {
  if (id === DEMO_ID) {
    const saved = await AsyncStorage.getItem(storageKey);
    if (!saved) return demo();
    try { return JSON.parse(saved) as TransactionData; } catch { return demo(); }
  }
  const { client: db, userId } = await backend();
  const [booking, messages, review, payment] = await Promise.all([
    db.from('transaction_bookings').select('*').eq('id', id).single(),
    db.from('transaction_messages').select('*').eq('booking_id', id).order('created_at'),
    db.from('transaction_reviews').select('*').eq('booking_id', id).eq('customer_id', userId).maybeSingle(),
    db.from('transaction_payments').select('id').eq('booking_id', id).maybeSingle(),
  ]);
  [booking, messages, review, payment].forEach(result => check(result.error));
  const b = booking.data;
  return {
    booking: { id: b.id, providerName: b.provider_name, service: b.service, dateTime: b.date_time, amount: Number(b.amount), status: b.status, paid: !!payment.data },
    messages: (messages.data ?? []).map(m => ({ id: m.id, body: m.body, mine: m.sender_id === userId, createdAt: m.created_at })),
    review: review.data ? { id: review.data.id, rating: review.data.rating, comment: review.data.comment, tags: review.data.tags } : null,
  };
}
export async function saveDemo(data: TransactionData) { await AsyncStorage.setItem(storageKey, JSON.stringify(data)); }
export async function resetDemo() { await AsyncStorage.removeItem(storageKey); return demo(); }

export async function recordPayment(id: string, method: PaymentMethod) {
  const { client: db } = await backend();
  if (method !== 'Cash on Delivery') throw new Error('Online payment is not connected yet. Choose Cash on Delivery, or ask your team to connect a payment gateway.');
  const { error } = await db.rpc('transaction_record_cash_payment', { target_booking: id }); check(error);
}
export async function createMessage(id: string, body: string) {
  const { client: db, userId } = await backend();
  const { error } = await db.from('transaction_messages').insert({ booking_id: id, sender_id: userId, body }); check(error);
}
export async function removeMessage(messageId: string) {
  const { client: db, userId } = await backend();
  const { error } = await db.from('transaction_messages').delete().eq('id', messageId).eq('sender_id', userId); check(error);
}
export async function upsertReview(id: string, review: Omit<Review, 'id'>) {
  const { client: db, userId } = await backend();
  const { error } = await db.from('transaction_reviews').upsert({ booking_id: id, customer_id: userId, ...review }, { onConflict: 'booking_id,customer_id' }); check(error);
}
export async function removeReview(id: string) {
  const { client: db, userId } = await backend();
  const { error } = await db.from('transaction_reviews').delete().eq('booking_id', id).eq('customer_id', userId); check(error);
}
// Provider-owned status changes; the SQL function checks identity and stage ordering.
export async function advanceBookingStatus(id: string, status: BookingStage) {
  const { client: db } = await backend();
  const { error } = await db.rpc('transaction_advance_booking', { target_booking: id, next_status: status }); check(error);
}
export async function subscribeTransaction(id: string, refresh: () => void, onError: (message: string) => void) {
  const { client: db } = await backend();
  const channel = db.channel(`member3-${id}`);
  for (const table of ['transaction_bookings', 'transaction_messages', 'transaction_reviews', 'transaction_payments']) {
    channel.on('postgres_changes', { event: '*', schema: 'public', table, filter: `${table === 'transaction_bookings' ? 'id' : 'booking_id'}=eq.${id}` }, refresh);
  }
  channel.subscribe(status => { if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') onError('Live updates disconnected. Use Refresh in the options menu.'); });
  return () => { void db.removeChannel(channel); };
}
export function nextStage(status: BookingStage) { return bookingStages[Math.min(bookingStages.indexOf(status) + 1, bookingStages.length - 1)]; }
