'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, ChevronRight, Clock, Sparkles } from 'lucide-react';
import { apiService } from '@/services/api';
import { Blog } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useServerStatus } from '@/context/ServerStatusContext';
import { SpotlightCard } from '@/components/SpotlightCard';

export default function BlogPage() {
  const { locale, t } = useLanguage();
  const { isOnline } = useServerStatus();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await apiService.getBlogs();
        setBlogs(data);
      } catch (err) {
        console.error('Failed to load blog posts:', err);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [isOnline]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-[var(--primary-color)] font-mono space-y-4">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-[var(--primary-border)] animate-ping" />
          <div className="w-10 h-10 border-2 border-[var(--primary-border)] border-t-[var(--primary-color)] rounded-full animate-spin" />
        </div>
        <p className="font-mono text-xs tracking-wider animate-pulse font-semibold">
          {locale === 'vi' ? 'ĐANG TẢI DANH SÁCH BÀI VIẾT...' : 'SYNCHRONIZING ARTICLES...'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 my-6 font-mono select-text">
      {/* Header section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--primary-border)] bg-[var(--primary-bg)] text-[var(--primary-color)] text-xs font-mono">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{locale === 'vi' ? 'KHO TRI THỨC KỸ THUẬT' : 'ENGINEERING LOGS'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--text-color)]">
          {t('blog.title')}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--secondary-color)] max-w-2xl font-sans leading-relaxed">
          {locale === 'vi'
            ? 'Chia sẻ kiến thức về kiến trúc phân tán, tối ưu hóa hệ thống Spring Boot, thiết kế database và kinh nghiệm thực chiến trong phát triển phần mềm.'
            : 'Insights on distributed systems, Spring Boot microservices performance, database indexing, and real-world software engineering notes.'}
        </p>
      </motion.div>

      {/* Blog Cards Grid */}
      {blogs.length === 0 ? (
        <SpotlightCard className="p-12 text-center space-y-4" spotlightColor="rgba(99, 102, 241, 0.12)">
          <div className="w-12 h-12 rounded-2xl bg-[var(--primary-bg)] border border-[var(--primary-border)] flex items-center justify-center mx-auto text-[var(--primary-color)]">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[var(--text-color)]">{t('blog.noArticles')}</h3>
            <p className="text-xs text-[var(--secondary-color)] font-sans max-w-md mx-auto">
              {locale === 'vi'
                ? 'Các bài viết kỹ thuật chuyên sâu đang được chuẩn bị và sẽ sớm được xuất bản.'
                : 'In-depth engineering notes are currently being drafted and will appear here soon.'}
            </p>
          </div>
        </SpotlightCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {blogs.map((blog, idx) => {
            const dateStr = new Date(blog.createdAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });
            // Estimate reading time (~200 words/min)
            const wordCount = (blog.content || '').split(/\s+/).length;
            const readTime = Math.max(1, Math.ceil(wordCount / 200));

            return (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <Link href={`/blog/${blog.slug}`} className="block h-full group">
                  <SpotlightCard
                    className="p-6 h-full flex flex-col justify-between space-y-5 transition-all duration-300 group-hover:border-[var(--primary-border)]"
                    spotlightColor="rgba(99, 102, 241, 0.14)"
                  >
                    <div className="space-y-3">
                      {/* Meta top bar */}
                      <div className="flex items-center justify-between text-[11px] text-[var(--secondary-color)]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[var(--primary-color)]" />
                          <span>{dateStr}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[var(--primary-color)]" />
                          <span>{readTime} {locale === 'vi' ? 'phút đọc' : 'min read'}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-bold text-[var(--text-color)] group-hover:text-[var(--primary-color)] transition-colors duration-200 line-clamp-2">
                        {blog.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-[var(--secondary-color)] font-sans line-clamp-3 leading-relaxed">
                        {blog.shortDescription}
                      </p>
                    </div>

                    {/* Footer bar */}
                    <div className="pt-4 border-t border-[var(--border-color)]/60 flex items-center justify-between text-xs font-bold text-[var(--primary-color)]">
                      <span className="flex items-center gap-1 group-hover:underline">
                        {locale === 'vi' ? 'Đọc bài viết' : 'Read Article'}
                      </span>
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </SpotlightCard>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
