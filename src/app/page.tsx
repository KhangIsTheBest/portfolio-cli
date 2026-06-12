'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Briefcase, ArrowRight } from 'lucide-react';
import { apiService } from '@/services/api';
import { Profile } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const { locale, t } = useLanguage();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiService.getProfile();
        setProfile(data);
      } catch (err) {
        console.error('Failed to load home page profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-cyan-custom space-y-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-custom/20 animate-pulse" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-custom animate-spin" />
        </div>
        <p className="font-mono text-xs tracking-wider animate-pulse">
          {locale === 'vi' ? 'ĐANG KẾT NỐI VỚI MÁY CHỦ PROFILE...' : 'CONNECTING TO PROFILE SERVER...'}
        </p>
      </div>
    );
  }

  const userProfile = profile || {
    fullName: 'Đào Thế Khang',
    title: locale === 'vi' ? 'Kỹ sư phần mềm Full-Stack' : 'Full-Stack Software Engineer',
    avatarUrl: '',
    aboutMe: ''
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center border border-border-custom glass-panel rounded-3xl p-8 relative overflow-hidden animate-fade-in my-8">
      {/* Inner Ambient Glow */}
      <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-cyan-custom/20 blur-3xl -z-10 pointer-events-none" />

      {/* Profile Avatar */}
      <div className="flex justify-center md:col-span-1">
        <div className="relative group">
          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-cyan-custom to-purple-custom opacity-75 blur-md group-hover:opacity-100 transition duration-500 animate-pulse-slow" />
          <img
            src={userProfile.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${userProfile.fullName}`}
            alt={userProfile.fullName}
            className="relative w-44 h-44 rounded-full border border-border-custom bg-bg shadow-2xl object-cover scale-95 group-hover:scale-100 transition duration-500"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="space-y-4 md:col-span-2 text-center md:text-left">
        <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-custom/10 border border-cyan-custom/20 text-cyan-custom">
          <Sparkles className="w-3.5 h-3.5 text-cyan-custom" />
          <span>{t('home.welcome')}</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          {t('home.titlePrefix')}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-custom to-purple-custom">
            {userProfile.fullName}
          </span>
        </h2>
        
        <p className="text-lg font-semibold text-text/90 flex items-center justify-center md:justify-start gap-2">
          <Briefcase className="w-4 h-4 text-purple-custom" />
          <span>{userProfile.title}</span>
        </p>

        <p className="text-sm leading-relaxed text-secondary font-sans max-w-xl">
          {t('home.subtitle')}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4">
          <Link
            href="/contact"
            className="w-full sm:w-auto text-center px-5 py-3 rounded-xl text-xs font-bold text-bg bg-gradient-to-r from-cyan-custom to-purple-custom hover:brightness-110 hover:shadow-glow transition-all duration-300 active:scale-95"
          >
            {t('home.contactBtn')}
          </Link>
          <Link
            href="/projects"
            className="w-full sm:w-auto text-center flex items-center justify-center gap-1 px-5 py-3 rounded-xl text-xs font-bold border border-border-custom bg-slate-900/40 text-text hover:bg-slate-800/60 transition active:scale-95"
          >
            <span>{t('home.projectsBtn')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
