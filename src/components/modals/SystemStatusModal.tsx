import React from 'react';

interface SystemStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemStatusModal: React.FC<SystemStatusModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-[#e2e8f0] animate-in zoom-in-95"
        role="dialog"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e2e8f0] bg-[#f8fafc]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">shield</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 leading-tight">
                Status Sistem &amp; Node Cluster
              </h3>
              <p className="text-xs text-slate-500">
                DataCore Core Engine v4.2 · Status Operasional Normal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-5 space-y-3.5 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200/60">
            <span className="font-medium text-emerald-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Koneksi Direktori Utama
            </span>
            <span className="font-semibold text-emerald-700">99.98% Uptime</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Node Gateway</span>
              <span className="font-mono font-medium text-slate-800">ap-southeast-1a (Jakarta)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Active Directory Sync</span>
              <span className="font-semibold text-slate-800">Okta SAML 2.0 (Terhubung)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Rata-rata Latensi API</span>
              <span className="font-mono text-emerald-600 font-semibold">24 ms</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Sesi Aktif Bersamaan</span>
              <span className="font-mono font-semibold text-slate-800">1,842 Pengguna</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Sertifikat SSL / TLS</span>
              <span className="text-slate-800">DigiCert Global Root G2 (Aktif s.d 2028)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end px-5 py-3 border-t border-[#e2e8f0] bg-[#f8fafc]">
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
