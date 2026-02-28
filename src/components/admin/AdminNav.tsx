'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminNav() {
  const router = useRouter();

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin-login');
    router.refresh();
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="text-lg font-semibold text-white">
          MATHnify Admin
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-white/70 hover:text-white" target="_blank" rel="noopener noreferrer">
            View Site
          </Link>
          <button
            type="button"
            onClick={logout}
            className="text-sm text-red-400 hover:text-red-300"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
