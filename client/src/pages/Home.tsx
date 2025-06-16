import { useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import WelcomeSection from '@/components/WelcomeSection';
import QuickLinksSection from '@/components/QuickLinksSection';
import AboutAmyloidosisSection from '@/components/AboutAmyloidosisSection';
import ResourcesSection from '@/components/ResourcesSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  useEffect(() => {
    document.title = "Canadian Amyloidosis Society - Accelerating awareness, diagnosis, and care";
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <WelcomeSection />
        <QuickLinksSection />
        <AboutAmyloidosisSection />
        <ResourcesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
