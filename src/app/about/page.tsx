'use client';

import React, { useState, useEffect } from 'react';
import { User, MapPin, Mail, Download, Briefcase, GraduationCap, Calendar, Code } from 'lucide-react';
import { apiService } from '@/services/api';
import { Profile } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useServerStatus } from '@/context/ServerStatusContext';
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
      company: 'Personal & Thesis Projects',
      period: '2023 - Present',
      desc: locale === 'vi' 
        ? 'Thiết kế & phát triển các ứng dụng Web với Java Spring Boot, React, Next.js, PostgreSQL, RESTful API và Docker.'
        : 'Designed & developed full-stack web applications with Java Spring Boot, React, Next.js, PostgreSQL, REST APIs, and Docker.'
    }
  ];

  const education = [
    {
      degree: locale === 'vi' ? 'Cử nhân Kỹ thuật Phần mềm' : 'Bachelor of Software Engineering',
      institution: locale === 'vi' ? 'Đại học / Trường Công nghệ' : 'University of Technology',
      period: '2021 - 2025',
      desc: locale === 'vi' 
        ? 'Chuyên ngành Kỹ thuật Phần mềm. Tập trung vào Cấu trúc dữ liệu & Giải thuật, Thiết kế hệ thống, Cơ sở dữ liệu và Lập trình Hướng đối tượng (OOP).'
        : 'Major in Software Engineering. Focused on Data Structures & Algorithms, System Design, Relational Databases, and OOP.'
    }
  ];

  return (
    <div className="space-y-8 my-8 animate-fade-in">
      {/* Main Bio Card */}
      <section className="border border-border-custom glass-panel rounded-3xl p-8 space-y-6">
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

          {/* Social & CV Sidebar */}
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

            <a
              href="/cv/PhanDuyKhang_CV.pdf"
              download="PhanDuyKhang_CV.pdf"
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold font-mono border border-cyan-custom/40 bg-cyan-custom/10 text-cyan-custom hover:bg-cyan-custom/20 transition"
            >
              <Download className="w-4 h-4" />
              <span>{locale === 'vi' ? 'TẢI CV' : 'DOWNLOAD CV'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Experience & Education Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Work Experience */}
        <section className="border border-border-custom glass-panel rounded-3xl p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-border-custom/50 pb-3">
            <Briefcase className="w-4 h-4 text-purple-custom" />
            <h4 className="text-sm font-bold text-text uppercase font-mono tracking-wider">
              {locale === 'vi' ? 'Kinh Nghiệm Làm Việc' : 'Work Experience'}
            </h4>
          </div>
          <div className="space-y-4">
            {experiences.map((exp, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950/40 border border-border-custom/40 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-text text-sm font-sans">{exp.role}</h5>
                    <p className="text-xs text-cyan-custom font-mono">{exp.company}</p>
                  </div>
                  <span className="text-[10px] font-mono text-secondary bg-slate-900/60 px-2.5 py-1 rounded-lg border border-border-custom/30 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-purple-custom" />
                    {exp.period}
                  </span>
                </div>
                <p className="text-xs text-secondary leading-relaxed font-sans">{exp.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="border border-border-custom glass-panel rounded-3xl p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-border-custom/50 pb-3">
            <GraduationCap className="w-4 h-4 text-cyan-custom" />
            <h4 className="text-sm font-bold text-text uppercase font-mono tracking-wider">
              {locale === 'vi' ? 'Học Vấn & Bằng Cấp' : 'Education'}
            </h4>
          </div>
          <div className="space-y-4">
            {education.map((edu, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950/40 border border-border-custom/40 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-text text-sm font-sans">{edu.degree}</h5>
                    <p className="text-xs text-purple-custom font-mono">{edu.institution}</p>
                  </div>
                  <span className="text-[10px] font-mono text-secondary bg-slate-900/60 px-2.5 py-1 rounded-lg border border-border-custom/30 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-cyan-custom" />
                    {edu.period}
                  </span>
                </div>
                <p className="text-xs text-secondary leading-relaxed font-sans">{edu.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
