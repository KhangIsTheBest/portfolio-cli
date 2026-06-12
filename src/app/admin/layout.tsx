'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Layers, 
  LayoutDashboard, 
  User, 
  Cpu, 
  FolderGit2, 
  BookOpen, 
  Mail, 
  LogOut, 
  Globe, 
  Menu, 
  X 
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useLanguage();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Authentication session guard check
  useEffect(() => {
    const token = localStorage.getItem('admin-token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    router.push('/');
  };

  const navItems = [
    { href: '/admin', label: locale === 'vi' ? 'Thống kê' : 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/profile', label: locale === 'vi' ? 'Hồ sơ' : 'Profile', icon: User },
    { href: '/admin/skills', label: locale === 'vi' ? 'Kỹ năng' : 'Skills Stack', icon: Cpu },
    { href: '/admin/projects', label: locale === 'vi' ? 'Dự án' : 'Projects', icon: FolderGit2 },
    { href: '/admin/blog', label: locale === 'vi' ? 'Bài viết Blog' : 'Blog Posts', icon: BookOpen },
    { href: '/admin/contacts', label: locale === 'vi' ? 'Hộp thư khách' : 'Visitor Inbox', icon: Mail }
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-cyan-custom space-y-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-custom/20 animate-pulse" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-custom animate-spin" />
        </div>
        <p className="font-mono text-xs tracking-wider animate-pulse font-bold">
          {locale === 'vi' ? 'ĐANG KIỂM TRA PHIÊN LÀM VIỆC...' : 'VERIFYING SECURITY TOKENS...'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col md:flex-row gap-6 my-4 select-text">
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 border border-border-custom bg-card-custom rounded-xl select-none">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-cyan-custom" />
          <span className="font-bold text-xs uppercase tracking-wider font-mono">Admin Portal</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 rounded-lg border border-border-custom text-secondary hover:text-text bg-slate-900"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation Panel */}
      <aside className={`
        ${mobileSidebarOpen ? 'block animate-fade-in' : 'hidden'} 
        md:block md:w-64 shrink-0 border border-border-custom bg-card-custom/80 rounded-2xl p-4 flex flex-col justify-between space-y-6 backdrop-blur-md
      `}>
        <div className="space-y-6">
          {/* Brand header */}
          <div className="hidden md:flex items-center space-x-2.5 pb-4 border-b border-border-custom/50 select-none">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-custom to-purple-custom flex items-center justify-center text-bg shadow-glow">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-black tracking-widest text-text">
                PORTFOLIO<span className="text-cyan-custom">.ADMIN</span>
              </h2>
              <p className="text-[7px] text-emerald-400 font-mono">AUTH: ACTIVE</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wide transition-all ${
                    isActive(item.href)
                      ? 'text-cyan-custom bg-cyan-custom/10 border border-cyan-custom/25'
                      : 'text-secondary border border-transparent hover:text-text hover:bg-slate-800/30'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Action Panel Footer */}
        <div className="space-y-2 border-t border-border-custom/50 pt-4">
          <Link
            href="/"
            className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold text-secondary hover:text-cyan-custom transition"
          >
            <Globe className="w-4 h-4 shrink-0" />
            <span>{locale === 'vi' ? 'Xem Website' : 'View Site'}</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold text-rose-500 hover:bg-rose-500/10 transition"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>{locale === 'vi' ? 'Đăng xuất' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* Main Form Dashboard Viewport */}
      <main className="flex-1 border border-border-custom bg-card-custom/50 rounded-3xl p-6 backdrop-blur-sm min-h-[400px] overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
