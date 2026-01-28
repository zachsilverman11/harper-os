'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Business, Project, Task, TaskStatus, Priority, Goal, DailyFocus, WeeklyPlan,
  PROJECT_COLORS
} from './types';
import { format, parseISO } from 'date-fns';

interface HarperStore {
  // Data
  businesses: Business[];
  projects: Project[];
  tasks: Task[];
  goals: Goal[];
  dailyFocus: Record<string, DailyFocus>;
  weeklyPlans: Record<string, WeeklyPlan>;
  
  // UI State
  selectedProjectId: string | null;
  selectedBusinessId: string | null;
  view: 'board' | 'today' | 'goals' | 'weekly';
  searchQuery: string;
  quickCaptureOpen: boolean;
  
  // Business actions
  getBusinessById: (id: string) => Business | undefined;
  getProjectsByBusiness: (businessId: string) => Project[];
  
  // Project actions
  addProject: (businessId: string, name: string, description?: string) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setSelectedProject: (id: string | null) => void;
  setSelectedBusiness: (id: string | null) => void;
  
  // Task actions
  addTask: (projectId: string, title: string, status?: TaskStatus) => string;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus, newOrder: number) => void;
  duplicateTask: (taskId: string) => void;
  
  // Goal actions
  addGoal: (businessId: string, title: string) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  
  // Daily Focus actions
  getDailyFocus: (date: string) => DailyFocus | undefined;
  setDailyFocus: (date: string, focus: Partial<DailyFocus>) => void;
  addToDailyPriorities: (date: string, taskId: string) => void;
  removeFromDailyPriorities: (date: string, taskId: string) => void;
  
  // Weekly Plan actions
  getWeeklyPlan: (weekStart: string) => WeeklyPlan | undefined;
  setWeeklyPlan: (weekStart: string, plan: Partial<WeeklyPlan>) => void;
  
  // UI actions
  setView: (view: 'board' | 'today' | 'goals' | 'weekly') => void;
  setSearchQuery: (query: string) => void;
  setQuickCaptureOpen: (open: boolean) => void;
  
  // Getters
  getTasksByStatus: (status: TaskStatus, projectId?: string | null) => Task[];
  getTaskById: (id: string) => Task | undefined;
  getProjectById: (id: string) => Project | undefined;
  getTodayTasks: () => Task[];
  getOverdueTasks: () => Task[];
  getUpcomingTasks: (days: number) => Task[];
  searchTasks: (query: string) => Task[];
  getTasksByAssignee: (assignee: string) => Task[];
}

const generateId = () => crypto.randomUUID();

// ============================================
// DEFAULT DATA - Businesses
// ============================================
const DEFAULT_BUSINESSES: Business[] = [
  {
    id: 'inspired-swim',
    name: 'Inspired Swim',
    icon: '🏊',
    color: '#06b6d4',
    order: 0,
    type: 'business',
  },
  {
    id: 'inspired-mortgage',
    name: 'Inspired Mortgage',
    icon: '🏠',
    color: '#3b82f6',
    order: 1,
    type: 'business',
  },
  {
    id: 'personal',
    name: 'Personal',
    icon: '👤',
    color: '#8b5cf6',
    order: 2,
    type: 'personal',
  },
];

