import React from 'react';
import { FeatureCard, FeatureStatus } from '../../types';

interface KanbanCardProps {
  card: FeatureCard;
  onCardClick: (card: FeatureCard) => void;
  onMoveStatus: (cardId: string, targetStatus: FeatureStatus) => void;
  onDragStart: (e: React.DragEvent, cardId: string) => void;
}

const STATUS_ORDER: FeatureStatus[] = ['backlog', 'planning', 'in_progress', 'review', 'done'];

export const KanbanCard: React.FC<KanbanCardProps> = ({
  card,
  onCardClick,
  onMoveStatus,
  onDragStart,
}) => {
  const currentStatusIndex = STATUS_ORDER.indexOf(card.status);
  const prevStatus = currentStatusIndex > 0 ? STATUS_ORDER[currentStatusIndex - 1] : null;
  const nextStatus = currentStatusIndex < STATUS_ORDER.length - 1 ? STATUS_ORDER[currentStatusIndex + 1] : null;

  const completedSubtasks = card.subtasks.filter((st) => st.completed).length;
  const totalSubtasks = card.subtasks.length;

  const getPriorityBadge = (priority: FeatureCard['priority']) => {
    switch (priority) {
      case 'Tinggi':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
          dot: 'bg-rose-500',
          label: 'P0 • Tinggi',
        };
      case 'Sedang':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200/80',
          dot: 'bg-amber-500',
          label: 'P1 • Sedang',
        };
      case 'Rendah':
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          label: 'P2 • Rendah',
        };
    }
  };

  const getModuleBadge = (module: FeatureCard['module']) => {
    switch (module) {
      case 'Pengguna & Akses':
        return 'bg-blue-50 text-blue-700 border-blue-200/70';
      case 'Keamanan & SIEM':
        return 'bg-purple-50 text-purple-700 border-purple-200/70';
      case 'Data Master':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/70';
      case 'Laporan & Audit':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/70';
      case 'Integrasi & SSO':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200/70';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const priorityStyle = getPriorityBadge(card.priority);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, card.id)}
      onClick={() => onCardClick(card)}
      className="group relative bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs hover:shadow-md hover:border-[#2563eb]/40 transition-all duration-150 cursor-grab active:cursor-grabbing flex flex-col gap-3 select-none"
    >
      {/* Top Header: ID & Priority */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold tracking-tight text-[#004ac6] bg-[#2563eb]/10 px-2 py-0.5 rounded-md border border-[#2563eb]/20">
            {card.id}
          </span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1.5 ${priorityStyle.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot}`} />
            {priorityStyle.label}
          </span>
        </div>

        {/* Quick Shift buttons on hover */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-[#f1f5f9] p-0.5 rounded-lg border border-[#e2e8f0]"
          title="Geser status cepat"
        >
          {prevStatus && (
            <button
              type="button"
              onClick={() => onMoveStatus(card.id, prevStatus)}
              className="p-1 hover:bg-white text-[#434655] hover:text-[#004ac6] rounded-md transition-colors"
              title={`Pindah mundur ke ${prevStatus}`}
            >
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            </button>
          )}
          {nextStatus && (
            <button
              type="button"
              onClick={() => onMoveStatus(card.id, nextStatus)}
              className="p-1 hover:bg-white text-[#434655] hover:text-[#004ac6] rounded-md transition-colors"
              title={`Pindah maju ke ${nextStatus}`}
            >
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          )}
        </div>
      </div>

      {/* Feature Title & Summary */}
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-[#191c1e] group-hover:text-[#004ac6] transition-colors leading-snug line-clamp-2">
          {card.title}
        </h4>
        <p className="text-xs text-[#57657a] line-clamp-2 leading-relaxed">
          {card.description}
        </p>
      </div>

      {/* Module and Tags */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${getModuleBadge(card.module)}`}>
          {card.module}
        </span>
        {card.tags.slice(0, 2).map((tag, i) => (
          <span
            key={i}
            className="text-[10px] text-[#57657a] bg-[#f8fafc] px-1.5 py-0.5 rounded-md border border-[#e2e8f0]"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Progress Bar & Subtask counter */}
      <div className="space-y-1.5 pt-1 border-t border-[#f1f5f9]">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#57657a] font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#737686]">checklist</span>
            <span>{completedSubtasks}/{totalSubtasks} Subtugas</span>
          </span>
          <span className="font-semibold font-mono text-[#191c1e]">
            {card.progress}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              card.progress === 100
                ? 'bg-[#007d55]'
                : card.progress > 50
                ? 'bg-[#2563eb]'
                : 'bg-amber-500'
            }`}
            style={{ width: `${card.progress}%` }}
          />
        </div>
      </div>

      {/* Card Footer: Assignee & Target Date */}
      <div className="flex items-center justify-between pt-1 text-xs">
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shadow-xs border border-white ${card.assignee.avatarColor}`}
            title={`${card.assignee.name} (${card.assignee.role})`}
          >
            {card.assignee.avatarInitials}
          </div>
          <span className="text-[11px] text-[#57657a] font-medium truncate max-w-[100px]">
            {card.assignee.name}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-[#737686] bg-[#f8fafc] px-2 py-0.5 rounded-md border border-[#e2e8f0]">
          <span className="material-symbols-outlined text-[13px]">flag</span>
          <span className="truncate max-w-[85px]">{card.targetRelease}</span>
        </div>
      </div>
    </div>
  );
};
