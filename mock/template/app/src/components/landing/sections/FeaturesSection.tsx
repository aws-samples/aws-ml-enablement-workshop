import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Settings, 
  Play, 
  RotateCcw, 
  Target, 
  Timer,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { mlewTracker } from '../../../services/mlewTracker';
import { getAppUrl } from '@/config/appUrl';

const features = [
  {
    icon: Timer,
    title: 'Lightning Fast',
    description: 'Built for speed and performance. Our solution delivers exceptional results with minimal latency and maximum efficiency.',
    highlights: [
      'Sub-second response times',
      'Optimized for performance',
      'Scalable architecture',
      'Real-time processing'
    ],
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: Settings,
    title: 'Fully Customizable',
    description: 'Tailor every aspect to your needs. Complete control over features, settings, and configurations for your perfect setup.',
    highlights: [
      'Flexible configuration options',
      'Custom workflows',
      'API integrations',
      'White-label solutions'
    ],
    color: 'from-green-500 to-green-600'
  },
  {
    icon: Play,
    title: 'Easy to Use',
    description: 'Intuitive interface designed for everyone. Get started in minutes with no technical expertise required.',
    highlights: [
      'One-click setup',
      'Intuitive dashboard',
      'Guided onboarding',
      'Mobile responsive'
    ],
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: RotateCcw,
    title: 'Auto-sync',
    description: 'Seamless synchronization across all devices. Your data is always up-to-date and accessible wherever you are.',
    highlights: [
      'Real-time sync',
      'Offline mode',
      'Cross-platform support',
      'Automatic backups'
    ],
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Target,
    title: 'Goal-Oriented',
    description: 'Designed to help you achieve your objectives. Track progress, set milestones, and reach your goals efficiently.',
    highlights: [
      'Goal tracking',
      'Progress analytics',
      'Performance metrics',
      'Success insights'
    ],
    color: 'from-red-500 to-red-600'
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Always on, always ready. Round-the-clock availability ensures you can access our services whenever you need them.',
    highlights: [
      '99.9% uptime guarantee',
      'Global infrastructure',
      'Automatic failover',
      '24/7 support'
    ],
    color: 'from-indigo-500 to-indigo-600'
  }
];

const FeaturesSection: React.FC = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({ 
    threshold: 0.3,
    triggerOnce: true 
  });
  

  // Track section view analytics
  useEffect(() => {
    if (inView) {
      mlewTracker.trackView('features-section', { section: 'features', timestamp: Date.now() });
    }
  }, [inView]);

  const handleFeatureClick = (featureTitle: string) => {
    // Track feature click
    mlewTracker.trackClick(`feature-${featureTitle.toLowerCase().replace(/\s+/g, '-')}`, {
      featureTitle,
      section: 'features',
      source: 'features-section'
    });
  };

  return (
    <section 
      ref={ref}
      id="features" 
      className="py-20 bg-gray-50"
    >
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              プラットフォームの
              <span className="gradient-text block sm:inline"> 特徴</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              シンプルでありながら効果的な機能で、あなたのワークフローと生産性を最大化します
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => handleFeatureClick(feature.title)}
              className="group bg-white rounded-xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon size={24} className="text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 mb-4 leading-relaxed">
                {feature.description}
              </p>

              {/* Highlights */}
              <div className="space-y-2">
                {feature.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start text-sm text-gray-600">
                    <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              {/* Hover arrow */}
              <div className="flex items-center mt-4 text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-sm font-medium mr-2">詳しく見る</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-lg text-gray-600 mb-6">
            すべての機能を今すぐ無料で体験してみませんか？
          </p>
          <button
            onClick={() => {
              const appUrl = getAppUrl();
              if (appUrl.startsWith('/')) {
                navigate(appUrl);
              } else {
                window.location.href = appUrl;
              }
            }}
            data-track="true"
            data-track-name="features-cta-button"
            className="btn-primary btn-lg group"
          >
            無料で始める
            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;