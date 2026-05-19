import { VipLogo } from './VipLogo';
import { useStore } from '../store';

export function Header({ darkMode, toggleDark }: { darkMode: boolean; toggleDark: () => void }) {
  const inspectionType = useStore(s => s.inspectionType);
  const typeLabels: Record<string, string> = {
    commercial: 'Commercial Pool Inspection',
    'real-estate': 'Real Estate Sale Inspection',
    homeowner: 'Homeowner Safety Audit',
  };
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <VipLogo size="md" />
        <div className="flex items-center gap-3">
          {inspectionType && (
            <span className="hidden sm:inline text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
              {typeLabels[inspectionType]}
            </span>
          )}
          <button
            onClick={toggleDark}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
}
