import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play,
  CheckCircle,
  ArrowRight,
  Users,
  BarChart3,
  Zap,
  Target
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { mlewTracker } from '../../../services/mlewTracker';
import { getAppUrl } from '@/config/appUrl';

const steps = [
  {
    step: '01',
    icon: Users,
    title: 'Team Setup',
    description: 'Create your workspace and invite team members. Define roles, permissions, and project structure in minutes.',
    details: [
      'Unlimited team member invitations',
      'Role-based permission settings',
      'Project template configuration',
      'Existing tool integrations'
    ],
    image: '/api/placeholder/400/300'
  },
  {
    step: '02',
    icon: Target,
    title: 'Workflow Definition',
    description: 'Create custom workflows tailored to your process. Set up automated task routing and approval processes.',
    details: [
      'Custom workflow builder',
      'Automated task assignment',
      'Approval processes',
      'Quality gates and checkpoints'
    ],
    image: '/api/placeholder/400/300'
  },
  {
    step: '03',
    icon: Zap,
    title: 'Execute and Automate',
    description: 'The platform automates repetitive tasks so your team can focus on innovation. Smart features learn patterns.',
    details: [
      'Intelligent task prioritization',
      'Automated testing pipelines',
      'Smart notifications',
      'Performance optimization'
    ],
    image: '/api/placeholder/400/300'
  },
  {
    step: '04',
    icon: BarChart3,
    title: 'Monitor and Optimize',
    description: 'Track progress with real-time analytics. Get insights to continuously improve your development process.',
    details: [
      'Real-time dashboards',
      'Performance metrics',
      'Predictive analytics',
      'Continuous improvement suggestions'
    ],
    image: '/api/placeholder/400/300'
  }
];

const benefits = [
  {
    stat: '50%',
    label: 'Faster Development',
    description: 'Reduce time to market with automated workflows'
  },
  {
    stat: '85%',
    label: 'Better Collaboration',
    description: 'Improved team communication and coordination'
  },
  {
    stat: '99.9%',
    label: 'System Reliability',
    description: 'Enterprise-level uptime and performance'
  }
];

const HowItWorksSection: React.FC = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({ 
    threshold: 0.2,
    triggerOnce: true 
  });
  
  // Track section view analytics
  useEffect(() => {
    if (inView) {
      mlewTracker.trackView('how-it-works-section', { section: 'how-it-works', timestamp: Date.now() });
    }
  }, [inView]);

  const handleStepClick = (stepTitle: string) => {
    mlewTracker.trackClick(`how-it-works-step-${stepTitle.toLowerCase().replace(/\s+/g, '-')}`, {
      stepTitle,
      location: 'how-it-works-step'
    });
  };

  const handleWatchDemoClick = () => {
    // In a real app, this would open a demo video modal
    alert('Full demo video would open here');
  };

  const handleGetStartedClick = () => {
    const appUrl = getAppUrl();
    if (appUrl.startsWith('/')) {
      navigate(appUrl);
    } else {
      window.open(appUrl, '_blank');
    }
  };

  return (
    <section 
      ref={ref}
      id="how-it-works" 
      className="section-padding bg-white"
    >
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-6">
            <Play size={16} className="mr-2" />
            How It Works
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            From Setup to Success in
            <span className="gradient-text block">
              Just 4 Steps
            </span>
          </h2>
          
          <p className="text-lg text-gray-600">
            Get your team up and running in minutes, not days.
            Our intuitive platform guides you through every step of the process.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-16 lg:space-y-20">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Content */}
              <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100 text-primary-600 font-bold text-lg">
                    {step.step}
                  </div>
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white`}>
                    <step.icon size={24} />
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    {step.description}
                  </p>
                </div>

                {/* Step details */}
                <div className="space-y-3">
                  {step.details.map((detail, detailIndex) => (
                    <motion.div
                      key={detail}
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ 
                        delay: (index * 0.2) + (detailIndex * 0.1) + 0.3,
                        duration: 0.4
                      }}
                      className="flex items-center space-x-3"
                    >
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{detail}</span>
                    </motion.div>
                  ))}
                </div>

                <button
                  onClick={() => handleStepClick(step.title)}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mt-6 group"
                >
                  Learn more about this step
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Visual/Mockup */}
              <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                  transition={{ delay: (index * 0.2) + 0.3, duration: 0.6 }}
                  className="relative"
                >
                  {/* Placeholder for actual mockup/screenshot */}
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl aspect-[4/3] flex items-center justify-center text-gray-500 shadow-lg">
                    <div className="text-center">
                      <step.icon size={48} className="mb-4 mx-auto opacity-40" />
                      <p className="text-sm font-medium">
                        {step.title} Interface
                      </p>
                    </div>
                  </div>

                  {/* Floating elements */}
                  <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-100"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs font-medium text-gray-700">Live</span>
                    </div>
                  </motion.div>

                  {index === 1 && (
                    <motion.div
                      animate={{ x: [-3, 3, -3] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute -bottom-4 -left-4 bg-primary-600 text-white rounded-lg shadow-lg p-3"
                    >
                      <div className="text-center">
                        <div className="text-lg font-bold">85%</div>
                        <div className="text-xs">Automated</div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 pt-16 border-t border-gray-200"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              The Results Speak for Themselves
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of teams who have transformed their development process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold gradient-text mb-2">
                  {benefit.stat}
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.label}
                </div>
                <div className="text-gray-600">
                  {benefit.description}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handleWatchDemoClick}
                className="btn-secondary group"
              >
                <Play size={16} className="mr-2 group-hover:scale-110 transition-transform" />
                Watch Full Demo
              </button>
              <button
                onClick={handleGetStartedClick}
                className="btn-primary group"
              >
                Get Started Now
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • 14-day free trial • 5-minute setup
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;