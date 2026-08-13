'use client';

import React from 'react';

export function SkeletonCard() {
  return (
    <div className="border border-border-custom/40 glass-panel rounded-2xl p-4 space-y-4 animate-pulse">
      <div className="h-40 w-full bg-slate-900/60 rounded-xl" />
      <div className="space-y-2">
        <div className="h-4 w-3/4 bg-slate-900/80 rounded" />
        <div className="h-3 w-full bg-slate-900/40 rounded" />
        <div className="h-3 w-5/6 bg-slate-900/40 rounded" />
      </div>
      <div className="flex gap-2 pt-2">
        <div className="h-5 w-14 bg-slate-900/60 rounded-md" />
        <div className="h-5 w-14 bg-slate-900/60 rounded-md" />
      </div>
    </div>
  );
}
