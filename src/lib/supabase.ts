import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as unknown as ReturnType<typeof createClient>;

// ============================================
// Database types (matching schema)
// ============================================

export interface DbBusiness {
  id: string;
  name: string;
  icon: string;
  color: string;
  order: number;
  type: 'business' | 'personal';
  created_at: string;
  updated_at: string;
}

export interface DbProject {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  color: string;
  order: number;
  archived: boolean;
  current_phase: number;
  total_phases: number;
  phase_name: string | null;
  status_label: string;
  // Phase 2 columns
  vision: string | null;
  what_is_built: string | null;
  whats_next: string | null;
  priority_rank: number;
  last_discussed_at: string | null;
  last_discussed_summary: string | null;
  weekly_focus: boolean;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface DbTask {
  id: string;
  project_id: string;
  parent_task_id: string | null;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  due_time: string | null;
  order: number;
  notes: string | null;
  tags: string[];
  assignee: string | null;
  estimated_minutes: number | null;
  actual_minutes: number | null;
  harper_action: boolean;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface DbTaskLink {
  id: string;
  task_id: string;
  type: 'repo' | 'vercel' | 'doc' | 'url' | 'notion' | 'figma';
  url: string;
  label: string;
  created_at: string;
}

export interface DbProjectDecision {
  id: string;
  project_id: string;
  decision_date: string;
  decision_text: string;
  created_by: string;
  created_at: string;
}

export interface DbProjectPhase {
  id: string;
  project_id: string;
  phase_number: number;
  phase_name: string;
  description: string | null;
  status: string;
  created_at: string;
}

export interface DbWeeklyFocus {
  id: string;
  week_start: string;
  focus_summary: string | null;
  active_project_ids: string[] | null;
  set_by: string;
  created_at: string;
}

export interface DbMemorySuggestion {
  id: string;
  suggestion_text: string;
  created_at: string;
}

export interface DbRecentDecision {
  id: string;
  project_id: string;
  decision_date: string;
  decision_text: string;
  created_by: string;
  created_at: string;
  project_name: string;
}

export interface DbGoal {
  id: string;
  business_id: string;
  title: string;
  description: string | null;
  target_date: string | null;
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface DbMilestone {
  id: string;
  goal_id: string;
  title: string;
  completed: boolean;
  completed_at: string | null;
  order: number;
  created_at: string;
}

export interface DbDailyFocus {
  id: string;
  date: string;
  priorities: string[];
  wins: string[];
  challenges: string[];
  notes: string | null;
  energy_level: number | null;
  created_at: string;
  updated_at: string;
}

export interface DbDocument {
  id: string;
  project_id: string | null;
  business_id: string;
  title: string;
  content: string;
  doc_type: string;
  status: string;
  author: string;
  summary: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
  reviewed_at: string | null;
}
