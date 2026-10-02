import React, { useState } from 'react';
import { UserRecord } from '../../types';

interface ResetCredentialModalProps {
  isOpen: boolean;
  user: UserRecord | null;
  onClose: () => void;
  onConfirm: (actionType: string, newPassword?: string) => void;
}

export const ResetCredentialModal: React.FC<ResetCredentialModalProps> = ({
  isOpen,
  user,
  onClose,
  onConfirm,
}) => {
  const [resetType, setResetType] = useState<'link' | 'temp' | '2fa' | 'both'>('temp');
  const [tempPassword, setTempPassword] = useState('DC@Pass#2026!');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !user) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecute = () => {
    onConfirm(resetType, resetType === 'temp' || resetType === 'both' ? tempPassword : undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-[#e2e8f0] animate-in zoom-in-95"
        role="dialog"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e2e8f0] bg-[#f8fafc]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">key</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 leading-tight">
                Reset Kredensial &amp; 2FA
              </h3>
              <p className="text-xs text-slate-500">
                Pengguna: <strong className="text-slate-700">{user.name}</strong> ({user.nik})
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

        <div className="p-5 space-y-4">
          <div className="text-xs text-slate-600">
            Pilih tindakan keamanan yang akan diterapkan ke akun <span className="font-semibold text-slate-800">{user.email}</span>:
          </div>

          <div className="space-y-2">
            <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
              resetType === 'temp' ? 'border-[#2563eb] bg-blue-50/30 ring-1 ring-[#2563eb]/20' : 'border-slate-200 hover:bg-slate-50'
            }`}>
              <input
                type="radio"
                name="resetOption"
                checked={resetType === 'temp'}
                onChange={() => setResetType('temp')}
                className="mt-0.5 text-[#2563eb] focus:ring-[#2563eb]"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-900 block">Buat Kata Sandi Sementara (One-Time)</span>
                Sistem menghasilkan kata sandi darurat yang wajib diubah saat login pertama.
              </div>
            </label>

            <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
              resetType === 'link' ? 'border-[#2563eb] bg-blue-50/30 ring-1 ring-[#2563eb]/20' : 'border-slate-200 hover:bg-slate-50'
            }`}>
              <input
                type="radio"
                name="resetOption"
                checked={resetType === 'link'}
                onChange={() => setResetType('link')}
                className="mt-0.5 text-[#2563eb] focus:ring-[#2563eb]"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-900 block">Kirim Tautan Reset ke Email</span>
                Tautan verifikasi aman dikirimkan ke email terdaftar dengan masa berlaku 15 menit.
              </div>
            </label>

            <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
              resetType === '2fa' ? 'border-[#2563eb] bg-blue-50/30 ring-1 ring-[#2563eb]/20' : 'border-slate-200 hover:bg-slate-50'
            }`}>
              <input
                type="radio"
                name="resetOption"
                checked={resetType === '2fa'}
                onChange={() => setResetType('2fa')}
                className="mt-0.5 text-[#2563eb] focus:ring-[#2563eb]"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-900 block">Reset Token 2FA / FIDO2 Hardware Key</span>
                Hapus perangkat authenticator yang terdaftar dan minta pendaftaran ulang.
              </div>
            </label>
          </div>

          {(resetType === 'temp' || resetType === 'both') && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-slate-700">Kata Sandi Sementara:</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-[11px] text-[#2563eb] hover:underline flex items-center gap-1 font-medium"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {copied ? 'check' : 'content_copy'}
                  </span>
                  <span>{copied ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
              <div className="font-mono text-sm font-semibold tracking-wider text-slate-900 bg-white px-3 py-1.5 rounded border border-slate-200">
                {tempPassword}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[#e2e8f0] bg-[#f8fafc]">
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-3 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleExecute}
            className="h-8 px-3 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">lock_reset</span>
            <span>Terapkan Reset Kredensial</span>
          </button>
        </div>
      </div>
    </div>
  );
};
