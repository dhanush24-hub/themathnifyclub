import { createSupabaseServerClient } from '@/lib/supabase/server';
import Image from 'next/image';

export default async function PatronsMentorsPage() {
  const supabase = createSupabaseServerClient();
  const { data: list } = await supabase
    .from('patrons_mentors')
    .select('*')
    .order('sort_order', { ascending: true });

  const defaultList = [
    { name: 'Dr. G. Ramu', role: 'Dean (Professor, CSE)', description: null, photo_url: null },
    { name: 'Ms. P. Sushma', role: 'Mentor', description: null, photo_url: null },
    { name: 'Mr. Raju', role: 'Mentor', description: null, photo_url: null },
  ];
  const items = list?.length ? list : defaultList;

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
          Patrons & Mentors
        </h1>
        <p className="text-white/70 text-center max-w-2xl mx-auto mb-12">
          Our leadership and mentors who guide THE MATHnify CLUB.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {items.map((person: { id?: string; name: string; role: string; description: string | null; photo_url: string | null }) => (
            <div
              key={person.id ?? person.name}
              className="glass-panel rounded-xl p-6 text-center hover:border-white/15 transition-colors"
            >
              <div className="w-24 h-24 rounded-full bg-indigo-500/20 mx-auto mb-4 overflow-hidden flex items-center justify-center">
                {person.photo_url ? (
                  <Image
                    src={person.photo_url}
                    alt={person.name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-3xl font-bold text-indigo-400">
                    {person.name.charAt(0)}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-semibold text-white">{person.name}</h3>
              <p className="text-indigo-400 text-sm mt-1">{person.role}</p>
              {person.description && (
                <p className="text-white/70 text-sm mt-3">{person.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
