import { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from './store';
import { LandingPage } from './components/LandingPage';
import { NavBar, UnsavedDialog, SavedModal } from './components/NavBar';
import type { ActiveScreen } from './components/NavBar';
import { PropertyForm } from './components/PropertyForm';
import { ChecklistSection } from './components/ChecklistSection';
import { SectionISummary } from './components/SectionI';
import { SignaturePanel } from './components/SignaturePanel';
import { ProgressBar } from './components/ProgressBar';
import { ReportActions } from './components/ReportActions';
import { QuickSafetyCheck } from './components/QuickSafetyCheck';
import { SaveToast } from './components/SaveToast';
import { CHECKLIST_SECTIONS } from './checklistData';
import { saveDraft, loadDraft } from './utils/draftUtils';
import type { InspectionType } from './types';

export default function App() {
  const [darkMode, setDarkMode] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [screen, setScreen] = useState<ActiveScreen>('landing');
  const [isDirty, setIsDirty] = useState(false);
  const [showUnsaved, setShowUnsaved] = useState(false);
  const [pendingNavAction, setPendingNavAction] = useState<(() => void) | null>(null);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [toastKey, setToastKey] = useState(0);
  const [refreshDraftsKey, setRefreshDraftsKey] = useState(0);

  const store = useStore();
  const inspectionType = useStore(s => s.inspectionType);
  const setCurrentDraftKey = useStore(s => s.setCurrentDraftKey);
  const currentDraftKey = useStore(s => s.currentDraftKey);

  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoSaveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const screenRef = useRef(screen);
  screenRef.current = screen;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // ─── Auto-save logic ───────────────────────────────────────────────────────
  const triggerAutoSave = useCallback(() => {
    if (screenRef.current !== 'inspection' && screenRef.current !== 'quick-check') return;
    const snap = useStore.getState();
    const key = saveDraft(snap as any, snap.currentDraftKey ?? undefined);
    if (!snap.currentDraftKey) setCurrentDraftKey(key);
    setIsDirty(false);
    setToastKey(k => k + 1);
    setShowSaveToast(true);
    setRefreshDraftsKey(k => k + 1);
  }, [setCurrentDraftKey]);

  // Debounced 2s on field change
  const store_propertyInfo = store.propertyInfo;
  const store_waterQuality = store.waterQuality;
  const store_sectionI = store.sectionI;
  const store_items = store.items;
  const store_quickCheckState = store.quickCheckState;
  const store_inspectorSignature = store.inspectorSignature;
  const store_clientSignature = store.clientSignature;

  useEffect(() => {
    if (screen !== 'inspection' && screen !== 'quick-check') return;
    setIsDirty(true);
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(triggerAutoSave, 2000);
    return () => { if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store_propertyInfo, store_waterQuality, store_sectionI, store_items,
      store_quickCheckState, store_inspectorSignature, store_clientSignature]);

  // 30-second interval
  useEffect(() => {
    if (screen !== 'inspection' && screen !== 'quick-check') {
      if (autoSaveIntervalRef.current) clearInterval(autoSaveIntervalRef.current);
      return;
    }
    autoSaveIntervalRef.current = setInterval(triggerAutoSave, 30_000);
    return () => { if (autoSaveIntervalRef.current) clearInterval(autoSaveIntervalRef.current); };
  }, [screen, triggerAutoSave]);

  // ─── Navigation guards ─────────────────────────────────────────────────────
  function guardedNav(action: () => void) {
    if (isDirty && (screen === 'inspection' || screen === 'quick-check')) {
      setPendingNavAction(() => action);
      setShowUnsaved(true);
    } else {
      action();
    }
  }

  function goHome() {
    setScreen('landing');
    setIsDirty(false);
    setRefreshDraftsKey(k => k + 1);
  }

  function saveAndExit() {
    const snap = useStore.getState();
    const key = saveDraft(snap as any, snap.currentDraftKey ?? undefined);
    setCurrentDraftKey(key);
    store.markSaved();
    setIsDirty(false);
    setShowSavedModal(true);
    setRefreshDraftsKey(k => k + 1);
  }

  function handleUnsavedSaveExit() {
    setShowUnsaved(false);
    const snap = useStore.getState();
    const key = saveDraft(snap as any, snap.currentDraftKey ?? undefined);
    setCurrentDraftKey(key);
    store.markSaved();
    setIsDirty(false);
    setShowSavedModal(true);
    setRefreshDraftsKey(k => k + 1);
    setPendingNavAction(null);
  }

  function handleUnsavedDiscard() {
    setShowUnsaved(false);
    const action = pendingNavAction;
    setPendingNavAction(null);
    setIsDirty(false);
    action?.();
  }

  function startInspection(type: InspectionType) {
    store.setInspectionType(type);
    store.resetQuickCheck();
    setCurrentDraftKey(null);
    setIsDirty(false);
    setScreen('inspection');
  }

  function startQuickCheck() {
    store.initQuickCheck();
    store.setInspectionType(null);
    setCurrentDraftKey(null);
    setIsDirty(false);
    setScreen('quick-check');
  }

  function resumeDraft(key: string) {
    const draft = loadDraft(key);
    if (!draft) return;
    store.loadFromState(draft.state as any);
    setCurrentDraftKey(key);
    setIsDirty(false);
    if (draft.inspectionType === 'quick-check') {
      setScreen('quick-check');
    } else if (draft.state.inspectionType) {
      setScreen('inspection');
    } else {
      setScreen('landing');
    }
  }

  // ─── Sections ──────────────────────────────────────────────────────────────
  const sectionsToShow = CHECKLIST_SECTIONS.filter(
    s => !s.commercialOnly || inspectionType === 'commercial'
  );

  const savedAddress =
    screen === 'quick-check'
      ? (store.quickCheckState?.propertyInfo?.propertyAddress ?? '')
      : (store.propertyInfo?.propertyAddress ?? '');

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">

        {/* NavBar — shown on active inspection screens */}
        {screen !== 'landing' && (
          <NavBar
            screen={screen}
            inspectionType={inspectionType}
            darkMode={darkMode}
            toggleDark={() => setDarkMode(d => !d)}
            isDirty={isDirty}
            onHome={() => guardedNav(goHome)}
            onSaveExit={saveAndExit}
            onNewInspection={() => guardedNav(() => { store.resetInspection(); setScreen('landing'); })}
            onQuickCheck={() => guardedNav(startQuickCheck)}
          />
        )}

        {/* Landing */}
        {screen === 'landing' && (
          <>
            <div className="fixed top-3 right-3 z-10">
              <button
                onClick={() => setDarkMode(d => !d)}
                className="p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 shadow hover:shadow-md text-lg"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
            <LandingPage
              onStartInspection={startInspection}
              onStartQuickCheck={startQuickCheck}
              onResumeDraft={resumeDraft}
              refreshDraftsKey={refreshDraftsKey}
            />
          </>
        )}

        {/* Full inspection */}
        {screen === 'inspection' && (
          <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
            <ProgressBar />
            <PropertyForm />

            <div className="flex items-center gap-3 py-1">
              <button
                onClick={() => guardedNav(goHome)}
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
        )}

        {/* Quick Safety Check */}
        {screen === 'quick-check' && <QuickSafetyCheck />}

        {/* Modals & toasts */}
        <UnsavedDialog
          open={showUnsaved}
          onSaveExit={handleUnsavedSaveExit}
          onDiscard={handleUnsavedDiscard}
          onCancel={() => { setShowUnsaved(false); setPendingNavAction(null); }}
        />
        <SavedModal
          open={showSavedModal}
          address={savedAddress}
          onClose={() => { setShowSavedModal(false); goHome(); }}
        />
        <SaveToast key={toastKey} show={showSaveToast} />
      </div>
    </div>
  );
}
