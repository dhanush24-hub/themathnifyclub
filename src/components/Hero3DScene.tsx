'use client';

import { useEffect, useRef } from 'react';

export default function Hero3DScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let frame = 0;
    let raf: number;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      if (!ctx || !canvas.width || !canvas.height) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = frame * 0.02;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2 - 40;
      const radius = Math.min(canvas.width, canvas.height) * 0.35;
      ctx.beginPath();
      ctx.strokeStyle = `rgba(99, 102, 241, ${0.06 + 0.02 * Math.sin(time)})`;
      ctx.lineWidth = 1;
      for (let i = 0; i < 64; i++) {
        const angle = (i / 64) * Math.PI * 2 + time * 0.2;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius * 0.4;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      frame++;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    />
  );
}
