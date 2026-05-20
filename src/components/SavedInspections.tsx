import { useState, useEffect } from 'react';
import { listDrafts, deleteDraft, loadDraft, draftLabel } from '../utils/draftUtils';
import type { DraftMeta } from '../types';

interface SavedInspectionsProps {
  onResume: (key: string) => void;
  refreshKey?: number;
}

const typeColors: Record<string, { bg: string; text: string; label: string }> = {
  commercial:   { bg: '#EFF6FF', text: '#1B3D8F', label: 'Commercial' },
  'real-estate':{ bg: '#F0FDF4', text: '#166534', label: 'Real Estate' },
  homeowner:    { bg: '#FFFBEB', text: '#92400E', label: 'Homeowner' },
  'quick-check':{ bg: '#F5F3FF', text: '#5B21B6', label: 'Quick Check' },
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit',
    });
  } catch { return iso; }
}

export function SavedInspections({ onResume, refreshKey }: SavedInspectionsProps) {
  const [drafts, setDrafts] = useState<DraftMeta[]>([]);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  useEffect(() => {
    setDrafts(listDrafts());
  }, [refreshKey]);

  function handleDelete(key: string) {
    deleteDraft(key);
    setDrafts(d => d.filter(x => x.key !== key));
    setDeletingKey(null);
  }

  function handleResume(key: string) {
    const draft = loadDraft(key);
    if (draft) onResume(key);
  }

  return (
    <div className="w-full">
      <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-3">
        Saved Inspections
      </h2>

      {drafts.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-slate-400 dark:text-slate-500 text-sm">No saved inspections</p>
          <p className="text-slate-300 dark:text-slate-600 text-xs mt-1">Start an inspection and save it to see it here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {drafts.map(draft => {
            const tc = typeColors[draft.inspectionType ?? ''] ?? typeColors['homeowner'];
            const label = draftLabel(draft);
            return (
              <div
                key={draft.key}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 flex items-center gap-3 shadow-sm"
              >
                {/* Type badge */}
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: tc.bg, color: tc.text }}
                >
                  {tc.label}
                </span>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{label}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-400 dark:text-slate-500">{formatDate(draft.savedAt)}</span>
                    {draft.percentComplete > 0 && (
                      <>
                        <span className="text-slate-300 dark:text-slate-600">·</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">{draft.percentComplete}% complete</span>
                      </>
                    )}
                  </div>
                  {/* Progress bar */}
                  {draft.percentComplete > 0 && (
                    <div className="mt-1.5 h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden w-full max-w-[160px]">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${draft.percentComplete}%`, background: 'var(--vip-blue)' }}
                      />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleResume(draft.key)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-colors"
                    style={{ background: 'var(--vip-blue)' }}
                  >
                    Resume
                  </button>
                  {deletingKey === draft.key ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDelete(draft.key)}
                        className="text-xs px-2 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeletingKey(null)}
                        className="text-xs px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingKey(draft.key)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      aria-label="Delete draft"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
