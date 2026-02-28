import { createSupabaseServerClient } from '@/lib/supabase/server';
import Image from 'next/image';
import PageSection from '@/components/PageSection';

const DEFAULT_DEPTS = [
  'Marketing Team',
  'Event Management Team',
  'Technical Team',
  'Content Creator Team',
  'Treasurer Team',
];

export default async function DepartmentsPage() {
  const supabase = createSupabaseServerClient();
  const { data: departments } = await supabase
    .from('departments')
    .select('*')
    .order('sort_order', { ascending: true });

  const { data: allMembers } = await supabase.from('department_members').select('*');
  const depts = departments?.length ? departments : DEFAULT_DEPTS.map((name, i) => ({ id: `d-${i}`, name, sort_order: i }));

  return (
    <PageSection>
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
          Departments
        </h1>
        <p className="text-white/70 text-center max-w-2xl mx-auto mb-16">
          Our five core teams that drive club operations.
        </p>
        <div className="space-y-16 max-w-4xl mx-auto">
          {depts.map((dept: { id: string; name: string }) => {
            const members = (allMembers || []).filter((m: { department_id: string }) => m.department_id === dept.id);
            const head = members.find((m: { is_head: boolean }) => m.is_head);
            const rest = members.filter((m: { is_head: boolean }) => !m.is_head).slice(0, 6);

            return (
              <div key={dept.id} className="glass-panel rounded-2xl p-8 hover-lift transition-all duration-300">
                <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-3">
                  {dept.name}
                </h2>
                {head && (
                  <div className="mb-6">
                    <p className="text-xs uppercase tracking-wider text-indigo-400 mb-2">Team Head</p>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-indigo-500/20 overflow-hidden flex items-center justify-center shrink-0">
                        {head.photo_url ? (
                          <Image src={head.photo_url} alt={head.name} width={56} height={56} className="object-cover w-full h-full" />
                        ) : (
                          <span className="text-xl font-bold text-indigo-400">{head.name.charAt(0)}</span>
                        )}
                      </div>
                      <span className="text-white font-medium">{head.name}</span>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {rest.map((m: { id: string; name: string; photo_url: string | null }) => (
                    <div key={m.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden flex items-center justify-center shrink-0">
                        {m.photo_url ? (
                          <Image src={m.photo_url} alt={m.name} width={40} height={40} className="object-cover w-full h-full" />
                        ) : (
                          <span className="text-sm font-bold text-white/70">{m.name.charAt(0)}</span>
                        )}
                      </div>
                      <span className="text-white/80 text-sm truncate">{m.name}</span>
                    </div>
                  ))}
                </div>
                {members.length === 0 && (
                  <p className="text-white/50 text-sm">Team members will be listed here.</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </PageSection>
  );
}
