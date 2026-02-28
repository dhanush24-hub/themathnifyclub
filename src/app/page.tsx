import { createSupabaseServerClient } from '@/lib/supabase/server';
import HeroSection from '@/components/HeroSection';
import Announcements from '@/components/Announcements';
import OverviewSection from '@/components/OverviewSection';

export default async function HomePage() {
  const supabase = createSupabaseServerClient();
  const { data: home } = await supabase.from('home_content').select('*').limit(1).single();

  return (
    <>
      <HeroSection
        headline={home?.hero_headline ?? 'Where Logic Meets Ambition'}
        subheadline={
          home?.hero_subheadline ??
          'THE MATHnify CLUB — Nurturing analytical excellence under CDC, NREC'
        }
      />
      <Announcements />
      <OverviewSection />
    </>
  );
}
