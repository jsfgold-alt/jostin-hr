import React, { useState, useRef, useEffect } from 'react';
import { ActiveModule } from './Sidebar';

interface HeaderProps {
  globalSearch: string;
  onGlobalSearchChange: (query: string) => void;
  onOpenAuditLogs: () => void;
  onOpenPolicies: () => void;
  activeModule?: ActiveModule;
  onSelectModule?: (module: ActiveModule) => void;
}

export const Header: React.FC<HeaderProps> = ({
  globalSearch,
  onGlobalSearchChange,
  onOpenAuditLogs,
  onOpenPolicies,
  activeModule,
  onSelectModule,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 'notif-1',
      title: 'Percobaan login gagal terisolasi',
      time: '13:42 WIB',
      desc: 'Target hendra.p@datacore.id dari IP 182.253.112.44',
      unread: true,
      icon: 'warning',
      color: 'text-red-500 bg-red-50',
    },
    {
      id: 'notif-2',
      title: '28 pengguna menunggu verifikasi 2FA',
      time: '12:00 WIB',
      desc: 'Undangan aktivasi dikirimkan ke direktori pengguna baru',
      unread: true,
      icon: 'schedule',
      color: 'text-amber-500 bg-amber-50',
    },
    {
      id: 'notif-3',
      title: 'Sinkronisasi Okta AD Berhasil',
      time: '09:00 WIB',
      desc: '2,480 entitas direktori terverifikasi patuh ISO 27001',
      unread: false,
      icon: 'check_circle',
      color: 'text-emerald-500 bg-emerald-50',
    },
  ];

  return (
    <>
      <header className="fixed top-0 left-64 right-0 h-16 bg-white/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e2e8f0] z-30 flex items-center justify-between px-6">
        {/* Global Search Bar */}
        <div className="flex items-center w-96">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737686] text-[20px]">
              search
            </span>
            <input
              type="search"
              value={globalSearch}
              onChange={(e) => onGlobalSearchChange(e.target.value)}
              placeholder="Cari data master, pengguna, log audit..."
              className="w-full h-9 pl-10 pr-4 rounded-xl bg-[#f2f4f6] text-[#191c1e] placeholder:text-[#737686] text-sm focus:outline-none focus:ring-1 focus:ring-[#004ac6] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Quick Module Switcher */}
        {onSelectModule && (
          <button
            type="button"
            onClick={() => onSelectModule(activeModule === 'kanban' ? 'pengguna' : 'kanban')}
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              activeModule === 'kanban'
                ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-xs'
                : 'bg-white text-[#434655] border-[#e2e8f0] hover:bg-[#f8fafc] hover:text-[#004ac6]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">
              {activeModule === 'kanban' ? 'group' : 'view_kanban'}
            </span>
            <span>{activeModule === 'kanban' ? 'Kembali ke Direktori Pengguna' : 'Roadmap & Kanban Fitur'}</span>
            {activeModule !== 'kanban' && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            )}
          </button>
        )}

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Notifications button */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (unreadCount > 0) setUnreadCount(0);
              }}
              className="relative p-2 rounded-xl text-[#434655] hover:bg-[#eceef0] hover:text-[#191c1e] transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#e2e8f0] p-3 animate-in fade-in zoom-in-95 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-900">Notifikasi Keamanan</span>
                  <span className="text-[10px] text-slate-500">Semua Terbaru</span>
                </div>
                <div className="divide-y divide-slate-100 mt-1 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-2.5 px-1 hover:bg-slate-50 rounded-lg transition-colors flex items-start gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${n.color}`}>
                        <span className="material-symbols-outlined text-[16px]">{n.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-800 truncate">{n.title}</p>
                          <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{n.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      onOpenAuditLogs();
                    }}
                    className="text-xs font-medium text-[#004ac6] hover:underline"
                  >
                    Buka Log Audit Lengkap (SIEM)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Help & Docs */}
          <button
            type="button"
            aria-label="Help & Docs"
            onClick={() => setShowHelp(true)}
            className="p-2 rounded-xl text-[#434655] hover:bg-[#eceef0] hover:text-[#191c1e] transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">help_outline</span>
          </button>

          {/* Vertical divider */}
          <div className="h-6 w-px bg-[#e6e8ea]"></div>

          {/* User Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <div
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 cursor-pointer select-none py-1 px-1.5 rounded-xl hover:bg-[#eceef0]/60 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#004ac6] flex items-center justify-center shadow-2xs">
                <span className="material-symbols-outlined text-white text-[18px]">person</span>
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-[#191c1e] leading-tight">
                  Admin Operasional
                </span>
                <span className="text-[11px] text-[#434655]">Super Admin</span>
              </div>
              <span className="material-symbols-outlined text-[#737686] text-[18px]">
                expand_more
              </span>
            </div>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#e2e8f0] p-1.5 animate-in fade-in zoom-in-95 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="font-semibold text-slate-800">Admin Operasional</p>
                  <p className="text-[11px] text-slate-500 font-mono">admin.secops@datacore.id</p>
                  <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#dbe1ff] text-[#004ac6]">
                    TIER 1 AUTHORIZED
                  </span>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenPolicies();
                    }}
                    className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px] text-slate-500">policy</span>
                    <span>Kebijakan Keamanan Peran</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenAuditLogs();
                    }}
                    className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px] text-slate-500">list_alt</span>
                    <span>Log Aktivitas Sesi</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-[#e2e8f0] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#004ac6] text-[22px]">help</span>
                <h3 className="font-semibold text-slate-900 text-sm">Pusat Bantuan &amp; Dokumentasi DataCore</h3>
              </div>
              <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-600">
              <p><strong>Manajemen Pengguna:</strong> Modul ini memungkinkan Super Admin mengelola direktori karyawan, NIK, peran RBAC, dan aktivasi 2FA.</p>
              <p><strong>Integrasi Okta SSO:</strong> Pengguna terdaftar secara otomatis disinkronkan ke Okta Active Directory melalui protokol SCIM v2.</p>
              <p><strong>Kebijakan Sandi:</strong> Rotasi sandi wajib setiap 90 hari sesuai standar kepatuhan ISO 27001.</p>
            </div>
            <div className="pt-2 text-right">
              <button
                onClick={() => setShowHelp(false)}
                className="h-8 px-4 text-xs font-medium text-white bg-[#004ac6] rounded-lg"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
