'use client';

import { useEffect, useRef } from 'react';

export default function HeroSection({
  headline = 'Where Logic Meets Ambition',
  subheadline = 'THE MATHnify CLUB — Nurturing analytical excellence under CDC, NREC',
}: {
  headline?: string;
  subheadline?: string;
}) {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = headlineRef.current;
    const sub = subRef.current;
    if (!el || !sub) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    sub.style.opacity = '0';
    sub.style.transform = 'translateY(20px)';
    const t1 = setTimeout(() => {
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100);
    const t2 = setTimeout(() => {
      sub.style.transition = 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s';
      sub.style.opacity = '1';
      sub.style.transform = 'translateY(0)';
    }, 200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 via-transparent to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" />
      <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
        <h1
          ref={headlineRef}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight"
        >
          {headline}
        </h1>
        <p
          ref={subRef}
          className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl mx-auto"
        >
          {subheadline}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="/join"
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
          >
            Join the Club
          </a>
          <a
            href="/about"
            className="px-6 py-3 rounded-lg border border-white/20 text-white/90 font-medium hover:bg-white/5 transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
