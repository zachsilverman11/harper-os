import { supabase, DbProject, DbTask, DbProjectDecision, DbProjectPhase, DbWeeklyFocus, DbRecentDecision, DbBusiness } from './supabase';

// ============================================
// Business helpers
// ============================================

export async function getBusinesses(): Promise<DbBusiness[]> {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .order('order');
  if (error) throw error;
  return data || [];
}

// ============================================
// Projects
// ============================================

export async function getProjects(): Promise<DbProject[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('archived', false)
    .order('priority_rank', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getProjectById(id: string): Promise<DbProject | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

export async function updateProjectField(
  id: string,
  field: string,
  value: string | number | boolean | null
) {
  const { error } = await supabase
    .from('projects')
    .update({
      [field]: value,
      updated_by: 'zach',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (error) throw error;
}

export async function updateProjectPriorityRank(id: string, rank: number) {
  const { error } = await supabase
    .from('projects')
    .update({ priority_rank: rank })
    .eq('id', id);
  if (error) throw error;
}

// ============================================
// Project Phases
// ============================================

export async function getProjectPhases(projectId: string): Promise<DbProjectPhase[]> {
  const { data, error } = await supabase
    .from('project_phases')
    .select('*')
    .eq('project_id', projectId)
    .order('phase_number');
  if (error) throw error;
  return data || [];
}

// ============================================
// Project Decisions
// ============================================

export async function getProjectDecisions(projectId: string): Promise<DbProjectDecision[]> {
  const { data, error } = await supabase
    .from('project_decisions')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addProjectDecision(
  projectId: string,
  decisionDate: string,
  decisionText: string
) {
  const { error } = await supabase.from('project_decisions').insert({
    project_id: projectId,
    decision_date: decisionDate,
    decision_text: decisionText,
    created_by: 'zach',
  });
  if (error) throw error;
}

// ============================================
// Tasks
// ============================================

export async function getTasks(): Promise<DbTask[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('order');
  if (error) throw error;
  return data || [];
}

export async function getTasksByStatus(status: string): Promise<DbTask[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('status', status)
    .order('order');
  if (error) throw error;
  return data || [];
}

export async function updateTaskStatus(id: string, status: string) {
  const { error } = await supabase
    .from('tasks')
    .update({
      status,
      updated_at: new Date().toISOString(),
      completed_at: status === 'done' ? new Date().toISOString() : null,
    })
    .eq('id', id);
  if (error) throw error;
}

export async function createTask(task: {
  project_id: string;
  title: string;
  notes?: string;
  status?: string;
  assignee?: string;
  priority?: string;
}) {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      project_id: task.project_id,
      title: task.title,
      description: task.notes || null,
      notes: task.notes || null,
      status: task.status || 'todo',
      assignee: task.assignee || 'harper',
      priority: task.priority || 'normal',
      order: 999,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ============================================
// Weekly Focus
// ============================================

export async function getLatestWeeklyFocus(): Promise<DbWeeklyFocus | null> {
  const { data, error } = await supabase
    .from('weekly_focus')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// ============================================
// Recent Decisions (view)
// ============================================

export async function getRecentDecisions(): Promise<DbRecentDecision[]> {
  const { data, error } = await supabase
    .from('recent_decisions')
    .select('*')
    .limit(50);
  if (error) {
    // View might not exist yet — fallback to manual join
    const { data: fallback, error: fbError } = await supabase
      .from('project_decisions')
      .select('*, projects(name)')
      .order('created_at', { ascending: false })
      .limit(50);
    if (fbError) return [];
    return (fallback || []).map((d: Record<string, unknown>) => ({
      ...d,
      project_name: (d.projects as Record<string, unknown>)?.name || 'Unknown',
    })) as DbRecentDecision[];
  }
  return data || [];
}

// ============================================
// Memory Suggestions
// ============================================

export async function addMemorySuggestion(text: string) {
  const { error } = await supabase.from('memory_suggestions').insert({
    suggestion_text: text,
  });
  if (error) throw error;
}
