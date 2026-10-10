-- FixHub Database Schema (Matching Active Supabase Project)
-- Database: PostgreSQL / Supabase

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'provider', 'admin')),
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  avatar_url TEXT
);

-- 2. Providers Table
CREATE TABLE IF NOT EXISTS public.providers (
  id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
  service_type TEXT,
  experience_years INTEGER DEFAULT 0,
  bio TEXT,
  profile_image_url TEXT,
  rate NUMERIC DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE
);

-- 3. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
  service_date DATE NOT NULL,
  service_time TEXT NOT NULL,
  status TEXT DEFAULT 'Confirmed',
  price NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 4. Transaction Bookings Table
CREATE TABLE IF NOT EXISTS public.transaction_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID,
  provider_name TEXT,
  service TEXT,
  date_time TEXT,
  amount NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 5. Transaction Payments Table
CREATE TABLE IF NOT EXISTS public.transaction_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.transaction_bookings(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC DEFAULT 0,
  method TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 6. Messages Tables
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.transaction_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.transaction_bookings(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 7. Reviews Tables
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.transaction_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.transaction_bookings(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Storage bucket note:
-- Create a public bucket named 'avatars' in Supabase Dashboard -> Storage -> New Bucket.
