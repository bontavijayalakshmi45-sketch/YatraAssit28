import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Sun, Moon, LogIn, LogOut, User, Plane } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Page } from '../../App';

interface HeaderProps {
  onMenuClick: () => void;
  onThemeToggle: () => void;
  onAuthClick: () => void;
  onNavigate: (page: Page) => void;
  theme: 'light' | 'dark';
  user: SupabaseUser | null;
}

export function Header({ onMenuClick, onThemeToggle, onAuthClick, onNavigate, theme, user }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-500 to-teal-500 flex items-center justify-center shadow-lg">
              <Plane className="w-5 h-5 text-white transform -rotate-45" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold gradient-text">Yatra Assist</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">AI Travel Companion</p>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onThemeToggle} className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {theme === 'light' ? <Moon className="w-5 h-5 text-gray-700" /> : <Sun className="w-5 h-5 text-saffron-500" />}
          </motion.button>

          {user ? (
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onAuthClick} className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
              <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
            </motion.button>
          ) : (
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onAuthClick} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-lg">
              <LogIn className="w-4 h-4" />
              <span className="text-sm font-semibold">Sign In</span>
            </motion.button>
          )}
        </div>
      </div>
    </header>
  );
}
