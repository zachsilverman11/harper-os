'use client';

import { Landmark, Lock } from 'lucide-react';

export default function CouncilPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Landmark className="h-6 w-6 text-slate-600" />
        <h1 className="text-2xl font-bold text-slate-400">Council</h1>
        <Lock className="h-4 w-4 text-slate-600" />
      </div>

      <div className="flex flex-col items-center justify-center py-20 bg-[#141414] border border-[#1e1e1e] rounded-xl">
        <div className="h-16 w-16 rounded-full bg-[#1e1e1e] flex items-center justify-center mb-4">
          <Landmark className="h-8 w-8 text-slate-600" />
        </div>
        <h2 className="text-lg font-medium text-slate-300 mb-2">Coming Soon</h2>
        <p className="text-sm text-slate-500 max-w-md text-center">
          The Council will be your advisory board — AI agents collaborating on strategy,
          planning, and decisions. This feature is being designed.
        </p>
      </div>
    </div>
  );
}
