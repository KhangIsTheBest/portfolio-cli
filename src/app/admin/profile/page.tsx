'use client';

import React, { useState, useEffect } from 'react';
import { User, Save, RefreshCw, AlertTriangle, CheckCircle2, Upload, Trash2, FileText, ExternalLink } from 'lucide-react';
import { apiService } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';
import { RichTextEditor } from '@/components/RichTextEditor';


export default function AdminProfilePage() {
  const { locale } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [cvViUrl, setCvViUrl] = useState('');
  const [cvEnUrl, setCvEnUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCvVi, setUploadingCvVi] = useState(false);
  const [uploadingCvEn, setUploadingCvEn] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setMessage(null);
    try {
      const url = await apiService.uploadFile(file);
      setAvatarUrl(url);
      setMessage({
        type: 'success',
        text: locale === 'vi' ? 'Tải ảnh đại diện thành công!' : 'Avatar uploaded successfully!'
      });
    } catch (err: any) {
      console.error('Failed to upload avatar:', err);
      setMessage({
        type: 'error',
        text: locale === 'vi' ? `Lỗi tải ảnh: ${err.message}` : `Upload error: ${err.message}`
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCvViUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCvVi(true);
    setMessage(null);
    try {
      const url = await apiService.uploadFile(file);
      setCvViUrl(url);
      setMessage({
        type: 'success',
        text: locale === 'vi' ? 'Tải lên CV Tiếng Việt thành công!' : 'Vietnamese CV uploaded successfully!'
      });
    } catch (err: any) {
      console.error('Failed to upload Vietnamese CV:', err);
      setMessage({
        type: 'error',
        text: locale === 'vi' ? `Lỗi tải CV Tiếng Việt: ${err.message}` : `Upload error: ${err.message}`
      });
    } finally {
      setUploadingCvVi(false);
    }
  };

  const handleCvEnUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCvEn(true);
    setMessage(null);
    try {
      const url = await apiService.uploadFile(file);
      setCvEnUrl(url);
      setMessage({
        type: 'success',
        text: locale === 'vi' ? 'Tải lên CV Tiếng Anh thành công!' : 'English CV uploaded successfully!'
      });
    } catch (err: any) {
      console.error('Failed to upload English CV:', err);
      setMessage({
        type: 'error',
        text: locale === 'vi' ? `Lỗi tải CV Tiếng Anh: ${err.message}` : `Upload error: ${err.message}`
      });
    } finally {
      setUploadingCvEn(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiService.getProfile();
        
        // Populate form
        setFullName(data.fullName || '');
        setTitle(data.title || '');
        setAboutMe(data.aboutMe || '');
        setEmail(data.email || '');
        setAvatarUrl(data.avatarUrl || '');
        setCvViUrl(data.cvViUrl || '');
        setCvEnUrl(data.cvEnUrl || '');
        setGithubUrl(data.githubUrl || '');
        setLinkedinUrl(data.linkedinUrl || '');
      } catch (err) {
        console.error('Failed to load profile data:', err);
        setMessage({
          type: 'error',
          text: locale === 'vi' ? 'Không thể tải thông tin hồ sơ.' : 'Failed to load profile information.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [locale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    // Simple validation
    if (!fullName.trim() || !title.trim() || !aboutMe.trim() || !email.trim()) {
      setMessage({
        type: 'error',
        text: locale === 'vi' ? 'Vui lòng điền đầy đủ các thông tin bắt buộc (*).' : 'Please fill in all required fields (*).'
      });
      setSaving(false);
      return;
    }

    try {
      await apiService.updateProfile({
        fullName,
        title,
        aboutMe,
        email,
        avatarUrl,
        cvViUrl,
        cvEnUrl,
        githubUrl,
        linkedinUrl
      });

      setMessage({
        type: 'success',
        text: locale === 'vi' ? 'Cập nhật hồ sơ thành công!' : 'Profile updated successfully!'
      });
    } catch (err) {
      console.error('Failed to update profile:', err);
      setMessage({
        type: 'error',
        text: locale === 'vi' ? 'Không thể cập nhật hồ sơ. Vui lòng thử lại.' : 'Failed to update profile. Please try again.'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-cyan-custom space-y-4">
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-custom/20 animate-pulse" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-custom animate-spin" />
        </div>
        <p className="font-mono text-xs tracking-wider animate-pulse">
          {locale === 'vi' ? 'ĐANG TẢI DỮ LIỆU HỒ SƠ...' : 'LOADING PROFILE DATA...'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-mono">
      {/* Header title */}
      <div className="flex items-center justify-between border-b border-border-custom/50 pb-3">
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 text-cyan-custom" />
          <h3 className="text-base font-bold text-text">
            {locale === 'vi' ? 'Chỉnh sửa hồ sơ cá nhân' : 'Edit Personal Profile'}
          </h3>
        </div>
        
        {isOfflineMode && (
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] uppercase font-bold animate-pulse select-none">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{locale === 'vi' ? 'Chế độ Ngoại tuyến (Mock)' : 'Offline Mode (Mock)'}</span>
          </div>
        )}
      </div>

      {/* Message Notifications */}
      {message && (
        <div className={`p-4 rounded-xl border flex items-start space-x-3 text-xs leading-relaxed ${
          message.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0" />
          )}
          <div>
            <p className="font-bold">{message.type === 'success' ? 'SUCCESS' : 'ERROR'}</p>
            <p className="font-sans text-[11px] mt-0.5">{message.text}</p>
          </div>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left Side: General Profile Info */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-secondary uppercase font-bold tracking-wider">
                {locale === 'vi' ? 'Họ và tên *' : 'Full Name *'}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Phan Duy Khang"
                className="w-full px-4 py-2.5 rounded-xl border border-border-custom bg-slate-950/40 text-text font-sans text-xs focus:outline-none focus:border-cyan-custom/50 focus:ring-1 focus:ring-cyan-custom/25 transition duration-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-secondary uppercase font-bold tracking-wider">
                {locale === 'vi' ? 'Chức danh công việc *' : 'Job Title *'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Full-Stack Developer"
                className="w-full px-4 py-2.5 rounded-xl border border-border-custom bg-slate-950/40 text-text font-sans text-xs focus:outline-none focus:border-cyan-custom/50 focus:ring-1 focus:ring-cyan-custom/25 transition duration-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-secondary uppercase font-bold tracking-wider">
                {locale === 'vi' ? 'Địa chỉ Email *' : 'Email Address *'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="khang.dt@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-border-custom bg-slate-950/40 text-text font-sans text-xs focus:outline-none focus:border-cyan-custom/50 focus:ring-1 focus:ring-cyan-custom/25 transition duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-secondary uppercase font-bold tracking-wider block">
                {locale === 'vi' ? 'Ảnh đại diện' : 'Avatar Profile Image'}
              </label>
              <div className="flex items-center space-x-4">
                {/* Preview avatar */}
                <div className="relative w-16 h-16 rounded-full border border-border-custom bg-slate-950/60 overflow-hidden shrink-0 flex items-center justify-center shadow-glow-sm">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Avatar Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/bottts/svg'; // generic fallback
                      }}
                    />
                  ) : (
                    <User className="w-8 h-8 text-secondary" />
                  )}
                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center">
                      <RefreshCw className="w-4 h-4 text-cyan-custom animate-spin" />
                    </div>
                  )}
                </div>

                {/* Upload action and state */}
                <div className="flex flex-col space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <label className="px-3 py-1.5 rounded-xl border border-cyan-custom/30 bg-cyan-custom/5 hover:bg-cyan-custom/15 text-cyan-custom text-xs flex items-center justify-center cursor-pointer select-none font-bold transition">
                      <Upload className="w-3.5 h-3.5 mr-1.5" />
                      <span>{uploadingAvatar ? (locale === 'vi' ? 'Đang tải...' : 'Uploading...') : (locale === 'vi' ? 'Tải ảnh lên' : 'Upload Image')}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAvatarUpload} 
                        className="hidden" 
                        disabled={uploadingAvatar}
                      />
                    </label>
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setAvatarUrl('')}
                        className="p-1.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition"
                        title={locale === 'vi' ? 'Xóa ảnh' : 'Remove Image'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder={locale === 'vi' ? 'Hoặc dán URL ảnh trực tiếp...' : 'Or paste image URL directly...'}
                    className="w-full px-3 py-1.5 rounded-xl border border-border-custom bg-slate-950/40 text-text font-sans text-xs focus:outline-none focus:border-cyan-custom/50 focus:ring-1 focus:ring-cyan-custom/25 transition duration-200"
                  />

                  <p className="text-[9px] text-secondary font-sans leading-tight">
                    {avatarUrl ? (
                      <span className="font-mono text-cyan-custom/75 break-all max-w-[250px] inline-block">{avatarUrl}</span>
                    ) : (
                      locale === 'vi' ? 'Chưa tải lên ảnh đại diện' : 'No avatar image uploaded'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Bios & Socials */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-secondary uppercase font-bold tracking-wider">
                {locale === 'vi' ? 'Đường dẫn GitHub (URL)' : 'GitHub Profile URL'}
              </label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-border-custom bg-slate-950/40 text-text font-sans text-xs focus:outline-none focus:border-cyan-custom/50 focus:ring-1 focus:ring-cyan-custom/25 transition duration-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-secondary uppercase font-bold tracking-wider">
                {locale === 'vi' ? 'Đường dẫn LinkedIn (URL)' : 'LinkedIn Profile URL'}
              </label>
              <input
                type="text"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-4 py-2.5 rounded-xl border border-border-custom bg-slate-950/40 text-text font-sans text-xs focus:outline-none focus:border-cyan-custom/50 focus:ring-1 focus:ring-cyan-custom/25 transition duration-200"
              />
            </div>

            <div>
              <RichTextEditor
                value={aboutMe}
                onChange={setAboutMe}
                label={locale === 'vi' ? 'Giới thiệu bản thân *' : 'About Me Bio *'}
                placeholder={locale === 'vi' ? 'Mô tả chi tiết kỹ năng, kinh nghiệm của bạn (Hỗ trợ định dạng Rich Text / Markdown)...' : 'Describe your skillset, backend experience (Rich Text / Markdown supported)...'}
                minHeight="min-h-[220px]"
              />
            </div>
          </div>

        </div>

        {/* CV Management Section */}
        <div className="border border-border-custom bg-slate-950/40 rounded-2xl p-5 space-y-4">
          <div className="flex items-center space-x-2 border-b border-border-custom/50 pb-3">
            <FileText className="w-4 h-4 text-cyan-custom" />
            <h4 className="text-xs font-bold text-text uppercase tracking-wider">
              {locale === 'vi' ? 'Quản lý Hồ sơ CV (Song ngữ VI / EN)' : 'CV Document Management (Bilingual VI / EN)'}
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vietnamese CV */}
            <div className="p-4 rounded-xl border border-border-custom bg-slate-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text flex items-center gap-1.5">
                  🇻🇳 {locale === 'vi' ? 'CV Tiếng Việt (PDF)' : 'Vietnamese CV (PDF)'}
                </span>
                {cvViUrl ? (
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                    {locale === 'vi' ? 'ĐÃ CẬP NHẬT' : 'UPLOADED'}
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                    {locale === 'vi' ? 'CHƯA CÓ' : 'EMPTY'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <label className="px-3 py-1.5 rounded-xl border border-cyan-custom/30 bg-cyan-custom/5 hover:bg-cyan-custom/15 text-cyan-custom text-xs flex items-center justify-center cursor-pointer select-none font-bold transition">
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  <span>{uploadingCvVi ? (locale === 'vi' ? 'Đang tải PDF...' : 'Uploading PDF...') : (locale === 'vi' ? 'Tải tệp PDF lên' : 'Upload PDF File')}</span>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleCvViUpload}
                    className="hidden"
                    disabled={uploadingCvVi}
                  />
                </label>

                {cvViUrl && (
                  <>
                    <a
                      href={cvViUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-xl border border-cyan-custom/30 text-cyan-custom hover:bg-cyan-custom/10 text-xs flex items-center gap-1 font-bold transition"
                      title={locale === 'vi' ? 'Xem trước' : 'Preview'}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{locale === 'vi' ? 'Xem' : 'View'}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setCvViUrl('')}
                      className="p-1.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition"
                      title={locale === 'vi' ? 'Xóa CV' : 'Remove CV'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>

              <input
                type="text"
                value={cvViUrl}
                onChange={(e) => setCvViUrl(e.target.value)}
                placeholder={locale === 'vi' ? 'Hoặc nhập link PDF trực tiếp...' : 'Or enter PDF URL directly...'}
                className="w-full px-3 py-1.5 rounded-xl border border-border-custom bg-slate-950/40 text-text font-sans text-xs focus:outline-none focus:border-cyan-custom/50 focus:ring-1 focus:ring-cyan-custom/25 transition duration-200"
              />
            </div>

            {/* English CV */}
            <div className="p-4 rounded-xl border border-border-custom bg-slate-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text flex items-center gap-1.5">
                  🇬🇧 {locale === 'vi' ? 'CV Tiếng Anh (PDF)' : 'English CV (PDF)'}
                </span>
                {cvEnUrl ? (
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                    {locale === 'vi' ? 'ĐÃ CẬP NHẬT' : 'UPLOADED'}
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                    {locale === 'vi' ? 'CHƯA CÓ' : 'EMPTY'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <label className="px-3 py-1.5 rounded-xl border border-cyan-custom/30 bg-cyan-custom/5 hover:bg-cyan-custom/15 text-cyan-custom text-xs flex items-center justify-center cursor-pointer select-none font-bold transition">
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  <span>{uploadingCvEn ? (locale === 'vi' ? 'Đang tải PDF...' : 'Uploading PDF...') : (locale === 'vi' ? 'Tải tệp PDF lên' : 'Upload PDF File')}</span>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleCvEnUpload}
                    className="hidden"
                    disabled={uploadingCvEn}
                  />
                </label>

                {cvEnUrl && (
                  <>
                    <a
                      href={cvEnUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-xl border border-cyan-custom/30 text-cyan-custom hover:bg-cyan-custom/10 text-xs flex items-center gap-1 font-bold transition"
                      title={locale === 'vi' ? 'Xem trước' : 'Preview'}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{locale === 'vi' ? 'Xem' : 'View'}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setCvEnUrl('')}
                      className="p-1.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition"
                      title={locale === 'vi' ? 'Xóa CV' : 'Remove CV'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>

              <input
                type="text"
                value={cvEnUrl}
                onChange={(e) => setCvEnUrl(e.target.value)}
                placeholder={locale === 'vi' ? 'Hoặc nhập link PDF trực tiếp...' : 'Or enter PDF URL directly...'}
                className="w-full px-3 py-1.5 rounded-xl border border-border-custom bg-slate-950/40 text-text font-sans text-xs focus:outline-none focus:border-cyan-custom/50 focus:ring-1 focus:ring-cyan-custom/25 transition duration-200"
              />
            </div>
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex justify-end pt-4 border-t border-border-custom/30">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-custom to-purple-custom hover:opacity-90 disabled:opacity-50 text-bg text-xs font-bold transition shadow-glow select-none"
          >
            {saving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{locale === 'vi' ? 'ĐANG LƯU HỒ SƠ...' : 'SAVING PROFILE...'}</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>{locale === 'vi' ? 'LƯU THÔNG TIN' : 'SAVE CHANGES'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
