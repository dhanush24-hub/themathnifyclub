import { createSupabaseServerClient } from '@/lib/supabase/server';
import PageSection from '@/components/PageSection';

export default async function ContactPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from('contact_content').select('*').limit(1).single();

  const address = data?.address ?? 'Narsimha Reddy Engineering College, Maisammaguda, Secunderabad, Telangana';
  const email = data?.email ?? 'mathnify@nrcm.ac.in';
  const phone = data?.phone;
  const other = data?.other_content;

  return (
    <PageSection>
      <div className="container mx-auto px-4 md:px-6 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
          Contact Us
        </h1>
        <p className="text-white/70 text-center mb-12">
          Get in touch with THE MATHnify CLUB.
        </p>
        <div className="glass-panel rounded-2xl p-8 space-y-6 hover-lift transition-all duration-300">
          <div>
            <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-2">Address</h3>
            <p className="text-white/90">{address}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-2">Email</h3>
            <a href={`mailto:${email}`} className="text-white/90 hover:text-indigo-400 transition-colors">
              {email}
            </a>
          </div>
          {phone && (
            <div>
              <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-2">Phone</h3>
              <a href={`tel:${phone}`} className="text-white/90 hover:text-indigo-400 transition-colors">
                {phone}
              </a>
            </div>
          )}
          {other && (
            <div className="pt-4 border-t border-white/10">
              <p className="text-white/80 text-sm whitespace-pre-wrap">{other}</p>
            </div>
          )}
        </div>
      </div>
    </PageSection>
  );
}
