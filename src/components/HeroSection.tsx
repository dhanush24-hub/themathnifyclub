'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import HeroBackground from './HeroBackground';
import Hero3DScene from './Hero3DScene';

export default function HeroSection({
  headline = 'Where Logic Meets Ambition',
  subheadline = 'THE MATHnify CLUB — Nurturing analytical excellence under CDC, NRCM',
}: {
  headline?: string;
  subheadline?: string;
}) {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let gsap: typeof import('gsap').gsap;
    const loadGsap = async () => {
      try {
        const gsapModule = await import('gsap');
        gsap = gsapModule.gsap;
      } catch {
        return;
      }
      if (!headlineRef.current || !subRef.current || !ctaRef.current || !lineRef.current) return;
      gsap.set([headlineRef.current, subRef.current, ctaRef.current, lineRef.current], { opacity: 0, y: 28 });
      gsap.to(headlineRef.current, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.2 });
      gsap.to(lineRef.current, { opacity: 0.6, scaleX: 1, duration: 0.8, ease: 'power2.out', delay: 0.5 });
      gsap.to(subRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.55 });
      gsap.to(ctaRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.85 });
    };
    loadGsap();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-24 pb-20"
    >
      {/* Background layers - subtle parallax feel */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-transparent to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(99,102,241,0.12),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_60%,rgba(99,102,241,0.06),transparent)]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <HeroBackground />
      <Hero3DScene />

      <div className="container mx-auto px-4 md:px-6 text-center relative z-10 max-w-5xl">
        <h1
          ref={headlineRef}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]"
        >
          {headline}
        </h1>
        <div ref={lineRef} className="mt-8 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent scale-x-0 opacity-0" />
        <p
          ref={subRef}
          className="mt-8 text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed font-light"
        >
          {subheadline}
        </p>
        <p className="mt-6 text-base md:text-lg text-indigo-300/90 font-medium tracking-wide">
          Where Numbers Speak & Logic Leads
        </p>
        <div ref={ctaRef} className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/join"
            className="px-8 py-3.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5"
          >
            Join the Club
          </Link>
          <Link
            href="/about"
            className="px-8 py-3.5 rounded-xl border border-white/20 text-white/90 font-medium hover:bg-white/5 hover:border-white/30 transition-all duration-300"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
