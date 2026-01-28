'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Project, Task, TaskStatus, Priority, Goal, DailyFocus, WeeklyPlan,
  PROJECT_COLORS, LifeArea 
} from './types';
import { format, startOfWeek, isToday, isTomorrow, isPast, parseISO } from 'date-fns';

interface HarperStore {
  // Data
  projects: Project[];
  tasks: Task[];
  goals: Goal[];
  dailyFocus: Record<string, DailyFocus>; // keyed by date
  weeklyPlans: Record<string, WeeklyPlan>; // keyed by week start
  
  // UI State
  selectedProjectId: string | null;
  view: 'board' | 'today' | 'goals' | 'weekly';
  searchQuery: string;
  quickCaptureOpen: boolean;
  
  // Project actions
  addProject: (name: string, description?: string, lifeArea?: LifeArea) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setSelectedProject: (id: string | null) => void;
  
  // Task actions
  addTask: (projectId: string, title: string, status?: TaskStatus) => string;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus, newOrder: number) => void;
  duplicateTask: (taskId: string) => void;
  
  // Goal actions
  addGoal: (title: string, lifeArea: LifeArea) => void;
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
  getProjectsByLifeArea: (area: LifeArea) => Project[];
}

const generateId = () => crypto.randomUUID();

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'inspired-swim',
    name: 'Inspired Swim',
    description: 'Private swim instruction company - 16+ locations across BC and Alberta',
    color: PROJECT_COLORS[0],
    order: 0,
    archived: false,
    lifeArea: 'business',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'inspired-mortgage',
    name: 'Inspired Mortgage',
    description: '20+ years in Canadian residential mortgages',
    color: PROJECT_COLORS[1],
    order: 1,
    archived: false,
    lifeArea: 'business',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'holly',
    name: 'Holly',
    description: 'SMS AI agent for home buyers - B2B2C platform',
    color: PROJECT_COLORS[2],
    order: 2,
    archived: false,
    lifeArea: 'business',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'nata',
    name: 'Nata',
    description: 'Booking and management platform for Inspired Swim',
    color: PROJECT_COLORS[3],
    order: 3,
    archived: false,
    lifeArea: 'business',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'lod',
    name: 'LOD',
    description: 'Leads on Demand - Mortgage lead nurturing system',
    color: PROJECT_COLORS[4],
    order: 4,
    archived: false,
    lifeArea: 'business',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'swim-hub',
    name: 'Swim Hub',
    description: 'Marketing/ops dashboards for Inspired Swim',
    color: PROJECT_COLORS[5],
    order: 5,
    archived: false,
    lifeArea: 'business',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'splash-zone',
    name: 'Splash Zone',
    description: 'Instructor engagement app for reviews and content',
    color: PROJECT_COLORS[6],
    order: 6,
    archived: false,
    lifeArea: 'business',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'golf',
    name: 'Golf',
    description: 'Scratch golfer - working toward 170+ mph ball speed',
    color: '#84cc16',
    order: 7,
    archived: false,
    lifeArea: 'personal',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'health',
    name: 'Health & Fitness',
    description: 'Physical health, exercise, nutrition',
    color: '#10b981',
    order: 8,
    archived: false,
    lifeArea: 'health',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'personal',
    name: 'Personal',
    description: 'Personal projects and life admin',
    color: '#8b5cf6',
    order: 9,
    archived: false,
    lifeArea: 'personal',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const DEFAULT_TASKS: Task[] = [
  {
    id: generateId(),
    projectId: 'nata',
    title: 'Review booking-v3 branch fixes',
    description: 'Check the swimmers page and location picker fixes',
    status: 'today',
    priority: 'high',
    order: 0,
    links: [{ type: 'repo', url: 'https://github.com/InspiredSwim/nata', label: 'GitHub' }],
    tags: ['dev', 'review'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    projectId: 'personal',
    title: 'Review Harper OS',
    description: 'Test the new project management system',
    status: 'today',
    priority: 'critical',
    order: 1,
    links: [],
    tags: ['harper'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    projectId: 'inspired-swim',
    title: 'Review sales conversion rates',
    description: 'Check this week\'s conversion metrics with Cheri',
    status: 'this_week',
    priority: 'high',
    order: 0,
    links: [],
    tags: ['metrics', 'cheri'],
    assignee: 'cheri',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    projectId: 'holly',
    title: 'Schedule demo with high-powered Realtors',
    description: 'Line up validation demos for the SMS agent',
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
    projectId: 'lod',
    title: 'Test dark mode for night-shift advisors',
    description: 'Verify the dark mode implementation works correctly',
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
    projectId: 'golf',
    title: 'Practice session - driver speed',
    description: 'Work on ball speed with new technique',
    status: 'backlog',
    priority: 'normal',
    order: 1,
    links: [],
    tags: ['practice'],
    estimatedMinutes: 90,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const useHarperStore = create<HarperStore>()(
  persist(
    (set, get) => ({
      projects: DEFAULT_PROJECTS,
      tasks: DEFAULT_TASKS,
      goals: [],
      dailyFocus: {},
      weeklyPlans: {},
      selectedProjectId: null,
      view: 'board',
      searchQuery: '',
      quickCaptureOpen: false,

      // Project actions
      addProject: (name, description, lifeArea = 'business') => {
        const projects = get().projects;
        const newProject: Project = {
          id: generateId(),
          name,
          description,
          color: PROJECT_COLORS[projects.length % PROJECT_COLORS.length],
          order: projects.length,
          archived: false,
          lifeArea,
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
      addGoal: (title, lifeArea) => {
        const newGoal: Goal = {
          id: generateId(),
          title,
          lifeArea,
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

      getProjectsByLifeArea: (area) => {
        return get().projects.filter((p) => p.lifeArea === area);
      },
    }),
    {
      name: 'harper-os-storage',
    }
  )
);
