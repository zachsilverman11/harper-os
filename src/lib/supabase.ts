import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DbBusiness {
  id: string;
  name: string;
  icon: string;
  color: string;
  order_num: number;
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
  order_num: number;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbTask {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  due_time: string | null;
  order_num: number;
  notes: string | null;
  links: object[];
  tags: string[];
  assignee: string | null;
  estimated_minutes: number | null;
  actual_minutes: number | null;
  harper_action: boolean;
  parent_task_id: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface DbGoal {
  id: string;
  business_id: string;
  title: string;
  description: string | null;
  target_date: string | null;
  progress: number;
  milestones: object[];
  created_at: string;
  updated_at: string;
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
