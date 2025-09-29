import React from 'react';
import { motion } from 'framer-motion';
import { mlewTracker } from '../../services/mlewTracker';

const HomePage: React.FC = () => {
  const handleGetStarted = () => {
    mlewTracker.trackCTAClick('Get Started', 'home-page', '/features');
  };

  const handleLearnMore = () => {
    mlewTracker.trackClick('learn-more-button', { 
      source: 'home-page',
      destination: 'features' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MLEW React App Template
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A modern, production-ready React application template with TypeScript, 
            Tailwind CSS, and integrated analytics tracking.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={handleGetStarted}
              data-track="true"
              data-track-name="home-get-started-cta"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
            
            <motion.button
              onClick={handleLearnMore}
              data-track="true"
              data-track-name="home-learn-more-button"
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:border-blue-500 hover:text-blue-600 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Development</h3>
              <p className="text-gray-600">Built with Vite for lightning-fast development experience</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-3xl mb-4">🎨</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Modern Design</h3>
              <p className="text-gray-600">Tailwind CSS v4 with beautiful, responsive components</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Ready</h3>
              <p className="text-gray-600">Integrated MLEW Tracker for comprehensive user analytics</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
