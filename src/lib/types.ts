export type Priority = 'critical' | 'high' | 'normal' | 'low';
export type TaskStatus = 'backlog' | 'this_week' | 'today' | 'in_progress' | 'needs_review' | 'done';
export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type BoardViewMode = 'kanban' | 'list';

// Top-level organizational units
export interface Business {
  id: string;
  name: string;
  icon: string;
  color: string;
  order: number;
  type: 'business' | 'personal'; // Inspired Swim, Inspired Mortgage, or Personal
}

export interface Project {
  id: string;
  businessId: string; // Links to parent business
  name: string;
  description?: string;
  color: string;
  order: number;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskLink {
  type: 'repo' | 'vercel' | 'doc' | 'url' | 'notion' | 'figma';
  url: string;
  label: string;
}

export interface Recurrence {
  type: RecurrenceType;
  interval: number; // every N days/weeks/months
  daysOfWeek?: number[]; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string; // ISO date string
  dueTime?: string; // HH:mm
  order: number;
  notes?: string;
  links: TaskLink[];
  tags: string[];
  assignee?: string; // For delegation (Cheri, Greg, etc.)
  estimatedMinutes?: number;
  actualMinutes?: number;
  recurrence?: Recurrence;
  parentTaskId?: string; // For subtasks
  harperAction?: boolean; // Can Harper take action on this?
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface Goal {
  id: string;
  businessId: string;
  title: string;
  description?: string;
  targetDate?: string;
  progress: number; // 0-100
  milestones: Milestone[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
}

export interface DailyFocus {
  id: string;
  date: string; // YYYY-MM-DD
  priorities: string[]; // task IDs in order (top 3-5)
  wins: string[]; // What went well
  challenges: string[]; // What was difficult
  notes?: string;
  energyLevel?: number; // 1-5
  createdAt: Date;
  updatedAt: Date;
}

export interface WeeklyPlan {
  id: string;
  weekStart: string; // YYYY-MM-DD (Monday)
  theme?: string; // "Launch Holly MVP", "Instructor Training", etc.
  goals: string[]; // What to accomplish this week
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const STATUS_COLUMNS: { key: TaskStatus; label: string; icon: string }[] = [
  { key: 'backlog', label: 'Backlog', icon: '📥' },
  { key: 'this_week', label: 'This Week', icon: '📅' },
  { key: 'today', label: 'Today', icon: '🎯' },
  { key: 'in_progress', label: 'In Progress', icon: '🔄' },
  { key: 'needs_review', label: 'Needs Review', icon: '👀' },
  { key: 'done', label: 'Done', icon: '✅' },
];

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bgColor: string }> = {
  critical: { label: 'Critical', color: 'text-rose-400', bgColor: 'bg-rose-500/20 border-rose-500/30' },
  high: { label: 'High', color: 'text-amber-400', bgColor: 'bg-amber-500/20 border-amber-500/30' },
  normal: { label: 'Normal', color: 'text-blue-400', bgColor: 'bg-blue-500/20 border-blue-500/30' },
  low: { label: 'Low', color: 'text-slate-400', bgColor: 'bg-slate-500/20 border-slate-500/30' },
};

export const PROJECT_COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f43f5e', // rose
  '#84cc16', // lime
];

export const TEAM_MEMBERS = [
  { id: 'zach', name: 'Zach', role: 'Owner' },
  { id: 'cheri', name: 'Cheri', role: 'GM - Inspired Swim' },
  { id: 'greg', name: 'Greg', role: 'Partner' },
  { id: 'amanda', name: 'Amanda', role: 'Inspired Mortgage' },
  { id: 'kelly', name: 'Kelly', role: 'Inspired Mortgage' },
  { id: 'jakub', name: 'Jakub', role: 'Inspired Mortgage' },
  { id: 'harper', name: 'Harper', role: 'Chief of Staff (AI)' },
];

// Alias for backwards compat
export const ASSIGNEES = TEAM_MEMBERS;

// For keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  newTask: 'n',
  search: '/',
  today: 't',
  board: 'b',
  goals: 'g',
  quickCapture: 'c',
  escape: 'Escape',
};
