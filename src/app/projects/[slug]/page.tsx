'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Calendar, Layers } from 'lucide-react';
import { apiService } from '@/services/api';
import { Project } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

export default function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { locale, t } = useLanguage();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const data = await apiService.getProjectBySlug(slug);
        setProject(data);
      } catch (err: any) {
        console.error('Failed to load project details:', err);
        setError(err.message || (locale === 'vi' ? 'Không tìm thấy dự án' : 'Project not found'));
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug, locale]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-cyan-custom space-y-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-custom/20 animate-pulse" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-custom animate-spin" />
        </div>
        <p className="font-mono text-xs tracking-wider animate-pulse font-bold">
          {locale === 'vi' ? 'ĐANG TÌM KIẾM CHI TIẾT DỰ ÁN...' : 'RETRIEVING FILES FROM ARCHIVE...'}
        </p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-rose-500 space-y-4 font-mono">
        <p className="text-sm font-bold">❌ {error || (locale === 'vi' ? 'Không tìm thấy dự án' : 'Project not found')}</p>
        <Link
          href="/projects"
          className="flex items-center space-x-1.5 px-4 py-2 border border-border-custom bg-slate-900 rounded-xl text-xs text-text hover:text-cyan-custom transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('projects.backCatalog')}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 my-8 animate-fade-in">
      {/* Header breadcrumb */}
      <div className="flex items-center justify-between border-b border-border-custom/50 pb-3">
        <Link
          href="/projects"
          className="flex items-center space-x-1.5 px-3 py-1.5 border border-border-custom/80 bg-slate-950/20 hover:bg-slate-800/40 rounded-xl text-xs text-secondary hover:text-cyan-custom transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('projects.backCatalog')}</span>
        </Link>
        <span className="text-[10px] text-secondary font-mono uppercase font-bold tracking-wider flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-cyan-custom" />
          <span>{t('projects.detailTitle')}</span>
        </span>
      </div>

      {/* Main image banner */}
      <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-border-custom/40 bg-slate-950 shadow-lg relative">
        <img
          src={project.thumbnailUrl}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        {project.featured && (
          <span className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-custom/20 to-purple-custom/20 border border-cyan-custom/40 text-[9px] font-mono text-cyan-custom font-extrabold shadow-lg">
            {t('projects.featuredLabel')}
          </span>
        )}
      </div>

      {/* Info card */}
      <div className="border border-border-custom glass-panel rounded-3xl p-6 space-y-5">
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-text">{project.title}</h2>
          <div className="flex items-center space-x-4 font-mono text-[10px] text-secondary">
            <span className="flex items-center space-x-1 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-border-custom/50">
              <Calendar className="w-3.5 h-3.5 text-purple-custom" />
              <span>{t('projects.dateLabel')} {new Date(project.createdAt).toLocaleDateString()}</span>
            </span>
          </div>
        </div>

        {/* Technologies list */}
        <div className="flex flex-wrap gap-1.5 py-1">
          {project.technologies.map((t) => (
            <span
              key={t.id}
              className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-slate-950 border border-border-custom text-text"
            >
              {t.name}
            </span>
          ))}
        </div>

        {/* Content body */}
        <div className="border-t border-border-custom/50 pt-5 text-sm font-sans leading-relaxed text-secondary space-y-4 whitespace-pre-wrap select-text">
          {project.content || project.shortDescription}
        </div>

        {/* Action Links */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border-custom/50">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl border border-border-custom bg-slate-950 hover:bg-slate-800 text-text font-bold text-xs transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
              <span>{t('projects.repoLabel')}</span>
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-custom to-purple-custom hover:brightness-110 text-bg font-bold text-xs transition-all shadow-glow"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{t('projects.demoLabel')}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
