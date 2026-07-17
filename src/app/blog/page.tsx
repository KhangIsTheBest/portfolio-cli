'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, ChevronRight } from 'lucide-react';
import { apiService } from '@/services/api';
import { Blog } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useServerStatus } from '@/context/ServerStatusContext';
import { mockBlogs } from '@/data/mockData';

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
        console.error('Failed to load blog posts, falling back to mock blogs:', err);
        setBlogs(mockBlogs);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [isOnline]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-cyan-custom space-y-4">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-custom/20 animate-pulse" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-custom animate-spin" />
        </div>
        <p className="font-mono text-xs tracking-wider animate-pulse">
          {locale === 'vi' ? 'ĐANG TẢI DANH SÁCH BÀI VIẾT...' : 'SYNCHRONIZING ARTICLES...'}
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-6 my-8 animate-fade-in">
      <div className="flex items-center space-x-2 border-b border-border-custom/50 pb-3">
        <BookOpen className="w-5 h-5 text-cyan-custom" />
        <h3 className="text-lg font-bold text-text">{t('blog.title')}</h3>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-12 border border-border-custom bg-slate-950/20 rounded-2xl font-mono text-xs text-secondary">
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
                className="group flex items-center justify-between p-4 border border-border-custom glass-panel rounded-2xl cursor-pointer hover:border-cyan-custom/50 hover:bg-slate-900/10 transition-all duration-300"
              >
                <div className="space-y-1 pr-4">
                  <h4 className="text-xs font-bold text-text group-hover:text-cyan-custom transition-colors line-clamp-1">
                    {blog.title}
                  </h4>
                  <p className="text-[11px] text-secondary font-sans line-clamp-1">
                    {blog.shortDescription}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0 font-mono text-[9px] text-secondary">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-custom" />
                    <span>{dateStr}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-cyan-custom opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
