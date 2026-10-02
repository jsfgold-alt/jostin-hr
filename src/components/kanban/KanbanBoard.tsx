import React, { useState, useEffect, useMemo } from 'react';
import { FeatureCard, FeatureStatus, FeaturePriority, FeatureModule } from '../../types';
import { INITIAL_KANBAN_FEATURES } from '../../data/mockKanbanData';
import { KanbanMetrics } from './KanbanMetrics';
import { KanbanColumn } from './KanbanColumn';
import { FeatureDetailModal } from './FeatureDetailModal';
import { AddFeatureModal } from './AddFeatureModal';

interface KanbanBoardProps {
  onShowToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void;
  onNavigateToUsers: () => void;
}

const STORAGE_KEY = 'datacore_kanban_features_v1';

interface ColumnDef {
  id: FeatureStatus;
  title: string;
  subtitle: string;
  icon: string;
  accentColor: {
    border: string;
    bg: string;
    text: string;
    dot: string;
    badge: string;
  };
}

const COLUMNS: ColumnDef[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    subtitle: 'Kebutuhan & Ide Fitur',
    icon: 'inventory_2',
    accentColor: {
      border: 'border-slate-300',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      dot: 'bg-slate-400',
      badge: 'bg-slate-200 text-slate-700',
    },
  },
  {
    id: 'planning',
    title: 'Planning',
    subtitle: 'Desain & Arsitektur',
    icon: 'architecture',
    accentColor: {
      border: 'border-indigo-300',
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      dot: 'bg-indigo-500',
      badge: 'bg-indigo-100 text-indigo-800',
    },
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    subtitle: 'Sedang Dikerjakan',
    icon: 'construction',
    accentColor: {
      border: 'border-blue-300',
      bg: 'bg-blue-50',
      text: 'text-[#004ac6]',
      dot: 'bg-[#2563eb]',
      badge: 'bg-[#2563eb]/15 text-[#004ac6]',
    },
  },
  {
    id: 'review',
    title: 'Testing & QA',
    subtitle: 'Review & Uji Keamanan',
    icon: 'rule',
    accentColor: {
      border: 'border-amber-300',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      dot: 'bg-amber-500',
      badge: 'bg-amber-100 text-amber-800',
    },
  },
  {
    id: 'done',
    title: 'Done / Live',
    subtitle: 'Selesai & Beroperasi',
    icon: 'check_circle',
    accentColor: {
      border: 'border-emerald-300',
      bg: 'bg-emerald-50',
      text: 'text-[#007d55]',
      dot: 'bg-[#007d55]',
      badge: 'bg-[#007d55]/15 text-[#007d55]',
    },
  },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  onShowToast,
  onNavigateToUsers,
}) => {
  // Features state with localStorage persistence
  const [features, setFeatures] = useState<FeatureCard[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_KANBAN_FEATURES;
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(features));
    } catch (e) {
      console.error('Failed to save kanban features to storage', e);
    }
  }, [features]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('Semua Modul');
  const [selectedPriority, setSelectedPriority] = useState<string>('Semua Prioritas');
  const [activeStatusFilter, setActiveStatusFilter] = useState<FeatureStatus | 'all'>('all');

  // Drag state
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);

  // Modals state
  const [selectedCard, setSelectedCard] = useState<FeatureCard | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [initialColumnForAdd, setInitialColumnForAdd] = useState<FeatureStatus>('backlog');

  // Next feature ID helper
  const nextFeatureNumber = useMemo(() => {
    let max = 100;
    features.forEach((f) => {
      const match = f.id.match(/FEAT-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > max) max = num;
      }
    });
    return max + 1;
  }, [features]);

  // Filtering
  const filteredFeatures = useMemo(() => {
    return features.filter((card) => {
      // Status filter from metrics banner
      if (activeStatusFilter !== 'all' && card.status !== activeStatusFilter) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesTitle = card.title.toLowerCase().includes(query);
        const matchesId = card.id.toLowerCase().includes(query);
        const matchesDesc = card.description.toLowerCase().includes(query);
        const matchesAssignee = card.assignee.name.toLowerCase().includes(query);
        const matchesTags = card.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesId && !matchesDesc && !matchesAssignee && !matchesTags) {
          return false;
        }
      }

      // Module filter
      if (selectedModule !== 'Semua Modul' && card.module !== selectedModule) {
        return false;
      }

      // Priority filter
      if (selectedPriority !== 'Semua Prioritas' && card.priority !== selectedPriority) {
        return false;
      }

      return true;
    });
  }, [features, activeStatusFilter, searchQuery, selectedModule, selectedPriority]);

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    setDraggedCardId(cardId);
    e.dataTransfer.setData('text/plain', cardId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDropCard = (targetStatus: FeatureStatus) => {
    if (!draggedCardId) return;

    const targetCard = features.find((f) => f.id === draggedCardId);
    if (!targetCard) return;

    if (targetCard.status === targetStatus) {
      setDraggedCardId(null);
      return;
    }

    setFeatures((prev) =>
      prev.map((card) => {
        if (card.id === draggedCardId) {
          const autoProgress =
            targetStatus === 'done'
              ? 100
              : targetStatus === 'backlog'
              ? 0
              : card.progress === 100
              ? 80
              : card.progress;

          const updatedSubtasks =
            targetStatus === 'done'
              ? card.subtasks.map((st) => ({ ...st, completed: true }))
              : card.subtasks;

          return {
            ...card,
            status: targetStatus,
            progress: autoProgress,
            subtasks: updatedSubtasks,
            updatedAt: 'Baru saja',
          };
        }
        return card;
      })
    );

    const columnTitle = COLUMNS.find((c) => c.id === targetStatus)?.title || targetStatus;
    onShowToast('info', 'Status Fitur Dipindahkan', `"${targetCard.title}" dialihkan ke status ${columnTitle}.`);
    setDraggedCardId(null);
  };

  // Quick Move
  const handleMoveStatus = (cardId: string, targetStatus: FeatureStatus) => {
    const card = features.find((f) => f.id === cardId);
    if (!card) return;

    setFeatures((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          const autoProgress =
            targetStatus === 'done'
              ? 100
              : targetStatus === 'backlog'
              ? 0
              : c.progress === 100
              ? 80
              : c.progress;

          const updatedSubtasks =
            targetStatus === 'done'
              ? c.subtasks.map((st) => ({ ...st, completed: true }))
              : c.subtasks;

          return {
            ...c,
            status: targetStatus,
            progress: autoProgress,
            subtasks: updatedSubtasks,
            updatedAt: 'Baru saja',
          };
        }
        return c;
      })
    );

    const columnTitle = COLUMNS.find((c) => c.id === targetStatus)?.title || targetStatus;
    onShowToast('success', 'Status Berubah', `${card.id} dipindahkan ke ${columnTitle}.`);
  };

  // Update card from modal
  const handleUpdateCard = (updatedCard: FeatureCard) => {
    setFeatures((prev) =>
      prev.map((c) => (c.id === updatedCard.id ? updatedCard : c))
    );
    onShowToast('success', 'Fitur Diperbarui', `Perubahan pada ${updatedCard.id} berhasil disimpan.`);
  };

  // Delete card
  const handleDeleteCard = (cardId: string) => {
    setFeatures((prev) => prev.filter((c) => c.id !== cardId));
    onShowToast('warning', 'Fitur Dihapus', `Fitur ${cardId} telah dihapus dari Kanban board.`);
  };

  // Add new card
  const handleAddCard = (newCard: FeatureCard) => {
    setFeatures((prev) => [newCard, ...prev]);
    onShowToast('success', 'Fitur Ditambahkan', `Fitur baru ${newCard.id}: "${newCard.title}" berhasil didaftarkan.`);
  };

  // Reset to default roadmap
  const handleResetDefault = () => {
    if (confirm('Kembalikan seluruh daftar fitur ke roadmap awal DataCore Enterprise?')) {
      setFeatures(INITIAL_KANBAN_FEATURES);
      localStorage.removeItem(STORAGE_KEY);
      onShowToast('info', 'Roadmap Direset', 'Daftar fitur telah dikembalikan ke data awal sistem.');
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['ID', 'Nama Fitur', 'Modul', 'Status', 'Prioritas', 'Progress (%)', 'PIC', 'Target Release', 'Deskripsi'];
    const rows = filteredFeatures.map((f) => [
      `"${f.id}"`,
      `"${f.title.replace(/"/g, '""')}"`,
      `"${f.module}"`,
      `"${f.status}"`,
      `"${f.priority}"`,
      `"${f.progress}%"`,
      `"${f.assignee.name} (${f.assignee.role})"`,
      `"${f.targetRelease}"`,
      `"${f.description.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `datacore_roadmap_kanban_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    onShowToast('success', 'Ekspor CSV Berhasil', `${filteredFeatures.length} item fitur telah diunduh.`);
  };

  // Export Notion Format to Clipboard
  const handleCopyNotionTable = () => {
    let markdown = `# Roadmap & Fitur DataCore Enterprise Platform\n\n`;
    markdown += `| ID | Nama Fitur | Modul | Status | Prioritas | Progres | PIC | Target Release |\n`;
    markdown += `| :--- | :--- | :--- | :--- | :--- | :---: | :--- | :--- |\n`;

    filteredFeatures.forEach((f) => {
      const statusLabel =
        f.status === 'done'
          ? 'Done'
          : f.status === 'review'
          ? 'Review / QA'
          : f.status === 'in_progress'
          ? 'In Progress'
          : f.status === 'planning'
          ? 'Planning'
          : 'Backlog';

      markdown += `| **${f.id}** | ${f.title} | ${f.module} | ${statusLabel} | ${f.priority} | ${f.progress}% | ${f.assignee.name} | ${f.targetRelease} |\n`;
    });

    navigator.clipboard.writeText(markdown).then(() => {
      onShowToast(
        'success',
        'Format Notion Disalin ke Clipboard',
        'Tabel fitur berformat Markdown Notion siap ditempel (paste) langsung ke halaman Notion Anda.'
      );
    }).catch(() => {
      onShowToast('error', 'Gagal Menyalin', 'Tidak dapat mengakses clipboard browser.');
    });
  };

  // Copy single card Notion format
  const handleCopySingleNotionCard = (card: FeatureCard) => {
    let md = `### [${card.id}] ${card.title}\n`;
    md += `- **Modul**: ${card.module}\n`;
    md += `- **Status**: ${card.status.toUpperCase()}\n`;
    md += `- **Prioritas**: ${card.priority}\n`;
    md += `- **Progres**: ${card.progress}%\n`;
    md += `- **PIC**: ${card.assignee.name} (${card.assignee.role})\n`;
    md += `- **Target Release**: ${card.targetRelease}\n`;
    md += `\n**Deskripsi**:\n${card.description}\n\n`;
    md += `**Subtugas & Checklist**:\n`;
    card.subtasks.forEach((st) => {
      md += `- [${st.completed ? 'x' : ' '}] ${st.title}\n`;
    });

    navigator.clipboard.writeText(md).then(() => {
      onShowToast(
        'success',
        'Detail Fitur Disalin',
        `Markdown checklist untuk ${card.id} siap ditempel ke Notion.`
      );
    });
  };

  const handleOpenAddModal = (statusCol: FeatureStatus = 'backlog') => {
    setInitialColumnForAdd(statusCol);
    setIsAddModalOpen(true);
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedModule !== 'Semua Modul' ||
    selectedPriority !== 'Semua Prioritas' ||
    activeStatusFilter !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedModule('Semua Modul');
    setSelectedPriority('Semua Prioritas');
    setActiveStatusFilter('all');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 pb-12">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[#57657a] text-xs">
            <span>Sistem Inti</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Manajemen Siklus Hidup</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-[#004ac6] font-semibold">Roadmap &amp; Kanban Board</span>
          </div>
          <h1 className="text-2xl font-bold text-[#191c1e] tracking-tight mt-1 flex items-center gap-2.5">
            <span>Kanban Board &amp; Tracking Fitur</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#2563eb]/10 text-[#004ac6] border border-[#2563eb]/20">
              Interaktif
            </span>
          </h1>
          <p className="text-sm text-[#57657a]">
            Pantau dan kendalikan status penyelesaian tiap modul direktori, autentikasi 2FA, integrasi Okta, dan kebijakan keamanan.
          </p>
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={handleCopyNotionTable}
            className="h-9 px-3 rounded-xl bg-white border border-[#e2e8f0] text-[#434655] hover:text-[#004ac6] hover:bg-[#f8fafc] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            title="Salin seluruh roadmap dalam format tabel Markdown Notion"
          >
            <span className="material-symbols-outlined text-[16px] text-[#004ac6]">content_copy</span>
            <span>Salin Format Notion</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="h-9 px-3 rounded-xl bg-white border border-[#e2e8f0] text-[#434655] hover:text-[#191c1e] hover:bg-[#f8fafc] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            title="Unduh data Kanban sebagai berkas CSV"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Ekspor CSV</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenAddModal('backlog')}
            className="h-9 px-4 rounded-xl bg-[#2563eb] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs hover:bg-[#1d4ed8] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>+ Tambah Fitur</span>
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <KanbanMetrics
        features={features}
        activeStatusFilter={activeStatusFilter}
        onSelectStatusFilter={(status) => setActiveStatusFilter(status)}
      />

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Input */}
          <div className="relative min-w-[220px] flex-1 max-w-sm">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#737686]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ID, fitur, PIC, atau tag..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#737686] hover:text-[#191c1e]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Module Filter */}
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="py-2 px-3 text-xs rounded-xl border border-[#cbd5e1] bg-white font-medium text-[#434655] focus:ring-2 focus:ring-[#2563eb]"
          >
            <option value="Semua Modul">Semua Modul</option>
            <option value="Pengguna & Akses">Pengguna &amp; Akses</option>
            <option value="Keamanan & SIEM">Keamanan &amp; SIEM</option>
            <option value="Data Master">Data Master</option>
            <option value="Laporan & Audit">Laporan &amp; Audit</option>
            <option value="Integrasi & SSO">Integrasi &amp; SSO</option>
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="py-2 px-3 text-xs rounded-xl border border-[#cbd5e1] bg-white font-medium text-[#434655] focus:ring-2 focus:ring-[#2563eb]"
          >
            <option value="Semua Prioritas">Semua Prioritas</option>
            <option value="Tinggi">P0 • Tinggi</option>
            <option value="Sedang">P1 • Sedang</option>
            <option value="Rendah">P2 • Rendah</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="px-2.5 py-1.5 text-xs text-[#004ac6] font-semibold hover:bg-[#2563eb]/10 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">filter_alt_off</span>
              <span>Reset Filter</span>
            </button>
          )}
        </div>

        {/* Right side stats & helpers */}
        <div className="flex items-center gap-3 text-xs text-[#57657a]">
          <span>
            Menampilkan <strong>{filteredFeatures.length}</strong> dari <strong>{features.length}</strong> fitur
          </span>
          <button
            type="button"
            onClick={handleResetDefault}
            className="text-[11px] text-[#737686] hover:text-[#191c1e] hover:underline"
            title="Reset ke data awal"
          >
            Reset Default
          </button>
        </div>
      </div>

      {/* Kanban Board Columns Container */}
      <div className="overflow-x-auto pb-4">
        <div className="flex items-start gap-4 min-w-[1300px]">
          {COLUMNS.map((col) => {
            const columnCards = filteredFeatures.filter((c) => c.status === col.id);
            return (
              <KanbanColumn
                key={col.id}
                id={col.id}
                title={col.title}
                subtitle={col.subtitle}
                icon={col.icon}
                accentColor={col.accentColor}
                cards={columnCards}
                onCardClick={(card) => setSelectedCard(card)}
                onMoveStatus={handleMoveStatus}
                onDragStart={handleDragStart}
                onDropCard={handleDropCard}
                onAddCardToColumn={handleOpenAddModal}
              />
            );
          })}
        </div>
      </div>

      {/* Feature Detail & Edit Modal */}
      <FeatureDetailModal
        card={selectedCard}
        isOpen={Boolean(selectedCard)}
        onClose={() => setSelectedCard(null)}
        onUpdateCard={handleUpdateCard}
        onDeleteCard={handleDeleteCard}
        onCopyNotionFormat={handleCopySingleNotionCard}
      />

      {/* Add Feature Modal */}
      <AddFeatureModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCard={handleAddCard}
        initialStatus={initialColumnForAdd}
        nextFeatureNumber={nextFeatureNumber}
      />
    </div>
  );
};
