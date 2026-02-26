'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  getProjectById,
  updateProjectField,
  getProjectPhases,
  getProjectDecisions,
  addProjectDecision,
  getBusinesses,
} from '@/lib/phase2-db';
import { DbProject, DbProjectPhase, DbProjectDecision, DbBusiness } from '@/lib/supabase';
import { ArrowLeft, Plus, Calendar } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  live: { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  active: { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  building: { bg: 'bg-blue-500/15', text: 'text-blue-400' },
  blocked: { bg: 'bg-red-500/15', text: 'text-red-400' },
  paused: { bg: 'bg-slate-500/15', text: 'text-slate-400' },
  planned: { bg: 'bg-slate-500/15', text: 'text-slate-400' },
  waiting: { bg: 'bg-amber-500/15', text: 'text-amber-400' },
  done: { bg: 'bg-violet-500/15', text: 'text-violet-400' },
};

function InlineEditable({
  value,
  field,
  projectId,
  label,
  placeholder,
  large,
  onSave,
}: {
  value: string | null;
  field: string;
  projectId: string;
  label: string;
  placeholder: string;
  large?: boolean;
  onSave: (field: string, value: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value || '');

  useEffect(() => {
    setText(value || '');
  }, [value]);

  const handleSave = async () => {
    setEditing(false);
    if (text !== (value || '')) {
      onSave(field, text);
      await updateProjectField(projectId, field, text || null);
    }
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
        {label}
      </h3>
      {editing ? (
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setText(value || '');
              setEditing(false);
            }
          }}
          className={`w-full bg-[#0A0A0A] border border-amber-500/30 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 resize-none focus:outline-none focus:ring-1 focus:ring-amber-500/50 ${
            large ? 'min-h-[120px]' : 'min-h-[80px]'
          }`}
          placeholder={placeholder}
        />
      ) : (
        <div
          onClick={() => setEditing(true)}
          className={`px-4 py-3 bg-[#141414] border border-[#1e1e1e] rounded-lg cursor-text hover:border-[#2a2a2a] transition-colors ${
            large ? 'min-h-[80px]' : 'min-h-[60px]'
          }`}
        >
          {text ? (
            <p className="text-sm text-slate-200 whitespace-pre-wrap">{text}</p>
          ) : (
            <p className="text-sm text-slate-600 italic">{placeholder}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<DbProject | null>(null);
  const [phases, setPhases] = useState<DbProjectPhase[]>([]);
  const [decisions, setDecisions] = useState<DbProjectDecision[]>([]);
  const [businesses, setBusinesses] = useState<DbBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDecision, setShowAddDecision] = useState(false);
  const [newDecisionDate, setNewDecisionDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [newDecisionText, setNewDecisionText] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [proj, ph, dec, biz] = await Promise.all([
          getProjectById(id),
          getProjectPhases(id),
          getProjectDecisions(id),
          getBusinesses(),
        ]);
        setProject(proj);
        setPhases(ph);
        setDecisions(dec);
        setBusinesses(biz);
      } catch (e) {
        console.error('Failed to load project:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleFieldSave = useCallback(
    (field: string, value: string) => {
      if (!project) return;
      setProject((prev) =>
        prev
          ? {
              ...prev,
              [field]: value,
              updated_by: 'zach',
              updated_at: new Date().toISOString(),
            }
          : prev
      );
    },
    [project]
  );

  const handleAddDecision = async () => {
    if (!newDecisionText.trim()) return;
    await addProjectDecision(id, newDecisionDate, newDecisionText.trim());
    setDecisions((prev) => [
      {
        id: crypto.randomUUID(),
        project_id: id,
        decision_date: newDecisionDate,
        decision_text: newDecisionText.trim(),
        created_by: 'zach',
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);
    setNewDecisionText('');
    setShowAddDecision(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <div className="skeleton h-8 w-64" />
        <div className="skeleton h-32 w-full rounded-xl" />
        <div className="skeleton h-24 w-full rounded-lg" />
        <div className="skeleton h-24 w-full rounded-lg" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <p className="text-slate-400">Project not found</p>
        <Link href="/projects" className="text-amber-400 text-sm mt-2 inline-block hover:underline">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  const business = businesses.find((b) => b.id === project.business_id);
  const statusColors = STATUS_COLORS[project.status_label] || STATUS_COLORS.planned;

  const phaseIcon = (status: string) => {
    switch (status) {
      case 'complete':
      case 'completed':
        return '✅';
      case 'active':
      case 'in_progress':
        return '🔄';
      default:
        return '📋';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/projects"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold text-white">{project.name}</h1>
          {business && (
            <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-[#1e1e1e] text-slate-400">
              {business.icon} {business.name}
            </span>
          )}
          <span
            className={`px-2 py-0.5 text-[11px] font-semibold uppercase rounded ${statusColors.bg} ${statusColors.text}`}
          >
            {project.status_label}
          </span>
        </div>
        {project.last_discussed_at && (
          <p className="text-xs text-slate-500 mt-2">
            Last discussed{' '}
            {formatDistanceToNow(new Date(project.last_discussed_at), { addSuffix: true })}
          </p>
        )}
      </div>

      {/* Vision */}
      <InlineEditable
        value={project.vision}
        field="vision"
        projectId={project.id}
        label="Vision"
        placeholder="What's the long-term vision for this project?"
        onSave={handleFieldSave}
      />

      {/* Phases */}
      {phases.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Phases
          </h3>
          <div className="space-y-2">
            {phases.map((phase) => (
              <div
                key={phase.id}
                className="flex items-start gap-3 px-4 py-3 bg-[#141414] border border-[#1e1e1e] rounded-lg"
              >
                <span className="text-lg mt-0.5">{phaseIcon(phase.status)}</span>
                <div>
                  <div className="text-sm font-medium text-white">
                    Phase {phase.phase_number}: {phase.phase_name}
                  </div>
                  {phase.description && (
                    <p className="text-xs text-slate-400 mt-0.5">{phase.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What's Been Built */}
      <InlineEditable
        value={project.what_is_built}
        field="what_is_built"
        projectId={project.id}
        label="What's Been Built"
        placeholder="Describe what's been built so far..."
        onSave={handleFieldSave}
      />

      {/* What's Next - Most prominent */}
      <div className="border border-amber-500/20 rounded-xl p-1">
        <InlineEditable
          value={project.whats_next}
          field="whats_next"
          projectId={project.id}
          label="⭐ What's Next"
          placeholder="What should be built or done next?"
          large
          onSave={handleFieldSave}
        />
      </div>

      {/* Blockers */}
      <InlineEditable
        value={project.description}
        field="description"
        projectId={project.id}
        label="Blockers"
        placeholder="Any blockers or obstacles?"
        onSave={handleFieldSave}
      />

      {/* Decisions Log */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Decisions Log
          </h3>
          <button
            onClick={() => setShowAddDecision(true)}
            className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Decision
          </button>
        </div>

        {showAddDecision && (
          <div className="mb-4 p-4 bg-[#141414] border border-amber-500/20 rounded-lg space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              <input
                type="date"
                value={newDecisionDate}
                onChange={(e) => setNewDecisionDate(e.target.value)}
                className="bg-[#0A0A0A] border border-[#2a2a2a] rounded px-2 py-1 text-sm text-white"
              />
            </div>
            <textarea
              autoFocus
              value={newDecisionText}
              onChange={(e) => setNewDecisionText(e.target.value)}
              placeholder="What was decided?"
              className="w-full bg-[#0A0A0A] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 resize-none min-h-[60px] focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddDecision}
                className="px-3 py-1.5 text-xs font-medium bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowAddDecision(false);
                  setNewDecisionText('');
                }}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {decisions.length > 0 ? (
          <div className="space-y-2">
            {decisions.map((d) => (
              <div
                key={d.id}
                className="flex items-start gap-3 px-4 py-3 bg-[#141414] border border-[#1e1e1e] rounded-lg"
              >
                <span className="text-xs text-slate-500 shrink-0 mt-0.5">
                  {format(new Date(d.decision_date), 'MMM d')}
                </span>
                <p className="text-sm text-slate-200">{d.decision_text}</p>
              </div>
            ))}
          </div>
        ) : (
          !showAddDecision && (
            <div className="px-4 py-6 bg-[#141414] border border-[#1e1e1e] rounded-lg text-center">
              <p className="text-slate-500 text-sm">No decisions logged yet</p>
            </div>
          )
        )}
      </div>

      {/* Last Discussed */}
      {project.last_discussed_at && (
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Last Discussed
          </h3>
          <div className="px-4 py-3 bg-[#141414] border border-[#1e1e1e] rounded-lg">
            <p className="text-xs text-slate-500 mb-1">
              {format(new Date(project.last_discussed_at), 'MMMM d, yyyy')}
            </p>
            <p className="text-sm text-slate-300">
              {project.last_discussed_summary || 'No summary available'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
