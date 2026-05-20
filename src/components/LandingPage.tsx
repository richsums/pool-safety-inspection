import { useStore } from '../store';
import type { InspectionType } from '../types';
import { VipLogo } from './VipLogo';
import { applySampleData } from '../sampleData';
import { SavedInspections } from './SavedInspections';

const options: { type: InspectionType; icon: string; title: string; desc: string; borderColor: string }[] = [
  {
    type: 'commercial',
    icon: '🏨',
    title: 'Commercial Pool Inspection',
    desc: 'Hotels, apartments, HOAs, and public pools. Includes health department and CPO requirements.',
    borderColor: '#1B3D8F',
  },
  {
    type: 'real-estate',
    icon: '🏡',
    title: 'Real Estate Sale Inspection',
    desc: 'Pre-sale or pre-purchase inspection documenting current safety and compliance status.',
    borderColor: '#5A9E3A',
  },
  {
    type: 'homeowner',
    icon: '🌊',
    title: 'Homeowner Safety Audit',
    desc: 'Voluntary self-inspection for residential pools. Ensure your family pool meets California safety standards.',
    borderColor: '#F5A623',
  },
];

interface LandingPageProps {
  onStartInspection: (type: InspectionType) => void;
  onStartQuickCheck: () => void;
  onResumeDraft: (key: string) => void;
  refreshDraftsKey?: number;
}

export function LandingPage({ onStartInspection, onStartQuickCheck, onResumeDraft, refreshDraftsKey }: LandingPageProps) {
  const store = useStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">

        {/* Hero */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <VipLogo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mt-2">Swimming Pool Safety Inspection</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Central Coast California · Powered by VIP Pools</p>
        </div>

        {/* New inspection cards */}
        <div>
          <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
            Start New Inspection
          </h2>
          <div className="space-y-3">
            {options.map(o => (
              <button
                key={o.type}
                onClick={() => onStartInspection(o.type)}
                className="w-full text-left border-2 bg-white dark:bg-slate-800 rounded-xl p-4 transition-all shadow-sm hover:shadow-md"
                style={{ borderColor: o.borderColor }}
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

            {/* Quick Safety Check */}
            <button
              onClick={onStartQuickCheck}
              className="w-full text-left border-2 bg-white dark:bg-slate-800 rounded-xl p-4 transition-all shadow-sm hover:shadow-md"
              style={{ borderColor: '#5BB8F5' }}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">⚡</span>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">Quick Safety Check</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    For service visits — document deficiencies in under 5 minutes
                  </p>
                  <span className="inline-flex mt-1.5 items-center text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: '#5BB8F5' }}>
                    Service Tech Tool
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Saved inspections */}
        <SavedInspections onResume={onResumeDraft} refreshKey={refreshDraftsKey} />

        {/* Sample data */}
        <div className="text-center">
          <button
            onClick={() => applySampleData(store)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Load sample inspection data →
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500">
          California Health &amp; Safety Code §115922 · Virginia Graeme Baker Act · NEC 680
        </p>
      </div>
    </div>
  );
}
