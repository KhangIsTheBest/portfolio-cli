'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Home, 
  User, 
  Layers, 
  Briefcase, 
  Cpu, 
  BookOpen, 
  Mail, 
  Download, 
  Moon, 
  Sun, 
  Globe, 
  ArrowRight,
  Sparkles,
  Command as CommandIcon,
  X
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { locale, toggleLanguage, t } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = [
    {
      category: locale === 'vi' ? 'Trang Điều Hướng' : 'Navigation',
      items: [
        { id: 'nav-home', label: t('nav.home'), icon: Home, action: () => router.push('/') },
        { id: 'nav-about', label: t('nav.about'), icon: User, action: () => router.push('/about') },
        { id: 'nav-skills', label: t('nav.skills'), icon: Layers, action: () => router.push('/skills') },
        { id: 'nav-projects', label: t('nav.projects'), icon: Briefcase, action: () => router.push('/projects') },
        { id: 'nav-architecture', label: t('nav.architecture'), icon: Cpu, action: () => router.push('/architecture') },
        { id: 'nav-blog', label: t('nav.blog'), icon: BookOpen, action: () => router.push('/blog') },
        { id: 'nav-contact', label: t('nav.contact'), icon: Mail, action: () => router.push('/contact') },
      ]
    },
    {
      category: locale === 'vi' ? 'Hành Động Nhanh' : 'Quick Actions',
      items: [
        { 
          id: 'act-cv', 
          label: locale === 'vi' ? 'Tải CV Kỹ Sư (PDF)' : 'Download Engineer Resume (PDF)', 
          icon: Download, 
          action: () => window.open('/cv/PhanDuyKhang_CV.pdf', '_blank') 
        },
        { 
          id: 'act-theme', 
          label: locale === 'vi' ? `Chuyển Giao diện (${isDarkMode ? 'Sáng' : 'Tối'})` : `Toggle Theme (${isDarkMode ? 'Light' : 'Dark'})`, 
          icon: isDarkMode ? Sun : Moon, 
          action: () => toggleTheme() 
        },
        { 
          id: 'act-lang', 
          label: locale === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt', 
          icon: Globe, 
          action: () => toggleLanguage() 
        },
      ]
    }
  ];

  // Flatten filtered items
  const filteredGroups = items.map(group => ({
    ...group,
    items: group.items.filter(item => 
      item.label.toLowerCase().includes(query.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  const flatFilteredItems = filteredGroups.flatMap(g => g.items);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (flatFilteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + flatFilteredItems.length) % (flatFilteredItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (flatFilteredItems[selectedIndex]) {
          flatFilteredItems[selectedIndex].action();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flatFilteredItems, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden font-mono text-[var(--text-color)] z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-[var(--border-color)] gap-3">
              <Search className="w-4 h-4 text-emerald-500 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder={locale === 'vi' ? 'Nhập lệnh hoặc tìm kiếm trang, hành động...' : 'Type a command or search pages, actions...'}
                className="w-full bg-transparent border-none outline-none text-xs text-[var(--text-color)] placeholder:text-[var(--secondary-color)]"
              />
              <span className="text-[10px] bg-[var(--terminal-header-bg)] border border-[var(--border-color)] text-[var(--secondary-color)] px-1.5 py-0.5 rounded font-bold shrink-0">
                ESC
              </span>
              <button onClick={onClose} className="text-[var(--secondary-color)] hover:text-[var(--text-color)] p-0.5">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-72 overflow-y-auto p-2 space-y-3">
              {flatFilteredItems.length === 0 ? (
                <div className="py-8 text-center text-xs text-[var(--secondary-color)] font-sans">
                  {locale === 'vi' ? 'Không tìm thấy kết quả phù hợp.' : 'No commands or pages found.'}
                </div>
              ) : (
                filteredGroups.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-1">
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--secondary-color)]">
                      {group.category}
                    </div>
                    {group.items.map((item) => {
                      const itemIdx = flatFilteredItems.findIndex(f => f.id === item.id);
                      const isSelected = itemIdx === selectedIndex;
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            item.action();
                            onClose();
                          }}
                          onMouseEnter={() => setSelectedIndex(itemIdx)}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                              : 'text-[var(--text-color)] hover:bg-[var(--terminal-header-bg)]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-500' : 'text-[var(--secondary-color)]'}`} />
                            <span className="font-sans text-xs font-semibold">{item.label}</span>
                          </div>
                          {isSelected && (
                            <ArrowRight className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer Quick Tips */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--border-color)] bg-[var(--terminal-header-bg)] text-[10px] text-[var(--secondary-color)]">
              <div className="flex items-center gap-2">
                <span>Navigate: <kbd className="px-1 py-0.5 rounded bg-[var(--card-bg)] border border-[var(--border-color)]">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-[var(--card-bg)] border border-[var(--border-color)]">↓</kbd></span>
                <span>Select: <kbd className="px-1 py-0.5 rounded bg-[var(--card-bg)] border border-[var(--border-color)]">↵</kbd></span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                <span>Command Menu</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
