import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Calendar, Users, Wallet, MoreVertical, Eye, Download, Trash2, Plus, Filter, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Trip } from '../lib/supabase';
import html2canvas from 'html2canvas';

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-600', icon: Clock },
  planned: { label: 'Planned', color: 'bg-blue-100 text-blue-600', icon: Calendar },
  ongoing: { label: 'Ongoing', color: 'bg-saffron-100 text-saffron-600', icon: AlertCircle },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-600', icon: CheckCircle },
};

export function TripsPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => { if (user) fetchTrips(); }, [user, filterStatus]);

  const fetchTrips = async () => {
    setLoading(true);
    let query = supabase.from('trips').select('*').eq('user_id', user?.id);
    if (filterStatus !== 'all') query = query.eq('status', filterStatus);
    const { data } = await query.order('created_at', { ascending: false });
    if (data) setTrips(data);
    setLoading(false);
  };

  const updateTripStatus = async (tripId: string, status: Trip['status']) => {
    await supabase.from('trips').update({ status }).eq('id', tripId);
    fetchTrips();
    setActiveDropdown(null);
  };

  const deleteTrip = async (tripId: string) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      await supabase.from('trips').delete().eq('id', tripId);
      fetchTrips();
      setActiveDropdown(null);
    }
  };

  const downloadTrip = async (trip: Trip) => {
    const element = document.getElementById(`trip-${trip.id}`);
    if (!element) return;
    const canvas = await html2canvas(element);
    const link = document.createElement('a');
    link.download = `${trip.destination}-trip.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4"><Map className="w-10 h-10 text-gray-400" /></div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Sign in to View Your Trips</h3>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">Create an account to save and manage your travel plans</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">My Trips</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track your travel plans</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
              <option value="all">All Trips</option>
              <option value="draft">Draft</option>
              <option value="planned">Planned</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="w-12 h-12 border-4 border-saffron-500 border-t-transparent rounded-full spinner" /></div>
      ) : trips.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-saffron-500/10 to-teal-500/10 flex items-center justify-center mb-4"><Map className="w-10 h-10 text-saffron-500" /></div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Trips Yet</h3>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">Start planning your first adventure with our AI-powered itinerary generator</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {trips.map((trip) => {
              const StatusIcon = statusConfig[trip.status]?.icon || Clock;
              return (
                <motion.div key={trip.id} layout id={`trip-${trip.id}`} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden card-hover relative">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{trip.destination}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{trip.start_date ? new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Not set'}</span>
                        </div>
                      </div>
                      <div className="relative">
                        <button onClick={() => setActiveDropdown(activeDropdown === trip.id ? null : trip.id)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><MoreVertical className="w-5 h-5 text-gray-400" /></button>
                        <AnimatePresence>
                          {activeDropdown === trip.id && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 z-50">
                              <button onClick={() => { setSelectedTrip(trip); setActiveDropdown(null); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"><Eye className="w-4 h-4" />View</button>
                              <button onClick={() => downloadTrip(trip)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"><Download className="w-4 h-4" />Download</button>
                              {trip.status !== 'completed' && <button onClick={() => updateTripStatus(trip.id, 'completed')} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-green-600"><CheckCircle className="w-4 h-4" />Complete</button>}
                              <button onClick={() => deleteTrip(trip.id)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"><Trash2 className="w-4 h-4" />Delete</button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm mb-4">
                      <div className="flex items-center gap-1.5 text-gray-600"><Users className="w-4 h-4" />{trip.travelers_count}</div>
                      <div className="flex items-center gap-1.5 font-semibold text-saffron-600"><Wallet className="w-4 h-4" />₹{trip.budget?.toLocaleString()}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${statusConfig[trip.status]?.color || 'bg-gray-100 text-gray-600'}`}><StatusIcon className="w-3 h-3 inline mr-1" />{statusConfig[trip.status]?.label || trip.status}</span>
                      <span className="text-xs capitalize px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600">{trip.travel_type}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {selectedTrip && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSelectedTrip(null)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedTrip.destination}</h2>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 mt-1"><Calendar className="w-4 h-4" />{selectedTrip.start_date && selectedTrip.end_date && <span className="text-sm">{new Date(selectedTrip.start_date).toLocaleDateString()} - {new Date(selectedTrip.end_date).toLocaleDateString()}</span>}</div>
                </div>
                <button onClick={() => setSelectedTrip(null)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><span className="text-xl">&times;</span></button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900"><Users className="w-5 h-5 text-saffron-500 mb-2" /><p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedTrip.travelers_count}</p><p className="text-xs text-gray-500">Travelers</p></div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900"><Wallet className="w-5 h-5 text-teal-500 mb-2" /><p className="text-lg font-bold text-gray-900 dark:text-white">₹{selectedTrip.budget?.toLocaleString()}</p><p className="text-xs text-gray-500">Budget</p></div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900"><Map className="w-5 h-5 text-blue-500 mb-2" /><p className="text-sm font-bold text-gray-900 dark:text-white capitalize">{selectedTrip.travel_type}</p><p className="text-xs text-gray-500">Type</p></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
