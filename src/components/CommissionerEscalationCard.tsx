import React, { useState } from 'react';
import { ShieldCheck, Mail, AlertOctagon, FileSpreadsheet, Send, UserCheck, Sparkles } from 'lucide-react';
import { DepartmentMetric, EmailLog } from '../types';

interface CommissionerEscalationCardProps {
  failingDepartments: DepartmentMetric[];
  onTriggerEscalation: (deptCode: string) => void;
  escalationLogs: EmailLog[];
}

export const CommissionerEscalationCard: React.FC<CommissionerEscalationCardProps> = ({ failingDepartments, onTriggerEscalation, escalationLogs }) => {
  const [isEscalating, setIsEscalating] = useState(false);
  const [selectedDeptCode, setSelectedDeptCode] = useState<string>(failingDepartments[0]?.code || 'SEW');
  const [reportLog, setReportLog] = useState<string | null>(null);

  const handleEscalateToCommissioner = async () => {
    setIsEscalating(true);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    
    onTriggerEscalation(selectedDeptCode);
    
    // Display summary of compiled report
    setReportLog(`CIVICEYE AUTOMATED COMMISSIONER AUDIT BRIEF:
=========================================
STATUS: CRITICAL SLA BREACH ESCALATED
TARGET: Municipal Commissioner Katta Ravi Teja
DATE: June 23, 2026

1. OPERATIONS BREACH METRICS:
---------------------------
- Department: Sewage Operations (SEW)
- Performance SLA: 25.0% (CRITICAL FAILURE, Threshold < 30%)
- Total Logged Grievances: 4
- Unresolved Backlog: 2
- Overdue Delayed Tickets: 1
- Avg Response Lag: 2.5 days

2. IDENTIFIED ROOT CAUSES OF DEPT DELAY:
--------------------------------------
- Lack of high-volume water pump inventory in South Zone.
- Officer operational friction & slow contractor dispatch.
- Overdue critical sewage water flooding Podanur Main Road for > 12 hours.

3. OFFICERS FLAGGED FOR DIRECT ACCOUNTABILITY:
--------------------------------------------
- Worst Performing Officer: N. Dakshinamurthy (Sewage Operations Head)
- Active Supervisor: M.V. Andiappan

COMMISSIONER ACTION:
Please authorize direct command override & dispatch state sanitation reserve forces. No further warnings issued.`);
    
    setIsEscalating(false);
  };

  const commEmails = escalationLogs.filter(e => e.toRole === "Municipal Commissioner");

  return (
    <div id="commissioner-escalation-module" className="bg-[#121214] border border-zinc-800 rounded-xl p-5 shadow-lg space-y-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">Module 6: Commissioner Escalation Gate</h3>
            <p className="text-[10px] text-zinc-500">Automated Direct Escalation Report Generator</p>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/25 font-bold">
          THRESHOLD: Performance &lt; 30%
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* controller */}
        <div className="md:col-span-5 space-y-3">
          <div className="bg-[#18181c] p-3.5 rounded-xl border border-zinc-850 space-y-2">
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Select Failing Department:
            </label>
            <select
              value={selectedDeptCode}
              onChange={(e) => setSelectedDeptCode(e.target.value)}
              className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-lg p-2 text-xs font-mono text-zinc-300 focus:outline-none"
            >
              {failingDepartments.length > 0 ? (
                failingDepartments.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.name} ({d.code}) - {d.slaCompliance}% Performance
                  </option>
                ))
              ) : (
                <option value="SEW">Sewage Operations (SEW) - 25% Performance</option>
              )}
            </select>
            <p className="text-[10px] text-zinc-500 leading-relaxed pt-1">
              Select any department whose performance has fallen below the critical 30% mark to trigger the Commissioner Alert.
            </p>
          </div>

          <button
            onClick={handleEscalateToCommissioner}
            disabled={isEscalating}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-rose-950/45 cursor-pointer flex items-center justify-center gap-1.5"
          >
            {isEscalating ? (
              <span>🛠️ Generating Commissioner Dossier...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" /> Compile & Send Audit Report
              </>
            )}
          </button>
        </div>

        {/* formal report viewer */}
        <div className="md:col-span-7 flex flex-col">
          <div className="bg-[#0a0a0c] border border-zinc-850 rounded-xl p-3.5 flex-1 font-mono text-[11px] leading-relaxed select-text min-h-[220px] max-h-[300px] overflow-y-auto text-rose-300/90 whitespace-pre-line border-t border-t-rose-500/30">
            {reportLog ? (
              reportLog
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-zinc-650 space-y-2">
                <FileSpreadsheet className="w-8 h-8 text-zinc-800" />
                <p className="text-zinc-600">Click compile above to generate a detailed SLA delay report.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Audit Inbox */}
      {commEmails.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-zinc-900">
          <span className="text-[10px] text-zinc-500 block uppercase font-bold">Commissioner Inbox (SMTP Receipts)</span>
          <div className="space-y-1.5 max-h-[120px] overflow-y-auto">
            {commEmails.map((mail) => (
              <div key={mail.id} className="bg-rose-950/10 border border-rose-900/35 p-2 rounded-lg text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold text-rose-300">📧 To: Katta Ravi Teja</span>
                  <span className="text-[10px] text-zinc-400 block truncate max-w-[400px]">{mail.subject}</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 font-mono">
                  DELIVERED
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
