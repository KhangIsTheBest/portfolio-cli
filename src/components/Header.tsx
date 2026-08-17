'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal, Menu, X, Globe, LogIn, User, Activity, Shield } from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';
import { useLanguage } from '@/context/LanguageContext';
import { useServerStatus } from '@/context/ServerStatusContext';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { locale, setLanguage, t } = useLanguage();
  const { isOnline } = useServerStatus();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminToken = localStorage.getItem('admin-token');
    const userToken = localStorage.getItem('user-token');
    setIsLoggedIn(!!adminToken || !!userToken);
    setIsAdmin(!!adminToken);
  }, [pathname]);

  const menuItems = [
    { href: '/', labelKey: 'nav.home' },
    { href: '/about', labelKey: 'nav.about' },
    { href: '/skills', labelKey: 'nav.skills' },
    { href: '/projects', labelKey: 'nav.projects' },
    { href: '/blog', labelKey: 'nav.blog' },
    { href: '/contact', labelKey: 'nav.contact' }
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const toggleLanguage = () => {
    setLanguage(locale === 'vi' ? 'en' : 'vi');
  };

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="sticky top-4 z-40 w-full max-w-7xl mx-auto mb-8 font-mono select-text">
      <nav className="w-full border border-white/[0.08] bg-[#0d0f17]/90 backdrop-blur-xl rounded-2xl px-4 md:px-6 py-3 flex items-center justify-between shadow-2xl">
        
        {/* Brand & System Status */}
        <Link href="/" className="flex items-center space-x-3 group select-none cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/50 group-hover:text-white transition duration-300">
            <Terminal className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-slate-100 tracking-tight">
                PhanDuyKhang<span className="text-emerald-400 font-mono">.dev</span>
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                v2.4
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-[9px] text-slate-400 font-mono">
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
              <span>{isOnline ? 'REST API 200 OK (24ms)' : 'OFFLINE MODE'}</span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-1">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition duration-200 cursor-pointer ${
                  active
                    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-sm'
                    : 'text-slate-400 border border-transparent hover:text-slate-100 hover:bg-white/[0.03]'
                }`}
              >
                {t(item.labelKey)}
              </Link>
            );
          })}
        </div>

        {/* Actions (Language, Theme, Auth Portal) */}
        <div className="hidden lg:flex items-center space-x-2 select-none">
          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/[0.03] border border-white/[0.08] hover:border-emerald-500/40 text-slate-300 hover:text-white rounded-xl text-xs font-mono font-semibold transition cursor-pointer"
            title={locale === 'vi' ? 'Chuyển sang Tiếng Việt / English' : 'Switch Language'}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{locale === 'vi' ? 'VN' : 'EN'}</span>
          </button>
          
          <ThemeSelector />

          {/* User Auth / Portal button */}
          <Link
            href={isLoggedIn ? (isAdmin ? '/admin' : '/profile') : '/login'}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-mono font-bold transition duration-200 cursor-pointer"
          >
            {isLoggedIn ? (
              <>
                <User className="w-3.5 h-3.5" />
                <span>{locale === 'vi' ? 'Tài khoản' : 'Portal'}</span>
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5" />
                <span>{locale === 'vi' ? 'Đăng nhập' : 'Sign In'}</span>
              </>
            )}
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center space-x-2 lg:hidden select-none">
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 bg-white/[0.03] border border-white/[0.08] text-slate-300 rounded-xl text-xs font-mono font-bold"
          >
            <span>{locale === 'vi' ? 'VN' : 'EN'}</span>
          </button>
          
          <ThemeSelector />
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-white/[0.08] text-slate-300 bg-white/[0.03] hover:text-white"
            title="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 p-4 border border-white/[0.08] bg-[#0d0f17]/95 backdrop-blur-2xl rounded-2xl space-y-2 animate-fade-in select-none shadow-2xl">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full block px-3 py-2 rounded-xl text-xs font-mono font-bold transition ${
                isActive(item.href)
                  ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/25'
                  : 'text-slate-300 hover:bg-white/[0.04]'
              }`}
            >
              {t(item.labelKey)}
            </Link>
          ))}
          
          <Link
            href={isLoggedIn ? (isAdmin ? '/admin' : '/profile') : '/login'}
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center py-2.5 rounded-xl text-xs font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 block mt-3"
          >
            {isLoggedIn ? (locale === 'vi' ? 'Quản lý tài khoản' : 'Account Portal') : (locale === 'vi' ? 'Đăng nhập / Đăng ký' : 'Sign In / Register')}
          </Link>
        </div>
      )}
    </header>
  );
};
