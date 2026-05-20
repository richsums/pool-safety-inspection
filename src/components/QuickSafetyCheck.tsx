import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { useStore } from '../store';
import { QUICK_CHECK_GROUPS, computeQuickCheckPriority } from '../utils/quickCheckData';
import type { QuickCheckObserved, Severity, PhotoAttachment } from '../types';
import { generateQuickCheckPdf } from '../utils/quickCheckPdf';

const SEVERITY_COLORS: Record<Severity, { bg: string; text: string }> = {
  critical: { bg: '#FEF2F2', text: '#DC2626' },
  moderate: { bg: '#FFF7ED', text: '#EA580C' },
  minor:    { bg: '#FEFCE8', text: '#CA8A04' },
};

export function QuickSafetyCheck() {
  const store = useStore();
  const qc = store.quickCheckState;
  const [generating, setGenerating] = useState(false);
  const [sigMode, setSigMode] = useState(false);
  const sigRef = useRef<SignatureCanvas>(null);

  if (!qc) return null;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const qcData = qc!;

  const items = qcData.items;
  const priority = computeQuickCheckPriority(items);
  const observedItems = Object.values(items).filter(i => i.observed === 'observed');
  const hasCritical = observedItems.some(i => i.severity === 'critical');

  function handlePhoto(id: string) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const photo: PhotoAttachment = {
          id: `${id}-${Date.now()}`,
          dataUrl: reader.result as string,
        };
        store.addQuickCheckItemPhoto(id, photo);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  function handleSaveSignature() {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      store.setQuickCheckTechSignature(sigRef.current.toDataURL('image/png'));
    }
    setSigMode(false);
  }

  async function handlePDF() {
    setGenerating(true);
    try {
      await generateQuickCheckPdf(qcData);
    } finally {
      setGenerating(false);
    }
  }

  async function handleEmail() {
    const addr = qcData.propertyInfo.propertyAddress || 'Property';
    const subjectPrefix = hasCritical ? 'Pool Safety Notice — Action Required' : 'Pool Safety Advisory';
    const subject = encodeURIComponent(`${subjectPrefix} — ${addr}`);
    const critItems = observedItems.filter(i => i.severity === 'critical');
    const body = encodeURIComponent([
      `Dear ${qcData.propertyInfo.clientName || 'Client'},`,
      '',
      `During a routine service visit on ${qcData.propertyInfo.date}, our technician ${qcData.propertyInfo.techName || ''} observed the following pool safety items requiring attention:`,
      '',
      hasCritical ? `⚠️ IMMEDIATE ACTION REQUIRED — ${critItems.length} critical safety issue(s) noted:\n${critItems.map(i => `  • ${QUICK_CHECK_GROUPS.flatMap(g => g.items).find(x => x.id === i.id)?.label ?? i.id}`).join('\n')}` : '',
      `Total items noted: ${observedItems.length}`,
      '',
      'VIP Pools recommends addressing critical items immediately. Please contact us to schedule repairs.',
      '',
      'VIP Pools — Central Coast California',
    ].filter(Boolean).join('\n'));
    window.open(`mailto:${qcData.propertyInfo.clientEmail || ''}?subject=${subject}&body=${body}`);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">

      {/* Header info */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
        <h2 className="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <span>⚡</span> Safety Deficiency Notice
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Client Name', field: 'clientName' as const },
            { label: 'Property Address', field: 'propertyAddress' as const },
            { label: 'Service Tech', field: 'techName' as const },
            { label: 'Date', field: 'date' as const, type: 'date' },
            { label: 'Client Email', field: 'clientEmail' as const, type: 'email' },
            { label: 'Client Phone', field: 'clientPhone' as const, type: 'tel' },
          ].map(({ label, field, type }) => (
            <div key={field}>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</label>
              <input
                type={type ?? 'text'}
                value={qcData.propertyInfo[field]}
                onChange={e => store.updateQuickCheckPropertyInfo({ [field]: e.target.value })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm px-3 py-2 focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': 'var(--vip-blue)' } as any}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Priority callout */}
      {hasCritical && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-400 rounded-2xl p-4 flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-bold text-red-700 dark:text-red-400 text-sm">IMMEDIATE ACTION REQUIRED</p>
            <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">
              Critical safety issues have been observed. VIP Pools strongly recommends immediate remediation.
            </p>
          </div>
        </div>
      )}

      {/* Deficiency groups */}
      {QUICK_CHECK_GROUPS.map(group => (
        <div key={group.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700" style={{ background: 'var(--vip-blue)' }}>
            <h3 className="text-sm font-bold text-white">{group.title}</h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {group.items.map(itemDef => {
              const item = items[itemDef.id];
              if (!item) return null;
              const sc = SEVERITY_COLORS[item.severity];
              const isObserved = item.observed === 'observed';

              return (
                <div key={itemDef.id} className={`p-4 transition-colors ${isObserved ? 'bg-red-50/40 dark:bg-red-900/10' : ''}`}>
                  <div className="flex items-start gap-3">
                    {/* Observed toggle */}
                    <div className="flex-shrink-0 mt-0.5">
                      <ObservedToggle
                        value={item.observed}
                        onChange={v => store.setQuickCheckItemObserved(itemDef.id, v)}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium leading-snug ${isObserved ? 'text-red-700 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {itemDef.label}
                      </p>

                      {/* Severity + reading row */}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <SeverityPicker
                          value={item.severity}
                          onChange={v => store.setQuickCheckItemSeverity(itemDef.id, v)}
                        />
                        {itemDef.hasReading && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-slate-400">{itemDef.readingLabel}:</span>
                            <input
                              type="text"
                              value={item.reading ?? ''}
                              onChange={e => store.setQuickCheckItemReading(itemDef.id, e.target.value)}
                              className="w-16 text-xs rounded border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white px-2 py-0.5"
                              placeholder="—"
                            />
                          </div>
                        )}
                      </div>

                      {/* Notes */}
                      <input
                        type="text"
                        value={item.notes}
                        onChange={e => store.setQuickCheckItemNotes(itemDef.id, e.target.value)}
                        placeholder="Notes (optional)"
                        className="mt-2 w-full text-xs rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 focus:outline-none"
                      />

                      {/* Recommended action (editable) */}
                      {isObserved && (
                        <div className="mt-2">
                          <p className="text-xs text-slate-400 mb-0.5">Recommended action:</p>
                          <input
                            type="text"
                            value={item.recommendedAction}
                            onChange={e => store.setQuickCheckItemRecommendedAction(itemDef.id, e.target.value)}
                            className="w-full text-xs rounded-lg border px-3 py-1.5 focus:outline-none"
                            style={{ background: sc.bg, borderColor: `${sc.text}40`, color: sc.text }}
                          />
                        </div>
                      )}

                      {/* Photos */}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <button
                          onClick={() => handlePhoto(itemDef.id)}
                          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Add photo
                        </button>
                        {item.photos.map(photo => (
                          <div key={photo.id} className="relative">
                            <img src={photo.dataUrl} alt="" className="h-10 w-10 object-cover rounded" />
                            <button
                              onClick={() => store.removeQuickCheckItemPhoto(itemDef.id, photo.id)}
                              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center leading-none"
                            >×</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Summary */}
      {observedItems.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Summary</h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {(['critical', 'moderate', 'minor'] as Severity[]).map(sev => {
              const count = observedItems.filter(i => i.severity === sev).length;
              const sc = SEVERITY_COLORS[sev];
              return (
                <div key={sev} className="rounded-xl p-3 text-center" style={{ background: sc.bg }}>
                  <p className="text-xl font-bold" style={{ color: sc.text }}>{count}</p>
                  <p className="text-xs font-medium capitalize" style={{ color: sc.text }}>{sev}</p>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {priority === 'urgent' && '🔴 Priority: URGENT — Critical items require immediate attention.'}
            {priority === 'recommended' && '🟠 Priority: RECOMMENDED — Moderate items should be addressed soon.'}
            {priority === 'advisory' && '🟡 Priority: ADVISORY — Minor items noted for future service.'}
            {!priority && 'No deficiencies noted.'}
          </p>
        </div>
      )}

      {/* Tech signature */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Technician Signature</h3>
        {qcData.techSignature && !sigMode ? (
          <div className="flex items-center gap-3">
            <img src={qcData.techSignature} alt="Signature" className="h-12 rounded border border-slate-200 dark:border-slate-600 bg-white" />
            <button onClick={() => setSigMode(true)} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Redo</button>
          </div>
        ) : sigMode ? (
          <div>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl bg-white overflow-hidden mb-2">
              <SignatureCanvas
                ref={sigRef}
                canvasProps={{ width: 400, height: 120, className: 'w-full' }}
                backgroundColor="white"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSaveSignature} className="text-xs font-medium px-4 py-2 rounded-lg text-white" style={{ background: 'var(--vip-blue)' }}>
                Save Signature
              </button>
              <button onClick={() => sigRef.current?.clear()} className="text-xs px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                Clear
              </button>
              <button onClick={() => setSigMode(false)} className="text-xs px-3 py-2 text-slate-400">Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setSigMode(true)} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            + Add signature
          </button>
        )}
      </div>

      {/* Footer notice */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-xs text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
        VIP Pools recommends addressing Critical items immediately. Contact us to schedule repairs.
        <br />
        <span className="text-slate-400 dark:text-slate-500">
          This notice documents safety observations made during routine service on {qcData.propertyInfo.date}.
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-end pb-8">
        <button
          onClick={handleEmail}
          className="px-4 py-2.5 text-sm font-medium rounded-xl bg-green-600 hover:bg-green-700 text-white transition-colors flex items-center gap-2"
        >
          📧 Email Notice
        </button>
        <button
          onClick={handlePDF}
          disabled={generating}
          className="px-4 py-2.5 text-sm font-medium rounded-xl text-white transition-colors disabled:opacity-50 flex items-center gap-2"
          style={{ background: 'var(--vip-blue)' }}
        >
          {generating ? '⏳ Generating…' : '📄 Download PDF'}
        </button>
      </div>
    </div>
  );
}

/* ─── Observed Toggle ─────────────────────────────────────────────────────── */
function ObservedToggle({ value, onChange }: { value: QuickCheckObserved; onChange: (v: QuickCheckObserved) => void }) {
  const options: { v: QuickCheckObserved; label: string; active: string; inactive: string }[] = [
    { v: 'observed', label: '✓', active: 'bg-red-500 text-white', inactive: 'bg-slate-100 dark:bg-slate-700 text-slate-400' },
    { v: 'not-observed', label: '—', active: 'bg-green-500 text-white', inactive: 'bg-slate-100 dark:bg-slate-700 text-slate-400' },
    { v: 'na', label: 'N/A', active: 'bg-slate-400 text-white', inactive: 'bg-slate-100 dark:bg-slate-700 text-slate-400' },
  ];
  return (
    <div className="flex flex-col gap-1">
      {options.map(o => (
        <button
          key={o.v}
          onClick={() => onChange(value === o.v ? null : o.v)}
          className={`text-xs font-bold px-1.5 py-0.5 rounded w-10 transition-colors ${value === o.v ? o.active : o.inactive}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ─── Severity Picker ─────────────────────────────────────────────────────── */
function SeverityPicker({ value, onChange }: { value: Severity; onChange: (v: Severity) => void }) {
  const opts: Severity[] = ['minor', 'moderate', 'critical'];
  return (
    <div className="flex gap-1">
      {opts.map(s => {
        const sc = SEVERITY_COLORS[s];
        const active = value === s;
        return (
          <button
            key={s}
            onClick={() => onChange(s)}
            className="text-xs font-semibold px-2 py-0.5 rounded-full border transition-colors capitalize"
            style={active
              ? { background: sc.bg, color: sc.text, borderColor: sc.text }
              : { background: 'transparent', color: '#94a3b8', borderColor: '#e2e8f0' }
            }
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}
