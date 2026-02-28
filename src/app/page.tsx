import { createSupabaseServerClient } from '@/lib/supabase/server';
import HeroSection from '@/components/HeroSection';
import Announcements from '@/components/Announcements';
import HomeHighlights from '@/components/HomeHighlights';
import OverviewSection from '@/components/OverviewSection';
import ScrollReveal from '@/components/ScrollReveal';

export default async function HomePage() {
  const supabase = createSupabaseServerClient();
  const { data: home } = await supabase.from('home_content').select('*').limit(1).single();

  return (
    <>
      <HeroSection
        headline={home?.hero_headline ?? 'Where Logic Meets Ambition'}
        subheadline={
          home?.hero_subheadline ??
          'THE MATHnify CLUB — Nurturing analytical excellence under CDC, NRCM'
        }
      />
      <ScrollReveal>
        <Announcements />
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <HomeHighlights />
      </ScrollReveal>
      <ScrollReveal delay={0.15}>
        <OverviewSection />
      </ScrollReveal>
    </>
  );
}
