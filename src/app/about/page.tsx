'use client';

import React, { useState, useEffect } from 'react';
import { User, MapPin, Mail } from 'lucide-react';
import { apiService } from '@/services/api';
import { Profile } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutPage() {
  const { locale, t } = useLanguage();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiService.getProfile();
        setProfile(data);
      } catch (err) {
        console.error('Failed to load about page profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-cyan-custom space-y-4">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-custom/20 animate-pulse" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-custom animate-spin" />
        </div>
        <p className="font-mono text-xs tracking-wider animate-pulse">
          {locale === 'vi' ? 'ĐANG ĐỌC HỒ SƠ...' : 'RETRIEVING DIAGNOSTICS...'}
        </p>
      </div>
    );
  }

  const userProfile = profile || {
    fullName: 'Phan Duy Khang',
    aboutMe: locale === 'vi' 
      ? 'Sinh viên ngành Kỹ thuật phần mềm với nền tảng tốt về Data Structures & Algorithms cùng khả năng tự học tốt. Mong muốn phát triển chuyên sâu trong lĩnh vực Backend Engineering, hướng đến việc xây dựng các hệ thống hiệu năng cao, đáp ứng các bài toán thực tế ở quy mô lớn.'
      : 'Software Engineering student with a strong foundation in Data Structures & Algorithms and excellent self-learning abilities. Passionate about Backend Engineering, aiming to build high-performance, scalable systems to solve complex real-world problems.',
    email: 'pdkhang1304@gmail.com',
    githubUrl: 'https://github.com/KhangIsTheBest',
    linkedinUrl: 'https://linkedin.com/in/phanduykhang'
  };

  return (
    <section className="border border-border-custom glass-panel rounded-3xl p-8 space-y-6 animate-fade-in my-8">
      <div className="flex items-center space-x-2 border-b border-border-custom/50 pb-3">
        <User className="w-5 h-5 text-cyan-custom" />
        <h3 className="text-base font-bold text-text">{t('about.title')}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start font-sans text-secondary text-sm">
        <div className="md:col-span-3 space-y-4">
          <p className="leading-relaxed whitespace-pre-wrap">{userProfile.aboutMe}</p>
          
          <div className="flex flex-wrap gap-4 pt-4 text-xs text-secondary/80 font-mono">
            <span className="flex items-center gap-1.5 bg-slate-900/40 px-3 py-1.5 rounded-xl border border-border-custom/50">
              <MapPin className="w-4 h-4 text-purple-custom" />
              <span>{t('about.location')}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/40 px-3 py-1.5 rounded-xl border border-border-custom/50">
              <Mail className="w-4 h-4 text-cyan-custom" />
              <span>{userProfile.email}</span>
            </span>
          </div>
        </div>

        {/* Social Card Sidebar */}
        <div className="md:col-span-1 border border-border-custom bg-slate-950/40 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 text-center">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-secondary">
            {t('about.secureChannels')}
          </span>
          <div className="flex space-x-3">
            {userProfile.githubUrl && (
              <a
                href={userProfile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/50 hover:border-cyan-custom hover:text-cyan-custom text-secondary transition-all"
                title="GitHub"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
              </a>
            )}
            {userProfile.linkedinUrl && (
              <a
                href={userProfile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/50 hover:border-purple-custom hover:text-purple-custom text-secondary transition-all"
                title="LinkedIn"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
            )}
            {userProfile.email && (
              <a
                href={`mailto:${userProfile.email}`}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/50 hover:border-cyan-custom hover:text-cyan-custom text-secondary transition-all"
                title="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
