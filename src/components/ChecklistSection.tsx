import { useState } from 'react';
import { useStore } from '../store';
import type { SectionDef } from '../checklistData';
import { ChecklistItem } from './ChecklistItem';

export function ChecklistSection({ section }: { section: SectionDef }) {
  const [open, setOpen] = useState(true);
  const items = useStore(s => s.items);

  const sectionItems = section.items;
  const total = sectionItems.length;
  const answered = sectionItems.filter(i => items[i.id]?.result !== null).length;
  const fails = sectionItems.filter(i => items[i.id]?.result === 'fail').length;
  const criticals = sectionItems.filter(i => items[i.id]?.result === 'fail' && items[i.id]?.severity === 'critical').length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-800 dark:text-white text-sm">{section.title}</span>
          {section.commercialOnly && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
              Commercial Only
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {criticals > 0 && (
            <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full font-semibold">
              🚨 {criticals} Critical
            </span>
          )}
          {fails > 0 && (
            <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full font-semibold">
              {fails} Fail
            </span>
          )}
          <span className="text-xs text-slate-500 dark:text-slate-400">{answered}/{total}</span>
          <span className="text-slate-400 ml-1">{open ? '▲' : '▼'}</span>
        </div>
      </button>
      {open && (
        <div className="p-4 pt-0 space-y-3 border-t border-slate-100 dark:border-slate-700">
          {sectionItems.map(item => (
            <ChecklistItem key={item.id} itemDef={item} />
          ))}
        </div>
      )}
    </div>
  );
}
