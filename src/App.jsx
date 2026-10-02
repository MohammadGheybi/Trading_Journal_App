import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import { JournalProvider } from '@/lib/journal/JournalContext';
import AppShell from '@/components/layout/AppShell';
import Dashboard from '@/pages/Dashboard';
import Journal from '@/pages/Journal';
import TradeForm from '@/pages/TradeForm';
import TradeDetail from '@/pages/TradeDetail';
import Calendar from '@/pages/Calendar';
import Analytics from '@/pages/Analytics';
import Sessions from '@/pages/Sessions';
import Accounts from '@/pages/Accounts';
import Settings from '@/pages/Settings';
import Report from '@/pages/Report';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#161616]">
        <div className="w-8 h-8 border-4 border-white/10 border-t-[#710014] rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <JournalProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/new" element={<TradeForm />} />
          <Route path="/journal/:id" element={<TradeDetail />} />
          <Route path="/journal/:id/edit" element={<TradeForm />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/report" element={<Report />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </JournalProvider>
  );
};

function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App