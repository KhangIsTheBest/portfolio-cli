'use client';

import React from 'react';
import { Terminal, Shield } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const Footer: React.FC = () => {
  const { locale } = useLanguage();

  return (
    <footer className="w-full max-w-7xl mx-auto border-t border-[var(--border-color)] pt-8 pb-12 mt-16 font-mono text-xs text-[var(--secondary-color)] select-text transition-colors duration-300">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left info */}
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" className="w-4 h-4 object-contain" />
          <span className="font-bold text-[var(--text-color)]">Phan Duy Khang</span>
          <span className="opacity-40">•</span>
          <span>Backend & Full-Stack Developer</span>
        </div>

        {/* Middle technical badges */}
        <div className="flex items-center space-x-3 text-[10px]">
          <span className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-md font-bold">
            <Shield className="w-3 h-3" />
            <span>SPRING BOOT + NEXT.JS</span>
          </span>
        </div>

        {/* Right copyright */}
        <div className="text-[11px] text-[var(--secondary-color)]">
          © {new Date().getFullYear()} Phan Duy Khang. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
