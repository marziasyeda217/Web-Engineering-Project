-- ==============================================================
-- MUASHRA - Web Engineering Course Database Schema
-- Run this in your Supabase SQL Editor (Takes 5 seconds)
-- ==============================================================

-- 1. Create the main complaints table
CREATE TABLE IF NOT EXISTS public.complaints (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    formal_english TEXT,
    formal_urdu TEXT,
    category TEXT DEFAULT 'Municipal Services',
    department TEXT DEFAULT 'Local Administration',
    urgency TEXT DEFAULT 'Medium',
    status TEXT DEFAULT 'Pending',
    upvotes INTEGER DEFAULT 1,
    city TEXT DEFAULT 'Pakistan',
    address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    citizen_name TEXT DEFAULT 'Citizen Reporter',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable public read and insert permissions so fetch() works easily from JS
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" 
ON public.complaints FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access" 
ON public.complaints FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access for status and upvotes" 
ON public.complaints FOR UPDATE 
USING (true);

-- 3. Grant direct table privileges to anon and authenticated roles
GRANT ALL ON public.complaints TO anon, authenticated, service_role;
