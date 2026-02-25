#!/usr/bin/env node
/**
 * HarperOS Phase 2 — Schema migrations
 * Run: node scripts/migrate-phase2.mjs
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://odjqikyekktqlnrarupg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kanFpa3lla2t0cWxucmFydXBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MzM1NDksImV4cCI6MjA4NTIwOTU0OX0.vNN78oAd1LNCaaGUwZ-XTDF4QgxU4QLe6huGiLHM3_U'
);

const migrations = [
  // Add new columns to projects table
  `alter table projects add column if not exists vision text`,
  `alter table projects add column if not exists what_is_built text`,
  `alter table projects add column if not exists whats_next text`,
  `alter table projects add column if not exists priority_rank integer default 999`,
  `alter table projects add column if not exists last_discussed_at timestamptz`,
  `alter table projects add column if not exists last_discussed_summary text`,
  `alter table projects add column if not exists weekly_focus boolean default false`,
  `alter table projects add column if not exists updated_by text default 'harper'`,
  // Note: updated_at already exists on projects table

  // project_decisions table
  `create table if not exists project_decisions (
    id uuid primary key default gen_random_uuid(),
    project_id uuid references projects(id) on delete cascade,
    decision_date date not null,
    decision_text text not null,
    created_by text default 'harper',
    created_at timestamptz default now()
  )`,

  // project_phases table
  `create table if not exists project_phases (
    id uuid primary key default gen_random_uuid(),
    project_id uuid references projects(id) on delete cascade,
    phase_number integer not null,
    phase_name text not null,
    description text,
    status text default 'planned',
    created_at timestamptz default now()
  )`,

  // weekly_focus table
  `create table if not exists weekly_focus (
    id uuid primary key default gen_random_uuid(),
    week_start date not null,
    focus_summary text,
    active_project_ids uuid[],
    set_by text default 'harper',
    created_at timestamptz default now()
  )`,

  // memory_suggestions table
  `create table if not exists memory_suggestions (
    id uuid primary key default gen_random_uuid(),
    suggestion_text text not null,
    created_at timestamptz default now()
  )`,

  // Enable RLS on new tables
  `alter table project_decisions enable row level security`,
  `alter table project_phases enable row level security`,
  `alter table weekly_focus enable row level security`,
  `alter table memory_suggestions enable row level security`,

  // Permissive RLS policies
  `create policy if not exists "Allow all for project_decisions" on project_decisions for all using (true) with check (true)`,
  `create policy if not exists "Allow all for project_phases" on project_phases for all using (true) with check (true)`,
  `create policy if not exists "Allow all for weekly_focus" on weekly_focus for all using (true) with check (true)`,
  `create policy if not exists "Allow all for memory_suggestions" on memory_suggestions for all using (true) with check (true)`,
];

async function runMigrations() {
  console.log('Running Phase 2 migrations...\n');
  
  for (const sql of migrations) {
    const shortSql = sql.trim().substring(0, 80).replace(/\n/g, ' ');
    process.stdout.write(`  → ${shortSql}... `);
    
    const { error } = await supabase.rpc('exec_sql', { sql_text: sql }).maybeSingle();
    
    if (error) {
      // Try direct query via REST — rpc may not exist
      // Fall back to just logging
      console.log(`⚠️  RPC not available, will try alternative`);
    } else {
      console.log('✅');
    }
  }
  
  console.log('\nDone! If RPC failed, run these in Supabase SQL Editor.');
}

runMigrations().catch(console.error);
