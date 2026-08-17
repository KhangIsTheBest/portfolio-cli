'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle2, UserCheck, Info } from 'lucide-react';
import Link from 'next/link';
import { apiService } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';

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
          colors: ['#10b981', '#f59e0b', '#38bdf8', '#6366f1']
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
      
      setTimeout(() => setSubmitSuccess(false), 6000);
    } catch (err: any) {
      console.error('Contact submission error:', err);
      setErrorMsg(err.message || (locale === 'vi' ? 'Gửi tin nhắn thất bại' : 'Failed to transmit packet'));
      setTimeout(() => setErrorMsg(null), 6000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="border border-[var(--border-color)] bg-[var(--card-bg)] rounded-3xl p-6 sm:p-8 space-y-6 my-6 max-w-2xl mx-auto w-full font-mono shadow-xl animate-fade-in select-text transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
        <div className="flex items-center space-x-2">
          <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-base font-bold text-[var(--text-color)] uppercase tracking-wider">{t('contact.title')}</h3>
        </div>
        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
          SPRING BOOT REST
        </span>
      </div>

      {/* Session indicator */}
      {loggedInUser ? (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-mono">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4" />
            <span>{locale === 'vi' ? `Chào mừng ${loggedInUser.fullName}` : `Authenticated: ${loggedInUser.fullName}`}</span>
          </div>
          <Link href="/profile" className="underline font-bold hover:opacity-80">
            {locale === 'vi' ? 'Hồ sơ' : 'Profile'}
          </Link>
        </div>
      ) : (
        <div className="p-3 bg-[var(--terminal-header-bg)] border border-[var(--border-color)] rounded-xl flex items-center space-x-2 text-xs text-[var(--secondary-color)] font-mono">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <p>
            {locale === 'vi' ? (
              <>Bạn có thể <Link href="/login" className="text-emerald-600 dark:text-emerald-400 underline font-bold">Đăng nhập</Link> để điền tự động.</>
            ) : (
              <>You can <Link href="/login" className="text-emerald-600 dark:text-emerald-400 underline font-bold">Sign In</Link> to pre-fill your details.</>
            )}
          </p>
        </div>
      )}

      {submitSuccess ? (
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl animate-fade-in font-mono">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 animate-bounce" />
          <div>
            <h4 className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">{t('contact.successTitle')}</h4>
            <p className="text-xs text-[var(--secondary-color)] max-w-xs mt-1 leading-relaxed">
              {t('contact.successDesc')}
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-mono">
              ⚠️ {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold uppercase text-[var(--secondary-color)]">{t('contact.nameLabel')}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                readOnly={!!loggedInUser}
                placeholder={t('contact.namePlaceholder')}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--terminal-header-bg)] text-[var(--text-color)] text-xs focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold uppercase text-[var(--secondary-color)]">{t('contact.emailLabel')}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                readOnly={!!loggedInUser}
                placeholder={t('contact.emailPlaceholder')}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--terminal-header-bg)] text-[var(--text-color)] text-xs focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase text-[var(--secondary-color)]">{t('contact.subjectLabel')}</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder={t('contact.subjectPlaceholder')}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--terminal-header-bg)] text-[var(--text-color)] text-xs focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase text-[var(--secondary-color)]">{t('contact.msgLabel')}</label>
            <textarea
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleInputChange}
              required
              placeholder={t('contact.msgPlaceholder')}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--terminal-header-bg)] text-[var(--text-color)] text-xs focus:outline-none focus:border-emerald-500 transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center space-x-2 w-full px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer disabled:opacity-50 shadow-md"
          >
            {isSubmitting ? (
              <span>{t('contact.submittingBtn')}</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{t('contact.submitBtn')}</span>
              </>
            )}
          </button>
        </form>
      )}
    </section>
  );
}
