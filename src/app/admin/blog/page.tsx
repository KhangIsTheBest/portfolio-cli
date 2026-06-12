'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit2, Trash2, ArrowLeft, Save, AlertTriangle, RefreshCw, Eye, EyeOff, Calendar, FileText } from 'lucide-react';
import { apiService } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';
import { Blog } from '@/types';

export default function AdminBlogsPage() {
  const { locale } = useLanguage();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // View state: 'LIST' or 'FORM'
  const [viewMode, setViewMode] = useState<'LIST' | 'FORM'>('LIST');
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await apiService.getBlogsAdmin();
      setBlogs(data);

      const token = localStorage.getItem('admin-token');
      if (token === 'mock-jwt-token-string') {
        setIsOfflineMode(true);
      }
    } catch (err) {
      console.error('Failed to load admin blogs:', err);
      setMessage({
        type: 'error',
        text: locale === 'vi' ? 'Lỗi khi tải danh sách bài viết.' : 'Failed to load blog posts.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [locale]);

  // Auto-slugify from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (editingId === null) {
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
    setFeatured(false);
    setPublished(true);
    setViewMode('FORM');
    setMessage(null);
  };

  const handleEdit = (blog: Blog) => {
    setEditingId(blog.id);
    setTitle(blog.title);
    setSlug(blog.slug);
    setShortDescription(blog.shortDescription);
    setContent(blog.content || '');
    setThumbnailUrl(blog.thumbnailUrl || '');
    setFeatured(blog.featured);
    setPublished(blog.published);
    setViewMode('FORM');
    setMessage(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(locale === 'vi' ? 'Bạn có chắc chắn muốn xóa bài viết này?' : 'Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      await apiService.deleteBlog(id);
      setMessage({
        type: 'success',
        text: locale === 'vi' ? 'Đã xóa bài viết thành công.' : 'Blog post deleted successfully.'
      });
      fetchBlogs();
    } catch (err) {
      console.error('Failed to delete blog:', err);
      setMessage({
        type: 'error',
        text: locale === 'vi' ? 'Lỗi khi xóa bài viết.' : 'Error deleting blog post.'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !shortDescription.trim() || !content.trim()) {
      setMessage({
        type: 'error',
        text: locale === 'vi' ? 'Vui lòng điền đủ tất cả các trường thông tin.' : 'Please fill in all details.'
      });
      return;
    }

    setSaving(true);
    const payload = {
      title,
      slug,
      shortDescription,
      content,
      thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643',
      featured,
      published
    };

    try {
      if (editingId !== null) {
        await apiService.updateBlog(editingId, payload);
        setMessage({
          type: 'success',
          text: locale === 'vi' ? 'Cập nhật bài viết thành công!' : 'Blog post updated successfully!'
        });
      } else {
        await apiService.createBlog(payload);
        setMessage({
          type: 'success',
          text: locale === 'vi' ? 'Thêm mới bài viết thành công!' : 'New blog post created successfully!'
        });
      }
      setViewMode('LIST');
      fetchBlogs();
    } catch (err) {
      console.error('Failed to save blog:', err);
      setMessage({
        type: 'error',
        text: locale === 'vi' ? 'Lỗi khi lưu bài viết.' : 'Error saving blog post.'
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
          {locale === 'vi' ? 'ĐANG ĐỌC BÀI VIẾT TỪ DATABASE...' : 'LOADING BLOG POSTS...'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-mono text-text">
      
      {/* Header title */}
      <div className="flex items-center justify-between border-b border-border-custom/50 pb-3">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-cyan-custom" />
          <h3 className="text-base font-bold text-text">
            {locale === 'vi' ? 'Quản lý bài viết Blog' : 'Blog Articles Manager'}
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
              <span>{locale === 'vi' ? 'Viết bài mới' : 'Compose Post'}</span>
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

      {/* Message banners */}
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

      {/* Blogs List */}
      {viewMode === 'LIST' && (
        <div className="space-y-4">
          {blogs.length === 0 ? (
            <div className="p-12 border border-dashed border-border-custom rounded-2xl text-center text-secondary text-xs">
              {locale === 'vi' ? 'Chưa có bài viết nào.' : 'No blog posts found.'}
            </div>
          ) : (
            <div className="overflow-x-auto border border-border-custom/80 rounded-2xl bg-slate-950/15">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-custom bg-slate-900/40 text-[9px] uppercase tracking-wider text-secondary">
                    <th className="p-4 font-bold">{locale === 'vi' ? 'Tiêu đề' : 'Title'}</th>
                    <th className="p-4 font-bold">{locale === 'vi' ? 'Đường dẫn tĩnh' : 'Slug'}</th>
                    <th className="p-4 font-bold">{locale === 'vi' ? 'Ngày tạo' : 'Created Date'}</th>
                    <th className="p-4 font-bold">{locale === 'vi' ? 'Trạng thái' : 'Status'}</th>
                    <th className="p-4 font-bold text-right">{locale === 'vi' ? 'Hành động' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-custom/40 font-sans text-xs">
                  {blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-slate-900/10 transition">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-border-custom/50 flex items-center justify-center text-secondary shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-text block max-w-xs truncate">{blog.title}</span>
                            {blog.featured && (
                              <span className="text-[7.5px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-custom font-mono mt-1 inline-block">
                                {locale === 'vi' ? 'NỔI BẬT' : 'FEATURED'}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-[11px] text-secondary">{blog.slug}</td>
                      <td className="p-4 font-mono text-[10px] text-secondary">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {blog.published ? (
                          <span className="inline-flex items-center space-x-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold">
                            <Eye className="w-3 h-3" />
                            <span>{locale === 'vi' ? 'CÔNG KHAI' : 'PUBLISHED'}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-secondary bg-slate-800/40 border border-border-custom px-2 py-0.5 rounded-full text-[9px] font-mono font-bold">
                            <EyeOff className="w-3 h-3" />
                            <span>{locale === 'vi' ? 'BẢN NHÁP' : 'DRAFT'}</span>
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center space-x-1.5 font-mono">
                          <button
                            onClick={() => handleEdit(blog)}
                            className="p-1.5 rounded-lg border border-border-custom text-secondary hover:text-cyan-custom hover:bg-slate-800 transition"
                            title={locale === 'vi' ? 'Sửa' : 'Edit'}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(blog.id)}
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

      {/* Blog form editor */}
      {viewMode === 'FORM' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Editor Text Fields */}
            <div className="lg:col-span-2 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-secondary uppercase font-bold tracking-wider">
                  {locale === 'vi' ? 'Tiêu đề bài viết *' : 'Article Title *'}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Clean Code Architecture in Spring Boot"
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
                  placeholder="clean-code-architecture-spring-boot"
                  className="w-full px-4 py-2.5 rounded-xl border border-border-custom bg-slate-950/40 text-text font-mono text-xs focus:outline-none focus:border-cyan-custom/50 focus:ring-1 focus:ring-cyan-custom/25 transition duration-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-secondary uppercase font-bold tracking-wider">
                  {locale === 'vi' ? 'Tóm tắt bài viết *' : 'Short Description *'}
                </label>
                <textarea
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  rows={2}
                  placeholder="Describe what this article covers..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border-custom bg-slate-950/40 text-text font-sans text-xs focus:outline-none focus:border-cyan-custom/50 focus:ring-1 focus:ring-cyan-custom/25 transition duration-200 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-secondary uppercase font-bold tracking-wider">
                  {locale === 'vi' ? 'Nội dung bài viết (Markdown) *' : 'Markdown Article Content *'}
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={14}
                  placeholder="# Write your markdown headers, code snippets, paragraphs here..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border-custom bg-slate-950/40 text-text font-mono text-xs focus:outline-none focus:border-cyan-custom/50 focus:ring-1 focus:ring-cyan-custom/25 transition duration-200 resize-y"
                />
              </div>
            </div>

            {/* Sidebar form toggles */}
            <div className="lg:col-span-1 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-secondary uppercase font-bold tracking-wider">
                  {locale === 'vi' ? 'Link ảnh đại diện bài viết' : 'Thumbnail Image URL'}
                </label>
                <input
                  type="text"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border-custom bg-slate-950/40 text-text font-sans text-xs focus:outline-none focus:border-cyan-custom/50 transition duration-200"
                />
              </div>

              {/* Status checklist settings */}
              <div className="p-4 rounded-xl border border-border-custom bg-slate-950/20 space-y-4">
                <span className="text-[10px] text-secondary uppercase font-bold tracking-wider block border-b border-border-custom/30 pb-1.5">
                  {locale === 'vi' ? 'Thiết lập xuất bản' : 'Publish Settings'}
                </span>

                <label className="flex items-center justify-between cursor-pointer py-1.5">
                  <span className="text-[10px] text-text font-medium">
                    {locale === 'vi' ? 'Công khai bài viết?' : 'Publish Immediately?'}
                  </span>
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4 rounded border-border-custom text-cyan-custom focus:ring-0 accent-cyan-custom bg-slate-900"
                  />
                </label>

                <label className="flex items-center justify-between border-t border-border-custom/30 pt-3 cursor-pointer py-1.5">
                  <span className="text-[10px] text-text font-medium">
                    {locale === 'vi' ? 'Đưa lên nổi bật?' : 'Feature Post?'}
                  </span>
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded border-border-custom text-purple-custom focus:ring-0 accent-purple-custom bg-slate-900"
                  />
                </label>
              </div>
            </div>

          </div>

          {/* Form Actions buttons */}
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
                  <span>{locale === 'vi' ? 'XUẤT BẢN BLOG' : 'PUBLISH BLOG'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
