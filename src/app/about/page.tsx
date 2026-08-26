'use client';

import React, { useState, useEffect } from 'react';
import { User, MapPin, Mail, Download, Briefcase, GraduationCap, Calendar, ShieldCheck } from 'lucide-react';
import { apiService } from '@/services/api';
import { Profile } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useServerStatus } from '@/context/ServerStatusContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AboutPage() {
  const { locale, t } = useLanguage();
  const { isOnline } = useServerStatus();
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
  }, [isOnline]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] text-emerald-600 dark:text-emerald-400 font-mono space-y-4">
        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-xs tracking-wider animate-pulse">RETRIEVING PROFILE DATA...</p>
      </div>
    );
  }

  const userProfile = profile || {
    id: 0,
    fullName: "Phan Duy Khang",
    title: locale === 'vi' ? 'Lập trình viên Backend / Full-Stack' : 'Backend / Full-Stack Developer',
    aboutMe: locale === 'vi' 
      ? 'Sinh viên ngành Kỹ thuật phần mềm với nền tảng tốt về Data Structures & Algorithms cùng khả năng tự học tốt. Mong muốn phát triển chuyên sâu trong lĩnh vực Backend Engineering, hướng đến việc xây dựng các hệ thống hiệu năng cao.'
      : 'Software Engineering student with a strong foundation in Data Structures & Algorithms. Aiming to build high-performance backend systems.',
    email: 'pdkhang.dev@gmail.com',
    githubUrl: 'https://github.com/KhangIsTheBest',
    linkedinUrl: 'https://linkedin.com/in/phanduykhang',
    avatarUrl: '',
    updatedAt: new Date().toISOString()
  };

  const experiences = [
    {
      role: locale === 'vi' ? 'Full-Stack / Backend Developer' : 'Full-Stack / Backend Developer',
      company: 'Personal & Thesis Systems',
      period: '2023 - Present',
      desc: locale === 'vi' 
        ? 'Thiết kế & triển khai ứng dụng Web thương mại điện tử và hệ thống quản trị với Java Spring Boot 3, RESTful API, PostgreSQL, React 19 và Docker.'
        : 'Designed & deployed full-stack e-commerce and management platforms utilizing Java Spring Boot 3, REST APIs, PostgreSQL, React 19, and Docker.'
    }
  ];

  const education = [
    {
      degree: locale === 'vi' ? 'Cử nhân Kỹ thuật Phần mềm' : 'Bachelor of Software Engineering',
      institution: locale === 'vi' ? 'Trường Đại học Công nghệ' : 'University of Technology',
      period: '2021 - 2025',
      desc: locale === 'vi' 
        ? 'Tập trung nghiên cứu Cấu trúc dữ liệu & Giải thuật, Thiết kế hệ thống, Cơ sở dữ liệu quan hệ (RDBMS) và Lập trình Hướng đối tượng (OOP).'
        : 'Focused on Data Structures & Algorithms, System Design, Relational Databases (RDBMS), and Object-Oriented Programming (OOP).'
    }
  ];

  return (
    <div className="space-y-8 my-6 font-mono animate-fade-in select-text">
      
      {/* Header Bio Card */}
      <section className="border border-[var(--border-color)] bg-[var(--card-bg)] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl transition-colors duration-300">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-[var(--text-color)] uppercase tracking-wider">{t('about.title')}</h3>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded font-bold">
            VERIFIED PROFILE
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start text-sm">
          <div className="md:col-span-3 space-y-6 font-sans text-[var(--text-color)]">
            <div className="leading-relaxed text-sm select-text markdown-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {userProfile.aboutMe}
              </ReactMarkdown>
            </div>
            
            {/* Technical Philosophy Box */}
            <div className="p-4 rounded-2xl bg-[var(--terminal-header-bg)] border border-[var(--border-color)] space-y-2">
              <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{t('about.philosophyTitle')}</span>
              </div>
              <p className="text-xs text-[var(--secondary-color)] leading-relaxed font-sans">
                {t('about.philosophyDesc')}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2 text-xs text-[var(--secondary-color)] font-mono">
              <span className="flex items-center gap-1.5 bg-[var(--terminal-header-bg)] px-3 py-1.5 rounded-xl border border-[var(--border-color)]">
                <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{t('about.location')}</span>
              </span>
              <span className="flex items-center gap-1.5 bg-[var(--terminal-header-bg)] px-3 py-1.5 rounded-xl border border-[var(--border-color)]">
                <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{userProfile.email}</span>
              </span>
            </div>
          </div>

          {/* Social Channels Sidebar */}
          <div className="md:col-span-1 border border-[var(--border-color)] bg-[var(--terminal-header-bg)] rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 text-center">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--secondary-color)]">
              {t('about.secureChannels')}
            </span>

            <div className="flex space-x-3">
              {userProfile.githubUrl && (
                <a
                  href={userProfile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-emerald-500/50 text-[var(--text-color)] transition-all"
                  title="GitHub Profile"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                </a>
              )}
              {userProfile.linkedinUrl && (
                <a
                  href={userProfile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-sky-500/50 text-[var(--text-color)] transition-all"
                  title="LinkedIn Profile"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                </a>
              )}
              {userProfile.email && (
                <a
                  href={`mailto:${userProfile.email}`}
                  className="p-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-amber-500/50 text-[var(--text-color)] transition-all"
                  title="Direct Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </div>

            <a
              href="/cv/PhanDuyKhang_CV.pdf"
              download="PhanDuyKhang_CV.pdf"
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>{locale === 'vi' ? 'TẢI CV KỸ SƯ' : 'DOWNLOAD RESUME'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Experience & Education Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Work Experience */}
        <section className="border border-[var(--border-color)] bg-[var(--card-bg)] rounded-3xl p-6 space-y-4 shadow-xl transition-colors duration-300">
          <div className="flex items-center space-x-2 border-b border-[var(--border-color)] pb-3">
            <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h4 className="text-xs font-bold text-[var(--text-color)] uppercase tracking-wider">
              {locale === 'vi' ? 'Kinh Nghiệm Thực Chiến' : 'Engineering Experience'}
            </h4>
          </div>
          <div className="space-y-4">
            {experiences.map((exp, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[var(--terminal-header-bg)] border border-[var(--border-color)] space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-[var(--text-color)] text-xs font-sans">{exp.role}</h5>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">{exp.company}</p>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--secondary-color)] bg-[var(--card-bg)] px-2.5 py-1 rounded border border-[var(--border-color)] flex items-center gap-1 font-bold">
                    <Calendar className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    {exp.period}
                  </span>
                </div>
                <p className="text-xs text-[var(--secondary-color)] leading-relaxed font-sans">{exp.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="border border-[var(--border-color)] bg-[var(--card-bg)] rounded-3xl p-6 space-y-4 shadow-xl transition-colors duration-300">
          <div className="flex items-center space-x-2 border-b border-[var(--border-color)] pb-3">
            <GraduationCap className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <h4 className="text-xs font-bold text-[var(--text-color)] uppercase tracking-wider">
              {locale === 'vi' ? 'Học Vấn & Bằng Cấp' : 'Education & Degree'}
            </h4>
          </div>
          <div className="space-y-4">
            {education.map((edu, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[var(--terminal-header-bg)] border border-[var(--border-color)] space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-[var(--text-color)] text-xs font-sans">{edu.degree}</h5>
                    <p className="text-[11px] text-sky-600 dark:text-sky-400 font-mono">{edu.institution}</p>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--secondary-color)] bg-[var(--card-bg)] px-2.5 py-1 rounded border border-[var(--border-color)] flex items-center gap-1 font-bold">
                    <Calendar className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    {edu.period}
                  </span>
                </div>
                <p className="text-xs text-[var(--secondary-color)] leading-relaxed font-sans">{edu.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

    </div>
  );
}
