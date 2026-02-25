import { supabase, DbBusiness, DbProject, DbTask, DbTaskLink, DbGoal, DbMilestone, DbDailyFocus, DbDocument } from './supabase';
import { Business, Project, ProjectStatusLabel, Task, TaskStatus, Priority, Goal, DailyFocus, TaskLink, Document, DocType, DocStatus } from './types';

// ===========================================
// TRANSFORM HELPERS (DB <-> App)
// ===========================================

function dbToBusiness(db: DbBusiness): Business {
  return {
    id: db.id,
    name: db.name,
    icon: db.icon,
    color: db.color,
    order: db.order,
    type: db.type,
  };
}

function dbToProject(db: DbProject): Project {
  return {
    id: db.id,
    businessId: db.business_id,
    name: db.name,
    description: db.description || undefined,
    color: db.color,
    order: db.order,
    archived: db.archived,
    currentPhase: db.current_phase ?? 1,
    totalPhases: db.total_phases ?? 1,
    phaseName: db.phase_name || undefined,
    statusLabel: (db.status_label as ProjectStatusLabel) || 'active',
    createdAt: new Date(db.created_at),
    updatedAt: new Date(db.updated_at),
  };
}

function dbToTask(db: DbTask, links: DbTaskLink[] = []): Task {
  return {
    id: db.id,
    projectId: db.project_id,
    parentTaskId: db.parent_task_id || undefined,
    title: db.title,
    description: db.description || undefined,
    status: db.status as TaskStatus,
    priority: db.priority as Priority,
    dueDate: db.due_date || undefined,
    dueTime: db.due_time || undefined,
    order: db.order,
    notes: db.notes || undefined,
    tags: db.tags || [],
    assignee: db.assignee || undefined,
    estimatedMinutes: db.estimated_minutes || undefined,
    actualMinutes: db.actual_minutes || undefined,
    harperAction: db.harper_action,
    links: links.map(l => ({ type: l.type, url: l.url, label: l.label })),
    createdAt: new Date(db.created_at),
    updatedAt: new Date(db.updated_at),
    completedAt: db.completed_at ? new Date(db.completed_at) : undefined,
  };
}

function dbToGoal(db: DbGoal, milestones: DbMilestone[] = []): Goal {
  return {
    id: db.id,
    businessId: db.business_id,
    title: db.title,
    description: db.description || undefined,
    targetDate: db.target_date || undefined,
    progress: db.progress,
    milestones: milestones.map(m => ({
      id: m.id,
      title: m.title,
      completed: m.completed,
      completedAt: m.completed_at ? new Date(m.completed_at) : undefined,
    })),
    createdAt: new Date(db.created_at),
    updatedAt: new Date(db.updated_at),
  };
}

function dbToDailyFocus(db: DbDailyFocus): DailyFocus {
  return {
    id: db.id,
    date: db.date,
    priorities: db.priorities || [],
    wins: db.wins || [],
    challenges: db.challenges || [],
    notes: db.notes || undefined,
    energyLevel: db.energy_level || undefined,
    createdAt: new Date(db.created_at),
    updatedAt: new Date(db.updated_at),
  };
}

function dbToDocument(db: DbDocument): Document {
  return {
    id: db.id,
    projectId: db.project_id || undefined,
    businessId: db.business_id,
    title: db.title,
    content: db.content,
    docType: db.doc_type as DocType,
    status: db.status as DocStatus,
    author: db.author,
    summary: db.summary || undefined,
    tags: db.tags || [],
    createdAt: new Date(db.created_at),
    updatedAt: new Date(db.updated_at),
    publishedAt: db.published_at ? new Date(db.published_at) : undefined,
    reviewedAt: db.reviewed_at ? new Date(db.reviewed_at) : undefined,
  };
}

// ===========================================
// DATABASE OPERATIONS
// ===========================================

