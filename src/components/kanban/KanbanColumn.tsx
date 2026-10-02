import React, { useState } from 'react';
import { FeatureCard, FeatureStatus } from '../../types';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
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
  cards: FeatureCard[];
  onCardClick: (card: FeatureCard) => void;
  onMoveStatus: (cardId: string, targetStatus: FeatureStatus) => void;
  onDragStart: (e: React.DragEvent, cardId: string) => void;
  onDropCard: (targetStatus: FeatureStatus) => void;
  onAddCardToColumn: (initialStatus: FeatureStatus) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  subtitle,
  icon,
  accentColor,
  cards,
  onCardClick,
  onMoveStatus,
  onDragStart,
  onDropCard,
  onAddCardToColumn,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only trigger if leaving the column wrapper
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDropCard(id);
  };

  const totalProgress = cards.length > 0
    ? Math.round(cards.reduce((acc, c) => acc + c.progress, 0) / cards.length)
    : 0;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col rounded-2xl bg-[#f8fafc] border transition-all duration-200 min-w-[310px] w-full max-w-[340px] shrink-0 select-none ${
        isDragOver
          ? 'border-[#2563eb] bg-[#eff6ff]/70 shadow-lg ring-2 ring-[#2563eb]/20'
          : 'border-[#e2e8f0]/90 shadow-2xs'
      }`}
    >
      {/* Column Header */}
      <div className="p-3.5 border-b border-[#e2e8f0] bg-white rounded-t-2xl flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${accentColor.bg} ${accentColor.text}`}>
              <span className="material-symbols-outlined text-[18px]">{icon}</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#191c1e] tracking-tight flex items-center gap-2">
                <span>{title}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${accentColor.badge}`}>
                  {cards.length}
                </span>
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onAddCardToColumn(id)}
            className="w-7 h-7 rounded-lg bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#434655] hover:text-[#004ac6] flex items-center justify-center transition-colors cursor-pointer"
            title={`Tambah fitur ke kolom ${title}`}
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#737686]">
          <span>{subtitle}</span>
          {cards.length > 0 && (
            <span className="font-medium text-[#191c1e]">
              Rata-rata: <strong className="text-[#004ac6]">{totalProgress}%</strong>
            </span>
          )}
        </div>
      </div>

      {/* Cards List / Droppable Content */}
      <div className="p-3 flex-1 overflow-y-auto space-y-3 min-h-[480px] max-h-[calc(100vh-270px)]">
        {cards.length === 0 ? (
          <div
            onClick={() => onAddCardToColumn(id)}
            className={`h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-[#2563eb] bg-[#dbeafe]/40 text-[#1d4ed8]'
                : 'border-[#cbd5e1] hover:border-[#94a3b8] text-[#737686] hover:bg-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-[28px] mb-1 opacity-70">
              {isDragOver ? 'move_to_inbox' : 'add_circle_outline'}
            </span>
            <span className="text-xs font-semibold">
              {isDragOver ? 'Lepaskan Kartu di Sini' : 'Belum Ada Fitur'}
            </span>
            <span className="text-[11px] opacity-75 mt-0.5">
              {isDragOver ? `Status akan diubah ke ${title}` : 'Klik untuk menambahkan item baru'}
            </span>
          </div>
        ) : (
          cards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              onCardClick={onCardClick}
              onMoveStatus={onMoveStatus}
              onDragStart={onDragStart}
            />
          ))
        )}

        {isDragOver && cards.length > 0 && (
          <div className="h-16 rounded-xl border-2 border-dashed border-[#2563eb] bg-[#dbeafe]/30 flex items-center justify-center text-xs font-semibold text-[#1d4ed8] animate-pulse">
            Lepaskan kartu di kolom {title}
          </div>
        )}
      </div>
    </div>
  );
};
