import React from 'react';
import { BarChart3, AlertTriangle, CheckCircle2, TrendingUp, Clock, HelpCircle } from 'lucide-react';
import { DepartmentMetric } from '../types';

interface DepartmentMetricsCardProps {
  metrics: DepartmentMetric[];
  onEscalateClick: (deptCode: string) => void;
  canEscalateDeptCode: string | null;
}

export const DepartmentMetricsCard: React.FC<DepartmentMetricsCardProps> = ({ metrics, onEscalateClick, canEscalateDeptCode }) => {
  return (
    <div id="department-dashboard-module" className="bg-[#121214] border border-zinc-800 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">Module 5: Department Performance</h3>
            <p className="text-[10px] text-zinc-500">Live SLA Performance Metrics Formula: Solved / Total × 100</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {metrics.map((dept, idx) => {
          // Calculate Formula strictly: Solved / Total * 100
          const computedPerformance = dept.totalCases > 0 
            ? Math.round((dept.solvedCases / dept.totalCases) * 100) 
            : 100;
          
          const isFailing = computedPerformance < 30;

          return (
            <div 
              key={idx} 
              className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all relative overflow-hidden ${
                isFailing 
                  ? 'bg-rose-950/15 border-rose-900/40 text-rose-300' 
                  : 'bg-[#18181c] border-zinc-850 hover:border-zinc-700 text-zinc-200'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/40 text-zinc-400 uppercase">
                    {dept.code}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-mono truncate">{dept.zone}</span>
                </div>
                
                <h4 className="text-[11px] font-bold truncate text-zinc-200 pt-1" title={dept.name}>
                  {dept.name}
                </h4>
              </div>

              {/* Live KPI calculation formula display */}
              <div className="my-3.5 space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-[9px] text-zinc-500 font-mono">Formula KPI</span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {dept.solvedCases} / {dept.totalCases}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[16px] font-extrabold font-mono tracking-tight text-white">
                    {computedPerformance}%
                  </span>
                  <span className={`text-[9px] px-1 rounded font-bold ${
                    isFailing ? 'bg-rose-900/45 text-rose-300 animate-pulse' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {isFailing ? "CRITICAL SLA" : "COMPLIANT"}
                  </span>
                </div>

                {/* mini progress bar */}
                <div className="w-full bg-black/40 h-1 rounded-full overflow-hidden mt-1.5">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      isFailing ? 'bg-rose-500' : computedPerformance > 75 ? 'bg-emerald-500' : 'bg-indigo-500'
                    }`} 
                    style={{ width: `${computedPerformance}%` }} 
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-[9px] font-mono text-zinc-500 border-t border-zinc-800/40 pt-2 flex flex-col">
                <div className="flex justify-between">
                  <span>Solved:</span>
                  <span className="text-zinc-300">{dept.solvedCases}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending:</span>
                  <span className="text-zinc-300">{dept.pendingCases}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delayed:</span>
                  <span className="text-zinc-300">{dept.delayedCases}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Res:</span>
                  <span className="text-zinc-300">{dept.avgResolutionDays}d</span>
                </div>
              </div>

              {isFailing && (
                <button
                  onClick={() => onEscalateClick(dept.code)}
                  className="mt-3 w-full py-1 bg-rose-600 hover:bg-rose-500 text-white rounded font-mono text-[9px] font-bold uppercase transition-all shadow shadow-rose-950/45 cursor-pointer"
                >
                  Escalate Gate ⚠️
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
