import { createSupabaseServerClient } from '@/lib/supabase/server';
import Image from 'next/image';

const DEFAULT_LEADS = [
  { name: 'Rahul Kumar', role: 'President' },
  { name: 'Neeraj Guptha', role: 'Vice President' },
  { name: 'Sandeep Reddy', role: 'Club Curator' },
  { name: 'Prabhakar Chaubey', role: 'Content Creator Head' },
  { name: 'Raga Rithika', role: 'Event Manager Head' },
  { name: 'Bhavya', role: 'Marketing Head' },
];

export default async function ClubLeadsPage() {
  const supabase = createSupabaseServerClient();
  const { data: list } = await supabase
    .from('executive_board')
    .select('*')
    .order('sort_order', { ascending: true });

  const items = list?.length ? list : DEFAULT_LEADS.map((l, i) => ({ ...l, photo_url: null, description: null, sort_order: i }));

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
          Club Leads & Executive Board
        </h1>
        <p className="text-white/70 text-center max-w-2xl mx-auto mb-12">
          The team driving THE MATHnify CLUB forward.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {items.map((member: { id?: string; name: string; role: string; photo_url?: string | null; description?: string | null }) => (
            <div
              key={member.id ?? member.name}
              className="glass-panel rounded-xl p-6 text-center hover:border-white/15 transition-colors"
            >
              <div className="w-28 h-28 rounded-full bg-indigo-500/20 mx-auto mb-4 overflow-hidden flex items-center justify-center">
                {member.photo_url ? (
                  <Image
                    src={member.photo_url}
                    alt={member.name}
                    width={112}
                    height={112}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-4xl font-bold text-indigo-400">
                    {member.name.charAt(0)}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-semibold text-white">{member.name}</h3>
              <p className="text-indigo-400 text-sm mt-1">{member.role}</p>
              {member.description && (
                <p className="text-white/70 text-sm mt-3">{member.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
