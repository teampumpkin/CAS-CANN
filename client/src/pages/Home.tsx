import Hero from '@/components/Hero';
import WelcomeSection from '@/components/WelcomeSection';
import AboutAmyloidosisSection from '@/components/AboutAmyloidosisSection';
import SummitRecapSection from '@/components/SummitRecapSection';
import DirectoryPreviewSection from '@/components/DirectoryPreviewSection';
import EventsNewsletterSection from '@/components/EventsNewsletterSection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <WelcomeSection />
      <AboutAmyloidosisSection />
      <SummitRecapSection />
      {/* Interactive Healthcare Directory Map — enabled in all environments */}
      <DirectoryPreviewSection />
      <EventsNewsletterSection />
    </main>
  );
}