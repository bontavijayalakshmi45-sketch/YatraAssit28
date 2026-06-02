import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { MainLayout } from './components/layout/MainLayout';
import { HomePage } from './pages/HomePage';
import { ChatPage } from './pages/ChatPage';
import { ItineraryPage } from './pages/ItineraryPage';
import { BudgetPage } from './pages/BudgetPage';
import { DestinationsPage } from './pages/DestinationsPage';
import { TripsPage } from './pages/TripsPage';
import { AuthPage } from './pages/AuthPage';
import { AdminPage } from './pages/AdminPage';

export type Page = 'home' | 'chat' | 'itinerary' | 'budget' | 'destinations' | 'trips' | 'auth' | 'admin';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'chat':
        return <ChatPage />;
      case 'itinerary':
        return <ItineraryPage />;
      case 'budget':
        return <BudgetPage />;
      case 'destinations':
        return <DestinationsPage />;
      case 'trips':
        return <TripsPage />;
      case 'auth':
        return <AuthPage onBack={() => setCurrentPage('home')} />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <MainLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </MainLayout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
