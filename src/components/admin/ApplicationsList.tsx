'use client';

import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';

interface App {
  id: string;
  full_name: string;
  roll_number: string;
  department: string;
  year: string;
  phone: string;
  why_join: string;
  preferred_department: string;
  created_at: string;
}

export default function ApplicationsList() {
  const [list, setList] = useState<App[]>([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const supabase = createSupabaseClient();
    supabase.from('join_applications').select('*').order('created_at', { ascending: false }).then(({ data }) => setList(data ?? []));
  }, []);

  async function deleteApp(id: string) {
    if (!confirm('Delete this application?')) return;
    const supabase = createSupabaseClient();
    await supabase.from('join_applications').delete().eq('id', id);
    setList((prev) => prev.filter((a) => a.id !== id));
    setMsg('Deleted.');
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Join Applications</h2>
      {list.length === 0 ? (
        <p className="text-white/60">No applications yet.</p>
      ) : (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {list.map((a) => (
            <div key={a.id} className="p-4 rounded bg-white/5 border border-white/10 text-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-white">{a.full_name}</p>
                  <p className="text-white/70">Roll: {a.roll_number} · {a.department} · Year {a.year}</p>
                  <p className="text-white/70">Phone: {a.phone}</p>
                  <p className="text-white/70 mt-1">Preferred: {a.preferred_department}</p>
                  <p className="text-white/60 mt-1">{a.why_join}</p>
                  <p className="text-white/50 text-xs mt-1">{new Date(a.created_at).toLocaleString()}</p>
                </div>
                <button type="button" onClick={() => deleteApp(a.id)} className="text-red-400 shrink-0">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {msg && <p className="text-sm text-white/70">{msg}</p>}
    </div>
  );
}
