import { createSupabaseServerClient } from '@/lib/supabase/server';
import GalleryClient from './GalleryClient';
import PageSection from '@/components/PageSection';

export default async function GalleryPage() {
  const supabase = createSupabaseServerClient();
  const { data: images } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });

  return (
    <PageSection>
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
          Gallery
        </h1>
        <p className="text-white/70 text-center max-w-2xl mx-auto mb-12">
          Moments from THE MATHnify CLUB events and activities.
        </p>
        <GalleryClient images={images || []} />
      </div>
    </PageSection>
  );
}
