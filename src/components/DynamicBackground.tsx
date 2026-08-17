'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  colorIndex: number;
  baseAlpha: number;
}

interface EnergyPulse {
  p1Index: number;
  p2Index: number;
  progress: number;
  speed: number;
  color: string;
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

    // Particle Colors per mode
    const isDarkMode = theme === 'dark' || document.documentElement.classList.contains('dark');
    
    const darkColors = ['#10b981', '#06b6d4', '#6366f1', '#8b5cf6', '#f59e0b'];
    const lightColors = ['#0d9488', '#0284c7', '#4f46e5', '#7c3aed', '#d97706'];

    const numParticles = Math.min(Math.floor(width / 22), 60);

    const particles: Particle[] = Array.from({ length: numParticles }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
      colorIndex: Math.floor(Math.random() * 5),
      baseAlpha: Math.random() * 0.4 + 0.4
    }));

    // Energy pulses traveling along network paths
    const pulses: EnergyPulse[] = Array.from({ length: 8 }, () => ({
      p1Index: Math.floor(Math.random() * numParticles),
      p2Index: Math.floor(Math.random() * numParticles),
      progress: Math.random(),
      speed: Math.random() * 0.015 + 0.008,
      color: darkColors[Math.floor(Math.random() * darkColors.length)]
    }));

    // Mouse coordinates
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

    // Time counter for background gradient aura movement
    let time = 0;

    const render = () => {
      time += 0.005;
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark') || theme === 'dark';
      const activeColors = isDark ? darkColors : lightColors;

      // 1. Futuristic Ambient Glow Orbs in Background
      const orb1X = width * 0.25 + Math.sin(time * 0.8) * 120;
      const orb1Y = height * 0.3 + Math.cos(time * 0.6) * 100;
      const grad1 = ctx.createRadialGradient(orb1X, orb1Y, 10, orb1X, orb1Y, width * 0.35);
      grad1.addColorStop(0, isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(13, 148, 136, 0.06)');
      grad1.addColorStop(1, 'transparent');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const orb2X = width * 0.75 + Math.cos(time * 0.7) * 140;
      const orb2Y = height * 0.65 + Math.sin(time * 0.9) * 110;
      const grad2 = ctx.createRadialGradient(orb2X, orb2Y, 10, orb2X, orb2Y, width * 0.4);
      grad2.addColorStop(0, isDark ? 'rgba(99, 102, 241, 0.08)' : 'rgba(79, 70, 229, 0.05)');
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // 2. Update & Draw Particles & Mesh Triangles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Draw node
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = activeColors[p1.colorIndex];
        ctx.globalAlpha = p1.baseAlpha;
        ctx.fill();

        // Connect nearby nodes & draw semi-transparent mesh triangles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = activeColors[p1.colorIndex];
            ctx.globalAlpha = (1 - dist / 140) * (isDark ? 0.18 : 0.12);
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Form dynamic triangles with third nearby node for futuristic geometric mesh!
            for (let k = j + 1; k < particles.length; k++) {
              const p3 = particles[k];
              const dist2 = Math.hypot(p2.x - p3.x, p2.y - p3.y);
              const dist3 = Math.hypot(p1.x - p3.x, p1.y - p3.y);

              if (dist2 < 110 && dist3 < 110) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.lineTo(p3.x, p3.y);
                ctx.closePath();
                ctx.fillStyle = activeColors[p1.colorIndex];
                ctx.globalAlpha = isDark ? 0.025 : 0.015;
                ctx.fill();
              }
            }
          }
        }

        // Connect to mouse cursor with dynamic energy highlight
        if (mouse.active) {
          const mdx = p1.x - mouse.x;
          const mdy = p1.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 160) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = activeColors[p1.colorIndex];
            ctx.globalAlpha = (1 - mdist / 160) * 0.35;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      // 3. Draw Traveling Energy Pulses along Connections
      ctx.globalAlpha = 1;
      for (let p of pulses) {
        p.progress += p.speed;
        if (p.progress >= 1) {
          p.p1Index = Math.floor(Math.random() * particles.length);
          p.p2Index = Math.floor(Math.random() * particles.length);
          p.progress = 0;
          p.color = activeColors[Math.floor(Math.random() * activeColors.length)];
        }

        const p1 = particles[p.p1Index];
        const p2 = particles[p.p2Index];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

        if (dist < 180) {
          const px = p1.x + (p2.x - p1.x) * p.progress;
          const py = p1.y + (p2.y - p1.y) * p.progress;

          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // 4. Mouse Glow Ring
      if (mouse.active) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 40, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(13, 148, 136, 0.2)';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
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
