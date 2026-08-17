'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface Star {
  x: number;
  y: number;
  size: number;
  phase: number;
  speed: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  colorIndex: number;
  baseAlpha: number;
}

export const DynamicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Deep Space Stars Setup (Dark mode)
    const numStars = 60;
    const stars: Star[] = Array.from({ length: numStars }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.01
    }));

    // Interactive Tech Constellation Nodes
    const numParticles = Math.min(Math.floor(width / 24), 45);
    const darkColors = ['#10b981', '#06b6d4', '#6366f1', '#8b5cf6', '#f59e0b'];
    const lightColors = ['#0d9488', '#0284c7', '#4f46e5', '#7c3aed', '#d97706'];

    const particles: Particle[] = Array.from({ length: numParticles }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      colorIndex: Math.floor(Math.random() * 5),
      baseAlpha: Math.random() * 0.4 + 0.4
    }));

    // Mouse listener
    let mouse = { x: -1000, y: -1000, active: false };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.active = false;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    let time = 0;

    const render = () => {
      time += 0.008;
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark') || theme === 'dark';
      const activeColors = isDark ? darkColors : lightColors;

      // =========================================================================
      // 1. BASE COSMIC / DAYLIGHT GRADIENT BACKGROUND
      // =========================================================================
      if (isDark) {
        // Deep Space Cosmic Void Gradient
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, '#03050d');
        bgGrad.addColorStop(0.5, '#070b1a');
        bgGrad.addColorStop(1, '#0c081c');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Twinkling Space Stars
        for (let star of stars) {
          star.phase += star.speed;
          const alpha = 0.2 + Math.abs(Math.sin(star.phase)) * 0.7;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fill();
        }
      } else {
        // Prismatic Daylight Pastel Gradient
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, '#f8fafc');
        bgGrad.addColorStop(0.4, '#f0fdf4');
        bgGrad.addColorStop(0.8, '#eff6ff');
        bgGrad.addColorStop(1, '#f5f3ff');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // =========================================================================
      // 2. DYNAMIC AURORA BOREALIS / SILK LIGHT WAVE CURTAINS
      // =========================================================================
      const drawAuroraWave = (
        color1: string,
        color2: string,
        yOffset: number,
        amplitude: number,
        speedMultiplier: number,
        opacity: number
      ) => {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, height);

        // Wave curve points
        for (let x = 0; x <= width; x += 30) {
          const wave1 = Math.sin(x * 0.003 + time * speedMultiplier) * amplitude;
          const wave2 = Math.cos(x * 0.002 - time * 0.8 * speedMultiplier) * (amplitude * 0.6);
          const y = yOffset + wave1 + wave2;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        const auroraGrad = ctx.createLinearGradient(0, yOffset - 150, width, height);
        auroraGrad.addColorStop(0, color1);
        auroraGrad.addColorStop(0.6, color2);
        auroraGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = auroraGrad;
        ctx.globalAlpha = opacity;
        ctx.fill();
        ctx.restore();
      };

      if (isDark) {
        // Dark Mode Space Aurora (Emerald Green, Radiant Cyan, Deep Violet)
        drawAuroraWave('rgba(16, 185, 129, 0.28)', 'rgba(6, 182, 212, 0.18)', height * 0.2, 90, 1.0, 0.85);
        drawAuroraWave('rgba(99, 102, 241, 0.25)', 'rgba(139, 92, 246, 0.15)', height * 0.45, 110, 0.7, 0.8);
        drawAuroraWave('rgba(244, 63, 94, 0.18)', 'rgba(236, 72, 153, 0.12)', height * 0.7, 80, 1.2, 0.75);
      } else {
        // Light Mode Prism Aurora (Soft Teal, Sky Blue, Sunset Lavender)
        drawAuroraWave('rgba(13, 148, 136, 0.18)', 'rgba(20, 184, 166, 0.12)', height * 0.25, 80, 0.9, 0.9);
        drawAuroraWave('rgba(2, 132, 199, 0.16)', 'rgba(56, 189, 248, 0.10)', height * 0.5, 100, 0.7, 0.85);
        drawAuroraWave('rgba(124, 58, 237, 0.12)', 'rgba(244, 114, 182, 0.08)', height * 0.75, 70, 1.1, 0.8);
      }

      // =========================================================================
      // 3. INTERACTIVE CONSTELLATION MESH OVERLAY
      // =========================================================================
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = activeColors[p1.colorIndex];
        ctx.globalAlpha = p1.baseAlpha;
        ctx.fill();

        // Connect nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = activeColors[p1.colorIndex];
            ctx.globalAlpha = (1 - dist / 130) * (isDark ? 0.22 : 0.15);
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Connect to mouse cursor
        if (mouse.active) {
          const mdx = p1.x - mouse.x;
          const mdy = p1.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 160) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = activeColors[p1.colorIndex];
            ctx.globalAlpha = (1 - mdist / 160) * 0.4;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      // Mouse Glow Pulse Ring
      if (mouse.active) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 45, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(13, 148, 136, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.6;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-20 w-full h-full transition-opacity duration-500"
    />
  );
};
