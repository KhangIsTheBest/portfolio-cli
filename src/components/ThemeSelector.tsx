'use client';

import React from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { name: 'cosmic', label: 'Cosmic', color: 'bg-gradient-to-br from-cyan-400 to-purple-500 border-purple-400' },
    { name: 'matrix', label: 'Matrix', color: 'bg-green-500 border-green-600' },
    { name: 'dracula', label: 'Dracula', color: 'bg-[#bd93f9] border-[#ff79c6]' },
    { name: 'cyberpunk', label: 'Cyberpunk', color: 'bg-[#ff007f] border-[#00f0ff]' },
    { name: 'amber', label: 'Amber', color: 'bg-amber-500 border-amber-600' },
    { name: 'snow', label: 'Snow', color: 'bg-slate-300 border-slate-400' },
  ] as const;

  return (
    <div className="flex items-center space-x-2 bg-slate-900/60 border border-border-custom rounded-xl px-3 py-1.5 backdrop-blur-md">
      <Palette className="w-4 h-4 text-primary" />
      <span className="text-[10px] uppercase font-mono font-bold text-secondary mr-1">Theme:</span>
      <div className="flex space-x-1.5">
        {themes.map((t) => (
          <button
            key={t.name}
            onClick={() => setTheme(t.name)}
            title={`Switch to ${t.label} theme`}
            className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${t.color} ${
              theme === t.name
                ? 'scale-125 ring-2 ring-white/30'
                : 'opacity-60 hover:opacity-100 hover:scale-110'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
