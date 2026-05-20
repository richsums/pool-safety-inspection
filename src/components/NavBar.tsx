import { useState } from 'react';
import { VipLogo } from './VipLogo';

export type ActiveScreen = 'landing' | 'inspection' | 'quick-check';

interface NavBarProps {
  screen: ActiveScreen;
  inspectionType?: string | null;
  darkMode: boolean;
  toggleDark: () => void;
  isDirty: boolean;
  onHome: () => void;
  onSaveExit: () => void;
  onNewInspection: () => void;
  onQuickCheck: () => void;
}

const typeLabels: Record<string, string> = {
  commercial: 'Commercial Inspection',
  'real-estate': 'Real Estate Inspection',
  homeowner: 'Homeowner Audit',
};

export function NavBar({
  screen, inspectionType, darkMode, toggleDark, isDirty,
  onHome, onSaveExit, onNewInspection, onQuickCheck,
}: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const pageTitle =
    screen === 'landing' ? 'Pool Safety Inspection' :
    screen === 'quick-check' ? 'Quick Safety Check' :
    inspectionType ? typeLabels[inspectionType] ?? 'Inspection' : 'Inspection';

  function handleHome() {
    setMenuOpen(false);
    onHome();
  }

  return (
    <>
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-3 py-2 flex items-center gap-2">
          {/* Logo — always goes home */}
          <button onClick={handleHome} className="flex-shrink-0 rounded-lg p-0.5 hover:opacity-80 transition-opacity" aria-label="Main menu">
            <VipLogo size="sm" />
          </button>

          {/* Page title — center */}
          <div className="flex-1 min-w-0 px-2">
            <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{pageTitle}</p>
            {screen === 'inspection' && inspectionType && (
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Main Menu › {typeLabels[inspectionType] ?? inspectionType}
              </p>
            )}
            {screen === 'quick-check' && (
              <p className="text-xs text-slate-400 dark:text-slate-500">Main Menu › Quick Safety Check</p>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Save & Exit — only during active inspection */}
            {(screen === 'inspection' || screen === 'quick-check') && (
              <button
                onClick={onSaveExit}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg text-white transition-colors"
                style={{ background: 'var(--vip-blue)' }}
                aria-label="Save and exit"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <span className="hidden sm:inline">Save &amp; Exit</span>
              </button>
            )}

            {/* Dark mode */}
            <button
              onClick={toggleDark}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              aria-label="Toggle dark mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Dropdown menu */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
          <div className="fixed top-14 right-3 z-50 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1.5 overflow-hidden">
            <MenuItem icon="🏠" label="Main Menu" onClick={handleHome} />
            <MenuItem icon="📋" label="New Full Inspection" onClick={() => { setMenuOpen(false); onNewInspection(); }} />
            <MenuItem icon="⚡" label="Quick Safety Check" onClick={() => { setMenuOpen(false); onQuickCheck(); }} />
            <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
            <MenuItem icon="🌓" label={darkMode ? 'Light Mode' : 'Dark Mode'} onClick={() => { toggleDark(); setMenuOpen(false); }} />
          </div>
        </>
      )}

      {/* Unsaved indicator dot */}
      {isDirty && (screen === 'inspection' || screen === 'quick-check') && (
        <div className="fixed top-3 left-3 z-30 w-2 h-2 rounded-full bg-amber-400 pointer-events-none" title="Unsaved changes" />
      )}
    </>
  );
}

function MenuItem({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors text-left"
    >
      <span className="text-base">{icon}</span>
      {label}
    </button>
  );
}

/* ─── Unsaved-changes dialog ─────────────────────────────────────────────── */
interface UnsavedDialogProps {
  open: boolean;
  onSaveExit: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

export function UnsavedDialog({ open, onSaveExit, onDiscard, onCancel }: UnsavedDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="text-2xl mb-3">⚠️</div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">Unsaved changes</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          Save this inspection before leaving?
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={onSaveExit}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ background: 'var(--vip-blue)' }}
          >
            💾 Save &amp; Exit
          </button>
          <button
            onClick={onDiscard}
            className="w-full py-2.5 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            Discard &amp; Exit
          </button>
          <button
            onClick={onCancel}
            className="w-full py-2 text-sm text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Saved confirmation modal ───────────────────────────────────────────── */
interface SavedModalProps {
  open: boolean;
  address: string;
  onClose: () => void;
}

export function SavedModal({ open, address, onClose }: SavedModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">Inspection Saved</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          {address ? `"${address}"` : 'Your draft'} has been saved and can be resumed later.
        </p>
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ background: 'var(--vip-blue)' }}
        >
          Return to Main Menu
        </button>
      </div>
    </div>
  );
}
