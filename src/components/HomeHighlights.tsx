'use client';

import Link from 'next/link';

const HIGHLIGHTS = [
  {
    title: 'Aptitude & Logic',
    description: 'Structured training in quantitative aptitude, logical reasoning, and data interpretation.',
    href: '/programs',
    icon: '∑',
  },
  {
    title: 'Workshops & Sessions',
    description: 'Hands-on workshops, guest talks, and practice sessions to sharpen your skills.',
    href: '/programs',
    icon: '◈',
  },
  {
    title: 'Competitions & Events',
    description: 'Club contests, inter-college events, and opportunities to test and showcase your abilities.',
    href: '/programs',
    icon: '★',
  },
  {
    title: 'Community',
    description: 'Connect with peers and mentors under CDC, NRCM — grow together.',
    href: '/join',
    icon: '◆',
  },
];

export default function HomeHighlights() {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/5 to-transparent" />
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
          What We Offer
        </h2>
        <p className="text-white/70 text-center max-w-2xl mx-auto mb-12">
          From aptitude training to events and a supportive community — THE MATHnify CLUB helps you excel.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HIGHLIGHTS.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="glass-panel rounded-xl p-6 hover-lift transition-all duration-300 border border-white/5 hover:border-indigo-500/30 group"
            >
              <span className="text-2xl text-indigo-400/90 group-hover:text-indigo-300 block mb-3">
                {item.icon}
              </span>
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-white/65 leading-relaxed">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
