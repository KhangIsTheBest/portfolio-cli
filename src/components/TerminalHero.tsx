'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, RefreshCw, CornerDownLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface CommandOutput {
  command: string;
  result: string | React.ReactNode;
}

export const TerminalHero: React.FC = () => {
  const { locale } = useLanguage();
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      command: 'system --status',
      result: (
        <div className="space-y-1 font-mono text-[11px] leading-relaxed">
          <div className="text-emerald-400 font-bold">✔ SYSTEM INITIALIZED: Phan Duy Khang Workstation</div>
          <div className="text-slate-300">
            • <span className="text-amber-400">Role:</span> Backend & Full-Stack Engineer
          </div>
          <div className="text-slate-300">
            • <span className="text-emerald-400">Core Stack:</span> Java Spring Boot, React, Next.js, PostgreSQL, Docker
          </div>
          <div className="text-slate-300">
            • <span className="text-sky-400">REST API Status:</span> 200 OK (Spring Boot Backend Live)
          </div>
          <div className="text-slate-400 italic">Type &apos;help&apos; to view available CLI commands.</div>
        </div>
      )
    }
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmdStr: string) => {
    const cleanCmd = cmdStr.trim().toLowerCase();
    let resNode: React.ReactNode = null;

    switch (cleanCmd) {
      case 'help':
        resNode = (
          <div className="space-y-1 text-slate-300 font-mono text-[11px]">
            <div>Available System Commands:</div>
            <div>  <span className="text-emerald-400 font-bold">stack</span>       - List detailed tech stack & architecture</div>
            <div>  <span className="text-emerald-400 font-bold">projects</span>    - Display summary of featured systems</div>
            <div>  <span className="text-emerald-400 font-bold">contact</span>     - View direct email & social links</div>
            <div>  <span className="text-emerald-400 font-bold">cv</span>          - Download engineering resume</div>
            <div>  <span className="text-emerald-400 font-bold">clear</span>       - Clear CLI terminal history</div>
          </div>
        );
        break;

      case 'stack':
        resNode = (
          <div className="space-y-1 text-slate-300 font-mono text-[11px]">
            <div className="text-amber-400 font-bold">[Backend Engineering]</div>
            <div>Java 17+, Spring Boot 3, Spring Security, JWT, Hibernate/JPA, RESTful APIs</div>
            <div className="text-emerald-400 font-bold mt-2">[Database & Infrastructure]</div>
            <div>PostgreSQL, Docker, Docker Compose, Redis, Maven, Cloudinary</div>
            <div className="text-sky-400 font-bold mt-2">[Frontend Architecture]</div>
            <div>TypeScript, React 19, Next.js 16 (App Router), Tailwind CSS, GFM Markdown</div>
          </div>
        );
        break;

      case 'projects':
        resNode = (
          <div className="space-y-1.5 text-slate-300 font-mono text-[11px]">
            <div><span className="text-emerald-400 font-bold">1. Portfolio CLI & REST Service:</span> Full-stack portfolio platform with Spring Boot API + Next.js client.</div>
            <div><span className="text-emerald-400 font-bold">2. E-Commerce Microservice:</span> Scalable store system with OAuth2 & Payment integrations.</div>
            <div><span className="text-emerald-400 font-bold">3. System Monitor & Auth Portal:</span> Role-based administrative dashboard and JWT auth flow.</div>
          </div>
        );
        break;

      case 'contact':
        resNode = (
          <div className="space-y-1 text-slate-300 font-mono text-[11px]">
            <div><span className="text-slate-400">Email:</span> <a href="mailto:pdkhang.dev@gmail.com" className="text-emerald-400 underline">pdkhang.dev@gmail.com</a></div>
            <div><span className="text-slate-400">GitHub:</span> <a href="https://github.com/KhangIsTheBest" target="_blank" rel="noreferrer" className="text-sky-400 underline">github.com/KhangIsTheBest</a></div>
            <div><span className="text-slate-400">LinkedIn:</span> <a href="https://linkedin.com/in/phanduykhang" target="_blank" rel="noreferrer" className="text-amber-400 underline">linkedin.com/in/phanduykhang</a></div>
          </div>
        );
        break;

      case 'cv':
        resNode = (
          <div className="text-emerald-400 font-mono text-[11px]">
            ✔ Triggering Resume Download... <a href="/cv/PhanDuyKhang_CV.pdf" download className="underline font-bold text-white">Click here if download doesn&apos;t start.</a>
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        return;

      default:
        resNode = (
          <div className="text-rose-400 font-mono text-[11px]">
            Command not recognized: &apos;{cleanCmd}&apos;. Type &apos;<span className="underline">help</span>&apos; for list of commands.
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
    <div className="w-full rounded-2xl border border-white/[0.08] bg-[#0d0f17] shadow-2xl overflow-hidden font-mono select-text flex flex-col h-[340px]">
      {/* Header bar */}
      <div className="px-4 py-2.5 bg-[#141722] border-b border-white/[0.06] flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 ml-2">
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>khang@dev-workstation: ~</span>
          </span>
        </div>

        <div className="flex items-center space-x-2 text-[10px] text-slate-400">
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
            BASH 5.2
          </span>
          <button
            onClick={() => setHistory([])}
            className="p-1 hover:text-white transition cursor-pointer"
            title="Clear terminal"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 flex-1 overflow-y-auto space-y-3 text-xs scrollbar-thin scrollbar-thumb-white/10">
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center space-x-2 text-slate-400">
              <span className="text-emerald-400 font-bold">visitor@pdkhang:~$</span>
              <span className="text-slate-100 font-semibold">{item.command}</span>
            </div>
            <div className="pl-4 border-l border-white/[0.08]">{item.result}</div>
          </div>
        ))}

        {/* Form input line */}
        <form onSubmit={onSubmit} className="flex items-center space-x-2 pt-1">
          <span className="text-emerald-400 font-bold shrink-0">visitor@pdkhang:~$</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="type 'help', 'stack', 'projects'..."
            className="flex-1 bg-transparent text-slate-100 outline-none text-xs font-mono placeholder:text-slate-600"
          />
          <button type="submit" className="text-slate-400 hover:text-emerald-400 transition cursor-pointer">
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
        <div ref={bottomRef} />
      </div>

      {/* Quick Command Chips */}
      <div className="px-4 py-2 bg-[#10121b] border-t border-white/[0.05] flex items-center gap-1.5 overflow-x-auto shrink-0 text-[10px]">
        <span className="text-slate-500 uppercase text-[9px] tracking-wider shrink-0">Quick CLI:</span>
        {['help', 'stack', 'projects', 'contact', 'cv'].map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => handleCommand(cmd)}
            className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] hover:border-emerald-500/40 hover:text-emerald-400 text-slate-300 transition shrink-0 cursor-pointer"
          >
            ${cmd}
          </button>
        ))}
      </div>
    </div>
  );
};
