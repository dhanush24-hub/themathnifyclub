'use client';

import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';

interface Patron {
  id: string;
  name: string;
  role: string;
  description: string | null;
  photo_url: string | null;
  sort_order: number;
}

export default function PatronsEditor() {
  const [list, setList] = useState<Patron[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const supabase = createSupabaseClient();
    supabase.from('patrons_mentors').select('*').order('sort_order').then(({ data }) => setList(data ?? []));
  }, []);

  async function updateField(id: string, field: keyof Patron, value: string | number) {
    const supabase = createSupabaseClient();
    const { error } = await supabase.from('patrons_mentors').update({ [field]: value }).eq('id', id);
    if (!error) setList((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    setMsg(error ? error.message : 'Updated.');
  }

  async function addRow() {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from('patrons_mentors').insert({ name: 'New', role: 'Role', sort_order: list.length }).select().single();
    if (data) setList((prev) => [...prev, data]);
    setMsg(error ? error.message : 'Added.');
  }

  async function deleteRow(id: string) {
    if (!confirm('Delete this entry?')) return;
    const supabase = createSupabaseClient();
    await supabase.from('patrons_mentors').delete().eq('id', id);
    setList((prev) => prev.filter((p) => p.id !== id));
    setMsg('Deleted.');
  }

  async function uploadPhoto(id: string, file: File) {
    setSaving(true);
    const supabase = createSupabaseClient();
    const ext = file.name.split('.').pop();
    const path = `patrons/${id}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('club-assets').upload(path, file, { upsert: true });
    if (uploadError) {
      setMsg(uploadError.message);
      setSaving(false);
      return;
    }
    const { data: urlData } = supabase.storage.from('club-assets').getPublicUrl(path);
    await supabase.from('patrons_mentors').update({ photo_url: urlData.publicUrl }).eq('id', id);
    setList((prev) => prev.map((p) => (p.id === id ? { ...p, photo_url: urlData.publicUrl } : p)));
    setSaving(false);
    setMsg('Photo uploaded.');
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Patrons & Mentors</h2>
        <button type="button" onClick={addRow} className="px-3 py-1.5 rounded bg-indigo-600 text-white text-sm">Add</button>
      </div>
      <div className="space-y-4">
        {list.map((p) => (
          <div key={p.id} className="p-4 rounded bg-white/5 border border-white/10 space-y-2">
            <div className="flex gap-2 flex-wrap">
              <input value={p.name} onChange={(e) => updateField(p.id, 'name', e.target.value)} className="flex-1 min-w-[120px] px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-sm" placeholder="Name" />
              <input value={p.role} onChange={(e) => updateField(p.id, 'role', e.target.value)} className="flex-1 min-w-[120px] px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-sm" placeholder="Role" />
            </div>
            <textarea value={p.description ?? ''} onChange={(e) => updateField(p.id, 'description', e.target.value)} rows={2} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-sm resize-none" placeholder="Description" />
            <div className="flex items-center gap-2">
              <input type="file" accept="image/*" className="text-white/70 text-sm" onChange={(e) => e.target.files?.[0] && uploadPhoto(p.id, e.target.files[0])} />
              {p.photo_url && <span className="text-green-400 text-xs">Photo set</span>}
              <button type="button" onClick={() => deleteRow(p.id)} className="text-red-400 text-sm ml-auto">Delete</button>
            </div>
          </div>
        ))}
      </div>
      {msg && <p className="text-sm text-white/70">{msg}</p>}
    </div>
  );
}
