'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  ExternalLink, 
  Clock, 
  Tag, 
  Eye, 
  CheckCircle2, 
  Flame, 
  Sparkles,
  Share2,
  Tv,
  Film,
  Layers,
  Search,
  Volume2
} from 'lucide-react';
import { Youtube } from '@/components/YoutubeIcon';
import { api } from '@/services/api';
import { YouTubeVideo, Profile } from '@/types';
import { useLanguage } from '@/context/LanguageContext';


const DEFAULT_VIDEOS: YouTubeVideo[] = [
  {
    id: 1,
    title: "Xây dựng Kiến trúc Microservices & Distributed System với Spring Boot 3 và Redis",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop",
    description: "Hướng dẫn phân rã Monolith sang Microservices, áp dụng Redis Cache, Rate Limiting phân tán, và giải quyết bài toán Race Condition với Redlock trong môi trường High-Concurrency.",
    category: "Java & Spring Boot",
    duration: "24:15",
    displayOrder: 1,
    featured: true,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Giải mã Thuật toán LeetCode: Dynamic Programming & Graph Traversal (DFS/BFS)",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop",
    description: "Phân tích tư duy tiếp cận các dạng bài Quy hoạch động (Knapsack, LIS, LCS) và thuật toán đồ thị phổ biến trong các buổi phỏng vấn kỹ sư phần mềm Big Tech.",
    category: "LeetCode & DSA",
    duration: "18:40",
    displayOrder: 2,
    featured: true,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    title: "Thiết kế Hệ thống Thực chiến: Phân tích Kiến trúc Booking vé chịu tải 100,000 QPS",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop",
    description: "System Design Deep Dive: Tối ưu hóa Database Connection Pool, Caching Strategy 3 lớp, Message Broker RabbitMQ và cơ chế Idempotent API.",
    category: "System Design",
    duration: "32:10",
    displayOrder: 3,
    featured: false,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default function YouTubePage() {
  const { locale } = useLanguage();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileData, videosData] = await Promise.all([
        api.getProfile().catch(() => null),
        api.getYouTubeVideos().catch(() => [])
      ]);
      setProfile(profileData);
      
      const loadedVideos = videosData && videosData.length > 0 ? videosData : DEFAULT_VIDEOS;
      setVideos(loadedVideos);
      setSelectedVideo(loadedVideos[0]);
    } catch (err) {
      console.error('Failed to load YouTube station:', err);
      setVideos(DEFAULT_VIDEOS);
      setSelectedVideo(DEFAULT_VIDEOS[0]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'ALL',
    'Java & Spring Boot',
    'LeetCode & DSA',
    'System Design',
    'DevOps & Cloud'
  ];

  const filteredVideos = videos.filter(v => {
    const matchesCategory = activeCategory === 'ALL' || v.category === activeCategory;
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (v.description && v.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto font-sans">
      {/* Station Channel Header */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-8 mb-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-rose-500/40 p-1 bg-slate-900 shadow-xl shadow-rose-500/20">
                <img
                  src={profile?.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=PhanDuyKhang"}
                  alt="YouTube Channel Avatar"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <span className="absolute -bottom-2 -right-2 p-1.5 rounded-lg bg-rose-600 text-white shadow-lg">
                <Youtube className="w-4 h-4" />
              </span>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">Official Video Channel</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span className="text-xs font-mono text-[var(--secondary-color)]">Tech & Engineering</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-color)]">
                {profile?.fullName || "Phan Duy Khang"} <span className="text-rose-500 font-mono">Channel</span>
              </h1>
              <p className="text-xs font-mono text-[var(--secondary-color)] mt-1">
                {profile?.youtubeHandle || "@phanduykhang.dev"} • Tech Tutorials, Architecture Breakdown & Live Coding
              </p>
            </div>
          </div>

          {/* Channel Link button */}
          <div className="flex items-center gap-3">
            <a
              href={profile?.youtubeChannelId 
                ? (profile.youtubeChannelId.startsWith('http') ? profile.youtubeChannelId : `https://youtube.com/${profile.youtubeChannelId}`)
                : "https://youtube.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs font-mono transition shadow-lg shadow-rose-600/30"
            >
              <Youtube className="w-4 h-4" />
              <span>{locale === 'vi' ? 'Đăng ký Kênh' : 'Subscribe on YouTube'}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Video Theater Stage */}
      {selectedVideo && (
        <div className="mb-10 space-y-4">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-[var(--border-color)] bg-black shadow-2xl">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0`}
              title={selectedVideo.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Playing Video Metadata */}
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase">
                    {selectedVideo.category || 'Engineering'}
                  </span>
                  {selectedVideo.duration && (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-[var(--secondary-color)]">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedVideo.duration}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-color)]">
                  {selectedVideo.title}
                </h2>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={selectedVideo.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--terminal-header-bg)] border border-[var(--border-color)] hover:border-rose-500/40 text-[var(--text-color)] hover:text-rose-400 text-xs font-mono font-bold transition shadow-sm"
                >
                  <Youtube className="w-3.5 h-3.5 text-rose-500" />
                  <span>Xem trên YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {selectedVideo.description && (
              <p className="mt-4 text-xs sm:text-sm text-[var(--secondary-color)] leading-relaxed border-t border-[var(--border-color)] pt-4">
                {selectedVideo.description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Playlist Grid & Search Filter */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center gap-2">
            <Tv className="w-5 h-5 text-rose-500" />
            <h3 className="text-lg font-bold text-[var(--text-color)] font-mono">
              {locale === 'vi' ? 'Danh sách Video & Chuyên đề' : 'Video Library & Playlists'}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[var(--terminal-header-bg)] border border-[var(--border-color)] text-[var(--secondary-color)]">
              {filteredVideos.length} videos
            </span>
          </div>

          {/* Search */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--secondary-color)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos..."
              className="w-full pl-8 pr-3 py-1.5 bg-[var(--terminal-header-bg)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-color)] placeholder-[var(--secondary-color)] focus:outline-none focus:border-rose-500/50 font-mono"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                  : 'bg-[var(--terminal-header-bg)] border border-[var(--border-color)] text-[var(--secondary-color)] hover:text-[var(--text-color)]'
              }`}
            >
              {cat === 'ALL' ? (locale === 'vi' ? 'Tất cả' : 'All Topics') : cat}
            </button>
          ))}
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => {
            const isPlaying = selectedVideo?.id === video.id;
            const thumb = video.thumbnailUrl || (video.videoId ? `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg` : '');

            return (
              <motion.div
                key={video.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  setSelectedVideo(video);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`group relative rounded-2xl overflow-hidden border bg-[var(--card-bg)] shadow-xl cursor-pointer flex flex-col transition ${
                  isPlaying 
                    ? 'border-rose-500 shadow-rose-500/20 ring-2 ring-rose-500/20' 
                    : 'border-[var(--border-color)] hover:border-rose-500/40'
                }`}
              >
                {/* Thumbnail & Badges */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <img
                    src={thumb}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-center justify-center">
                    <div className={`p-3 rounded-full ${isPlaying ? 'bg-rose-600 text-white' : 'bg-slate-900/80 text-white group-hover:bg-rose-600'} transition shadow-xl`}>
                      <Play className="w-5 h-5 fill-current" />
                    </div>
                  </div>

                  {video.duration && (
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-white text-[10px] font-mono font-bold">
                      {video.duration}
                    </span>
                  )}

                  {video.category && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/90 text-rose-400 border border-rose-500/20 text-[9px] font-mono font-bold">
                      {video.category}
                    </span>
                  )}
                </div>

                {/* Info Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[var(--text-color)] group-hover:text-rose-400 transition line-clamp-2">
                      {video.title}
                    </h4>
                    {video.description && (
                      <p className="mt-1.5 text-xs text-[var(--secondary-color)] line-clamp-2 leading-relaxed">
                        {video.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono text-[var(--secondary-color)]">
                    <span className="flex items-center gap-1 text-rose-400 font-bold">
                      <Play className="w-3 h-3 fill-current" />
                      {isPlaying ? (locale === 'vi' ? 'Đang phát' : 'Now Playing') : (locale === 'vi' ? 'Phát ngay' : 'Watch Now')}
                    </span>
                    <span className="text-[10px]">YouTube HD</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
