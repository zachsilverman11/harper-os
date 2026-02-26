'use client';

import { CheckCircle, Inbox } from 'lucide-react';

export default function ApprovalsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-8">
        <CheckCircle className="h-6 w-6 text-amber-400" />
        <h1 className="text-2xl font-bold text-white">Approvals</h1>
      </div>

      <div className="flex flex-col items-center justify-center py-20 bg-[#141414] border border-[#1e1e1e] rounded-xl">
        <div className="h-16 w-16 rounded-full bg-[#1e1e1e] flex items-center justify-center mb-4">
          <Inbox className="h-8 w-8 text-slate-600" />
        </div>
        <h2 className="text-lg font-medium text-slate-300 mb-2">Content approval queue coming soon.</h2>
        <p className="text-sm text-slate-500 max-w-md text-center">
          This is where you&apos;ll review and approve content, social posts, and other materials
          before they go live.
        </p>
      </div>
    </div>
  );
}
