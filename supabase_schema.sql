-- ========================================================
-- Masis Garden — Supabase PostgreSQL Database Schema
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/wdmmnaygesayufugenzv/sql
-- ========================================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  botanical_name TEXT,
  armenian_name TEXT,
  type TEXT NOT NULL DEFAULT 'plant',
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  in_stock BOOLEAN DEFAULT true,
  images TEXT[] DEFAULT '{}',
  description TEXT,
  care_tips TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  size TEXT,
  height TEXT,
  pot_diameter TEXT,
  mature_size TEXT,
  light_requirement TEXT,
  watering TEXT,
  temperature TEXT,
  humidity TEXT,
  difficulty TEXT,
  growth_speed TEXT,
  care_level TEXT,
  is_pet_friendly BOOLEAN DEFAULT false,
  is_air_purifying BOOLEAN DEFAULT false,
  indoor_outdoor TEXT DEFAULT 'indoor',
  pot_included BOOLEAN DEFAULT false,
  plant_type TEXT,
  leaf_color TEXT,
  suitable_locations TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_ru TEXT,
  name_am TEXT,
  emoji TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  title_ru TEXT,
  title_am TEXT,
  summary TEXT,
  summary_ru TEXT,
  summary_am TEXT,
  content TEXT,
  content_ru TEXT,
  content_am TEXT,
  cover_image TEXT,
  category TEXT DEFAULT 'care',
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_time INTEGER DEFAULT 5,
  tags TEXT[] DEFAULT '{}'
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT DEFAULT 'Yerevan',
  payment_method TEXT DEFAULT 'cash',
  total_amount NUMERIC NOT NULL,
  discount_amount NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_gift BOOLEAN DEFAULT false,
  gift_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PROMO CODES TABLE
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_percent INTEGER NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TICKETS (SUPPORT) TABLE
CREATE TABLE IF NOT EXISTS public.tickets (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. CRM CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.crm_customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  total_orders INTEGER DEFAULT 0,
  total_spent NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and public policies (Allow read/write for development)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete products" ON public.products FOR DELETE USING (true);

CREATE POLICY "Allow public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public read blog" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "Allow public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read orders" ON public.orders FOR SELECT USING (true);
