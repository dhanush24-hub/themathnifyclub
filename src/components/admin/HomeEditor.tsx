'use client';

import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';

export default function HomeEditor() {
  const [headline, setHeadline] = useState('');
  const [subheadline, setSubheadline] = useState('');
  const [overview, setOverview] = useState('');
  const [id, setId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const supabase = createSupabaseClient();
    supabase.from('home_content').select('*').limit(1).single().then(({ data }) => {
      if (data) {
        setId(data.id);
        setHeadline(data.hero_headline ?? '');
        setSubheadline(data.hero_subheadline ?? '');
        setOverview(data.overview_text ?? '');
      }
    });
  }, []);

  async function save() {
    setSaving(true);
    setMsg('');
    const supabase = createSupabaseClient();
    if (id) {
      const { error } = await supabase.from('home_content').update({
        hero_headline: headline || null,
        hero_subheadline: subheadline || null,
        overview_text: overview || null,
        updated_at: new Date().toISOString(),
      }).eq('id', id);
      setSaving(false);
      setMsg(error ? error.message : 'Saved.');
      return;
    }
    const { data, error } = await supabase.from('home_content').insert({
      hero_headline: headline || null,
      hero_subheadline: subheadline || null,
      overview_text: overview || null,
    }).select('id').single();
    if (data) setId(data.id);
    setSaving(false);
    setMsg(error ? error.message : 'Saved.');
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Home Content</h2>
      <div>
        <label className="block text-sm text-white/70 mb-1">Hero Headline</label>
        <input
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white"
          placeholder="Where Logic Meets Ambition"
        />
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-1">Hero Subheadline</label>
        <input
          value={subheadline}
          onChange={(e) => setSubheadline(e.target.value)}
          className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white"
        />
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-1">Overview Text</label>
        <textarea
          value={overview}
          onChange={(e) => setOverview(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white resize-none"
        />
      </div>
      <button type="button" onClick={save} disabled={saving} className="px-4 py-2 rounded bg-indigo-600 text-white text-sm disabled:opacity-50">
        {saving ? 'Saving...' : 'Save'}
      </button>
      {msg && <p className="text-sm text-white/70">{msg}</p>}
    </div>
  );
}
