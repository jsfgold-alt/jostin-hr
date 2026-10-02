export type RoleType = 
  | 'Super Admin' 
  | 'Admin Modul' 
  | 'Verifikator' 
  | 'Staff Operasional' 
  | 'Viewer / Auditor';

export type AccountStatus = 'Aktif' | 'Menunggu Verifikasi' | 'Tidak Aktif';

export type TwoFactorStatus = '2FA Aktif' | '2FA Belum Aktif' | '2FA Dinonaktifkan';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  nik: string;
  tag?: string; // e.g. "STAFF UTAMA"
  role: RoleType;
  department: string;
  location: string;
  twoFactorStatus: TwoFactorStatus;
  lastLogin: string;
  status: AccountStatus;
  avatarInitials: string;
  avatarBgColor?: string;
  avatarTextColor?: string;
}

export interface AuditLogItem {
  id: string;
  title: string;
  timestamp: string;
  severity: 'critical' | 'info' | 'success' | 'warning';
  icon: string;
  targetUser?: string;
  ipAddress?: string;
  location?: string;
  initiator?: string;
  description: string;
  statusText?: string;
}

export interface SecurityPolicy {
  samlProvider: string;
  maxSessionHours: number;
  passwordRotationDays: number;
  enforce2FA: boolean;
  minPasswordLength: number;
  allowedIpSubnets: string;
  oktaSyncIntervalMinutes: number;
}

export type FeaturePriority = 'Tinggi' | 'Sedang' | 'Rendah';

export type FeatureStatus = 'backlog' | 'planning' | 'in_progress' | 'review' | 'done';

export type FeatureModule = 
  | 'Pengguna & Akses'
  | 'Keamanan & SIEM'
  | 'Data Master'
  | 'Laporan & Audit'
  | 'Integrasi & SSO';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  module: FeatureModule;
  status: FeatureStatus;
  priority: FeaturePriority;
  progress: number;
  assignee: {
    name: string;
    role: string;
    avatarInitials: string;
    avatarColor: string;
  };
  subtasks: SubTask[];
  tags: string[];
  targetRelease: string;
  updatedAt: string;
}

