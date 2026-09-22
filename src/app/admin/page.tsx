'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FolderGit2, 
  Cpu, 
  BookOpen, 
  Mail, 
  ShieldCheck, 
  ArrowUpRight, 
  FileText, 
  Settings,
  Sparkles
} from 'lucide-react';
import { apiService } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';
import { SpotlightCard } from '@/components/SpotlightCard';

export default function AdminDashboardPage() {
  const { locale } = useLanguage();
  
  const [stats, setStats] = useState({
    projectsCount: 0,
    skillsCount: 0,
    blogsCount: 0,
    contactsCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, techsRes, blogsRes, contactsRes] = await Promise.allSettled([
          apiService.getProjectsAdmin(),
          apiService.getTechnologies(),
          apiService.getBlogsAdmin(),
          apiService.getContactsAdmin()
        ]);

        setStats({
          projectsCount: projectsRes.status === 'fulfilled' ? projectsRes.value.length : 0,
          skillsCount: techsRes.status === 'fulfilled' ? techsRes.value.length : 0,
          blogsCount: blogsRes.status === 'fulfilled' ? blogsRes.value.length : 0,
          contactsCount: contactsRes.status === 'fulfilled' ? contactsRes.value.length : 0
        });

        if (projectsRes.status === 'rejected') console.error('Failed to load projects count:', projectsRes.reason);
        if (techsRes.status === 'rejected') console.error('Failed to load technologies count:', techsRes.reason);
        if (blogsRes.status === 'rejected') console.error('Failed to load blogs count:', blogsRes.reason);
        if (contactsRes.status === 'rejected') console.error('Failed to load contacts count:', contactsRes.reason);
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] text-[var(--primary-color)] space-y-4 font-mono">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-[var(--primary-border)] animate-ping" />
          <div className="w-10 h-10 border-2 border-[var(--primary-border)] border-t-emerald-500 rounded-full animate-spin" />
        </div>
        <p className="font-mono text-xs tracking-wider animate-pulse font-semibold">
          {locale === 'vi' ? 'ĐANG ĐỌC SỐ LIỆU THỐNG KÊ...' : 'COLLECTING SUMMARY STATS...'}
        </p>
      </div>
    );
  }

  const statCards = [
    { 
      label: locale === 'vi' ? 'Dự án' : 'Projects', 
      value: stats.projectsCount, 
      icon: FolderGit2, 
      href: '/admin/projects',
      color: 'text-[var(--primary-color)]'
    },
    { 
      label: locale === 'vi' ? 'Kỹ năng & Công nghệ' : 'Skills & Techs', 
      value: stats.skillsCount, 
      icon: Cpu, 
      href: '/admin/skills',
      color: 'text-sky-500'
    },
    { 
      label: locale === 'vi' ? 'Bài viết Blog' : 'Blog Articles', 
      value: stats.blogsCount, 
      icon: BookOpen, 
      href: '/admin/blog',
      color: 'text-purple-500'
    },
    { 
      label: locale === 'vi' ? 'Hộp thư' : 'Inbox Inquiries', 
      value: stats.contactsCount, 
      icon: Mail, 
      href: '/admin/contacts',
      color: 'text-amber-500'
    }
  ];

  const quickActions = [
    {
      title: locale === 'vi' ? 'Quản lý CV (VI & EN)' : 'Manage CVs (VI & EN)',
      desc: locale === 'vi' ? 'Cập nhật và xem trước 2 phiên bản CV' : 'Upload and preview bilingual CV documents',
      href: '/admin/profile',
      icon: FileText
    },
    {
      title: locale === 'vi' ? 'Thêm Dự Án Mới' : 'Add New Project',
      desc: locale === 'vi' ? 'Đăng sản phẩm với hình ảnh, tags và video' : 'Publish projects with rich media & architecture links',
      href: '/admin/projects',
      icon: FolderGit2
    },
    {
      title: locale === 'vi' ? 'Soạn Bài Viết' : 'Publish Blog Post',
      desc: locale === 'vi' ? 'Viết bài Markdown với code highlighting' : 'Draft technical markdown articles',
      href: '/admin/blog',
      icon: BookOpen
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in font-mono select-text">
      {/* Header title */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)]/60 pb-3">
        <div className="flex items-center space-x-2">
          <LayoutDashboard className="w-5 h-5 text-[var(--primary-color)]" />
          <h2 className="text-base font-bold text-[var(--text-color)]">
            {locale === 'vi' ? 'Tổng quan hệ thống' : 'Dashboard Overview'}
          </h2>
        </div>
        <span className="text-[10px] text-[var(--primary-color)] bg-[var(--primary-bg)] border border-[var(--primary-border)] px-2.5 py-0.5 rounded-full font-bold">
          LIVE CMS
        </span>
      </div>

      {/* Welcome Hero Spotlight Card */}
      <SpotlightCard className="p-6 sm:p-8" spotlightColor="rgba(99, 102, 241, 0.12)">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--primary-bg)] border border-[var(--primary-border)] flex items-center justify-center text-[var(--primary-color)] shrink-0 shadow-glow">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 flex-1">
            <h3 className="text-base font-bold text-[var(--text-color)] flex items-center gap-2">
              <span>{locale === 'vi' ? 'Xin chào, Quản trị viên!' : 'Welcome back, Administrator!'}</span>
              <Sparkles className="w-4 h-4 text-[var(--primary-color)]" />
            </h3>
            <p className="text-xs text-[var(--secondary-color)] font-sans leading-relaxed">
              {locale === 'vi' 
                ? 'Tất cả các dịch vụ backend Spring Boot và cơ sở dữ liệu PostgreSQL đang hoạt động ổn định. Bạn có thể sử dụng các liên kết nhanh bên dưới để quản trị dữ liệu.' 
                : 'All backend microservices and PostgreSQL database connections are verified healthy. Use the control cards below to manage your engineering portfolio.'}
            </p>
          </div>
        </div>
      </SpotlightCard>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Link href={card.href} className="block group">
                <SpotlightCard
                  className="p-5 h-full flex flex-col justify-between space-y-3 group-hover:border-[var(--primary-border)] transition-colors"
                  spotlightColor="rgba(99, 102, 241, 0.12)"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-[var(--secondary-color)]">
                      {card.label}
                    </span>
                    <Icon className={`w-4 h-4 ${card.color}`} />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black text-[var(--text-color)]">{card.value}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[var(--secondary-color)] group-hover:text-[var(--primary-color)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </SpotlightCard>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Action Hub */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--secondary-color)]">
          {locale === 'vi' ? 'Thao tác nhanh' : 'Quick Actions'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link key={idx} href={action.href} className="block group">
                <SpotlightCard 
                  className="p-5 h-full space-y-2 group-hover:border-[var(--primary-border)] transition-colors"
                  spotlightColor="rgba(99, 102, 241, 0.12)"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-[var(--primary-bg)] text-[var(--primary-color)] border border-[var(--primary-border)]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-[var(--text-color)] group-hover:text-[var(--primary-color)] transition-colors">
                      {action.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-[var(--secondary-color)] font-sans leading-relaxed">
                    {action.desc}
                  </p>
                </SpotlightCard>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
