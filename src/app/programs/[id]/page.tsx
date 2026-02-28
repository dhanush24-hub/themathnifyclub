import { notFound } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import PageSection from '@/components/PageSection';
import type { Program, ProgramImage } from '@/lib/database.types';
import Link from 'next/link';

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const supabase = createSupabaseServerClient();

  // Fetch the program
  const { data: program } = await supabase
    .from('programs')
    .select('*')
    .eq('id', id)
    .single();

  if (!program) {
    notFound();
  }

  // Fetch program images
  const { data: images } = await supabase
    .from('program_images')
    .select('*')
    .eq('program_id', id)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  const prog = program as Program;
  const gallery = (images || []) as ProgramImage[];

  return (
    <PageSection>
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <Link 
          href="/programs" 
          className="inline-flex items-center gap-2 text-indigo-300 hover:text-indigo-200 transition-colors mb-8 group"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform" aria-hidden="true">←</span>
          Back to all programs
        </Link>
        
        <article className="glass-panel rounded-2xl p-6 md:p-10 border border-white/10 relative overflow-hidden">
          {prog.image_url && (
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={prog.image_url} alt="" className="w-full h-[50vh] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]"></div>
            </div>
          )}
          
          <div className="relative z-10 flex flex-col gap-6">
            <header className="space-y-4 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                  {prog.title}
                </h1>
              </div>
              
              {prog.program_date && (
                <div className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-sm md:text-base text-indigo-300">
                  📅 {formatDate(prog.program_date)}
                </div>
              )}
            </header>

            {prog.image_url && (
              <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden shadow-2xl border border-white/10 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={prog.image_url}
                  alt={prog.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            )}
            
            {(prog.description || prog.details) && (
              <div className="mt-8 prose prose-invert prose-indigo max-w-none text-white/80 md:text-lg leading-relaxed">
                {prog.description && !prog.details && (
                  <p>{prog.description}</p>
                )}
                {prog.details && (
                  <div className="space-y-6">
                    {prog.details.split('\n\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </article>

        {gallery.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
              <span className="h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent flex-1 max-w-[100px]"></span>
              Event Gallery
              <span className="h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent flex-1 max-w-[100px]"></span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((img) => (
                <div 
                  key={img.id} 
                  className="aspect-square rounded-xl overflow-hidden glass-panel border border-white/10 group cursor-pointer relative"
                >
                  <div className="absolute inset-0 bg-indigo-500/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={img.image_url} 
                    alt={`Event Photo`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageSection>
  );
}
