'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, Code, Terminal as TermIcon } from 'lucide-react';
import { apiService } from '@/services/api';
import { Technology } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

export default function SkillsPage() {
  const { locale, t } = useLanguage();
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechs = async () => {
      try {
        const data = await apiService.getTechnologies();
        setTechnologies(data);
      } catch (err) {
        console.error('Failed to load technologies stack:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTechs();
  }, []);

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start my-8 animate-fade-in">
      {/* Left Column: Tech Grid */}
      <section className="lg:col-span-2 border border-border-custom glass-panel rounded-3xl p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-border-custom/50 pb-3">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-cyan-custom" />
            <h3 className="text-base font-bold text-text">{t('skills.title')}</h3>
          </div>
          <span className="text-[10px] text-secondary font-mono">DATABASE_FETCH</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {technologies.map((tech) => (
            <div
              key={tech.id}
              className="group flex flex-col items-center justify-center p-4 rounded-2xl border border-border-custom bg-slate-950/20 hover:border-cyan-custom/50 hover:bg-gradient-to-b hover:from-cyan-custom/5 hover:to-transparent transition-all duration-300 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-border-custom flex items-center justify-center text-secondary group-hover:text-cyan-custom group-hover:border-cyan-custom/30 group-hover:shadow-glow transition-all duration-300">
                <Code className="w-5 h-5" />
              </div>
              <span className="text-xs text-text font-semibold mt-3 group-hover:text-cyan-custom transition">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Right Column: System Diagnostics */}
      <section className="lg:col-span-1 border border-border-custom glass-panel rounded-3xl p-6 font-mono text-xs space-y-4">
        <div className="flex items-center space-x-2 text-cyan-custom border-b border-border-custom/50 pb-2">
          <TermIcon className="w-4 h-4" />
          <span className="font-bold">{t('skills.diagTitle')}</span>
        </div>
        <div className="space-y-2.5 text-secondary">
          <div className="flex justify-between border-b border-slate-800/40 pb-1.5">
            <span>{t('skills.diagRest')}</span>
            <span className="text-emerald-500 font-bold">● {t('skills.diagConnected')}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800/40 pb-1.5">
            <span>{t('skills.diagDb')}</span>
            <span className="text-emerald-500 font-bold">{t('skills.databaseVal')}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800/40 pb-1.5">
            <span>{t('skills.diagWeb')}</span>
            <span>{t('skills.webVal')}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800/40 pb-1.5">
            <span>{t('skills.diagProtocol')}</span>
            <span>HTTP/1.1 REST JSON</span>
          </div>
          <div className="flex justify-between">
            <span>{t('skills.diagFallback')}</span>
            <span className="text-purple-custom font-bold">{t('skills.diagFallbackVal')}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
