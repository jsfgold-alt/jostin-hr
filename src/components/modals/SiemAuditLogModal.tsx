import React, { useState } from 'react';
import { AuditLogItem } from '../../types';

interface SiemAuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AuditLogItem[];
}

export const SiemAuditLogModal: React.FC<SiemAuditLogModalProps> = ({
  isOpen,
  onClose,
  logs,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'info' | 'success'>('all');

  if (!isOpen) return null;

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.targetUser && log.targetUser.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.ipAddress && log.ipAddress.includes(searchTerm));

    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;

    return matchesSearch && matchesSeverity;
  });

  const handleExportLogs = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(filteredLogs, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `siem_audit_logs_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden border border-[#e2e8f0] animate-in zoom-in-95"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0] bg-[#f8fafc]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#2563eb]/10 text-[#004ac6] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">security_update_good</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-slate-900 leading-tight">
                  Audit Log Keamanan &amp; Telemetri SIEM
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Live Stream (Retensi 365 Hari)
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Log terenkripsi SHA-256 tersinkronisasi dengan Splunk / Datadog SecOps Gateway
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-6 py-3 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari IP, target email, atau peristiwa..."
              className="w-full h-8 pl-9 pr-3 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center text-xs bg-slate-100 p-0.5 rounded-lg">
              {(['all', 'critical', 'warning', 'info', 'success'] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    severityFilter === sev
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {sev === 'all'
                    ? 'Semua'
                    : sev === 'critical'
                    ? 'Kritis'
                    : sev === 'warning'
                    ? 'Peringatan'
                    : sev === 'info'
                    ? 'Informasi'
                    : 'Sukses'}
                </button>
              ))}
            </div>

            <button
              onClick={handleExportLogs}
              className="h-8 px-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Unduh JSON</span>
            </button>
          </div>
        </div>

        {/* Log stream list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2.5 bg-slate-50/50">
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              <span className="material-symbols-outlined text-3xl text-slate-400 mb-2 block">
                search_off
              </span>
              Tidak ada log yang sesuai dengan filter pencarian.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const bgBadge =
                log.severity === 'critical'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : log.severity === 'warning'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : log.severity === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200';

              return (
                <div
                  key={log.id}
                  className="p-3 bg-white rounded-lg border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all flex items-start gap-3"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${bgBadge}`}>
                    <span className="material-symbols-outlined text-[18px]">{log.icon}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900">{log.title}</span>
                      <span className="text-[11px] font-mono text-slate-400 shrink-0">{log.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">{log.description}</p>
                    {log.statusText && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${bgBadge}`}>
                          {log.statusText}
                        </span>
                        {log.ipAddress && (
                          <span className="text-[10px] font-mono text-slate-400">IP: {log.ipAddress}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-[#e2e8f0] bg-[#f8fafc] text-xs text-slate-500">
          <span>Menampilkan {filteredLogs.length} dari {logs.length} catatan audit trail</span>
          <button
            onClick={onClose}
            className="h-8 px-4 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Tutup SIEM
          </button>
        </div>
      </div>
    </div>
  );
};
