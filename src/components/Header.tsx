'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, LogIn, User, Search } from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';
import { CommandMenu } from './CommandMenu';
import { useLanguage } from '@/context/LanguageContext';
import { useServerStatus } from '@/context/ServerStatusContext';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
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

  // Global shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandMenuOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Short labels for nav items — keeps header compact
  const menuItems = [
    { href: '/', labelKey: 'nav.home',         shortVi: 'Trang chủ',  shortEn: 'Home'       },
    { href: '/about', labelKey: 'nav.about',   shortVi: 'Giới thiệu', shortEn: 'About'      },
    { href: '/skills', labelKey: 'nav.skills', shortVi: 'Kỹ năng',    shortEn: 'Skills'     },
    { href: '/projects', labelKey: 'nav.projects', shortVi: 'Dự án',  shortEn: 'Projects'   },
    { href: '/leetcode', labelKey: 'nav.leetcode', shortVi: 'LeetCode', shortEn: 'LeetCode' },
    { href: '/youtube', labelKey: 'nav.youtube', shortVi: 'Videos',   shortEn: 'Videos'     },
    { href: '/architecture', labelKey: 'nav.architecture', shortVi: 'Kiến trúc', shortEn: 'Arch.' },
    { href: '/blog', labelKey: 'nav.blog',     shortVi: 'Blog',       shortEn: 'Blog'       },
    { href: '/contact', labelKey: 'nav.contact', shortVi: 'Liên hệ', shortEn: 'Contact'     },
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
    <>
      <header className="sticky top-4 z-40 w-full max-w-6xl mx-auto mb-8 px-3 sm:px-4 select-none font-mono">
        <nav className="w-full border border-[var(--border-color)] bg-[var(--card-bg)]/80 backdrop-blur-2xl rounded-2xl px-3 py-2 flex items-center gap-2 shadow-2xl transition-all duration-300 min-w-0">

          {/* Brand Logo & Status — always visible, shrink-0 */}
          <Link href="/" className="flex items-center gap-2 group shrink-0 cursor-pointer min-w-0">
            <div className="w-7 h-7 shrink-0 rounded-lg bg-[var(--primary-bg)] border border-[var(--primary-border)] flex items-center justify-center p-1 group-hover:scale-105 transition duration-300">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col min-w-0 hidden sm:flex">
              <span className="text-[11px] font-bold tracking-tight text-[var(--text-color)] font-sans leading-none truncate">
                PhanDuyKhang<span className="text-[var(--primary-color)] font-mono">.dev</span>
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isOnline ? 'bg-indigo-500 animate-pulse' : 'bg-rose-500'}`} />
                <span className="text-[8px] text-[var(--secondary-color)] font-mono whitespace-nowrap">{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation — centered, auto grows */}
          <div className="hidden xl:flex flex-1 items-center justify-center">
            <div className="flex items-center gap-0.5 bg-[var(--terminal-header-bg)]/80 p-0.5 rounded-xl border border-[var(--border-color)]">
              {menuItems.map((item) => {
                const active = isActive(item.href);
                const label = locale === 'vi' ? item.shortVi : item.shortEn;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors duration-150 cursor-pointer ${
                      active
                        ? 'text-[var(--primary-color)] font-bold'
                        : 'text-[var(--secondary-color)] hover:text-[var(--text-color)]'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-[var(--primary-bg)] border border-[var(--primary-border)] rounded-lg"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Actions — desktop xl+ */}
          <div className="hidden xl:flex items-center gap-1.5 shrink-0 ml-auto">
            {/* Command Palette */}
            <button
              onClick={() => setCommandMenuOpen(true)}
              type="button"
              className="flex items-center gap-1.5 px-2 py-1.5 bg-[var(--terminal-header-bg)] border border-[var(--border-color)] hover:border-[var(--primary-border)] text-[var(--secondary-color)] hover:text-[var(--primary-color)] rounded-lg text-[11px] font-bold transition cursor-pointer"
              title="Quick Command Menu (Ctrl+K / Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-[var(--primary-color)]" />
              <kbd className="text-[9px] bg-[var(--card-bg)] border border-[var(--border-color)] px-1 rounded text-[var(--secondary-color)] font-mono">⌘K</kbd>
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              type="button"
              className="flex items-center gap-1 px-2 py-1.5 bg-[var(--terminal-header-bg)] border border-[var(--border-color)] hover:border-[var(--primary-border)] text-[var(--text-color)] rounded-lg text-[11px] font-bold transition cursor-pointer"
              title={locale === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
            >
              <Globe className="w-3.5 h-3.5 text-[var(--primary-color)]" />
              <span>{locale === 'vi' ? 'VN' : 'EN'}</span>
            </button>

            {/* Theme Selector */}
            <ThemeSelector />

            {/* Account Portal */}
            <Link
              href={isLoggedIn ? (isAdmin ? '/admin' : '/profile') : '/login'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[var(--primary-bg)] border border-[var(--primary-border)] text-[var(--primary-color)] rounded-lg text-[11px] font-bold transition cursor-pointer shrink-0 hover:opacity-80"
            >
              {isLoggedIn ? <User className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5" />}
              <span className="hidden 2xl:inline">{isLoggedIn ? (locale === 'vi' ? 'Tài khoản' : 'Portal') : (locale === 'vi' ? 'Đăng nhập' : 'Sign In')}</span>
            </Link>
          </div>

          {/* Mid-size desktop (lg only, no nav) — icon bar */}
          <div className="hidden lg:flex xl:hidden items-center gap-1.5 shrink-0 ml-auto">
            <button
              onClick={() => setCommandMenuOpen(true)}
              type="button"
              className="p-2 bg-[var(--terminal-header-bg)] border border-[var(--border-color)] hover:border-[var(--primary-border)] rounded-lg text-[var(--primary-color)] transition cursor-pointer"
              title="Search (⌘K)"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={toggleLanguage}
              type="button"
              className="px-2 py-1.5 bg-[var(--terminal-header-bg)] border border-[var(--border-color)] text-[var(--text-color)] rounded-lg text-[11px] font-bold transition cursor-pointer"
            >
              {locale === 'vi' ? 'VN' : 'EN'}
            </button>
            <ThemeSelector />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-color)] bg-[var(--terminal-header-bg)] transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile controls (below lg) */}
          <div className="flex items-center gap-1.5 lg:hidden shrink-0 ml-auto">
            <button
              onClick={() => setCommandMenuOpen(true)}
              type="button"
              className="p-1.5 bg-[var(--terminal-header-bg)] border border-[var(--border-color)] rounded-lg text-[var(--primary-color)]"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={toggleLanguage}
              type="button"
              className="px-2 py-1.5 bg-[var(--terminal-header-bg)] border border-[var(--border-color)] text-[var(--text-color)] rounded-lg text-[11px] font-bold"
            >
              {locale === 'vi' ? 'VN' : 'EN'}
            </button>
            <ThemeSelector />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-color)] bg-[var(--terminal-header-bg)]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Dropdown Menu — for lg and below */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="xl:hidden mt-2 p-3 border border-[var(--border-color)] bg-[var(--card-bg)]/95 backdrop-blur-2xl rounded-2xl shadow-2xl"
            >
              {/* Nav grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3">
                {menuItems.map((item) => {
                  const label = locale === 'vi' ? item.shortVi : item.shortEn;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-3 py-2 rounded-xl text-[11px] font-bold text-center transition ${
                        isActive(item.href)
                          ? 'text-[var(--primary-color)] bg-[var(--primary-bg)] border border-[var(--primary-border)]'
                          : 'text-[var(--secondary-color)] hover:text-[var(--text-color)] bg-[var(--terminal-header-bg)] border border-[var(--border-color)]'
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>

              <Link
                href={isLoggedIn ? (isAdmin ? '/admin' : '/profile') : '/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-[11px] font-bold bg-[var(--primary-bg)] border border-[var(--primary-border)] text-[var(--primary-color)] flex items-center justify-center gap-2"
              >
                {isLoggedIn ? <User className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5" />}
                {isLoggedIn ? (locale === 'vi' ? 'Quản lý tài khoản' : 'Account Portal') : (locale === 'vi' ? 'Đăng nhập / Đăng ký' : 'Sign In / Register')}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Command Palette */}
      <CommandMenu isOpen={commandMenuOpen} onClose={() => setCommandMenuOpen(false)} />
    </>
  );
};
