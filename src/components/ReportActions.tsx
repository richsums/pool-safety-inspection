import { useState } from 'react';
import { useStore } from '../store';
import { generatePDF } from '../utils/pdfGenerator';
import { CHECKLIST_SECTIONS } from '../checklistData';

export function ReportActions() {
  const [generating, setGenerating] = useState(false);
  const store = useStore();
  const markSaved = useStore(s => s.markSaved);

  const handlePDF = async () => {
    setGenerating(true);
    try {
      await generatePDF(store as any);
    } finally {
      setGenerating(false);
    }
  };

  const handleEmail = async () => {
    setGenerating(true);
    try {
      const { propertyInfo, items } = store;
      const criticals = CHECKLIST_SECTIONS.flatMap(s => s.items).filter(
        i => (items as any)[i.id]?.result === 'fail' && (items as any)[i.id]?.severity === 'critical'
      );
      const subject = encodeURIComponent(
        `Pool Safety Inspection Report — ${propertyInfo.propertyAddress} — ${propertyInfo.inspectionDate}`
      );
      const body = encodeURIComponent(
        `Dear ${propertyInfo.clientName || 'Client'},\n\nPlease find attached your Swimming Pool Safety Inspection Report.\n\nProperty: ${propertyInfo.propertyAddress}\nDate: ${propertyInfo.inspectionDate}\nInspector: ${propertyInfo.inspectorName}\n\n${criticals.length > 0 ? `⚠️ ${criticals.length} critical finding(s) require immediate attention.\n\n` : ''}Please review the attached PDF for full details.\n\nVIP Pools — Central Coast California`
      );
      window.open(`mailto:${propertyInfo.clientEmail}?subject=${subject}&body=${body}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 justify-end">
      <button
        onClick={() => markSaved()}
        className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      >
        💾 Save Draft
      </button>
      <button
        onClick={handleEmail}
        disabled={generating}
        className="px-4 py-2 text-sm font-medium rounded-xl bg-green-600 hover:bg-green-700 text-white transition-colors disabled:opacity-50"
      >
        {generating ? '⏳ Preparing…' : '📧 Email Report'}
      </button>
      <button
        onClick={handlePDF}
        disabled={generating}
        className="px-4 py-2 text-sm font-medium rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
      >
        {generating ? '⏳ Generating PDF…' : '📄 Download PDF Report'}
      </button>
    </div>
  );
}