export const db = {
  // ---------- BUSINESSES ----------
  async getBusinesses(): Promise<Business[]> {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .order('order');
    if (error) throw error;
    return (data || []).map(dbToBusiness);
  },

  async createBusiness(name: string, icon: string, color?: string): Promise<Business> {
    // Get max order
    const { data: existing } = await supabase
      .from('businesses')
      .select('order')
      .order('order', { ascending: false })
      .limit(1);
    
    const nextOrder = existing && existing.length > 0 ? existing[0].order + 1 : 0;
    
    const { data, error } = await supabase
      .from('businesses')
      .insert({
        name,
        icon,
        color: color || '#3b82f6',
        order: nextOrder,
        type: 'other',
      })
      .select()
      .single();
    if (error) throw error;
    return dbToBusiness(data);
  },

  async updateBusiness(id: string, updates: Partial<Business>): Promise<void> {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.icon !== undefined) dbUpdates.icon = updates.icon;
    if (updates.color !== undefined) dbUpdates.color = updates.color;
    if (updates.order !== undefined) dbUpdates.order = updates.order;
    
    const { error } = await supabase
      .from('businesses')
      .update(dbUpdates)
      .eq('id', id);
    if (error) throw error;
  },

  async deleteBusiness(id: string): Promise<void> {
    // This will cascade delete projects and tasks due to FK constraints
    const { error } = await supabase
      .from('businesses')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // ---------- PROJECTS ----------
  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('order');
    if (error) throw error;
    return (data || []).map(dbToProject);
  },

  async createProject(businessId: string, name: string, description?: string, color?: string): Promise<Project> {
    // Get max order for this business
    const { data: existing } = await supabase
      .from('projects')
      .select('order')
      .eq('business_id', businessId)
      .order('order', { ascending: false })
      .limit(1);
    
    const nextOrder = existing && existing.length > 0 ? existing[0].order + 1 : 0;
    
    const { data, error } = await supabase
      .from('projects')
      .insert({
        business_id: businessId,
        name,
        description: description || null,
        color: color || '#3b82f6',
        order: nextOrder,
      })
      .select()
      .single();
    if (error) throw error;
    return dbToProject(data);
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description || null;
    if (updates.color !== undefined) dbUpdates.color = updates.color;
    if (updates.order !== undefined) dbUpdates.order = updates.order;
    if (updates.archived !== undefined) dbUpdates.archived = updates.archived;
    if (updates.currentPhase !== undefined) dbUpdates.current_phase = updates.currentPhase;
    if (updates.totalPhases !== undefined) dbUpdates.total_phases = updates.totalPhases;
    if (updates.phaseName !== undefined) dbUpdates.phase_name = updates.phaseName || null;
    if (updates.statusLabel !== undefined) dbUpdates.status_label = updates.statusLabel;
    
    const { error } = await supabase
      .from('projects')
      .update(dbUpdates)
      .eq('id', id);
    if (error) throw error;
  },

  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // ---------- TASKS ----------
  async getTasks(): Promise<Task[]> {
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .order('order');
    if (tasksError) throw tasksError;

    const { data: links, error: linksError } = await supabase
      .from('task_links')
      .select('*');
    if (linksError) throw linksError;

    const linksByTask = (links || []).reduce((acc, link) => {
      if (!acc[link.task_id]) acc[link.task_id] = [];
      acc[link.task_id].push(link);
      return acc;
    }, {} as Record<string, DbTaskLink[]>);

    return (tasks || []).map(t => dbToTask(t, linksByTask[t.id] || []));
  },

  async createTask(projectId: string, title: string, status: TaskStatus = 'todo'): Promise<Task> {
    // Get max order for this status
    const { data: existing } = await supabase
      .from('tasks')
      .select('order')
      .eq('status', status)
      .order('order', { ascending: false })
      .limit(1);
    
    const nextOrder = existing && existing.length > 0 ? existing[0].order + 1 : 0;

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        project_id: projectId,
        title,
        status,
        order: nextOrder,
      })
      .select()
      .single();
    if (error) throw error;
    return dbToTask(data);
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description || null;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
    if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate || null;
    if (updates.dueTime !== undefined) dbUpdates.due_time = updates.dueTime || null;
    if (updates.order !== undefined) dbUpdates.order = updates.order;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes || null;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
    if (updates.assignee !== undefined) dbUpdates.assignee = updates.assignee || null;
    if (updates.estimatedMinutes !== undefined) dbUpdates.estimated_minutes = updates.estimatedMinutes || null;
    if (updates.actualMinutes !== undefined) dbUpdates.actual_minutes = updates.actualMinutes || null;
    if (updates.harperAction !== undefined) dbUpdates.harper_action = updates.harperAction;
    if (updates.completedAt !== undefined) dbUpdates.completed_at = updates.completedAt?.toISOString() || null;
    if (updates.projectId !== undefined) dbUpdates.project_id = updates.projectId;

    const { error } = await supabase
      .from('tasks')
      .update(dbUpdates)
      .eq('id', id);
    if (error) throw error;
  },

  async deleteTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async moveTask(taskId: string, newStatus: TaskStatus, newOrder: number): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus, order: newOrder })
      .eq('id', taskId);
    if (error) throw error;
  },

  // ---------- GOALS ----------
  async getGoals(): Promise<Goal[]> {
    const { data: goals, error: goalsError } = await supabase
      .from('goals')
      .select('*')
      .order('created_at');
    if (goalsError) throw goalsError;

    const { data: milestones, error: milestonesError } = await supabase
      .from('milestones')
      .select('*')
      .order('order');
    if (milestonesError) throw milestonesError;

    const milestonesByGoal = (milestones || []).reduce((acc, m) => {
      if (!acc[m.goal_id]) acc[m.goal_id] = [];
      acc[m.goal_id].push(m);
      return acc;
    }, {} as Record<string, DbMilestone[]>);

    return (goals || []).map(g => dbToGoal(g, milestonesByGoal[g.id] || []));
  },

  async createGoal(businessId: string, title: string): Promise<Goal> {
    const { data, error } = await supabase
      .from('goals')
      .insert({ business_id: businessId, title })
      .select()
      .single();
    if (error) throw error;
    return dbToGoal(data);
  },

  async updateGoal(id: string, updates: Partial<Goal>): Promise<void> {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description || null;
    if (updates.targetDate !== undefined) dbUpdates.target_date = updates.targetDate || null;
    if (updates.progress !== undefined) dbUpdates.progress = updates.progress;

    const { error } = await supabase
      .from('goals')
      .update(dbUpdates)
      .eq('id', id);
    if (error) throw error;
  },

  async deleteGoal(id: string): Promise<void> {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // ---------- DAILY FOCUS ----------
  async getDailyFocus(date: string): Promise<DailyFocus | null> {
    const { data, error } = await supabase
      .from('daily_focus')
      .select('*')
      .eq('date', date)
      .single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data ? dbToDailyFocus(data) : null;
  },

  async upsertDailyFocus(date: string, focus: Partial<DailyFocus>): Promise<void> {
    const dbUpdates: Record<string, unknown> = { date };
    if (focus.priorities !== undefined) dbUpdates.priorities = focus.priorities;
    if (focus.wins !== undefined) dbUpdates.wins = focus.wins;
    if (focus.challenges !== undefined) dbUpdates.challenges = focus.challenges;
    if (focus.notes !== undefined) dbUpdates.notes = focus.notes || null;
    if (focus.energyLevel !== undefined) dbUpdates.energy_level = focus.energyLevel || null;

    const { error } = await supabase
      .from('daily_focus')
      .upsert(dbUpdates, { onConflict: 'date' });
    if (error) throw error;
  },

  // ---------- DOCUMENTS ----------
  async getDocuments(): Promise<Document[]> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(dbToDocument);
  },

  async getDocumentsByProject(projectId: string): Promise<Document[]> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('project_id', projectId)
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(dbToDocument);
  },

  async getDocumentsByBusiness(businessId: string): Promise<Document[]> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('business_id', businessId)
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(dbToDocument);
  },

  async createDocument(doc: {
    businessId: string;
    title: string;
    content?: string;
    docType?: DocType;
    status?: DocStatus;
    author?: string;
    summary?: string;
    tags?: string[];
    projectId?: string;
  }): Promise<Document> {
    const { data, error } = await supabase
      .from('documents')
      .insert({
        business_id: doc.businessId,
        title: doc.title,
        content: doc.content || '',
        doc_type: doc.docType || 'report',
        status: doc.status || 'draft',
        author: doc.author || 'harper',
        summary: doc.summary || null,
        tags: doc.tags || [],
        project_id: doc.projectId || null,
      })
      .select()
      .single();
    if (error) throw error;
    return dbToDocument(data);
  },

  async updateDocument(id: string, updates: Partial<Document>): Promise<void> {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.content !== undefined) dbUpdates.content = updates.content;
    if (updates.docType !== undefined) dbUpdates.doc_type = updates.docType;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.author !== undefined) dbUpdates.author = updates.author;
    if (updates.summary !== undefined) dbUpdates.summary = updates.summary || null;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
    if (updates.projectId !== undefined) dbUpdates.project_id = updates.projectId || null;
    if (updates.publishedAt !== undefined) dbUpdates.published_at = updates.publishedAt?.toISOString() || null;
    if (updates.reviewedAt !== undefined) dbUpdates.reviewed_at = updates.reviewedAt?.toISOString() || null;
    dbUpdates.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('documents')
      .update(dbUpdates)
      .eq('id', id);
    if (error) throw error;
  },

  async deleteDocument(id: string): Promise<void> {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};
