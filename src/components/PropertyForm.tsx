import { useStore } from '../store';
import type { PropertyInfo } from '../types';

const poolTypes = ['Residential', 'Commercial', 'HOA', 'Hotel', 'Public'];
const poolShapes = ['Rectangular', 'Oval', 'Kidney', 'Freeform', 'Other'];

export function PropertyForm() {
  const info = useStore(s => s.propertyInfo);
  const update = useStore(s => s.updatePropertyInfo);

  const field = (
    label: string,
    key: keyof PropertyInfo,
    type = 'text',
    options?: string[]
  ) => (
    <div key={key}>
      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{label}</label>
      {options ? (
        <select
          value={info[key]}
          onChange={e => update({ [key]: e.target.value } as Partial<PropertyInfo>)}
          className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type={type}
          value={info[key]}
          onChange={e => update({ [key]: e.target.value } as Partial<PropertyInfo>)}
          className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      )}
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
      <h2 className="text-base font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
        <span className="text-blue-500">📋</span> Property &amp; Inspector Information
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field('Inspector Name', 'inspectorName')}
        {field('CPO License Number (optional)', 'inspectorLicense')}
        {field('Inspection Date', 'inspectionDate', 'date')}
        {field('Last Inspection Date', 'lastInspectionDate', 'date')}
        <div className="sm:col-span-2">{field('Property Address', 'propertyAddress')}</div>
        {field('Client Name', 'clientName')}
        {field('Client Email', 'clientEmail', 'email')}
        {field('Client Phone', 'clientPhone', 'tel')}
        {field('Pool Type', 'poolType', 'text', poolTypes)}
        {field('Pool Shape', 'poolShape', 'text', poolShapes)}
        {field('Pool Size (gallons or sq ft)', 'poolSize')}
        {field('Pool Age (years)', 'poolAge')}
      </div>
      <div className="mt-4">
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">General Notes</label>
        <textarea
          value={info.notes}
          onChange={e => update({ notes: e.target.value })}
          rows={3}
          className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y"
        />
      </div>
    </div>
  );
}
