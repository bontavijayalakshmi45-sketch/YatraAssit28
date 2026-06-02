import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Home, MessageCircle, Map, Calculator, Compass, Briefcase, BarChart3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Page } from '../../App';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function MainLayout({ children, currentPage, onNavigate }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'home' as Page, label: 'Home', icon: Home },
    { id: 'chat' as Page, label: 'AI Chat', icon: MessageCircle },
    { id: 'itinerary' as Page, label: 'Itinerary', icon: Map },
    { id: 'budget' as Page, label: 'Budget', icon: Calculator },
    { id: 'destinations' as Page, label: 'Explore', icon: Compass },
    { id: 'trips' as Page, label: 'My Trips', icon: Briefcase },
    { id: 'admin' as Page, label: 'Admin', icon: BarChart3 },
  ];

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      onNavigate('auth');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Header
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onThemeToggle={toggleTheme}
        onAuthClick={handleAuthClick}
        onNavigate={onNavigate}
        theme={theme}
        user={user}
      />

      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentPage={currentPage}
          onNavigate={onNavigate}
          navItems={navItems}
        />

        <main className="flex-1 lg:ml-64 pt-16 min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-4 md:p-6 lg:p-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
