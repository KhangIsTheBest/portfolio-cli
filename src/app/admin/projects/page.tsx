'use client';

import React, { useState, useEffect } from 'react';
import { FolderGit2, Plus, Edit2, Trash2, ArrowLeft, Save, AlertTriangle, RefreshCw, Eye, EyeOff, Globe } from 'lucide-react';
import { apiService } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';
import { Project, Technology } from '@/types';

export default function AdminProjectsPage() {
  const { locale } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // View mode state: 'LIST' or 'FORM'
  const [viewMode, setViewMode] = useState<'LIST' | 'FORM'>('LIST');
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('PUBLISHED');
  const [selectedTechIds, setSelectedTechIds] = useState<number[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projData, techData] = await Promise.all([
        apiService.getProjects(),
        apiService.getTechnologies()
      ]);
      setProjects(projData);
      setTechnologies(techData);

      const token = localStorage.getItem('admin-token');
      if (token === 'mock-jwt-token-string') {
        setIsOfflineMode(true);
      }
    } catch (err) {
      console.error('Failed to load projects/techs:', err);
      setMessage({
        type: 'error',
        text: locale === 'vi' ? 'Lỗi khi tải dữ liệu dự án.' : 'Failed to load projects data.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [locale]);

  // Handle auto slug generation from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (editingId === null) {
      // Auto-slugify
      const generatedSlug = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove Vietnamese accents
        .replace(/[^a-z0-9\s-]/g, '')    // remove special chars
        .replace(/\s+/g, '-')            // replace spaces with hyphens
        .replace(/-+/g, '-')             // remove consecutive hyphens
        .trim();
      setSlug(generatedSlug);
    }
  };

  const handleCreateNew = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setShortDescription('');
    setContent('');
    setThumbnailUrl('');
    setGithubUrl('');
    setDemoUrl('');
    setFeatured(false);
    setStatus('PUBLISHED');
    setSelectedTechIds([]);
    setViewMode('FORM');
    setMessage(null);
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setTitle(project.title);
    setSlug(project.slug);
    setShortDescription(project.shortDescription);
    setContent(project.content || '');
    setThumbnailUrl(project.thumbnailUrl);
    setGithubUrl(project.githubUrl || '');
    setDemoUrl(project.demoUrl || '');
    setFeatured(project.featured);
    setStatus(project.status);
    setSelectedTechIds(project.technologies.map(t => t.id));
    setViewMode('FORM');
    setMessage(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(locale === 'vi' ? 'Bạn có muốn xóa dự án này không?' : 'Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await apiService.deleteProject(id);
      setMessage({
        type: 'success',
        text: locale === 'vi' ? 'Đã xóa dự án thành công.' : 'Project deleted successfully.'
      });
      fetchData();
    } catch (err) {
      console.error('Failed to delete project:', err);
      setMessage({
        type: 'error',
        text: locale === 'vi' ? 'Không thể xóa dự án.' : 'Failed to delete project.'
      });
    }
  };

  const handleTechToggle = (techId: number) => {
    setSelectedTechIds(prev => 
      prev.includes(techId) ? prev.filter(id => id !== techId) : [...prev, techId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !shortDescription.trim()) {
      setMessage({
        type: 'error',
        text: locale === 'vi' ? 'Vui lòng điền đủ thông tin tiêu đề, slug và mô tả ngắn.' : 'Please fill out title, slug, and short description.'
      });
      return;
    }

    setSaving(true);
    const payload = {
      title,
      slug,
      shortDescription,
      content,
      thumbnailUrl,
      githubUrl,
      demoUrl,
      featured,
      status,
      technologyIds: selectedTechIds
    };

    try {
      if (editingId !== null) {
        await apiService.updateProject(editingId, payload);
        setMessage({
          type: 'success',
          text: locale === 'vi' ? 'Cập nhật dự án thành công!' : 'Project updated successfully!'
        });
      } else {
        await apiService.createProject(payload);
        setMessage({
          type: 'success',
          text: locale === 'vi' ? 'Thêm mới dự án thành công!' : 'New project added successfully!'
        });
      }
      setViewMode('LIST');
      fetchData();
    } catch (err) {
      console.error('Failed to save project:', err);
      setMessage({
        type: 'error',
        text: locale === 'vi' ? 'Lỗi khi lưu dự án. Vui lòng kiểm tra lại.' : 'Error saving project. Please try again.'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading && viewMode === 'LIST') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-cyan-custom space-y-4">
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-custom/20 animate-pulse" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-custom animate-spin" />
        </div>
        <p className="font-mono text-xs tracking-wider animate-pulse">
          {locale === 'vi' ? 'ĐANG ĐỌC DANH SÁCH DỰ ÁN...' : 'LOADING PROJECTS CATALOG...'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-mono text-text">
      
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-border-custom/50 pb-3">
        <div className="flex items-center space-x-2">
          <FolderGit2 className="w-5 h-5 text-cyan-custom" />
          <h3 className="text-base font-bold text-text">
            {locale === 'vi' ? 'Quản lý dự án (Projects)' : 'Projects Manager'}
          </h3>
        </div>

        <div className="flex items-center space-x-3">
          {isOfflineMode && (
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] uppercase font-bold animate-pulse select-none">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{locale === 'vi' ? 'Mock Mode' : 'Mock Mode'}</span>
            </div>
          )}
          
          {viewMode === 'LIST' ? (
            <button
              onClick={handleCreateNew}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-custom/10 hover:bg-cyan-custom/20 border border-cyan-custom/30 text-cyan-custom text-xs font-bold transition select-none"
            >
              <Plus className="w-4 h-4" />
              <span>{locale === 'vi' ? 'Thêm mới' : 'Add New'}</span>
            </button>
          ) : (
            <button
              onClick={() => setViewMode('LIST')}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border border-border-custom text-secondary hover:text-text text-xs font-bold transition select-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{locale === 'vi' ? 'Quay lại' : 'Back'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Messaging alerts */}
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

      {/* Viewmode: Projects List View */}
      {viewMode === 'LIST' && (
        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className="p-12 border border-dashed border-border-custom rounded-2xl text-center text-secondary text-xs">
              {locale === 'vi' ? 'Chưa có dự án nào được khởi tạo.' : 'No projects found in database.'}
            </div>
          ) : (
            <div className="overflow-x-auto border border-border-custom/80 rounded-2xl bg-slate-950/15">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-custom bg-slate-900/40 text-[9px] uppercase tracking-wider text-secondary">
                    <th className="p-4 font-bold">{locale === 'vi' ? 'Tên dự án' : 'Project Title'}</th>
                    <th className="p-4 font-bold">{locale === 'vi' ? 'Đường dẫn (Slug)' : 'Slug'}</th>
                    <th className="p-4 font-bold">{locale === 'vi' ? 'Trạng thái' : 'Status'}</th>
                    <th className="p-4 font-bold">{locale === 'vi' ? 'Nổi bật' : 'Featured'}</th>
                    <th className="p-4 font-bold text-right">{locale === 'vi' ? 'Hành động' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-custom/40 font-sans text-xs">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-slate-900/10 transition">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={project.thumbnailUrl || 'https://images.unsplash.com/photo-1542831371-29b0f74f9713'} 
                            alt={project.title}
                            className="w-10 h-7 rounded border border-border-custom object-cover shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=80';
                            }}
                          />
                          <div>
                            <span className="font-bold text-text">{project.title}</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {project.technologies.map(t => (
                                <span key={t.id} className="px-1.5 py-0.5 rounded text-[8px] bg-slate-900 text-cyan-custom border border-border-custom/40 font-mono">
                                  {t.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-[11px] text-secondary">{project.slug}</td>
                      <td className="p-4">
                        {project.status === 'PUBLISHED' ? (
                          <span className="inline-flex items-center space-x-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold">
                            <Eye className="w-3 h-3" />
                            <span>{locale === 'vi' ? 'HIỂN THỊ' : 'PUBLISHED'}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-secondary bg-slate-800/40 border border-border-custom px-2 py-0.5 rounded-full text-[9px] font-mono font-bold">
                            <EyeOff className="w-3 h-3" />
                            <span>{locale === 'vi' ? 'BẢN NHÁP' : 'DRAFT'}</span>
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {project.featured ? (
                          <span className="text-[10px] text-purple-custom font-bold">YES</span>
                        ) : (
                          <span className="text-[10px] text-secondary">NO</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center space-x-1.5 font-mono">
                          <button
                            onClick={() => handleEdit(project)}
                            className="p-1.5 rounded-lg border border-border-custom text-secondary hover:text-cyan-custom hover:bg-slate-800 transition"
                            title={locale === 'vi' ? 'Sửa' : 'Edit'}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="p-1.5 rounded-lg border border-border-custom text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
                            title={locale === 'vi' ? 'Xóa' : 'Delete'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Viewmode: Add/Edit Project Form Editor */}
      {viewMode === 'FORM' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left/Middle Column: Core Text Fields */}
            <div className="lg:col-span-2 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-secondary uppercase font-bold tracking-wider">
                  {locale === 'vi' ? 'Tiêu đề dự án *' : 'Project Title *'}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Portfolio CLI Website"
                  className="w-full px-4 py-2.5 rounded-xl border border-border-custom bg-slate-950/40 text-text font-sans text-xs focus:outline-none focus:border-cyan-custom/50 focus:ring-1 focus:ring-cyan-custom/25 transition duration-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-secondary uppercase font-bold tracking-wider">
                  {locale === 'vi' ? 'Đường dẫn tĩnh (Slug) *' : 'Slug *'}
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. portfolio-cli-website"
                  className="w-full px-4 py-2.5 rounded-xl border border-border-custom bg-slate-950/40 text-text font-mono text-xs focus:outline-none focus:border-cyan-custom/50 focus:ring-1 focus:ring-cyan-custom/25 transition duration-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-secondary uppercase font-bold tracking-wider">
                  {locale === 'vi' ? 'Mô tả ngắn *' : 'Short Description *'}
                </label>
                <textarea
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  rows={2}
                  placeholder="Summarize the project..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border-custom bg-slate-950/40 text-text font-sans text-xs focus:outline-none focus:border-cyan-custom/50 focus:ring-1 focus:ring-cyan-custom/25 transition duration-200 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-secondary uppercase font-bold tracking-wider">
                  {locale === 'vi' ? 'Nội dung chi tiết (Markdown / Text)' : 'Detailed Description (Markdown)'}
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  placeholder="Describe your implementation details, challenges, architecture..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border-custom bg-slate-950/40 text-text font-mono text-xs focus:outline-none focus:border-cyan-custom/50 focus:ring-1 focus:ring-cyan-custom/25 transition duration-200 resize-y"
                />
              </div>
            </div>

            {/* Right Column: URLs, Status, Tech Checkboxes */}
            <div className="lg:col-span-1 space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[10px] text-secondary uppercase font-bold tracking-wider">
                  {locale === 'vi' ? 'Link ảnh nền đại diện' : 'Thumbnail Image URL'}
                </label>
                <input
                  type="text"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border-custom bg-slate-950/40 text-text font-sans text-xs focus:outline-none focus:border-cyan-custom/50 transition duration-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-secondary uppercase font-bold tracking-wider">
                  {locale === 'vi' ? 'Mã nguồn GitHub' : 'GitHub Repository URL'}
                </label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-3 w-4 h-4 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                  <input
                    type="text"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-custom bg-slate-950/40 text-text font-sans text-xs focus:outline-none focus:border-cyan-custom/50 transition duration-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-secondary uppercase font-bold tracking-wider">
                  {locale === 'vi' ? 'Link chạy thử Live Demo' : 'Live Demo URL'}
                </label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-3 w-4 h-4 text-secondary" />
                  <input
                    type="text"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    placeholder="https://demo.example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-custom bg-slate-950/40 text-text font-sans text-xs focus:outline-none focus:border-cyan-custom/50 transition duration-200"
                  />
                </div>
              </div>

              {/* Status and Featured toggles */}
              <div className="p-4 rounded-xl border border-border-custom bg-slate-950/20 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-secondary uppercase font-bold tracking-wider">
                    {locale === 'vi' ? 'Trạng thái hiển thị' : 'Publish Status'}
                  </span>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="px-2.5 py-1 rounded bg-slate-900 border border-border-custom text-text text-xs focus:outline-none focus:border-cyan-custom/50"
                  >
                    <option value="PUBLISHED">{locale === 'vi' ? 'Hiển thị' : 'Published'}</option>
                    <option value="DRAFT">{locale === 'vi' ? 'Bản nháp' : 'Draft'}</option>
                  </select>
                </div>

                <div className="flex items-center justify-between border-t border-border-custom/30 pt-3">
                  <span className="text-[10px] text-secondary uppercase font-bold tracking-wider">
                    {locale === 'vi' ? 'Dự án nổi bật?' : 'Featured Project?'}
                  </span>
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded border-border-custom text-cyan-custom focus:ring-0 focus:ring-offset-0 accent-cyan-custom bg-slate-900"
                  />
                </div>
              </div>

              {/* Technologies Checklist */}
              <div className="p-4 rounded-xl border border-border-custom bg-slate-950/20 space-y-2.5">
                <span className="text-[10px] text-secondary uppercase font-bold tracking-wider block border-b border-border-custom/30 pb-1.5">
                  {locale === 'vi' ? 'Danh sách công nghệ' : 'Assign Technologies'}
                </span>
                
                {technologies.length === 0 ? (
                  <p className="text-[10px] text-secondary font-sans">
                    {locale === 'vi' ? 'Vui lòng cấu hình Kỹ năng trước.' : 'Please add skills in the skills panel first.'}
                  </p>
                ) : (
                  <div className="max-h-[160px] overflow-y-auto space-y-1.5 pr-1 font-sans text-xs">
                    {technologies.map(tech => (
                      <label 
                        key={tech.id} 
                        className="flex items-center space-x-2.5 py-1 px-1.5 hover:bg-slate-900/40 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTechIds.includes(tech.id)}
                          onChange={() => handleTechToggle(tech.id)}
                          className="w-3.5 h-3.5 rounded border-border-custom text-purple-custom focus:ring-0 focus:ring-offset-0 accent-purple-custom bg-slate-900"
                        />
                        <span className="text-text font-medium">{tech.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Form Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t border-border-custom/30">
            <button
              type="button"
              onClick={() => setViewMode('LIST')}
              className="px-5 py-2.5 rounded-xl border border-border-custom text-secondary hover:text-text text-xs font-bold transition select-none"
            >
              {locale === 'vi' ? 'HỦY BỎ' : 'CANCEL'}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-custom to-purple-custom text-bg text-xs font-bold transition shadow-glow select-none"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{locale === 'vi' ? 'ĐANG LƯU...' : 'SAVING...'}</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>{locale === 'vi' ? 'LƯU DỰ ÁN' : 'SAVE PROJECT'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
