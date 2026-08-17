'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  ArrowRight, 
  Download, 
  Code2, 
  Server, 
  Database, 
  Terminal as TerminalIcon, 
  GitBranch, 
  ExternalLink, 
  Layers, 
  ShieldCheck, 
  Cpu,
  CheckCircle2,
  FolderGit2
} from 'lucide-react';
import { apiService } from '@/services/api';
import { Profile, Project, Technology } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useServerStatus } from '@/context/ServerStatusContext';
import { TerminalHero } from '@/components/TerminalHero';

export default function Home() {
  const { locale, t } = useLanguage();
  const { isOnline } = useServerStatus();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [totalProjectCount, setTotalProjectCount] = useState<number>(0);
  const [totalTechCount, setTotalTechCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profData, featuredData, allProjects, techData] = await Promise.all([
          apiService.getProfile().catch(() => null),
          apiService.getProjects(true).catch(() => []),
          apiService.getProjects(false).catch(() => []),
          apiService.getTechnologies().catch(() => [])
        ]);
        setProfile(profData);
        setFeaturedProjects(featuredData.length > 0 ? featuredData.slice(0, 3) : allProjects.slice(0, 3));
        setTotalProjectCount(allProjects.length);
        setTechnologies(techData);
        setTotalTechCount(techData.length);
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isOnline]);

  const userProfile = profile || {
    id: 0,
    fullName: "Phan Duy Khang",
    title: locale === 'vi' ? 'Lập trình viên Backend / Full-Stack' : 'Backend / Full-Stack Developer',
    aboutMe: locale === 'vi' 
      ? 'Sinh viên ngành Kỹ thuật phần mềm với nền tảng vững chắc về Cấu trúc dữ liệu & Giải thuật. Đam mê thiết kế kiến trúc Backend hiệu năng cao (Java Spring Boot, PostgreSQL) kết hợp giao diện Web hiện đại.'
      : 'Software Engineering student with strong foundations in Data Structures & Algorithms. Focused on high-performance Backend architecture and modern Web applications.',
    email: 'pdkhang.dev@gmail.com',
    githubUrl: 'https://github.com/KhangIsTheBest',
    linkedinUrl: 'https://linkedin.com/in/phanduykhang',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=PhanDuyKhang',
    updatedAt: new Date().toISOString()
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] text-emerald-600 dark:text-emerald-400 font-mono space-y-4">
        <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-xs tracking-wider animate-pulse font-bold">CONNECTING TO DATABASE...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 my-6 font-mono animate-fade-in select-text">
      
      {/* ========================================================================= */}
      {/* SECTION 1: HERO BENTO GRID (Profile Card + Terminal CLI) */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Developer Identity Card (5 cols) */}
        <div className="lg:col-span-5 border border-[var(--border-color)] bg-[var(--card-bg)] rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-xl transition-colors duration-300">
          
          <div className="space-y-6">
            {/* Header Status Chip */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{t('home.welcome')}</span>
            </div>

            {/* Profile Avatar & Name */}
            <div className="flex items-center space-x-4">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-[var(--terminal-header-bg)] border border-[var(--border-color)] p-1 overflow-hidden shadow-md">
                  <img
                    src={userProfile.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${userProfile.fullName}`}
                    alt={userProfile.fullName}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[var(--card-bg)]" title="Connected" />
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-color)] font-sans tracking-tight">
                  {userProfile.fullName}
                </h1>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 flex items-center gap-1.5 font-semibold">
                  <Server className="w-3.5 h-3.5" />
                  <span>{userProfile.title}</span>
                </p>
              </div>
            </div>

            {/* Bio text */}
            <p className="text-xs text-[var(--secondary-color)] font-sans leading-relaxed">
              {userProfile.aboutMe}
            </p>

            {/* Real Data Metrics Bar (Fetched from Database) */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-[var(--terminal-header-bg)] border border-[var(--border-color)]">
                <div className="text-lg font-extrabold text-[var(--text-color)] font-mono flex items-center gap-1.5">
                  <FolderGit2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{totalProjectCount}</span>
                </div>
                <div className="text-[10px] text-[var(--secondary-color)] uppercase tracking-wider font-bold">{t('home.liveMetrics.projects')}</div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--terminal-header-bg)] border border-[var(--border-color)]">
                <div className="text-lg font-extrabold text-[var(--text-color)] font-mono flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>{totalTechCount}</span>
                </div>
                <div className="text-[10px] text-[var(--secondary-color)] uppercase tracking-wider font-bold">{t('home.liveMetrics.stack')}</div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-[var(--border-color)] mt-6">
            <Link
              href="/contact"
              className="flex-1 text-center px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition duration-200 shadow-md active:scale-95 cursor-pointer"
            >
              {t('home.contactBtn')}
            </Link>
            <Link
              href="/projects"
              className="flex items-center justify-center space-x-1 px-4 py-2.5 rounded-xl text-xs font-bold text-[var(--text-color)] bg-[var(--terminal-header-bg)] border border-[var(--border-color)] hover:border-emerald-500/40 transition duration-200 cursor-pointer"
            >
              <span>{t('home.projectsBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 text-emerald-600 dark:text-emerald-400" />
            </Link>
            <a
              href="/cv/PhanDuyKhang_CV.pdf"
              download="PhanDuyKhang_CV.pdf"
              className="p-2.5 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition cursor-pointer"
              title={t('home.downloadCv')}
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right Column: Interactive CLI Terminal (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <TerminalHero />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: FEATURED ENGINEERING PROJECTS (Bento Grid) */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-[var(--text-color)] uppercase tracking-wider">
              {t('projects.title')}
            </h3>
          </div>
          <Link
            href="/projects"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1 transition"
          >
            <span>{locale === 'vi' ? 'Xem tất cả dự án' : 'View All Projects'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {featuredProjects.map((project, index) => {
            const colSpan = index === 0 ? 'md:col-span-7' : index === 1 ? 'md:col-span-5' : 'md:col-span-12';
            
            return (
              <div
                key={project.id}
                className={`${colSpan} border border-[var(--border-color)] bg-[var(--card-bg)] rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition duration-300 shadow-xl group`}
              >
                <div className="space-y-4">
                  {/* Header & Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                        SYSTEM #{project.id}
                      </span>
                      <h4 className="text-lg font-bold text-[var(--text-color)] font-sans group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                        {project.title}
                      </h4>
                    </div>

                    <div className="flex space-x-1.5 shrink-0">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-[var(--terminal-header-bg)] border border-[var(--border-color)] text-[var(--text-color)] hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                          title="GitHub Source"
                        >
                          <GitBranch className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-[var(--terminal-header-bg)] border border-[var(--border-color)] text-[var(--text-color)] hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                          title="Live Demo"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail / Preview */}
                  <Link href={`/projects/${project.slug}`} className="block rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--terminal-header-bg)] h-48 sm:h-56 relative cursor-pointer">
                    <img
                      src={project.thumbnailUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                    />
                  </Link>

                  {/* Problem & Solution Technical Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                    <div className="p-3 rounded-xl bg-[var(--terminal-header-bg)] border border-[var(--border-color)] space-y-1">
                      <div className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                        <Cpu className="w-3 h-3" />
                        <span>{t('projects.problemTitle')}</span>
                      </div>
                      <p className="text-[var(--secondary-color)] text-[11px] line-clamp-2 leading-relaxed">
                        {project.shortDescription}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--terminal-header-bg)] border border-[var(--border-color)] space-y-1">
                      <div className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{t('projects.solutionTitle')}</span>
                      </div>
                      <p className="text-[var(--secondary-color)] text-[11px] line-clamp-2 leading-relaxed">
                        Full-stack architecture using Java Spring Boot REST APIs, PostgreSQL, and decoupled React/Next.js frontend.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tech Stack Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[var(--border-color)]">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 4).map((t) => (
                      <span
                        key={t.id}
                        className="px-2 py-0.5 rounded text-[10px] bg-[var(--terminal-header-bg)] border border-[var(--border-color)] text-[var(--text-color)] font-semibold"
                      >
                        {t.name}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t('projects.detailsBtn')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: TECHNICAL SKILLS & ARCHITECTURE MATRIX (Database Synchronized) */}
      {/* ========================================================================= */}
      <section className="border border-[var(--border-color)] bg-[var(--card-bg)] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl transition-colors duration-300">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-[var(--text-color)] uppercase tracking-wider">
              {t('skills.title')}
            </h3>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded font-bold">
            DATABASE SYNCHRONIZED ({totalTechCount} ITEMS)
          </span>
        </div>

        {/* Real Skills Items from API */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {technologies.map((tech) => (
            <div
              key={tech.id}
              className="p-3 rounded-2xl bg-[var(--terminal-header-bg)] border border-[var(--border-color)] flex items-center space-x-2 hover:border-emerald-500/40 transition duration-200"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-xs font-bold text-[var(--text-color)] font-mono truncate">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: QUICK CONTACT INVITATION */}
      {/* ========================================================================= */}
      <section className="border border-[var(--border-color)] bg-[var(--card-bg)] rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl transition-colors duration-300">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-lg font-bold text-[var(--text-color)] font-sans">
            {locale === 'vi' ? 'Sẵn sàng hợp tác & phát triển hệ thống?' : 'Ready to build high-performance software?'}
          </h3>
          <p className="text-xs text-[var(--secondary-color)] max-w-lg font-sans">
            {locale === 'vi' 
              ? 'Liên hệ trực tiếp để trao đổi về cơ hội làm việc hoặc giải pháp phần mềm Backend & Full-Stack.'
              : 'Reach out directly for backend engineering opportunities, full-stack web solutions, or technical discussions.'}
          </p>
        </div>

        <Link
          href="/contact"
          className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition duration-200 shadow-md shrink-0 cursor-pointer"
        >
          {t('home.contactBtn')}
        </Link>
      </section>

    </div>
  );
}
