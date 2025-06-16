import Hero from '../components/Hero';
import WelcomeSection from '../components/WelcomeSection';
import AboutAmyloidosisSection from '../components/AboutAmyloidosisSection';
import EventsNewsletterSection from '../components/EventsNewsletterSection';
import DirectoryPreviewSection from '../components/DirectoryPreviewSection';
import QuickLinksSection from '../components/QuickLinksSection';
import FeaturedSpotlights from '../components/FeaturedSpotlights';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <WelcomeSection />
      <AboutAmyloidosisSection />
      <EventsNewsletterSection />
      <DirectoryPreviewSection />
      <QuickLinksSection />
      <FeaturedSpotlights />
    </div>
  );
}