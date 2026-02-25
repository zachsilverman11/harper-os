'use client';

import { useEffect, useState } from 'react';
import { getRecentDecisions, addMemorySuggestion } from '@/lib/phase2-db';
import { DbRecentDecision } from '@/lib/supabase';
import { format } from 'date-fns';
import { Brain, Users, FileText, Send, CheckCircle } from 'lucide-react';

const KEY_PEOPLE = [
  { name: 'Cheri', role: 'GM', business: 'Inspired Swim', color: '#10b981' },
  { name: 'Greg', role: 'Sales', business: 'Inspired Mortgage', color: '#3b82f6' },
  { name: 'Amanda', role: 'Admin', business: 'Inspired Mortgage', color: '#3b82f6' },
  { name: 'Kelly', role: 'Underwriter', business: 'Inspired Mortgage', color: '#3b82f6' },
  { name: 'Jakub', role: 'Broker', business: 'Inspired Mortgage', color: '#3b82f6' },
  { name: 'Amber', role: 'Head Coach', business: 'Inspired Swim', color: '#10b981' },
];

const KEY_FACTS = [
  { label: 'Phone', value: '236-326-7946' },
  { label: 'Booking', value: 'nataflow.com/inspiredswim' },
  { label: 'Locations', value: '16' },
];

export default function MemoryPage() {
  const [decisions, setDecisions] = useState<DbRecentDecision[]>([]);
  const [loading, setLoading] = useState(true);
  const [suggestion, setSuggestion] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const d = await getRecentDecisions();
        setDecisions(d);
      } catch (e) {
        console.error('Failed to load decisions:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmitSuggestion = async () => {
    if (!suggestion.trim()) return;
    try {
      await addMemorySuggestion(suggestion.trim());
      setSuggestion('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (e) {
      console.error('Failed to submit suggestion:', e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">
      <div className="flex items-center gap-2">
        <Brain className="h-6 w-6 text-amber-400" />
        <h1 className="text-2xl font-bold text-white">Memory</h1>
      </div>

      {/* Recent Decisions */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Recent Decisions</h2>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-12 rounded-lg" />
            ))}
          </div>
        ) : decisions.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-[#1e1e1e]">
            <table className="w-full">
              <thead>
                <tr className="bg-[#111111]">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3 w-28">
                    Date
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">
                    Decision
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3 w-40">
                    Project
                  </th>
                </tr>
              </thead>
              <tbody>
                {decisions.map((d) => (
                  <tr key={d.id} className="border-t border-[#1e1e1e] hover:bg-[#141414]">
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {format(new Date(d.decision_date), 'MMM d')}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-200">{d.decision_text}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{d.project_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-4 py-8 bg-[#141414] border border-[#1e1e1e] rounded-xl text-center">
            <p className="text-slate-500 text-sm">No decisions logged yet</p>
          </div>
        )}
      </section>

      {/* Key People */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-4 w-4 text-amber-400" />
          <h2 className="text-lg font-semibold text-white">Key People</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {KEY_PEOPLE.map((person) => (
            <div
              key={person.name}
              className="px-4 py-3 bg-[#141414] border border-[#1e1e1e] rounded-lg"
            >
              <div className="text-sm font-medium text-white">{person.name}</div>
              <div className="text-xs text-slate-500">{person.role}</div>
              <div
                className="text-[10px] font-medium mt-1 inline-block px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: person.color + '20',
                  color: person.color,
                }}
              >
                {person.business}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Facts */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-amber-400" />
          <h2 className="text-lg font-semibold text-white">Key Facts</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {KEY_FACTS.map((fact) => (
            <div
              key={fact.label}
              className="px-4 py-3 bg-[#141414] border border-[#1e1e1e] rounded-lg"
            >
              <div className="text-xs text-slate-500 mb-1">{fact.label}</div>
              <div className="text-sm font-medium text-white">{fact.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Suggest a correction */}
      <section className="border-t border-[#1e1e1e] pt-8">
        <h3 className="text-sm font-semibold text-slate-400 mb-3">Suggest a correction</h3>
        <div className="flex gap-2">
          <textarea
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder="Something wrong or outdated? Let Harper know..."
            className="flex-1 bg-[#141414] border border-[#1e1e1e] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 resize-none min-h-[60px] focus:outline-none focus:ring-1 focus:ring-amber-500/50"
          />
          <button
            onClick={handleSubmitSuggestion}
            disabled={!suggestion.trim()}
            className="self-end px-4 py-2.5 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50"
          >
            {submitted ? <CheckCircle className="h-4 w-4" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
        {submitted && (
          <p className="text-xs text-emerald-400 mt-2">Suggestion submitted — Harper will review it!</p>
        )}
      </section>
    </div>
  );
}
