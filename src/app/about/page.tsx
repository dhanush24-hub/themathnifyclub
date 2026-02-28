import { createSupabaseServerClient } from '@/lib/supabase/server';

const DEFAULT_ABOUT =
  'Under the visionary leadership of Dr. G. Ramu and the guidance of our mentors, THE MATHnify CLUB fosters analytical excellence and structured aptitude mastery among aspiring professionals.';

export default async function AboutPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from('about_content').select('content').limit(1).single();

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
          About Us
        </h1>
        <p className="text-lg text-white/80 leading-relaxed text-center">
          {data?.content ?? DEFAULT_ABOUT}
        </p>
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="glass-panel rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Our Mission</h3>
            <p className="text-white/70 text-sm">
              To build a community of analytically strong individuals ready for industry and competitive assessments.
            </p>
          </div>
          <div className="glass-panel rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Under CDC, NREC</h3>
            <p className="text-white/70 text-sm">
              We operate as the official student-led wing of the Career Development Center at Narsimha Reddy Engineering College.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
