'use client';

import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
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
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="border border-border-custom glass-panel rounded-3xl p-8 space-y-6 my-8 animate-fade-in relative overflow-hidden max-w-2xl mx-auto w-full">
      {/* Accent bottom glow */}
      <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-purple-custom/10 blur-3xl -z-10 pointer-events-none" />

      <div className="flex items-center space-x-2 border-b border-border-custom/50 pb-3">
        <Mail className="w-5 h-5 text-cyan-custom" />
        <h3 className="text-base font-bold text-text">{t('contact.title')}</h3>
      </div>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-mono font-bold uppercase text-secondary">{t('contact.nameLabel')}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder={t('contact.namePlaceholder')}
                className="w-full px-4 py-2.5 rounded-xl border border-border-custom bg-slate-950/45 text-text text-sm focus:outline-none focus:border-cyan-custom transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-mono font-bold uppercase text-secondary">{t('contact.emailLabel')}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder={t('contact.emailPlaceholder')}
                className="w-full px-4 py-2.5 rounded-xl border border-border-custom bg-slate-950/45 text-text text-sm focus:outline-none focus:border-cyan-custom transition"
              />
            </div>
          </div>

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
