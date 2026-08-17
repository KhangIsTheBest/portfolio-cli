'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal, Menu, X, Globe, LogIn, User, Sparkles } from 'lucide-react';
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
    <header className="sticky top-4 z-40 w-full max-w-7xl mx-auto mb-8 select-none font-mono">
      <nav className="w-full border border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 bg-[#0d0f17]/85 dark:bg-[#0d0f17]/85 light:bg-white/85 backdrop-blur-xl rounded-2xl px-4 md:px-5 py-2.5 flex items-center justify-between shadow-2xl transition-colors duration-300">
        
        {/* Brand & Online Indicator */}
        <Link href="/" className="flex items-center space-x-2.5 group shrink-0 cursor-pointer">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 group-hover:scale-105 transition duration-300">
            <Terminal className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-extrabold tracking-tight text-slate-100 dark:text-slate-100 light:text-slate-900 group-hover:text-emerald-400 transition font-sans">
              PhanDuyKhang<span className="text-emerald-400 font-mono">.dev</span>
            </span>
            <div className="flex items-center space-x-1.5 text-[9px] text-slate-400 dark:text-slate-400 light:text-slate-500">
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
              <span className="whitespace-nowrap font-mono">{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-1 mx-4 overflow-x-auto scrollbar-none">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition duration-200 cursor-pointer ${
                  active
                    ? 'text-emerald-400 dark:text-emerald-400 light:text-emerald-600 bg-emerald-500/10 dark:bg-emerald-500/10 light:bg-emerald-500/15 border border-emerald-500/20 dark:border-emerald-500/20 light:border-emerald-500/30 font-bold shadow-sm'
                    : 'text-slate-400 dark:text-slate-400 light:text-slate-600 border border-transparent hover:text-slate-100 dark:hover:text-slate-100 light:hover:text-slate-900 hover:bg-white/[0.04] dark:hover:bg-white/[0.04] light:hover:bg-slate-100'
                }`}
              >
                {t(item.labelKey)}
              </Link>
            );
          })}
        </div>

        {/* Right Actions (Language, Dark/Light Mode, Portal) */}
        <div className="hidden lg:flex items-center space-x-2.5 shrink-0 select-none">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            type="button"
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/[0.03] dark:bg-white/[0.03] light:bg-slate-100 border border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 hover:border-emerald-500/40 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 rounded-xl text-xs font-bold transition cursor-pointer"
            title={locale === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{locale === 'vi' ? 'VN' : 'EN'}</span>
          </button>
          
          {/* Sun / Moon Theme Toggle */}
          <ThemeSelector />

          {/* Account Portal Button */}
          <Link
            href={isLoggedIn ? (isAdmin ? '/admin' : '/profile') : '/login'}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-500/10 dark:bg-emerald-500/10 light:bg-emerald-600/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 dark:text-emerald-400 light:text-emerald-700 rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
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
            type="button"
            className="px-2.5 py-1.5 bg-white/[0.03] dark:bg-white/[0.03] light:bg-slate-100 border border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 text-slate-300 dark:text-slate-300 light:text-slate-700 rounded-xl text-xs font-bold"
          >
            <span>{locale === 'vi' ? 'VN' : 'EN'}</span>
          </button>
          
          <ThemeSelector />
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="p-1.5 rounded-xl border border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 text-slate-300 dark:text-slate-300 light:text-slate-700 bg-white/[0.03] dark:bg-white/[0.03] light:bg-slate-100"
            title="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 p-4 border border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 bg-[#0d0f17]/95 dark:bg-[#0d0f17]/95 light:bg-white/95 backdrop-blur-2xl rounded-2xl space-y-2 animate-fade-in select-none shadow-2xl">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full block px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                isActive(item.href)
                  ? 'text-emerald-400 dark:text-emerald-400 light:text-emerald-600 bg-emerald-500/10 dark:bg-emerald-500/10 light:bg-emerald-50 border border-emerald-500/25'
                  : 'text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-white/[0.04] dark:hover:bg-white/[0.04] light:hover:bg-slate-100'
              }`}
            >
              {t(item.labelKey)}
            </Link>
          ))}
          
          <Link
            href={isLoggedIn ? (isAdmin ? '/admin' : '/profile') : '/login'}
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center py-2.5 rounded-xl text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 dark:text-emerald-400 light:text-emerald-700 block mt-3"
          >
            {isLoggedIn ? (locale === 'vi' ? 'Quản lý tài khoản' : 'Account Portal') : (locale === 'vi' ? 'Đăng nhập / Đăng ký' : 'Sign In / Register')}
          </Link>
        </div>
      )}
    </header>
  );
};
