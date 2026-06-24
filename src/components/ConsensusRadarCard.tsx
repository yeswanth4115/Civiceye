import React, { useState } from 'react';
import { Users, AlertTriangle, ShieldCheck, CheckCircle2, UserPlus, Fingerprint } from 'lucide-react';
import { CivicIssue, ResidentVerification, VerifiedCitizen } from '../types';

interface ConsensusRadarCardProps {
  issue: CivicIssue;
  onVoteCast: (v: ResidentVerification) => void;
  currentCitizen: VerifiedCitizen | null;
}

export const ConsensusRadarCard: React.FC<ConsensusRadarCardProps> = ({ issue, onVoteCast, currentCitizen }) => {
  const [residentName, setResidentName] = useState(currentCitizen?.name || '');
  const [distance, setDistance] = useState('120'); // distance in meters
  const [isCasting, setIsCasting] = useState(false);
  const [errorLog, setErrorLog] = useState('');
  const [botAnalysis, setBotAnalysis] = useState<string | null>(null);

  // Sync residentName if currentCitizen changes
  React.useEffect(() => {
    if (currentCitizen) {
      setResidentName(currentCitizen.name);
    } else {
      setResidentName('');
    }
  }, [currentCitizen]);

  const handleSimulateVote = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = currentCitizen?.name || residentName;
    if (!finalName) return;

    setIsCasting(true);
    setErrorLog('');
    setBotAnalysis(null);

    // AI/Anti-Fraud analysis step
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simple heuristic corresponding to backend rules
    const voterDist = parseInt(distance);
    const isSpoofedGps = voterDist === 0;

    let antiFraudPassed = true;
    let reason = "AI ANTI-FRAUD CLEAR: Unique voter profile verified. Geolocation signature matches resident registry. Device fingerprint checks out.";

    if (voterDist > 2000) {
      antiFraudPassed = false;
      reason = `ANTI-FRAUD REJECTION: Resident is located too far (${(voterDist/1000).toFixed(2)} km away). Confirmatory consensus requires a 2 km maximum radius bounds.`;
    } else if (isSpoofedGps) {
      antiFraudPassed = false;
      reason = "ANTI-FRAUD REJECTION: Coordinated bot manipulation pattern. GPS coordinate match variance is exactly 0 meters. Spoofed/simulated telemetry blocked.";
    }

    setBotAnalysis(reason);

    if (antiFraudPassed) {
      const newVote: ResidentVerification = {
        name: finalName,
        votedAt: new Date().toISOString(),
        distanceMeters: voterDist,
        antiFraudPassed: true
      };
      onVoteCast(newVote);
    } else {
      setErrorLog(reason);
    }
    setIsCasting(false);
  };

  const handleQuickSeed = (name: string, dist: string) => {
    setResidentName(currentCitizen?.name || name);
    setDistance(dist);
  };

  return (
    <div id="consensus-verification-module" className="bg-[#121214] border border-zinc-800 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">Module 3: Radius Consensus Engine</h3>
            <p className="text-[10px] text-zinc-500">Anti-Bot & Proximity Consensus Checks</p>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
          {issue.verifications.length} / 3 APPROVED
        </span>
      </div>

      <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900 space-y-1">
        <span className="text-[10px] text-zinc-500 block uppercase font-bold">Consensus Target Location</span>
        <div className="text-xs text-zinc-300 font-semibold truncate flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> {issue.location}
        </div>
        <span className="text-[9px] text-zinc-600 block mt-0.5">
          GPS Coordinates: {issue.geotag.lat}, {issue.geotag.lng} (Zone: {issue.zone})
        </span>
      </div>

      <div className="space-y-2">
        <span className="text-[10px] text-zinc-400 block uppercase font-bold">Verified Resident Confirmatory Votes:</span>
        <div className="space-y-1.5">
          {issue.verifications.map((v, idx) => (
            <div key={idx} className="bg-[#18181c]/80 border border-zinc-850 p-2 rounded-lg text-xs flex justify-between items-center animate-fadeIn">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <div>
                  <span className="font-bold text-zinc-200">{v.name}</span>
                  <span className="text-[9px] text-zinc-500 ml-1.5 font-mono">Nearby: {v.distanceMeters}m</span>
                </div>
              </div>
              <span className="text-[9px] text-emerald-400 bg-emerald-950/20 border border-emerald-800/30 px-1.5 py-0.5 rounded font-mono">
                PASS: LOCALITY CHECKS
              </span>
            </div>
          ))}

          {issue.verifications.length === 0 && (
            <p className="text-xs text-zinc-600 italic text-center py-2">
              Waiting for verified resident confirmations.
            </p>
          )}
        </div>
      </div>

      {issue.verifications.length >= 3 ? (
        <div className="bg-emerald-950/15 border border-emerald-900/40 p-3 rounded-xl text-xs flex items-center gap-2.5 text-emerald-400">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <div>
            <div className="font-bold uppercase tracking-wider text-[11px]">Consensus Level Achieved!</div>
            <p className="text-[10px] text-emerald-500/85">
              3 unique resident approvals reached. Automated email dispatcher unlocked.
            </p>
          </div>
        </div>
      ) : !currentCitizen ? (
        <div className="bg-zinc-950/40 border border-zinc-850/60 p-4 rounded-xl text-center space-y-2.5">
          <Fingerprint className="w-8 h-8 text-indigo-400/60 mx-auto animate-pulse" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wide">Identity Verification Required</h4>
            <p className="text-[10px] text-zinc-500 max-w-xs mx-auto">
              Only verified residents in the ward can cast proximity consensus votes. Please complete the Citizen Authentication form below.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSimulateVote} className="space-y-2.5 pt-1.5 border-t border-zinc-900">
          <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
            <span>Simulate Resident Confirmation</span>
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => handleQuickSeed(currentCitizen.name, '120')}
                className="hover:text-indigo-400 underline cursor-pointer"
              >
                + Match (120m)
              </button>
              <button 
                type="button" 
                onClick={() => handleQuickSeed(currentCitizen.name, '3200')}
                className="hover:text-rose-400 underline cursor-pointer"
              >
                + Spoof (Far)
              </button>
              <button 
                type="button" 
                onClick={() => handleQuickSeed(currentCitizen.name, '0')}
                className="hover:text-rose-400 underline cursor-pointer"
              >
                + Bot (0m)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[8px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">
                Resident Profile (Verified)
              </label>
              <input
                type="text"
                placeholder="Resident Name"
                value={residentName}
                readOnly
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-400 font-medium select-none cursor-not-allowed"
                required
              />
            </div>
            <div>
              <label className="block text-[8px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">
                Proximity Radius
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Distance (meters)"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-700 focus:outline-none pr-8 font-mono"
                  required
                />
                <span className="absolute right-2 top-2 text-[10px] text-zinc-600 font-mono">meters</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isCasting || !residentName}
            className="w-full py-2 bg-indigo-650 hover:bg-indigo-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" /> Confirm Proximity Vote
          </button>
        </form>
      )}

      {botAnalysis && (
        <div className={`p-2.5 rounded-lg border text-[10px] font-mono leading-relaxed ${
          errorLog 
            ? 'bg-rose-950/20 border-rose-900/40 text-rose-300'
            : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
        }`}>
          <div className="flex items-center gap-1 font-bold mb-1 uppercase text-zinc-300">
            <Fingerprint className="w-3.5 h-3.5" /> AI Consensus Anti-Fraud Audit
          </div>
          {botAnalysis}
        </div>
      )}
    </div>
  );
};
