'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, ChevronRight } from 'lucide-react';
import { apiService } from '@/services/api';
import { Blog } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useServerStatus } from '@/context/ServerStatusContext';

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
      <div className="flex flex-col items-center justify-center min-h-[300px] text-emerald-600 dark:text-emerald-400 font-mono space-y-4">
        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <p className="font-mono text-xs tracking-wider animate-pulse font-bold">
          {locale === 'vi' ? 'ĐANG TẢI DANH SÁCH BÀI VIẾT...' : 'SYNCHRONIZING ARTICLES...'}
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-6 my-6 font-mono animate-fade-in select-text">
      <div className="flex items-center space-x-2 border-b border-[var(--border-color)] pb-3">
        <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        <h3 className="text-lg font-bold text-[var(--text-color)]">{t('blog.title')}</h3>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-12 border border-[var(--border-color)] bg-[var(--card-bg)] rounded-2xl font-mono text-xs text-[var(--secondary-color)]">
          {t('blog.noArticles')}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {blogs.map((blog) => {
            const dateStr = new Date(blog.createdAt).toLocaleDateString();
            return (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="group flex items-center justify-between p-4 border border-[var(--border-color)] bg-[var(--card-bg)] rounded-2xl cursor-pointer hover:border-emerald-500/50 transition duration-300 shadow-md"
              >
                <div className="space-y-1 pr-4">
                  <h4 className="text-xs font-bold text-[var(--text-color)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {blog.title}
                  </h4>
                  <p className="text-[11px] text-[var(--secondary-color)] font-sans line-clamp-1">
                    {blog.shortDescription}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0 font-mono text-[9px] text-[var(--secondary-color)] font-bold">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{dateStr}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
