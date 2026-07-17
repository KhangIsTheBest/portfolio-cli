'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, Loader2, CheckCircle, RefreshCw } from 'lucide-react';
import { useServerStatus } from '@/context/ServerStatusContext';
import { useLanguage } from '@/context/LanguageContext';

export function ServerStatusBanner() {
  const { status, isOnline, isWaking, triggerReconnect } = useServerStatus();
  const { locale } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);
  const [justConnected, setJustConnected] = useState(false);

  useEffect(() => {
    if (isWaking) {
      setShowBanner(true);
      setJustConnected(false);
    } else if (isOnline) {
      if (showBanner) {
        // We were showing the warning banner, now we are connected
        setJustConnected(true);
        const timer = setTimeout(() => {
          setShowBanner(false);
          setJustConnected(false);
        }, 4000); // Show success message for 4 seconds
        return () => clearTimeout(timer);
      }
    }
  }, [isOnline, isWaking, showBanner]);

  if (!showBanner) return null;

  return (
    <div className={`w-full border-b text-[11px] font-mono py-2 px-4 flex items-center justify-between transition-all duration-500 animate-slide-down ${
      justConnected 
        ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
        : 'bg-amber-950/80 border-amber-500/40 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
    } backdrop-blur-md sticky top-0 z-50`}>
      <div className="flex items-center space-x-2.5 max-w-4xl mx-auto w-full justify-between sm:justify-start">
        <div className="flex items-center space-x-2 flex-1 sm:flex-initial">
          {justConnected ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 animate-bounce" />
          ) : (
            <div className="relative shrink-0">
              <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="absolute inset-0 rounded-full border border-amber-400/50 animate-ping" />
            </div>
          )}

          <span className="leading-tight">
            {justConnected ? (
              locale === 'vi' 
                ? 'ĐÃ KẾT NỐI VỚI MÁY CHỦ! Đồng bộ dữ liệu trực tiếp thành công.' 
                : 'SERVER CONNECTED! Live database synchronized successfully.'
            ) : (
              locale === 'vi'
                ? 'MÁY CHỦ ĐANG THỨC GIẤC... Đang kích hoạt Render Database (Mất 1-2 phút ở gói Free). Web đang chạy ở chế độ Offline Mockup.'
                : 'SERVER IS WAKING UP... Spin up in progress on Render Free Tier (Takes 1-2 mins). Viewing offline backup data.'
            )}
          </span>
        </div>

        {!justConnected && (
          <div className="flex items-center space-x-2 shrink-0">
            <span className="flex items-center text-[10px] bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
              <Loader2 className="w-3 h-3 animate-spin mr-1 text-amber-400" />
              {locale === 'vi' ? 'Đang kết nối...' : 'Reconnecting...'}
            </span>
            <button
              onClick={triggerReconnect}
              title={locale === 'vi' ? 'Thử kết nối lại' : 'Retry connection'}
              className="p-1 rounded hover:bg-amber-400/15 text-amber-400 transition-colors active:scale-90"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
