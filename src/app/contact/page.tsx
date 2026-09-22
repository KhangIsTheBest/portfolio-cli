'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle2, UserCheck, Info, Sparkles, MessageSquare, Terminal } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { apiService } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';
import { SpotlightCard } from '@/components/SpotlightCard';

let confetti: any = null;
if (typeof window !== 'undefined') {
  import('canvas-confetti').then((module) => {
    confetti = module.default;
  });
}

export default function ContactPage() {
  const { locale, t } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loggedInUser, setLoggedInUser] = useState<{ fullName: string; email: string; username: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const profileStr = localStorage.getItem('user-profile');
    if (profileStr) {
      try {
        const cachedProfile = JSON.parse(profileStr);
        setLoggedInUser(cachedProfile);
        setFormData((prev) => ({
          ...prev,
          name: cachedProfile.fullName || '',
          email: cachedProfile.email || '',
        }));
      } catch (e) {
        console.error('Failed to parse cached user profile:', e);
      }
    }

    const userToken = localStorage.getItem('user-token');
    if (userToken) {
      apiService.getUserProfile().then((data) => {
        const updatedProfile = {
          fullName: data.fullName || data.username,
          email: data.email || '',
          username: data.username
        };
        localStorage.setItem('user-profile', JSON.stringify(updatedProfile));
        setLoggedInUser(updatedProfile);
        setFormData((prev) => ({
          ...prev,
          name: updatedProfile.fullName,
          email: updatedProfile.email,
        }));
      }).catch((err) => {
        console.error('Failed to sync profile with backend:', err);
      });
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    try {
      await apiService.submitContact({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'GUI Contact Request',
        message: formData.message,
      });

      if (confetti) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#38bdf8', '#818cf8', '#f59e0b']
        });
      }

      setSubmitSuccess(true);
      setErrorMsg(null);

      setFormData({
        name: loggedInUser ? loggedInUser.fullName : '',
        email: loggedInUser ? loggedInUser.email : '',
        subject: '',
        message: '',
      });

      setTimeout(() => setSubmitSuccess(false), 7000);
    } catch (err: any) {
      console.error('Contact submission error:', err);
      setErrorMsg(err.message || (locale === 'vi' ? 'Gửi tin nhắn thất bại' : 'Failed to transmit packet'));
      setTimeout(() => setErrorMsg(null), 6000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 my-6 font-mono select-text max-w-3xl mx-auto">
      {/* Header section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-3 text-center sm:text-left"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-mono">
          <Terminal className="w-3.5 h-3.5" />
          <span>{locale === 'vi' ? 'KẾT NỐI TRỰC TIẾP' : 'DIRECT TRANSMISSION PIPELINE'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--text-color)]">
          {t('contact.title')}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--secondary-color)] font-sans leading-relaxed">
          {locale === 'vi'
            ? 'Bạn có ý tưởng dự án, cơ hội hợp tác hoặc muốn thảo luận về kỹ thuật? Gửi tin nhắn và tôi sẽ phản hồi trong thời gian sớm nhất.'
            : 'Have a project in mind, career opportunity, or architectural question? Dispatch a message and I will get back to you promptly.'}
        </p>
      </motion.div>

      {/* Main Form Card */}
      <SpotlightCard className="p-6 sm:p-8 space-y-6 shadow-xl" spotlightColor="rgba(16, 185, 129, 0.12)">
        {/* Top meta indicator */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-[var(--text-color)] uppercase tracking-wider">
              {locale === 'vi' ? 'Biểu mẫu liên hệ' : 'Dispatch Console'}
            </span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold">
            SPRING BOOT REST
          </span>
        </div>

        {/* User Session Bar */}
        {loggedInUser ? (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-mono">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4 shrink-0" />
              <span>{locale === 'vi' ? `Xác thực: ${loggedInUser.fullName}` : `Authenticated: ${loggedInUser.fullName}`}</span>
            </div>
            <Link href="/profile" className="underline font-bold hover:opacity-80">
              {locale === 'vi' ? 'Hồ sơ' : 'Profile'}
            </Link>
          </div>
        ) : (
          <div className="p-3 bg-[var(--terminal-header-bg)] border border-[var(--border-color)] rounded-2xl flex items-center space-x-2 text-xs text-[var(--secondary-color)] font-mono">
            <Info className="w-4 h-4 text-amber-500 shrink-0" />
            <p>
              {locale === 'vi' ? (
                <>Bạn có thể <Link href="/login" className="text-emerald-600 dark:text-emerald-400 underline font-bold">Đăng nhập</Link> để tự động điền thông tin.</>
              ) : (
                <>You can <Link href="/login" className="text-emerald-600 dark:text-emerald-400 underline font-bold">Sign In</Link> to pre-fill your details.</>
              )}
            </p>
          </div>
        )}

        {/* Form or Success State */}
        {submitSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center space-y-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl font-mono"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-500 shadow-glow">
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h4 className="text-emerald-600 dark:text-emerald-400 font-bold text-base">
                {t('contact.successTitle')}
              </h4>
              <p className="text-xs text-[var(--secondary-color)] leading-relaxed">
                {t('contact.successDesc')}
              </p>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-xl text-xs font-mono">
                ⚠️ {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase text-[var(--secondary-color)]">
                  {t('contact.nameLabel')} <span className="text-emerald-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  readOnly={!!loggedInUser}
                  placeholder={t('contact.namePlaceholder')}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--terminal-header-bg)] text-[var(--text-color)] text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase text-[var(--secondary-color)]">
                  {t('contact.emailLabel')} <span className="text-emerald-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  readOnly={!!loggedInUser}
                  placeholder={t('contact.emailPlaceholder')}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--terminal-header-bg)] text-[var(--text-color)] text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold uppercase text-[var(--secondary-color)]">
                {t('contact.subjectLabel')}
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder={t('contact.subjectPlaceholder')}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--terminal-header-bg)] text-[var(--text-color)] text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold uppercase text-[var(--secondary-color)]">
                {t('contact.msgLabel')} <span className="text-emerald-500">*</span>
              </label>
              <textarea
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleInputChange}
                required
                placeholder={t('contact.msgPlaceholder')}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--terminal-header-bg)] text-[var(--text-color)] text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center space-x-2 w-full px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all duration-200 cursor-pointer disabled:opacity-50 shadow-md active:scale-[0.99]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t('contact.submittingBtn')}</span>
                </div>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t('contact.submitBtn')}</span>
                </>
              )}
            </button>
          </form>
        )}
      </SpotlightCard>
    </div>
  );
}
