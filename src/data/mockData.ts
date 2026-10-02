import { UserRecord, AuditLogItem, SecurityPolicy } from '../types';

export const INITIAL_USERS: UserRecord[] = [
  {
    id: 'usr-001',
    name: 'Anisa Danastri',
    email: 'anisa.danastri@datacore.id',
    nik: 'DC-10928',
    tag: 'STAFF UTAMA',
    role: 'Super Admin',
    department: 'IT Infrastructure & Cloud',
    location: 'Headquarter Jakarta',
    twoFactorStatus: '2FA Aktif',
    lastLogin: 'Login 12 menit lalu',
    status: 'Aktif',
    avatarInitials: 'AD',
    avatarBgColor: 'bg-[#dbe1ff]',
    avatarTextColor: 'text-[#004ac6]'
  },
  {
    id: 'usr-002',
    name: 'Rian Wicaksono',
    email: 'rian.w@datacore.id',
    nik: 'DC-10442',
    role: 'Admin Modul',
    department: 'Logistik & Distribusi',
    location: 'Tanjung Priok',
    twoFactorStatus: '2FA Aktif',
    lastLogin: 'Login 2 jam lalu',
    status: 'Aktif',
    avatarInitials: 'RW',
    avatarBgColor: 'bg-[#d5e3fc]',
    avatarTextColor: 'text-[#0d1c2e]'
  },
  {
    id: 'usr-003',
    name: 'Bambang Tri',
    email: 'bambang.tri@datacore.id',
    nik: 'DC-09881',
    role: 'Verifikator',
    department: 'Procurement & Mitra',
    location: 'Surabaya',
    twoFactorStatus: '2FA Belum Aktif',
    lastLogin: 'Login Kemarin, 16:30',
    status: 'Menunggu Verifikasi',
    avatarInitials: 'BT',
    avatarBgColor: 'bg-cyan-100',
    avatarTextColor: 'text-cyan-800'
  },
  {
    id: 'usr-004',
    name: 'Fauziah Maharani',
    email: 'fauziah.m@datacore.id',
    nik: 'DC-11204',
    role: 'Staff Operasional',
    department: 'Operasional Sistem',
    location: 'Headquarter Jakarta',
    twoFactorStatus: '2FA Aktif',
    lastLogin: 'Login 24 Okt 2024, 08:15',
    status: 'Aktif',
    avatarInitials: 'FM',
    avatarBgColor: 'bg-[#e0e3e5]',
    avatarTextColor: 'text-[#191c1e]'
  },
  {
    id: 'usr-005',
    name: 'Hendra Pratama',
    email: 'hendra.p@datacore.id',
    nik: 'DC-08731',
    role: 'Viewer / Auditor',
    department: 'Tata Kelola & Audit',
    location: 'Medan',
    twoFactorStatus: '2FA Dinonaktifkan',
    lastLogin: 'Login 30 hari lalu',
    status: 'Tidak Aktif',
    avatarInitials: 'HP',
    avatarBgColor: 'bg-slate-200',
    avatarTextColor: 'text-slate-700'
  },
  {
    id: 'usr-006',
    name: 'Dewi Lestari',
    email: 'dewi.lestari@datacore.id',
    nik: 'DC-11350',
    role: 'Admin Modul',
    department: 'Human Resources',
    location: 'Headquarter Jakarta',
    twoFactorStatus: '2FA Aktif',
    lastLogin: 'Login 45 menit lalu',
    status: 'Aktif',
    avatarInitials: 'DL',
    avatarBgColor: 'bg-violet-100',
    avatarTextColor: 'text-violet-800'
  },
  {
    id: 'usr-007',
    name: 'Dimas Prasetyo',
    email: 'dimas.p@datacore.id',
    nik: 'DC-11492',
    role: 'Staff Operasional',
    department: 'Logistik & Distribusi',
    location: 'Semarang',
    twoFactorStatus: '2FA Belum Aktif',
    lastLogin: 'Login 3 hari lalu',
    status: 'Menunggu Verifikasi',
    avatarInitials: 'DP',
    avatarBgColor: 'bg-amber-100',
    avatarTextColor: 'text-amber-800'
  },
  {
    id: 'usr-008',
    name: 'Ratna Sari Dewi',
    email: 'ratna.sari@datacore.id',
    nik: 'DC-09411',
    role: 'Verifikator',
    department: 'Keuangan & Pajak',
    location: 'Headquarter Jakarta',
    twoFactorStatus: '2FA Aktif',
    lastLogin: 'Login 1 jam lalu',
    status: 'Aktif',
    avatarInitials: 'RS',
    avatarBgColor: 'bg-emerald-100',
    avatarTextColor: 'text-emerald-800'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-001',
    title: 'Percobaan Login Gagal (3x Salah Password)',
    timestamp: '13:42:08 WIB',
    severity: 'critical',
    icon: 'warning',
    targetUser: 'hendra.p@datacore.id',
    ipAddress: '182.253.112.44',
    location: 'Jakarta Selatan',
    description: 'Target: hendra.p@datacore.id • IP: 182.253.112.44 (Jakarta Selatan) • Status: Akun diisolasi sementara.',
    statusText: 'Akun diisolasi sementara'
  },
  {
    id: 'log-002',
    title: 'Pembaruan Kunci Kredensial FIDO2 / 2FA',
    timestamp: '12:15:33 WIB',
    severity: 'success',
    icon: 'key_vertical',
    initiator: 'Anisa Danastri (Super Admin)',
    description: 'Inisiator: Anisa Danastri (Super Admin) • Subjek: Rian Wicaksono (Hardware Key YubiKey terpasang).',
    statusText: 'Kunci Terdaftar'
  },
  {
    id: 'log-003',
    title: 'Modifikasi Hak Akses Modul Keuangan',
    timestamp: '10:04:19 WIB',
    severity: 'info',
    icon: 'admin_panel_settings',
    initiator: 'Konsol Otorisasi Tier-2',
    description: 'Role ditambahkan: Approver Transaksi Pajak ke NIK: DC-10442 melalui konsol otorisasi tier-2.',
    statusText: 'Otorisasi Berhasil'
  },
  {
    id: 'log-004',
    title: 'SINKRONISASI OKTA ACTIVE DIRECTORY',
    timestamp: '09:00:12 WIB',
    severity: 'info',
    icon: 'sync',
    description: 'Sinkronisasi berkala 2,480 identitas direktori Okta SCIM v2 selesai tanpa anomali schema.',
    statusText: 'Sinkronisasi Selesai'
  },
  {
    id: 'log-005',
    title: 'Undangan Aktivasi Terkirim',
    timestamp: '08:32:41 WIB',
    severity: 'info',
    icon: 'forward_to_inbox',
    description: 'Token aktivasi dikirimkan ke bambang.tri@datacore.id berlaku 48 jam.',
    statusText: 'Email Terkirim'
  },
  {
    id: 'log-006',
    title: 'Deteksi Login Anomali Geo-IP (Diizinkan 2FA)',
    timestamp: '07:11:05 WIB',
    severity: 'warning',
    icon: 'security',
    description: 'Percobaan akses dari Surabaya IP 114.124.200.19 berhasil diverifikasi via SMS OTP + Push Notification.',
    statusText: '2FA Sukses'
  }
];

export const INITIAL_SECURITY_POLICY: SecurityPolicy = {
  samlProvider: 'Okta Identity Provider (SAML 2.0)',
  maxSessionHours: 8,
  passwordRotationDays: 90,
  enforce2FA: true,
  minPasswordLength: 12,
  allowedIpSubnets: '10.0.0.0/8, 192.168.1.0/24',
  oktaSyncIntervalMinutes: 15
};

export const DEPARTMENTS = [
  'Semua Departemen',
  'IT Infrastructure & Cloud',
  'Logistik & Distribusi',
  'Procurement & Mitra',
  'Operasional Sistem',
  'Tata Kelola & Audit',
  'Human Resources',
  'Keuangan & Pajak'
];

export const ROLES = [
  'Semua Peran (Role)',
  'Super Admin',
  'Admin Modul',
  'Verifikator',
  'Staff Operasional',
  'Viewer / Auditor'
];

export const LOCATIONS = [
  'Headquarter Jakarta',
  'Tanjung Priok',
  'Surabaya',
  'Medan',
  'Semarang',
  'Bandung',
  'Makassar'
];
