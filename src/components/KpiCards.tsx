import React from 'react';

interface KpiCardsProps {
  totalCount: number;
  activeCount: number;
  pendingCount: number;
  disabledCount: number;
  selectedFilter: string;
  onFilterSelect: (filter: string) => void;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  totalCount,
  activeCount,
  pendingCount,
  disabledCount,
  selectedFilter,
  onFilterSelect,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Card 1: Total Pengguna */}
      <div
        onClick={() => onFilterSelect('all')}
        className={`bg-white rounded-xl p-5 shadow-xs border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group hover:shadow-md ${
          selectedFilter === 'all' ? 'border-[#2563eb] ring-1 ring-[#2563eb]/30' : 'border-[#e2e8f0]'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-[#434655]">Total Pengguna Terdaftar</span>
            <span className="text-3xl text-[#191c1e] font-bold tracking-tight mt-1 tabular-nums">
              {totalCount.toLocaleString()}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#004ac6]/10 text-[#004ac6] flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">group</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#f2f4f6] text-[#434655] text-xs">
          <span className="flex items-center font-medium text-[#007d55]">
            <span className="material-symbols-outlined text-[16px] mr-0.5">trending_up</span>+8%
          </span>
          <span>pertumbuhan bln ini</span>
        </div>
      </div>

      {/* Card 2: Pengguna Aktif */}
      <div
        onClick={() => onFilterSelect('active')}
        className={`bg-white rounded-xl p-5 shadow-xs border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group hover:shadow-md ${
          selectedFilter === 'active' ? 'border-[#007d55] ring-1 ring-[#007d55]/30' : 'border-[#e2e8f0]'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-[#434655]">Pengguna Aktif</span>
            <span className="text-3xl text-[#191c1e] font-bold tracking-tight mt-1 tabular-nums">
              {activeCount.toLocaleString()}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#007d55]/10 text-[#007d55] flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">check_circle</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#f2f4f6] text-[#434655] text-xs">
          <span className="font-semibold text-[#007d55]">94.5%</span>
          <span>online dalam 7 hari terakhir</span>
        </div>
      </div>

      {/* Card 3: Menunggu Verifikasi */}
      <div
        onClick={() => onFilterSelect('pending')}
        className={`bg-white rounded-xl p-5 shadow-xs border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group hover:shadow-md ${
          selectedFilter === 'pending' ? 'border-amber-500 ring-1 ring-amber-500/30' : 'border-[#e2e8f0]'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-[#434655]">Menunggu Verifikasi</span>
            <span className="text-3xl text-[#191c1e] font-bold tracking-tight mt-1 tabular-nums">
              {pendingCount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">schedule</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-[#f2f4f6] text-amber-700 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span>Menunggu aktivasi email / setup 2FA</span>
        </div>
      </div>

      {/* Card 4: Akun Dinonaktifkan */}
      <div
        onClick={() => onFilterSelect('disabled')}
        className={`bg-white rounded-xl p-5 shadow-xs border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group hover:shadow-md ${
          selectedFilter === 'disabled' ? 'border-[#ba1a1a] ring-1 ring-[#ba1a1a]/30' : 'border-[#e2e8f0]'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-[#434655]">Akun Dinonaktifkan</span>
            <span className="text-3xl text-[#191c1e] font-bold tracking-tight mt-1 tabular-nums">
              {disabledCount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#ba1a1a]/10 text-[#ba1a1a] flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">block</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-[#f2f4f6] text-[#434655] text-xs">
          <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">info</span>
          <span>Suspended, offboard, atau audit lock</span>
        </div>
      </div>
    </div>
  );
};
