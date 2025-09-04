import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '@/components/app/HomePage';

const AppPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Routes>
        {/* App home page */}
        <Route path="/" element={<HomePage />} />
        
        {/* Add more app routes here as needed */}
        {/* Example: <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* Example: <Route path="/profile" element={<Profile />} /> */}
      </Routes>
    </div>
  );
};

export default AppPage;