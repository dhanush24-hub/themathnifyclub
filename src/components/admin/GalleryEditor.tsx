'use client';

import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
}

export default function GalleryEditor() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseClient();
    supabase.from('gallery').select('*').order('created_at', { ascending: false }).then(({ data }) => setImages(data ?? []));
  }, []);

  async function uploadImage(file: File, title: string, description: string) {
    setUploading(true);
    setMsg('');
    const supabase = createSupabaseClient();
    const ext = file.name.split('.').pop();
    const path = `gallery/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('club-assets').upload(path, file, { upsert: false });
    if (uploadError) {
      setMsg(uploadError.message);
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from('club-assets').getPublicUrl(path);
    const { data: row, error } = await supabase.from('gallery').insert({ title: title || file.name, description: description || null, image_url: urlData.publicUrl }).select().single();
    if (row) setImages((prev) => [row, ...prev]);
    setMsg(error ? error.message : 'Uploaded.');
    setUploading(false);
  }

  async function updateField(id: string, field: 'title' | 'description', value: string) {
    const supabase = createSupabaseClient();
    await supabase.from('gallery').update({ [field]: value }).eq('id', id);
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, [field]: value } : img)));
    setMsg('Updated.');
  }

  async function deleteImage(id: string) {
    if (!confirm('Delete this image?')) return;
    const supabase = createSupabaseClient();
    await supabase.from('gallery').delete().eq('id', id);
    setImages((prev) => prev.filter((img) => img.id !== id));
    setMsg('Deleted.');
  }

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const file = (form.elements.namedItem('file') as HTMLInputElement).files?.[0];
    const title = (form.elements.namedItem('title') as HTMLInputElement).value;
    const description = (form.elements.namedItem('description') as HTMLInputElement).value;
    if (!file) {
      setMsg('Select a file.');
      return;
    }
    uploadImage(file, title, description);
    form.reset();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Gallery</h2>
      <form onSubmit={handleFormSubmit} className="p-4 rounded bg-white/5 border border-white/10 space-y-2">
        <input type="file" name="file" accept="image/*" required className="text-white/70 text-sm" />
        <input name="title" type="text" placeholder="Title" className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-sm" />
        <input name="description" type="text" placeholder="Description" className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-sm" />
        <button type="submit" disabled={uploading} className="px-3 py-1.5 rounded bg-indigo-600 text-white text-sm disabled:opacity-50">
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((img) => (
          <div key={img.id} className="rounded bg-white/5 border border-white/10 p-2 space-y-2">
            <div className="aspect-video rounded bg-white/5 overflow-hidden">
              <img src={img.image_url} alt={img.title} className="w-full h-full object-cover" />
            </div>
            <input value={img.title} onChange={(e) => updateField(img.id, 'title', e.target.value)} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-sm" />
            <input value={img.description ?? ''} onChange={(e) => updateField(img.id, 'description', e.target.value)} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-sm" placeholder="Description" />
            <button type="button" onClick={() => deleteImage(img.id)} className="text-red-400 text-sm">Delete</button>
          </div>
        ))}
      </div>
      {msg && <p className="text-sm text-white/70">{msg}</p>}
    </div>
  );
}
