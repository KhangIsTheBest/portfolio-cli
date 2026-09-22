'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FileText, Copy, Check, Terminal, Eye, Code } from 'lucide-react';

interface GitHubMarkdownViewProps {
  content: string;
  filename?: string;
  className?: string;
}

export const GitHubMarkdownView: React.FC<GitHubMarkdownViewProps> = ({
  content,
  filename = 'README.md',
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'raw'>('preview');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-xl overflow-hidden font-sans ${className}`}>
      {/* GitHub-style File Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--terminal-header-bg)] border-b border-[var(--border-color)] font-mono text-xs">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[var(--primary-color)]" />
          <span className="font-bold text-[var(--text-color)]">{filename}</span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-[var(--primary-bg)] text-[var(--primary-color)] border border-[var(--primary-border)] font-bold">
            GitHub Flavored Markdown
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-[var(--primary-bg)] text-[var(--primary-color)] shadow-sm'
                  : 'text-[var(--secondary-color)] hover:text-[var(--text-color)]'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('raw')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                activeTab === 'raw'
                  ? 'bg-[var(--primary-bg)] text-[var(--primary-color)] shadow-sm'
                  : 'text-[var(--secondary-color)] hover:text-[var(--text-color)]'
              }`}
            >
              <Code className="w-3 h-3" />
              <span>Raw</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-[var(--card-bg)] hover:bg-[var(--primary-bg)] border border-[var(--border-color)] hover:border-[var(--primary-border)] text-[var(--secondary-color)] hover:text-[var(--primary-color)] rounded-lg text-[11px] font-bold transition cursor-pointer"
            title="Copy Raw Markdown"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 sm:p-8 select-text">
        {activeTab === 'preview' ? (
          <div className="prose prose-invert max-w-none space-y-4 text-[var(--text-color)] leading-relaxed text-sm sm:text-base">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-2xl sm:text-3xl font-extrabold pb-3 border-b border-[var(--border-color)] text-[var(--text-color)] mt-6 mb-4" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-xl sm:text-2xl font-bold pb-2 border-b border-[var(--border-color)] text-[var(--text-color)] mt-6 mb-3" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-lg sm:text-xl font-bold text-[var(--text-color)] mt-4 mb-2" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="my-3 leading-relaxed text-[var(--text-color)] opacity-90" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc list-inside space-y-1 my-3 pl-2" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal list-inside space-y-1 my-3 pl-2" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="text-[var(--text-color)] opacity-90" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-[var(--primary-color)] pl-4 py-1 italic bg-[var(--primary-bg)]/40 rounded-r-lg my-4 text-[var(--secondary-color)]" {...props} />
                ),
                code: ({ node, className, children, ...props }: any) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match && !String(children).includes('\n');
                  return isInline ? (
                    <code className="px-1.5 py-0.5 rounded bg-[var(--terminal-header-bg)] border border-[var(--border-color)] font-mono text-xs text-[var(--primary-color)] font-bold" {...props}>
                      {children}
                    </code>
                  ) : (
                    <div className="relative my-4 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 font-mono text-xs">
                      {match && (
                        <div className="px-4 py-1.5 bg-slate-900 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                          {match[1]}
                        </div>
                      )}
                      <pre className="p-4 overflow-x-auto text-slate-200">
                        <code>{children}</code>
                      </pre>
                    </div>
                  );
                },
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-4 rounded-xl border border-[var(--border-color)]">
                    <table className="w-full text-left text-xs sm:text-sm font-mono" {...props} />
                  </div>
                ),
                thead: ({ node, ...props }) => (
                  <thead className="bg-[var(--terminal-header-bg)] border-b border-[var(--border-color)] text-[var(--text-color)] font-bold" {...props} />
                ),
                th: ({ node, ...props }) => (
                  <th className="p-3 font-bold" {...props} />
                ),
                td: ({ node, ...props }) => (
                  <td className="p-3 border-t border-[var(--border-color)]" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a className="text-[var(--primary-color)] hover:underline font-bold" target="_blank" rel="noopener noreferrer" {...props} />
                )
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <pre className="p-4 rounded-xl bg-[var(--terminal-header-bg)] border border-[var(--border-color)] font-mono text-xs sm:text-sm text-[var(--text-color)] overflow-x-auto whitespace-pre-wrap">
            <code>{content}</code>
          </pre>
        )}
      </div>
    </div>
  );
};
