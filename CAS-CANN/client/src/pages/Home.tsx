import Hero from '@/components/Hero';
import WelcomeSection from '@/components/WelcomeSection';
import AboutAmyloidosisSection from '@/components/AboutAmyloidosisSection';
import DirectoryPreviewSection from '@/components/DirectoryPreviewSection';
import EventsNewsletterSection from '@/components/EventsNewsletterSection';
import { isStaging } from '@/hooks/useEnvironment';

export default function Home() {
  const showMapSection = isStaging();
  
  return (
    <main className="min-h-screen">
      <Hero />
      <WelcomeSection />
      <AboutAmyloidosisSection />
      {showMapSection && <DirectoryPreviewSection />}
      <EventsNewsletterSection />
    </main>
  );
}