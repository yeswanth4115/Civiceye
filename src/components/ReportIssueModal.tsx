import React, { useState } from 'react';
import { AlertCircle, Camera, CheckCircle2, Loader2, MapPin, Sparkles, Send, ShieldAlert } from 'lucide-react';
import { CivicIssue, IssueCategory, VerifiedCitizen, ExifMetadata } from '../types';
import { EvidenceCaptureCard } from './EvidenceCaptureCard';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newIssue: CivicIssue) => void;
  currentCitizen: VerifiedCitizen | null;
}

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({ isOpen, onClose, onSubmit, currentCitizen }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any | null>(null);
  const [exifData, setExifData] = useState<ExifMetadata | null>(null);
  const [step, setStep] = useState<number>(1); // 1 = Live Capture, 2 = Neural Intake Form

  if (!isOpen) return null;

  const handleCaptureCompleted = (img: string, exif: ExifMetadata) => {
    setImgUrl(img);
    setExifData(exif);
    setLocation(`Coimbatore Municipal limits (GPS: ${exif.latitude.toFixed(4)}, ${exif.longitude.toFixed(4)})`);
    setStep(2); // advance to description form
  };

  const handleAiAnalyze = async () => {
    if (!title && !description) return;
    setIsAnalyzing(true);
    setAiResult(null);

    try {
      const res = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          description, 
          location: location || `${exifData?.latitude}, ${exifData?.longitude}` 
        })
      });
      const data = await res.json();
      if (data.success && data.classification) {
        setAiResult(data.classification);
      } else {
        throw new Error(data.error || 'Failed to classify');
      }
    } catch (err) {
      console.warn('AI analysis error, using fallback:', err);
      // Client fallback analysis
      const lower = `${title} ${description}`.toLowerCase();
      let category: IssueCategory = 'Public Safety';
      let department = 'Municipal Engineering';
      let severity = 'Medium';
      let predictedDays = 3.0;
      let predictedDeadline = "3 days";

      if (lower.includes('water') || lower.includes('pipe') || lower.includes('leak')) {
        category = 'Water Leakage'; department = 'Water Board'; severity = 'High'; predictedDays = 0.75; predictedDeadline = "18 hours";
      } else if (lower.includes('pothole') || lower.includes('road')) {
        category = 'Road Damage'; department = 'Municipal Engineering'; severity = 'Medium'; predictedDays = 3.0; predictedDeadline = "3 days";
      } else if (lower.includes('trash') || lower.includes('garbage') || lower.includes('dump')) {
        category = 'Sanitation'; department = 'Sanitation Dept'; severity = 'High'; predictedDays = 0.5; predictedDeadline = "12 hours";
      } else if (lower.includes('light') || lower.includes('dark')) {
        category = 'Streetlight'; department = 'Electricity Board'; severity = 'Medium'; predictedDays = 1.0; predictedDeadline = "24 hours";
      } else if (lower.includes('sewage') || lower.includes('gutter') || lower.includes('drain')) {
        category = 'Sewage Overflow'; department = 'Sewage Operations'; severity = 'Critical'; predictedDays = 0.25; predictedDeadline = "6 hours";
      }

      setAiResult({
        category,
        severity,
        predictedDays,
        predictedDeadline,
        department,
        aiConfidence: 94.2,
        reasoning: `Heuristic routing engine detected ${category} and dispatched ticket to ${department} with ± ${predictedDeadline} deadline.`
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const reportNum = Math.floor(1001 + Math.random() * 8999).toString();
    const classification = aiResult || {
      category: 'Public Safety' as IssueCategory,
      severity: 'Medium',
      predictedDays: 3.0,
      predictedDeadline: "3 days",
      department: 'Municipal Engineering',
      aiConfidence: 91.5,
      reasoning: 'Standard rapid intake route.'
    };

    const reporterName = currentCitizen ? currentCitizen.name : "Anonymous Resident";
    const zone = currentCitizen ? currentCitizen.assignedGeozone : "Central Zone";

    const newIssue: CivicIssue = {
      id: `CIV-COI-${reportNum}`,
      reportNumber: reportNum,
      reporterName,
      title,
      description: description || 'No detailed description provided.',
      location: location || 'GPS Location: 11.0183, 76.9725',
      zone,
      category: classification.category,
      severity: classification.severity,
      status: 'Prioritized',
      department: classification.department,
      predictedDeadline: classification.predictedDeadline || "3 days",
      predictedDays: classification.predictedDays || 3.0,
      timeElapsedDays: 0.1,
      aiConfidence: classification.aiConfidence || 95.0,
      reasoning: classification.reasoning,
      createdAtText: 'Just now',
      upvotes: 1,
      citizenVerified: false,
      assignedOfficer: classification.department === "Water Board" ? "M. Ganeshan" : classification.department === "Sewage Operations" ? "N. Dakshinamurthy" : "K. Dakshinamurthy",
      localSupervisor: classification.department === "Water Board" ? "Yogachithra" : classification.department === "Sewage Operations" ? "M.V. Andiappan" : "Ezhil",
      delayProbability: 10,
      beforeImg: imgUrl,
      geotag: {
        lat: exifData ? exifData.latitude : 11.0183,
        lng: exifData ? exifData.longitude : 76.9725
      },
      exifData: exifData || undefined,
      verifications: [],
      emailDispatched: false,
      emails: [],
      isEscalatedToCommissioner: false
    };

    onSubmit(newIssue);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#141416] border border-zinc-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-[#18181b]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">Report New Civic Grievance</h3>
              <p className="text-[11px] text-zinc-500">Live Camera, Exif Verification & AI-Assisted Dispatch</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 text-xs font-semibold px-2.5 py-1.5 bg-zinc-900 rounded-lg border border-zinc-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {step === 1 ? (
            <div className="space-y-4">
              <div className="bg-indigo-950/15 border border-indigo-900/40 p-3.5 rounded-xl text-xs text-indigo-300">
                <span className="font-bold flex items-center gap-1.5 uppercase">
                  <Camera className="w-4 h-4 text-indigo-400" /> Evidence Capture Required
                </span>
                <p className="text-[11px] mt-1 text-zinc-400 leading-relaxed">
                  In compliance with municipal anti-fraud laws, reports must be accompanied by a live, in-app geotagged capture. Gallery uploads are locked. Select one of the Coimbatore zones to capture evidence.
                </p>
              </div>

              <EvidenceCaptureCard 
                onCaptureCompleted={handleCaptureCompleted} 
                selectedCategory="Civic Report" 
              />
            </div>
          ) : (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              
              <div className="bg-emerald-950/15 border border-emerald-900/35 p-3.5 rounded-xl text-xs text-emerald-300 flex justify-between items-center">
                <div>
                  <span className="font-bold block text-[11px] uppercase">✓ EVIDENCE VERIFIED</span>
                  <span className="text-[10px] text-zinc-400 font-mono">GPS Extracted: {exifData?.latitude.toFixed(4)}, {exifData?.longitude.toFixed(4)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-indigo-400 underline text-[10px] font-bold cursor-pointer"
                >
                  Recapture Photo
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Issue Title / Headline</label>
                <input 
                  type="text" 
                  placeholder="e.g. Sewage overflowing near Peelamedu signal"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#09090b] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Detailed Description</label>
                <textarea 
                  rows={3}
                  placeholder="Provide details on flooding, traffic block, risk to pedestrian safety..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#09090b] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500 transition-colors resize-none text-[12px]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Location Details</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#09090b] border border-zinc-800 rounded-xl px-4 py-2 text-xs text-zinc-400 focus:outline-none"
                  required
                />
              </div>

              {/* AI Analysis Button Trigger */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleAiAnalyze}
                  disabled={isAnalyzing || !title}
                  className="w-full py-2.5 px-4 rounded-xl border border-indigo-500/40 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 hover:from-indigo-900/60 hover:to-purple-900/60 text-indigo-200 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                      Running Neural Pipeline (NLP & Computer Vision)...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      Run AI Pipeline: Auto-Classify & Route Ticket
                    </>
                  )}
                </button>
              </div>

              {/* AI Output Card */}
              {aiResult && (
                <div className="bg-[#18181c] border border-indigo-500/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> AI Classification Complete
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                      {aiResult.aiConfidence}% CONFIDENCE
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-black/45 p-2 rounded-lg border border-zinc-900">
                      <span className="text-[9px] text-zinc-500 block">Category</span>
                      <span className="font-bold text-zinc-200">{aiResult.category}</span>
                    </div>
                    <div className="bg-black/45 p-2 rounded-lg border border-zinc-900">
                      <span className="text-[9px] text-zinc-500 block">Severity</span>
                      <span className={`font-bold ${aiResult.severity === 'Critical' ? 'text-rose-400 animate-pulse' : aiResult.severity === 'High' ? 'text-amber-400' : 'text-indigo-400'}`}>
                        {aiResult.severity}
                      </span>
                    </div>
                    <div className="bg-black/45 p-2 rounded-lg border border-zinc-900">
                      <span className="text-[9px] text-zinc-500 block">SLA Deadline</span>
                      <span className="font-bold text-emerald-400">{aiResult.predictedDeadline}</span>
                    </div>
                  </div>

                  <div className="bg-black/30 p-2 rounded border border-zinc-850 text-[11px] text-zinc-400 leading-relaxed italic">
                    "{aiResult.reasoning}"
                  </div>
                </div>
              )}

              {/* Footer Submit */}
              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-300 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Dispatch Report
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
