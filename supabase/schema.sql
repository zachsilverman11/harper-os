-- Harper OS Database Schema
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/odjqikyekktqlnrarupg/sql)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Businesses table
create table if not exists businesses (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  icon text not null default '📁',
  color text not null default '#3b82f6',
  order_num integer not null default 0,
  type text not null check (type in ('business', 'personal')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Projects table
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade,
  name text not null,
  description text,
  color text not null default '#3b82f6',
  order_num integer not null default 0,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tasks table
create table if not exists tasks (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'backlog' check (status in ('idea', 'backlog', 'this_week', 'today', 'in_progress', 'needs_review', 'done')),
  priority text not null default 'normal' check (priority in ('critical', 'high', 'normal', 'low')),
  due_date date,
  due_time time,
  order_num integer not null default 0,
  notes text,
  links jsonb not null default '[]',
  tags text[] not null default '{}',
  assignee text,
  estimated_minutes integer,
  actual_minutes integer,
  harper_action boolean not null default false,
  parent_task_id uuid references tasks(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

-- Goals table
create table if not exists goals (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade,
  title text not null,
  description text,
  target_date date,
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  milestones jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Daily focus table
create table if not exists daily_focus (
  id uuid primary key default uuid_generate_v4(),
  date date not null unique,
  priorities uuid[] not null default '{}',
  wins text[] not null default '{}',
  challenges text[] not null default '{}',
  notes text,
  energy_level integer check (energy_level >= 1 and energy_level <= 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Weekly plans table
create table if not exists weekly_plans (
  id uuid primary key default uuid_generate_v4(),
  week_start date not null unique,
  theme text,
  goals text[] not null default '{}',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Documents table
create table if not exists documents (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete set null,
  business_id uuid not null references businesses(id) on delete cascade,
  title text not null,
  content text not null default '',
  doc_type text not null default 'report' check (doc_type in ('plan', 'report', 'strategy', 'playbook', 'analysis', 'brief')),
  status text not null default 'draft' check (status in ('draft', 'published', 'reviewed', 'archived')),
  author text not null default 'harper',
  summary text,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  reviewed_at timestamptz
);

-- Indexes for performance
create index if not exists idx_projects_business_id on projects(business_id);
create index if not exists idx_tasks_project_id on tasks(project_id);
create index if not exists idx_tasks_status on tasks(status);
create index if not exists idx_tasks_assignee on tasks(assignee);
create index if not exists idx_goals_business_id on goals(business_id);
create index if not exists idx_daily_focus_date on daily_focus(date);
create index if not exists idx_weekly_plans_week_start on weekly_plans(week_start);
create index if not exists idx_documents_business_id on documents(business_id);
create index if not exists idx_documents_project_id on documents(project_id);
create index if not exists idx_documents_doc_type on documents(doc_type);

-- Row Level Security (RLS) - disabled for now, enable when adding auth
alter table businesses enable row level security;
alter table projects enable row level security;
alter table tasks enable row level security;
alter table goals enable row level security;
alter table daily_focus enable row level security;
alter table weekly_plans enable row level security;
alter table documents enable row level security;

-- Policies - allow all for now (single user system)
create policy "Allow all for businesses" on businesses for all using (true);
create policy "Allow all for projects" on projects for all using (true);
create policy "Allow all for tasks" on tasks for all using (true);
create policy "Allow all for goals" on goals for all using (true);
create policy "Allow all for daily_focus" on daily_focus for all using (true);
create policy "Allow all for weekly_plans" on weekly_plans for all using (true);
create policy "Allow all for documents" on documents for all using (true);

-- Updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at triggers
create trigger update_businesses_updated_at before update on businesses for each row execute function update_updated_at_column();
create trigger update_projects_updated_at before update on projects for each row execute function update_updated_at_column();
create trigger update_tasks_updated_at before update on tasks for each row execute function update_updated_at_column();
create trigger update_goals_updated_at before update on goals for each row execute function update_updated_at_column();
create trigger update_daily_focus_updated_at before update on daily_focus for each row execute function update_updated_at_column();
create trigger update_weekly_plans_updated_at before update on weekly_plans for each row execute function update_updated_at_column();
create trigger update_documents_updated_at before update on documents for each row execute function update_updated_at_column();
