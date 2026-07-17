'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type ServerStatus = 'checking' | 'waking' | 'online' | 'offline';

interface ServerStatusContextType {
  status: ServerStatus;
  isOnline: boolean;
  isWaking: boolean;
  triggerReconnect: () => void;
}

const ServerStatusContext = createContext<ServerStatusContextType | undefined>(undefined);

export function ServerStatusProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<ServerStatus>('checking');
  const [reconnectTrigger, setReconnectTrigger] = useState(0);

  const triggerReconnect = useCallback(() => {
    setStatus('checking');
    setReconnectTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let active = true;
    let timeoutId: NodeJS.Timeout;
    let pollIntervalId: NodeJS.Timeout;

    const checkHealth = async () => {
      // Start a timeout to mark as "waking" if server takes more than 1.5s to respond
      timeoutId = setTimeout(() => {
        if (active && status === 'checking') {
          setStatus('waking');
        }
      }, 1500);

      try {
        const controller = new AbortController();
        const abortId = setTimeout(() => controller.abort(), 4000); // 4s timeout

        const response = await fetch('/api/v1/profile', {
          signal: controller.signal,
          headers: { 'Cache-Control': 'no-cache' }
        });

        clearTimeout(abortId);
        clearTimeout(timeoutId);

        if (!active) return;

        if (response.ok) {
          setStatus('online');
        } else {
          // If server returns an error code, it's technically awake but having issues
          setStatus('online'); 
        }
      } catch (err) {
        clearTimeout(timeoutId);
        if (!active) return;
        
        // If we were previously checking, mark as waking (free tier spin up)
        setStatus((prev) => {
          if (prev === 'checking' || prev === 'online') {
            return 'waking';
          }
          return prev;
        });
      }
    };

    checkHealth();

    // Poll every 5 seconds if offline/waking, or every 30 seconds if online
    const intervalTime = status === 'online' ? 30000 : 5000;
    pollIntervalId = setInterval(checkHealth, intervalTime);

    return () => {
      active = false;
      clearTimeout(timeoutId);
      clearInterval(pollIntervalId);
    };
  }, [status, reconnectTrigger]);

  const isOnline = status === 'online';
  const isWaking = status === 'waking';

  return (
    <ServerStatusContext.Provider value={{ status, isOnline, isWaking, triggerReconnect }}>
      {children}
    </ServerStatusContext.Provider>
  );
}

export function useServerStatus() {
  const context = useContext(ServerStatusContext);
  if (context === undefined) {
    throw new Error('useServerStatus must be used within a ServerStatusProvider');
  }
  return context;
}
