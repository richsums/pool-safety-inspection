import { useRef } from 'react';
// @ts-ignore
import SignatureCanvas from 'react-signature-canvas';
import { useStore } from '../store';

function SigPad({
  label,
  sigRef,
  onSave,
  saved,
  onClear,
}: {
  label: string;
  sigRef: React.MutableRefObject<any>;
  onSave: () => void;
  saved: string;
  onClear: () => void;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{label}</p>
      {saved ? (
        <div>
          <img src={saved} alt="signature" className="h-20 border border-slate-200 dark:border-slate-700 rounded bg-white" />
          <button onClick={onClear} className="mt-2 text-xs text-red-500 hover:text-red-700">
            Clear &amp; redo
          </button>
        </div>
      ) : (
        <div>
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden bg-white">
            <SignatureCanvas
              ref={sigRef}
              penColor="#1e3a5f"
              canvasProps={{ width: 400, height: 120, className: 'w-full' }}
              onEnd={onSave}
            />
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => { sigRef.current?.clear(); onSave(); }}
              className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Clear
            </button>
            <button onClick={onSave} className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function SignaturePanel() {
  const inspectorSig = useStore(s => s.inspectorSignature);
  const clientSig = useStore(s => s.clientSignature);
  const setInspectorSig = useStore(s => s.setInspectorSignature);
  const setClientSig = useStore(s => s.setClientSignature);
  const inspectorRef = useRef<any>(null);
  const clientRef = useRef<any>(null);
  const info = useStore(s => s.propertyInfo);

  const saveInspector = () => {
    if (inspectorRef.current && !inspectorRef.current.isEmpty()) {
      setInspectorSig(inspectorRef.current.getTrimmedCanvas().toDataURL('image/png'));
    }
  };

  const saveClient = () => {
    if (clientRef.current && !clientRef.current.isEmpty()) {
      setClientSig(clientRef.current.getTrimmedCanvas().toDataURL('image/png'));
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-slate-800 dark:text-white">Signatures</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SigPad
          label={`Inspector Signature${info.inspectorName ? ` — ${info.inspectorName}` : ''}`}
          sigRef={inspectorRef}
          onSave={saveInspector}
          saved={inspectorSig}
          onClear={() => setInspectorSig('')}
        />
        <SigPad
          label={`Client/Owner Signature${info.clientName ? ` — ${info.clientName}` : ''}`}
          sigRef={clientRef}
          onSave={saveClient}
          saved={clientSig}
          onClear={() => setClientSig('')}
        />
      </div>
    </div>
  );
}
