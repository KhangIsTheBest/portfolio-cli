'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, Plus, Edit2, Trash2, X, Check, AlertTriangle, RefreshCw, Code, Database, Server, Terminal, Cloud, FileCode, Layers, Monitor, Radio } from 'lucide-react';
import { apiService } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';
import { Technology } from '@/types';

// Preset icon list for selection
const PRESET_ICONS = [
  { value: 'Java', label: 'Java', icon: FileCode },
  { value: 'Spring', label: 'Spring Boot', icon: Server },
  { value: 'TypeScript', label: 'TypeScript', icon: Code },
  { value: 'React', label: 'React / Next.js', icon: Monitor },
  { value: 'Tailwind', label: 'Tailwind CSS', icon: Layers },
  { value: 'PostgreSQL', label: 'PostgreSQL / SQL', icon: Database },
  { value: 'Docker', label: 'Docker / DevOps', icon: Cloud },
  { value: 'Git', label: 'Git / VCS', icon: Radio },
  { value: 'API', label: 'RESTful API', icon: Terminal },
  { value: 'Code', label: 'Generic Code', icon: Code }
];

export default function AdminSkillsPage() {
  const { locale } = useLanguage();
  const [skills, setSkills] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Form states
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [iconUrl, setIconUrl] = useState('Code');

  // Fetch all technologies
  const fetchSkills = async () => {
    try {
      setLoading(true);
      const data = await apiService.getTechnologies();
      setSkills(data);

      const token = localStorage.getItem('admin-token');
      if (token === 'mock-jwt-token-string') {
        setIsOfflineMode(true);
      }
    } catch (err) {
      console.error('Failed to load technologies:', err);
      setMessage({
        type: 'error',
        text: locale === 'vi' ? 'Không thể tải danh sách kỹ năng.' : 'Failed to load skills list.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [locale]);

  // Open form for creating
  const handleCreateNew = () => {
    setEditingId(null);
    setName('');
    setIconUrl('Code');
    setFormOpen(true);
    setMessage(null);
  };

  // Open form for editing
  const handleEdit = (tech: Technology) => {
    setEditingId(tech.id);
    setName(tech.name);
    setIconUrl(tech.iconUrl || 'Code');
    setFormOpen(true);
    setMessage(null);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!window.confirm(locale === 'vi' ? 'Bạn có chắc chắn muốn xóa kỹ năng này?' : 'Are you sure you want to delete this skill?')) {
      return;
    }

    try {
      await apiService.deleteTechnology(id);
      setMessage({
        type: 'success',
        text: locale === 'vi' ? 'Đã xóa kỹ năng thành công.' : 'Skill deleted successfully.'
      });
      // Refresh list
      fetchSkills();
    } catch (err) {
      console.error('Failed to delete technology:', err);
      setMessage({
        type: 'error',
        text: locale === 'vi' ? 'Lỗi khi xóa kỹ năng.' : 'Error deleting skill.'
      });
    }
  };

  // Handle submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setMessage({
        type: 'error',
        text: locale === 'vi' ? 'Tên kỹ năng không được để trống.' : 'Skill name cannot be empty.'
      });
      return;
    }

    setSaving(true);
    try {
      if (editingId !== null) {
        // Update mode
        await apiService.updateTechnology(editingId, { name, iconUrl });
        setMessage({
          type: 'success',
          text: locale === 'vi' ? 'Cập nhật kỹ năng thành công!' : 'Skill updated successfully!'
        });
      } else {
        // Create mode
        await apiService.createTechnology({ name, iconUrl });
        setMessage({
          type: 'success',
          text: locale === 'vi' ? 'Thêm mới kỹ năng thành công!' : 'New skill added successfully!'
        });
      }
      setFormOpen(false);
      fetchSkills();
    } catch (err) {
      console.error('Failed to save technology:', err);
      setMessage({
        type: 'error',
        text: locale === 'vi' ? 'Không thể lưu thông tin kỹ năng.' : 'Failed to save skill details.'
      });
    } finally {
      setSaving(false);
    }
  };

  // Get icon component based on preset value
  const getIconComponent = (key: string) => {
    const found = PRESET_ICONS.find(item => item.value === key);
    return found ? found.icon : Code;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-cyan-custom space-y-4">
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-custom/20 animate-pulse" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-custom animate-spin" />
        </div>
        <p className="font-mono text-xs tracking-wider animate-pulse">
          {locale === 'vi' ? 'ĐANG TẢI DANH SÁCH KỸ NĂNG...' : 'LOADING SKILLS LIST...'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-mono text-text">
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-border-custom/50 pb-3">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-cyan-custom" />
          <h3 className="text-base font-bold text-text">
            {locale === 'vi' ? 'Quản lý kỹ năng & Công nghệ' : 'Skills & Tech Stack Manager'}
          </h3>
        </div>

        <div className="flex items-center space-x-3">
          {isOfflineMode && (
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] uppercase font-bold animate-pulse select-none">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{locale === 'vi' ? 'Mock Mode' : 'Mock Mode'}</span>
            </div>
          )}
          
          <button
            onClick={handleCreateNew}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-custom/10 hover:bg-cyan-custom/20 border border-cyan-custom/30 text-cyan-custom text-xs font-bold transition select-none"
          >
            <Plus className="w-4 h-4" />
            <span>{locale === 'vi' ? 'Thêm mới' : 'Add New'}</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className={`p-4 rounded-xl border flex items-center space-x-3 text-xs ${
          message.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Inline Form / Dialog Modal */}
      {formOpen && (
        <div className="p-5 border border-cyan-custom/30 bg-slate-950/40 rounded-2xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-border-custom/50 pb-2">
            <h4 className="text-xs font-bold text-cyan-custom">
              {editingId !== null 
                ? (locale === 'vi' ? 'CẬP NHẬT KỸ NĂNG' : 'EDIT SKILL')
                : (locale === 'vi' ? 'THÊM KỸ NĂNG MỚI' : 'CREATE NEW SKILL')
              }
            </h4>
            <button 
              onClick={() => setFormOpen(false)}
              className="text-secondary hover:text-text"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-[9px] text-secondary uppercase font-bold tracking-wider">
                {locale === 'vi' ? 'Tên kỹ năng *' : 'Skill Name *'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Next.js, Java, Rust"
                className="w-full px-3 py-2 rounded-xl border border-border-custom bg-slate-900/60 text-text font-sans text-xs focus:outline-none focus:border-cyan-custom/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] text-secondary uppercase font-bold tracking-wider">
                {locale === 'vi' ? 'Biểu tượng hiển thị' : 'Display Icon'}
              </label>
              <select
                value={iconUrl}
                onChange={(e) => setIconUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border-custom bg-slate-900/60 text-text font-sans text-xs focus:outline-none focus:border-cyan-custom/50"
              >
                {PRESET_ICONS.map((preset) => (
                  <option key={preset.value} value={preset.value} className="bg-slate-950 text-text">
                    {preset.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 flex justify-end space-x-2 pt-2 border-t border-border-custom/30">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="px-4 py-2 rounded-xl border border-border-custom text-secondary hover:text-text text-[10px] uppercase font-bold transition"
              >
                {locale === 'vi' ? 'Hủy' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-custom to-purple-custom text-bg text-[10px] uppercase font-bold transition shadow-glow"
              >
                {saving ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <Check className="w-3 h-3" />
                )}
                <span>{locale === 'vi' ? 'Lưu lại' : 'Save'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of skills */}
      {skills.length === 0 ? (
        <div className="p-12 border border-dashed border-border-custom rounded-2xl text-center text-secondary text-xs">
          {locale === 'vi' ? 'Chưa có kỹ năng nào được lưu trữ.' : 'No skills found in database.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {skills.map((tech) => {
            const Icon = getIconComponent(tech.iconUrl || 'Code');
            return (
              <div
                key={tech.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-border-custom bg-slate-950/20 hover:border-border-custom/80 transition group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-border-custom flex items-center justify-center text-cyan-custom/75 group-hover:text-cyan-custom transition">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-text font-sans">
                    {tech.name}
                  </span>
                </div>

                <div className="flex items-center space-x-1 opacity-60 group-hover:opacity-100 transition duration-200">
                  <button
                    onClick={() => handleEdit(tech)}
                    className="p-1.5 rounded-lg border border-border-custom text-secondary hover:text-cyan-custom hover:bg-slate-800 transition"
                    title={locale === 'vi' ? 'Sửa' : 'Edit'}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(tech.id)}
                    className="p-1.5 rounded-lg border border-border-custom text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
                    title={locale === 'vi' ? 'Xóa' : 'Delete'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
