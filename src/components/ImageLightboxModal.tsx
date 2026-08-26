'use client';

import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { formatImageUrl } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';

interface ImageLightboxModalProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop';

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  images,
  currentIndex,
  onClose,
  onSelectIndex
}) => {
  const { locale } = useLanguage();
  const currentImage = images[currentIndex] || '';

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (images.length <= 1) return;
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    onSelectIndex(newIndex);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (images.length <= 1) return;
    const newIndex = (currentIndex + 1) % images.length;
    onSelectIndex(newIndex);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [currentIndex, images]);

  if (!currentImage) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 select-none animate-fade-in"
      onClick={onClose}
    >
      {/* Top Header Actions */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between pointer-events-none">
        {/* Counter Badge */}
        <div className="px-3.5 py-1.5 rounded-full border border-white/20 bg-black/60 text-white font-mono text-xs font-bold backdrop-blur-md pointer-events-auto">
          {locale === 'vi' ? 'Ảnh' : 'Image'} {currentIndex + 1} / {images.length}
        </div>

        {/* Close Button */}
        <button 
          type="button"
          className="p-2.5 rounded-full border border-white/20 bg-black/60 text-white hover:bg-white/20 hover:scale-110 active:scale-95 transition cursor-pointer pointer-events-auto shadow-xl"
          onClick={onClose}
          title={locale === 'vi' ? 'Đóng (Esc)' : 'Close (Esc)'}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Prev Button (<) */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full border border-white/20 bg-black/60 text-white hover:bg-emerald-500 hover:border-emerald-400 hover:scale-110 active:scale-95 transition cursor-pointer shadow-2xl backdrop-blur-md group"
          title={locale === 'vi' ? 'Ảnh trước (phím Mũi tên trái)' : 'Previous Image (Left Arrow)'}
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* Main Large Image Viewport */}
      <div 
        className="relative w-full max-w-[90vw] md:max-w-[85vw] max-h-[80vh] flex items-center justify-center pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={formatImageUrl(currentImage)} 
          alt={`Gallery Item ${currentIndex + 1}`} 
          className="w-auto h-auto max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/20 transition-all duration-300 animate-zoom-in"
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
          }}
        />
      </div>

      {/* Next Button (>) */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full border border-white/20 bg-black/60 text-white hover:bg-emerald-500 hover:border-emerald-400 hover:scale-110 active:scale-95 transition cursor-pointer shadow-2xl backdrop-blur-md group"
          title={locale === 'vi' ? 'Ảnh tiếp theo (phím Mũi tên phải)' : 'Next Image (Right Arrow)'}
        >
          <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* Bottom Thumbnail Strip */}
      {images.length > 1 && (
        <div 
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 max-w-[90vw] overflow-x-auto p-2 rounded-2xl border border-white/15 bg-black/60 backdrop-blur-md scrollbar-none"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectIndex(idx)}
              className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                idx === currentIndex
                  ? 'border-emerald-400 scale-105 shadow-glow-sm'
                  : 'border-transparent opacity-60 hover:opacity-100 hover:scale-102'
              }`}
            >
              <img
                src={formatImageUrl(img)}
                alt={`Thumb ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
