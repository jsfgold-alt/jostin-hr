import React, { useState } from 'react';
import { FeatureCard, FeatureStatus, FeaturePriority, FeatureModule, SubTask } from '../../types';

interface FeatureDetailModalProps {
  card: FeatureCard | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateCard: (updatedCard: FeatureCard) => void;
  onDeleteCard: (cardId: string) => void;
  onCopyNotionFormat: (card: FeatureCard) => void;
}

const ALL_STATUSES: { id: FeatureStatus; label: string; icon: string }[] = [
  { id: 'backlog', label: 'Backlog', icon: 'inventory_2' },
  { id: 'planning', label: 'Planning', icon: 'architecture' },
  { id: 'in_progress', label: 'In Progress', icon: 'construction' },
  { id: 'review', label: 'Review & QA', icon: 'rule' },
  { id: 'done', label: 'Done (Selesai)', icon: 'check_circle' },
];

const ALL_MODULES: FeatureModule[] = [
  'Pengguna & Akses',
  'Keamanan & SIEM',
  'Data Master',
  'Laporan & Audit',
  'Integrasi & SSO',
];

const ALL_PRIORITIES: FeaturePriority[] = ['Tinggi', 'Sedang', 'Rendah'];

export const FeatureDetailModal: React.FC<FeatureDetailModalProps> = ({
  card,
  isOpen,
  onClose,
  onUpdateCard,
  onDeleteCard,
  onCopyNotionFormat,
}) => {
  if (!isOpen || !card) return null;

  // Local form state
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [status, setStatus] = useState<FeatureStatus>(card.status);
  const [module, setModule] = useState<FeatureModule>(card.module);
  const [priority, setPriority] = useState<FeaturePriority>(card.priority);
  const [targetRelease, setTargetRelease] = useState(card.targetRelease);
  const [subtasks, setSubtasks] = useState<SubTask[]>(card.subtasks);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [assigneeName, setAssigneeName] = useState(card.assignee.name);
  const [assigneeRole, setAssigneeRole] = useState(card.assignee.role);

  // Recalculate progress based on subtasks
  const calculateProgress = (tasks: SubTask[]) => {
    if (tasks.length === 0) return status === 'done' ? 100 : 0;
    const completed = tasks.filter((t) => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const handleToggleSubtask = (taskId: string) => {
    const nextSubtasks = subtasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    setSubtasks(nextSubtasks);
    // If all tasks are completed, auto suggest or switch status if desired
    const newProgress = calculateProgress(nextSubtasks);
    if (newProgress === 100 && status !== 'done') {
      setStatus('done');
    }
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const newTask: SubTask = {
      id: `st-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    const nextSubtasks = [...subtasks, newTask];
    setSubtasks(nextSubtasks);
    setNewSubtaskTitle('');
  };

  const handleDeleteSubtask = (taskId: string) => {
    setSubtasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleSave = () => {
    const autoProgress = calculateProgress(subtasks);
    const updated: FeatureCard = {
      ...card,
      title: title.trim() || card.title,
      description: description.trim() || card.description,
      status,
      module,
      priority,
      targetRelease,
      subtasks,
      progress: status === 'done' ? 100 : autoProgress,
      assignee: {
        ...card.assignee,
        name: assigneeName,
        role: assigneeRole,
      },
      updatedAt: 'Baru saja',
    };
    onUpdateCard(updated);
    onClose();
  };

  const handleDelete = () => {
    if (confirm(`Hapus kartu fitur ${card.id}: "${card.title}"?`)) {
      onDeleteCard(card.id);
      onClose();
    }
  };

  const currentProgress = calculateProgress(subtasks);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-[#e2e8f0] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Strip */}
        <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-[#004ac6] bg-[#2563eb]/10 px-2.5 py-1 rounded-md border border-[#2563eb]/20">
              {card.id}
            </span>
            <div>
              <span className="text-xs text-[#57657a] font-medium">Detail &amp; Pengaturan Progres Fitur</span>
              <div className="text-[11px] text-[#737686]">Terakhir diperbarui: {card.updatedAt}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onCopyNotionFormat(card)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[#e2e8f0] hover:bg-[#f1f5f9] text-[#434655] hover:text-[#004ac6] flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              title="Salin rincian fitur dalam format Markdown Notion"
            >
              <span className="material-symbols-outlined text-[15px]">content_copy</span>
              <span>Format Notion</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#57657a] hover:bg-[#e2e8f0] hover:text-[#191c1e] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Status Progression Pipeline */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#57657a] mb-2">
              Status Alur Pengerjaan (Kanban Column)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {ALL_STATUSES.map((st) => {
                const isActive = status === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStatus(st.id)}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-xs ring-2 ring-[#2563eb]/20'
                        : 'bg-[#f8fafc] text-[#434655] border-[#e2e8f0] hover:bg-[#f1f5f9]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{st.icon}</span>
                    <span>{st.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#191c1e] mb-1.5">
                Nama Fitur
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#2563eb] focus:border-transparent font-medium"
                placeholder="Contoh: Otentikasi SCIM Azure AD"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#191c1e] mb-1.5">
                Deskripsi &amp; Spesifikasi Kebutuhan
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#2563eb] focus:border-transparent leading-relaxed"
                placeholder="Jelaskan ruang lingkup fitur, acceptance criteria, dan dependensi sistem..."
              />
            </div>
          </div>

          {/* Metadata Row: Modul, Prioritas, Target Release */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
            <div>
              <label className="block text-[11px] font-semibold text-[#57657a] mb-1">
                Modul Sistem
              </label>
              <select
                value={module}
                onChange={(e) => setModule(e.target.value as FeatureModule)}
                className="w-full py-1.5 px-2.5 text-xs rounded-lg border border-[#cbd5e1] bg-white font-medium focus:ring-2 focus:ring-[#2563eb]"
              >
                {ALL_MODULES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#57657a] mb-1">
                Prioritas
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as FeaturePriority)}
                className="w-full py-1.5 px-2.5 text-xs rounded-lg border border-[#cbd5e1] bg-white font-medium focus:ring-2 focus:ring-[#2563eb]"
              >
                {ALL_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#57657a] mb-1">
                Target Release
              </label>
              <input
                type="text"
                value={targetRelease}
                onChange={(e) => setTargetRelease(e.target.value)}
                className="w-full py-1.5 px-2.5 text-xs rounded-lg border border-[#cbd5e1] bg-white font-medium focus:ring-2 focus:ring-[#2563eb]"
                placeholder="v1.2.0"
              />
            </div>
          </div>

          {/* Subtasks Checklist Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#57657a]">
                  Daftar Subtugas &amp; Kriteria Pengujian
                </h4>
                <p className="text-[11px] text-[#737686]">
                  Mencentang subtugas akan otomatis memperbarui persentase progress fitur.
                </p>
              </div>

              <div className="text-right">
                <span className="text-sm font-extrabold font-mono text-[#004ac6]">
                  {currentProgress}%
                </span>
                <span className="text-xs text-[#57657a] ml-1">
                  ({subtasks.filter((t) => t.completed).length}/{subtasks.length})
                </span>
              </div>
            </div>

            {/* Checklist items */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {subtasks.length === 0 ? (
                <div className="text-xs text-[#737686] italic py-2">
                  Belum ada subtugas. Tambahkan di bawah.
                </div>
              ) : (
                subtasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors ${
                      task.completed
                        ? 'bg-[#ecfdf5] border-[#a7f3d0] text-[#065f46]'
                        : 'bg-white border-[#e2e8f0] text-[#191c1e] hover:bg-[#f8fafc]'
                    }`}
                  >
                    <label className="flex items-center gap-2.5 flex-1 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleSubtask(task.id)}
                        className="w-4 h-4 rounded-md text-[#007d55] border-[#cbd5e1] focus:ring-[#007d55] cursor-pointer"
                      />
                      <span className={`text-xs font-medium ${task.completed ? 'line-through opacity-75' : ''}`}>
                        {task.title}
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => handleDeleteSubtask(task.id)}
                      className="text-[#94a3b8] hover:text-rose-600 p-1 rounded-md transition-colors"
                      title="Hapus subtugas"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add Subtask Form */}
            <form onSubmit={handleAddSubtask} className="flex items-center gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="+ Tambah item subtugas baru..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#2563eb]"
              />
              <button
                type="submit"
                disabled={!newSubtaskTitle.trim()}
                className="px-3.5 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-semibold disabled:opacity-50 hover:bg-[#1d4ed8] transition-colors cursor-pointer"
              >
                Tambah
              </button>
            </form>
          </div>

          {/* Assignee Information */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
            <div>
              <label className="block text-[11px] font-semibold text-[#57657a] mb-1">
                Penanggung Jawab (PIC)
              </label>
              <input
                type="text"
                value={assigneeName}
                onChange={(e) => setAssigneeName(e.target.value)}
                className="w-full py-1.5 px-2.5 text-xs rounded-lg border border-[#cbd5e1] bg-white font-medium"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#57657a] mb-1">
                Peran Tim PIC
              </label>
              <input
                type="text"
                value={assigneeRole}
                onChange={(e) => setAssigneeRole(e.target.value)}
                className="w-full py-1.5 px-2.5 text-xs rounded-lg border border-[#cbd5e1] bg-white font-medium"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between">
          <button
            type="button"
            onClick={handleDelete}
            className="px-3.5 py-2 rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
            <span>Hapus Fitur</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#434655] hover:bg-[#e2e8f0] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-xs transition-colors cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
