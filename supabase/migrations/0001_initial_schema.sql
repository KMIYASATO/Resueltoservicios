create schema if not exists private;
create schema if not exists billing;
create schema if not exists messaging;
create schema if not exists support;
create schema if not exists audit;

create type public.user_role as enum ('customer', 'professional', 'admin', 'support');
create type public.profile_status as enum ('active', 'inactive', 'suspended');
create type public.professional_status as enum ('draft', 'pending_verification', 'under_review', 'approved', 'rejected', 'suspended', 'inactive');
create type public.booking_status as enum (
  'draft',
  'pending_payment',
  'payment_processing',
  'confirmed',
  'accepted',
  'professional_on_the_way',
  'in_progress',
  'completed_by_professional',
  'completed',
  'cancelled_by_customer',
  'cancelled_by_professional',
  'disputed',
  'refunded',
  'closed'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'customer',
  first_name text,
  last_name text,
  phone text,
  avatar_path text,
  status public.profile_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  country_code text not null default 'PE',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.districts (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id),
  name text not null,
  slug text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (city_id, slug)
);

create table public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id),
  label text not null,
  address_line text not null,
  district_id uuid not null references public.districts(id),
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  reference text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.professional_profiles (
  user_id uuid primary key references public.profiles(id),
  business_name text,
  profile_type text not null default 'independent',
  biography text,
  years_experience integer not null default 0 check (years_experience >= 0),
  verification_status public.professional_status not null default 'draft',
  average_rating numeric(3, 2) not null default 0,
  completed_services integer not null default 0,
  repeat_customers integer not null default 0,
  current_level_id uuid,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon_key text not null,
  image_path text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id),
  name text not null,
  slug text not null unique,
  description text,
  pricing_type text not null default 'fixed_estimate',
  minimum_duration_minutes integer not null default 60,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.professional_services (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.professional_profiles(user_id),
  service_id uuid not null references public.services(id),
  price numeric(12, 2) not null check (price >= 0),
  minimum_price numeric(12, 2) not null check (minimum_price >= 0),
  minimum_duration_minutes integer not null default 60,
  supplies_included boolean not null default false,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (professional_id, service_id)
);

create table public.professional_coverage_zones (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.professional_profiles(user_id),
  district_id uuid not null references public.districts(id),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (professional_id, district_id)
);

create table public.availability_rules (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.professional_profiles(user_id),
  weekday integer not null check (weekday between 0 and 6),
  starts_at time not null,
  ends_at time not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  check (starts_at < ends_at)
);

create table public.availability_blocks (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.professional_profiles(user_id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text,
  created_at timestamptz not null default now(),
  check (starts_at < ends_at)
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id),
  professional_id uuid references public.professional_profiles(user_id),
  service_id uuid not null references public.services(id),
  address_id uuid not null references public.customer_addresses(id),
  scheduled_start timestamptz not null,
  scheduled_end timestamptz not null,
  duration_minutes integer not null,
  status public.booking_status not null default 'draft',
  customer_notes text,
  cancellation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (scheduled_start < scheduled_end)
);

create table public.booking_price_snapshots (
  booking_id uuid primary key references public.bookings(id),
  base_amount numeric(12, 2) not null default 0,
  urgency_amount numeric(12, 2) not null default 0,
  materials_amount numeric(12, 2) not null default 0,
  platform_fee numeric(12, 2) not null default 0,
  discount_amount numeric(12, 2) not null default 0,
  tax_amount numeric(12, 2) not null default 0,
  total_amount numeric(12, 2) not null default 0,
  professional_gross numeric(12, 2) not null default 0,
  commission_amount numeric(12, 2) not null default 0,
  professional_net numeric(12, 2) not null default 0,
  currency text not null default 'PEN',
  pricing_version text not null default 'mvp-1',
  created_at timestamptz not null default now()
);

create table audit.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  actor_role text,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  previous_state jsonb,
  next_state jsonb,
  request_id uuid,
  result text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.customer_addresses enable row level security;
alter table public.professional_profiles enable row level security;
alter table public.categories enable row level security;
alter table public.services enable row level security;
alter table public.professional_services enable row level security;
alter table public.professional_coverage_zones enable row level security;
alter table public.availability_rules enable row level security;
alter table public.availability_blocks enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_price_snapshots enable row level security;
alter table audit.audit_events enable row level security;

create policy "profiles_select_own" on public.profiles
  for select to authenticated using (id = auth.uid());

create policy "profiles_update_own_safe_fields" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "addresses_manage_own" on public.customer_addresses
  for all to authenticated using (customer_id = auth.uid()) with check (customer_id = auth.uid());

create policy "categories_public_read_active" on public.categories
  for select to anon, authenticated using (is_active = true);

create policy "services_public_read_active" on public.services
  for select to anon, authenticated using (is_active = true);

create policy "professional_profiles_public_read_approved" on public.professional_profiles
  for select to anon, authenticated using (verification_status = 'approved' and is_active = true);

create policy "professional_profiles_manage_own" on public.professional_profiles
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "professional_services_public_read_active" on public.professional_services
  for select to anon, authenticated using (is_active = true);

create policy "professional_services_manage_own" on public.professional_services
  for all to authenticated using (professional_id = auth.uid()) with check (professional_id = auth.uid());

create policy "coverage_manage_own" on public.professional_coverage_zones
  for all to authenticated using (professional_id = auth.uid()) with check (professional_id = auth.uid());

create policy "availability_rules_manage_own" on public.availability_rules
  for all to authenticated using (professional_id = auth.uid()) with check (professional_id = auth.uid());

create policy "availability_blocks_manage_own" on public.availability_blocks
  for all to authenticated using (professional_id = auth.uid()) with check (professional_id = auth.uid());

create policy "bookings_customer_or_professional_read" on public.bookings
  for select to authenticated using (customer_id = auth.uid() or professional_id = auth.uid());

create policy "booking_price_customer_or_professional_read" on public.booking_price_snapshots
  for select to authenticated using (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id
      and (b.customer_id = auth.uid() or b.professional_id = auth.uid())
    )
  );

insert into public.cities (name, slug) values ('Lima Metropolitana', 'lima-metropolitana') on conflict do nothing;

insert into public.categories (name, slug, icon_key, sort_order) values
  ('Limpieza del hogar', 'limpieza-hogar', 'Sparkles', 1),
  ('Gasfiteria', 'gasfiteria', 'Droplets', 2),
  ('Electricidad', 'electricidad', 'Zap', 3),
  ('Armado e instalacion', 'armado-instalacion', 'Wrench', 4)
on conflict do nothing;
