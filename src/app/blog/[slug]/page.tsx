'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Calendar, User } from 'lucide-react';
import { apiService } from '@/services/api';
import { Blog } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { locale, t } = useLanguage();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const data = await apiService.getBlogBySlug(slug);
        setBlog(data);
      } catch (err: any) {
        console.error('Failed to load blog details:', err);
        setError(err.message || (locale === 'vi' ? 'Không tìm thấy bài viết' : 'Article not found'));
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug, locale]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-cyan-custom space-y-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-custom/20 animate-pulse" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-custom animate-spin" />
        </div>
        <p className="font-mono text-xs tracking-wider animate-pulse font-bold">
          {locale === 'vi' ? 'ĐANG TẢI NỘI DUNG BÀI VIẾT...' : 'LOADING ARTICLE FROM DATABASE...'}
        </p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-rose-500 space-y-4 font-mono">
        <p className="text-sm font-bold">❌ {error || (locale === 'vi' ? 'Không tìm thấy bài viết' : 'Article not found')}</p>
        <Link
          href="/blog"
          className="flex items-center space-x-1.5 px-4 py-2 border border-border-custom bg-slate-900 rounded-xl text-xs text-text hover:text-cyan-custom transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{locale === 'vi' ? 'Quay lại Blogs' : 'Back to Blogs'}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 my-8 animate-fade-in">
      {/* Header breadcrumb */}
      <div className="flex items-center justify-between border-b border-border-custom/50 pb-3">
        <Link
          href="/blog"
          className="flex items-center space-x-1.5 px-3 py-1.5 border border-border-custom/80 bg-slate-950/20 hover:bg-slate-800/40 rounded-xl text-xs text-secondary hover:text-cyan-custom transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{locale === 'vi' ? 'Quay lại danh sách' : 'Back to Articles'}</span>
        </Link>
        <span className="text-[10px] text-secondary font-mono uppercase font-bold tracking-wider flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-cyan-custom" />
          <span>{t('blog.articleViewer')}</span>
        </span>
      </div>

      {/* Main card panel */}
      <div className="border border-border-custom glass-panel rounded-3xl p-8 space-y-6 relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-purple-custom/10 blur-2xl -z-10 pointer-events-none" />

        <div className="space-y-3">
          <h2 className="text-2xl font-extrabold text-text leading-tight">{blog.title}</h2>
          
          <div className="flex flex-wrap gap-4 font-mono text-[10px] text-secondary">
            <span className="flex items-center space-x-1 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-border-custom/50">
              <User className="w-3.5 h-3.5 text-cyan-custom" />
              <span>{t('blog.authorLabel')} {blog.createdBy?.fullName || 'Đào Thế Khang'}</span>
            </span>
            <span className="flex items-center space-x-1 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-border-custom/50">
              <Calendar className="w-3.5 h-3.5 text-purple-custom" />
              <span>{t('blog.dateLabel')} {new Date(blog.createdAt).toLocaleDateString()}</span>
            </span>
          </div>
        </div>

        {/* Content body */}
        <div className="border-t border-border-custom/50 pt-6 text-sm font-sans leading-relaxed text-secondary space-y-4 whitespace-pre-wrap select-text">
          {blog.content}
        </div>
      </div>
    </div>
  );
}
