'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Code, ArrowRight, ExternalLink } from 'lucide-react';
import { apiService } from '@/services/api';
import { Project } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

export default function ProjectsPage() {
  const { locale, t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await apiService.getProjects();
        setProjects(data);
      } catch (err) {
        console.error('Failed to load projects stack:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] text-cyan-custom space-y-4">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-custom/20 animate-pulse" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-custom animate-spin" />
        </div>
        <p className="font-mono text-xs tracking-wider animate-pulse">
          {locale === 'vi' ? 'ĐANG ĐỌC HỒ SƠ DỰ ÁN...' : 'QUERYING PROJECT FILES...'}
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-6 my-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Code className="w-5 h-5 text-cyan-custom" />
          <h3 className="text-lg font-bold text-text">{t('projects.title')}</h3>
        </div>
        <span className="text-xs font-mono text-secondary">{t('projects.total')} {projects.length}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group flex flex-col border border-border-custom glass-panel rounded-2xl overflow-hidden hover:border-cyan-custom/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)] transition-all duration-300"
          >
            {/* Thumbnail */}
            <div className="relative h-44 overflow-hidden border-b border-border-custom/50 bg-slate-950">
              <img
                src={project.thumbnailUrl}
                alt={project.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-500"
              />
              {project.featured && (
                <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-md bg-gradient-to-r from-cyan-custom/20 to-purple-custom/20 border border-cyan-custom/40 text-[9px] font-mono text-cyan-custom font-extrabold animate-pulse-slow">
                  {t('projects.featuredLabel')}
                </span>
              )}
            </div>

            {/* Body */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-text group-hover:text-cyan-custom transition duration-200 line-clamp-1">
                  {project.title}
                </h4>
                <p className="text-xs text-secondary font-sans line-clamp-3 leading-relaxed">
                  {project.shortDescription}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {/* Tech stack badges */}
                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 3).map((t) => (
                    <span
                      key={t.id}
                      className="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-950 border border-border-custom text-secondary"
                    >
                      {t.name}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-[9px] text-secondary font-mono self-center">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>

                {/* Card actions */}
                <div className="flex items-center justify-between border-t border-border-custom/50 pt-3">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="flex items-center text-[10px] font-bold text-cyan-custom hover:text-text transition-colors"
                  >
                    <span>{t('projects.detailsBtn')}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                  </Link>
                  
                  <div className="flex space-x-1.5">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded bg-slate-900 border border-slate-700/60 text-secondary hover:text-cyan-custom transition-all"
                        title="Source Code"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded bg-slate-900 border border-slate-700/60 text-secondary hover:text-purple-custom transition-all"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
