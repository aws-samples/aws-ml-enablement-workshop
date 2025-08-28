import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Play, 
  CheckCircle, 
  Clock, 
  Focus, 
  Users,
  TrendingUp
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { mlewTracker } from '../../../services/mlewTracker';
import { getAppUrl } from '@/config/appUrl';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({ 
    threshold: 0.3,
    triggerOnce: true 
  });
  

  // Track section view analytics
  useEffect(() => {
    if (inView) {
      mlewTracker.trackView('hero-section', { section: 'hero', timestamp: Date.now() });
    }
  }, [inView]);

  const handleGetStartedClick = () => {
    const appUrl = getAppUrl();
    // Navigate to main application
    if (appUrl.startsWith('/')) {
      navigate(appUrl);
    } else {
      window.location.href = appUrl;
    }
  };

  const handleWatchDemoClick = () => {
    // Open demo video modal
    alert('Demo video will open here');
  };

  const stats = [
    { icon: Users, value: '10,000+', label: 'Active Users' },
    { icon: TrendingUp, value: '99.9%', label: 'Uptime' },
    { icon: Clock, value: '24/7', label: 'Support' }
  ];

  const features = [
    'Enterprise-grade security',
    'Seamless integration',
    'Real-time analytics',
    'Scalable infrastructure'
  ];

  return (
    <section 
      ref={ref}
      id="hero" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 hero-pattern opacity-40" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [-100, 100, -100],
            y: [-100, 50, -100],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-green-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [100, -100, 100],
            y: [100, -50, 100],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
        />
      </div>
      
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
                <Focus size={16} className="mr-2" />
                Next Generation Solution
              </div>
              
              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Your Product
                <span className="gradient-text block">
                  Headline Here
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                A compelling description of your product or service that explains
                the value proposition and encourages visitors to take action.
              </p>
              
              {/* Feature highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 max-w-lg mx-auto lg:mx-0">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center text-sm text-gray-700"
                  >
                    <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </motion.div>
                ))}
              </div>
              
              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <button
                  onClick={handleGetStartedClick}
                  className="btn-primary btn-lg group"
                  data-track="true"
                  data-element-name="hero-get-started-button"
                  data-element-type="cta-button"
                >
                  Get Started
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={handleWatchDemoClick}
                  className="btn-secondary btn-lg group"
                  data-track="true"
                  data-element-name="hero-demo-button"
                  data-element-type="secondary-button"
                >
                  <Play size={20} className="mr-2 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </button>
              </motion.div>
              
              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-12 pt-8 border-t border-gray-200"
              >
                <p className="text-sm text-gray-500 mb-6">
                  Trusted by thousands of companies worldwide
                </p>
                <div className="grid grid-cols-3 gap-6 max-w-sm mx-auto lg:mx-0">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                      className="text-center"
                    >
                      <div className="flex justify-center mb-2">
                        <stat.icon size={24} className="text-blue-600" />
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-500">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Hero Visual - Pomodoro Timer Mockup */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Main timer mockup */}
              <div className="relative z-10 bg-white rounded-2xl shadow-strong p-8">
                {/* Timer display */}
                <div className="text-center mb-8">
                  <div className="text-sm text-blue-600 mb-2 font-medium">Live Demo</div>
                  <div className="text-6xl font-mono font-bold text-gray-900 mb-4">
                    <motion.span
                      key="timer"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      00:00
                    </motion.span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 3, delay: 1 }}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                    />
                  </div>
                </div>
                
                {/* Control buttons */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center w-16 h-16 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg"
                  >
                    <Play size={24} className="text-white ml-1" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center w-12 h-12 bg-gray-500 hover:bg-gray-600 text-white rounded-full shadow-lg"
                  >
                    <ArrowRight size={16} className="text-white" />
                  </motion.button>
                </div>

                {/* Session info */}
                <div className="text-center">
                  <div className="text-lg text-gray-600 mb-2">Status</div>
                  <div className="text-3xl font-bold text-gray-800">Active</div>
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-gray-700">Online</span>
                </div>
              </motion.div>
              
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100"
              >
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">+85%</div>
                  <div className="text-xs text-gray-600">Growth</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;