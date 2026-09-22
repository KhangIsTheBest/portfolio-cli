'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, BookOpen, Calendar, Clock, Sparkles, User } from 'lucide-react';
import { apiService } from '@/services/api';
import { Blog } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { SpotlightCard } from '@/components/SpotlightCard';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { locale, t } = useLanguage();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reading progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

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
      <div className="flex flex-col items-center justify-center min-h-[400px] text-emerald-500 space-y-4 font-mono">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-ping" />
          <div className="w-12 h-12 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        </div>
        <p className="font-mono text-xs tracking-wider animate-pulse font-bold">
          {locale === 'vi' ? 'ĐANG TẢI NỘI DUNG BÀI VIẾT...' : 'LOADING ARTICLE CONTENT...'}
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
          className="flex items-center space-x-2 px-4 py-2 border border-[var(--border-color)] bg-[var(--card-bg)] rounded-xl text-xs text-[var(--text-color)] hover:text-emerald-500 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{locale === 'vi' ? 'Quay lại Blogs' : 'Back to Blogs'}</span>
        </Link>
      </div>
    );
  }

  const wordCount = (blog.content || '').split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <>
      {/* Top Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 origin-left z-50 shadow-glow"
        style={{ scaleX }}
      />

      <div className="max-w-3xl mx-auto space-y-8 my-6 font-mono select-text">
        {/* Breadcrumb Bar */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)]/60 pb-3">
          <Link
            href="/blog"
            className="flex items-center gap-2 px-3 py-1.5 border border-[var(--border-color)] bg-[var(--card-bg)] hover:border-emerald-500/40 rounded-xl text-xs text-[var(--secondary-color)] hover:text-emerald-500 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{locale === 'vi' ? 'Quay lại danh sách' : 'Back to Articles'}</span>
          </Link>
          <span className="text-[10px] text-[var(--secondary-color)] uppercase font-bold tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t('blog.articleViewer')}</span>
          </span>
        </div>

        {/* Article Spotlight Card */}
        <SpotlightCard className="p-6 sm:p-10 space-y-8" spotlightColor="rgba(16, 185, 129, 0.12)">
          {/* Article Header */}
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--text-color)] leading-tight tracking-tight">
              {blog.title}
            </h1>

            {/* Metadata Pills */}
            <div className="flex flex-wrap gap-2.5 font-mono text-[11px] text-[var(--secondary-color)] pt-1">
              <span className="flex items-center gap-1.5 bg-[var(--terminal-header-bg)] px-3 py-1 rounded-lg border border-[var(--border-color)]">
                <User className="w-3.5 h-3.5 text-emerald-500" />
                <span>{blog.createdBy?.fullName || (locale === 'vi' ? 'Tác giả' : 'Author')}</span>
              </span>
              <span className="flex items-center gap-1.5 bg-[var(--terminal-header-bg)] px-3 py-1 rounded-lg border border-[var(--border-color)]">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                <span>{new Date(blog.createdAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}</span>
              </span>
              <span className="flex items-center gap-1.5 bg-[var(--terminal-header-bg)] px-3 py-1 rounded-lg border border-[var(--border-color)]">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                <span>{readTime} {locale === 'vi' ? 'phút đọc' : 'min read'}</span>
              </span>
            </div>
          </div>

          {/* Short description callout */}
          {blog.shortDescription && (
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs text-[var(--text-color)] font-sans italic leading-relaxed">
              &ldquo;{blog.shortDescription}&rdquo;
            </div>
          )}

          {/* Markdown Content */}
          <div className="border-t border-[var(--border-color)]/60 pt-6 text-sm font-sans leading-relaxed text-[var(--secondary-color)] select-text prose dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {blog.content}
            </ReactMarkdown>
          </div>
        </SpotlightCard>
      </div>
    </>
  );
}
