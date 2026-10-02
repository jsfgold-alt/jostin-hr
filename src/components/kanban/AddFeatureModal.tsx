import React, { useState } from 'react';
import { FeatureCard, FeatureStatus, FeaturePriority, FeatureModule, SubTask } from '../../types';

interface AddFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCard: (card: FeatureCard) => void;
  initialStatus: FeatureStatus;
  nextFeatureNumber: number;
}

const ALL_MODULES: FeatureModule[] = [
  'Pengguna & Akses',
  'Keamanan & SIEM',
  'Data Master',
  'Laporan & Audit',
  'Integrasi & SSO',
];

const ALL_PRIORITIES: FeaturePriority[] = ['Tinggi', 'Sedang', 'Rendah'];

const STATUS_OPTIONS: { id: FeatureStatus; label: string }[] = [
  { id: 'backlog', label: 'Backlog (Antrean)' },
  { id: 'planning', label: 'Planning (Desain & Arsitektur)' },
  { id: 'in_progress', label: 'In Progress (Pengerjaan)' },
  { id: 'review', label: 'Review & QA (Pengujian)' },
  { id: 'done', label: 'Done (Selesai)' },
];

export const AddFeatureModal: React.FC<AddFeatureModalProps> = ({
  isOpen,
  onClose,
  onAddCard,
  initialStatus,
  nextFeatureNumber,
}) => {
  if (!isOpen) return null;

  const [id] = useState(`FEAT-${nextFeatureNumber}`);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [module, setModule] = useState<FeatureModule>('Pengguna & Akses');
  const [priority, setPriority] = useState<FeaturePriority>('Sedang');
  const [status, setStatus] = useState<FeatureStatus>(initialStatus);
  const [targetRelease, setTargetRelease] = useState('v1.2.0');
  const [assigneeName, setAssigneeName] = useState('Anisa Danastri');
  const [assigneeRole, setAssigneeRole] = useState('Lead Architect');
  const [subtasksText, setSubtasksText] = useState('Analisis Kebutuhan Sistem\nImplementasi Komponen UI\nUji Coba Integrasi');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedSubtasks: SubTask[] = subtasksText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line, idx) => ({
        id: `st-${Date.now()}-${idx}`,
        title: line,
        completed: status === 'done',
      }));

    const initials = assigneeName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'DC';

    const newCard: FeatureCard = {
      id,
      title: title.trim(),
      description: description.trim() || 'Fitur pengembangan baru untuk ekosistem platform enterprise DataCore.',
      module,
      status,
      priority,
      progress: status === 'done' ? 100 : 0,
      assignee: {
        name: assigneeName.trim() || 'Tim Pengembang',
        role: assigneeRole.trim() || 'Software Engineer',
        avatarInitials: initials,
        avatarColor: 'bg-[#dbe1ff] text-[#004ac6]',
      },
      subtasks: parsedSubtasks,
      tags: [module.split(' ')[0], 'Enterprise'],
      targetRelease: targetRelease.trim() || 'v1.2.0',
      updatedAt: 'Baru saja',
    };

    onAddCard(newCard);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl border border-[#e2e8f0] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2563eb] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">add_task</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#191c1e]">Tambah Fitur Baru</h3>
              <p className="text-xs text-[#57657a]">Daftarkan fitur ke alur kerja Kanban platform</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#57657a] hover:bg-[#e2e8f0] hover:text-[#191c1e] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#191c1e] mb-1">
                ID Fitur
              </label>
              <input
                type="text"
                value={id}
                disabled
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#e2e8f0] bg-[#f1f5f9] text-[#434655] font-mono font-bold"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-[#191c1e] mb-1">
                Kolom Status Awal
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as FeatureStatus)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] bg-white font-medium focus:ring-2 focus:ring-[#2563eb]"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#191c1e] mb-1">
              Nama Fitur <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Sinkronisasi SCIM Direktori Azure AD"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#2563eb]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#191c1e] mb-1">
              Deskripsi Singkat Fitur
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan kebutuhan, ruang lingkup, dan tujuan fitur..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#2563eb]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#57657a] mb-1">
                Modul Sistem
              </label>
              <select
                value={module}
                onChange={(e) => setModule(e.target.value as FeatureModule)}
                className="w-full py-1.5 px-2.5 text-xs rounded-lg border border-[#cbd5e1] bg-white font-medium"
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
                className="w-full py-1.5 px-2.5 text-xs rounded-lg border border-[#cbd5e1] bg-white font-medium"
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
                placeholder="v1.2.0"
                className="w-full py-1.5 px-2.5 text-xs rounded-lg border border-[#cbd5e1] bg-white font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#191c1e] mb-1">
              Rencana Subtugas (Satu per baris)
            </label>
            <textarea
              rows={3}
              value={subtasksText}
              onChange={(e) => setSubtasksText(e.target.value)}
              placeholder="Contoh:&#10;Desain skema DB&#10;Implementasi API endpoint&#10;Testing"
              className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#2563eb]"
            />
            <span className="text-[11px] text-[#737686]">
              Tiap baris akan dikonversi menjadi checklist interaktif pada kartu fitur.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#57657a] mb-1">
                Nama Penanggung Jawab (PIC)
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
                Peran PIC
              </label>
              <input
                type="text"
                value={assigneeRole}
                onChange={(e) => setAssigneeRole(e.target.value)}
                className="w-full py-1.5 px-2.5 text-xs rounded-lg border border-[#cbd5e1] bg-white font-medium"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-[#e2e8f0] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#434655] hover:bg-[#e2e8f0] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-xs transition-colors cursor-pointer"
            >
              Tambahkan ke Board
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
