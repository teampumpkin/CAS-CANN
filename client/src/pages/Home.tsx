import { useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import WelcomeSection from '@/components/WelcomeSection';
import AmyloidosisSection from '@/components/AmyloidosisSection';
import EventsNewsletterSection from '@/components/EventsNewsletterSection';
import DirectoryPreviewSection from '@/components/DirectoryPreviewSection';
import QuickLinksSection from '@/components/QuickLinksSection';
import FeaturedSpotlights from '@/components/FeaturedSpotlights';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  useEffect(() => {
    document.title = "Canadian Amyloidosis Society - Accelerating awareness, diagnosis, and care";
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <WelcomeSection />
        <AmyloidosisSection />
        <EventsNewsletterSection />
        <DirectoryPreviewSection />
        <QuickLinksSection />
        <FeaturedSpotlights />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}