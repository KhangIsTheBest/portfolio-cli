'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, LogIn, User, Search, Sparkles, Command as CommandIcon } from 'lucide-react';
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

  const menuItems = [
    { href: '/', labelKey: 'nav.home' },
    { href: '/about', labelKey: 'nav.about' },
    { href: '/skills', labelKey: 'nav.skills' },
    { href: '/projects', labelKey: 'nav.projects' },
    { href: '/architecture', labelKey: 'nav.architecture' },
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
    <>
      <header className="sticky top-4 z-40 w-full max-w-6xl mx-auto mb-8 px-3 sm:px-4 select-none font-mono">
        <nav className="w-full border border-[var(--border-color)] bg-[var(--card-bg)]/80 backdrop-blur-2xl rounded-2xl px-4 py-2.5 flex items-center justify-between shadow-2xl transition-all duration-300">
          
          {/* Brand Logo & Status */}
          <Link href="/" className="flex items-center space-x-2.5 group shrink-0 cursor-pointer">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center p-1 group-hover:bg-emerald-500/20 group-hover:scale-105 transition duration-300">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-tight text-[var(--text-color)] group-hover:text-emerald-500 transition font-sans">
                PhanDuyKhang<span className="text-emerald-500 font-mono">.dev</span>
              </span>
              <div className="flex items-center space-x-1.5 text-[8px] text-[var(--secondary-color)]">
                <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                <span className="whitespace-nowrap font-mono">{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links with Animated Pill Indicator */}
          <div className="hidden lg:flex items-center space-x-1 mx-3 bg-[var(--terminal-header-bg)]/50 p-1 rounded-xl border border-[var(--border-color)]/60">
            {menuItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                    active
                      ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                      : 'text-[var(--secondary-color)] hover:text-[var(--text-color)]'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-emerald-500/15 border border-emerald-500/30 rounded-lg shadow-sm"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{t(item.labelKey)}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Actions: Command Search, Language, Theme, Portal */}
          <div className="hidden lg:flex items-center space-x-2 shrink-0 select-none">
            {/* Quick Command Palette Button */}
            <button
              onClick={() => setCommandMenuOpen(true)}
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[var(--terminal-header-bg)] border border-[var(--border-color)] hover:border-emerald-500/40 text-[var(--secondary-color)] hover:text-[var(--text-color)] rounded-xl text-xs font-bold transition cursor-pointer"
              title="Quick Command Menu (Ctrl+K / Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] hidden xl:inline text-[var(--secondary-color)]">Search</span>
              <kbd className="text-[9px] bg-[var(--card-bg)] border border-[var(--border-color)] px-1 rounded text-[var(--secondary-color)] font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              type="button"
              className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-[var(--terminal-header-bg)] border border-[var(--border-color)] hover:border-emerald-500/40 text-[var(--text-color)] rounded-xl text-xs font-bold transition cursor-pointer"
              title={locale === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-500" />
              <span>{locale === 'vi' ? 'VN' : 'EN'}</span>
            </button>
            
            {/* Theme Selector */}
            <ThemeSelector />

            {/* Account Portal Button */}
            <Link
              href={isLoggedIn ? (isAdmin ? '/admin' : '/profile') : '/login'}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 shadow-sm"
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
              onClick={() => setCommandMenuOpen(true)}
              type="button"
              className="p-2 bg-[var(--terminal-header-bg)] border border-[var(--border-color)] rounded-xl text-[var(--text-color)]"
              title="Search"
            >
              <Search className="w-4 h-4 text-emerald-500" />
            </button>

            <button
              onClick={toggleLanguage}
              type="button"
              className="px-2 py-1.5 bg-[var(--terminal-header-bg)] border border-[var(--border-color)] text-[var(--text-color)] rounded-xl text-xs font-bold"
            >
              <span>{locale === 'vi' ? 'VN' : 'EN'}</span>
            </button>
            
            <ThemeSelector />
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-1.5 rounded-xl border border-[var(--border-color)] text-[var(--text-color)] bg-[var(--terminal-header-bg)]"
              title="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mt-2 p-4 border border-[var(--border-color)] bg-[var(--card-bg)]/95 backdrop-blur-2xl rounded-2xl space-y-2 select-none shadow-2xl"
            >
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full block px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive(item.href)
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/25'
                      : 'text-[var(--secondary-color)] hover:text-[var(--text-color)] hover:bg-[var(--terminal-header-bg)]'
                  }`}
                >
                  {t(item.labelKey)}
                </Link>
              ))}
              
              <Link
                href={isLoggedIn ? (isAdmin ? '/admin' : '/profile') : '/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 block mt-3"
              >
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
