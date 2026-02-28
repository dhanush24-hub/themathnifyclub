'use client';

import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';

interface Department {
  id: string;
  name: string;
  sort_order: number;
}

interface DeptMember {
  id: string;
  department_id: string;
  name: string;
  is_head: boolean;
  photo_url: string | null;
  sort_order: number;
}

export default function DepartmentsEditor() {
  const [depts, setDepts] = useState<Department[]>([]);
  const [members, setMembers] = useState<DeptMember[]>([]);
  const [msg, setMsg] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseClient();
    supabase.from('departments').select('*').order('sort_order').then(({ data }) => setDepts(data ?? []));
    supabase.from('department_members').select('*').order('sort_order').then(({ data }) => setMembers(data ?? []));
  }, []);

  async function updateDept(id: string, name: string) {
    const supabase = createSupabaseClient();
    await supabase.from('departments').update({ name }).eq('id', id);
    setDepts((prev) => prev.map((d) => (d.id === id ? { ...d, name } : d)));
    setMsg('Updated.');
  }

  async function addDept() {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from('departments').insert({ name: 'New Department', sort_order: depts.length }).select().single();
    if (data) setDepts((prev) => [...prev, data]);
    setMsg(error ? error.message : 'Added.');
  }

  async function deleteDept(id: string) {
    if (!confirm('Delete department and all its members?')) return;
    const supabase = createSupabaseClient();
    await supabase.from('departments').delete().eq('id', id);
    setDepts((prev) => prev.filter((d) => d.id !== id));
    setMembers((prev) => prev.filter((m) => m.department_id !== id));
    setMsg('Deleted.');
  }

  async function addMember(department_id: string, isHead: boolean) {
    const supabase = createSupabaseClient();
    const existing = members.filter((m) => m.department_id === department_id);
    const { data, error } = await supabase.from('department_members').insert({
      department_id,
      name: 'New Member',
      is_head: isHead,
      sort_order: existing.length,
    }).select().single();
    if (data) setMembers((prev) => [...prev, data]);
    setMsg(error ? error.message : 'Added.');
  }

  async function updateMember(id: string, field: keyof DeptMember, value: string | number | boolean) {
    const supabase = createSupabaseClient();
    await supabase.from('department_members').update({ [field]: value }).eq('id', id);
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
    setMsg('Updated.');
  }

  async function deleteMember(id: string) {
    const supabase = createSupabaseClient();
    await supabase.from('department_members').delete().eq('id', id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setMsg('Deleted.');
  }

  async function uploadPhoto(id: string, file: File) {
    const supabase = createSupabaseClient();
    const ext = file.name.split('.').pop();
    const path = `dept-members/${id}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('club-assets').upload(path, file, { upsert: true });
    if (uploadError) {
      setMsg(uploadError.message);
      return;
    }
    const { data: urlData } = supabase.storage.from('club-assets').getPublicUrl(path);
    await supabase.from('department_members').update({ photo_url: urlData.publicUrl }).eq('id', id);
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, photo_url: urlData.publicUrl } : m)));
    setMsg('Photo uploaded.');
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Departments</h2>
        <button type="button" onClick={addDept} className="px-3 py-1.5 rounded bg-indigo-600 text-white text-sm">Add Department</button>
      </div>
      <div className="space-y-2">
        {depts.map((d) => (
          <div key={d.id} className="rounded bg-white/5 border border-white/10 overflow-hidden">
            <div className="p-3 flex items-center gap-2">
              <input value={d.name} onChange={(e) => updateDept(d.id, e.target.value)} className="flex-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-sm" />
              <button type="button" onClick={() => setExpanded(expanded === d.id ? null : d.id)} className="text-white/70 text-sm">Members</button>
              <button type="button" onClick={() => deleteDept(d.id)} className="text-red-400 text-sm">Delete</button>
            </div>
            {expanded === d.id && (
              <div className="p-3 border-t border-white/10 space-y-2">
                <div className="flex gap-2">
                  <button type="button" onClick={() => addMember(d.id, true)} className="px-2 py-1 rounded bg-indigo-600/80 text-white text-xs">+ Head</button>
                  <button type="button" onClick={() => addMember(d.id, false)} className="px-2 py-1 rounded bg-white/10 text-white text-xs">+ Member</button>
                </div>
                {members.filter((m) => m.department_id === d.id).map((m) => (
                  <div key={m.id} className="flex items-center gap-2 flex-wrap">
                    <input value={m.name} onChange={(e) => updateMember(m.id, 'name', e.target.value)} className="w-32 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-sm" />
                    <label className="flex items-center gap-1 text-white/70 text-xs">
                      <input type="checkbox" checked={m.is_head} onChange={(e) => updateMember(m.id, 'is_head', e.target.checked)} /> Head
                    </label>
                    <input type="file" accept="image/*" className="text-white/70 text-xs max-w-[120px]" onChange={(e) => e.target.files?.[0] && uploadPhoto(m.id, e.target.files[0])} />
                    <button type="button" onClick={() => deleteMember(m.id)} className="text-red-400 text-xs">Del</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {msg && <p className="text-sm text-white/70">{msg}</p>}
    </div>
  );
}
