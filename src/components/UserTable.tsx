import React, { useState } from 'react';
import { UserRecord } from '../types';

interface UserTableProps {
  users: UserRecord[];
  allUsersCount: number;
  onEditUser: (user: UserRecord) => void;
  onResetCredential: (user: UserRecord) => void;
  onDeleteUser: (user: UserRecord) => void;
  onToggleStatus: (user: UserRecord) => void;
  onResendInvite: (user: UserRecord) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  onBulkResendInvites: (selectedIds: string[]) => void;
  onBulkChangeStatus: (selectedIds: string[], newStatus: 'Aktif' | 'Tidak Aktif') => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  allUsersCount,
  onEditUser,
  onResetCredential,
  onDeleteUser,
  onToggleStatus,
  onResendInvite,
  currentPage,
  onPageChange,
  pageSize,
  onPageSizeChange,
  onBulkResendInvites,
  onBulkChangeStatus,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const isAllSelected = users.length > 0 && selectedIds.length === users.length;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(users.map((u) => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-[#dbe1ff] text-[#00174b] font-semibold';
      case 'Admin Modul':
        return 'bg-blue-100 text-blue-800 font-semibold';
      case 'Verifikator':
        return 'bg-cyan-100 text-cyan-900 font-semibold';
      case 'Staff Operasional':
        return 'bg-slate-100 text-slate-800 font-semibold';
      case 'Viewer / Auditor':
        return 'bg-slate-200 text-slate-800 font-semibold';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] overflow-hidden flex flex-col">
      {/* Bulk Action Bar (appears when items are selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-[#eff6ff] border-b border-[#bfdbfe] px-4 py-2.5 flex items-center justify-between text-xs text-[#1e40af] animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{selectedIds.length}</span>
            <span>pengguna terpilih</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onBulkResendInvites(selectedIds)}
              className="px-2.5 py-1 bg-white hover:bg-blue-50 text-[#1d4ed8] border border-[#93c5fd] rounded-lg font-medium transition-colors"
            >
              Kirim Undangan / Pengingat 2FA
            </button>
            <button
              onClick={() => onBulkChangeStatus(selectedIds, 'Aktif')}
              className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-lg font-medium transition-colors"
            >
              Aktifkan Terpilih
            </button>
            <button
              onClick={() => onBulkChangeStatus(selectedIds, 'Tidak Aktif')}
              className="px-2.5 py-1 bg-white hover:bg-red-50 text-red-700 border border-red-300 rounded-lg font-medium transition-colors"
            >
              Nonaktifkan Terpilih
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-2 py-1 text-slate-600 hover:text-slate-900 underline"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Main Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="bg-[#f2f4f6]/80 h-10 border-b border-[#eceef0] text-[11px] font-semibold text-[#434655] tracking-wider uppercase">
              <th className="w-12 px-4 py-2 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-[#c3c6d7] text-[#004ac6] focus:ring-[#004ac6] accent-[#004ac6] cursor-pointer"
                />
              </th>
              <th className="px-4 py-2">PENGGUNA</th>
              <th className="px-4 py-2">ROLE / PERAN</th>
              <th className="px-4 py-2">DEPARTEMEN &amp; LOKASI</th>
              <th className="px-4 py-2">KEAMANAN &amp; SESI</th>
              <th className="px-4 py-2">STATUS</th>
              <th className="px-4 py-2 text-right pr-6">AKSI</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#f2f4f6] text-xs">
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-4xl text-slate-300">
                      person_search
                    </span>
                    <p className="font-medium text-sm text-slate-700">
                      Tidak ada pengguna yang cocok
                    </p>
                    <p className="text-xs text-slate-400">
                      Coba sesuaikan kata kunci pencarian atau bersihkan filter.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const isSelected = selectedIds.includes(user.id);
                const isPending = user.status === 'Menunggu Verifikasi';
                const isDisabled = user.status === 'Tidak Aktif';

                const rowBg = isSelected
                  ? 'bg-blue-50/50'
                  : isPending
                  ? 'bg-amber-500/5 hover:bg-amber-500/10'
                  : isDisabled
                  ? 'bg-red-500/5 hover:bg-red-500/10'
                  : 'hover:bg-[#f2f4f6]/40';

                return (
                  <tr key={user.id} className={`${rowBg} transition-colors group relative`}>
                    {/* Checkbox */}
                    <td className="px-4 py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectOne(user.id)}
                        className="w-4 h-4 rounded border-[#c3c6d7] text-[#004ac6] focus:ring-[#004ac6] accent-[#004ac6] cursor-pointer"
                      />
                    </td>

                    {/* Pengguna */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full ${
                            user.avatarBgColor || 'bg-[#dbe1ff]'
                          } ${
                            user.avatarTextColor || 'text-[#004ac6]'
                          } flex items-center justify-center font-semibold text-sm ring-2 ring-primary/20 shrink-0`}
                        >
                          {user.avatarInitials}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-[#191c1e] truncate">
                              {user.name}
                            </span>
                            {user.tag && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#004ac6]/10 text-[#004ac6] uppercase tracking-wide">
                                {user.tag}
                              </span>
                            )}
                          </div>
                          <span className="text-[#434655] text-xs truncate">{user.email}</span>
                          <span className="text-[11px] text-[#737686] font-mono">
                            NIK: {user.nik}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role / Peran */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getRoleBadge(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Departemen & Lokasi */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col">
                        <span className="text-[#191c1e] font-medium text-xs">
                          {user.department}
                        </span>
                        <span className="text-[#434655] text-xs flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-[14px] text-[#737686]">
                            location_on
                          </span>
                          {user.location}
                        </span>
                      </div>
                    </td>

                    {/* Keamanan & Sesi */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col">
                        {user.twoFactorStatus === '2FA Aktif' ? (
                          <div className="flex items-center gap-1.5 text-[#007d55] font-semibold text-xs">
                            <span className="material-symbols-outlined text-[16px] text-[#007d55]">
                              verified_user
                            </span>
                            <span>2FA Aktif</span>
                          </div>
                        ) : user.twoFactorStatus === '2FA Belum Aktif' ? (
                          <div className="flex items-center gap-1.5 text-amber-700 font-semibold text-xs">
                            <span className="material-symbols-outlined text-[16px] text-amber-600">
                              gpp_maybe
                            </span>
                            <span>2FA Belum Aktif</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-[#ba1a1a] font-semibold text-xs">
                            <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">
                              gpp_bad
                            </span>
                            <span>2FA Dinonaktifkan</span>
                          </div>
                        )}
                        <span className="text-[#434655] text-[11px] mt-0.5">{user.lastLogin}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      {user.status === 'Aktif' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Aktif
                        </span>
                      ) : user.status === 'Menunggu Verifikasi' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          Menunggu Verifikasi
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          Tidak Aktif
                        </span>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="px-4 py-3.5 text-right pr-6">
                      <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => onEditUser(user)}
                          className="p-1.5 rounded-lg text-[#434655] hover:bg-[#eceef0] hover:text-[#004ac6] transition-colors"
                          title="Edit Pengguna"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>

                        {/* Reset Key or Kirim Undangan or Aktifkan */}
                        {isPending ? (
                          <button
                            type="button"
                            onClick={() => onResendInvite(user)}
                            className="p-1.5 rounded-lg text-[#004ac6] hover:bg-[#004ac6]/10 transition-colors flex items-center gap-1 text-xs font-semibold px-2"
                            title="Kirim Ulang Undangan Aktivasi"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              forward_to_inbox
                            </span>
                            <span className="hidden xl:inline">Kirim Undangan</span>
                          </button>
                        ) : isDisabled ? (
                          <button
                            type="button"
                            onClick={() => onToggleStatus(user)}
                            className="p-1.5 rounded-lg text-[#007d55] hover:bg-[#007d55]/10 transition-colors flex items-center gap-1 text-xs font-semibold px-2"
                            title="Aktifkan Akun Kembali"
                          >
                            <span className="material-symbols-outlined text-[16px]">lock_open</span>
                            <span className="hidden xl:inline">Aktifkan</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onResetCredential(user)}
                            className="p-1.5 rounded-lg text-[#434655] hover:bg-[#eceef0] hover:text-amber-600 transition-colors"
                            title="Reset Password / Kunci 2FA"
                          >
                            <span className="material-symbols-outlined text-[18px]">key</span>
                          </button>
                        )}

                        {/* Delete / Deactivate */}
                        <button
                          type="button"
                          onClick={() => onDeleteUser(user)}
                          className="p-1.5 rounded-lg text-[#434655] hover:bg-[#eceef0] hover:text-[#ba1a1a] transition-colors"
                          title={isDisabled ? 'Hapus Permanen' : 'Nonaktifkan Akun'}
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>

                        {/* More dropdown */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenuId(activeMenuId === user.id ? null : user.id)
                            }
                            className="p-1.5 rounded-lg text-[#434655] hover:bg-[#eceef0] hover:text-[#191c1e] transition-colors"
                            title="Lainnya"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              more_vert
                            </span>
                          </button>

                          {activeMenuId === user.id && (
                            <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-[#e2e8f0] p-1 z-30 text-left">
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onEditUser(user);
                                }}
                                className="w-full px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                              >
                                <span className="material-symbols-outlined text-[16px] text-slate-400">
                                  visibility
                                </span>
                                <span>Lihat Profil</span>
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  navigator.clipboard.writeText(user.email);
                                }}
                                className="w-full px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                              >
                                <span className="material-symbols-outlined text-[16px] text-slate-400">
                                  content_copy
                                </span>
                                <span>Salin Email</span>
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onResetCredential(user);
                                }}
                                className="w-full px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                              >
                                <span className="material-symbols-outlined text-[16px] text-slate-400">
                                  vpn_key
                                </span>
                                <span>Kredensial Sesi</span>
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onToggleStatus(user);
                                }}
                                className={`w-full px-2.5 py-1.5 text-xs rounded-lg flex items-center gap-2 ${
                                  user.status === 'Aktif'
                                    ? 'text-red-600 hover:bg-red-50'
                                    : 'text-emerald-600 hover:bg-emerald-50'
                                }`}
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  {user.status === 'Aktif' ? 'block' : 'check_circle'}
                                </span>
                                <span>
                                  {user.status === 'Aktif' ? 'Bekukan Akun' : 'Aktifkan Akun'}
                                </span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Footer */}
      <div className="h-14 px-6 bg-[#f2f4f6]/30 border-t border-[#eceef0] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-3.5 text-[#434655] text-xs">
          <span>
            Menampilkan <strong className="text-[#191c1e] font-semibold">{users.length > 0 ? 1 : 0}-{users.length}</strong>{' '}
            dari <strong className="text-[#191c1e] font-semibold">{allUsersCount.toLocaleString()}</strong> pengguna
          </span>
          <div className="hidden sm:flex items-center gap-2">
            <span>Tampilkan:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-7 px-2 rounded-md bg-white text-[#191c1e] border border-[#c3c6d7] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#004ac6] cursor-pointer"
            >
              <option value={5}>5 per halaman</option>
              <option value={10}>10 per halaman</option>
              <option value={20}>20 per halaman</option>
              <option value={50}>50 per halaman</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs self-end sm:self-auto select-none">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="h-8 px-2.5 rounded-lg border border-[#e6e8ea] text-[#434655] hover:bg-[#f2f4f6] transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            Sebelumnya
          </button>
          <button
            type="button"
            onClick={() => onPageChange(1)}
            className={`w-8 h-8 rounded-lg font-semibold transition-colors cursor-pointer ${
              currentPage === 1
                ? 'bg-[#004ac6] text-white shadow-2xs'
                : 'border border-[#e6e8ea] text-[#191c1e] hover:bg-[#f2f4f6]'
            }`}
          >
            1
          </button>
          <button
            type="button"
            onClick={() => onPageChange(2)}
            className={`w-8 h-8 rounded-lg font-semibold transition-colors cursor-pointer ${
              currentPage === 2
                ? 'bg-[#004ac6] text-white shadow-2xs'
                : 'border border-[#e6e8ea] text-[#191c1e] hover:bg-[#f2f4f6]'
            }`}
          >
            2
          </button>
          <button
            type="button"
            onClick={() => onPageChange(3)}
            className={`w-8 h-8 rounded-lg font-semibold transition-colors cursor-pointer ${
              currentPage === 3
                ? 'bg-[#004ac6] text-white shadow-2xs'
                : 'border border-[#e6e8ea] text-[#191c1e] hover:bg-[#f2f4f6]'
            }`}
          >
            3
          </button>
          <button
            type="button"
            onClick={() => onPageChange(4)}
            className={`w-8 h-8 rounded-lg font-semibold transition-colors cursor-pointer ${
              currentPage === 4
                ? 'bg-[#004ac6] text-white shadow-2xs'
                : 'border border-[#e6e8ea] text-[#191c1e] hover:bg-[#f2f4f6]'
            }`}
          >
            4
          </button>
          <span className="px-1 text-[#737686]">...</span>
          <button
            type="button"
            onClick={() => onPageChange(124)}
            className={`w-8 h-8 rounded-lg font-semibold transition-colors cursor-pointer ${
              currentPage === 124
                ? 'bg-[#004ac6] text-white shadow-2xs'
                : 'border border-[#e6e8ea] text-[#191c1e] hover:bg-[#f2f4f6]'
            }`}
          >
            124
          </button>
          <button
            type="button"
            disabled={currentPage === 124}
            onClick={() => onPageChange(currentPage + 1)}
            className="h-8 px-2.5 rounded-lg border border-[#e6e8ea] text-[#434655] hover:bg-[#f2f4f6] transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
};
