'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Business, Project, Task, TaskStatus, Priority, Goal, DailyFocus, WeeklyPlan,
  PROJECT_COLORS, BoardViewMode, Document, DocType, DocStatus
} from './types';
import { db } from './db';
import { format, parseISO } from 'date-fns';

interface HarperStore {
  // Data
  businesses: Business[];
  projects: Project[];
  tasks: Task[];
  goals: Goal[];
  documents: Document[];
  dailyFocus: Record<string, DailyFocus>;
  weeklyPlans: Record<string, WeeklyPlan>;
  
  // Loading/sync state
  isLoading: boolean;
  isInitialized: boolean;
  lastSyncError: string | null;
  
  // UI State
  selectedProjectId: string | null;
  selectedBusinessId: string | null;
  view: 'dashboard' | 'board' | 'today' | 'goals' | 'weekly' | 'documents';
  boardViewMode: BoardViewMode;
  searchQuery: string;
  quickCaptureOpen: boolean;
  
  // Initialize from Supabase
  initialize: () => Promise<void>;
  
  // Business actions
  getBusinessById: (id: string) => Business | undefined;
  getProjectsByBusiness: (businessId: string) => Project[];
  addBusiness: (name: string, icon: string, color?: string) => Promise<void>;
  updateBusiness: (id: string, updates: Partial<Business>) => Promise<void>;
  deleteBusiness: (id: string) => Promise<void>;
  
  // Project actions
  addProject: (businessId: string, name: string, description?: string, color?: string) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setSelectedProject: (id: string | null) => void;
  setSelectedBusiness: (id: string | null) => void;
  
  // Task actions
  addTask: (projectId: string, title: string, status?: TaskStatus) => Promise<string>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (taskId: string, newStatus: TaskStatus, newOrder: number) => Promise<void>;
  duplicateTask: (taskId: string) => Promise<void>;
  