// ============================================
// DEFAULT DATA - Projects (nested under businesses)
// ============================================
const DEFAULT_PROJECTS: Project[] = [
  // Inspired Swim projects
  {
    id: 'nata',
    businessId: 'inspired-swim',
    name: 'Nata',
    description: 'Booking and management platform',
    color: PROJECT_COLORS[0],
    order: 0,
    archived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'swim-hub',
    businessId: 'inspired-swim',
    name: 'Swim Hub',
    description: 'Marketing/ops dashboards',
    color: PROJECT_COLORS[1],
    order: 1,
    archived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'splash-zone',
    businessId: 'inspired-swim',
    name: 'Splash Zone',
    description: 'Instructor engagement & reviews',
    color: PROJECT_COLORS[2],
    order: 2,
    archived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'is-marketing',
    businessId: 'inspired-swim',
    name: 'Marketing',
    description: 'Ads, retargeting, GBP',
    color: PROJECT_COLORS[3],
    order: 3,
    archived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'is-operations',
    businessId: 'inspired-swim',
    name: 'Operations',
    description: 'Team, locations, metrics',
    color: PROJECT_COLORS[4],
    order: 4,
    archived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  
  // Inspired Mortgage projects
  {
    id: 'holly',
    businessId: 'inspired-mortgage',
    name: 'Holly',
    description: 'SMS AI agent for home buyers',
    color: PROJECT_COLORS[5],
    order: 0,
    archived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'lod',
    businessId: 'inspired-mortgage',
    name: 'LOD',
    description: 'Leads on Demand - nurturing system',
    color: PROJECT_COLORS[6],
    order: 1,
    archived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'im-operations',
    businessId: 'inspired-mortgage',
    name: 'Operations',
    description: 'Team, leads, pipeline',
    color: PROJECT_COLORS[7],
    order: 2,
    archived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  
  // Personal projects
  {
    id: 'golf',
    businessId: 'personal',
    name: 'Golf',
    description: 'Scratch golfer - 170+ mph ball speed goal',
    color: '#84cc16',
    order: 0,
    archived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'health',
    businessId: 'personal',
    name: 'Health',
    description: 'Fitness, nutrition, physio',
    color: '#10b981',
    order: 1,
    archived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'harper-os',
    businessId: 'personal',
    name: 'Harper OS',
    description: 'This productivity system',
    color: '#ec4899',
    order: 2,
    archived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// ============================================
// DEFAULT DATA - Real tasks from Jan 28, 2026
// ============================================
const DEFAULT_TASKS: Task[] = [
  // TODAY - Critical/High Priority
  {
    id: generateId(),
    projectId: 'harper-os',
    title: 'Set up Supabase for Harper OS',
    description: 'Create project, get URL and anon key, share with Harper',
    status: 'today',
    priority: 'critical',
    order: 0,
    links: [{ type: 'url', url: 'https://supabase.com', label: 'Supabase' }],
    tags: ['setup', 'harper'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    projectId: 'nata',
    title: 'Review booking-v3 branch',
    description: 'Check swimmers page and location picker fixes',
    status: 'today',
    priority: 'high',
    order: 1,
    links: [{ type: 'repo', url: 'https://github.com', label: 'GitHub' }],
    tags: ['dev', 'review'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    projectId: 'harper-os',
    title: 'Add Harper to Slack workspace',
    description: 'Grant Harper access to Inspired Swim Slack',
    status: 'today',
    priority: 'high',
    order: 2,
    links: [],
    tags: ['access', 'setup'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    projectId: 'is-marketing',
    title: 'Add Harper to GA4',
    description: 'Add harper.clawdbot@gmail.com as viewer',
    status: 'today',
    priority: 'high',
    order: 3,
    links: [],
    tags: ['access', 'analytics'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    projectId: 'is-marketing',
    title: 'Add Harper to Google Ads',
    description: 'Add harper.clawdbot@gmail.com',
    status: 'today',
    priority: 'high',
    order: 4,
    links: [],
    tags: ['access', 'ads'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  
  // THIS WEEK
  {
    id: generateId(),
    projectId: 'is-operations',
    title: 'Review sales conversion rates',
    description: 'Check this week\'s conversion metrics with Cheri',
    status: 'this_week',
    priority: 'high',
    order: 0,
    links: [],
    tags: ['metrics'],
    assignee: 'cheri',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    projectId: 'holly',
    title: 'Schedule demo with Realtors',
    description: 'Line up validation demos for SMS agent',
    status: 'this_week',
    priority: 'high',
    order: 1,
    links: [],
    tags: ['sales', 'validation'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    projectId: 'is-marketing',
    title: 'Install Meta Pixel',
    description: 'Install pixel via GTM - free, starts building audiences',
    status: 'this_week',
    priority: 'normal',
    order: 2,
    links: [],
    tags: ['marketing', 'setup'],
    harperAction: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  
  // BACKLOG
  {
    id: generateId(),
    projectId: 'lod',
    title: 'Test dark mode for night-shift advisors',
    description: 'Verify the dark mode implementation',
    status: 'backlog',
    priority: 'normal',
    order: 0,
    links: [],
    tags: ['dev', 'ux'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    projectId: 'nata',
    title: 'Fix conversion tracking',
    description: 'Currently measures clicks, not bookings - critical for retargeting',
    status: 'backlog',
    priority: 'high',
    order: 1,
    links: [],
    tags: ['dev', 'analytics'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    projectId: 'is-marketing',
    title: 'Execute Meta retargeting strategy',
    description: 'After Nata 2.0 + tracking fixed + 500+ audience',
    status: 'backlog',
    priority: 'normal',
    order: 2,
    links: [],
    tags: ['marketing', 'ads'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    projectId: 'splash-zone',
    title: 'Appeal Langley GBP suspension',
    description: 'Location suspended - need to investigate and appeal',
    status: 'backlog',
    priority: 'normal',
    order: 3,
    links: [],
    tags: ['gbp'],
    harperAction: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    projectId: 'golf',
    title: 'Practice session - driver speed',
    description: 'Work on ball speed with new technique',
    status: 'backlog',
    priority: 'low',
    order: 4,
    links: [],
    tags: ['practice'],
    estimatedMinutes: 90,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  
  // DONE (today's wins)
  {
    id: generateId(),
    projectId: 'splash-zone',
    title: 'Set up GBP API access',
    description: 'OAuth flow with Zach\'s account - full access to 17 locations',
    status: 'done',
    priority: 'high',
    order: 0,
    links: [],
    tags: ['gbp', 'api'],
    completedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    projectId: 'splash-zone',
    title: 'Message Cheri about GBP strategy',
    description: 'Sent intro in #harper Slack channel',
    status: 'done',
    priority: 'normal',
    order: 1,
    links: [],
    tags: ['gbp', 'cheri'],
    completedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const useHarperStore = create<HarperStore>()(
  persist(
    (set, get) => ({
      businesses: DEFAULT_BUSINESSES,
      projects: DEFAULT_PROJECTS,
      tasks: DEFAULT_TASKS,
      goals: [],
      dailyFocus: {},
      weeklyPlans: {},
      selectedProjectId: null,
      selectedBusinessId: null,
      view: 'board',
      searchQuery: '',
      quickCaptureOpen: false,

      // Business actions
      getBusinessById: (id) => get().businesses.find((b) => b.id === id),
      
      getProjectsByBusiness: (businessId) => {
        return get().projects
          .filter((p) => p.businessId === businessId && !p.archived)
          .sort((a, b) => a.order - b.order);
      },

      // Project actions
      addProject: (businessId, name, description) => {
        const projects = get().projects;
        const businessProjects = projects.filter((p) => p.businessId === businessId);
        const newProject: Project = {
          id: generateId(),
          businessId,
          name,
          description,
          color: PROJECT_COLORS[businessProjects.length % PROJECT_COLORS.length],
          order: businessProjects.length,
          archived: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set({ projects: [...projects, newProject] });
      },

      updateProject: (id, updates) => {
        set({
          projects: get().projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
          ),
        });
      },

      deleteProject: (id) => {
        set({
          projects: get().projects.filter((p) => p.id !== id),
          tasks: get().tasks.filter((t) => t.projectId !== id),
        });
      },

      setSelectedProject: (id) => set({ selectedProjectId: id }),
      setSelectedBusiness: (id) => set({ selectedBusinessId: id }),

      // Task actions
      addTask: (projectId, title, status = 'backlog') => {
        const tasks = get().tasks;
        const tasksInColumn = tasks.filter((t) => t.status === status);
        const id = generateId();
        const newTask: Task = {
          id,
          projectId,
          title,
          status,
          priority: 'normal',
          order: tasksInColumn.length,
          links: [],
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set({ tasks: [...tasks, newTask] });
        return id;
      },

      updateTask: (id, updates) => {
        set({
          tasks: get().tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  ...updates,
                  updatedAt: new Date(),
                  completedAt:
                    updates.status === 'done' && t.status !== 'done'
                      ? new Date()
                      : updates.status !== 'done'
                      ? undefined
                      : t.completedAt,
                }
              : t
          ),
        });
      },

      deleteTask: (id) => {
        set({ tasks: get().tasks.filter((t) => t.id !== id) });
      },

      moveTask: (taskId, newStatus, newOrder) => {
        const tasks = get().tasks;
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;

        const otherTasks = tasks.filter((t) => t.id !== taskId);
        const targetColumnTasks = otherTasks
          .filter((t) => t.status === newStatus)
          .sort((a, b) => a.order - b.order);

        targetColumnTasks.splice(newOrder, 0, {
          ...task,
          status: newStatus,
          order: newOrder,
          updatedAt: new Date(),
          completedAt: newStatus === 'done' && task.status !== 'done' ? new Date() : task.completedAt,
        });

        const reorderedTarget = targetColumnTasks.map((t, i) => ({ ...t, order: i }));
        
        set({
          tasks: [
            ...otherTasks.filter((t) => t.status !== newStatus),
            ...reorderedTarget,
          ],
        });
      },

      duplicateTask: (taskId) => {
        const task = get().tasks.find((t) => t.id === taskId);
        if (!task) return;
        
        const newTask: Task = {
          ...task,
          id: generateId(),
          title: `${task.title} (copy)`,
          status: 'backlog',
          completedAt: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set({ tasks: [...get().tasks, newTask] });
      },

      // Goal actions
      addGoal: (businessId, title) => {
        const newGoal: Goal = {
          id: generateId(),
          businessId,
          title,
          progress: 0,
          milestones: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set({ goals: [...get().goals, newGoal] });
      },

      updateGoal: (id, updates) => {
        set({
          goals: get().goals.map((g) =>
            g.id === id ? { ...g, ...updates, updatedAt: new Date() } : g
          ),
        });
      },

      deleteGoal: (id) => {
        set({ goals: get().goals.filter((g) => g.id !== id) });
      },

      // Daily Focus
      getDailyFocus: (date) => get().dailyFocus[date],
      
      setDailyFocus: (date, focus) => {
        const existing = get().dailyFocus[date];
        set({
          dailyFocus: {
            ...get().dailyFocus,
            [date]: {
              id: existing?.id || generateId(),
              date,
              priorities: existing?.priorities || [],
              wins: existing?.wins || [],
              challenges: existing?.challenges || [],
              createdAt: existing?.createdAt || new Date(),
              updatedAt: new Date(),
              ...focus,
            },
          },
        });
      },

      addToDailyPriorities: (date, taskId) => {
        const focus = get().dailyFocus[date];
        if (focus?.priorities.includes(taskId)) return;
        get().setDailyFocus(date, {
          priorities: [...(focus?.priorities || []), taskId],
        });
      },

      removeFromDailyPriorities: (date, taskId) => {
        const focus = get().dailyFocus[date];
        if (!focus) return;
        get().setDailyFocus(date, {
          priorities: focus.priorities.filter((id) => id !== taskId),
        });
      },

      // Weekly Plan
      getWeeklyPlan: (weekStart) => get().weeklyPlans[weekStart],
      
      setWeeklyPlan: (weekStart, plan) => {
        const existing = get().weeklyPlans[weekStart];
        set({
          weeklyPlans: {
            ...get().weeklyPlans,
            [weekStart]: {
              id: existing?.id || generateId(),
              weekStart,
              goals: existing?.goals || [],
              createdAt: existing?.createdAt || new Date(),
              updatedAt: new Date(),
              ...plan,
            },
          },
        });
      },

      // UI actions
      setView: (view) => set({ view }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setQuickCaptureOpen: (quickCaptureOpen) => set({ quickCaptureOpen }),

      // Getters
      getTasksByStatus: (status, projectId) => {
        return get()
          .tasks.filter(
            (t) =>
              t.status === status &&
              (projectId === null || projectId === undefined || t.projectId === projectId)
          )
          .sort((a, b) => a.order - b.order);
      },

      getTaskById: (id) => get().tasks.find((t) => t.id === id),
      
      getProjectById: (id) => get().projects.find((p) => p.id === id),

      getTodayTasks: () => {
        const today = format(new Date(), 'yyyy-MM-dd');
        return get().tasks.filter(
          (t) => t.status === 'today' || t.dueDate === today
        );
      },

      getOverdueTasks: () => {
        const today = format(new Date(), 'yyyy-MM-dd');
        return get().tasks.filter(
          (t) => t.dueDate && t.dueDate < today && t.status !== 'done'
        );
      },

      getUpcomingTasks: (days) => {
        const today = new Date();
        const future = new Date(today);
        future.setDate(future.getDate() + days);
        
        return get().tasks.filter((t) => {
          if (!t.dueDate || t.status === 'done') return false;
          const due = parseISO(t.dueDate);
          return due >= today && due <= future;
        });
      },

      searchTasks: (query) => {
        const q = query.toLowerCase();
        return get().tasks.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.description?.toLowerCase().includes(q) ||
            t.notes?.toLowerCase().includes(q) ||
            t.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      },

      getTasksByAssignee: (assignee) => {
        return get().tasks.filter((t) => t.assignee === assignee);
      },
    }),
    {
      name: 'harper-os-storage',
    }
  )
);
