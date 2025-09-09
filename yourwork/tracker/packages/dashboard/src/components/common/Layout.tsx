import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore.js';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const selectedApplication = useAppStore(state => state.selectedApplication);

  const navigation = [
    { name: 'アプリケーション', href: '/', current: location.pathname === '/' },
    { 
      name: 'ダッシュボード', 
      href: selectedApplication ? `/dashboard?app=${selectedApplication}` : '/dashboard', 
      current: location.pathname === '/dashboard',
      disabled: !selectedApplication 
    },
    { 
      name: 'イベント', 
      href: selectedApplication ? `/events?app=${selectedApplication}` : '/events', 
      current: location.pathname === '/events',
      disabled: !selectedApplication 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                MLEW Tracker
              </h1>
            </div>
            
            <nav className="flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    item.disabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : item.current
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={(e) => {
                    if (item.disabled) {
                      e.preventDefault();
                    }
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};