import React from 'react';
import { motion } from 'framer-motion';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail,
  MapPin,
  Phone,
  ArrowUp,
  ExternalLink
} from 'lucide-react';
import { mlewTracker } from '../../../services/mlewTracker';

const footerSections = [
  {
    title: 'サービス',
    links: [
      { name: '機能', href: '#features' },
      { name: 'お客様の声', href: '#testimonials' },
      { name: '料金プラン', href: '#pricing' },
      { name: 'FAQ', href: '#faq' },
      { name: 'API', href: '#api' }
    ]
  },
  {
    title: '会社情報',
    links: [
      { name: '私たちについて', href: '#about' },
      { name: '採用情報', href: '#careers' },
      { name: 'ブログ', href: '#blog' },
      { name: 'プレス', href: '#press' },
      { name: 'パートナー', href: '#partners' }
    ]
  },
  {
    title: 'サポート',
    links: [
      { name: 'ヘルプセンター', href: '#help' },
      { name: 'コミュニティ', href: '#community' },
      { name: 'チュートリアル', href: '#tutorials' },
      { name: 'ウェビナー', href: '#webinars' },
      { name: 'お問い合わせ', href: '#contact' }
    ]
  },
  {
    title: '法的情報',
    links: [
      { name: 'プライバシーポリシー', href: '#privacy' },
      { name: '利用規約', href: '#terms' },
      { name: 'Cookie ポリシー', href: '#cookies' },
      { name: 'セキュリティ', href: '#security' },
      { name: 'コンプライアンス', href: '#compliance' }
    ]
  }
];

const socialLinks = [
  {
    name: 'GitHub',
    icon: Github,
    href: 'https://github.com/your-company',
    color: 'hover:text-gray-900'
  },
  {
    name: 'Twitter',
    icon: Twitter,
    href: 'https://twitter.com/your_company',
    color: 'hover:text-blue-400'
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    href: 'https://linkedin.com/company/your-company',
    color: 'hover:text-blue-600'
  },
  {
    name: 'Email',
    icon: Mail,
    href: 'mailto:support@your-company.com',
    color: 'hover:text-red-500'
  }
];

const Footer: React.FC = () => {
  const scrollToTop = () => {
    // Track scroll to top action
    mlewTracker.trackClick('footer-scroll-to-top', { action: 'scroll-to-top', source: 'footer' });
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleLinkClick = (linkName: string, href: string) => {
    // Track footer link clicks
    mlewTracker.trackNavigation(linkName.toLowerCase().replace(/\s+/g, '-'), href, 'footer');
  };

  const handleSocialClick = (platform: string, url: string) => {
    // Track social media clicks
    mlewTracker.trackClick(`footer-social-${platform.toLowerCase()}`, { 
      platform, 
      url, 
      source: 'footer' 
    });
  };

  const handleNewsletterSubmit = () => {
    // Track newsletter subscription
    mlewTracker.trackFormSubmit('newsletter', 'footer');
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container-custom section-padding">
        <div className="grid lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Logo */}
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Your App Name
                </h3>
                <p className="text-gray-400 mt-2">
                  Your App Description
                </p>
              </div>

              {/* Description */}
              <p className="text-gray-300 leading-relaxed">
                Your application's detailed description goes here. Explain what your app does
                and how it benefits your users.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center">
                  <MapPin size={16} className="mr-3 flex-shrink-0" />
                  <span>Your City, Your Country</span>
                </div>
                <div className="flex items-center">
                  <Phone size={16} className="mr-3 flex-shrink-0" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail size={16} className="mr-3 flex-shrink-0" />
                  <span>support@your-company.com</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleSocialClick(social.name, social.href)}
                    data-track="true"
                    data-track-name={`footer-social-${social.name.toLowerCase()}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 bg-gray-800 rounded-lg text-gray-400 transition-colors ${social.color}`}
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          <div className="lg:col-span-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {footerSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h4 className="font-semibold text-white mb-4">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        onClick={() => handleLinkClick(link.name, link.href)}
                        data-track="true"
                        data-track-name={`footer-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-gray-400 hover:text-white transition-colors text-sm flex items-center group"
                      >
                        {link.name}
                        {link.href.startsWith('http') && (
                          <ExternalLink size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 pt-8 border-t border-gray-800"
        >
          <div className="max-w-md mx-auto text-center lg:text-left lg:mx-0">
            <h4 className="font-semibold text-white mb-2">
              Stay Updated
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Get the latest updates and news delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button 
                onClick={handleNewsletterSubmit}
                data-track="true"
                data-track-name="footer-newsletter-submit"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © 2024 Your Company Name. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Your tagline goes here
              </p>
            </div>

            {/* Back to Top */}
            <motion.button
              onClick={scrollToTop}
              data-track="true"
              data-track-name="footer-scroll-to-top"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group"
            >
              <span className="text-sm">Back to Top</span>
              <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
                <ArrowUp size={16} />
              </div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30" />
    </footer>
  );
};

export default Footer;