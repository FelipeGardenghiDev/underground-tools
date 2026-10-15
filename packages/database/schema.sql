-- ========================================================================
-- UNDERGROUND TOOLS // SUPABASE POSTGRESQL SCHEMA & POLICIES
-- 100% Custo Zero: Roda no plano Free Tier do Supabase
-- ========================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. BANDS PROFILE
create table if not exists public.bands (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  slug text unique not null,
  name text not null,
  genre text not null,
  location text not null,
  year_formed text,
  bio_short text,
  bio_long text,
  links jsonb default '{}'::jsonb,
  press_photos jsonb default '[]'::jsonb,
  press_quotes jsonb default '[]'::jsonb,
  members jsonb default '[]'::jsonb,
  releases jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. STAGE PLOTS
create table if not exists public.stage_plots (
  id uuid primary key default uuid_generate_v4(),
  band_id uuid references public.bands(id) on delete cascade not null,
  items jsonb not null default '[]'::jsonb,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. INPUT LISTS
create table if not exists public.input_lists (
  id uuid primary key default uuid_generate_v4(),
  band_id uuid references public.bands(id) on delete cascade not null,
  channel_number int not null,
  instrument text not null,
  mic_or_di text not null,
  stand_type text default 'None',
  phantom_48v boolean default false,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. TECH RIDERS
create table if not exists public.tech_riders (
  id uuid primary key default uuid_generate_v4(),
  band_id uuid references public.bands(id) on delete cascade not null,
  contact_name text not null,
  contact_role text not null,
  contact_phone text not null,
  contact_email text not null,
  soundcheck_min int default 30,
  pa_requirements text,
  monitor_mixes_count int default 2,
  monitor_requirements text,
  lighting_notes text,
  hospitality_notes text,
  additional_notes text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. SETLISTS
create table if not exists public.setlists (
  id uuid primary key default uuid_generate_v4(),
  band_id uuid references public.bands(id) on delete cascade not null,
  title text default 'Setlist Principal',
  songs jsonb not null default '[]'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. GIGS / SHOWS
create table if not exists public.gigs (
  id uuid primary key default uuid_generate_v4(),
  band_id uuid references public.bands(id) on delete cascade not null,
  show_date date not null,
  doors_time text,
  venue text not null,
  city text not null,
  state text not null,
  address text,
  ticket_url text,
  doors_price text,
  status text default 'confirmed',
  lineup text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. MERCH ITEMS
create table if not exists public.merch_items (
  id uuid primary key default uuid_generate_v4(),
  band_id uuid references public.bands(id) on delete cascade not null,
  title text not null,
  category text not null,
  price numeric(10, 2) not null,
  sizes text[],
  description text,
  image_url text,
  in_stock boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ROW LEVEL SECURITY (RLS)
alter table public.bands enable row level security;
alter table public.stage_plots enable row level security;
alter table public.input_lists enable row level security;
alter table public.tech_riders enable row level security;
alter table public.setlists enable row level security;
alter table public.gigs enable row level security;
alter table public.merch_items enable row level security;

-- Public can read all verified band profiles
create policy "Public read access for bands" on public.bands
  for select using (true);

create policy "Public read access for stage_plots" on public.stage_plots
  for select using (true);

create policy "Public read access for input_lists" on public.input_lists
  for select using (true);

create policy "Public read access for tech_riders" on public.tech_riders
  for select using (true);

create policy "Public read access for setlists" on public.setlists
  for select using (true);

create policy "Public read access for gigs" on public.gigs
  for select using (true);

create policy "Public read access for merch_items" on public.merch_items
  for select using (true);

-- Owners can mutate their own data
create policy "Owners can update band" on public.bands
  for all using (auth.uid() = user_id);
