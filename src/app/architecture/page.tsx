'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Server, Database, Shield, Zap, Layers, Cpu, CheckCircle2, 
  ExternalLink, GitBranch, Lock, Activity, FileCode, Network, RefreshCw, Sparkles
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { SpotlightCard } from '@/components/SpotlightCard';

export default function ArchitecturePage() {
  const { locale, t } = useLanguage();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-12 font-mono max-w-6xl mx-auto pb-16 select-text"
    >
      
      {/* Hero Header */}
      <SpotlightCard className="p-8 md:p-12 space-y-4" spotlightColor="rgba(99, 102, 241, 0.18)">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[var(--primary-bg)] border border-[var(--primary-border)] text-[var(--primary-color)] text-xs font-bold">
            <Cpu className="w-3.5 h-3.5" />
            <span>ENTERPRISE BACKEND ARCHITECTURE</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--text-color)] font-sans">
            {locale === 'vi' ? 'Kiến trúc Hệ thống & Kỹ thuật' : 'System Architecture & Engineering'}
          </h1>
          
          <p className="text-sm md:text-base text-[var(--secondary-color)] max-w-3xl leading-relaxed font-sans">
            {locale === 'vi'
              ? 'Phân tích chi tiết kiến trúc Decoupled Micro/Full-stack, cơ chế Caching Redis, Bảo mật JWT + OAuth2, Database Migration Flyway, Distributed Rate Limiting và hạ tầng Container hóa chuẩn Production.'
              : 'In-depth architectural breakdown of decoupled full-stack services, Redis caching, JWT + OAuth2 security, Flyway database migrations, distributed rate limiting, and containerized deployment.'}
          </p>

          {/* Quick Action Badges */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <a
              href={`${backendUrl}/swagger-ui.html`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs hover:from-emerald-500 hover:to-teal-500 transition shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
            >
              <FileCode className="w-4 h-4" />
              <span>Swagger API Docs (Live)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={`${backendUrl}/actuator/health`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[var(--terminal-header-bg)] border border-[var(--border-color)] text-[var(--text-color)] font-bold text-xs hover:border-[var(--primary-border)] transition cursor-pointer"
            >
              <Activity className="w-4 h-4 text-[var(--primary-color)]" />
              <span>Actuator Health Check</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </SpotlightCard>

      {/* System Topology (C4 Model Representation) */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3">
          <Layers className="w-6 h-6 text-[var(--primary-color)]" />
          <h2 className="text-xl md:text-2xl font-bold text-[var(--text-color)] font-sans">
            {locale === 'vi' ? '1. Sơ đồ Phân tầng Hệ thống (Multi-Tier Topology)' : '1. Multi-Tier System Topology'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tier 1: Client & Edge */}
          <SpotlightCard className="space-y-4" spotlightColor="rgba(6, 182, 212, 0.15)">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-cyan-500 tracking-wider font-mono">TIER 1: CLIENT & EDGE</span>
              <h3 className="text-base font-bold text-[var(--text-color)] font-sans">Next.js 16 App Router</h3>
            </div>
            <ul className="text-xs text-[var(--secondary-color)] space-y-2 font-sans">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary-color)] shrink-0 mt-0.5" />
                <span>Server-Side Rendering (SSR) & Streaming UI</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary-color)] shrink-0 mt-0.5" />
                <span>Next.js API Route Proxy (`/api/v1/*`)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary-color)] shrink-0 mt-0.5" />
                <span>Offline Resilience với Client-side Mock Fallback</span>
              </li>
            </ul>
          </SpotlightCard>

          {/* Tier 2: Core API Server */}
          <SpotlightCard className="space-y-4" spotlightColor="rgba(99, 102, 241, 0.15)">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary-bg)] border border-[var(--primary-border)] flex items-center justify-center text-[var(--primary-color)]">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[var(--primary-color)] tracking-wider font-mono">TIER 2: API ENGINE</span>
              <h3 className="text-base font-bold text-[var(--text-color)] font-sans">Java 21 + Spring Boot 3</h3>
            </div>
            <ul className="text-xs text-[var(--secondary-color)] space-y-2 font-sans">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary-color)] shrink-0 mt-0.5" />
                <span>Spring Security 6 Stateless Authentication</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary-color)] shrink-0 mt-0.5" />
                <span>RESTful Architecture & Global Exception Advice</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary-color)] shrink-0 mt-0.5" />
                <span>Spring Data JPA & Dynamic Storage Strategy</span>
              </li>
            </ul>
          </SpotlightCard>

          {/* Tier 3: Data & Infrastructure */}
          <SpotlightCard className="space-y-4" spotlightColor="rgba(99, 102, 241, 0.15)">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-indigo-500">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-indigo-500 tracking-wider font-mono">TIER 3: PERSISTENCE & CACHE</span>
              <h3 className="text-base font-bold text-[var(--text-color)] font-sans">PostgreSQL, Redis & MinIO</h3>
            </div>
            <ul className="text-xs text-[var(--secondary-color)] space-y-2 font-sans">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary-color)] shrink-0 mt-0.5" />
                <span>PostgreSQL 16 ACID Database với Flyway Migrations</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary-color)] shrink-0 mt-0.5" />
                <span>Redis 7 In-Memory Cache & Distributed Rate Limiter</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary-color)] shrink-0 mt-0.5" />
                <span>MinIO S3 Compatible Object Storage</span>
              </li>
            </ul>
          </SpotlightCard>
        </div>
      </section>

      {/* Engineering Highlights Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Security & Authentication */}
        <SpotlightCard className="space-y-4" spotlightColor="rgba(99, 102, 241, 0.15)">
          <div className="flex items-center space-x-3">
            <Lock className="w-5 h-5 text-[var(--primary-color)]" />
            <h3 className="text-lg font-bold text-[var(--text-color)] font-sans">
              {locale === 'vi' ? 'Bảo mật & Luồng Xác thực (Auth Pipeline)' : 'Security & Auth Pipeline'}
            </h3>
          </div>
          <p className="text-xs text-[var(--secondary-color)] font-sans leading-relaxed">
            {locale === 'vi'
              ? 'Hệ thống hỗ trợ xác thực kép: Form login truyền thống mã hóa BCrypt và Google OAuth2 ID Token Verification. Token JWT được ký HMAC-SHA256, đính kèm Role claims để bảo vệ các endpoints nhạy cảm.'
              : 'Dual-mode authentication: Traditional BCrypt password hashing and Google OAuth2 ID Token verification. JWT tokens signed with HMAC-SHA256 with role claims protect privileged endpoints.'}
          </p>
          <div className="bg-[var(--terminal-header-bg)] p-4 rounded-xl border border-[var(--border-color)] text-[11px] text-[var(--text-color)] font-mono space-y-1">
            <div className="text-[var(--primary-color)] font-bold">Flow: [Client] → Google / Form → [Backend Auth Controller]</div>
            <div>↳ Verify Google ID Token (GoogleHttpClient) / BCrypt verify</div>
            <div>↳ Generate JWT Claims (Subject, Role, Expiration)</div>
            <div>↳ Stateless Request Filtering via `JwtAuthenticationFilter`</div>
          </div>
        </SpotlightCard>

        {/* Caching & Distributed Rate Limiting */}
        <SpotlightCard className="space-y-4" spotlightColor="rgba(245, 158, 11, 0.15)">
          <div className="flex items-center space-x-3">
            <Zap className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-[var(--text-color)] font-sans">
              {locale === 'vi' ? 'Redis Caching & Rate Limiting' : 'Redis Caching & Rate Limiting'}
            </h3>
          </div>
          <p className="text-xs text-[var(--secondary-color)] font-sans leading-relaxed">
            {locale === 'vi'
              ? 'Tối ưu độ trễ đọc dữ liệu với Spring Cache (`@Cacheable`) và bảo đảm tính nhất quán với `@CacheEvict`. Áp dụng thuật toán Redis Atomic Token Bucket để chặn spam form liên hệ theo IP.'
              : 'Optimized read latency via Spring Cache (`@Cacheable`) with cache eviction consistency (`@CacheEvict`). Redis Atomic Token Bucket prevents DDoS and spam on contact endpoints.'}
          </p>
          <div className="bg-[var(--terminal-header-bg)] p-4 rounded-xl border border-[var(--border-color)] text-[11px] text-[var(--text-color)] font-mono space-y-1">
            <div className="text-amber-500 font-bold">Redis Keys & Strategy:</div>
            <div>• Cache Keys: project::{'{slug}'}, profile::default (TTL: 10m)</div>
            <div>• Rate Limit Key: rate_limit:contact::{'{client_ip}'} (Limit: 5 req/min)</div>
            <div>• Atomic Operations: INCR + EXPIRE with fail-safe fallback</div>
          </div>
        </SpotlightCard>

        {/* Database Reliability & Flyway */}
        <SpotlightCard className="space-y-4" spotlightColor="rgba(6, 182, 212, 0.15)">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-5 h-5 text-cyan-500" />
            <h3 className="text-lg font-bold text-[var(--text-color)] font-sans">
              {locale === 'vi' ? 'Quản lý Dữ liệu & Flyway Migration' : 'Database Reliability & Flyway'}
            </h3>
          </div>
          <p className="text-xs text-[var(--secondary-color)] font-sans leading-relaxed">
            {locale === 'vi'
              ? 'Loại bỏ hoàn toàn rủi ro của `ddl-auto=update` bằng Flyway Migration version control. Đánh chỉ mục B-tree tối ưu cho các trường tìm kiếm và slug.'
              : 'Eliminated schema drift and production risk by adopting Flyway version-controlled migrations. Indexed search fields and slugs with PostgreSQL B-tree indexes.'}
          </p>
          <div className="bg-[var(--terminal-header-bg)] p-4 rounded-xl border border-[var(--border-color)] text-[11px] text-[var(--text-color)] font-mono space-y-1">
            <div className="text-cyan-500 font-bold">Migration Scripts:</div>
            <div>• `V1__init_schema.sql`: DDL Tables, Constraints & B-Tree Indexes</div>
            <div>• `V2__seed_initial_data.sql`: Seed data for profiles & core skills</div>
            <div>• `V4__add_cv_urls_to_profile.sql`: Dual-language CV columns</div>
            <div>• Hibernate Mode: `spring.jpa.hibernate.ddl-auto=validate`</div>
          </div>
        </SpotlightCard>

        {/* DevOps, Testing & CI/CD */}
        <SpotlightCard className="space-y-4" spotlightColor="rgba(244, 63, 94, 0.15)">
          <div className="flex items-center space-x-3">
            <GitBranch className="w-5 h-5 text-rose-500" />
            <h3 className="text-lg font-bold text-[var(--text-color)] font-sans">
              {locale === 'vi' ? 'Testing, CI/CD & Testcontainers' : 'Testing, CI/CD & Testcontainers'}
            </h3>
          </div>
          <p className="text-xs text-[var(--secondary-color)] font-sans leading-relaxed">
            {locale === 'vi'
              ? 'Kiểm thử tích hợp tự động (Integration Testing) chạy trên PostgreSQL và Redis Container thật thông qua Testcontainers. Pipeline GitHub Actions tự động kiểm thử và build Docker image.'
              : 'Automated integration test suite running on real PostgreSQL and Redis containers via Testcontainers. GitHub Actions pipeline validates builds, runs tests, and ensures zero broken code.'}
          </p>
          <div className="bg-[var(--terminal-header-bg)] p-4 rounded-xl border border-[var(--border-color)] text-[11px] text-[var(--text-color)] font-mono space-y-1">
            <div className="text-rose-500 font-bold">Quality Pipeline:</div>
            <div>• Unit Tests: JUnit 5, Mockito for Business Services</div>
            <div>• Integration Tests: Testcontainers + PostgreSQL 16 + Redis</div>
            <div>• Automation: GitHub Actions CI with Docker Multi-Stage Builds</div>
          </div>
        </SpotlightCard>

      </section>

    </motion.div>
  );
}
