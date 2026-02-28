'use client';

import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';

export default function ContactEditor() {
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [other_content, setOtherContent] = useState('');
  const [id, setId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const supabase = createSupabaseClient();
    supabase.from('contact_content').select('*').limit(1).single().then(({ data }) => {
      if (data) {
        setId(data.id);
        setAddress(data.address ?? '');
        setEmail(data.email ?? '');
        setPhone(data.phone ?? '');
        setOtherContent(data.other_content ?? '');
      }
    });
  }, []);

  async function save() {
    setSaving(true);
    setMsg('');
    const supabase = createSupabaseClient();
    const payload = { address: address || null, email: email || null, phone: phone || null, other_content: other_content || null, updated_at: new Date().toISOString() };
    if (id) {
      const { error } = await supabase.from('contact_content').update(payload).eq('id', id);
      setSaving(false);
      setMsg(error ? error.message : 'Saved.');
      return;
    }
    const { data, error } = await supabase.from('contact_content').insert(payload).select('id').single();
    if (data) setId(data.id);
    setSaving(false);
    setMsg(error ? error.message : 'Saved.');
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Contact Details</h2>
      <div>
        <label className="block text-sm text-white/70 mb-1">Address</label>
        <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white" />
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-1">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white" />
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-1">Phone</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white" />
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-1">Other content</label>
        <textarea value={other_content} onChange={(e) => setOtherContent(e.target.value)} rows={3} className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white resize-none" />
      </div>
      <button type="button" onClick={save} disabled={saving} className="px-4 py-2 rounded bg-indigo-600 text-white text-sm disabled:opacity-50">
        {saving ? 'Saving...' : 'Save'}
      </button>
      {msg && <p className="text-sm text-white/70">{msg}</p>}
    </div>
  );
}
