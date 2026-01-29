'use client';

import { Document, DOC_TYPE_CONFIG, DOC_STATUS_CONFIG } from '@/lib/types';
import { useHarperStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

interface DocumentCardProps {
  document: Document;
  onClick: () => void;
}

export function DocumentCard({ document, onClick }: DocumentCardProps) {
  const { projects, businesses } = useHarperStore();
  
  const project = document.projectId ? projects.find(p => p.id === document.projectId) : null;
  const business = businesses.find(b => b.id === document.businessId);
  const typeConfig = DOC_TYPE_CONFIG[document.docType];
  const statusConfig = DOC_STATUS_CONFIG[document.status];

  return (
    <div
      onClick={onClick}
      className="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-slate-700 hover:bg-slate-900/80 cursor-pointer transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg flex-shrink-0">{typeConfig.icon}</span>
          <h3 className="font-medium text-slate-100 truncate group-hover:text-white transition-colors">
            {document.title}
          </h3>
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${typeConfig.bgColor} ${typeConfig.color}`}>
          {typeConfig.label}
        </span>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusConfig.bgColor} ${statusConfig.color}`}>
          {statusConfig.label}
        </span>
      </div>

      {/* Summary */}
      {document.summary && (
        <p className="text-sm text-slate-400 mb-3 line-clamp-2">
          {document.summary}
        </p>
      )}

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
        {business && (
          <span className="flex items-center gap-1">
            <span>{business.icon}</span>
            {business.name}
          </span>
        )}
        {project && (
          <span className="flex items-center gap-1">
            <div
              className="h-2 w-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: project.color }}
            />
            {project.name}
          </span>
        )}
        <span className="flex items-center gap-1">
          <User className="h-3 w-3" />
          {document.author}
        </span>
        <span className="flex items-center gap-1 ml-auto">
          <Calendar className="h-3 w-3" />
          {format(new Date(document.updatedAt), 'MMM d, yyyy')}
        </span>
      </div>
    </div>
  );
}
