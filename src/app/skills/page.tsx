'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, Code, Database, Server, Terminal, Cloud, FileCode, Layers, Monitor, Radio } from 'lucide-react';
import { apiService } from '@/services/api';
import { Technology } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

// Preset icon list for mapping database values to Lucide icons
const PRESET_ICONS = [
  { value: 'Java', icon: FileCode },
  { value: 'Spring', icon: Server },
  { value: 'TypeScript', icon: Code },
  { value: 'React', icon: Monitor },
  { value: 'Tailwind', icon: Layers },
  { value: 'PostgreSQL', icon: Database },
  { value: 'Docker', icon: Cloud },
  { value: 'Git', icon: Radio },
  { value: 'API', icon: Terminal },
  { value: 'Code', icon: Code }
];

import { useServerStatus } from '@/context/ServerStatusContext';
import { mockTechnologies } from '@/data/mockData';

export default function SkillsPage() {
  const { locale, t } = useLanguage();
  const { isOnline } = useServerStatus();
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechs = async () => {
      try {
        const data = await apiService.getTechnologies();
        setTechnologies(data);
      } catch (err) {
        console.error('Failed to load technologies stack, falling back to mock technologies:', err);
        setTechnologies(mockTechnologies);
      } finally {
        setLoading(false);
      }
    };
    fetchTechs();
  }, [isOnline]);

  // Map database string to Lucide component
  const getIconComponent = (key: string) => {
    const found = PRESET_ICONS.find(item => item.value === key);
    return found ? found.icon : Code;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] text-cyan-custom space-y-4">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-custom/20 animate-pulse" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-custom animate-spin" />
        </div>
        <p className="font-mono text-xs tracking-wider animate-pulse">
          {locale === 'vi' ? 'ĐANG TÌM KIẾM CƠ SỞ DỮ LIỆU...' : 'QUERYING STACK DB...'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full my-8 animate-fade-in">
      <section className="w-full border border-border-custom glass-panel rounded-3xl p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-border-custom/50 pb-3">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-cyan-custom" />
            <h3 className="text-base font-bold text-text">{t('skills.title')}</h3>
          </div>
          <span className="text-[10px] text-secondary font-mono">DATABASE_FETCH</span>
        </div>

        {technologies.length === 0 ? (
          <div className="p-12 text-center text-secondary text-sm font-mono border border-dashed border-border-custom/50 rounded-2xl">
            {locale === 'vi' ? 'Chưa có kỹ năng nào trong cơ sở dữ liệu.' : 'No skills found in database.'}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {technologies.map((tech) => {
              const Icon = getIconComponent(tech.iconUrl || 'Code');
              return (
                <div
                  key={tech.id}
                  className="group flex flex-col items-center justify-center p-5 rounded-2xl border border-border-custom bg-slate-950/20 hover:border-cyan-custom/50 hover:bg-gradient-to-b hover:from-cyan-custom/5 hover:to-transparent transition-all duration-300 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-border-custom flex items-center justify-center text-secondary group-hover:text-cyan-custom group-hover:border-cyan-custom/30 group-hover:shadow-glow transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-text font-semibold mt-3 group-hover:text-cyan-custom transition text-center font-sans">
                    {tech.name}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
