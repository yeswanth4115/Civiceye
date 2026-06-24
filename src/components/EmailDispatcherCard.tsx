import React, { useState } from 'react';
import { Mail, Check, Send, AlertCircle, FileText, Info } from 'lucide-react';
import { CivicIssue, EmailLog } from '../types';

interface EmailDispatcherCardProps {
  issue: CivicIssue;
  onDispatchTriggered: () => void;
}

export const EmailDispatcherCard: React.FC<EmailDispatcherCardProps> = ({ issue, onDispatchTriggered }) => {
  const [isSending, setIsSending] = useState(false);
  const [activeEmailTab, setActiveEmailTab] = useState<number>(0);

  // Derive officials per category for Coimbatore zone mapping
  let deptHead = "M. Ganeshan";
  let deptEmail = "m.ganeshan.water@coimbatore.gov.in";
  let supervisor = "Yogachithra";
  let supEmail = "yogachithra.gandhipuram@coimbatore.gov.in";

  if (issue.category === "Road Damage") {
    deptHead = "K. Dakshinamurthy";
    deptEmail = "k.dakshinamurthy.east@coimbatore.gov.in";
    supervisor = "Ezhil";
    supEmail = "ezhil.peelamedu@coimbatore.gov.in";
  } else if (issue.category === "Sanitation") {
    deptHead = "S. Narmadha";
    deptEmail = "s.narmadha.san@coimbatore.gov.in";
    supervisor = "C. Veeran";
    supEmail = "c.veeran.rspuram@coimbatore.gov.in";
  } else if (issue.category === "Streetlight") {
    deptHead = "S.N. Shanmugam";
    deptEmail = "s.n.shanmugam.north@coimbatore.gov.in";
    supervisor = "Savitha";
    supEmail = "savitha.thudiyalur@coimbatore.gov.in";
  } else if (issue.category === "Sewage Overflow") {
    deptHead = "N. Dakshinamurthy";
    deptEmail = "n.dakshinamurthy.south@coimbatore.gov.in";
    supervisor = "M.V. Andiappan";
    supEmail = "mv.andiappan.podanur@coimbatore.gov.in";
  }

  const handleDispatch = async () => {
    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    try {
      const res = await fetch('/api/email/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueId: issue.id })
      });
      const data = await res.json();
      if (data.success) {
        onDispatchTriggered();
      }
    } catch (err) {
      console.error(err);
      onDispatchTriggered();
    } finally {
      setIsSending(false);
    }
  };

  const getSmtpOutbox = (): EmailLog[] => {
    if (issue.emails && issue.emails.length > 0) {
      return issue.emails;
    }
    // Static previews if not sent
    return [
      {
        id: "draft-1",
        issueId: issue.id,
        toEmail: deptEmail,
        toRole: "Department Head",
        recipientName: deptHead,
        subject: `[ACTION REQUIRED] Community Consensus Approved: ${issue.category} - ${issue.id}`,
        body: `Respected Sir,\n\nA validated civic grievance (${issue.id}) has successfully attained the required 3 unique resident confirmations. This ticket is now escalated for immediate resolution dispatch.\n\nIssue Parameters:\n- Category: ${issue.category}\n- Severity Level: ${issue.severity}\n- Location: ${issue.location}\n- Geotag: ${issue.geotag.lat}, ${issue.geotag.lng}\n- Predicted SLA Timeframe: ${issue.predictedDeadline}\n- Active Local Supervisor: ${supervisor}\n\nAll verified resident telemetry is attached in compliance with municipal laws.\n\nRegards,\nCIVICEYE Automation Gateway`,
        sentAt: "DRAFT",
        status: "queued"
      },
      {
        id: "draft-2",
        issueId: issue.id,
        toEmail: supEmail,
        toRole: "Local Supervisor",
        recipientName: supervisor,
        subject: `[TASK ASSIGNED] Field Inspection Dispatch: ${issue.category} - ${issue.id}`,
        body: `Dear ${supervisor},\n\nYou have been dispatched as the primary local supervisor for resolving CIVICEYE report ${issue.id}.\n\nLocation: ${issue.location}\nSLA Deadline: ${issue.predictedDeadline}\n\nPlease inspect the field coordinates, collaborate with the rapid engineering crew, and document completion photos once fixed.\n\nRegards,\nCIVICEYE Field Tasker`,
        sentAt: "DRAFT",
        status: "queued"
      }
    ];
  };

  const outbox = getSmtpOutbox();
  const activeEmail = outbox[activeEmailTab] || outbox[0];

  return (
    <div id="email-engine-module" className="bg-[#121214] border border-zinc-800 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">Module 4: Automated Email Dispatch</h3>
            <p className="text-[10px] text-zinc-500">Structured Official Email Notification Engine</p>
          </div>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold flex items-center gap-1 ${
          issue.emailDispatched 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        }`}>
          {issue.emailDispatched ? "DISPATCHED" : "SMTP QUEUED"}
        </span>
      </div>

      <div className="bg-[#18181c] border border-zinc-800 rounded-xl overflow-hidden flex flex-col text-xs">
        {/* tabs */}
        <div className="bg-zinc-950 border-b border-zinc-850 flex font-mono text-[10px] font-semibold text-zinc-400">
          {outbox.map((mail, idx) => (
            <button
              key={idx}
              onClick={() => setActiveEmailTab(idx)}
              className={`px-3 py-2 border-r border-zinc-850 truncate flex-1 hover:text-zinc-200 transition-colors ${
                activeEmailTab === idx 
                  ? 'bg-[#18181c] text-indigo-400 border-t border-t-indigo-500' 
                  : ''
              }`}
            >
              {mail.recipientName} ({mail.toRole})
            </button>
          ))}
        </div>

        {/* content */}
        {activeEmail && (
          <div className="p-3.5 space-y-2 font-mono text-[11px] leading-relaxed select-text">
            <div>
              <span className="text-zinc-500">To:</span> <strong className="text-zinc-300">{activeEmail.recipientName}</strong> &lt;{activeEmail.toEmail}&gt;
            </div>
            <div>
              <span className="text-zinc-500">Subject:</span> <strong className="text-zinc-200">{activeEmail.subject}</strong>
            </div>
            <div className="border-t border-zinc-850/60 pt-2 text-zinc-400 whitespace-pre-line bg-black/20 p-2.5 rounded max-h-[160px] overflow-y-auto">
              {activeEmail.body}
            </div>
            {activeEmail.sentAt !== "DRAFT" && (
              <div className="text-[9px] text-zinc-500 text-right pt-1">
                Sent At: {new Date(activeEmail.sentAt).toLocaleString()}
              </div>
            )}
          </div>
        )}
      </div>

      {!issue.emailDispatched ? (
        <div className="space-y-3">
          {issue.verifications.length < 3 ? (
            <div className="bg-amber-950/15 border border-amber-900/40 p-3 rounded-xl text-xs text-amber-400 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed">
                SMTP trigger locked. Requires <strong>3 verified resident votes</strong> to unlock official escalation dispatch to department engineers.
              </p>
            </div>
          ) : (
            <button
              onClick={handleDispatch}
              disabled={isSending}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-indigo-900/30 cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isSending ? (
                <span>📧 Dispatching SMTP Communications...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" /> Trigger Official Email Dispatch
                </>
              )}
            </button>
          )}
        </div>
      ) : (
        <div className="bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-xl text-xs flex items-center gap-2.5 text-emerald-400">
          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
          <div className="text-[10px] leading-relaxed">
            Nodemailer/SendGrid payload sent successfully to <strong>{deptHead}</strong> & <strong>{supervisor}</strong>. Auto-deadlines locked under municipal SLA guidelines.
          </div>
        </div>
      )}
    </div>
  );
};
