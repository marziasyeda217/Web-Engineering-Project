-- ==============================================================
-- MUASHRA - Complete Supabase Cloud Setup
-- Run this in your Supabase SQL Editor (Takes 5 seconds)
-- ==============================================================

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'citizen',
    department TEXT,
    designation TEXT,
    badge_id TEXT,
    city TEXT DEFAULT 'Khairpur Mirs',
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Complaints Table
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
    city TEXT DEFAULT 'Khairpur Mirs',
    address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    citizen_name TEXT DEFAULT 'Verified Citizen',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- 4. Clean up any old duplicate policies
DROP POLICY IF EXISTS "Allow public all access on users" ON public.users;
DROP POLICY IF EXISTS "Allow public read users" ON public.users;
DROP POLICY IF EXISTS "Allow public insert users" ON public.users;

DROP POLICY IF EXISTS "Allow public read access" ON public.complaints;
DROP POLICY IF EXISTS "Allow public insert access" ON public.complaints;
DROP POLICY IF EXISTS "Allow public update access for status and upvotes" ON public.complaints;
DROP POLICY IF EXISTS "Allow public all access on complaints" ON public.complaints;

-- 5. Create Permissive Policies so fetch() works smoothly
CREATE POLICY "Allow public all access on users" 
ON public.users FOR ALL 
USING (true) WITH CHECK (true);

CREATE POLICY "Allow public all access on complaints" 
ON public.complaints FOR ALL 
USING (true) WITH CHECK (true);

-- 6. Direct Table Grants to anon (Fixes Permission Denied Error)
GRANT ALL ON TABLE public.users TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.complaints TO anon, authenticated, service_role;

-- 7. Insert Default Citizens and Khairpur Electricity Officer
INSERT INTO public.users (id, name, email, password, role, department, designation, badge_id, city, phone)
VALUES 
('usr-101', 'Ahmed Khan', 'ahmed@citizen.pk', 'password123', 'citizen', NULL, NULL, NULL, 'Khairpur Mirs', '0300-1234567'),
('usr-102', 'Engr. Farooq Soomro', 'officer.khairpur@sepco.com.pk', 'OfficerPass2026!', 'officer', 'Sukkur Electric Power Company (SEPCO)', 'Sub-Divisional Officer (SDO) - Khairpur Sub-Division', 'SEPCO-8812', 'Khairpur Mirs', '0243-920150')
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, email = EXCLUDED.email, badge_id = EXCLUDED.badge_id, department = EXCLUDED.department, city = EXCLUDED.city;
