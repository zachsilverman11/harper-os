import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types (matching our schema)
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
  created_at: string;
  updated_at: string;
}

export interface DbTask {
  id: string;
  project_id: string;
  parent_task_id: string | null;
  title: string;
  description: string | null;
  status: 'backlog' | 'this_week' | 'today' | 'in_progress' | 'needs_review' | 'done';
  priority: 'critical' | 'high' | 'normal' | 'low';
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

export interface DbWeeklyPlan {
  id: string;
  week_start: string;
  theme: string | null;
  goals: string[];
  notes: string | null;
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
