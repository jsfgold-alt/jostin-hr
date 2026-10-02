import React, { useEffect } from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const borderAndBg =
    toast.type === 'success'
      ? 'bg-white border-emerald-500/30 text-emerald-950'
      : toast.type === 'error'
      ? 'bg-white border-red-500/30 text-red-950'
      : toast.type === 'warning'
      ? 'bg-white border-amber-500/30 text-amber-950'
      : 'bg-white border-blue-500/30 text-blue-950';

  const iconName =
    toast.type === 'success'
      ? 'check_circle'
      : toast.type === 'error'
      ? 'error'
      : toast.type === 'warning'
      ? 'warning'
      : 'info';

  const iconColor =
    toast.type === 'success'
      ? 'text-emerald-600 bg-emerald-50'
      : toast.type === 'error'
      ? 'text-red-600 bg-red-50'
      : toast.type === 'warning'
      ? 'text-amber-600 bg-amber-50'
      : 'text-blue-600 bg-blue-50';

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2 ${borderAndBg}`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconColor}`}>
        <span className="material-symbols-outlined text-[20px]">{iconName}</span>
      </div>
      <div className="flex-1 min-w-0 pr-2">
        <h4 className="font-semibold text-sm leading-tight text-slate-900">{toast.title}</h4>
        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
        aria-label="Tutup notifikasi"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
};
