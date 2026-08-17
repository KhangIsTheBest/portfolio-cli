'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, Code2, Database, Server, Terminal, Cloud, FileCode, Layers, Monitor, Radio, ShieldCheck, GitBranch } from 'lucide-react';
import { apiService } from '@/services/api';
import { Technology } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useServerStatus } from '@/context/ServerStatusContext';

const PRESET_ICONS = [
  { value: 'Java', icon: FileCode },
  { value: 'Spring', icon: Server },
  { value: 'TypeScript', icon: Code2 },
  { value: 'React', icon: Monitor },
  { value: 'Tailwind', icon: Layers },
  { value: 'PostgreSQL', icon: Database },
  { value: 'Docker', icon: Cloud },
  { value: 'Git', icon: GitBranch },
  { value: 'API', icon: Terminal },
  { value: 'Code', icon: Code2 }
];

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
        console.error('Failed to load technologies:', err);
        setTechnologies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTechs();
  }, [isOnline]);

  const getIconComponent = (key: string) => {
    const found = PRESET_ICONS.find(item => item.value === key);
    return found ? found.icon : Code2;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] text-emerald-600 dark:text-emerald-400 font-mono space-y-4">
        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-xs tracking-wider animate-pulse font-bold">QUERYING STACK MATRIX DATABASE...</p>
      </div>
    );
  }

  return (
    <div className="w-full my-6 font-mono animate-fade-in select-text space-y-8">
      
      {/* Header section */}
      <section className="w-full border border-[var(--border-color)] bg-[var(--card-bg)] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl transition-colors duration-300">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-[var(--text-color)] uppercase tracking-wider">{t('skills.title')}</h3>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded font-bold uppercase tracking-wider">
            DATABASE SYNCHRONIZED
          </span>
        </div>

        {/* System Architecture Domain Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
          
          <div className="p-4 rounded-2xl bg-[var(--terminal-header-bg)] border border-[var(--border-color)] space-y-2">
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
              <Server className="w-4 h-4" />
              <span>{t('skills.backend')}</span>
            </div>
            <p className="text-[var(--secondary-color)] leading-relaxed">
              Xây dựng RESTful API chuẩn REST với Java Spring Boot 3, Spring Security, JWT, Spring Data JPA & PostgreSQL. Tối ưu hóa câu truy vấn SQL và xử lý đa luồng.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--terminal-header-bg)] border border-[var(--border-color)] space-y-2">
            <div className="flex items-center space-x-2 text-sky-600 dark:text-sky-400 font-mono font-bold">
              <Code2 className="w-4 h-4" />
              <span>{t('skills.frontend')}</span>
            </div>
            <p className="text-[var(--secondary-color)] leading-relaxed">
              Thiết kế giao diện phản hồi nhanh, tối ưu render với React 19, Next.js 16 (App Router), TypeScript & Tailwind CSS. Tuân thủ chuẩn A11y & responsive.
            </p>
          </div>

        </div>

        {/* Live Technologies Grid */}
        {technologies.length === 0 ? (
          <div className="p-12 text-center text-[var(--secondary-color)] text-xs font-mono border border-dashed border-[var(--border-color)] rounded-2xl bg-[var(--card-bg)]">
            {locale === 'vi' ? 'Chưa có kỹ năng nào trong cơ sở dữ liệu.' : 'No skills found in database.'}
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-[var(--text-color)] uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>REGISTERED TECH STACK (DATABASE REAL DATA)</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {technologies.map((tech) => {
                const Icon = getIconComponent(tech.iconUrl || 'Code');
                return (
                  <div
                    key={tech.id}
                    className="group flex flex-col items-center justify-center p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--terminal-header-bg)] hover:border-emerald-500/50 transition duration-300 shadow-md"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-color)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-[var(--text-color)] font-bold mt-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition text-center font-mono">
                      {tech.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
