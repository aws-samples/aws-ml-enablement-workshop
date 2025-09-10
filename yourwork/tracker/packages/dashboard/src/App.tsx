// React 19+ doesn't require explicit React import for JSX
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/common/Layout.js';
import { ApplicationsPage } from './pages/ApplicationsPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { useAppStore } from './stores/appStore.js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const initializeFromUrl = useAppStore(state => state.initializeFromUrl);
  
  useEffect(() => {
    // アプリケーション起動時にURLから初期化
    initializeFromUrl();
  }, [initializeFromUrl]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ApplicationsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/events" element={
          <div className="card text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">Events Page</h3>
            <p className="text-gray-600 mt-2">Coming soon...</p>
          </div>
        } />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
      </Router>
    </QueryClientProvider>
  );
}

export default App;