'use client';

import { Document, DOC_TYPE_CONFIG, DOC_STATUS_CONFIG, DocStatus } from '@/lib/types';
import { useHarperStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar, User, ArrowRight, X } from 'lucide-react';
import { format } from 'date-fns';

interface DocumentViewerProps {
  document: Document | null;
  open: boolean;
  onClose: () => void;
}

// Simple markdown-to-HTML renderer (no external deps)
function renderMarkdown(text: string): string {
  let html = text;

  // Code blocks (``` ... ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, _lang, code) => {
    return `<pre class="bg-slate-950 border border-slate-700 rounded-lg p-4 my-3 overflow-x-auto"><code class="text-sm text-slate-300">${escapeHtml(code.trim())}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-800 px-1.5 py-0.5 rounded text-sm text-slate-300">$1</code>');

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-slate-100 mt-6 mb-2">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold text-slate-100 mt-8 mb-3">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-slate-100 mt-8 mb-4">$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-200">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">$1</a>');

  // Unordered lists
  html = html.replace(/^[-*] (.+)$/gm, '<li class="ml-4 text-slate-300 list-disc">$1</li>');

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 text-slate-300 list-decimal">$1</li>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="border-slate-700 my-6" />');

  // Paragraphs (lines that aren't already wrapped in HTML tags)
  html = html.replace(/^(?!<[a-z])((?!^\s*$).+)$/gm, (match) => {
    if (match.startsWith('<')) return match;
    return `<p class="text-slate-300 leading-relaxed mb-3">${match}</p>`;
  });

  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const STATUS_FLOW: DocStatus[] = ['draft', 'published', 'reviewed', 'archived'];

export function DocumentViewer({ document, open, onClose }: DocumentViewerProps) {
  const { updateDocument, projects, businesses } = useHarperStore();
  
  if (!document) return null;
  
  const project = document.projectId ? projects.find(p => p.id === document.projectId) : null;
  const business = businesses.find(b => b.id === document.businessId);
  const typeConfig = DOC_TYPE_CONFIG[document.docType];
  const statusConfig = DOC_STATUS_CONFIG[document.status];
  
  const currentStatusIndex = STATUS_FLOW.indexOf(document.status);
  const nextStatus = currentStatusIndex < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentStatusIndex + 1] : null;
  const nextStatusConfig = nextStatus ? DOC_STATUS_CONFIG[nextStatus] : null;

  const handleStatusChange = (newStatus: DocStatus) => {
    const updates: Partial<Document> = { status: newStatus };
    if (newStatus === 'published') {
      updates.publishedAt = new Date();
    } else if (newStatus === 'reviewed') {
      updates.reviewedAt = new Date();
    }
    updateDocument(document.id, updates);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-3xl max-h-[85vh] overflow-hidden flex flex-col" showCloseButton={false}>
        {/* Header */}
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-xl font-bold text-slate-100 mb-2">
                {document.title}
              </DialogTitle>
              {/* Metadata bar */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${typeConfig.bgColor} ${typeConfig.color}`}>
                  {typeConfig.icon} {typeConfig.label}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusConfig.bgColor} ${statusConfig.color}`}>
                  {statusConfig.icon} {statusConfig.label}
                </span>
                {business && (
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    {business.icon} {business.name}
                  </span>
                )}
                {project && (
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: project.color }} />
                    {project.name}
                  </span>
                )}
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {document.author}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(document.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0 py-4 border-t border-slate-800 mt-3">
          {document.content ? (
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(document.content) }}
            />
          ) : (
            <p className="text-slate-500 italic">No content yet.</p>
          )}
        </div>

        {/* Footer with status actions */}
        <div className="flex-shrink-0 flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {document.publishedAt && (
              <span>Published {format(new Date(document.publishedAt), 'MMM d, yyyy')}</span>
            )}
            {document.reviewedAt && (
              <span>• Reviewed {format(new Date(document.reviewedAt), 'MMM d, yyyy')}</span>
            )}
            {!document.publishedAt && !document.reviewedAt && (
              <span>Updated {format(new Date(document.updatedAt), 'MMM d, yyyy')}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {nextStatus && nextStatusConfig && (
              <Button
                size="sm"
                onClick={() => handleStatusChange(nextStatus)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <span className="mr-1">{nextStatusConfig.icon}</span>
                Mark as {nextStatusConfig.label}
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
