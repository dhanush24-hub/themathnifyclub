'use client';

import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';

interface Announcement {
  id: string;
  title: string;
  content: string;
  published_at: string | null;
  created_at: string;
}

export default function AnnouncementsEditor() {
  const [list, setList] = useState<Announcement[]>([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const supabase = createSupabaseClient();
    supabase.from('announcements').select('*').order('created_at', { ascending: false }).then(({ data }) => setList(data ?? []));
  }, []);

  async function addRow() {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from('announcements').insert({ title: 'New Announcement', content: '' }).select().single();
    if (data) setList((prev) => [data, ...prev]);
    setMsg(error ? error.message : 'Added.');
  }

  async function updateField(id: string, field: 'title' | 'content', value: string) {
    const supabase = createSupabaseClient();
    await supabase.from('announcements').update({ [field]: value }).eq('id', id);
    setList((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
    setMsg('Updated.');
  }

  async function togglePublish(id: string) {
    const item = list.find((a) => a.id === id);
    if (!item) return;
    const supabase = createSupabaseClient();
    const published_at = item.published_at ? null : new Date().toISOString();
    await supabase.from('announcements').update({ published_at }).eq('id', id);
    setList((prev) => prev.map((a) => (a.id === id ? { ...a, published_at } : a)));
    setMsg(published_at ? 'Published.' : 'Unpublished.');
  }

  async function deleteRow(id: string) {
    if (!confirm('Delete this announcement?')) return;
    const supabase = createSupabaseClient();
    await supabase.from('announcements').delete().eq('id', id);
    setList((prev) => prev.filter((a) => a.id !== id));
    setMsg('Deleted.');
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Announcements</h2>
        <button type="button" onClick={addRow} className="px-3 py-1.5 rounded bg-indigo-600 text-white text-sm">Add</button>
      </div>
      <div className="space-y-4">
        {list.map((a) => (
          <div key={a.id} className="p-4 rounded bg-white/5 border border-white/10 space-y-2">
            <input value={a.title} onChange={(e) => updateField(a.id, 'title', e.target.value)} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-sm" placeholder="Title" />
            <textarea value={a.content} onChange={(e) => updateField(a.id, 'content', e.target.value)} rows={3} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-sm resize-none" placeholder="Content" />
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => togglePublish(a.id)} className={`px-2 py-1 rounded text-xs ${a.published_at ? 'bg-green-600/80 text-white' : 'bg-white/10 text-white/70'}`}>
                {a.published_at ? 'Published' : 'Draft'}
              </button>
              <button type="button" onClick={() => deleteRow(a.id)} className="text-red-400 text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
      {msg && <p className="text-sm text-white/70">{msg}</p>}
    </div>
  );
}
