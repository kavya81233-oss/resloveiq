'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  clusterIndex: number;
}

export default function Canvas2DFallback() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // 5 Cluster centers (Incidents)
    const clusterCenters = [
      { x: width * 0.28, y: height * 0.35, label: '14 complaints, 1 incident', count: 14 },
      { x: width * 0.72, y: height * 0.32, label: '28 complaints, 1 incident', count: 28 },
      { x: width * 0.50, y: height * 0.55, label: '19 complaints, 1 incident', count: 19 },
      { x: width * 0.25, y: height * 0.75, label: '9 complaints, 1 incident', count: 9 },
      { x: width * 0.75, y: height * 0.72, label: '12 complaints, 1 incident', count: 12 },
    ];

    const colors = ['#38BDF8', '#A78BFA', '#34D399', '#FBBF24', '#F87171'];

    // 120 particles for low-power fallback
    const particles: Particle[] = [];
    for (let i = 0; i < 120; i++) {
      const cIdx = i % 5;
      const target = clusterCenters[cIdx];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        targetX: target.x + (Math.random() - 0.5) * 45,
        targetY: target.y + (Math.random() - 0.5) * 45,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        color: colors[cIdx],
        size: Math.random() * 2.5 + 1.5,
        clusterIndex: cIdx,
      });
    }

    let startTime = Date.now();

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const elapsed = (Date.now() - startTime) / 1000;
      // Over 6 seconds, progress from 0 (scattered) to 1 (clustered)
      const progress = Math.min(elapsed / 6.0, 1.0);
      const ease = 0.5 - Math.cos(progress * Math.PI) / 2;

      // Draw connecting lines between particles in same cluster when nearing completion
      if (progress > 0.4) {
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i += 2) {
          const p1 = particles[i];
          const p2 = particles[(i + 1) % particles.length];
          if (p1.clusterIndex === p2.clusterIndex) {
            ctx.strokeStyle = p1.color + '22';
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        // Interpolate towards target
        p.x += (p.targetX - p.x) * (0.02 * ease) + (1 - ease) * p.vx;
        p.y += (p.targetY - p.y) * (0.02 * ease) + (1 - ease) * p.vy;

        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw cluster nodes and labels when clustered
      clusterCenters.forEach((c, idx) => {
        const pulse = Math.sin(elapsed * 3 + idx) * 4;
        ctx.strokeStyle = colors[idx];
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 16 + pulse, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(13, 21, 38, 0.85)';
        ctx.fillRect(c.x - 65, c.y - 32, 130, 20);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.strokeRect(c.x - 65, c.y - 32, 130, 20);

        ctx.font = '10px monospace';
        ctx.fillStyle = '#E6EDF7';
        ctx.textAlign = 'center';
        ctx.fillText(c.label, c.x, c.y - 18);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}

