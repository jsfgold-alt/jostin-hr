import React, { useState, useEffect } from 'react';
import { UserRecord, RoleType, AccountStatus, TwoFactorStatus } from '../../types';
import { DEPARTMENTS, ROLES, LOCATIONS } from '../../data/mockData';

interface AddEditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Partial<UserRecord>) => void;
  editingUser?: UserRecord | null;
}

export const AddEditUserModal: React.FC<AddEditUserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingUser,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nik, setNik] = useState('');
  const [tag, setTag] = useState('');
  const [role, setRole] = useState<RoleType>('Staff Operasional');
  const [department, setDepartment] = useState('IT Infrastructure & Cloud');
  const [location, setLocation] = useState('Headquarter Jakarta');
  const [status, setStatus] = useState<AccountStatus>('Aktif');
  const [twoFactorRequired, setTwoFactorRequired] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name);
      setEmail(editingUser.email);
      setNik(editingUser.nik);
      setTag(editingUser.tag || '');
      setRole(editingUser.role);
      setDepartment(editingUser.department);
      setLocation(editingUser.location);
      setStatus(editingUser.status);
      setTwoFactorRequired(editingUser.twoFactorStatus === '2FA Aktif');
    } else {
      setName('');
      setEmail('');
      setNik(`DC-${Math.floor(10000 + Math.random() * 9000)}`);
      setTag('');
      setRole('Staff Operasional');
      setDepartment('Operasional Sistem');
      setLocation('Headquarter Jakarta');
      setStatus('Aktif');
      setTwoFactorRequired(true);
    }
    setErrors({});
  }, [editingUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Nama lengkap wajib diisi.';
    if (!email.trim()) {
      newErrors.email = 'Alamat email wajib diisi.';
    } else if (!email.includes('@') || !email.includes('.')) {
      newErrors.email = 'Format email tidak valid.';
    }
    if (!nik.trim()) newErrors.nik = 'NIK wajib diisi.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const initials = name
      .trim()
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join('');

    const twoFactorStatus: TwoFactorStatus = twoFactorRequired
      ? '2FA Aktif'
      : '2FA Belum Aktif';

    onSave({
      ...(editingUser ? { id: editingUser.id } : {}),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      nik: nik.trim().toUpperCase(),
      tag: tag.trim() ? tag.trim().toUpperCase() : undefined,
      role,
      department,
      location,
      status,
      twoFactorStatus,
      avatarInitials: initials || 'DC',
      avatarBgColor: editingUser?.avatarBgColor || 'bg-primary-fixed',
      avatarTextColor: editingUser?.avatarTextColor || 'text-primary',
      lastLogin: editingUser?.lastLogin || 'Baru dibuat',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden border border-[#e2e8f0] animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0] bg-[#f8fafc]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2563eb]/10 text-[#004ac6] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">
                {editingUser ? 'manage_accounts' : 'person_add'}
              </span>
            </div>
            <div>
              <h3 id="modal-title" className="text-base font-semibold text-slate-900 leading-tight">
                {editingUser ? 'Ubah Data Pengguna' : 'Tambah Pengguna Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                {editingUser
                  ? 'Perbarui hak akses, departemen, dan profil autentikasi'
                  : 'Daftarkan pengguna enterprise ke direktori SSO DataCore'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Row 1: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Anisa Danastri"
                  className={`w-full h-9 px-3 text-sm rounded-lg border ${
                    errors.name ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                  } focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]`}
                />
                {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Email Korporat <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@datacore.id"
                  className={`w-full h-9 px-3 text-sm rounded-lg border ${
                    errors.email ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                  } focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]`}
                />
                {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Row 2: NIK & Badge Tag */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Induk Karyawan (NIK) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  placeholder="DC-10928"
                  className={`w-full h-9 px-3 text-sm font-mono rounded-lg border ${
                    errors.nik ? 'border-red-500' : 'border-slate-300'
                  } focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]`}
                />
                {errors.nik && <p className="text-[11px] text-red-600 mt-1">{errors.nik}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tag Khusus (Opsional)
                </label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="Misal: STAFF UTAMA, LEAD"
                  className="w-full h-9 px-3 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]"
                />
              </div>
            </div>

            {/* Row 3: Role & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Peran / Hak Akses (RBAC) <span className="text-red-500">*</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as RoleType)}
                  className="w-full h-9 px-3 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]"
                >
                  {ROLES.filter((r) => r !== 'Semua Peran (Role)').map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Departemen <span className="text-red-500">*</span>
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-9 px-3 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]"
                >
                  {DEPARTMENTS.filter((d) => d !== 'Semua Departemen').map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 4: Location & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lokasi Kerja
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-9 px-3 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]"
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status Akun
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as AccountStatus)}
                  className="w-full h-9 px-3 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </select>
              </div>
            </div>

            {/* 2FA Policy Checkbox */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3">
              <input
                type="checkbox"
                id="modal-2fa"
                checked={twoFactorRequired}
                onChange={(e) => setTwoFactorRequired(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-[#2563eb] border-slate-300 focus:ring-[#2563eb] cursor-pointer"
              />
              <label htmlFor="modal-2fa" className="text-xs text-slate-700 cursor-pointer select-none">
                <span className="font-semibold text-slate-900 block">Wajibkan Autentikasi 2FA (TOTP / FIDO2)</span>
                Pengguna akan diwajibkan mendaftarkan token autentikasi atau kunci perangkat keras saat sesi login pertama.
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[#e2e8f0] bg-[#f8fafc]">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="h-9 px-4 text-xs font-medium text-white bg-[#004ac6] hover:bg-[#2563eb] rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              <span>{editingUser ? 'Simpan Perubahan' : 'Tambah Pengguna'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
