'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, RefreshCw, CornerDownLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { apiService } from '@/services/api';
import { Profile, Technology, Project } from '@/types';

interface CommandOutput {
  command: string;
  result: string | React.ReactNode;
}

export const TerminalHero: React.FC = () => {
  const { locale } = useLanguage();
  const [inputVal, setInputVal] = useState('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [techCount, setTechCount] = useState<number>(0);
  const [projectCount, setProjectCount] = useState<number>(0);

  useEffect(() => {
    Promise.all([
      apiService.getProfile().catch(() => null),
      apiService.getTechnologies().catch(() => []),
      apiService.getProjects().catch(() => [])
    ]).then(([prof, techs, projs]) => {
      if (prof) setProfile(prof);
      setTechCount(techs.length);
      setProjectCount(projs.length);
    });
  }, []);

  const name = profile?.fullName || "Phan Duy Khang";
  const title = profile?.title || (locale === 'vi' ? 'Backend / Full-Stack Developer' : 'Backend / Full-Stack Developer');
  const email = profile?.email || 'pdkhang.dev@gmail.com';
  const github = profile?.githubUrl || 'https://github.com/KhangIsTheBest';
  const linkedin = profile?.linkedinUrl || 'https://linkedin.com/in/phanduykhang';

  const [history, setHistory] = useState<CommandOutput[]>([]);

  useEffect(() => {
    setHistory([
      {
        command: 'system --status',
        result: (
          <div className="space-y-1 font-mono text-[11px] leading-relaxed">
            <div className="text-emerald-600 dark:text-emerald-400 font-bold">✔ SYSTEM INITIALIZED: {name} Workstation</div>
            <div className="text-[var(--text-color)]">
              • <span className="text-amber-600 dark:text-amber-400 font-bold">Role:</span> {title}
            </div>
            <div className="text-[var(--text-color)]">
              • <span className="text-emerald-600 dark:text-emerald-400 font-bold">Live API Status:</span> 200 OK (Spring Boot Backend Connected)
            </div>
            <div className="text-[var(--secondary-color)]">
              • <span className="text-sky-600 dark:text-sky-400 font-bold">Registered Stack Items:</span> {techCount || 10} technologies in Database
            </div>
            <div className="text-[var(--secondary-color)]">
              • <span className="text-purple-600 dark:text-purple-400 font-bold">Active Projects:</span> {projectCount || 3} published systems
            </div>
            <div className="text-[var(--secondary-color)] italic pt-1">Type &apos;help&apos; to view CLI commands.</div>
          </div>
        )
      }
    ]);
  }, [profile, techCount, projectCount, locale, name, title]);

  const terminalBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmdStr: string) => {
    const cleanCmd = cmdStr.trim().toLowerCase();
    let resNode: React.ReactNode = null;

    switch (cleanCmd) {
      case 'help':
        resNode = (
          <div className="space-y-1 text-[var(--text-color)] font-mono text-[11px]">
            <div className="font-bold text-[var(--secondary-color)]">Available CLI Commands:</div>
            <div>  <span className="text-emerald-600 dark:text-emerald-400 font-bold">stack</span>       - List tech stack & architecture</div>
            <div>  <span className="text-emerald-600 dark:text-emerald-400 font-bold">projects</span>    - Summary of published systems</div>
            <div>  <span className="text-emerald-600 dark:text-emerald-400 font-bold">contact</span>     - View direct email & socials</div>
            <div>  <span className="text-emerald-600 dark:text-emerald-400 font-bold">cv</span>          - Download engineering resume</div>
            <div>  <span className="text-emerald-600 dark:text-emerald-400 font-bold">clear</span>       - Clear terminal window</div>
          </div>
        );
        break;

      case 'stack':
        resNode = (
          <div className="space-y-1 text-[var(--text-color)] font-mono text-[11px]">
            <div className="text-amber-600 dark:text-amber-400 font-bold">[Backend Core]</div>
            <div>Java 17+, Spring Boot 3, Spring Security, JWT, Hibernate/JPA, REST APIs</div>
            <div className="text-emerald-600 dark:text-emerald-400 font-bold mt-2">[Database & Tools]</div>
            <div>PostgreSQL, Docker, Docker Compose, Redis, Maven, Cloudinary</div>
            <div className="text-sky-600 dark:text-sky-400 font-bold mt-2">[Frontend Architecture]</div>
            <div>TypeScript, React 19, Next.js 16 (App Router), Tailwind CSS</div>
          </div>
        );
        break;

      case 'projects':
        resNode = (
          <div className="space-y-1.5 text-[var(--text-color)] font-mono text-[11px]">
            <div><span className="text-emerald-600 dark:text-emerald-400 font-bold">1. Portfolio CLI & REST Platform:</span> Spring Boot 3 API + Next.js client.</div>
            <div><span className="text-emerald-600 dark:text-emerald-400 font-bold">2. E-Commerce Backend System:</span> Microservice store platform with JWT & OAuth2.</div>
            <div><span className="text-emerald-600 dark:text-emerald-400 font-bold">3. Admin Management Portal:</span> Role-based management dashboard.</div>
          </div>
        );
        break;

      case 'contact':
        resNode = (
          <div className="space-y-1 text-[var(--text-color)] font-mono text-[11px]">
            <div><span className="text-[var(--secondary-color)]">Email:</span> <a href={`mailto:${email}`} className="text-emerald-600 dark:text-emerald-400 underline font-bold">{email}</a></div>
            <div><span className="text-[var(--secondary-color)]">GitHub:</span> <a href={github} target="_blank" rel="noreferrer" className="text-sky-600 dark:text-sky-400 underline font-bold">{github}</a></div>
            <div><span className="text-[var(--secondary-color)]">LinkedIn:</span> <a href={linkedin} target="_blank" rel="noreferrer" className="text-amber-600 dark:text-amber-400 underline font-bold">{linkedin}</a></div>
          </div>
        );
        break;

      case 'cv':
        resNode = (
          <div className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
            ✔ Triggering Resume Download... <a href="/cv/PhanDuyKhang_CV.pdf" download className="underline font-bold text-[var(--text-color)]">Click here if download doesn&apos;t start.</a>
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        return;

      default:
        resNode = (
          <div className="text-rose-600 dark:text-rose-400 font-mono text-[11px]">
            Command not recognized: &apos;{cleanCmd}&apos;. Type &apos;<span className="underline font-bold">help</span>&apos; for list of commands.
          </div>
        );
    }

    setHistory((prev) => [...prev, { command: cmdStr, result: resNode }]);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    handleCommand(inputVal);
    setInputVal('');
  };

  return (
    <div className="w-full rounded-3xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-xl overflow-hidden font-mono select-text flex flex-col h-full min-h-[380px] transition-colors duration-300">
      {/* Header bar */}
      <div className="px-4 py-3 bg-[var(--terminal-header-bg)] border-b border-[var(--border-color)] flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="w-4 h-4 object-contain" />
            <span className="font-bold text-slate-300 dark:text-slate-300 font-mono text-[11px]">
              khang@dev-workstation: ~
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[10px]">
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
            BASH 5.2
          </span>
          <button
            onClick={() => setHistory([])}
            className="p-1 text-[var(--secondary-color)] hover:text-[var(--text-color)] transition cursor-pointer"
            title="Clear terminal"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Terminal Body - Expands to fill available vertical space */}
      <div ref={terminalBodyRef} className="p-4 flex-1 overflow-y-auto space-y-3 text-xs scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/10">
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center space-x-2 text-[var(--secondary-color)]">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">visitor@pdkhang:~$</span>
              <span className="text-[var(--text-color)] font-semibold">{item.command}</span>
            </div>
            <div className="pl-4 border-l border-[var(--border-color)]">{item.result}</div>
          </div>
        ))}

        {/* Form input line */}
        <form onSubmit={onSubmit} className="flex items-center space-x-2 pt-1">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">visitor@pdkhang:~$</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="type 'help', 'stack', 'projects'..."
            className="flex-1 bg-transparent text-[var(--text-color)] outline-none text-xs font-mono placeholder:text-[var(--secondary-color)]"
          />
          <button type="submit" className="text-[var(--secondary-color)] hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer">
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Quick Command Chips */}
      <div className="px-4 py-2.5 bg-[var(--terminal-header-bg)] border-t border-[var(--border-color)] flex items-center gap-1.5 overflow-x-auto shrink-0 text-[10px]">
        <span className="text-[var(--secondary-color)] uppercase text-[9px] tracking-wider shrink-0 font-bold">Quick CLI:</span>
        {['help', 'stack', 'projects', 'contact', 'cv'].map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => handleCommand(cmd)}
            className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/[0.04] border border-[var(--border-color)] hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400 text-[var(--text-color)] transition shrink-0 cursor-pointer"
          >
            ${cmd}
          </button>
        ))}
      </div>
    </div>
  );
};
