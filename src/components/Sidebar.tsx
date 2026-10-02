import React from 'react';

export type ActiveModule = 'pengguna' | 'kanban' | 'data-master' | 'laporan' | 'pengaturan';

interface SidebarProps {
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
  onOpenSystemStatus: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  onOpenSystemStatus,
}) => {
  const menuItems: { id: ActiveModule; label: string; icon: string; badge?: string }[] = [
    { id: 'pengguna', label: 'Pengguna & Akses', icon: 'group' },
    { id: 'kanban', label: 'Roadmap & Kanban', icon: 'view_kanban', badge: '16 Fitur' },
    { id: 'data-master', label: 'Data Master', icon: 'database' },
    { id: 'laporan', label: 'Laporan', icon: 'assessment' },
    { id: 'pengaturan', label: 'Pengaturan', icon: 'settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-[#e2e8f0] shadow-[0_1px_8px_rgba(0,0,0,0.03)] z-40 flex flex-col select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 gap-3 border-b border-[#f1f5f9]">
        <div className="w-9 h-9 rounded-xl bg-[#2563eb] flex items-center justify-center text-white font-bold text-lg shadow-xs">
          D
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-base text-[#191c1e] tracking-tight leading-none">
            DataCore
          </span>
          <span className="text-xs text-[#57657a] font-medium mt-0.5">
            Enterprise Platform
          </span>
        </div>
      </div>

      {/* Module category label */}
      <div className="px-4 py-3">
        <span className="text-[11px] font-semibold text-[#737686] uppercase tracking-wider px-2">
          Modul Sistem
        </span>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-colors text-left cursor-pointer ${
                isActive
                  ? 'bg-[#2563eb] text-white font-semibold shadow-xs'
                  : 'text-[#434655] font-medium hover:bg-[#eceef0] hover:text-[#191c1e]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`material-symbols-outlined text-[19px] ${isActive ? 'text-white' : 'text-[#737686]'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[#2563eb]/10 text-[#004ac6]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status bottom widget */}
      <div className="p-3 m-3">
        <button
          type="button"
          onClick={onOpenSystemStatus}
          className="w-full p-3 rounded-xl bg-[#f2f4f6] hover:bg-[#e6e8ea] transition-colors flex items-center gap-3 text-left border border-[#e0e3e5]"
          title="Klik untuk diagnosa status sistem"
        >
          <span className="material-symbols-outlined text-[#004ac6] text-[22px]">
            shield
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#191c1e]">
              Status Sistem
            </span>
            <span className="text-xs text-[#007d55] font-semibold flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#007d55] inline-block"></span>
              Terhubung
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
};
