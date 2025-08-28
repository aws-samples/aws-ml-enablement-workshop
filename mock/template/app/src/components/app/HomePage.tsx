import { useEffect, useRef } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { mlewTracker } from '../../services/mlewTracker';

function HomePage() {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Track app page view only once (prevent React Strict Mode double execution)
    if (!hasTracked.current) {
      hasTracked.current = true;
      mlewTracker.trackPageView('app-home');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="mb-8 text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            MLEW React App Template
          </h1>
          <p className="mb-12 text-xl text-gray-600 sm:text-2xl">
            Modern React TypeScript application template with analytics integration
          </p>
          
          <div className="mb-12 flex justify-center">
            <LoadingSpinner />
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                React + TypeScript
              </h3>
              <p className="text-gray-600">
                Built with modern React and TypeScript for type-safe development
              </p>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Tailwind CSS
              </h3>
              <p className="text-gray-600">
                Utility-first CSS framework for rapid UI development
              </p>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Analytics Ready
              </h3>
              <p className="text-gray-600">
                Integrated MLEWW3 Tracker for comprehensive analytics
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;