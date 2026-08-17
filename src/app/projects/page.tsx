'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Code2, ArrowRight, ExternalLink, GitBranch, Cpu, ShieldCheck, Filter } from 'lucide-react';
import { apiService } from '@/services/api';
import { Project } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useServerStatus } from '@/context/ServerStatusContext';

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
      <div className="flex flex-col items-center justify-center min-h-[400px] text-emerald-400 font-mono space-y-4">
        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
        <p className="text-xs tracking-wider animate-pulse">RETRIEVING PROJECT ARCHITECTURES...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 my-6 font-mono animate-fade-in select-text">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div className="flex items-center space-x-2">
          <Code2 className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider">{t('projects.title')}</h3>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-white/[0.03] border border-white/[0.08] px-3 py-1 rounded-full">
          {t('projects.total')} {filteredProjects.length} / {projects.length}
        </span>
      </div>

      {/* Filter Bar */}
      {availableTechs.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-[11px]">
          <div className="flex items-center space-x-1.5 text-slate-400 pr-2 border-r border-white/[0.08]">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span className="uppercase text-[10px] tracking-wider font-bold">Filter:</span>
          </div>

          <button
            onClick={() => setSelectedTech('ALL')}
            className={`px-3 py-1.5 rounded-xl border transition shrink-0 cursor-pointer ${
              selectedTech === 'ALL'
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 font-bold'
                : 'border-white/[0.08] bg-[#0d0f17] text-slate-400 hover:text-slate-200'
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
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 font-bold'
                    : 'border-white/[0.08] bg-[#0d0f17] text-slate-400 hover:text-slate-200'
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
        <div className="p-12 text-center text-slate-400 text-xs font-mono border border-dashed border-white/[0.08] rounded-2xl bg-[#0d0f17]">
          {locale === 'vi' ? 'Không tìm thấy dự án phù hợp.' : 'No engineering projects match the selected technology filter.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {filteredProjects.map((project, idx) => {
            // Asymmetrical grid spans (7-5-12 rhythm)
            const spanPattern = idx % 3 === 0 ? 'md:col-span-7' : idx % 3 === 1 ? 'md:col-span-5' : 'md:col-span-12';
            
            return (
              <div
                key={project.id}
                className={`${spanPattern} border border-white/[0.08] bg-[#0d0f17] rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition duration-300 shadow-xl group`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          PROJ-{project.id}
                        </span>
                        {project.featured && (
                          <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {t('projects.featuredLabel')}
                          </span>
                        )}
                      </div>
                      <Link href={`/projects/${project.slug}`} className="block">
                        <h4 className="text-base font-bold text-slate-100 font-sans group-hover:text-emerald-400 transition cursor-pointer">
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
                          className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-emerald-400 transition"
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
                          className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-emerald-400 transition"
                          title="Live Demo"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail */}
                  <Link href={`/projects/${project.slug}`} className="block rounded-xl overflow-hidden border border-white/[0.06] bg-[#141722] h-48 sm:h-52 relative cursor-pointer">
                    <img
                      src={project.thumbnailUrl}
                      alt={project.title}
                      className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-102 transition duration-500"
                    />
                  </Link>

                  {/* Problem & Solution Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                      <div className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                        <Cpu className="w-3 h-3" />
                        <span>{t('projects.problemTitle')}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] line-clamp-2 leading-relaxed">
                        {project.shortDescription}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                      <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{t('projects.solutionTitle')}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] line-clamp-2 leading-relaxed">
                        Full-stack REST architecture built with Java Spring Boot, JPA persistence, PostgreSQL & Next.js.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/[0.06]">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((t) => (
                      <span
                        key={t.id}
                        className="px-2 py-0.5 rounded text-[10px] bg-white/[0.03] border border-white/[0.08] text-slate-300"
                      >
                        {t.name}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-xs font-bold text-emerald-400 hover:text-white flex items-center gap-1 cursor-pointer"
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
