'use client';

import React, { useState } from 'react';
import { FileText, Download, Maximize2, ExternalLink, X, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

import { motion } from 'framer-motion';
import { SpotlightCard } from './SpotlightCard';

interface CvViewerProps {
  cvViUrl?: string;
  cvEnUrl?: string;
}

export const CvViewer: React.FC<CvViewerProps> = ({ cvViUrl, cvEnUrl }) => {
  const { locale, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'vi' | 'en'>(locale === 'vi' ? 'vi' : 'en');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeCvUrl = activeTab === 'vi' ? cvViUrl : cvEnUrl;
  const downloadFileName = activeTab === 'vi' ? 'PhanDuyKhang_CV_VI.pdf' : 'PhanDuyKhang_CV_EN.pdf';

  return (
    <SpotlightCard className="space-y-6" spotlightColor="rgba(16, 185, 129, 0.15)">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-[var(--text-color)] uppercase tracking-wider">
              {t('about.cvTitle')}
            </h3>
          </div>
          <p className="text-xs text-[var(--secondary-color)] font-sans">
            {t('about.cvSubtitle')}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Language Switcher Tabs */}
          <div className="flex p-1 bg-[var(--terminal-header-bg)] border border-[var(--border-color)] rounded-xl text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('vi')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'vi'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-[var(--secondary-color)] hover:text-[var(--text-color)]'
              }`}
            >
              🇻🇳 {t('about.cvViTab')}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('en')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'en'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-[var(--secondary-color)] hover:text-[var(--text-color)]'
              }`}
            >
              🇬🇧 {t('about.cvEnTab')}
            </button>
          </div>

          {/* Action Buttons */}
          {activeCvUrl && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold font-mono text-[var(--text-color)] bg-[var(--terminal-header-bg)] border border-[var(--border-color)] hover:border-emerald-500/50 transition cursor-pointer"
                title={t('about.cvFullscreen')}
              >
                <Maximize2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">{t('about.cvFullscreen')}</span>
              </button>

              <a
                href={activeCvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold font-mono text-[var(--text-color)] bg-[var(--terminal-header-bg)] border border-[var(--border-color)] hover:border-sky-500/50 transition cursor-pointer"
                title={t('about.cvOpenInNewTab')}
              >
                <ExternalLink className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span className="hidden sm:inline">{t('about.cvOpenInNewTab')}</span>
              </a>

              <a
                href={activeCvUrl}
                download={downloadFileName}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold font-mono text-white bg-emerald-600 hover:bg-emerald-500 transition cursor-pointer shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('about.cvDownload')}</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* CV Preview Box */}
      <div className="w-full h-[600px] sm:h-[750px] bg-[var(--terminal-header-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden relative shadow-inner">
        {activeCvUrl ? (
          <iframe
            src={`${activeCvUrl}#toolbar=0&navpanes=0&scrollbar=1`}
            title={`CV Preview - ${activeTab.toUpperCase()}`}
            className="w-full h-full border-0 rounded-2xl"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-amber-500/80" />
            <p className="text-sm font-bold text-[var(--text-color)] font-mono">
              {t('about.cvNotFound')} ({activeTab.toUpperCase()})
            </p>
            <p className="text-xs text-[var(--secondary-color)] font-sans max-w-md">
              Vui lòng cập nhật liên kết tệp PDF trong mục Quản trị (Admin Profile) để hiển thị bản xem trước.
            </p>
          </div>
        )}
      </div>

      {/* Fullscreen Modal View */}
      {isFullscreen && activeCvUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col p-4 sm:p-6 animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-700/60 max-w-6xl w-full mx-auto">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                {t('about.cvTitle')} - {activeTab === 'vi' ? 'Tiếng Việt' : 'English'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={activeCvUrl}
                download={downloadFileName}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-mono text-white bg-emerald-600 hover:bg-emerald-500 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('about.cvDownload')}</span>
              </a>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition cursor-pointer"
                title={t('about.cvClose')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 max-w-6xl w-full mx-auto my-4 bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-700 shadow-2xl">
            <iframe
              src={`${activeCvUrl}#toolbar=1&navpanes=0`}
              title={`Fullscreen CV Preview - ${activeTab.toUpperCase()}`}
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}
    </SpotlightCard>
  );
};
