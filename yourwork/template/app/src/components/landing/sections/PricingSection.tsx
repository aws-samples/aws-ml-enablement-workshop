import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, ArrowRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { mlewTracker } from '../../../services/mlewTracker';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'Forever',
    description: 'Perfect for small teams getting started',
    features: [
      'Up to 5 team members',
      'Basic task management',
      'Community support',
      'Standard integrations',
      '5GB storage'
    ],
    cta: 'Get Started Free',
    popular: false
  },
  {
    name: 'Professional',
    price: '$29',
    period: 'per user/month',
    description: 'Advanced features for growing teams',
    features: [
      'Unlimited team members',
      'Advanced analytics',
      'Priority support',
      'All integrations',
      '100GB storage',
      'Custom workflows',
      'API access'
    ],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Contact Us',
    period: '',
    description: 'Enterprise-level security and customization',
    features: [
      'Everything in Professional',
      'Single Sign-On (SSO)',
      'Advanced security',
      'Dedicated support',
      'Unlimited storage',
      'Custom integrations',
      'SLA guarantee'
    ],
    cta: 'Contact Sales',
    popular: false
  }
];

const PricingSection: React.FC = () => {
  const [ref, inView] = useInView({ 
    threshold: 0.3,
    triggerOnce: true 
  });
  

  useEffect(() => {
    if (inView) {
      mlewTracker.trackView('pricing-section', { section: 'pricing', timestamp: Date.now() });
    }
  }, [inView]);

  const handlePlanClick = (planName: string, action: string) => {
    // Navigation logic can be added here if needed
    console.log(`Plan selected: ${planName}, Action: ${action}`);
  };

  return (
    <section 
      ref={ref}
      id="pricing" 
      className="section-padding bg-white"
    >
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Simple and Transparent
            <span className="gradient-text block">
              Pricing
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            Choose the perfect plan for your team.
            Start free and scale as you grow.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className={`pricing-card ${plan.popular ? 'pricing-card-popular' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star size={14} className="mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-primary-600">{plan.price}</span>
                  {plan.price !== 'Free' && plan.price !== 'Contact Us' && (
                    <span className="text-gray-600 ml-1">/{plan.period}</span>
                  )}
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check size={16} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanClick(plan.name, plan.cta)}
                data-track="true"
                data-track-name={`pricing-${plan.name.toLowerCase()}-cta`}
                className={`w-full ${plan.popular ? 'btn-primary' : 'btn-secondary'} group`}
              >
                {plan.cta}
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            All plans include core features and 24/7 support
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <span>✓ No setup fees</span>
            <span>✓ Cancel anytime</span>
            <span>✓ 14-day free trial</span>
            <span>✓ SOC 2 compliant</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;