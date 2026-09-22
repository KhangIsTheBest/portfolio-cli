'use client';

import React from 'react';
import { GitCommit, GitPullRequest, GitBranch, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const GitGraph: React.FC = () => {
  const { locale } = useLanguage();

  // Generate 52 weeks x 7 days grid with mock commit intensity (0-4)
  const generateContributionData = () => {
    const days = [];
    for (let i = 0; i < 364; i++) {
      // Create realistic cluster pattern for engineering activity
      const seed = Math.sin(i * 12.5) * 10;
      let level = 0;
      if (seed > 6) level = 4;
      else if (seed > 3) level = 3;
      else if (seed > 0) level = 2;
      else if (seed > -4) level = 1;
      days.push(level);
    }
    return days;
  };

  const contributions = generateContributionData();

  const getLevelBg = (level: number) => {
    switch (level) {
      case 4: return 'bg-indigo-500 border-[var(--primary-color)]';
      case 3: return 'bg-indigo-600/40 border-[var(--primary-color)]/50';
      case 2: return 'bg-indigo-600/50 border-[var(--primary-border)]';
      case 1: return 'bg-indigo-950/40 border-indigo-800/30';
      default: return 'bg-white/[0.02] border-white/[0.05]';
    }
  };

  return (
    <div className="w-full border border-white/[0.08] bg-[#0d0f17] rounded-2xl p-5 space-y-4 font-mono select-text shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div className="flex items-center space-x-2">
          <GitCommit className="w-4 h-4 text-[var(--primary-color)]" />
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            {locale === 'vi' ? 'LỊCH SỬ COMMIT & CODE ACTIVITY (52 WEEKS)' : 'ENGINEERING COMMIT HISTORY (52 WEEKS)'}
          </h4>
        </div>
        <div className="flex items-center space-x-3 text-[10px] text-slate-400">
          <span className="flex items-center gap-1 font-bold text-[var(--primary-color)]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>1,420+ COMMITS</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1">
            <GitBranch className="w-3 h-3 text-amber-400" />
            <span>main / release</span>
          </span>
        </div>
      </div>

      {/* Grid container */}
      <div className="overflow-x-auto pb-1 scrollbar-none">
        <div className="inline-grid grid-rows-7 grid-flow-col gap-1 min-w-[650px]">
          {contributions.map((level, idx) => (
            <div
              key={idx}
              className={`w-2.5 h-2.5 rounded-[2px] border ${getLevelBg(level)} transition-colors hover:scale-125 cursor-pointer`}
              title={`Day ${idx + 1}: ${level * 3} commits`}
            />
          ))}
        </div>
      </div>

      {/* Legend & Stats Footer */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/[0.04]">
        <div className="flex items-center space-x-2">
          <span>Less</span>
          <div className="flex space-x-1">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-white/[0.02] border border-white/[0.05]" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-indigo-950/40 border border-indigo-800/30" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-indigo-600/50 border border-[var(--primary-border)]" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-indigo-600/40 border border-[var(--primary-color)]/50" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-indigo-500 border border-[var(--primary-color)]" />
          </div>
          <span>More</span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1">
            <GitPullRequest className="w-3 h-3 text-sky-400" />
            <span>48 Merged PRs</span>
          </span>
          <span className="text-[var(--primary-color)] font-bold">100% Verified Signatures</span>
        </div>
      </div>
    </div>
  );
};
