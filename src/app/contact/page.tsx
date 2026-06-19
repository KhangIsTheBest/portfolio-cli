'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle, UserCheck, LogOut, Info } from 'lucide-react';
import Link from 'next/link';
import { apiService } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';

// Import confetti dynamically to prevent SSR issues
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

  // Check login state on mount and sync latest profile from backend
  useEffect(() => {
    const profileStr = localStorage.getItem('user-profile');
    let cachedProfile: any = null;
    
    if (profileStr) {
      try {
        cachedProfile = JSON.parse(profileStr);
        setLoggedInUser(cachedProfile);
        setFormData((prev) => ({
          ...prev,
          name: cachedProfile.fullName || '',
          email: cachedProfile.email || '',
        }));
      } catch (e) {
        console.error('Failed to parse user profile:', e);
      }
    }

    const userToken = localStorage.getItem('user-token');
    if (userToken) {
      // Fetch latest profile from backend in background to sync
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
        console.error('Failed to sync user profile with backend:', err);
      });
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem('user-token');
    localStorage.removeItem('user-profile');
    setLoggedInUser(null);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
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

      // Confetti celebration
      if (confetti) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#a855f7', '#38bdf8', '#c084fc', '#0284c7']
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
      
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err: any) {
      console.error('Contact submission failed:', err);
      let displayError = err.message || (
        locale === 'vi' 
          ? 'Gửi tin nhắn thất bại. Vui lòng thử lại!' 
          : 'Failed to send message. Please try again.'
      );
      if (locale === 'vi') {
        if (displayError.includes('Validation failed')) {
          displayError = 'Dữ liệu nhập vào không hợp lệ. Vui lòng kiểm tra lại!';
        }
      }
      setErrorMsg(displayError);
      setTimeout(() => setErrorMsg(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="border border-border-custom glass-panel rounded-3xl p-8 space-y-6 my-8 animate-fade-in relative overflow-hidden max-w-2xl mx-auto w-full">
      {/* Accent bottom glow */}
      <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-purple-custom/10 blur-3xl -z-10 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-custom/50 pb-3">
        <div className="flex items-center space-x-2">
          <Mail className="w-5 h-5 text-cyan-custom" />
          <h3 className="text-base font-bold text-text">{t('contact.title')}</h3>
        </div>
      </div>

      {/* Login / Session Greeting Bar */}
      {loggedInUser ? (
        <div className="p-3 bg-cyan-custom/10 border border-cyan-custom/25 rounded-2xl flex items-center justify-between text-xs font-mono select-none">
          <div className="flex items-center space-x-2 text-cyan-custom">
            <UserCheck className="w-4 h-4 shrink-0" />
            <span>
              {locale === 'vi' 
                ? `Chào mừng, ${loggedInUser.fullName}!` 
                : `Welcome back, ${loggedInUser.fullName}!`}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/profile"
              className="text-cyan-custom hover:text-cyan-custom/80 hover:underline font-bold transition"
              title={locale === 'vi' ? 'Xem hồ sơ cá nhân' : 'View account profile'}
            >
              {locale === 'vi' ? 'Hồ sơ' : 'Profile'}
            </Link>
            <span className="text-cyan-custom/30 select-none">|</span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-rose-400 hover:text-rose-500 transition focus:outline-none"
              title={locale === 'vi' ? 'Đăng xuất tài khoản' : 'Sign Out'}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="font-bold">{locale === 'vi' ? 'Đăng xuất' : 'Logout'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-slate-950/30 border border-border-custom rounded-2xl flex items-start space-x-2 text-xs text-secondary font-mono">
          <Info className="w-4 h-4 shrink-0 text-purple-custom mt-0.5" />
          <p className="leading-relaxed">
            {locale === 'vi' ? (
              <>
                Bạn có thể{' '}
                <Link href="/login" className="text-purple-custom hover:underline font-bold">
                  Đăng nhập / Đăng ký tài khoản
                </Link>{' '}
                để tự động điền thông tin liên hệ của mình.
              </>
            ) : (
              <>
                You can{' '}
                <Link href="/login" className="text-purple-custom hover:underline font-bold">
                  Sign In / Sign Up
                </Link>{' '}
                to automatically pre-fill your details.
              </>
            )}
          </p>
        </div>
      )}

      {submitSuccess ? (
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl animate-fade-in font-mono">
          <CheckCircle className="w-12 h-12 text-emerald-500 animate-bounce" />
          <div>
            <h4 className="text-emerald-500 font-bold">{t('contact.successTitle')}</h4>
            <p className="text-xs text-secondary max-w-xs mt-1">
              {t('contact.successDesc')}
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="flex items-center space-x-2.5 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-xl text-xs font-mono select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              <span>{errorMsg}</span>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Name input */}
            <div className="space-y-1">
              <label className="text-[9px] font-mono font-bold uppercase text-secondary">{t('contact.nameLabel')}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                readOnly={!!loggedInUser}
                placeholder={t('contact.namePlaceholder')}
                className={`w-full px-4 py-2.5 rounded-xl border border-border-custom text-text text-sm focus:outline-none focus:border-cyan-custom transition ${
                  loggedInUser 
                    ? 'bg-slate-950/20 text-secondary cursor-not-allowed opacity-75 focus:border-border-custom' 
                    : 'bg-slate-950/45'
                }`}
              />
            </div>

            {/* Email input */}
            <div className="space-y-1">
              <label className="text-[9px] font-mono font-bold uppercase text-secondary">{t('contact.emailLabel')}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                readOnly={!!loggedInUser}
                placeholder={t('contact.emailPlaceholder')}
                className={`w-full px-4 py-2.5 rounded-xl border border-border-custom text-text text-sm focus:outline-none focus:border-cyan-custom transition ${
                  loggedInUser 
                    ? 'bg-slate-950/20 text-secondary cursor-not-allowed opacity-75 focus:border-border-custom' 
                    : 'bg-slate-950/45'
                }`}
              />
            </div>
          </div>

          {/* Subject input */}
          <div className="space-y-1">
            <label className="text-[9px] font-mono font-bold uppercase text-secondary">{t('contact.subjectLabel')}</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder={t('contact.subjectPlaceholder')}
              className="w-full px-4 py-2.5 rounded-xl border border-border-custom bg-slate-950/45 text-text text-sm focus:outline-none focus:border-cyan-custom transition"
            />
          </div>

          {/* Message input */}
          <div className="space-y-1">
            <label className="text-[9px] font-mono font-bold uppercase text-secondary">{t('contact.msgLabel')}</label>
            <textarea
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleInputChange}
              required
              placeholder={t('contact.msgPlaceholder')}
              className="w-full px-4 py-2.5 rounded-xl border border-border-custom bg-slate-950/45 text-text text-sm focus:outline-none focus:border-cyan-custom transition resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center space-x-2 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-custom to-purple-custom text-bg font-bold text-xs hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 hover:shadow-glow cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-bg border-t-transparent animate-spin" />
                <span>{t('contact.submittingBtn')}</span>
              </>
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
