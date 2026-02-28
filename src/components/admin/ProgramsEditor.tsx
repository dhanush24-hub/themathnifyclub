'use client';

import { useEffect, useMemo, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import type { Program, ProgramImage } from '@/lib/database.types';

function toDateInputValue(dateStr: string | null) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function ProgramsEditor() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [images, setImages] = useState<ProgramImage[]>([]);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const activeProgram = useMemo(
    () => programs.find((p) => p.id === activeId) ?? null,
    [programs, activeId]
  );

  useEffect(() => {
    const supabase = createSupabaseClient();
    supabase
      .from('programs')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('program_date', { ascending: false })
      .then(({ data }) => {
        const list = (data ?? []) as Program[];
        setPrograms(list);
        setActiveId((prev) => prev ?? list[0]?.id ?? null);
      });
  }, []);

  useEffect(() => {
    if (!activeId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImages([]);
      return;
    }
    const supabase = createSupabaseClient();
    supabase
      .from('program_images')
      .select('*')
      .eq('program_id', activeId)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })
      .then(({ data }) => setImages((data ?? []) as ProgramImage[]));
  }, [activeId]);

  async function addProgram() {
    setBusy(true);
    setMsg('');
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('programs')
      .insert({
        title: 'New Program',
        description: 'Add a concise summary (1–2 lines).',
        details: 'Write 2–3 short paragraphs.\n\nSeparate paragraphs with a blank line.',
        program_date: null,
        image_url: null,
        sort_order: programs.length,
      })
      .select('*')
      .single();

    if (data) {
      const row = data as Program;
      setPrograms((prev) => [row, ...prev]);
      setActiveId(row.id);
    }
    setMsg(error ? error.message : 'Program created.');
    setBusy(false);
  }

  async function updateProgramField(
    id: string,
    patch: Partial<Pick<Program, 'title' | 'description' | 'details' | 'program_date' | 'sort_order' | 'image_url'>>
  ) {
    setMsg('');
    const supabase = createSupabaseClient();
    const { error } = await supabase.from('programs').update(patch).eq('id', id);
    if (!error) {
      setPrograms((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
      setMsg('Saved.');
    } else {
      setMsg(error.message);
    }
  }

  async function deleteProgram(id: string) {
    if (!confirm('Delete this program? This will also remove its event photos.')) return;
    setMsg('');
    const supabase = createSupabaseClient();
    const { error } = await supabase.from('programs').delete().eq('id', id);
    if (error) {
      setMsg(error.message);
      return;
    }
    setPrograms((prev) => prev.filter((p) => p.id !== id));
    setActiveId((prev) => {
      if (prev !== id) return prev;
      const next = programs.find((p) => p.id !== id)?.id ?? null;
      return next;
    });
    setMsg('Deleted.');
  }

  async function uploadCover(file: File) {
    if (!activeId) return;
    setBusy(true);
    setMsg('');
    const supabase = createSupabaseClient();

    const ext = file.name.split('.').pop() || 'png';
    const path = `programs/${activeId}/cover-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('club-assets').upload(path, file, { upsert: false });
    if (uploadError) {
      setMsg(uploadError.message);
      setBusy(false);
      return;
    }
    const { data: urlData } = supabase.storage.from('club-assets').getPublicUrl(path);
    await updateProgramField(activeId, { image_url: urlData.publicUrl });
    setBusy(false);
  }

  async function uploadEventImages(files: FileList) {
    if (!activeId) return;
    setBusy(true);
    setMsg('');
    const supabase = createSupabaseClient();

    const baseSort = images.length;
    const added: ProgramImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i]!;
      const ext = file.name.split('.').pop() || 'png';
      const path = `programs/${activeId}/photos/${Date.now()}-${i}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('club-assets').upload(path, file, { upsert: false });
      if (uploadError) {
        setMsg(uploadError.message);
        continue;
      }
      const { data: urlData } = supabase.storage.from('club-assets').getPublicUrl(path);
      const { data: row, error } = await supabase
        .from('program_images')
        .insert({
          program_id: activeId,
          image_url: urlData.publicUrl,
          sort_order: baseSort + added.length,
        })
        .select('*')
        .single();
      if (error) {
        setMsg(error.message);
        continue;
      }
      if (row) added.push(row as ProgramImage);
    }

    if (added.length > 0) setImages((prev) => [...prev, ...added]);
    setMsg(added.length > 0 ? 'Uploaded.' : msg || 'No images uploaded.');
    setBusy(false);
  }

  async function updateImageSort(id: string, sort_order: number) {
    const supabase = createSupabaseClient();
    const { error } = await supabase.from('program_images').update({ sort_order }).eq('id', id);
    if (!error) {
      setImages((prev) => prev.map((img) => (img.id === id ? { ...img, sort_order } : img)).sort((a, b) => a.sort_order - b.sort_order));
      setMsg('Updated.');
    } else {
      setMsg(error.message);
    }
  }

  async function deleteImage(id: string) {
    if (!confirm('Delete this photo?')) return;
    const supabase = createSupabaseClient();
    const { error } = await supabase.from('program_images').delete().eq('id', id);
    if (!error) {
      setImages((prev) => prev.filter((img) => img.id !== id));
      setMsg('Deleted.');
    } else {
      setMsg(error.message);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">Programs</h2>
        <button
          type="button"
          onClick={addProgram}
          disabled={busy}
          className="px-3 py-1.5 rounded bg-indigo-600 text-white text-sm disabled:opacity-50"
        >
          Add Program
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
        <div className="rounded-lg bg-white/5 border border-white/10 p-2">
          <div className="text-xs uppercase tracking-wider text-white/50 px-2 py-2">All Programs</div>
          <div className="space-y-1">
            {programs.length === 0 ? (
              <div className="text-sm text-white/60 px-2 py-3">No programs yet.</div>
            ) : (
              programs.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActiveId(p.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${activeId === p.id ? 'bg-indigo-600/70 text-white' : 'text-white/80 hover:bg-white/5'
                    }`}
                >
                  <div className="font-medium truncate">{p.title}</div>
                  <div className="text-xs text-white/50 truncate">{p.description ?? ''}</div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg bg-white/5 border border-white/10 p-4">
          {!activeProgram ? (
            <div className="text-white/60 text-sm">Select a program to edit.</div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-wider text-white/50">Editing</div>
                  <div className="text-white font-semibold truncate">{activeProgram.title}</div>
                </div>
                <button type="button" onClick={() => deleteProgram(activeProgram.id)} className="text-red-400 text-sm">
                  Delete
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-white/60">Title</label>
                  <input
                    value={activeProgram.title}
                    onChange={(e) => updateProgramField(activeProgram.id, { title: e.target.value })}
                    className="w-full px-2 py-1.5 rounded bg-white/5 border border-white/10 text-white text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-white/60">Date</label>
                  <input
                    type="date"
                    value={toDateInputValue(activeProgram.program_date)}
                    onChange={(e) =>
                      updateProgramField(activeProgram.id, {
                        program_date: e.target.value ? e.target.value : null,
                      })
                    }
                    className="w-full px-2 py-1.5 rounded bg-white/5 border border-white/10 text-white text-sm"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs text-white/60">Concise summary (1–2 lines)</label>
                  <input
                    value={activeProgram.description ?? ''}
                    onChange={(e) => updateProgramField(activeProgram.id, { description: e.target.value || null })}
                    className="w-full px-2 py-1.5 rounded bg-white/5 border border-white/10 text-white text-sm"
                    placeholder="Short summary for the Programs list"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs text-white/60">Full details (2–3 paragraphs)</label>
                  <textarea
                    value={activeProgram.details ?? ''}
                    onChange={(e) => updateProgramField(activeProgram.id, { details: e.target.value || null })}
                    rows={7}
                    className="w-full px-2 py-1.5 rounded bg-white/5 border border-white/10 text-white text-sm resize-none"
                    placeholder="Write 2–3 short paragraphs. Separate paragraphs with a blank line."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-white/60">Sort order</label>
                  <input
                    type="number"
                    value={activeProgram.sort_order ?? 0}
                    onChange={(e) => updateProgramField(activeProgram.id, { sort_order: Number(e.target.value || 0) })}
                    className="w-full px-2 py-1.5 rounded bg-white/5 border border-white/10 text-white text-sm"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <div className="text-sm font-semibold text-white mb-2">Cover image</div>
                {activeProgram.image_url ? (
                  <div className="rounded-lg overflow-hidden bg-white/5 border border-white/10 mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={activeProgram.image_url} alt="" className="w-full h-44 object-cover" />
                  </div>
                ) : (
                  <div className="text-xs text-white/50 mb-3">Optional. Shown on the program details page.</div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  disabled={busy}
                  onChange={(e) => {
                    const file = e.currentTarget.files?.[0];
                    if (file) uploadCover(file);
                    e.currentTarget.value = '';
                  }}
                  className="text-white/70 text-sm"
                />
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <div className="text-sm font-semibold text-white">Event photos</div>
                    <div className="text-xs text-white/50">Upload 3–4 photos for the “Know more” page.</div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={busy}
                    onChange={(e) => {
                      const files = e.currentTarget.files;
                      if (files && files.length > 0) uploadEventImages(files);
                      e.currentTarget.value = '';
                    }}
                    className="text-white/70 text-sm"
                  />
                </div>

                {images.length === 0 ? (
                  <div className="text-sm text-white/60">No photos uploaded yet.</div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {images
                      .slice()
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((img) => (
                        <div key={img.id} className="rounded bg-white/5 border border-white/10 p-2 space-y-2">
                          <div className="aspect-video rounded bg-white/5 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={img.sort_order ?? 0}
                              onChange={(e) => updateImageSort(img.id, Number(e.target.value || 0))}
                              className="w-20 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs"
                              title="Sort"
                            />
                            <button
                              type="button"
                              onClick={() => updateProgramField(activeProgram.id, { image_url: img.image_url })}
                              className="text-xs text-indigo-300 hover:text-indigo-200 transition-colors"
                            >
                              Set cover
                            </button>
                          </div>
                          <button type="button" onClick={() => deleteImage(img.id)} className="text-red-400 text-xs">
                            Delete
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {msg && <p className="text-sm text-white/70">{msg}</p>}
    </div>
  );
}

