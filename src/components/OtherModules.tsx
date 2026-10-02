import React from 'react';
import { ActiveModule } from './Sidebar';

interface OtherModulesProps {
  module: ActiveModule;
  onNavigateToUsers: () => void;
}

export const OtherModules: React.FC<OtherModulesProps> = ({ module, onNavigateToUsers }) => {
  const getModuleInfo = () => {
    switch (module) {
      case 'data-master':
        return {
          title: 'Manajemen Data Master',
          subtitle: 'Katalog terpusat entitas master data organisasi, cabang, dan hierarki operasional.',
          breadcrumb: 'Sistem Inti > Master Data > Katalog',
          sections: [
            { name: 'Hierarki Organisasi & Divisi', count: '14 Divisi', icon: 'account_tree' },
            { name: 'Katalog Wilayah & Kantor Cabang', count: '28 Cabang', icon: 'storefront' },
            { name: 'Klasifikasi Jabatan & Grading', count: '42 Level', icon: 'badge' },
            { name: 'Kamus Aset & Pusat Biaya (Cost Center)', count: '180 Unit', icon: 'account_balance' },
          ],
        };
      case 'laporan':
        return {
          title: 'Laporan & Analitika Audit',
          subtitle: 'Laporan kepatuhan keamanan informasi, audit trail transaksi, dan efisiensi sesi direktori.',
          breadcrumb: 'Sistem Inti > Analitika > Laporan Terjadwal',
          sections: [
            { name: 'Laporan Kepatuhan ISO 27001 Bulanan', count: 'Generated Kemarin', icon: 'verified' },
            { name: 'Rekapitulasi Aktivitas Pengguna Q3', count: '2,480 Akun', icon: 'assessment' },
            { name: 'Insiden Keamanan & Anomali Login', count: '3 Insiden (Terkendali)', icon: 'shield_with_heart' },
            { name: 'Matriks Hak Akses & Matriks Segregation of Duties', count: 'Updated Hari Ini', icon: 'table_view' },
          ],
        };
      case 'pengaturan':
        return {
          title: 'Pengaturan Sistem Global',
          subtitle: 'Konfigurasi integrasi SSO Okta, webhook audit SIEM, batas rate limit API, dan preferensi tenant.',
          breadcrumb: 'Sistem Inti > Konfigurasi > Pengaturan Global',
          sections: [
            { name: 'Konektor Okta & Azure AD (SAML 2.0)', count: 'Status: Terhubung', icon: 'hub' },
            { name: 'Enkripsi & Rotasi Kunci TLS/KMS', count: 'Algoritma AES-256-GCM', icon: 'key' },
            { name: 'Webhook Notifikasi Slack & SIEM', count: '2 Webhook Aktif', icon: 'notifications_active' },
            { name: 'Audit Log Archiving ke Cloud Storage', count: 'Retensi 365 Hari', icon: 'cloud_sync' },
          ],
        };
      default:
        return {
          title: 'Modul Sistem',
          subtitle: '',
          breadcrumb: '',
          sections: [],
        };
    }
  };

  const info = getModuleInfo();

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-[#434655] text-xs">
            <span>{info.breadcrumb}</span>
          </div>
          <h1 className="text-2xl font-bold text-[#191c1e] tracking-tight mt-1">
            {info.title}
          </h1>
          <p className="text-sm text-[#434655]">{info.subtitle}</p>
        </div>

        <button
          onClick={onNavigateToUsers}
          className="self-start md:self-auto h-9 px-3.5 rounded-lg bg-[#2563eb] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs hover:bg-[#1d4ed8] transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Kembali ke Modul Pengguna</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {info.sections.map((item, idx) => (
          <div
            key={idx}
            className="p-5 bg-white rounded-xl border border-[#e2e8f0] shadow-xs hover:shadow-md transition-all flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-[#2563eb]/10 text-[#004ac6] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-[#191c1e] leading-snug">{item.name}</h3>
              <p className="text-xs text-[#007d55] font-semibold mt-1">{item.count}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[11px] text-[#2563eb] font-semibold flex items-center gap-0.5 hover:underline cursor-pointer">
                  Buka Konfigurasi
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
