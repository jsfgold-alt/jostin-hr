/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Sidebar, ActiveModule } from './components/Sidebar';
import { Header } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { FilterToolbar, QuickPill } from './components/FilterToolbar';
import { UserTable } from './components/UserTable';
import { SecurityPanels } from './components/SecurityPanels';
import { OtherModules } from './components/OtherModules';
import { KanbanBoard } from './components/kanban/KanbanBoard';
import { AddEditUserModal } from './components/modals/AddEditUserModal';
import { ResetCredentialModal } from './components/modals/ResetCredentialModal';
import { SiemAuditLogModal } from './components/modals/SiemAuditLogModal';
import { PolicyModal } from './components/modals/PolicyModal';
import { SystemStatusModal } from './components/modals/SystemStatusModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import {
  INITIAL_USERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SECURITY_POLICY,
} from './data/mockData';
import { UserRecord, AuditLogItem, SecurityPolicy } from './types';

export default function App() {
  // Navigation
  const [activeModule, setActiveModule] = useState<ActiveModule>('pengguna');

  // Main Data States
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [policy, setPolicy] = useState<SecurityPolicy>(INITIAL_SECURITY_POLICY);

  // Search & Filters
  const [globalSearch, setGlobalSearch] = useState('');
  const [tableSearch, setTableSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('Semua Peran (Role)');
  const [selectedDepartment, setSelectedDepartment] = useState('Semua Departemen');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [activeQuickPill, setActiveQuickPill] = useState<QuickPill>('semua');
  const [kpiFilter, setKpiFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Modals
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resettingUser, setResettingUser] = useState<UserRecord | null>(null);

  const [isSiemModalOpen, setIsSiemModalOpen] = useState(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [isSystemStatusModalOpen, setIsSystemStatusModalOpen] = useState(false);

  // SSO Sync Animation
  const [isSyncing, setIsSyncing] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      title,
      message,
    };
    setToasts((prev) => [newToast, ...prev]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync Okta Directory Handler
  const handleSyncSSO = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const newLog: AuditLogItem = {
        id: `log-${Date.now()}`,
        title: 'Sinkronisasi Manual Okta AD Sukses',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB',
        severity: 'success',
        icon: 'sync',
        description: 'Sinkronisasi menyeluruh direktori SCIM Okta selesai. 2,480 akun terverifikasi konsisten.',
        statusText: 'Sinkron Selesai',
      };
      setAuditLogs((prev) => [newLog, ...prev]);
      addToast(
        'success',
        'Sinkronisasi Direktori Berhasil',
        '2,480 pengguna telah terverifikasi dengan Okta Active Directory.'
      );
    }, 1200);
  };

  // KPI Filter Toggle
  const handleKpiFilterSelect = (filterKey: string) => {
    setKpiFilter(filterKey);
    if (filterKey === 'all') {
      setSelectedStatus('Semua');
      setActiveQuickPill('semua');
    } else if (filterKey === 'active') {
      setSelectedStatus('Aktif');
      setActiveQuickPill('semua');
    } else if (filterKey === 'pending') {
      setSelectedStatus('Menunggu Verifikasi');
      setActiveQuickPill('perlu-review');
    } else if (filterKey === 'disabled') {
      setSelectedStatus('Tidak Aktif');
      setActiveQuickPill('semua');
    }
  };

  // Quick Pill Click Handler
  const handleQuickPillChange = (pill: QuickPill) => {
    setActiveQuickPill(pill);
    if (pill === 'semua') {
      setSelectedRole('Semua Peran (Role)');
      setSelectedStatus('Semua');
      setKpiFilter('all');
    } else if (pill === 'super-admin') {
      setSelectedRole('Super Admin');
    } else if (pill === '2fa-aktif') {
      // Filter handled in filtering logic
    } else if (pill === 'perlu-review') {
      setSelectedStatus('Menunggu Verifikasi');
      setKpiFilter('pending');
    }
  };

  // User Filtering Logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Global search & table search
      const effectiveSearch = (tableSearch || globalSearch).trim().toLowerCase();
      if (effectiveSearch) {
        const matchesName = user.name.toLowerCase().includes(effectiveSearch);
        const matchesEmail = user.email.toLowerCase().includes(effectiveSearch);
        const matchesNik = user.nik.toLowerCase().includes(effectiveSearch);
        const matchesRole = user.role.toLowerCase().includes(effectiveSearch);
        const matchesDept = user.department.toLowerCase().includes(effectiveSearch);
        if (!matchesName && !matchesEmail && !matchesNik && !matchesRole && !matchesDept) {
          return false;
        }
      }

      // Role Filter
      if (selectedRole !== 'Semua Peran (Role)' && user.role !== selectedRole) {
        return false;
      }

      // Department Filter
      if (selectedDepartment !== 'Semua Departemen' && user.department !== selectedDepartment) {
        return false;
      }

      // Status Filter
      if (selectedStatus !== 'Semua' && user.status !== selectedStatus) {
        return false;
      }

      // Quick Pill Filter
      if (activeQuickPill === 'super-admin' && user.role !== 'Super Admin') {
        return false;
      }
      if (activeQuickPill === '2fa-aktif' && user.twoFactorStatus !== '2FA Aktif') {
        return false;
      }
      if (
        activeQuickPill === 'perlu-review' &&
        user.status !== 'Menunggu Verifikasi' &&
        user.twoFactorStatus !== '2FA Belum Aktif'
      ) {
        return false;
      }

      return true;
    });
  }, [users, globalSearch, tableSearch, selectedRole, selectedDepartment, selectedStatus, activeQuickPill]);

  // Export Users to CSV
  const handleExportUsers = () => {
    const headers = ['Nama', 'Email', 'NIK', 'Peran', 'Departemen', 'Lokasi', '2FA Status', 'Status'];
    const rows = filteredUsers.map((u) => [
      `"${u.name}"`,
      `"${u.email}"`,
      `"${u.nik}"`,
      `"${u.role}"`,
      `"${u.department}"`,
      `"${u.location}"`,
      `"${u.twoFactorStatus}"`,
      `"${u.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `datacore_pengguna_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    addToast('info', 'Ekspor Selesai', `Data ${filteredUsers.length} pengguna telah diunduh sebagai file CSV.`);
  };

  // Add / Edit User Handler
  const handleSaveUser = (userData: Partial<UserRecord>) => {
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? ({ ...u, ...userData } as UserRecord) : u))
      );
      addToast('success', 'Pengguna Diperbarui', `Data akun ${userData.name} berhasil diperbarui.`);
    } else {
      const newUser: UserRecord = {
        id: `usr-${Date.now()}`,
        name: userData.name || '',
        email: userData.email || '',
        nik: userData.nik || `DC-${Math.floor(10000 + Math.random() * 9000)}`,
        tag: userData.tag,
        role: userData.role || 'Staff Operasional',
        department: userData.department || 'Operasional Sistem',
        location: userData.location || 'Headquarter Jakarta',
        twoFactorStatus: userData.twoFactorStatus || '2FA Aktif',
        lastLogin: 'Belum pernah login',
        status: userData.status || 'Aktif',
        avatarInitials: userData.avatarInitials || 'DC',
        avatarBgColor: 'bg-primary-fixed',
        avatarTextColor: 'text-primary',
      };
      setUsers((prev) => [newUser, ...prev]);
      addToast('success', 'Pengguna Ditambahkan', `Akun baru ${newUser.name} (${newUser.email}) telah didaftarkan.`);
    }
    setEditingUser(null);
  };

  // Delete User Handler
  const handleDeleteUser = (user: UserRecord) => {
    if (user.status === 'Tidak Aktif') {
      if (confirm(`Apakah Anda yakin ingin menghapus permanen data pengguna ${user.name}?`)) {
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        addToast('error', 'Pengguna Dihapus', `Akun ${user.name} telah dihapus permanen dari sistem.`);
      }
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: 'Tidak Aktif' as const } : u))
      );
      addToast('warning', 'Akun Dinonaktifkan', `Status akun ${user.name} diubah menjadi Tidak Aktif.`);
    }
  };

  // Toggle Account Active / Inactive
  const handleToggleStatus = (user: UserRecord) => {
    const nextStatus = user.status === 'Aktif' ? 'Tidak Aktif' : 'Aktif';
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
    );
    addToast(
      nextStatus === 'Aktif' ? 'success' : 'warning',
      nextStatus === 'Aktif' ? 'Akun Diaktifkan' : 'Akun Dibekukan',
      `Akun ${user.name} sekarang berstatus ${nextStatus}.`
    );
  };

  // Resend Invite Handler
  const handleResendInvite = (user: UserRecord) => {
    addToast(
      'info',
      'Undangan Terkirim',
      `Tautan aktivasi baru telah dikirimkan ke ${user.email}. Berlaku 48 jam.`
    );
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      title: 'Undangan Aktivasi Dikirimkan',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB',
      severity: 'info',
      icon: 'forward_to_inbox',
      targetUser: user.email,
      description: `Token pendaftaran ulang dikirimkan ke ${user.email} oleh Admin Operasional.`,
      statusText: 'Undangan Terkirim',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Reset Credential Confirm Handler
  const handleConfirmResetCredential = (actionType: string, newPassword?: string) => {
    if (!resettingUser) return;
    if (actionType === 'temp' || actionType === 'both') {
      addToast(
        'success',
        'Kata Sandi Sementara Dibuat',
        `Kredensial sementara untuk ${resettingUser.name} telah digenerate: ${newPassword}`
      );
    } else if (actionType === 'link') {
      addToast(
        'info',
        'Tautan Reset Terkirim',
        `Tautan reset kata sandi telah dikirimkan ke email ${resettingUser.email}.`
      );
    } else if (actionType === '2fa') {
      setUsers((prev) =>
        prev.map((u) => (u.id === resettingUser.id ? { ...u, twoFactorStatus: '2FA Belum Aktif' } : u))
      );
      addToast(
        'warning',
        'Token 2FA Direset',
        `Token autentikasi 2FA pengguna ${resettingUser.name} telah dihapus. Pengguna wajib mendaftarkan ulang saat login berikutnya.`
      );
    }
  };

  // Bulk Actions
  const handleBulkResendInvites = (selectedIds: string[]) => {
    addToast(
      'info',
      'Undangan Massal Dikirim',
      `Undangan aktivasi & pengingat 2FA telah dikirimkan ke ${selectedIds.length} pengguna terpilih.`
    );
  };

  const handleBulkChangeStatus = (selectedIds: string[], newStatus: 'Aktif' | 'Tidak Aktif') => {
    setUsers((prev) =>
      prev.map((u) => (selectedIds.includes(u.id) ? { ...u, status: newStatus } : u))
    );
    addToast(
      newStatus === 'Aktif' ? 'success' : 'warning',
      `Status Massal Diperbarui`,
      `${selectedIds.length} pengguna telah diubah menjadi status ${newStatus}.`
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans antialiased">
      {/* Fixed Left Sidebar */}
      <Sidebar
        activeModule={activeModule}
        onSelectModule={(mod) => setActiveModule(mod)}
        onOpenSystemStatus={() => setIsSystemStatusModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="pl-64">
        {/* Top Header */}
        <Header
          globalSearch={globalSearch}
          onGlobalSearchChange={(query) => setGlobalSearch(query)}
          onOpenAuditLogs={() => setIsSiemModalOpen(true)}
          onOpenPolicies={() => setIsPolicyModalOpen(true)}
          activeModule={activeModule}
          onSelectModule={(mod) => setActiveModule(mod)}
        />

        {/* Viewport Canvas */}
        <main className="w-full pt-16 bg-[#f7f9fb] min-h-screen px-6 py-6">
          {activeModule === 'kanban' ? (
            <KanbanBoard
              onShowToast={addToast}
              onNavigateToUsers={() => setActiveModule('pengguna')}
            />
          ) : activeModule !== 'pengguna' ? (
            <OtherModules
              module={activeModule}
              onNavigateToUsers={() => setActiveModule('pengguna')}
            />
          ) : (
            <div className="flex flex-col w-full space-y-6">
              {/* Breadcrumbs & Header Strip */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-[#434655] text-xs">
                    <span>Sistem Inti</span>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span>Manajemen Akses</span>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span className="text-[#004ac6] font-semibold">Pengguna</span>
                  </div>
                  <h1 className="text-2xl font-bold text-[#191c1e] tracking-tight mt-1">
                    Manajemen Pengguna &amp; Hak Akses
                  </h1>
                  <p className="text-sm text-[#434655]">
                    Kendali terpusat direktori pengguna enterprise, autentikasi dua faktor (2FA), dan hierarki peran keamanan DataCore.
                  </p>
                </div>

                {/* Quick Action / Global Sync */}
                <div className="flex items-center gap-2 self-start md:self-auto">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f2f4f6] text-[#434655] text-xs font-medium border border-[#e0e3e5]">
                    <span className="w-2 h-2 rounded-full bg-[#007d55] animate-pulse"></span>
                    <span>SSO Sync: Okta Active Directory</span>
                  </div>
                  <button
                    onClick={handleSyncSSO}
                    className="p-2 rounded-xl bg-white text-[#434655] hover:bg-[#eceef0] hover:text-[#191c1e] transition-colors shadow-xs border border-[#e2e8f0] cursor-pointer"
                    title="Refresh Data &amp; Sinkronkan Okta AD"
                    type="button"
                  >
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        isSyncing ? 'animate-spin text-[#004ac6]' : ''
                      }`}
                    >
                      sync
                    </span>
                  </button>
                </div>
              </div>

              {/* 1. Top KPI Summary Cards (4 Grids) */}
              <KpiCards
                totalCount={2480}
                activeCount={2345}
                pendingCount={28}
                disabledCount={107}
                selectedFilter={kpiFilter}
                onFilterSelect={handleKpiFilterSelect}
              />

              {/* 2. Filter & Action Toolbar Section */}
              <FilterToolbar
                searchQuery={tableSearch}
                onSearchChange={(q) => setTableSearch(q)}
                selectedRole={selectedRole}
                onRoleChange={(r) => setSelectedRole(r)}
                selectedDepartment={selectedDepartment}
                onDepartmentChange={(d) => setSelectedDepartment(d)}
                selectedStatus={selectedStatus}
                onStatusChange={(s) => setSelectedStatus(s)}
                activeQuickPill={activeQuickPill}
                onQuickPillChange={handleQuickPillChange}
                onOpenAddModal={() => {
                  setEditingUser(null);
                  setIsAddEditModalOpen(true);
                }}
                onExportUsers={handleExportUsers}
              />

              {/* 3. Enterprise User Data Table Container */}
              <UserTable
                users={filteredUsers}
                allUsersCount={2480}
                onEditUser={(u) => {
                  setEditingUser(u);
                  setIsAddEditModalOpen(true);
                }}
                onResetCredential={(u) => {
                  setResettingUser(u);
                  setIsResetModalOpen(true);
                }}
                onDeleteUser={handleDeleteUser}
                onToggleStatus={handleToggleStatus}
                onResendInvite={handleResendInvite}
                currentPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
                pageSize={pageSize}
                onPageSizeChange={(size) => setPageSize(size)}
                onBulkResendInvites={handleBulkResendInvites}
                onBulkChangeStatus={handleBulkChangeStatus}
              />

              {/* 5. Bottom Secondary Intelligence & Security Panels */}
              <SecurityPanels
                logs={auditLogs}
                policy={policy}
                onOpenSiemLogs={() => setIsSiemModalOpen(true)}
                onOpenManagePolicies={() => setIsPolicyModalOpen(true)}
              />
            </div>
          )}
        </main>
      </div>

      {/* Modals & Dialogs */}
      <AddEditUserModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        editingUser={editingUser}
      />

      <ResetCredentialModal
        isOpen={isResetModalOpen}
        user={resettingUser}
        onClose={() => {
          setIsResetModalOpen(false);
          setResettingUser(null);
        }}
        onConfirm={handleConfirmResetCredential}
      />

      <SiemAuditLogModal
        isOpen={isSiemModalOpen}
        onClose={() => setIsSiemModalOpen(false)}
        logs={auditLogs}
      />

      <PolicyModal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
        policy={policy}
        onSavePolicy={(newPolicy) => {
          setPolicy(newPolicy);
          addToast('success', 'Kebijakan Disimpan', 'Kebijakan keamanan akses & SAML IDP berhasil diperbarui.');
        }}
      />

      <SystemStatusModal
        isOpen={isSystemStatusModalOpen}
        onClose={() => setIsSystemStatusModalOpen(false)}
      />

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
