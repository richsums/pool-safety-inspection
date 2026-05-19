import { useStore } from '../store';
import type { OverallRating } from '../types';

const ratings: { value: OverallRating; label: string; color: string }[] = [
  { value: 'excellent', label: '🟢 Excellent', color: 'border-green-500 bg-green-500 text-white' },
  { value: 'good', label: '🟡 Good', color: 'border-yellow-500 bg-yellow-500 text-white' },
  { value: 'fair', label: '🟠 Fair', color: 'border-orange-500 bg-orange-500 text-white' },
  { value: 'poor', label: '🔴 Poor', color: 'border-red-500 bg-red-500 text-white' },
];

export function SectionISummary() {
  const data = useStore(s => s.sectionI);
  const update = useStore(s => s.updateSectionI);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
      <h2 className="text-base font-semibold text-slate-800 dark:text-white mb-4">
        Section I — General Observations &amp; Recommendations
      </h2>

      <div className="mb-4">
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Overall Condition Rating</label>
        <div className="flex flex-wrap gap-2">
          {ratings.map(r => (
            <button
              key={r.value}
              onClick={() => update({ overallRating: data.overallRating === r.value ? '' : r.value })}
              className={`px-4 py-2 text-sm font-semibold rounded-lg border-2 transition-all ${
                data.overallRating === r.value
                  ? r.color
                  : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-slate-400'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {(
        [
          { key: 'immediateActions' as const, label: '🚨 Immediate Action Items (Critical findings)', placeholder: 'List critical findings requiring immediate remediation…' },
          { key: 'recommendedFollowUp' as const, label: '⚠️ Recommended Follow-Up (within 30 days)', placeholder: 'List recommended follow-up items…' },
          { key: 'additionalObservations' as const, label: '📝 Additional Observations', placeholder: 'Any other observations or notes…' },
        ] as const
      ).map(({ key, label, placeholder }) => (
        <div key={key} className="mb-4">
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{label}</label>
          <textarea
            value={data[key]}
            onChange={e => update({ [key]: e.target.value })}
            placeholder={placeholder}
            rows={3}
            className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-y"
          />
        </div>
      ))}

      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Next Recommended Inspection Date</label>
        <input
          type="date"
          value={data.nextInspectionDate}
          onChange={e => update({ nextInspectionDate: e.target.value })}
          className="border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>
    </div>
  );
}
