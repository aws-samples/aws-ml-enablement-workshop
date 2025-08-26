import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { mlewTracker } from '../../../services/mlewTracker';

interface FormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

const ContactSection: React.FC = () => {
  const [ref, inView] = useInView({ 
    threshold: 0.3,
    triggerOnce: true 
  });
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (inView) {
      mlewTracker.trackView('contact-section', { section: 'contact', timestamp: Date.now() });
    }
  }, [inView]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Form submission will be automatically tracked by data-track attribute

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Success event will be tracked by auto-tracking

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', company: '', message: '' });
      }, 3000);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      details: 'hello@company.com',
      link: 'mailto:hello@company.com'
    },
    {
      icon: Phone,
      title: 'Phone',
      details: '+1 (555) 123-4567',
      link: 'tel:+15551234567'
    },
    {
      icon: MapPin,
      title: 'Office',
      details: 'San Francisco, CA',
      link: '#'
    }
  ];

  return (
    <section 
      ref={ref}
      id="contact" 
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
            Ready to Transform
            <span className="gradient-text block">
              Your Workflow?
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            Discover how our platform can streamline your development process.
            Get in touch with our team to learn more.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="card p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Send Message
              </h3>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Message sent successfully!
                  </h4>
                  <p className="text-gray-600">
                    We'll get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="form-label">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="form-label">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="form-label">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="form-label">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="form-textarea"
                      placeholder="Tell us about your business needs..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    data-track="true"
                    data-track-name="contact-form-submit"
                    className="btn-primary w-full group"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="spinner mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Get in Touch
              </h3>
              <p className="text-gray-600 mb-8">
                Have questions about our platform? Our team is here to help you get started
                and make the most of our solution.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={info.title}
                  href={info.link}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                  className="flex items-center space-x-4 p-4 rounded-lg hover:bg-white transition-colors group"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary-100 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <info.icon size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{info.title}</div>
                    <div className="text-gray-600">{info.details}</div>
                  </div>
                </motion.a>
              ))}
            </div>

            <div className="pt-8 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">
                Want to schedule a demo?
              </h4>
              <p className="text-gray-600 mb-6">
                See how our platform can transform your workflow with a
                personalized demo tailored to your needs.
              </p>
              <button 
                data-track="true"
                data-track-name="contact-schedule-demo"
                className="btn-secondary"
              >
                Schedule Demo
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;