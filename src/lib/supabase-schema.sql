-- FixHub Database Schema: Users, Profiles & Providers
-- Run this script in the Supabase SQL Editor if creating or updating the tables.

-- 1. Profiles Table (used by Authentication module)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('customer', 'provider', 'admin')),
  service_category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 2. Users Table (used by Booking, Admin, and Customer Profile modules)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'provider', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 3. Providers Table (used by Search, Booking, and Admin verification modules)
CREATE TABLE IF NOT EXISTS public.providers (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  service_type TEXT,
  rate NUMERIC DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  description TEXT,
  rating NUMERIC DEFAULT 5.0,
  completed_jobs INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Profiles
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for Users
CREATE POLICY "Public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can insert own user" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own user" ON public.users FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for Providers
CREATE POLICY "Public read providers" ON public.providers FOR SELECT USING (true);
CREATE POLICY "Providers can insert self" ON public.providers FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Providers can update self" ON public.providers FOR UPDATE USING (auth.uid() = id);

-- Trigger to automatically sync auth.users metadata into profiles, users, and providers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_full_name TEXT := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
  user_phone TEXT := COALESCE(NEW.raw_user_meta_data->>'phone_number', '');
  user_role TEXT := COALESCE(NEW.raw_user_meta_data->>'role', 'customer');
  user_service_category TEXT := NEW.raw_user_meta_data->>'service_category';
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (id, email, full_name, phone_number, role, service_category)
  VALUES (NEW.id, NEW.email, user_full_name, user_phone, user_role, user_service_category)
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = EXCLUDED.full_name,
    phone_number = EXCLUDED.phone_number,
    role = EXCLUDED.role,
    service_category = EXCLUDED.service_category,
    updated_at = NOW();

  -- Insert into users
  INSERT INTO public.users (id, email, name, phone, role)
  VALUES (NEW.id, NEW.email, user_full_name, user_phone, user_role)
  ON CONFLICT (id) DO UPDATE
  SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role;

  -- If provider, also register in providers table
  IF user_role = 'provider' THEN
    INSERT INTO public.providers (id, service_type, verified)
    VALUES (NEW.id, user_service_category, FALSE)
    ON CONFLICT (id) DO UPDATE
    SET service_type = EXCLUDED.service_type;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
