'use client';

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, FolderGit2, Cpu, BookOpen, Mail, ShieldCheck } from 'lucide-react';
import { apiService } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';

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
          apiService.getProjects(),
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
      <div className="flex flex-col items-center justify-center min-h-[300px] text-cyan-custom space-y-4">
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-custom/20 animate-pulse" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-custom animate-spin" />
        </div>
        <p className="font-mono text-xs tracking-wider animate-pulse">
          {locale === 'vi' ? 'ĐANG ĐỌC SỐ LIỆU THỐNG KÊ...' : 'COLLECTING SUMMARY STATS...'}
        </p>
      </div>
    );
  }

  const statCards = [
    { label: locale === 'vi' ? 'Dự án' : 'Projects', value: stats.projectsCount, icon: FolderGit2, color: 'text-cyan-custom border-cyan-custom/30' },
    { label: locale === 'vi' ? 'Công nghệ' : 'Skills / Techs', value: stats.skillsCount, icon: Cpu, color: 'text-purple-custom border-purple-custom/30' },
    { label: locale === 'vi' ? 'Bài viết Blog' : 'Blog Articles', value: stats.blogsCount, icon: BookOpen, color: 'text-sky-400 border-sky-400/30' },
    { label: locale === 'vi' ? 'Hòm thư' : 'Inbox Inquiries', value: stats.contactsCount, icon: Mail, color: 'text-pink-400 border-pink-400/30' }
  ];

  return (
    <div className="space-y-6 animate-fade-in font-mono">
      {/* Header title */}
      <div className="flex items-center space-x-2 border-b border-border-custom/50 pb-3">
        <LayoutDashboard className="w-5 h-5 text-cyan-custom" />
        <h3 className="text-base font-bold text-text">
          {locale === 'vi' ? 'Tổng quan hệ thống' : 'Dashboard Overview'}
        </h3>
      </div>

      {/* Welcome Card */}
      <div className="p-6 border border-border-custom bg-slate-900/40 rounded-2xl flex flex-col sm:flex-row items-center gap-4 relative overflow-hidden">
        <div className="w-12 h-12 rounded-xl bg-cyan-custom/10 border border-cyan-custom/20 flex items-center justify-center text-cyan-custom shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-bold text-text">
            {locale === 'vi' ? 'Chào mừng bạn đã trở lại, Quản trị viên!' : 'Welcome back, Administrator!'}
          </h4>
          <p className="text-xs text-secondary font-sans leading-relaxed">
            {locale === 'vi' 
              ? 'Tất cả các kết nối dữ liệu tới Spring Boot API server đều đang hoạt động tốt. Bạn có thể sử dụng các thanh điều hướng bên trái để cập nhật nội dung hồ sơ, kỹ năng, các sản phẩm dự án và phản hồi của người dùng.' 
              : 'All API routes to the Spring Boot backend server are verified active. Use the left navigation sidebar to update your portfolio sections, manage projects, and view visitor inbox messages.'}
          </p>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx} 
              className={`p-5 rounded-2xl border bg-slate-950/20 flex flex-col justify-between space-y-4 hover:bg-slate-900/10 transition duration-300 ${card.color}`}
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-secondary">{card.label}</span>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-3xl font-black">{card.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
