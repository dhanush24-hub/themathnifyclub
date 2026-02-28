import JoinForm from './JoinForm';
import PageSection from '@/components/PageSection';

export default function JoinPage() {
  return (
    <PageSection>
      <div className="container mx-auto px-4 md:px-6 max-w-xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
          Join the Club
        </h1>
        <p className="text-white/70 text-center mb-12">
          Submit your application to become a member of THE MATHnify CLUB.
        </p>
        <JoinForm />
      </div>
    </PageSection>
  );
}
