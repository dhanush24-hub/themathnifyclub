'use client';

import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import type { Announcement } from '@/lib/database.types';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const supabase = createSupabaseClient();
    supabase
      .from('announcements')
      .select('*')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .limit(5)
      .then(({ data }) => setAnnouncements(data || []));
  }, []);

  if (announcements.length === 0) return null;

  return (
    <section className="py-16 md:py-24 relative">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">
          Announcements
        </h2>
        <div className="grid gap-4 max-w-3xl mx-auto">
          {announcements.map((a) => (
            <article
              key={a.id}
              className="glass-panel rounded-xl p-6 hover:border-white/15 hover-lift transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-white">{a.title}</h3>
              <p className="mt-2 text-white/70 text-sm">{a.content}</p>
              {a.published_at && (
                <time className="text-xs text-white/50 mt-2 block">
                  {new Date(a.published_at).toLocaleDateString()}
                </time>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
