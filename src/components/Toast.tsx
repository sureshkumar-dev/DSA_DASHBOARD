import { useState, useCallback, useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

interface Toast { id: string; message: string; type: 'success' | 'error' | 'info'; }

let toastFn: ((msg: string, type?: Toast['type']) => void) | null = null;

export function showToast(message: string, type: Toast['type'] = 'info') {
  toastFn?.(message, type);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  useEffect(() => { toastFn = add; return () => { toastFn = null; }; }, [add]);

  const icons = { success: CheckCircle, error: XCircle, info: Info };

  return (
    <div className="toast-container">
      {toasts.map(t => {
        const Icon = icons[t.type];
        return (
          <div key={t.id} className={`toast ${t.type}`}>
            <Icon size={16} />
            <span style={{ flex: 1 }}>{t.message}</span>
            <button onClick={() => setToasts(ts => ts.filter(x => x.id !== t.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}><X size={14} /></button>
          </div>
        );
      })}
    </div>
  );
}
