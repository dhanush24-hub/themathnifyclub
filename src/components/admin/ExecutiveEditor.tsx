'use client';

import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';

interface Member {
  id: string;
  name: string;
  role: string;
  photo_url: string | null;
  description: string | null;
  sort_order: number;
}

export default function ExecutiveEditor() {
  const [list, setList] = useState<Member[]>([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const supabase = createSupabaseClient();
    supabase.from('executive_board').select('*').order('sort_order').then(({ data }) => setList(data ?? []));
  }, []);

  async function updateField(id: string, field: keyof Member, value: string | number) {
    const supabase = createSupabaseClient();
    const { error } = await supabase.from('executive_board').update({ [field]: value }).eq('id', id);
    if (!error) setList((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
    setMsg(error ? error.message : 'Updated.');
  }

  async function addRow() {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from('executive_board').insert({ name: 'New', role: 'Role', sort_order: list.length }).select().single();
    if (data) setList((prev) => [...prev, data]);
    setMsg(error ? error.message : 'Added.');
  }

  async function deleteRow(id: string) {
    if (!confirm('Delete?')) return;
    const supabase = createSupabaseClient();
    await supabase.from('executive_board').delete().eq('id', id);
    setList((prev) => prev.filter((m) => m.id !== id));
    setMsg('Deleted.');
  }

  async function uploadPhoto(id: string, file: File) {
    const supabase = createSupabaseClient();
    const ext = file.name.split('.').pop();
    const path = `executive/${id}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('club-assets').upload(path, file, { upsert: true });
    if (uploadError) {
      setMsg(uploadError.message);
      return;
    }
    const { data: urlData } = supabase.storage.from('club-assets').getPublicUrl(path);
    await supabase.from('executive_board').update({ photo_url: urlData.publicUrl }).eq('id', id);
    setList((prev) => prev.map((m) => (m.id === id ? { ...m, photo_url: urlData.publicUrl } : m)));
    setMsg('Photo uploaded.');
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Executive Board</h2>
        <button type="button" onClick={addRow} className="px-3 py-1.5 rounded bg-indigo-600 text-white text-sm">Add</button>
      </div>
      <div className="space-y-4">
        {list.map((m) => (
          <div key={m.id} className="p-4 rounded bg-white/5 border border-white/10 space-y-2">
            <div className="flex gap-2 flex-wrap">
              <input value={m.name} onChange={(e) => updateField(m.id, 'name', e.target.value)} className="flex-1 min-w-[120px] px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-sm" placeholder="Name" />
              <input value={m.role} onChange={(e) => updateField(m.id, 'role', e.target.value)} className="flex-1 min-w-[120px] px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-sm" placeholder="Role" />
            </div>
            <textarea value={m.description ?? ''} onChange={(e) => updateField(m.id, 'description', e.target.value)} rows={2} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-sm resize-none" placeholder="Description" />
            <div className="flex items-center gap-2">
              <input type="file" accept="image/*" className="text-white/70 text-sm" onChange={(e) => e.target.files?.[0] && uploadPhoto(m.id, e.target.files[0])} />
              {m.photo_url && <span className="text-green-400 text-xs">Photo set</span>}
              <button type="button" onClick={() => deleteRow(m.id)} className="text-red-400 text-sm ml-auto">Delete</button>
            </div>
          </div>
        ))}
      </div>
      {msg && <p className="text-sm text-white/70">{msg}</p>}
    </div>
  );
}