  // Goal actions
  addGoal: (businessId: string, title: string) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  
  // Document actions
  addDocument: (doc: {
    businessId: string;
    title: string;
    content?: string;
    docType?: DocType;
    status?: DocStatus;
    author?: string;
    summary?: string;
    tags?: string[];
    projectId?: string;
  }) => Promise<void>;
  updateDocument: (id: string, updates: Partial<Document>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  getDocumentsByProject: (projectId: string) => Document[];
  getDocumentsByBusiness: (businessId: string) => Document[];
  getDocumentById: (id: string) => Document | undefined;
  
  // Daily Focus actions
  getDailyFocus: (date: string) => DailyFocus | undefined;
  setDailyFocus: (date: string, focus: Partial<DailyFocus>) => Promise<void>;
  addToDailyPriorities: (date: string, taskId: string) => Promise<void>;
  removeFromDailyPriorities: (date: string, taskId: string) => Promise<void>;
  
  // Weekly Plan actions
  getWeeklyPlan: (weekStart: string) => WeeklyPlan | undefined;
  setWeeklyPlan: (weekStart: string, plan: Partial<WeeklyPlan>) => void;
  
  // UI actions
  setView: (view: 'dashboard' | 'board' | 'today' | 'goals' | 'weekly' | 'documents') => void;
  setBoardViewMode: (mode: BoardViewMode) => void;
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

export const useHarperStore = create<HarperStore>()(
  persist(
    (set, get) => ({
      businesses: [],
      projects: [],
      tasks: [],
      goals: [],
      documents: [],
      dailyFocus: {},
      weeklyPlans: {},
      isLoading: false,
      isInitialized: false,
      lastSyncError: null,
      selectedProjectId: null,
      selectedBusinessId: null,
      view: 'dashboard',
      boardViewMode: 'list',
      searchQuery: '',
      quickCaptureOpen: false,

      // Initialize from Supabase
      initialize: async () => {
        if (get().isInitialized) return;
        
        set({ isLoading: true, lastSyncError: null });
        try {
          const [businesses, projects, tasks, goals, documents] = await Promise.all([
            db.getBusinesses(),
            db.getProjects(),
            db.getTasks(),
            db.getGoals(),
            db.getDocuments(),
          ]);
          
          set({ 
            businesses, 
            projects, 
            tasks, 
            goals,
            documents,
            isLoading: false, 
            isInitialized: true 
          });
        } catch (error) {
          console.error('Failed to initialize from Supabase:', error);
          set({ 
            isLoading: false, 
            lastSyncError: error instanceof Error ? error.message : 'Unknown error',
            isInitialized: true // Still mark as initialized to use cached data
          });
        }
      },

      // Business actions
      getBusinessById: (id) => get().businesses.find((b) => b.id === id),
      
      getProjectsByBusiness: (businessId) => {
        return get().projects
          .filter((p) => p.businessId === businessId && !p.archived)
          .sort((a, b) => a.order - b.order);
      },
      
      addBusiness: async (name, icon, color) => {
        try {
          const newBusiness = await db.createBusiness(name, icon, color);
          set({ businesses: [...get().businesses, newBusiness] });
        } catch (error) {
          console.error('Failed to create business:', error);
          set({ lastSyncError: error instanceof Error ? error.message : 'Failed to create business' });
        }
      },
      
      updateBusiness: async (id, updates) => {
        // Optimistic update
        set({
          businesses: get().businesses.map((b) =>
            b.id === id ? { ...b, ...updates } : b
          ),
        });
        
        try {
          await db.updateBusiness(id, updates);
        } catch (error) {
          console.error('Failed to update business:', error);
        }
      },
      
      deleteBusiness: async (id) => {
        // Optimistic update - remove business and all related projects/tasks
        const projectIds = get().projects.filter(p => p.businessId === id).map(p => p.id);
        set({
          businesses: get().businesses.filter((b) => b.id !== id),
          projects: get().projects.filter((p) => p.businessId !== id),
          tasks: get().tasks.filter((t) => !projectIds.includes(t.projectId)),
          goals: get().goals.filter((g) => g.businessId !== id),
        });
        
        try {
          await db.deleteBusiness(id);
        } catch (error) {
          console.error('Failed to delete business:', error);
        }
      },

      // Project actions
      addProject: async (businessId, name, description, color) => {
        try {
          const newProject = await db.createProject(businessId, name, description, color);
          set({ projects: [...get().projects, newProject] });
        } catch (error) {
          console.error('Failed to create project:', error);
          set({ lastSyncError: error instanceof Error ? error.message : 'Failed to create project' });
        }
      },

      updateProject: async (id, updates) => {
        // Optimistic update
        set({
          projects: get().projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
          ),
        });
        
        try {
          await db.updateProject(id, updates);
        } catch (error) {
          console.error('Failed to update project:', error);
          // Could revert here if needed
        }
      },

      deleteProject: async (id) => {
        // Optimistic update
        set({
          projects: get().projects.filter((p) => p.id !== id),
          tasks: get().tasks.filter((t) => t.projectId !== id),
        });
        
        try {
          await db.deleteProject(id);
        } catch (error) {
          console.error('Failed to delete project:', error);
        }
      },

      setSelectedProject: (id) => set({ selectedProjectId: id }),
      setSelectedBusiness: (id) => set({ selectedBusinessId: id }),

      // Task actions
      addTask: async (projectId, title, status = 'todo') => {
        const tempId = generateId();
        const tempTask: Task = {
          id: tempId,
          projectId,
          title,
          status,
          priority: 'normal',
          order: get().tasks.filter(t => t.status === status).length,
          links: [],
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        // Optimistic update
        set({ tasks: [...get().tasks, tempTask] });
        
        try {
          const newTask = await db.createTask(projectId, title, status);
          // Replace temp task with real one
          set({
            tasks: get().tasks.map(t => t.id === tempId ? newTask : t)
          });
          return newTask.id;
        } catch (error) {
          console.error('Failed to create task:', error);
          // Remove temp task on failure
          set({ tasks: get().tasks.filter(t => t.id !== tempId) });
          return tempId;
        }
      },

      updateTask: async (id, updates) => {
        // Optimistic update
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
        
        try {
          await db.updateTask(id, updates);
        } catch (error) {
          console.error('Failed to update task:', error);
        }
      },

      deleteTask: async (id) => {
        // Optimistic update
        set({ tasks: get().tasks.filter((t) => t.id !== id) });
        
        try {
          await db.deleteTask(id);
        } catch (error) {
          console.error('Failed to delete task:', error);
        }
      },

      moveTask: async (taskId, newStatus, newOrder) => {
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
        
        // Optimistic update
        set({
          tasks: [
            ...otherTasks.filter((t) => t.status !== newStatus),
            ...reorderedTarget,
          ],
        });
        
        try {
          await db.moveTask(taskId, newStatus, newOrder);
        } catch (error) {
          console.error('Failed to move task:', error);
        }
      },

      duplicateTask: async (taskId) => {
        const task = get().tasks.find((t) => t.id === taskId);
        if (!task) return;
        
        await get().addTask(task.projectId, `${task.title} (copy)`, 'todo');
      },

      // Goal actions
      addGoal: async (businessId, title) => {
        try {
          const newGoal = await db.createGoal(businessId, title);
          set({ goals: [...get().goals, newGoal] });
        } catch (error) {
          console.error('Failed to create goal:', error);
        }
      },

      updateGoal: async (id, updates) => {
        set({
          goals: get().goals.map((g) =>
            g.id === id ? { ...g, ...updates, updatedAt: new Date() } : g
          ),
        });
        
        try {
          await db.updateGoal(id, updates);
        } catch (error) {
          console.error('Failed to update goal:', error);
        }
      },

      deleteGoal: async (id) => {
        set({ goals: get().goals.filter((g) => g.id !== id) });
        
        try {
          await db.deleteGoal(id);
        } catch (error) {
          console.error('Failed to delete goal:', error);
        }
      },

      // Document actions
      addDocument: async (doc) => {
        try {
          const newDoc = await db.createDocument(doc);
          set({ documents: [newDoc, ...get().documents] });
        } catch (error) {
          console.error('Failed to create document:', error);
        }
      },

      updateDocument: async (id, updates) => {
        // Optimistic update
        set({
          documents: get().documents.map((d) =>
            d.id === id ? { ...d, ...updates, updatedAt: new Date() } : d
          ),
        });
        
        try {
          await db.updateDocument(id, updates);
        } catch (error) {
          console.error('Failed to update document:', error);
        }
      },

      deleteDocument: async (id) => {
        set({ documents: get().documents.filter((d) => d.id !== id) });
        
        try {
          await db.deleteDocument(id);
        } catch (error) {
          console.error('Failed to delete document:', error);
        }
      },

      getDocumentsByProject: (projectId) => {
        return get().documents.filter((d) => d.projectId === projectId);
      },

      getDocumentsByBusiness: (businessId) => {
        return get().documents.filter((d) => d.businessId === businessId);
      },

      getDocumentById: (id) => get().documents.find((d) => d.id === id),

      // Daily Focus
      getDailyFocus: (date) => get().dailyFocus[date],
      
      setDailyFocus: async (date, focus) => {
        const existing = get().dailyFocus[date];
        const updated: DailyFocus = {
          id: existing?.id || generateId(),
          date,
          priorities: focus.priorities ?? existing?.priorities ?? [],
          wins: focus.wins ?? existing?.wins ?? [],
          challenges: focus.challenges ?? existing?.challenges ?? [],
          notes: focus.notes ?? existing?.notes,
          energyLevel: focus.energyLevel ?? existing?.energyLevel,
          createdAt: existing?.createdAt || new Date(),
          updatedAt: new Date(),
        };
        
        set({
          dailyFocus: {
            ...get().dailyFocus,
            [date]: updated,
          },
        });
        
        try {
          await db.upsertDailyFocus(date, updated);
        } catch (error) {
          console.error('Failed to update daily focus:', error);
        }
      },

      addToDailyPriorities: async (date, taskId) => {
        const focus = get().dailyFocus[date];
        if (focus?.priorities.includes(taskId)) return;
        await get().setDailyFocus(date, {
          priorities: [...(focus?.priorities || []), taskId],
        });
      },

      removeFromDailyPriorities: async (date, taskId) => {
        const focus = get().dailyFocus[date];
        if (!focus) return;
        await get().setDailyFocus(date, {
          priorities: focus.priorities.filter((id) => id !== taskId),
        });
      },

      // Weekly Plan (keeping local for now)
      getWeeklyPlan: (weekStart) => get().weeklyPlans[weekStart],
      
      setWeeklyPlan: (weekStart, plan) => {
        const existing = get().weeklyPlans[weekStart];
        set({
          weeklyPlans: {
            ...get().weeklyPlans,
            [weekStart]: {
              id: existing?.id || generateId(),
              weekStart,
              goals: plan.goals ?? existing?.goals ?? [],
              theme: plan.theme ?? existing?.theme,
              notes: plan.notes ?? existing?.notes,
              createdAt: existing?.createdAt || new Date(),
              updatedAt: new Date(),
            },
          },
        });
      },

      // UI actions
      setView: (view) => set({ view }),
      setBoardViewMode: (boardViewMode) => set({ boardViewMode }),
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
          (t) => t.status === 'doing' || t.dueDate === today
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
      partialize: (state) => ({
        // Only persist UI state and cache data locally
        selectedProjectId: state.selectedProjectId,
        selectedBusinessId: state.selectedBusinessId,
        view: state.view,
        boardViewMode: state.boardViewMode,
        dailyFocus: state.dailyFocus,
        weeklyPlans: state.weeklyPlans,
        // Cache Supabase data for offline/fast load
        businesses: state.businesses,
        projects: state.projects,
        tasks: state.tasks,
        goals: state.goals,
        documents: state.documents,
      }),
    }
  )
);
