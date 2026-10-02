import React from 'react';
import { AuditLogItem, SecurityPolicy } from '../types';

interface SecurityPanelsProps {
  logs: AuditLogItem[];
  policy: SecurityPolicy;
  onOpenSiemLogs: () => void;
  onOpenManagePolicies: () => void;
}

export const SecurityPanels: React.FC<SecurityPanelsProps> = ({
  logs,
  policy,
  onOpenSiemLogs,
  onOpenManagePolicies,
}) => {
  // Take top 3 logs for the display panel
  const topLogs = logs.slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Panel Left: Log Aktivitas Otentikasi & Keamanan (7 Cols) */}
      <div className="lg:col-span-7 bg-white rounded-xl p-5 shadow-xs border border-[#e2e8f0] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[#f2f4f6]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#004ac6] text-[20px]">
                security_update_good
              </span>
              <h2 className="font-semibold text-sm text-[#191c1e]">
                Log Aktivitas Otentikasi &amp; Keamanan Pengguna
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#007d55] bg-[#007d55]/10 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#007d55] animate-ping"></span>
              Realtime Stream
            </span>
          </div>

          <div className="mt-3.5 space-y-3">
            {/* Log 1: Gagal Login */}
            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#f2f4f6]/50 hover:bg-[#f2f4f6] transition-colors">
              <div className="w-7 h-7 rounded-full bg-[#ba1a1a]/10 text-[#ba1a1a] flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[16px]">warning</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-[13px] text-[#191c1e]">
                    Percobaan Login Gagal (3x Salah Password)
                  </span>
                  <span className="text-[11px] text-[#737686] font-mono">13:42:08 WIB</span>
                </div>
                <p className="text-xs text-[#434655] mt-0.5 leading-normal">
                  Target: <span className="font-semibold text-[#191c1e]">hendra.p@datacore.id</span> • IP:{' '}
                  <span className="font-mono text-[#737686]">182.253.112.44</span> (Jakarta Selatan) • Status: Akun diisolasi sementara.
                </p>
              </div>
            </div>

            {/* Log 2: Sukses 2FA Reset */}
            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#f2f4f6]/50 hover:bg-[#f2f4f6] transition-colors">
              <div className="w-7 h-7 rounded-full bg-[#007d55]/10 text-[#007d55] flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[16px]">key_vertical</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-[13px] text-[#191c1e]">
                    Pembaruan Kunci Kredensial FIDO2 / 2FA
                  </span>
                  <span className="text-[11px] text-[#737686] font-mono">12:15:33 WIB</span>
                </div>
                <p className="text-xs text-[#434655] mt-0.5 leading-normal">
                  Inisiator: <span className="font-semibold text-[#191c1e]">Anisa Danastri (Super Admin)</span> • Subjek: Rian Wicaksono (Hardware Key YubiKey terpasang).
                </p>
              </div>
            </div>

            {/* Log 3: Privilege Escalation */}
            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#f2f4f6]/50 hover:bg-[#f2f4f6] transition-colors">
              <div className="w-7 h-7 rounded-full bg-[#004ac6]/10 text-[#004ac6] flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-[13px] text-[#191c1e]">
                    Modifikasi Hak Akses Modul Keuangan
                  </span>
                  <span className="text-[11px] text-[#737686] font-mono">10:04:19 WIB</span>
                </div>
                <p className="text-xs text-[#434655] mt-0.5 leading-normal">
                  Role ditambahkan: <span className="font-semibold text-[#191c1e]">Approver Transaksi Pajak</span> ke NIK: DC-10442 melalui konsol otorisasi tier-2.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#f2f4f6] flex justify-between items-center text-xs">
          <button
            type="button"
            onClick={onOpenSiemLogs}
            className="text-[#004ac6] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Buka Audit Log Lengkap (SIEM)</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
          <span className="text-[#434655] text-xs">Retensi Log: 365 Hari</span>
        </div>
      </div>

      {/* Panel Right: Ringkasan Hak Akses & Kebijakan 2FA (5 Cols) */}
      <div className="lg:col-span-5 bg-white rounded-xl p-5 shadow-xs border border-[#e2e8f0] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[#f2f4f6]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#007d55] text-[20px]">
                verified
              </span>
              <h2 className="font-semibold text-sm text-[#191c1e]">
                Kepatuhan Autentikasi &amp; 2FA
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#f2f4f6] font-semibold text-[#191c1e] text-[11px] border border-[#e0e3e5]">
              ISO 27001
            </span>
          </div>

          <div className="mt-3.5 space-y-4">
            {/* Rate Ring / Metric */}
            <div className="flex items-center gap-4 bg-[#f2f4f6]/60 p-3.5 rounded-xl border border-[#e6e8ea]">
              {/* Inline SVG Circle Chart */}
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#e6e8ea]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  ></path>
                  <path
                    className="text-[#007d55]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="92.4, 100"
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  ></path>
                </svg>
                <span className="absolute font-bold text-[#191c1e] text-[13px] tracking-tight">
                  92.4%
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-[#191c1e]">
                  Adopsi Wajib MFA / 2FA
                </span>
                <span className="text-xs text-[#434655] mt-0.5 leading-snug">
                  2,291 dari 2,480 akun telah mengaktifkan token TOTP/Hardware Key secara patuh.
                </span>
              </div>
            </div>

            {/* SSO & SAML Status */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#f2f4f6]/60 border border-[#e6e8ea]/60">
                <span className="text-[#434655] flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-[16px] text-[#004ac6]">
                    domain
                  </span>
                  SAML 2.0 Identity Provider
                </span>
                <span className="font-semibold text-[#007d55]">Terkoneksi (Okta IDP)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#f2f4f6]/60 border border-[#e6e8ea]/60">
                <span className="text-[#434655] flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-[16px] text-[#004ac6]">
                    lock_clock
                  </span>
                  Kedaluwarsa Sesi Maksimal
                </span>
                <span className="font-semibold text-[#191c1e]">
                  {policy.maxSessionHours} Jam Operasional
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#f2f4f6]/60 border border-[#e6e8ea]/60">
                <span className="text-[#434655] flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-[16px] text-[#004ac6]">
                    policy
                  </span>
                  Rotasi Sandi Otomatis
                </span>
                <span className="font-semibold text-[#191c1e]">
                  Setiap {policy.passwordRotationDays} Hari
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#f2f4f6]">
          <button
            type="button"
            onClick={onOpenManagePolicies}
            className="w-full h-9 rounded-lg bg-[#eceef0] text-[#191c1e] hover:bg-[#e0e3e5] font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>Kelola Kebijakan Peran &amp; Akses</span>
          </button>
        </div>
      </div>
    </div>
  );
};
