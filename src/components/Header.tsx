'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, Menu, X, Globe } from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';
import { useLanguage } from '@/context/LanguageContext';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { locale, setLanguage, t } = useLanguage();

  const menuItems = [
    { href: '/', labelKey: 'nav.home' },
    { href: '/about', labelKey: 'nav.about' },
    { href: '/skills', labelKey: 'nav.skills' },
    { href: '/projects', labelKey: 'nav.projects' },
    { href: '/blog', labelKey: 'nav.blog' },
    { href: '/contact', labelKey: 'nav.contact' }
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const toggleLanguage = () => {
    setLanguage(locale === 'vi' ? 'en' : 'vi');
  };

  return (
    <nav className="sticky top-4 z-40 w-full border border-border-custom bg-card-custom/80 backdrop-blur-md rounded-2xl mb-8">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center space-x-2.5 group select-none">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-custom to-purple-custom p-0.5 shadow-glow flex items-center justify-center text-bg">
            <div className="w-full h-full rounded-[10px] bg-bg flex items-center justify-center text-cyan-custom group-hover:text-purple-custom transition-all">
              <Layers className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <h1 className="text-sm font-black tracking-widest text-text">
              PORTFOLIO<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-custom to-purple-custom">.CLI</span>
            </h1>
            <p className="text-[8px] text-secondary font-mono">SYS_OK: HTTP_REST</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-1.5">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold tracking-wide transition-all duration-200 ${
                isActive(item.href)
                  ? 'text-cyan-custom bg-cyan-custom/10 border border-cyan-custom/20'
                  : 'text-secondary border border-transparent hover:text-text hover:bg-slate-800/40'
              }`}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </div>

        {/* Theme & Language Selectors */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900/60 border border-border-custom hover:border-primary/50 text-secondary hover:text-text rounded-xl text-xs font-mono font-bold transition duration-200"
            title={locale === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
          >
            <Globe className="w-3.5 h-3.5 text-primary" />
            <span>{locale === 'vi' ? 'VN' : 'EN'}</span>
          </button>
          
          <ThemeSelector />
        </div>

        {/* Hamburger Mobile Toggle Button */}
        <div className="flex items-center space-x-3 md:hidden">
          {/* Mobile Language Button */}
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-900/60 border border-border-custom text-secondary hover:text-text rounded-xl text-xs font-mono font-bold"
          >
            <span>{locale === 'vi' ? 'VN' : 'EN'}</span>
          </button>
          
          <ThemeSelector />
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg border border-border-custom text-secondary hover:text-text bg-slate-800/30"
            title="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 border-t border-border-custom bg-card-custom/95 rounded-b-2xl backdrop-blur-lg flex flex-col space-y-2 pt-3 animate-fade-in">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wide transition-all ${
                isActive(item.href)
                  ? 'text-cyan-custom bg-cyan-custom/10 border border-cyan-custom/25'
                  : 'text-secondary hover:text-text hover:bg-slate-800/30'
              }`}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};
