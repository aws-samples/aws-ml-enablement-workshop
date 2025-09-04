import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { mlewTracker } from '../../../services/mlewTracker';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Product Manager',
    company: 'TechFlow Inc',
    avatar: '/api/placeholder/64/64',
    rating: 5,
    text: 'This platform has revolutionized our team\'s productivity. The workflow automation alone saves us over 30 hours per week.',
    featured: true
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'CTO',
    company: 'DataVision Inc',
    avatar: '/api/placeholder/64/64',
    rating: 5,
    text: 'The analytics insights help us identify bottlenecks before they become problems. It\'s a game-changer for our development speed.'
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    role: 'Tech Lead',
    company: 'NextGen Labs',
    avatar: '/api/placeholder/64/64',
    rating: 5,
    text: 'The best platform we\'ve used so far. The integration features make remote work seamless and productive.'
  }
];

const TestimonialsSection: React.FC = () => {
  const [ref, inView] = useInView({ 
    threshold: 0.3,
    triggerOnce: true 
  });

  useEffect(() => {
    if (inView) {
      mlewTracker.trackView('testimonials-section', { section: 'testimonials', timestamp: Date.now() });
    }
  }, [inView]);

  return (
    <section 
      ref={ref}
      id="testimonials" 
      className="section-padding bg-gray-50"
    >
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Trusted by Teams
            <span className="gradient-text block">
              Worldwide
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            See what leading teams are saying about our platform
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className={`testimonial-card ${testimonial.featured ? 'md:scale-105 border-primary-200' : ''}`}
            >
              <Quote size={24} className="text-primary-500 mb-4" />
              
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-700 mb-6 italic">
                "{testimonial.text}"
              </p>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-sm text-primary-600">{testimonial.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;