'use client';

import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';

export default function OverviewSection() {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseClient();
    supabase
      .from('home_content')
      .select('overview_text')
      .limit(1)
      .single()
      .then(({ data }) => setText(data?.overview_text || null));
  }, []);

  const fallback =
    "We empower students with structured aptitude and analytical thinking for tomorrow's challenges. Under the CDC, THE MATHnify CLUB brings together like-minded individuals to excel in quantitative and logical reasoning.";

  return (
    <section className="py-16 md:py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent" />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
          Our Impact
        </h2>
        <p className="text-lg text-white/80 max-w-3xl mx-auto text-center leading-relaxed">
          {text ?? fallback}
        </p>
      </div>
    </section>
  );
}
