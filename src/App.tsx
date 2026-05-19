import { useState, useEffect } from 'react';
import { useStore } from './store';
import { LandingPage } from './components/LandingPage';
import { Header } from './components/Header';
import { PropertyForm } from './components/PropertyForm';
import { ChecklistSection } from './components/ChecklistSection';
import { SectionISummary } from './components/SectionI';
import { SignaturePanel } from './components/SignaturePanel';
import { ProgressBar } from './components/ProgressBar';
import { ReportActions } from './components/ReportActions';
import { CHECKLIST_SECTIONS } from './checklistData';

export default function App() {
  const [darkMode, setDarkMode] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const inspectionType = useStore(s => s.inspectionType);
  const setInspectionType = useStore(s => s.setInspectionType);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  if (!inspectionType) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen">
          <LandingPage />
          <div className="fixed top-3 right-3">
            <button
              onClick={() => setDarkMode(d => !d)}
              className="p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 shadow hover:shadow-md text-lg"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sectionsToShow = CHECKLIST_SECTIONS.filter(
    s => !s.commercialOnly || inspectionType === 'commercial'
  );

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header darkMode={darkMode} toggleDark={() => setDarkMode(d => !d)} />

        <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          <ProgressBar />
          <PropertyForm />

          <div className="flex items-center gap-3 py-1">
            <button
              onClick={() => setInspectionType(null as any)}
              className="text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            >
              ← Change inspection type
            </button>
          </div>

          {sectionsToShow.map(section => (
            <ChecklistSection key={section.id} section={section} />
          ))}

          <SectionISummary />
          <SignaturePanel />
          <ReportActions />

          <p className="text-xs text-center text-slate-400 dark:text-slate-600 pb-8">
            VIP Pools · California Health &amp; Safety Code §115922 · Virginia Graeme Baker Act · NEC 680 · California Title 24
          </p>
        </main>
      </div>
    </div>
  );
}
