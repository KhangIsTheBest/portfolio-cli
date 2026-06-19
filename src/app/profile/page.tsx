'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, CheckCircle2, ShieldAlert, ArrowLeft, Loader2, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { apiService } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';

export default function GuestProfilePage() {
  const router = useRouter();
  const { locale } = useLanguage();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Authenticate guard & load profile on mount
  useEffect(() => {
    const adminToken = localStorage.getItem('admin-token');
    const userToken = localStorage.getItem('user-token');
    if (adminToken) {
      router.push('/admin/profile');
      return;
    }
    if (!userToken) {
      router.push('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const data = await apiService.getUserProfile();
        setUsername(data.username || '');
        setEmail(data.email || '');
        setFullName(data.fullName || '');
      } catch (err: any) {
        console.error('Failed to load profile:', err);
        setErrorMsg(
          locale === 'vi' 
            ? 'Không thể tải thông tin hồ sơ!' 
            : 'Failed to load profile details.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [router, locale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!fullName.trim() || !email.trim()) {
      setErrorMsg(locale === 'vi' ? 'Họ tên và email không được bỏ trống!' : 'Full name and email are required!');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiService.updateUserProfile({
        fullName: fullName.trim(),
        email: email.trim(),
        password: password.trim() || undefined
      });

      setSuccessMsg(
        locale === 'vi' 
          ? 'Cập nhật thông tin hồ sơ thành công!' 
          : 'Profile updated successfully!'
      );
      setPassword('');
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      let displayError = err.message || (
        locale === 'vi' 
          ? 'Đã xảy ra lỗi khi cập nhật hồ sơ!' 
          : 'Failed to update profile.'
      );

      if (locale === 'vi') {
        if (displayError.includes('already exists with email')) {
          displayError = 'Địa chỉ Email này đã được sử dụng!';
        } else if (displayError.includes('Validation failed')) {
          displayError = 'Dữ liệu nhập vào không hợp lệ. Vui lòng kiểm tra lại!';
        }
      }
      setErrorMsg(displayError);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3 font-mono text-xs text-secondary">
          <Loader2 className="w-8 h-8 text-cyan-custom animate-spin" />
          <span>{locale === 'vi' ? 'Đang tải thông tin...' : 'Loading profile data...'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative animate-fade-in">
      <div className="max-w-md w-full space-y-8 p-8 border border-border-custom glass-panel rounded-3xl relative">
        {/* Accent Top Orb */}
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-purple-custom/10 blur-xl pointer-events-none" />

        {/* Headings */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-custom to-purple-custom shadow-glow p-0.5 flex items-center justify-center text-bg mb-4 select-none">
            <div className="w-full h-full rounded-[14px] bg-bg flex items-center justify-center text-purple-custom">
              <UserCircle className="w-6 h-6" />
            </div>
          </div>
          <h2 className="text-xl font-black tracking-widest text-text">
            {locale === 'vi' ? 'HỒ SƠ' : 'PROFILE'}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-custom to-purple-custom">
              {locale === 'vi' ? '.CÁ NHÂN' : '.ACCOUNT'}
            </span>
          </h2>
          <p className="mt-2 text-xs font-mono text-secondary">
            {locale === 'vi' ? 'Quản lý thông tin tài khoản khách' : 'Manage your visitor account details'}
          </p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="flex items-center space-x-2.5 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-mono">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="flex items-center space-x-2.5 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-xl text-xs font-mono">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-3.5">
            {/* Username (Read-only) */}
            <div className="space-y-1 relative">
              <label className="text-[9px] font-mono font-bold uppercase text-secondary">
                {locale === 'vi' ? 'Tên đăng nhập (Không thể đổi)' : 'Username (Read-only)'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary">
                  <User className="w-4 h-4 opacity-50" />
                </div>
                <input
                  type="text"
                  disabled
                  value={username}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-custom bg-slate-950/20 text-secondary text-sm cursor-not-allowed opacity-75"
                />
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1 relative">
              <label className="text-[9px] font-mono font-bold uppercase text-secondary">
                {locale === 'vi' ? 'Họ và tên *' : 'Full Name *'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={locale === 'vi' ? 'Họ tên của bạn' : 'Your full name'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-custom bg-slate-950/45 text-text text-sm focus:outline-none focus:border-cyan-custom transition"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1 relative">
              <label className="text-[9px] font-mono font-bold uppercase text-secondary">
                {locale === 'vi' ? 'Địa chỉ Email *' : 'Email Address *'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-custom bg-slate-950/45 text-text text-sm focus:outline-none focus:border-cyan-custom transition"
                />
              </div>
            </div>

            {/* Password (Optional change) */}
            <div className="space-y-1 relative">
              <label className="text-[9px] font-mono font-bold uppercase text-secondary">
                {locale === 'vi' ? 'Mật khẩu mới (Để trống nếu không đổi)' : 'New Password (Leave blank to keep)'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-custom bg-slate-950/45 text-text text-sm focus:outline-none focus:border-cyan-custom transition"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center space-x-2 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-custom to-purple-custom text-bg font-bold text-xs hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 hover:shadow-glow cursor-pointer mt-4"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{locale === 'vi' ? 'Đang lưu...' : 'Saving changes...'}</span>
              </>
            ) : (
              <span>{locale === 'vi' ? 'Lưu thay đổi' : 'Save Changes'}</span>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center pt-2.5 border-t border-border-custom/30 mt-4">
          <Link
            href="/contact"
            className="inline-flex items-center space-x-1.5 text-xs text-secondary hover:text-cyan-custom transition font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{locale === 'vi' ? 'Quay về trang liên hệ' : 'Return to Contact Form'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
