import Hero from '@/components/Hero';
import WelcomeSection from '@/components/WelcomeSection';
import AmyloidosisSection from '@/components/AmyloidosisSection';
import EventsNewsletterSection from '@/components/EventsNewsletterSection';
import DirectoryPreviewSection from '@/components/DirectoryPreviewSection';
import QuickLinksSection from '@/components/QuickLinksSection';
import FeaturedSpotlights from '@/components/FeaturedSpotlights';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <WelcomeSection />
      <AmyloidosisSection />
      <EventsNewsletterSection />
      <DirectoryPreviewSection />
      <QuickLinksSection />
      <FeaturedSpotlights />
    </main>
  );
}