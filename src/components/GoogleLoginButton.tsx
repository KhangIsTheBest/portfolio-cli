'use client';

import React, { useEffect, useRef, useState } from 'react';
import { apiService } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';
import { useServerStatus } from '@/context/ServerStatusContext';
import { Loader2, AlertCircle } from 'lucide-react';

interface GoogleLoginButtonProps {
  onSuccess: (userData: any) => void;
  onError: (error: string) => void;
}

export function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
  const { locale } = useLanguage();
  const { isOnline } = useServerStatus();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  useEffect(() => {
    // 1. Check if script is already present in document
    const existingScript = document.getElementById('google-jssdk');
    if (existingScript) {
      setScriptLoaded(true);
      return;
    }

    // 2. Create and append the script
    const script = document.createElement('script');
    script.id = 'google-jssdk';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => onError('Failed to load Google Login SDK');
    document.body.appendChild(script);

    return () => {
      // Keep script loaded globally to avoid reloading on mount/unmount
    };
  }, [onError]);

  useEffect(() => {
    if (!scriptLoaded || !buttonRef.current || !clientId) return;

    try {
      const handleCredentialResponse = async (response: any) => {
        setLoading(true);
        try {
          const credential = response.credential;
          const result = await apiService.loginWithGoogle(credential);
          onSuccess(result);
        } catch (err: any) {
          console.error('Google sign-in API failure:', err);
          onError(err.message || 'Google authentication failed');
        } finally {
          setLoading(false);
        }
      };

      // @ts-ignore
      if (window.google?.accounts?.id) {
        // @ts-ignore
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
        });

        // @ts-ignore
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'filled_black',
          size: 'large',
          text: 'continue_with',
          width: 320,
          shape: 'pill',
        });
      }
    } catch (e: any) {
      console.error('Google Sign-In initialization failed:', e);
      onError(e.message || 'Failed to initialize Google Sign-In');
    }
  }, [scriptLoaded, clientId, onSuccess, onError]);

  if (!clientId) {
    return (
      <div className="flex items-center space-x-2 text-xs font-sans text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 rounded-2xl w-full justify-center">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>{locale === 'vi' ? 'Chưa cấu hình Google Client ID' : 'Google Client ID is not configured'}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full space-y-2">
      {loading && (
        <div className="flex items-center space-x-2 text-xs text-cyan-custom animate-pulse font-mono py-1">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>{locale === 'vi' ? 'ĐANG XÁC THỰC VỚI GOOGLE...' : 'VERIFYING WITH GOOGLE...'}</span>
        </div>
      )}
      
      <div 
        ref={buttonRef} 
        className={`w-full max-w-[320px] transition-opacity duration-300 ${
          loading || !isOnline ? 'opacity-50 pointer-events-none' : 'opacity-100'
        }`}
      />
      
      {!isOnline && (
        <p className="text-[10px] text-amber-300/80 font-mono text-center max-w-[280px]">
          {locale === 'vi' 
            ? 'Đăng nhập Google yêu cầu kết nối trực tuyến tới máy chủ' 
            : 'Google login requires live server connection'}
        </p>
      )}
    </div>
  );
}
