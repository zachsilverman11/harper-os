-- HarperOS Phase 2 Schema Migration
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/odjqikyekktqlnrarupg/sql

-- ============================================
-- 1. Add new columns to existing projects table
-- ============================================

alter table projects add column if not exists vision text;
alter table projects add column if not exists what_is_built text;
alter table projects add column if not exists whats_next text;
alter table projects add column if not exists priority_rank integer default 999;
alter table projects add column if not exists last_discussed_at timestamptz;
alter table projects add column if not exists last_discussed_summary text;
alter table projects add column if not exists weekly_focus boolean default false;
alter table projects add column if not exists updated_by text default 'harper';
-- updated_at already exists

-- ============================================
-- 2. New tables
-- ============================================

create table if not exists project_decisions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  decision_date date not null,
  decision_text text not null,
  created_by text default 'harper',
  created_at timestamptz default now()
);

create table if not exists project_phases (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  phase_number integer not null,
  phase_name text not null,
  description text,
  status text default 'planned',
  created_at timestamptz default now()
);

create table if not exists weekly_focus (
  id uuid primary key default gen_random_uuid(),
  week_start date not null,
  focus_summary text,
  active_project_ids uuid[],
  set_by text default 'harper',
  created_at timestamptz default now()
);

create table if not exists memory_suggestions (
  id uuid primary key default gen_random_uuid(),
  suggestion_text text not null,
  created_at timestamptz default now()
);

-- ============================================
-- 3. Enable RLS on new tables
-- ============================================

alter table project_decisions enable row level security;
alter table project_phases enable row level security;
alter table weekly_focus enable row level security;
alter table memory_suggestions enable row level security;

-- ============================================
-- 4. Permissive RLS policies (same pattern as existing tables)
-- ============================================

do $$
begin
  -- project_decisions
  if not exists (select 1 from pg_policies where tablename = 'project_decisions' and policyname = 'Allow all for project_decisions') then
    create policy "Allow all for project_decisions" on project_decisions for all using (true) with check (true);
  end if;
  
  -- project_phases
  if not exists (select 1 from pg_policies where tablename = 'project_phases' and policyname = 'Allow all for project_phases') then
    create policy "Allow all for project_phases" on project_phases for all using (true) with check (true);
  end if;
  
  -- weekly_focus
  if not exists (select 1 from pg_policies where tablename = 'weekly_focus' and policyname = 'Allow all for weekly_focus') then
    create policy "Allow all for weekly_focus" on weekly_focus for all using (true) with check (true);
  end if;
  
  -- memory_suggestions
  if not exists (select 1 from pg_policies where tablename = 'memory_suggestions' and policyname = 'Allow all for memory_suggestions') then
    create policy "Allow all for memory_suggestions" on memory_suggestions for all using (true) with check (true);
  end if;
end
$$;

-- ============================================
-- 5. Recent decisions view
-- ============================================

create or replace view recent_decisions as
  select pd.*, p.name as project_name
  from project_decisions pd
  join projects p on p.id = pd.project_id
  order by pd.created_at desc
  limit 100;
