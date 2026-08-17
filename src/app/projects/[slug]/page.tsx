'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Calendar, Layers, X } from 'lucide-react';
import { apiService, formatImageUrl } from '@/services/api';
import { Project } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop';

export default function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { locale, t } = useLanguage();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveImageUrl(null);
      }
    };
    if (activeImageUrl) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeImageUrl]);

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
      <div className="flex flex-col items-center justify-center min-h-[400px] text-emerald-600 dark:text-emerald-400 font-mono space-y-4">
        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
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
          className="flex items-center space-x-1.5 px-4 py-2 border border-[var(--border-color)] bg-[var(--card-bg)] rounded-xl text-xs text-[var(--text-color)] hover:text-emerald-500 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('projects.backCatalog')}</span>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-6 my-6 font-mono animate-fade-in select-text">
        {/* Header breadcrumb */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <Link
            href="/projects"
            className="flex items-center space-x-1.5 px-3 py-1.5 border border-[var(--border-color)] bg-[var(--card-bg)] hover:border-emerald-500/40 rounded-xl text-xs text-[var(--secondary-color)] hover:text-[var(--text-color)] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('projects.backCatalog')}</span>
          </Link>
          <span className="text-[10px] text-[var(--secondary-color)] font-mono uppercase font-bold tracking-wider flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t('projects.detailTitle')}</span>
          </span>
        </div>

        {/* Main image banner */}
        <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-[var(--border-color)] bg-[var(--terminal-header-bg)] shadow-lg relative">
          <img
            src={formatImageUrl(project.thumbnailUrl)}
            alt={project.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
            }}
          />
          {project.featured && (
            <span className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-extrabold shadow-lg">
              {t('projects.featuredLabel')}
            </span>
          )}
        </div>

        {/* Info card */}
        <div className="border border-[var(--border-color)] bg-[var(--card-bg)] rounded-3xl p-6 space-y-5 shadow-xl transition-colors duration-300">
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-[var(--text-color)] font-sans">{project.title}</h2>
            <div className="flex items-center space-x-4 font-mono text-[10px] text-[var(--secondary-color)]">
              <span className="flex items-center space-x-1 bg-[var(--terminal-header-bg)] px-2.5 py-1 rounded-lg border border-[var(--border-color)]">
                <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{t('projects.dateLabel')} {new Date(project.createdAt).toLocaleDateString()}</span>
              </span>
            </div>
          </div>

          {/* Technologies list */}
          <div className="flex flex-wrap gap-1.5 py-1">
            {project.technologies.map((t) => (
              <span
                key={t.id}
                className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-[var(--terminal-header-bg)] border border-[var(--border-color)] text-[var(--text-color)] font-bold"
              >
                {t.name}
              </span>
            ))}
          </div>

          {/* Content body */}
          <div className="border-t border-[var(--border-color)] pt-5 text-sm font-sans leading-relaxed text-[var(--text-color)] select-text markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {project.content || project.shortDescription}
            </ReactMarkdown>
          </div>

          {/* Illustrative Images Gallery */}
          {project.images && project.images.length > 0 && (
            <div className="border-t border-[var(--border-color)] pt-5 space-y-4">
              <h3 className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {locale === 'vi' ? 'Hình ảnh minh họa' : 'Illustrative Screenshots'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.images.map((img) => {
                  const imgUrl = formatImageUrl(img.imageUrl);
                  return (
                    <div 
                      key={img.id} 
                      className="rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--terminal-header-bg)] relative group cursor-pointer h-48"
                      onClick={() => setActiveImageUrl(imgUrl)}
                    >
                      <img 
                        src={imgUrl} 
                        alt={`Screenshot of ${project.title}`}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[var(--border-color)]">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--terminal-header-bg)] hover:border-emerald-500/40 text-[var(--text-color)] font-bold text-xs transition"
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
                className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{t('projects.demoLabel')}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeImageUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-lightbox-fade"
          onClick={() => setActiveImageUrl(null)}
        >
          <button 
            className="absolute top-5 right-5 z-50 p-2.5 rounded-full border border-white/20 bg-black/60 text-white hover:scale-110 active:scale-95 transition cursor-pointer"
            onClick={() => setActiveImageUrl(null)}
            title={locale === 'vi' ? 'Đóng' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
          
          <div 
            className="relative w-full max-w-[95vw] md:max-w-[92vw] max-h-[92vh] flex items-center justify-center select-none animate-lightbox-zoom"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={formatImageUrl(activeImageUrl)} 
              alt="Screenshot Large Preview" 
              className="w-auto h-auto max-w-full max-h-[92vh] object-contain rounded-xl shadow-2xl border border-white/20"
              onError={(e) => {
                (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
