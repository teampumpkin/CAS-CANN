import { useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import NavigationTiles from '@/components/NavigationTiles';
import AboutSection from '@/components/AboutSection';
import ResourcesSection from '@/components/ResourcesSection';
import FAQSection from '@/components/FAQSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCATA';
import { useScrollAnimations } from '@/hooks/use-scroll-animations';

export default function Home() {
  useScrollAnimations();

  useEffect(() => {
    document.title = "Canadian Amyloidosis Society - Supporting Patients & Families";
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <NavigationTiles />
        <AboutSection />
        <ResourcesSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
      <StickyCTA />
    </div>
  );
}
