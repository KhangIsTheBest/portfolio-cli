'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layers, ShieldAlert, KeyRound, UserRound, ArrowLeft, Mail, CheckCircle2, User } from 'lucide-react';
import Link from 'next/link';
import { apiService } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
  const router = useRouter();
  const { locale } = useLanguage();

  // Mode state: false = Login, true = Register
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Check if already authenticated on mount
  useEffect(() => {
    const adminToken = localStorage.getItem('admin-token');
    const userToken = localStorage.getItem('user-token');
    if (adminToken) {
      router.push('/admin');
    } else if (userToken) {
      router.push('/contact');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!username.trim() || !password.trim()) return;

    setIsSubmitting(true);

    try {
      if (isRegisterMode) {
        // Register API call
        if (!email.trim() || !fullName.trim()) {
          setErrorMsg(locale === 'vi' ? 'Vui lòng nhập đầy đủ email và họ tên.' : 'Please enter your email and full name.');
          setIsSubmitting(false);
          return;
        }

        await apiService.register({
          username: username.trim(),
          password: password.trim(),
          email: email.trim(),
          fullName: fullName.trim()
        });

        setSuccessMsg(
          locale === 'vi' 
            ? 'Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ.' 
            : 'Registration successful! You can now log in.'
        );
        // Reset and switch back to login mode
        setIsRegisterMode(false);
        setPassword('');
      } else {
        // Login API call
        const data = await apiService.login(username.trim(), password.trim());
        const roles = data.roles || [];
        const isAdmin = roles.includes('ROLE_ADMIN') || username.toLowerCase().includes('admin');
        
        if (isAdmin) {
          router.push('/admin');
        } else {
          router.push('/contact');
        }
      }
    } catch (err: any) {
      console.error('Auth action failed:', err);
      setErrorMsg(
        err.message || (
          locale === 'vi' 
            ? 'Tên tài khoản hoặc mật khẩu không chính xác!' 
            : 'Invalid credentials or network issue.'
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative animate-fade-in">
      <div className="max-w-md w-full space-y-8 p-8 border border-border-custom glass-panel rounded-3xl relative">
        {/* Accent Top Orb */}
        <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-cyan-custom/10 blur-xl pointer-events-none" />

        {/* Logo and Headings */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-custom to-purple-custom shadow-glow p-0.5 flex items-center justify-center text-bg mb-4 select-none">
            <div className="w-full h-full rounded-[14px] bg-bg flex items-center justify-center text-cyan-custom">
              <Layers className="w-6 h-6" />
            </div>
          </div>
          <h2 className="text-xl font-black tracking-widest text-text">
            PORTFOLIO
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-custom to-purple-custom">
              {isRegisterMode ? '.REGISTER' : '.LOGIN'}
            </span>
          </h2>
          <p className="mt-2 text-xs font-mono text-secondary">
            {isRegisterMode 
              ? (locale === 'vi' ? 'Đăng ký tài khoản thành viên mới' : 'Create a New Account')
              : (locale === 'vi' ? 'Đăng nhập để kết nối với tôi' : 'Sign in to Contact Me')
            }
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

        {/* Authentication Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-3.5">
            
            {/* Full Name field (Register only) */}
            {isRegisterMode && (
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
                    placeholder={locale === 'vi' ? 'VD: Nguyễn Văn A' : 'e.g. John Doe'}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-custom bg-slate-950/45 text-text text-sm focus:outline-none focus:border-cyan-custom transition"
                  />
                </div>
              </div>
            )}

            {/* Email field (Register only) */}
            {isRegisterMode && (
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
            )}

            {/* Username field */}
            <div className="space-y-1 relative">
              <label className="text-[9px] font-mono font-bold uppercase text-secondary">
                {locale === 'vi' ? 'Tên đăng nhập *' : 'Username *'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary">
                  <UserRound className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={locale === 'vi' ? 'Nhập username' : 'Enter username'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-custom bg-slate-950/45 text-text text-sm focus:outline-none focus:border-cyan-custom transition"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1 relative">
              <label className="text-[9px] font-mono font-bold uppercase text-secondary">
                {locale === 'vi' ? 'Mật khẩu *' : 'Password *'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
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
                <div className="w-4 h-4 rounded-full border-2 border-bg border-t-transparent animate-spin" />
                <span>{locale === 'vi' ? 'Đang thực hiện...' : 'Processing...'}</span>
              </>
            ) : (
              <span>
                {isRegisterMode 
                  ? (locale === 'vi' ? 'Đăng ký tài khoản mới' : 'Register Account')
                  : (locale === 'vi' ? 'Đăng nhập vào hệ thống' : 'Sign In')
                }
              </span>
            )}
          </button>
        </form>

        {/* Register / Login Toggle */}
        <div className="text-center text-xs text-secondary font-sans mt-3">
          {isRegisterMode ? (
            <button
              onClick={() => {
                setIsRegisterMode(false);
                setErrorMsg(null);
              }}
              className="text-cyan-custom hover:underline focus:outline-none"
            >
              {locale === 'vi' ? 'Đã có tài khoản? Đăng nhập ngay' : 'Already have an account? Sign In'}
            </button>
          ) : (
            <button
              onClick={() => {
                setIsRegisterMode(true);
                setErrorMsg(null);
              }}
              className="text-purple-custom hover:underline focus:outline-none"
            >
              {locale === 'vi' ? 'Chưa có tài khoản? Đăng ký tại đây' : "Don't have an account? Sign Up"}
            </button>
          )}
        </div>

        {/* Back Link */}
        <div className="text-center pt-2.5 border-t border-border-custom/30 mt-4">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs text-secondary hover:text-cyan-custom transition font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{locale === 'vi' ? 'Quay về trang chính' : 'Return to Website'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
