import Hero from '@/components/Hero';
import WelcomeSection from '@/components/WelcomeSection';
import AmyloidosisSection from '@/components/AmyloidosisSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ServicesSection from '@/components/ServicesSection';
import ContactSection from '@/components/ContactSection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <WelcomeSection />
      <AmyloidosisSection />
      <TestimonialsSection />
      <ServicesSection />
      <ContactSection />
    </main>
  );
}