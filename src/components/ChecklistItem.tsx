import { useRef } from 'react';
import { useStore } from '../store';
import type { CheckResult, Severity } from '../types';
import type { ChecklistItemDef } from '../checklistData';

const severityColors: Record<Severity, string> = {
  minor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  moderate: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

export function ChecklistItem({ itemDef }: { itemDef: ChecklistItemDef }) {
  const item = useStore(s => s.items[itemDef.id]);
  const waterQuality = useStore(s => s.waterQuality);
  const setResult = useStore(s => s.setItemResult);
  const setNotes = useStore(s => s.setItemNotes);
  const setSeverity = useStore(s => s.setItemSeverity);
  const addPhoto = useStore(s => s.addItemPhoto);
  const removePhoto = useStore(s => s.removeItemPhoto);
  const updateWQ = useStore(s => s.updateWaterQuality);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      const reader = new FileReader();
      reader.onload = () => {
        addPhoto(itemDef.id, { id: crypto.randomUUID(), dataUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const btnBase = 'px-3 py-1.5 text-xs font-semibold rounded-lg border-2 transition-all';

  const resultBtn = (r: CheckResult, label: string, active: string, inactive: string) => (
    <button
      key={r ?? 'null'}
      onClick={() => setResult(itemDef.id, item.result === r ? null : r)}
      className={`${btnBase} ${item.result === r ? active : inactive}`}
    >
      {label}
    </button>
  );

  if (!item) return null;

  return (
    <div className={`p-4 rounded-lg border transition-all ${
      item.result === 'pass' ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/10' :
      item.result === 'fail' ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/10' :
      item.result === 'na' ? 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 opacity-70' :
      'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
    }`}>
      {/* Label row */}
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-lg flex-shrink-0">
          {item.result === 'pass' ? '✅' : item.result === 'fail' ? '❌' : item.result === 'na' ? '➖' : '⬜'}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{itemDef.label}</p>
          {itemDef.hint && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 italic">{itemDef.hint}</p>
          )}
        </div>
      </div>

      {/* Result buttons */}
      <div className="mt-3 flex flex-wrap gap-2">
        {resultBtn(
          'pass', '✓ Pass',
          'border-green-500 bg-green-500 text-white',
          'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-green-400 hover:text-green-600'
        )}
        {resultBtn(
          'fail', '✗ Fail',
          'border-red-500 bg-red-500 text-white',
          'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-red-400 hover:text-red-600'
        )}
        {resultBtn(
          'na', 'N/A',
          'border-slate-400 bg-slate-400 text-white',
          'border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-500 hover:border-slate-400'
        )}

        {item.result === 'fail' && (
          <select
            value={item.severity || ''}
            onChange={e => setSeverity(itemDef.id, e.target.value as Severity)}
            className="text-xs border-2 rounded-lg px-2 py-1 font-semibold border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300"
          >
            <option value="">Severity…</option>
            <option value="minor">Minor</option>
            <option value="moderate">Moderate</option>
            <option value="critical">🚨 Critical</option>
          </select>
        )}
      </div>

      {/* Water quality field */}
      {itemDef.waterQualityField && (
        <div className="mt-2">
          <input
            type="text"
            placeholder={`Measured value (${itemDef.waterQualityField})`}
            value={waterQuality[itemDef.waterQualityField]}
            onChange={e => updateWQ({ [itemDef.waterQualityField!]: e.target.value })}
            className="w-full text-sm border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      )}

      {/* Severity badge */}
      {item.result === 'fail' && item.severity && (
        <div className="mt-2">
          <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${severityColors[item.severity]}`}>
            {item.severity.charAt(0).toUpperCase() + item.severity.slice(1)}
          </span>
        </div>
      )}

      {/* Notes */}
      <div className="mt-2">
        <textarea
          value={item.notes}
          onChange={e => setNotes(itemDef.id, e.target.value)}
          placeholder="Notes…"
          rows={item.notes ? Math.max(2, item.notes.split('\n').length) : 1}
          className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none resize-y"
        />
      </div>

      {/* Photos */}
      <div className="mt-2 flex flex-wrap gap-2">
        {item.photos.map(ph => (
          <div key={ph.id} className="relative group">
            <img src={ph.dataUrl} alt="inspection photo" className="w-16 h-16 object-cover rounded-lg border border-slate-300 dark:border-slate-600" />
            <button
              onClick={() => removePhoto(itemDef.id, ph.id)}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={() => fileRef.current?.click()}
          className="w-16 h-16 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-colors text-xs"
        >
          <span className="text-xl">📷</span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhoto}
          className="hidden"
        />
      </div>
    </div>
  );
}
