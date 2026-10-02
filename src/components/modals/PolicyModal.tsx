import React, { useState } from 'react';
import { SecurityPolicy } from '../../types';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  policy: SecurityPolicy;
  onSavePolicy: (policy: SecurityPolicy) => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  policy,
  onSavePolicy,
}) => {
  const [form, setForm] = useState<SecurityPolicy>({ ...policy });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePolicy(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden border border-[#e2e8f0] animate-in zoom-in-95"
        role="dialog"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0] bg-[#f8fafc]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">policy</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 leading-tight">
                Kebijakan Keamanan Peran &amp; Akses
              </h3>
              <p className="text-xs text-slate-500">
                Standarisasi Keamanan ISO/IEC 27001 &amp; Direktori Okta SSO
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* SAML Provider */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                SAML 2.0 Identity Provider (IdP)
              </label>
              <input
                type="text"
                value={form.samlProvider}
                onChange={(e) => setForm({ ...form, samlProvider: e.target.value })}
                className="w-full h-9 px-3 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30"
              />
            </div>

            {/* Grid 2: Session and Password Rotation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kedaluwarsa Sesi Maksimal (Jam)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={form.maxSessionHours}
                    onChange={(e) => setForm({ ...form, maxSessionHours: Number(e.target.value) })}
                    className="w-full h-9 px-3 pr-10 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">Jam</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rotasi Sandi Otomatis (Hari)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={30}
                    max={365}
                    value={form.passwordRotationDays}
                    onChange={(e) => setForm({ ...form, passwordRotationDays: Number(e.target.value) })}
                    className="w-full h-9 px-3 pr-10 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">Hari</span>
                </div>
              </div>
            </div>

            {/* Grid 3: Min Password Length & Sync Interval */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Panjang Minimum Sandi
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={8}
                    max={32}
                    value={form.minPasswordLength}
                    onChange={(e) => setForm({ ...form, minPasswordLength: Number(e.target.value) })}
                    className="w-full h-9 px-3 pr-16 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">Karakter</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Interval Sinkronisasi SSO
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={5}
                    max={120}
                    value={form.oktaSyncIntervalMinutes}
                    onChange={(e) => setForm({ ...form, oktaSyncIntervalMinutes: Number(e.target.value) })}
                    className="w-full h-9 px-3 pr-12 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">Menit</span>
                </div>
              </div>
            </div>

            {/* Allowed IP Subnets */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Whitelist IP Subnet Admin (CIDR)
              </label>
              <input
                type="text"
                value={form.allowedIpSubnets}
                onChange={(e) => setForm({ ...form, allowedIpSubnets: e.target.value })}
                className="w-full h-9 px-3 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 font-mono"
                placeholder="10.0.0.0/8, 192.168.1.0/24"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Pisahkan dengan tanda koma. Hanya IP dalam rentang ini yang diizinkan mengakses panel Super Admin.
              </p>
            </div>

            {/* Enforce 2FA toggle */}
            <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-900 block">Wajibkan MFA / 2FA ke Seluruh Karyawan</span>
                <span className="text-[11px] text-slate-600">Memenuhi standar kepatuhan kontrol audit ISO 27001 A.9.4.2</span>
              </div>
              <input
                type="checkbox"
                checked={form.enforce2FA}
                onChange={(e) => setForm({ ...form, enforce2FA: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[#e2e8f0] bg-[#f8fafc]">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Tutup
            </button>
            <button
              type="submit"
              className="h-9 px-4 text-xs font-medium text-white bg-[#004ac6] hover:bg-[#2563eb] rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>Simpan Kebijakan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
