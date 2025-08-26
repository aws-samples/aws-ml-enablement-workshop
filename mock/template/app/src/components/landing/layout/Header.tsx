import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { mlewTracker } from '../../../services/mlewTracker';
import { getAppUrl } from '../../../config/appUrl';

const navigation = [
  { name: 'Features', href: '#features' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Contact', href: '#contact' },
];

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (name: string, href: string) => {
    // Track navigation with MLEW Tracker
    mlewTracker.trackNavigation(name.toLowerCase(), href, 'header-menu');
    
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    
    setIsOpen(false);
  };

  const handleCTAClick = () => {
    const appUrl = getAppUrl();
    // Track CTA click with MLEW Tracker
    mlewTracker.trackCTAClick('Get Started', 'header', appUrl);
    // Navigate to the app
    if (appUrl.startsWith('/')) {
      navigate(appUrl);
    } else {
      window.location.href = appUrl;
    }
  };

  const handleDemoClick = () => {
    // Track demo click with MLEW Tracker
    mlewTracker.trackCTAClick('View Demo', 'header', '#contact');
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🚀</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Your App Name</h1>
              <p className="text-xs text-gray-500 -mt-1">Your App Description</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item, index) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleNavClick(item.name, item.href)}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </motion.button>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              onClick={handleDemoClick}
              className="btn-ghost"
              data-track="true"
              data-element-name="header-demo-button"
              data-element-type="secondary-button"
            >
              View Demo
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              onClick={handleCTAClick}
              className="btn-primary"
              data-track="true"
              data-element-name="header-get-started-button"
              data-element-type="cta-button"
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Mobile menu */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-white shadow-lg lg:hidden"
            >
              <div className="container-custom py-6">
                <nav className="space-y-4">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavClick(item.name, item.href)}
                      className="block w-full text-left px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
                    >
                      {item.name}
                    </button>
                  ))}
                  
                  {/* Mobile CTA buttons */}
                  <div className="pt-4 space-y-3">
                    <button
                      onClick={handleDemoClick}
                      className="w-full btn-ghost justify-center"
                    >
                      View Demo
                    </button>
                    <button
                      onClick={handleCTAClick}
                      className="w-full btn-primary justify-center"
                    >
                      Get Started
                    </button>
                  </div>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;