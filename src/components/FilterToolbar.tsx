import React from 'react';
import { DEPARTMENTS, ROLES } from '../data/mockData';

export type QuickPill = 'semua' | 'super-admin' | '2fa-aktif' | 'perlu-review';

interface FilterToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (dept: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  activeQuickPill: QuickPill;
  onQuickPillChange: (pill: QuickPill) => void;
  onOpenAddModal: () => void;
  onExportUsers: () => void;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedRole,
  onRoleChange,
  selectedDepartment,
  onDepartmentChange,
  selectedStatus,
  onStatusChange,
  activeQuickPill,
  onQuickPillChange,
  onOpenAddModal,
  onExportUsers,
}) => {
  return (
    <div className="bg-white rounded-xl p-3.5 shadow-xs border border-[#e2e8f0] space-y-3.5">
      {/* Top Search & Actions Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        {/* Live Search with debounced badge */}
        <div className="relative flex-1 min-w-[280px] max-w-xl">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737686] text-[20px]">
            search
          </span>
          <input
            id="search-user"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama, email, NIK, atau role..."
            className="w-full h-10 pl-10 pr-24 rounded-lg bg-[#f2f4f6] text-[#191c1e] placeholder:text-[#737686] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] transition-all border border-transparent"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none select-none">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#e6e8ea] text-[#434655] font-medium text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#007d55]"></span>
              Live 300ms
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={onExportUsers}
            className="h-10 px-3.5 rounded-lg bg-[#f2f4f6] hover:bg-[#eceef0] text-[#191c1e] text-xs font-semibold flex items-center gap-2 transition-colors border border-[#e0e3e5]"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span>Ekspor Pengguna</span>
          </button>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="h-10 px-4 rounded-lg bg-[#004ac6] hover:bg-[#2563eb] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-all hover:shadow"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            <span>+ Tambah Pengguna Baru</span>
          </button>
        </div>
      </div>

      {/* Dropdowns & Quick Pill Filters Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 pt-2 border-t border-[#f2f4f6]">
        {/* Dropdowns Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Role Dropdown */}
          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => onRoleChange(e.target.value)}
              className="appearance-none h-8 pl-3 pr-8 rounded-lg bg-[#f2f4f6] hover:bg-[#eceef0] text-[#191c1e] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#004ac6] cursor-pointer border border-[#e0e3e5]"
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[#737686] text-[16px] pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Department Dropdown */}
          <div className="relative">
            <select
              value={selectedDepartment}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className="appearance-none h-8 pl-3 pr-8 rounded-lg bg-[#f2f4f6] hover:bg-[#eceef0] text-[#191c1e] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#004ac6] cursor-pointer border border-[#e0e3e5]"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[#737686] text-[16px] pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="appearance-none h-8 pl-3 pr-8 rounded-lg bg-[#f2f4f6] hover:bg-[#eceef0] text-[#191c1e] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#004ac6] cursor-pointer border border-[#e0e3e5]"
            >
              <option value="Semua">Status Akun: Semua</option>
              <option value="Aktif">Aktif</option>
              <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[#737686] text-[16px] pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            type="button"
            onClick={() => onQuickPillChange('semua')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              activeQuickPill === 'semua'
                ? 'bg-[#2563eb] text-white shadow-xs'
                : 'bg-[#eceef0] text-[#434655] hover:text-[#191c1e]'
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => onQuickPillChange('super-admin')}
            className={`px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
              activeQuickPill === 'super-admin'
                ? 'bg-[#2563eb] text-white font-semibold shadow-xs'
                : 'bg-[#eceef0] text-[#434655] hover:text-[#191c1e]'
            }`}
          >
            Super Admin
          </button>
          <button
            type="button"
            onClick={() => onQuickPillChange('2fa-aktif')}
            className={`px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
              activeQuickPill === '2fa-aktif'
                ? 'bg-[#2563eb] text-white font-semibold shadow-xs'
                : 'bg-[#eceef0] text-[#434655] hover:text-[#191c1e]'
            }`}
          >
            2FA Aktif
          </button>
          <button
            type="button"
            onClick={() => onQuickPillChange('perlu-review')}
            className={`px-3 py-1 rounded-full text-xs transition-colors flex items-center gap-1 cursor-pointer ${
              activeQuickPill === 'perlu-review'
                ? 'bg-[#2563eb] text-white font-semibold shadow-xs'
                : 'bg-[#eceef0] text-[#434655] hover:text-[#191c1e]'
            }`}
          >
            <span>Perlu Review</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          </button>
        </div>
      </div>
    </div>
  );
};
