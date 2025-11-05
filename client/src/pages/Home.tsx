import Hero from '@/components/Hero';
import WelcomeSection from '@/components/WelcomeSection';
import AboutAmyloidosisSection from '@/components/AboutAmyloidosisSection';
import DirectoryPreviewSection from '@/components/DirectoryPreviewSection';
import EventsNewsletterSection from '@/components/EventsNewsletterSection';
// import FeaturedSpotlights from '@/components/FeaturedSpotlights';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <WelcomeSection />
      <AboutAmyloidosisSection />
      <DirectoryPreviewSection />
      <EventsNewsletterSection />
      {/* <FeaturedSpotlights /> */}
    </main>
  );
}