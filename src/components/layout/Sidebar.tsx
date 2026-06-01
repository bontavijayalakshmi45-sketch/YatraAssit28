import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LucideIcon, Plus, History } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Page } from '../../App';
import { supabase, Trip } from '../../lib/supabase';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  navItems: { id: Page; label: string; icon: LucideIcon }[];
}

export function Sidebar({ isOpen, onClose, currentPage, onNavigate, navItems }: SidebarProps) {
  const { user } = useAuth();
  const [recentTrips, setRecentTrips] = useState<Trip[]>([]);

  useEffect(() => {
    if (user) fetchRecentTrips();
  }, [user]);

  const fetchRecentTrips = async () => {
    const { data } = await supabase.from('trips').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }).limit(3);
    if (data) setRecentTrips(data);
  };

  const handleNavigate = (page: Page) => {
    onNavigate(page);
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" />}
      </AnimatePresence>

      <motion.aside initial={false} animate={{ x: isOpen ? 0 : '-100%' }} className="fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 overflow-y-auto lg:translate-x-0 lg:static">
        <div className="p-4">
          <div className="flex items-center justify-between lg:hidden mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X className="w-5 h-5 text-gray-500" /></button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <motion.button key={item.id} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }} onClick={() => handleNavigate(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${isActive ? 'bg-gradient-to-r from-saffron-500/10 to-teal-500/10 text-saffron-600 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-saffron-500' : ''}`} />
                  <span>{item.label}</span>
                </motion.button>
              );
            })}
          </nav>

          {user && (
            <div className="mt-8">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleNavigate('itinerary')} className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-saffron-500 to-teal-500 text-white font-semibold shadow-lg">
                <Plus className="w-4 h-4" /> Plan New Trip
              </motion.button>
            </div>
          )}

          {user && recentTrips.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-3">
                <History className="w-4 h-4 text-gray-400" />
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Trips</h3>
              </div>
              <div className="space-y-2">
                {recentTrips.map((trip) => (
                  <button key={trip.id} className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{trip.destination}</p>
                    <p className="text-xs text-gray-500">{trip.status === 'draft' ? 'Draft' : trip.start_date ? new Date(trip.start_date).toLocaleDateString() : 'Not set'}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
}
