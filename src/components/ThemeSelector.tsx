'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const ThemeSelector: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="relative flex items-center justify-between w-14 h-8 p-1 rounded-full border border-white/[0.12] dark:border-white/[0.12] light:border-slate-300 bg-white/[0.04] dark:bg-[#141722] light:bg-slate-200 cursor-pointer shadow-inner transition-colors duration-300 select-none group"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
    >
      {/* Icon indicators */}
      <Sun className={`w-3.5 h-3.5 text-amber-500 z-10 ml-0.5 transition-opacity duration-300 ${isDark ? 'opacity-40' : 'opacity-100 font-bold'}`} />
      <Moon className={`w-3.5 h-3.5 text-emerald-400 z-10 mr-0.5 transition-opacity duration-300 ${isDark ? 'opacity-100 font-bold' : 'opacity-40'}`} />

      {/* Sliding thumb pill */}
      <span
        className={`absolute top-1 left-1 w-6 h-6 rounded-full shadow-md transition-transform duration-300 ease-out transform ${
          isDark 
            ? 'translate-x-6 bg-emerald-500/20 border border-emerald-400/40 text-emerald-400' 
            : 'translate-x-0 bg-white border border-slate-300 text-amber-500'
        }`}
      />
    </button>
  );
};
