'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/programs', label: 'Programs' },
  { href: '/patrons-mentors', label: 'Patrons & Mentors' },
  { href: '/club-leads', label: 'Club Leads' },
  { href: '/departments', label: 'Departments' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
  { href: '/join', label: 'Join' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-xl border-b ${
        scrolled
          ? 'py-3 bg-black/80 shadow-xl shadow-black/40 border-white/10'
          : 'py-4 bg-black/70 shadow-lg shadow-black/30 border-white/10'
      }`}
    >
      <nav className="container mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between max-w-7xl">
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <span className="relative w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center overflow-hidden border border-white/5">
            {!logoError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/logo.png"
                alt="THE MATHnify CLUB"
                className="object-contain w-full h-full"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="text-lg font-bold text-indigo-400">M</span>
            )}
          </span>
          <span className="text-lg font-semibold tracking-tight">
            <span className="gradient-text">THE MATHnify</span>
            <span className="text-white/90"> CLUB</span>
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? 'text-indigo-400 bg-white/5'
                    : 'text-white/75 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="md:hidden p-2.5 rounded-lg text-white/80 hover:bg-white/5 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden glass-panel-strong mt-2 mx-4 rounded-xl border border-white/10 p-4 shadow-xl">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block py-3 px-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href ? 'text-indigo-400 bg-white/5' : 'text-white/80 hover:bg-white/5'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
