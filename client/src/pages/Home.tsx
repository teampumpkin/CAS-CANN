import { useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import WelcomeSection from '@/components/WelcomeSection';
import AmyloidosisSection from '@/components/AmyloidosisSection';
import EventsNewsletterSection from '@/components/EventsNewsletterSection';
import DirectoryPreviewSection from '@/components/DirectoryPreviewSection';
import QuickLinksSection from '@/components/QuickLinksSection';
import FeaturedSpotlights from '@/components/FeaturedSpotlights';
import FAQSection from '@/components/FAQSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCATA';
import { useScrollAnimations } from '@/hooks/use-scroll-animations';

export default function Home() {
  useScrollAnimations();

  useEffect(() => {
    document.title = "Canadian Amyloidosis Society - Accelerating awareness, diagnosis, and care";
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <WelcomeSection />
        <AmyloidosisSection />
        <EventsNewsletterSection />
        <DirectoryPreviewSection />
        <QuickLinksSection />
        <FeaturedSpotlights />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
      <StickyCTA />
    </div>
  );
}
