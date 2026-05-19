import { useStore } from '../store';
import { CHECKLIST_SECTIONS } from '../checklistData';

export function ProgressBar() {
  const items = useStore(s => s.items);
  const inspectionType = useStore(s => s.inspectionType);

  const allItems = CHECKLIST_SECTIONS
    .filter(s => !s.commercialOnly || inspectionType === 'commercial')
    .flatMap(s => s.items);

  const total = allItems.length;
  const done = allItems.filter(i => items[i.id]?.result !== null).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const fails = allItems.filter(i => items[i.id]?.result === 'fail').length;
  const criticals = allItems.filter(i => items[i.id]?.result === 'fail' && items[i.id]?.severity === 'critical').length;
  const passes = allItems.filter(i => items[i.id]?.result === 'pass').length;
  const nas = allItems.filter(i => items[i.id]?.result === 'na').length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Inspection Progress</span>
        <span className="text-sm font-bold text-slate-800 dark:text-white">{pct}% — {done}/{total} items</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-blue-500 to-cyan-400"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
        {criticals > 0 && (
          <span className="text-red-600 dark:text-red-400 font-semibold">🚨 {criticals} Critical</span>
        )}
        {fails > 0 && (
          <span className="text-orange-600 dark:text-orange-400">{fails} Fail</span>
        )}
        <span className="text-green-600 dark:text-green-400">{passes} Pass</span>
        <span>{nas} N/A</span>
      </div>
    </div>
  );
}
