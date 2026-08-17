'use client';

import React from 'react';
import { Terminal, Shield, GitCommit } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const Footer: React.FC = () => {
  const { locale } = useLanguage();

  return (
    <footer className="w-full max-w-7xl mx-auto border-t border-white/[0.06] pt-8 pb-12 mt-16 font-mono text-xs text-slate-400 select-text">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left info */}
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-slate-200">Phan Duy Khang</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">Software Engineer</span>
        </div>

        {/* Middle technical badges */}
        <div className="flex items-center space-x-3 text-[10px]">
          <span className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.08] px-2.5 py-1 rounded-md">
            <GitCommit className="w-3 h-3 text-amber-400" />
            <span>rev: 2026-rel-ui</span>
          </span>
          <span className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-md font-bold">
            <Shield className="w-3 h-3" />
            <span>SPRING BOOT + NEXT.JS</span>
          </span>
        </div>

        {/* Right copyright */}
        <div className="text-[11px] text-slate-400">
          © {new Date().getFullYear()} Phan Duy Khang. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
