import React from 'react';

// Layout components
import Header from '@/components/landing/layout/Header';
import Footer from '@/components/landing/layout/Footer';

// Section components
import HeroSection from '@/components/landing/sections/HeroSection';
import FeaturesSection from '@/components/landing/sections/FeaturesSection';
import TestimonialsSection from '@/components/landing/sections/TestimonialsSection';
import PricingSection from '@/components/landing/sections/PricingSection';
import ContactSection from '@/components/landing/sections/ContactSection';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <Header />
      
      {/* Main Content */}
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <ContactSection />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;