'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Code2, ArrowRight, ExternalLink, GitBranch, Cpu, ShieldCheck, Filter } from 'lucide-react';
import { apiService, formatImageUrl } from '@/services/api';
import { Project } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useServerStatus } from '@/context/ServerStatusContext';

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop';

export default function ProjectsPage() {
  const { locale, t } = useLanguage();
  const { isOnline } = useServerStatus();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTech, setSelectedTech] = useState<string>('ALL');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await apiService.getProjects();
        setProjects(data);
      } catch (err) {
        console.error('Failed to load projects catalog:', err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [isOnline]);

  const availableTechs = Array.from(
    new Set(projects.flatMap((p) => p.technologies.map((t) => t.name)))
  ).sort();

  const filteredProjects = selectedTech === 'ALL'
    ? projects
    : projects.filter((p) => p.technologies.some((t) => t.name === selectedTech));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-emerald-600 dark:text-emerald-400 font-mono space-y-4">
        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-xs tracking-wider animate-pulse font-bold">RETRIEVING PROJECT ARCHITECTURES...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 my-6 font-mono animate-fade-in select-text">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div className="flex items-center space-x-2">
          <Code2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-base font-bold text-[var(--text-color)] uppercase tracking-wider">{t('projects.title')}</h3>
        </div>
        <span className="text-xs font-mono text-[var(--secondary-color)] bg-[var(--card-bg)] border border-[var(--border-color)] px-3 py-1 rounded-full font-bold">
          {t('projects.total')} {filteredProjects.length} / {projects.length}
        </span>
      </div>

      {/* Filter Bar */}
      {availableTechs.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-[11px]">
          <div className="flex items-center space-x-1.5 text-[var(--secondary-color)] pr-2 border-r border-[var(--border-color)]">
            <Filter className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="uppercase text-[10px] tracking-wider font-bold">Filter:</span>
          </div>

          <button
            onClick={() => setSelectedTech('ALL')}
            className={`px-3 py-1.5 rounded-xl border transition shrink-0 cursor-pointer ${
              selectedTech === 'ALL'
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--secondary-color)] hover:text-[var(--text-color)]'
            }`}
          >
            {locale === 'vi' ? 'TẤT CẢ' : 'ALL'} ({projects.length})
          </button>
          {availableTechs.map((tech) => {
            const count = projects.filter((p) => p.technologies.some((t) => t.name === tech)).length;
            return (
              <button
                key={tech}
                onClick={() => setSelectedTech(tech)}
                className={`px-3 py-1.5 rounded-xl border transition shrink-0 cursor-pointer ${
                  selectedTech === tech
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--secondary-color)] hover:text-[var(--text-color)]'
                }`}
              >
                {tech} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Projects Bento Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center text-[var(--secondary-color)] text-xs font-mono border border-dashed border-[var(--border-color)] rounded-2xl bg-[var(--card-bg)]">
          {locale === 'vi' ? 'Không tìm thấy dự án phù hợp.' : 'No engineering projects match the selected technology filter.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {filteredProjects.map((project, idx) => {
            const spanPattern = idx % 3 === 0 ? 'md:col-span-7' : idx % 3 === 1 ? 'md:col-span-5' : 'md:col-span-12';
            
            return (
              <div
                key={project.id}
                className={`${spanPattern} border border-[var(--border-color)] bg-[var(--card-bg)] rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition duration-300 shadow-xl group`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          PROJ-{project.id}
                        </span>
                        {project.featured && (
                          <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {t('projects.featuredLabel')}
                          </span>
                        )}
                      </div>
                      <Link href={`/projects/${project.slug}`} className="block">
                        <h4 className="text-base font-bold text-[var(--text-color)] font-sans group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition cursor-pointer">
                          {project.title}
                        </h4>
                      </Link>
                    </div>

                    <div className="flex space-x-1.5 shrink-0">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-[var(--terminal-header-bg)] border border-[var(--border-color)] text-[var(--text-color)] hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                          title="Source Code"
                        >
                          <GitBranch className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-[var(--terminal-header-bg)] border border-[var(--border-color)] text-[var(--text-color)] hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                          title="Live Demo"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail */}
                  <Link href={`/projects/${project.slug}`} className="block rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--terminal-header-bg)] h-48 sm:h-52 relative cursor-pointer">
                    <img
                      src={formatImageUrl(project.thumbnailUrl)}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                      }}
                    />
                  </Link>

                  {/* Problem & Solution Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                    <div className="p-3 rounded-xl bg-[var(--terminal-header-bg)] border border-[var(--border-color)] space-y-1">
                      <div className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                        <Cpu className="w-3 h-3" />
                        <span>{t('projects.problemTitle')}</span>
                      </div>
                      <p className="text-[var(--secondary-color)] text-[11px] line-clamp-2 leading-relaxed">
                        {project.shortDescription}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--terminal-header-bg)] border border-[var(--border-color)] space-y-1">
                      <div className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{t('projects.solutionTitle')}</span>
                      </div>
                      <p className="text-[var(--secondary-color)] text-[11px] line-clamp-2 leading-relaxed">
                        {project.technologies && project.technologies.length > 0
                          ? (locale === 'vi'
                              ? `Hệ thống thiết kế theo kiến trúc chuẩn RESTful API dựa trên nền tảng ${project.technologies.map(t => t.name).join(', ')}, đảm bảo tính linh hoạt và mở rộng.`
                              : `Full-stack modular architecture powered by ${project.technologies.map(t => t.name).join(', ')} with high-performance RESTful APIs.`)
                          : project.shortDescription}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[var(--border-color)]">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((t) => (
                      <span
                        key={t.id}
                        className="px-2 py-0.5 rounded text-[10px] bg-[var(--terminal-header-bg)] border border-[var(--border-color)] text-[var(--text-color)] font-semibold"
                      >
                        {t.name}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t('projects.detailsBtn')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
