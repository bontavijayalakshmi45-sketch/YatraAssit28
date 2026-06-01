import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Wallet, Calendar } from 'lucide-react';
import { supabase, Destination, TravelType } from '../lib/supabase';

const categoryFilters: { id: TravelType | 'all'; label: string; emoji: string }[] = [
  { id: 'all', label: 'All', emoji: '🗺️' },
  { id: 'spiritual', label: 'Spiritual', emoji: '🙏' },
  { id: 'adventure', label: 'Adventure', emoji: '🏔️' },
  { id: 'heritage', label: 'Heritage', emoji: '🏛️' },
  { id: 'beach', label: 'Beach', emoji: '🏖️' },
  { id: 'wildlife', label: 'Wildlife', emoji: '🦁' },
];

export function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filtered, setFiltered] = useState<Destination[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TravelType | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  useEffect(() => { fetchDestinations(); }, []);

  useEffect(() => {
    let results = destinations;
    if (selectedCategory !== 'all') results = results.filter((d) => d.category === selectedCategory);
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter((d) => d.name.toLowerCase().includes(query) || d.state.toLowerCase().includes(query) || d.description?.toLowerCase().includes(query));
    }
    setFiltered(results);
  }, [searchQuery, selectedCategory, destinations]);

  const fetchDestinations = async () => {
    const { data } = await supabase.from('destinations').select('*').order('rating', { ascending: false });
    if (data) { setDestinations(data); setFiltered(data); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Explore Destinations</h1>
        <p className="text-gray-600 dark:text-gray-400">Discover amazing places to visit across India</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search destinations..." className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-saffron-500" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          {categoryFilters.map((filter) => (
            <motion.button key={filter.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedCategory(filter.id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl whitespace-nowrap ${selectedCategory === filter.id ? 'bg-gradient-to-r from-saffron-500 to-teal-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>
              <span>{filter.emoji}</span>
              <span className="text-sm font-medium">{filter.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="w-12 h-12 border-4 border-saffron-500 border-t-transparent rounded-full spinner" /></div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((destination) => (
            <motion.div key={destination.id} whileHover={{ y: -5 }} onClick={() => setSelectedDestination(destination)} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 cursor-pointer card-hover group">
              <div className="relative h-48">
                <img src={destination.image_url} alt={destination.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-1 text-white text-sm mb-1"><MapPin className="w-4 h-4" />{destination.state}</div>
                  <h3 className="text-xl font-bold text-white">{destination.name}</h3>
                </div>
                <div className="absolute top-4 right-4 px-2 py-1 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur text-sm font-semibold flex items-center gap-1">
                  <Star className="w-4 h-4 text-saffron-500 fill-saffron-500" />{destination.rating}
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{destination.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-gray-500"><Calendar className="w-4 h-4" />{destination.best_time_to_visit}</div>
                  <div className="flex items-center gap-1 font-semibold text-saffron-600"><Wallet className="w-4 h-4" />₹{destination.average_budget?.toLocaleString()}</div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {destination.highlights?.slice(0, 3).map((h, idx) => (
                    <span key={idx} className="px-2 py-0.5 text-xs rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">{h}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {selectedDestination && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSelectedDestination(null)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative h-64">
              <img src={selectedDestination.image_url} alt={selectedDestination.name} className="w-full h-full object-cover" />
              <button onClick={() => setSelectedDestination(null)} className="absolute top-4 right-4 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700"><span className="text-xl">&times;</span></button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{selectedDestination.name}</h2>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><MapPin className="w-4 h-4" />{selectedDestination.state}</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-lg font-semibold"><Star className="w-5 h-5 text-saffron-500 fill-saffron-500" />{selectedDestination.rating}</div>
                  <div className="text-sm text-gray-500">Rating</div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{selectedDestination.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center gap-2 text-gray-500 mb-1"><Calendar className="w-4 h-4" />Best Time</div>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedDestination.best_time_to_visit}</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center gap-2 text-gray-500 mb-1"><Wallet className="w-4 h-4" />Avg. Budget</div>
                  <p className="font-semibold text-gray-900 dark:text-white">₹{selectedDestination.average_budget?.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Highlights</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDestination.highlights?.map((h, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-lg bg-saffron-50 dark:bg-saffron-900/20 text-saffron-700 dark:text-saffron-400 text-sm">{h}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
