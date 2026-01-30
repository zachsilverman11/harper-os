'use client';

import { useState, useMemo } from 'react';
import { FileText, Filter, SortAsc, SortDesc, Clock } from 'lucide-react';
import { useHarperStore } from '@/lib/store';
import { Document, DocType, DocStatus, DOC_TYPE_CONFIG, DOC_STATUS_CONFIG } from '@/lib/types';
import { DocumentCard } from './DocumentCard';
import { DocumentViewer } from './DocumentViewer';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SortOption = 'newest' | 'oldest' | 'updated';

export function DocumentsView() {
  const { documents, businesses, projects } = useHarperStore();
  
  const [filterBusiness, setFilterBusiness] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sort, setSort] = useState<SortOption>('newest');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const filteredDocs = useMemo(() => {
    let docs = [...documents];

    // Filter
    if (filterBusiness !== 'all') {
      docs = docs.filter(d => d.businessId === filterBusiness);
    }
    if (filterProject !== 'all') {
      docs = docs.filter(d => d.projectId === filterProject);
    }
    if (filterType !== 'all') {
      docs = docs.filter(d => d.docType === filterType);
    }
    if (filterStatus !== 'all') {
      docs = docs.filter(d => d.status === filterStatus);
    }

    // Sort
    docs.sort((a, b) => {
      switch (sort) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        default:
          return 0;
      }
    });

    return docs;
  }, [documents, filterBusiness, filterProject, filterType, filterStatus, sort]);

  const handleCardClick = (doc: Document) => {
    setSelectedDoc(doc);
    setViewerOpen(true);
  };

  const handleViewerClose = () => {
    setViewerOpen(false);
    // Refresh the selected doc from store in case it was updated
    if (selectedDoc) {
      const updated = documents.find(d => d.id === selectedDoc.id);
      if (updated) setSelectedDoc(updated);
    }
  };

  const docTypes: DocType[] = ['plan', 'report', 'strategy', 'playbook', 'analysis', 'brief'];

  // Separate plans from other documents for prominent display
  const masterPlans = filteredDocs.filter(d => d.docType === 'plan');
  const otherDocs = filteredDocs.filter(d => d.docType !== 'plan');
  const docStatuses: DocStatus[] = ['draft', 'published', 'reviewed', 'archived'];

  const activeFilters = [filterBusiness, filterProject, filterType, filterStatus].filter(f => f !== 'all').length;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
            <FileText className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100">Documents & Reports</h1>
            <p className="text-sm text-slate-500">
              {documents.length} document{documents.length !== 1 ? 's' : ''}
              {activeFilters > 0 && ` • ${filteredDocs.length} shown`}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6 p-3 bg-slate-900/50 border border-slate-800 rounded-lg">
        <Filter className="h-4 w-4 text-slate-500 flex-shrink-0" />
        
        <Select value={filterBusiness} onValueChange={setFilterBusiness}>
          <SelectTrigger className="w-[160px] bg-slate-900 border-slate-700 text-sm h-8">
            <SelectValue placeholder="Business" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700">
            <SelectItem value="all">All Businesses</SelectItem>
            {businesses.map(b => (
              <SelectItem key={b.id} value={b.id}>
                {b.icon} {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterProject} onValueChange={setFilterProject}>
          <SelectTrigger className="w-[160px] bg-slate-900 border-slate-700 text-sm h-8">
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700">
            <SelectItem value="all">All Projects</SelectItem>
            {projects.filter(p => !p.archived).map(p => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[140px] bg-slate-900 border-slate-700 text-sm h-8">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700">
            <SelectItem value="all">All Types</SelectItem>
            {docTypes.map(t => (
              <SelectItem key={t} value={t}>
                {DOC_TYPE_CONFIG[t].icon} {DOC_TYPE_CONFIG[t].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[140px] bg-slate-900 border-slate-700 text-sm h-8">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700">
            <SelectItem value="all">All Statuses</SelectItem>
            {docStatuses.map(s => (
              <SelectItem key={s} value={s}>
                {DOC_STATUS_CONFIG[s].icon} {DOC_STATUS_CONFIG[s].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1" />

        {/* Sort */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSort('newest')}
            className={`h-8 px-2 text-xs ${sort === 'newest' ? 'bg-slate-800 text-slate-200' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <SortDesc className="h-3 w-3 mr-1" />
            Newest
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSort('oldest')}
            className={`h-8 px-2 text-xs ${sort === 'oldest' ? 'bg-slate-800 text-slate-200' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <SortAsc className="h-3 w-3 mr-1" />
            Oldest
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSort('updated')}
            className={`h-8 px-2 text-xs ${sort === 'updated' ? 'bg-slate-800 text-slate-200' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Clock className="h-3 w-3 mr-1" />
            Updated
          </Button>
        </div>

        {/* Clear filters */}
        {activeFilters > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-slate-500 hover:text-slate-300"
            onClick={() => {
              setFilterBusiness('all');
              setFilterProject('all');
              setFilterType('all');
              setFilterStatus('all');
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Master Plans Section */}
      {masterPlans.length > 0 && filterType !== 'all' && filterType !== 'plan' ? null : masterPlans.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🗺️</span>
            <h2 className="text-lg font-semibold text-slate-100">Master Plans</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400">
              {masterPlans.length} plan{masterPlans.length !== 1 ? 's' : ''}
            </span>
            {masterPlans.some(d => d.status === 'draft') && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400">
                🔍 {masterPlans.filter(d => d.status === 'draft').length} need review
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {masterPlans.map(doc => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onClick={() => handleCardClick(doc)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Documents */}
      {otherDocs.length > 0 ? (
        <div>
          {masterPlans.length > 0 && (filterType === 'all' || filterType === 'plan') && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">📚</span>
              <h2 className="text-lg font-semibold text-slate-100">Documents & Reports</h2>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherDocs.map(doc => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onClick={() => handleCardClick(doc)}
              />
            ))}
          </div>
        </div>
      ) : masterPlans.length === 0 && otherDocs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-slate-600" />
          </div>
          <h3 className="text-lg font-medium text-slate-300 mb-2">
            {documents.length === 0 ? 'No documents yet' : 'No documents match your filters'}
          </h3>
          <p className="text-sm text-slate-500 max-w-md">
            {documents.length === 0
              ? 'Reports, strategies, and analyses created by Harper will appear here. Stay tuned!'
              : 'Try adjusting your filters to find what you\'re looking for.'}
          </p>
          {activeFilters > 0 && (
            <Button
              variant="ghost"
              className="mt-4 text-slate-400 hover:text-slate-200"
              onClick={() => {
                setFilterBusiness('all');
                setFilterProject('all');
                setFilterType('all');
                setFilterStatus('all');
              }}
            >
              Clear all filters
            </Button>
          )}
        </div>
      ) : null}

      {/* Document Viewer Modal */}
      <DocumentViewer
        document={selectedDoc}
        open={viewerOpen}
        onClose={handleViewerClose}
      />
    </div>
  );
}
