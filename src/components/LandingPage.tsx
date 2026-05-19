import { useStore } from '../store';
import type { InspectionType } from '../types';
import { VipLogo } from './VipLogo';
import { applySampleData } from '../sampleData';

const options: { type: InspectionType; icon: string; title: string; desc: string; color: string }[] = [
  {
    type: 'commercial',
    icon: '🏨',
    title: 'Commercial Pool Inspection',
    desc: 'Hotels, apartments, HOAs, and public pools. Includes health department and CPO requirements.',
    color: 'border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20',
  },
  {
    type: 'real-estate',
    icon: '🏡',
    title: 'Real Estate Sale Inspection',
    desc: 'Pre-sale or pre-purchase inspection documenting current safety and compliance status.',
    color: 'border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20',
  },
  {
    type: 'homeowner',
    icon: '🌊',
    title: 'Homeowner Safety Audit',
    desc: 'Voluntary self-inspection for residential pools. Ensure your family pool meets California safety standards.',
    color: 'border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20',
  },
];

export function LandingPage() {
  const setInspectionType = useStore(s => s.setInspectionType);
  const lastSaved = useStore(s => s.lastSaved);
  const inspectionType = useStore(s => s.inspectionType);
  const store = useStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <VipLogo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mt-2">Swimming Pool Safety Inspection</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Central Coast California · Powered by VIP Pools</p>
        </div>

        {lastSaved && inspectionType && (
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Draft inspection saved</p>
              <p className="text-xs text-amber-600 dark:text-amber-400">{new Date(lastSaved).toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setInspectionType(inspectionType)}
                className="text-xs bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg font-medium"
              >
                Resume Draft
              </button>
              <button
                onClick={() => { if (confirm('Clear draft and start over?')) store.resetInspection(); }}
                className="text-xs bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg font-medium"
              >
                New
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {options.map(o => (
            <button
              key={o.type}
              onClick={() => setInspectionType(o.type)}
              className={`w-full text-left border-2 ${o.color} dark:border-opacity-60 bg-white dark:bg-slate-800 rounded-xl p-4 transition-all shadow-sm hover:shadow-md`}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{o.icon}</span>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">{o.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{o.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => applySampleData(store)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Load sample inspection data →
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
          California Health &amp; Safety Code §115922 · Virginia Graeme Baker Act · NEC 680
        </p>
      </div>
    </div>
  );
}
