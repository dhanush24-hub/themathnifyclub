'use client';

import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';

export default function AboutEditor() {
  const [content, setContent] = useState('');
  const [id, setId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const supabase = createSupabaseClient();
    supabase.from('about_content').select('*').limit(1).single().then(({ data }) => {
      if (data) {
        setId(data.id);
        setContent(data.content ?? '');
      }
    });
  }, []);

  async function save() {
    setSaving(true);
    setMsg('');
    const supabase = createSupabaseClient();
    if (id) {
      const { error } = await supabase.from('about_content').update({ content, updated_at: new Date().toISOString() }).eq('id', id);
      setSaving(false);
      setMsg(error ? error.message : 'Saved.');
      return;
    }
    const { data, error } = await supabase.from('about_content').insert({ content }).select('id').single();
    if (data) setId(data.id);
    setSaving(false);
    setMsg(error ? error.message : 'Saved.');
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">About Section</h2>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white resize-none"
        placeholder="Under the visionary leadership of Dr. G. Ramu..."
      />
      <button type="button" onClick={save} disabled={saving} className="px-4 py-2 rounded bg-indigo-600 text-white text-sm disabled:opacity-50">
        {saving ? 'Saving...' : 'Save'}
      </button>
      {msg && <p className="text-sm text-white/70">{msg}</p>}
    </div>
  );
}
