'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Download, 
  Code2, 
  Server, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  FolderGit2, 
  Sparkles, 
  GitBranch, 
  ExternalLink,
  Terminal as TerminalIcon,
  CheckCircle2,
  Activity,
  Award,
  BookOpen
} from 'lucide-react';
import { apiService, formatImageUrl } from '@/services/api';
import { Profile, Project, Technology } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useServerStatus } from '@/context/ServerStatusContext';
import { FormattedContent } from '@/components/FormattedContent';
import { TerminalHero } from '@/components/TerminalHero';
import { SpotlightCard } from '@/components/SpotlightCard';

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop';

export default function Home() {
  const { locale, t } = useLanguage();
  const { isOnline } = useServerStatus();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [selectedTechCategory, setSelectedTechCategory] = useState<string>('ALL');
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
      ? 'Kỹ sư Phần mềm đam mê thiết kế kiến trúc Backend hiệu năng cao (Java Spring Boot, PostgreSQL, Redis) kết hợp giao diện Web hiện đại (Next.js, TypeScript). Tập trung vào Clean Architecture và tối ưu hóa hệ thống.'
      : 'Software Engineer specializing in high-performance Backend architecture (Java Spring Boot, PostgreSQL, Redis) and modern Web applications (Next.js, TypeScript). Focused on Clean Architecture and system resilience.',
    email: 'pdkhang1304@gmail.com',
    githubUrl: 'https://github.com/KhangIsTheBest',
    linkedinUrl: 'https://linkedin.com/in/phanduykhang',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=PhanDuyKhang',
    cvViUrl: '',
    cvEnUrl: '',
    updatedAt: new Date().toISOString()
  };

  const cvDownloadUrl = userProfile.cvViUrl || userProfile.cvEnUrl || '/cv/PhanDuyKhang_CV.pdf';

  const getTechBadgeStyle = (idx: number) => {
    const styles = [
      'bg-[var(--primary-bg)] text-[var(--primary-color)] border-[var(--primary-border)]',
      'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30',
      'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
      'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
    ];
    return styles[idx % styles.length];
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] text-[var(--primary-color)] font-mono space-y-4">
        <div className="w-10 h-10 border-2 border-[var(--primary-border)] border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-xs tracking-wider animate-pulse font-bold">INITIALIZING SWE WORKSTATION...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-12 my-6 font-mono select-text"
    >
      
      {/* ========================================================================= */}
      {/* SECTION 1: HERO BENTO GRID (Identity Card + Interactive Terminal CLI) */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Developer Identity Bento Card (5 cols) */}
        <SpotlightCard className="lg:col-span-5 flex flex-col justify-between" spotlightColor="rgba(99, 102, 241, 0.18)">
          <div className="space-y-6">
            {/* Header Status Chip */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-emerald-500/15 via-sky-500/15 to-indigo-500/15 border border-[var(--primary-border)] text-[var(--primary-color)] shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[var(--primary-color)]" />
                <span>{t('home.welcome')}</span>
              </div>
              <span className="flex items-center gap-1.5 text-[9px] font-bold text-[var(--primary-color)] bg-[var(--primary-bg)] px-2.5 py-1 rounded-full border border-[var(--primary-border)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-color)] animate-pulse" />
                AVAILABLE
              </span>
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
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[var(--primary-color)] border-2 border-[var(--card-bg)]" title="Connected" />
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-color)] font-sans tracking-tight">
                  {userProfile.fullName}
                </h1>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono mt-0.5 flex items-center gap-1.5 font-bold">
                  <Server className="w-3.5 h-3.5 text-[var(--primary-color)]" />
                  <span>{userProfile.title}</span>
                </p>
              </div>
            </div>

            {/* Bio text */}
            <FormattedContent content={userProfile.aboutMe} className="text-xs text-[var(--secondary-color)] font-sans leading-relaxed select-text markdown-body" />

            {/* Real Data Metrics Bar */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-[var(--terminal-header-bg)] border border-[var(--border-color)] hover:border-[var(--primary-border)] transition">
                <div className="text-xl font-extrabold text-[var(--primary-color)] font-mono flex items-center gap-1.5">
                  <FolderGit2 className="w-4.5 h-4.5" />
                  <span>{totalProjectCount}</span>
                </div>
                <div className="text-[10px] text-[var(--secondary-color)] uppercase tracking-wider font-bold mt-0.5">{t('home.liveMetrics.projects')}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--terminal-header-bg)] border border-[var(--border-color)] hover:border-sky-500/30 transition">
                <div className="text-xl font-extrabold text-sky-600 dark:text-sky-400 font-mono flex items-center gap-1.5">
                  <Cpu className="w-4.5 h-4.5" />
                  <span>{totalTechCount}</span>
                </div>
                <div className="text-[10px] text-[var(--secondary-color)] uppercase tracking-wider font-bold mt-0.5">{t('home.liveMetrics.stack')}</div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-[var(--border-color)] mt-6">
            <Link
              href="/contact"
              className="flex-1 text-center px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition duration-200 shadow-md active:scale-95 cursor-pointer"
            >
              {t('home.contactBtn')}
            </Link>
            <Link
              href="/projects"
              className="flex items-center justify-center space-x-1 px-4 py-2.5 rounded-xl text-xs font-bold text-[var(--text-color)] bg-[var(--terminal-header-bg)] border border-[var(--border-color)] hover:border-[var(--primary-border)] transition duration-200 cursor-pointer"
            >
              <span>{t('home.projectsBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 text-[var(--primary-color)]" />
            </Link>
            <a
              href={cvDownloadUrl}
              download="PhanDuyKhang_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 transition cursor-pointer"
              title={t('home.downloadCv')}
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        </SpotlightCard>

        {/* Right Column: Interactive CLI Terminal (7 cols) */}
        <div className="lg:col-span-7 flex flex-col h-full">
          <TerminalHero />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: FEATURED ENGINEERING PROJECTS (Bento Grid) */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-[var(--primary-color)]" />
            <h3 className="text-base font-bold text-[var(--text-color)] uppercase tracking-wider">
              {t('projects.title')}
            </h3>
          </div>
          <Link
            href="/projects"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1 transition"
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
              <SpotlightCard
                key={project.id}
                className={`${colSpan} flex flex-col justify-between space-y-4 hover:border-[var(--primary-border)] group`}
                spotlightColor="rgba(99, 102, 241, 0.15)"
              >
                <div className="space-y-4">
                  {/* Header & Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] font-bold text-[var(--primary-color)] bg-[var(--primary-bg)] px-2.5 py-0.5 rounded border border-[var(--primary-border)] font-mono">
                          SYSTEM #{project.id}
                        </span>
                        {project.featured && (
                          <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20 font-mono">
                            {t('projects.featuredLabel')}
                          </span>
                        )}
                      </div>
                      <Link href={`/projects/${project.slug}`} className="block">
                        <h4 className="text-lg font-bold text-[var(--text-color)] font-sans group-hover:text-[var(--primary-color)] dark:group-hover:text-[var(--primary-color)] transition cursor-pointer">
                          {project.title}
                        </h4>
                      </Link>
                    </div>

                    <div className="flex space-x-1.5 shrink-0">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 transition"
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
                          className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition"
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
                      src={formatImageUrl(project.thumbnailUrl)}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                      }}
                    />
                  </Link>

                  {/* Problem & Solution Technical Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                    <div className="p-3.5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-1">
                      <div className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        <span>{t('projects.problemTitle')}</span>
                      </div>
                      <p className="text-[var(--secondary-color)] text-[11px] line-clamp-2 leading-relaxed">
                        {project.shortDescription}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[var(--primary-bg)] dark:bg-[var(--primary-bg)] border border-[var(--primary-border)] space-y-1">
                      <div className="text-[10px] font-mono font-bold text-[var(--primary-color)] uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-[var(--primary-color)]" />
                        <span>{t('projects.solutionTitle')}</span>
                      </div>
                      <p className="text-[var(--secondary-color)] text-[11px] line-clamp-2 leading-relaxed">
                        {project.technologies && project.technologies.length > 0
                          ? (locale === 'vi'
                              ? `Kiến trúc RESTful API module hóa với ${project.technologies.map(t => t.name).join(', ')}, hiệu năng cao và phân tầng rõ ràng.`
                              : `Modular high-concurrency architecture engineered with ${project.technologies.map(t => t.name).join(', ')}.`)
                          : project.shortDescription}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tech Stack Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[var(--border-color)]">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 4).map((t, idx) => (
                      <span
                        key={t.id}
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] border font-semibold font-mono ${getTechBadgeStyle(idx)}`}
                      >
                        {t.name}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-xs font-bold text-[var(--primary-color)] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t('projects.detailsBtn')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: TECHNICAL SKILLS MATRIX (Filterable & Interactive) */}
      {/* ========================================================================= */}
      <SpotlightCard className="space-y-6" spotlightColor="rgba(6, 182, 212, 0.15)">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-[var(--text-color)] uppercase tracking-wider">
              {t('skills.title')}
            </h3>
          </div>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full font-bold font-mono">
            {totalTechCount} REGISTERED STACK NODES
          </span>
        </div>

        {/* Real Skills Items with Interactive Hover Glow */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {technologies.map((tech, idx) => (
            <div
              key={tech.id}
              className={`p-3.5 rounded-2xl border flex items-center space-x-2.5 hover:scale-103 transition duration-200 cursor-pointer ${getTechBadgeStyle(idx)}`}
            >
              <div className="w-2 h-2 rounded-full bg-current shrink-0" />
              <span className="text-xs font-bold font-mono truncate">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </SpotlightCard>

      {/* ========================================================================= */}
      {/* SECTION 4: PROOF OF WORK & ENGINEERING PRINCIPLES */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SpotlightCard className="space-y-3" spotlightColor="rgba(99, 102, 241, 0.15)">
          <div className="flex items-center space-x-2 text-[var(--primary-color)]">
            <ShieldCheck className="w-5 h-5" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-color)]">
              {locale === 'vi' ? 'Kiến Trúc Chuẩn Mực' : 'Clean Architecture'}
            </h4>
          </div>
          <p className="text-xs text-[var(--secondary-color)] font-sans leading-relaxed">
            {locale === 'vi'
              ? 'Tổ chức mã nguồn theo mô hình phân tầng (Controller, Service, Repository, DTO, Mapper), áp dụng nguyên lý SOLID và Design Patterns.'
              : 'Multi-layered architecture with Controller, Service, Repository, DTO, Mapper layers following SOLID principles and design patterns.'}
          </p>
        </SpotlightCard>

        <SpotlightCard className="space-y-3" spotlightColor="rgba(99, 102, 241, 0.15)">
          <div className="flex items-center space-x-2 text-indigo-500">
            <Activity className="w-5 h-5" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-color)]">
              {locale === 'vi' ? 'Hiệu Năng & Khả Năng Mở Rộng' : 'High Performance & Scale'}
            </h4>
          </div>
          <p className="text-xs text-[var(--secondary-color)] font-sans leading-relaxed">
            {locale === 'vi'
              ? 'Tối ưu hóa truy vấn PostgreSQL với Flyway B-Tree indexes, bộ đệm Redis in-memory cache và giới hạn tần suất phân tán (Distributed Rate Limiting).'
              : 'Optimized PostgreSQL indexing via Flyway, low-latency Redis caching, and atomic token-bucket distributed rate limiting.'}
          </p>
        </SpotlightCard>

        <SpotlightCard className="space-y-3" spotlightColor="rgba(245, 158, 11, 0.15)">
          <div className="flex items-center space-x-2 text-amber-500">
            <Award className="w-5 h-5" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-color)]">
              {locale === 'vi' ? 'Tự Động Hóa & Kiểm Thử' : 'DevOps & E2E Testing'}
            </h4>
          </div>
          <p className="text-xs text-[var(--secondary-color)] font-sans leading-relaxed">
            {locale === 'vi'
              ? 'Pipeline GitHub Actions CI/CD kết hợp kiểm thử Testcontainers (Real Postgres & Redis) và kiểm thử giao diện E2E tự động với Playwright MCP.'
              : 'Automated CI/CD with Testcontainers integration testing and Playwright MCP end-to-end user experience validation.'}
          </p>
        </SpotlightCard>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 5: QUICK CONTACT INVITATION */}
      {/* ========================================================================= */}
      <SpotlightCard className="bg-gradient-to-r from-emerald-500/10 via-[var(--card-bg)] to-indigo-500/10 flex flex-col sm:flex-row items-center justify-between gap-6" spotlightColor="rgba(16, 185, 129, 0.25)">
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
          className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 transition duration-200 shadow-md shrink-0 cursor-pointer active:scale-95"
        >
          {t('home.contactBtn')}
        </Link>
      </SpotlightCard>

    </motion.div>
  );
}
