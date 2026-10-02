import React from 'react';
import { FeatureCard, FeatureStatus } from '../../types';

interface KanbanMetricsProps {
  features: FeatureCard[];
  activeStatusFilter: FeatureStatus | 'all';
  onSelectStatusFilter: (status: FeatureStatus | 'all') => void;
}

export const KanbanMetrics: React.FC<KanbanMetricsProps> = ({
  features,
  activeStatusFilter,
  onSelectStatusFilter,
}) => {
  const total = features.length;
  const doneCount = features.filter((f) => f.status === 'done').length;
  const reviewCount = features.filter((f) => f.status === 'review').length;
  const inProgressCount = features.filter((f) => f.status === 'in_progress').length;
  const planningCount = features.filter((f) => f.status === 'planning').length;
  const backlogCount = features.filter((f) => f.status === 'backlog').length;

  const overallProgress = total > 0
    ? Math.round(features.reduce((acc, f) => acc + f.progress, 0) / total)
    : 0;

  const donePercent = total > 0 ? (doneCount / total) * 100 : 0;
  const reviewPercent = total > 0 ? (reviewCount / total) * 100 : 0;
  const inProgressPercent = total > 0 ? (inProgressCount / total) * 100 : 0;
  const planningPercent = total > 0 ? (planningCount / total) * 100 : 0;
  const backlogPercent = total > 0 ? (backlogCount / total) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-xs flex flex-col gap-4">
      {/* Top Row: Overall Completion Header & Multi-segment bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[26px]">insights</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#191c1e]">
                Kemajuan Fitur Platform DataCore
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#007d55]/10 text-[#007d55] border border-[#007d55]/20">
                Release Track 2026
              </span>
            </div>
            <p className="text-xs text-[#57657a] mt-0.5">
              Rasio penyelesaian fitur arsitektur direktori, autentikasi 2FA, kepatuhan SIEM, dan data master.
            </p>
          </div>
        </div>

        {/* Progress Percentage Callout */}
        <div className="flex items-baseline gap-2 self-start md:self-auto bg-[#f8fafc] px-4 py-2 rounded-xl border border-[#e2e8f0]">
          <span className="text-xs font-semibold text-[#57657a]">Total Capaian:</span>
          <span className="text-2xl font-extrabold text-[#004ac6] font-mono leading-none">
            {overallProgress}%
          </span>
          <span className="text-xs text-[#007d55] font-semibold flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            {doneCount} dari {total} Fitur Selesai
          </span>
        </div>
      </div>

      {/* Segmented Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-3 bg-[#e2e8f0] rounded-full overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${donePercent}%` }}
            className="bg-[#007d55] h-full transition-all duration-500 hover:brightness-110"
            title={`Selesai: ${doneCount} fitur (${Math.round(donePercent)}%)`}
          />
          <div
            style={{ width: `${reviewPercent}%` }}
            className="bg-amber-500 h-full transition-all duration-500 hover:brightness-110"
            title={`Testing & Review: ${reviewCount} fitur (${Math.round(reviewPercent)}%)`}
          />
          <div
            style={{ width: `${inProgressPercent}%` }}
            className="bg-[#2563eb] h-full transition-all duration-500 hover:brightness-110"
            title={`In Progress: ${inProgressCount} fitur (${Math.round(inProgressPercent)}%)`}
          />
          <div
            style={{ width: `${planningPercent}%` }}
            className="bg-indigo-500 h-full transition-all duration-500 hover:brightness-110"
            title={`Planning: ${planningCount} fitur (${Math.round(planningPercent)}%)`}
          />
          <div
            style={{ width: `${backlogPercent}%` }}
            className="bg-slate-300 h-full transition-all duration-500 hover:brightness-110"
            title={`Backlog: ${backlogCount} fitur (${Math.round(backlogPercent)}%)`}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#57657a]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#007d55]" />
            <span>Selesai ({doneCount})</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
            <span>Review &amp; QA ({reviewCount})</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#2563eb]" />
            <span>In Progress ({inProgressCount})</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
            <span>Planning ({planningCount})</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-300" />
            <span>Backlog ({backlogCount})</span>
          </span>
        </div>
      </div>

      {/* KPI Cards / Filter Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => onSelectStatusFilter('all')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            activeStatusFilter === 'all'
              ? 'bg-[#2563eb]/10 border-[#2563eb] shadow-xs'
              : 'bg-[#f8fafc] border-[#e2e8f0] hover:bg-[#f1f5f9]'
          }`}
        >
          <div className="text-[11px] text-[#57657a] font-medium">Semua Fitur</div>
          <div className="text-xl font-bold text-[#191c1e] font-mono mt-0.5">{total}</div>
        </button>

        <button
          type="button"
          onClick={() => onSelectStatusFilter('done')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            activeStatusFilter === 'done'
              ? 'bg-[#007d55]/15 border-[#007d55] shadow-xs'
              : 'bg-[#f8fafc] border-[#e2e8f0] hover:bg-[#f1f5f9]'
          }`}
        >
          <div className="text-[11px] text-[#007d55] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#007d55]" />
            Selesai
          </div>
          <div className="text-xl font-bold text-[#007d55] font-mono mt-0.5">{doneCount}</div>
        </button>

        <button
          type="button"
          onClick={() => onSelectStatusFilter('review')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            activeStatusFilter === 'review'
              ? 'bg-amber-100/60 border-amber-500 shadow-xs'
              : 'bg-[#f8fafc] border-[#e2e8f0] hover:bg-[#f1f5f9]'
          }`}
        >
          <div className="text-[11px] text-amber-800 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            QA / Review
          </div>
          <div className="text-xl font-bold text-amber-800 font-mono mt-0.5">{reviewCount}</div>
        </button>

        <button
          type="button"
          onClick={() => onSelectStatusFilter('in_progress')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            activeStatusFilter === 'in_progress'
              ? 'bg-blue-100/60 border-[#2563eb] shadow-xs'
              : 'bg-[#f8fafc] border-[#e2e8f0] hover:bg-[#f1f5f9]'
          }`}
        >
          <div className="text-[11px] text-[#004ac6] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
            In Progress
          </div>
          <div className="text-xl font-bold text-[#004ac6] font-mono mt-0.5">{inProgressCount}</div>
        </button>

        <button
          type="button"
          onClick={() => onSelectStatusFilter('planning')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            activeStatusFilter === 'planning'
              ? 'bg-indigo-100/60 border-indigo-500 shadow-xs'
              : 'bg-[#f8fafc] border-[#e2e8f0] hover:bg-[#f1f5f9]'
          }`}
        >
          <div className="text-[11px] text-indigo-700 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Planning
          </div>
          <div className="text-xl font-bold text-indigo-800 font-mono mt-0.5">{planningCount}</div>
        </button>

        <button
          type="button"
          onClick={() => onSelectStatusFilter('backlog')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            activeStatusFilter === 'backlog'
              ? 'bg-slate-200 border-slate-500 shadow-xs'
              : 'bg-[#f8fafc] border-[#e2e8f0] hover:bg-[#f1f5f9]'
          }`}
        >
          <div className="text-[11px] text-slate-700 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Backlog
          </div>
          <div className="text-xl font-bold text-slate-700 font-mono mt-0.5">{backlogCount}</div>
        </button>
      </div>
    </div>
  );
};
