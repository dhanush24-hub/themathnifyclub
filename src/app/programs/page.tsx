import { createSupabaseServerClient } from '@/lib/supabase/server';
import PageSection from '@/components/PageSection';
import type { Program } from '@/lib/database.types';
import Link from 'next/link';

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function ProgramsPage() {
  const supabase = createSupabaseServerClient();
  const { data: programs } = await supabase
    .from('programs')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('program_date', { ascending: false });

  const list = (programs || []) as Program[];

  return (
    <PageSection>
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
          Programs
        </h1>
        <p className="text-white/70 text-center max-w-2xl mx-auto mb-12">
          Workshops, bootcamps, and events conducted by THE MATHnify CLUB under CDC, NRCM.
        </p>
        <div className="space-y-6">
          {list.length === 0 ? (
            <div className="glass-panel rounded-xl p-8 text-center text-white/70">
              No programs listed yet. Check back soon for upcoming workshops and events.
            </div>
          ) : (
            list.map((program) => (
              <article
                key={program.id}
                className="glass-panel rounded-xl p-6 md:p-8 hover-lift transition-all duration-300 border border-white/5 hover:border-indigo-500/20"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {program.image_url && (
                    <div className="shrink-0 w-full sm:w-40 h-32 rounded-lg overflow-hidden bg-white/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={program.image_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h2 className="text-xl font-semibold text-white">
                        {program.title}
                      </h2>
                      {program.program_date && (
                        <span className="text-sm text-indigo-400/90">
                          {formatDate(program.program_date)}
                        </span>
                      )}
                    </div>
                    {program.description && (
                      <p className="text-white/75 leading-relaxed">
                        {program.description}
                      </p>
                    )}
                    <div className="mt-4">
                      <Link
                        href={`/programs/${program.id}`}
                        className="inline-flex items-center gap-2 text-sm text-indigo-300 hover:text-indigo-200 transition-colors"
                      >
                        Know more
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </PageSection>
  );
}
