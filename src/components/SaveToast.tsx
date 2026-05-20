import { useEffect, useState } from 'react';

interface SaveToastProps {
  show: boolean;
}

export function SaveToast({ show }: SaveToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 2200);
      return () => clearTimeout(t);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-800 dark:bg-slate-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg"
      style={{
        animation: 'fadeInUp 0.2s ease-out, fadeOut 0.3s ease-in 1.9s forwards',
      }}
    >
      <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      Saved ✓
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
