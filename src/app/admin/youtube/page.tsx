'use client';

import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Plus, 
  Edit2, 
  Trash2, 
  ArrowLeft, 
  Save, 
  ExternalLink, 
  Clock, 
  RefreshCw,
  Play,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { Youtube } from '@/components/YoutubeIcon';
import { api } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';

import { YouTubeVideo } from '@/types';

export default function AdminYouTubePage() {
  const { locale } = useLanguage();
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [viewMode, setViewMode] = useState<'LIST' | 'FORM'>('LIST');
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Java & Spring Boot');
  const [duration, setDuration] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);

  const extractVideoId = (url: string): string => {
    if (!url) return '';
    try {
      if (url.includes('youtu.be/')) {
        return url.split('youtu.be/')[1].split(/[?#]/)[0];
      }
      if (url.includes('watch?v=')) {
        return url.split('watch?v=')[1].split('&')[0];
      }
      if (url.includes('embed/')) {
        return url.split('embed/')[1].split(/[?#]/)[0];
      }
    } catch {
      return '';
    }
    return '';
  };

  const currentVideoId = extractVideoId(youtubeUrl);
  const previewThumbnail = currentVideoId ? `https://img.youtube.com/vi/${currentVideoId}/hqdefault.jpg` : '';

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const data = await api.getYouTubeVideosAdmin();
      setVideos(data);
    } catch (err: any) {
      console.error('Failed to load YouTube videos for admin:', err);
      // Fallback
      const publicVideos = await api.getYouTubeVideos().catch(() => []);
      setVideos(publicVideos);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingId(null);
    setTitle('');
    setYoutubeUrl('');
    setDescription('');
    setCategory('Java & Spring Boot');
    setDuration('');
    setDisplayOrder(videos.length);
    setFeatured(false);
    setActive(true);
    setViewMode('FORM');
    setMessage(null);
  };

  const handleEdit = (video: YouTubeVideo) => {
    setEditingId(video.id);
    setTitle(video.title);
    setYoutubeUrl(video.youtubeUrl);
    setDescription(video.description || '');
    setCategory(video.category || 'Java & Spring Boot');
    setDuration(video.duration || '');
    setDisplayOrder(video.displayOrder || 0);
    setFeatured(video.featured);
    setActive(video.active);
    setViewMode('FORM');
    setMessage(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(locale === 'vi' ? 'Bạn có chắc chắn muốn xóa video này không?' : 'Are you sure you want to delete this video?')) {
      return;
    }
    try {
      await api.deleteYouTubeVideo(id);
      setMessage({
        type: 'success',
        text: locale === 'vi' ? 'Đã xóa video thành công!' : 'Video deleted successfully!'
      });
      fetchVideos();
    } catch (err: any) {
      console.error('Failed to delete video:', err);
      setMessage({
        type: 'error',
        text: err.message || 'Lỗi khi xóa video'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !youtubeUrl.trim()) {
      setMessage({
        type: 'error',
        text: locale === 'vi' ? 'Vui lòng nhập tiêu đề và link YouTube!' : 'Please enter title and YouTube URL!'
      });
      return;
    }

    setSaving(true);
    const payload = {
      title: title.trim(),
      youtubeUrl: youtubeUrl.trim(),
      description: description.trim() || undefined,
      category: category.trim() || undefined,
      duration: duration.trim() || undefined,
      displayOrder,
      featured,
      active
    };

    try {
      if (editingId !== null) {
        await api.updateYouTubeVideo(editingId, payload);
        setMessage({
          type: 'success',
          text: locale === 'vi' ? 'Cập nhật video thành công!' : 'Video updated successfully!'
        });
      } else {
        await api.createYouTubeVideo(payload);
        setMessage({
          type: 'success',
          text: locale === 'vi' ? 'Thêm video mới thành công!' : 'New video created successfully!'
        });
      }
      setViewMode('LIST');
      fetchVideos();
    } catch (err: any) {
      console.error('Failed to save video:', err);
      setMessage({
        type: 'error',
        text: err.message || 'Lỗi khi lưu video'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-mono text-text select-text">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-custom/50 pb-3">
        <div className="flex items-center space-x-2">
          <Youtube className="w-5 h-5 text-rose-500" />
          <h3 className="text-base font-bold text-text">
            {locale === 'vi' ? 'Quản lý Video YouTube' : 'YouTube Video Studio'}
          </h3>
        </div>

        <div>
          {viewMode === 'LIST' ? (
            <button
              onClick={handleCreateNew}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition select-none shadow-md shadow-rose-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{locale === 'vi' ? 'Thêm Video' : 'Add Video'}</span>
            </button>
          ) : (
            <button
              onClick={() => setViewMode('LIST')}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border border-border-custom text-secondary hover:text-text text-xs font-bold transition select-none cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{locale === 'vi' ? 'Quay lại' : 'Back'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Message feedback */}
      {message && (
        <div className={`p-3 rounded-xl border text-xs font-mono ${
          message.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Mode 1: Videos List */}
      {viewMode === 'LIST' && (
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[250px] space-y-3 text-rose-500">
              <RefreshCw className="w-8 h-8 animate-spin" />
              <p className="text-xs">{locale === 'vi' ? 'ĐANG TẢI DANH SÁCH VIDEO...' : 'LOADING VIDEOS...'}</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="p-12 text-center text-secondary border border-dashed border-border-custom rounded-2xl bg-card-custom/40">
              <Youtube className="w-10 h-10 mx-auto text-rose-500/60 mb-2" />
              <p className="text-xs">{locale === 'vi' ? 'Chưa có video nào. Hãy thêm video đầu tiên!' : 'No videos found. Add your first video!'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border-custom bg-card-custom shadow-xl">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-border-custom text-secondary uppercase text-[10px] tracking-wider bg-slate-950/40">
                    <th className="py-3 px-3">Thumbnail</th>
                    <th className="py-3 px-3">Title & Link</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Duration</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-custom">
                  {videos.map((vid) => {
                    const thumb = vid.thumbnailUrl || (vid.videoId ? `https://img.youtube.com/vi/${vid.videoId}/hqdefault.jpg` : '');
                    return (
                      <tr key={vid.id} className="hover:bg-slate-900/40 transition">
                        <td className="py-3 px-3">
                          <div className="w-20 h-12 rounded-lg overflow-hidden border border-border-custom bg-black relative">
                            {thumb ? (
                              <img src={thumb} alt={vid.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-secondary">
                                <Video className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-text font-sans line-clamp-1 max-w-xs">{vid.title}</div>
                          <a
                            href={vid.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-rose-400 hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <span>{vid.videoId || vid.youtubeUrl}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            {vid.category || 'General'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-secondary">
                          {vid.duration || 'N/A'}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            vid.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {vid.active ? 'Active' : 'Hidden'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(vid)}
                              className="p-1.5 rounded-lg border border-border-custom text-secondary hover:text-cyan-custom hover:bg-slate-800 transition cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(vid.id)}
                              className="p-1.5 rounded-lg border border-border-custom text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Form Add/Edit */}
      {viewMode === 'FORM' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Form Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-secondary uppercase font-bold tracking-wider">
                  {locale === 'vi' ? 'Tiêu đề Video *' : 'Video Title *'}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Xây dựng Kiến trúc Microservices với Spring Boot 3"
                  className="w-full px-4 py-2.5 rounded-xl border border-border-custom bg-slate-950/40 text-text font-sans text-xs focus:outline-none focus:border-rose-500/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-secondary uppercase font-bold tracking-wider">
                  {locale === 'vi' ? 'Đường link YouTube *' : 'YouTube URL *'}
                </label>
                <div className="relative">
                  <Youtube className="w-4 h-4 text-rose-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... hoặc https://youtu.be/..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-custom bg-slate-950/40 text-text font-mono text-xs focus:outline-none focus:border-rose-500/50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-secondary uppercase font-bold tracking-wider">
                    {locale === 'vi' ? 'Chuyên đề / Danh mục' : 'Category'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border-custom bg-slate-950/40 text-text text-xs focus:outline-none focus:border-rose-500/50"
                  >
                    <option value="Java & Spring Boot">Java & Spring Boot</option>
                    <option value="LeetCode & DSA">LeetCode & DSA</option>
                    <option value="System Design">System Design</option>
                    <option value="DevOps & Cloud">DevOps & Cloud</option>
                    <option value="General Coding">General Coding</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-secondary uppercase font-bold tracking-wider">
                    {locale === 'vi' ? 'Thời lượng (VD: 24:15)' : 'Duration (e.g. 24:15)'}
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="24:15"
                    className="w-full px-3 py-2 rounded-xl border border-border-custom bg-slate-950/40 text-text font-mono text-xs focus:outline-none focus:border-rose-500/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-secondary uppercase font-bold tracking-wider">
                  {locale === 'vi' ? 'Mô tả nội dung video' : 'Video Description'}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Tóm tắt nội dung, kiến thức chia sẻ trong video..."
                  className="w-full p-3 rounded-xl border border-border-custom bg-slate-950/40 text-text font-sans text-xs focus:outline-none focus:border-rose-500/50 resize-y"
                />
              </div>
            </div>

            {/* Right Column: Preview & Status */}
            <div className="lg:col-span-1 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-secondary uppercase font-bold tracking-wider block">
                  YouTube Thumbnail Preview
                </label>
                <div className="relative aspect-video w-full rounded-2xl border border-border-custom bg-slate-950/40 overflow-hidden flex items-center justify-center">
                  {previewThumbnail ? (
                    <img
                      src={previewThumbnail}
                      alt="Thumbnail Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-secondary p-4 space-y-1">
                      <Youtube className="w-8 h-8 mx-auto text-rose-500/40" />
                      <p className="text-[10px]">{locale === 'vi' ? 'Nhập link YouTube để nạp ảnh' : 'Enter URL to preview thumbnail'}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border-custom bg-slate-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-secondary uppercase font-bold">
                    {locale === 'vi' ? 'Thứ tự hiển thị' : 'Display Order'}
                  </span>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                    className="w-16 px-2 py-1 rounded bg-slate-900 border border-border-custom text-text text-xs text-center"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-border-custom/30 pt-3">
                  <span className="text-[10px] text-secondary uppercase font-bold">
                    {locale === 'vi' ? 'Trạng thái kích hoạt' : 'Active'}
                  </span>
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="w-4 h-4 rounded accent-rose-600"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-border-custom/30 pt-3">
                  <span className="text-[10px] text-secondary uppercase font-bold">
                    {locale === 'vi' ? 'Video nổi bật?' : 'Featured Video?'}
                  </span>
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded accent-rose-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs font-mono transition shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? (locale === 'vi' ? 'Đang lưu...' : 'Saving...') : (locale === 'vi' ? 'Lưu Video' : 'Save Video')}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
