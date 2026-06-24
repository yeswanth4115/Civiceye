import React, { useState, useEffect } from 'react';
import { MOCKED_CITIZENS } from './data';
import { CivicIssue, DepartmentMetric, VerifiedCitizen, ResidentVerification, EmailLog } from './types';
import { CitizenAuthCard } from './components/CitizenAuthCard';
import { ConsensusRadarCard } from './components/ConsensusRadarCard';
import { EmailDispatcherCard } from './components/EmailDispatcherCard';
import { DepartmentMetricsCard } from './components/DepartmentMetricsCard';
import { CommissionerEscalationCard } from './components/CommissionerEscalationCard';
import { ReportIssueModal } from './components/ReportIssueModal';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import {
  Sparkles,
  Plus,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  ThumbsUp,
  Layers,
  MapPin,
  Fingerprint,
  Users,
  Mail,
  AlertTriangle,
  Flame,
  Info,
  Check,
  Building,
  UserCheck
} from 'lucide-react';

export default function App() {
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [departments, setDepartments] = useState<DepartmentMetric[]>([]);
  const [emails, setEmails] = useState<EmailLog[]>([]);
  
  const [selectedIssueId, setSelectedIssueId] = useState<string>('');
  const [currentCitizen, setCurrentCitizen] = useState<VerifiedCitizen | null>(null);
  
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterZone, setFilterZone] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [globalMessage, setGlobalMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

  // Auto-dismiss global message toast
  useEffect(() => {
    if (globalMessage) {
      const timer = setTimeout(() => {
        setGlobalMessage(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [globalMessage]);

  // Load backend state on mount
  useEffect(() => {
    fetchIssuesState();
  }, []);

  const fetchIssuesState = async () => {
    try {
      const res = await fetch('/api/issues');
      const data = await res.json();
      if (data.success) {
        setIssues(data.issues);
        setDepartments(data.departments);
        setEmails(data.emails);
        if (data.issues.length > 0 && !selectedIssueId) {
          setSelectedIssueId(data.issues[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load issues state:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedIssue = issues.find((i) => i.id === selectedIssueId) || issues[0];

  const handleAddNewIssue = async (newIssue: CivicIssue) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/issues/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issue: newIssue })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedIssueId(newIssue.id);
        await fetchIssuesState();
        setGlobalMessage({
          text: `Grievance ticket ${newIssue.id} filed successfully!`,
          type: "success"
        });
      }
    } catch (err) {
      console.error("Failed to create issue:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulateVoteCast = async (vote: ResidentVerification) => {
    if (!selectedIssue) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/issues/vote-simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueId: selectedIssue.id, verification: vote })
      });
      const data = await res.json();
      if (data.success) {
        await fetchIssuesState();
        setGlobalMessage({
          text: "Proximity consensus vote registered!",
          type: "success"
        });
      } else {
        setGlobalMessage({
          text: data.error || "Failed to register proximity vote.",
          type: "error"
        });
      }
    } catch (err) {
      console.error("Failed to register vote:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolveSimulate = async () => {
    if (!selectedIssue) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/issues/resolve-simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueId: selectedIssue.id })
      });
      const data = await res.json();
      if (data.success) {
        await fetchIssuesState();
        setGlobalMessage({
          text: "Grievance marked as resolved & verified successfully!",
          type: "success"
        });
      }
    } catch (err) {
      console.error("Failed to resolve issue:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerCommissionerEscalation = async (deptCode: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/escalate/commissioner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          issueId: selectedIssue?.department === "Sewage Operations" ? selectedIssue.id : "CIV-COI-1005",
          departmentCode: deptCode 
        })
      });
      const data = await res.json();
      if (data.success) {
        await fetchIssuesState();
      }
    } catch (err) {
      console.error("Failed to escalate to commissioner:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpvote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCitizen) {
      setGlobalMessage({
        text: "Authentication Required: Please complete the Citizen Onboarding form at the bottom of the page to like/upvote grievances.",
        type: 'error'
      });
      document.getElementById("citizen-auth-module")?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    try {
      const res = await fetch("/api/issues/upvote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issueId: id,
          citizenUid: currentCitizen.uid,
          citizenName: currentCitizen.name
        })
      });
      const data = await res.json();
      if (data.success) {
        setIssues(data.issues);
        setGlobalMessage({
          text: "Grievance upvoted successfully!",
          type: "success"
        });
      } else {
        setGlobalMessage({
          text: data.error || "You have already upvoted this issue!",
          type: "error"
        });
      }
    } catch (err) {
      console.error("Failed to upvote:", err);
    }
  };

  const filteredIssues = issues.filter((i) => {
    const categoryMatch = filterCategory === 'All' || i.category === filterCategory;
    const zoneMatch = filterZone === 'All' || i.zone === filterZone;
    return categoryMatch && zoneMatch;
  });

  const categoriesList = ['All', 'Water Leakage', 'Road Damage', 'Sanitation', 'Streetlight', 'Sewage Overflow'];
  const zonesList = ['All', 'Central Zone', 'East Zone', 'West Zone', 'North Zone', 'South Zone'];

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 font-sans p-3 sm:p-6 pb-12 space-y-6 selection:bg-indigo-500 selection:text-white">
      {globalMessage && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-2xl animate-fadeIn ${
          globalMessage.type === 'error' 
            ? 'bg-rose-950/90 border-rose-500/30 text-rose-200' 
            : 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200'
        }`}>
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="text-xs font-semibold">{globalMessage.text}</span>
          <button onClick={() => setGlobalMessage(null)} className="ml-2 hover:text-white font-bold cursor-pointer">×</button>
        </div>
      )}
      
      {/* GLOBAL HEADER */}
      <header className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center py-4 px-4 bg-[#121214] border border-zinc-800 rounded-2xl gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest font-mono">
              Coimbatore Command Core v3.1
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            CIVIC<span className="text-indigo-500">EYE</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Multi-Module AI-Powered Civic Incident Verification, Radius-Consensus, and Automated SLA Accountability Platform
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {currentCitizen ? (
            <div className="flex items-center gap-2.5 bg-[#18181c] border border-zinc-800 px-3 py-1.5 rounded-xl text-xs">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-zinc-400">Authenticated: <strong>{currentCitizen.name}</strong></span>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 bg-rose-950/20 border border-rose-900/35 px-3 py-1.5 rounded-xl text-xs text-rose-300">
              <span className="w-2 h-2 bg-rose-500 rounded-full" />
              <span>Please authenticate citizen below first.</span>
            </div>
          )}

          <button
            onClick={() => {
              if (!currentCitizen) {
                setGlobalMessage({
                  text: "Authentication Required: Please complete the Citizen Onboarding form at the bottom of the page to file a complaint.",
                  type: 'error'
                });
                document.getElementById("citizen-auth-module")?.scrollIntoView({ behavior: 'smooth' });
                return;
              }
              setIsReportModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-indigo-900/30 cursor-pointer ml-auto sm:ml-0"
          >
            <Plus className="w-4 h-4" />
            File Live Complaint
          </button>
        </div>
      </header>

      {/* CORE CONTENT LAYOUT */}
      <main className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        
        {/* LEFT PANEL: FILTERS & INTAKE FEED (col-span-4) */}
        <div className="xl:col-span-4 bg-[#121214] border border-zinc-800 rounded-2xl p-5 flex flex-col h-[760px]">
          <div className="text-[11px] font-bold uppercase text-zinc-500 mb-3.5 flex justify-between items-center">
            <span className="flex items-center gap-1.5 font-bold">
              <Layers className="w-4 h-4 text-indigo-400" />
              Intake Grievance Feed
            </span>
            <span className="font-mono bg-zinc-900 px-2 py-0.5 rounded text-[10px] text-zinc-400">
              {filteredIssues.length} ACTIVE CASES
            </span>
          </div>

          {/* Filtering Rails */}
          <div className="space-y-2 pb-4 border-b border-zinc-850">
            <div>
              <span className="text-[9px] text-zinc-500 uppercase font-mono font-bold block mb-1">Filter by Category</span>
              <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-medium shrink-0 transition-colors cursor-pointer ${
                      filterCategory === cat
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-[#1a1a1e] text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[9px] text-zinc-500 uppercase font-mono font-bold block mb-1">Filter by Zone</span>
              <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                {zonesList.map((zone) => (
                  <button
                    key={zone}
                    onClick={() => setFilterZone(zone)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-medium shrink-0 transition-colors cursor-pointer ${
                      filterZone === zone
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-[#1a1a1e] text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    {zone}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Feed List */}
          <div className="flex-1 overflow-y-auto space-y-2.5 mt-4 pr-1 scrollbar-thin">
            {isLoading && issues.length === 0 ? (
              <div className="h-full flex items-center justify-center text-zinc-650 text-xs">
                <span>🔄 Syncing city dashboard state...</span>
              </div>
            ) : filteredIssues.length > 0 ? (
              filteredIssues.map((iss) => {
                const isSelected = iss.id === selectedIssueId;
                const isCritical = iss.severity === "Critical";
                const isFailingSla = iss.status === "Escalated" || iss.delayProbability > 75;

                return (
                  <div
                    key={iss.id}
                    onClick={() => setSelectedIssueId(iss.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-[#18181c] border-indigo-500/80 shadow-lg'
                        : 'bg-[#0f0f11]/80 border-zinc-850 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono text-zinc-400 font-bold">
                          #{iss.reportNumber}
                        </span>
                        <span className="text-[9px] text-zinc-500 font-mono ml-2">
                          Zone: {iss.zone}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                          isCritical 
                            ? 'bg-rose-950/40 text-rose-400 border border-rose-900/40' 
                            : 'bg-zinc-800 text-zinc-300'
                        }`}>
                          {iss.severity}
                        </span>
                        
                        <button
                          onClick={(e) => handleUpvote(iss.id, e)}
                          className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-indigo-400 bg-zinc-850/60 px-1.5 py-0.5 rounded border border-zinc-800"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          {iss.upvotes}
                        </button>
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-zinc-200 mt-2 line-clamp-1 group-hover:text-white">
                      {iss.title}
                    </h4>

                    <p className="text-[10px] text-zinc-500 line-clamp-2 mt-1">
                      {iss.description}
                    </p>

                    <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-zinc-850/50">
                      <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" /> Deadline: {iss.predictedDeadline}
                      </span>
                      
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        iss.status === 'Verified' || iss.status === 'Resolved'
                          ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/45'
                          : isFailingSla
                          ? 'bg-rose-950/30 text-rose-400 border border-rose-900/45 animate-pulse'
                          : 'bg-indigo-950/30 text-indigo-400 border border-indigo-900/45'
                      }`}>
                        {iss.status}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-zinc-650 p-4">
                <p className="text-xs">No active reports match selected filter bounds.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: SELECTED ISSUE WORKFLOW ACTION (col-span-8) */}
        <div className="xl:col-span-8 space-y-5">
          
          {selectedIssue ? (
            <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-6 space-y-5">
              
              {/* COMPREHENSIVE WORKFLOW TRACKER */}
              <div className="space-y-2">
                <span className="text-[9px] text-zinc-500 font-mono font-bold uppercase tracking-wider block">
                  End-to-End Civil Remediation Pipeline Status
                </span>
                <div className="grid grid-cols-6 gap-1 text-[9px] text-center font-mono font-bold">
                  <div className={`p-1.5 rounded ${
                    selectedIssue.status !== 'Intake' ? 'bg-indigo-950 text-indigo-400 border border-indigo-800/40' : 'bg-indigo-650 text-white'
                  }`}>
                    1. Intake OCR
                  </div>
                  <div className={`p-1.5 rounded ${
                    selectedIssue.exifData?.isAuthentic ? 'bg-indigo-950 text-indigo-400 border border-indigo-800/40' : 'bg-zinc-900 text-zinc-600'
                  }`}>
                    2. Exif Check
                  </div>
                  <div className={`p-1.5 rounded ${
                    selectedIssue.verifications.length >= 3 ? 'bg-indigo-950 text-indigo-400 border border-indigo-800/40' : 'bg-zinc-900 text-zinc-600 animate-pulse'
                  }`}>
                    3. Radius Cons
                  </div>
                  <div className={`p-1.5 rounded ${
                    selectedIssue.emailDispatched ? 'bg-indigo-950 text-indigo-400 border border-indigo-800/40' : 'bg-zinc-900 text-zinc-600'
                  }`}>
                    4. Email Sent
                  </div>
                  <div className={`p-1.5 rounded ${
                    selectedIssue.status === 'Verified' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' : 'bg-zinc-900 text-zinc-600'
                  }`}>
                    5. Resolution
                  </div>
                  <div className={`p-1.5 rounded ${
                    selectedIssue.isEscalatedToCommissioner ? 'bg-rose-950 text-rose-400 border border-rose-800/40 animate-pulse' : 'bg-zinc-900 text-zinc-600'
                  }`}>
                    6. Comm Esc Gate
                  </div>
                </div>
              </div>

              {/* Main details banner */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2 border-t border-zinc-850">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                      {selectedIssue.title}
                    </h2>
                  </div>
                  
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
                    {selectedIssue.description}
                  </p>
                  
                  <div className="text-[11px] text-indigo-400 font-mono pt-1">
                    📍 Location Address: <span className="underline text-zinc-300 font-semibold">{selectedIssue.location}</span>
                  </div>
                </div>

                <div className="text-right sm:shrink-0 text-xs">
                  <div className="font-mono text-zinc-500">Report ID: <span className="text-zinc-300 font-bold">{selectedIssue.id}</span></div>
                  <div className="font-mono text-zinc-500 mt-1">Reporter: <span className="text-indigo-400 font-bold">{selectedIssue.reporterName}</span></div>
                </div>
              </div>

              {/* Grid with EXIF forensics and details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#18181c] p-4 rounded-xl border border-zinc-850 space-y-2">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">Responsible Team Routing</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#0f0f11] p-2 rounded border border-zinc-900">
                      <span className="text-[9px] text-zinc-500 block">Department</span>
                      <strong className="text-zinc-200">{selectedIssue.department}</strong>
                    </div>
                    <div className="bg-[#0f0f11] p-2 rounded border border-zinc-900">
                      <span className="text-[9px] text-zinc-500 block">Lead Officer</span>
                      <strong className="text-zinc-200">{selectedIssue.assignedOfficer}</strong>
                    </div>
                    <div className="bg-[#0f0f11] p-2 rounded border border-zinc-900 col-span-2">
                      <span className="text-[9px] text-zinc-500 block">Local Supervisor Contact</span>
                      <strong className="text-zinc-200 font-mono text-[10px]">{selectedIssue.localSupervisor} ({selectedIssue.zone})</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-[#18181c] p-4 rounded-xl border border-zinc-850 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-bold">Resolution SLA Deadline</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-5 h-5 text-emerald-400" />
                      <div>
                        <span className="text-sm font-extrabold text-emerald-400">{selectedIssue.predictedDeadline} Target</span>
                        <span className="text-[9px] text-zinc-500 block">Predicted initially by Gemini Neural Severity Engine</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0c0c0e] border border-zinc-900 p-2 rounded text-[10px] italic text-zinc-500 leading-normal">
                    "AI Reasoning: {selectedIssue.reasoning}"
                  </div>
                </div>
              </div>

              {/* INTERACTION PIPELINE GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Module 3 Consensus */}
                <ConsensusRadarCard 
                  issue={selectedIssue} 
                  onVoteCast={handleSimulateVoteCast} 
                  currentCitizen={currentCitizen}
                />

                {/* Module 4 Email triggers */}
                <EmailDispatcherCard 
                  issue={selectedIssue} 
                  onDispatchTriggered={fetchIssuesState} 
                />

              </div>

              {/* Verification & before/after closure tool */}
              <div className="bg-[#18181c] border border-zinc-850 p-5 rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2.5">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Remediation Status Visuals</h3>
                    <p className="text-[10px] text-zinc-500">Citizen audit loop with comparative photos</p>
                  </div>
                  {selectedIssue.citizenVerified ? (
                    <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/20">
                      ✓ REMEDIATION VERIFIED BY RESIDENTS
                    </span>
                  ) : (
                    <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 font-bold border border-amber-500/20">
                      INSPECTION IN PROGRESS
                    </span>
                  )}
                </div>

                {selectedIssue.afterImg ? (
                  <BeforeAfterSlider
                    beforeImg={selectedIssue.beforeImg || "https://images.unsplash.com/photo-1542013936693-859e53936323?auto=format&fit=crop&w=600&q=80"}
                    afterImg={selectedIssue.afterImg}
                    category={selectedIssue.category}
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 text-center">
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Before fixing</span>
                      <div className="bg-black border border-zinc-900 rounded-xl overflow-hidden h-[180px] flex items-center justify-center">
                        <img 
                          src={selectedIssue.beforeImg || "https://images.unsplash.com/photo-1542013936693-859e53936323?auto=format&fit=crop&w=600&q=80"} 
                          alt="Before" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 text-center">
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">After fixing</span>
                      <div className="bg-[#0b0b0d]/50 border border-zinc-900 border-dashed rounded-xl overflow-hidden h-[180px] flex items-center justify-center relative">
                        <div className="p-4 space-y-3 text-center">
                          <p className="text-[11px] text-zinc-500 leading-normal">
                            No closure proof uploaded by local supervisor yet. Once community consensus is achieved, engineers perform remediation.
                          </p>
                          {!selectedIssue.citizenVerified && (
                            <button
                              onClick={handleResolveSimulate}
                              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all shadow-lg shadow-emerald-950/40 cursor-pointer inline-flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" /> Simulate Repair & Solve Ticket
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-12 text-center text-zinc-600">
              Select an intake report from the left panel to inspect the AI remediation status.
            </div>
          )}

        </div>

      </main>

      {/* LOWER PANEL: GLOBAL STATE METRICS (MODULE 5 & MODULE 6) */}
      <section className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-5">
        
        {/* Module 5 Dashboard Grid (col-span-8) */}
        <div className="xl:col-span-8">
          <DepartmentMetricsCard 
            metrics={departments} 
            onEscalateClick={handleTriggerCommissionerEscalation}
            canEscalateDeptCode={selectedIssue?.department === "Sewage Operations" ? "SEW" : null}
          />
        </div>

        {/* Module 1 Citizen login side block (col-span-4) */}
        <div className="xl:col-span-4">
          <CitizenAuthCard 
            currentCitizen={currentCitizen} 
            onVerified={(citizen) => setCurrentCitizen(citizen)}
            onLogout={() => setCurrentCitizen(null)}
          />
        </div>

      </section>

      {/* COMMISSIONER ESCALATION ZONE */}
      <section className="max-w-[1600px] mx-auto">
        <CommissionerEscalationCard 
          failingDepartments={departments.filter(d => d.slaCompliance < 30)} 
          onTriggerEscalation={handleTriggerCommissionerEscalation}
          escalationLogs={emails}
        />
      </section>

      {/* REPORT ISSUE MODAL INTAKE */}
      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleAddNewIssue}
        currentCitizen={currentCitizen}
      />

    </div>
  );
}
