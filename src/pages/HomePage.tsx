import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plane, Map, Calculator, Compass, MessageCircle, Sparkles, ArrowRight, Star, Users, Calendar, Navigation2, Car, Route } from 'lucide-react';
import { Page } from '../App';
import { useAuth } from '../contexts/AuthContext';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const features = [
  { icon: Map, title: 'AI Itinerary Generator', description: 'Get personalized day-by-day travel plans powered by AI.', color: 'from-saffron-500 to-orange-500', page: 'itinerary' as Page },
  { icon: Calculator, title: 'Smart Budget Planner', description: 'Calculate your trip budget with AI-powered insights.', color: 'from-teal-500 to-cyan-500', page: 'budget' as Page },
  { icon: Compass, title: 'Explore Destinations', description: 'Discover amazing Indian destinations with guides.', color: 'from-saffron-400 to-teal-500', page: 'destinations' as Page },
  { icon: MessageCircle, title: 'AI Travel Assistant', description: 'Chat with our multilingual AI assistant.', color: 'from-teal-400 to-blue-500', page: 'chat' as Page },
];

const popularRoutes = [
  { from: 'Delhi', to: 'Jaipur', distance: 281, time: '5h', mode: 'road' },
  { from: 'Mumbai', to: 'Goa', distance: 589, time: '10h', mode: 'road' },
  { from: 'Delhi', to: 'Agra', distance: 231, time: '3h', mode: 'road' },
  { from: 'Bangalore', to: 'Chennai', distance: 347, time: '6h', mode: 'road' },
  { from: 'Delhi', to: 'Varanasi', distance: 780, time: '13h', mode: 'road' },
  { from: 'Kolkata', to: 'Puri', distance: 506, time: '8h', mode: 'road' },
];

const majorCities = [
  { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  { name: 'Goa', lat: 15.2993, lng: 74.1240 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
  { name: 'Agra', lat: 27.1767, lng: 78.0081 },
];

export function HomePage({ onNavigate }: HomePageProps) {
  const { user } = useAuth();
  const [fromCity, setFromCity] = useState('Delhi');
  const [toCity, setToCity] = useState('Jaipur');
  const [distance, setDistance] = useState<number | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<string>('');

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  useEffect(() => {
    const from = majorCities.find(c => c.name === fromCity);
    const to = majorCities.find(c => c.name === toCity);
    if (from && to) {
      const dist = calculateDistance(from.lat, from.lng, to.lat, to.lng);
      setDistance(dist);
      const hours = Math.round(dist / 50);
      setEstimatedTime(`${hours}h - ${hours + 2}h`);
    }
  }, [fromCity, toCity]);

  const getDistanceColor = (dist: number): string => {
    if (dist < 300) return 'text-green-600 dark:text-green-400';
    if (dist < 600) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-saffron-600 dark:text-saffron-400';
  };

  return (
    <div className="space-y-12">
      <section className="relative text-center py-12 md:py-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-saffron-500/10 to-teal-500/10 border border-saffron-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-saffron-500" />
            <span className="text-sm font-medium text-saffron-600">Powered by Advanced AI</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">Your AI Travel</span><br />
            <span className="gradient-text">Companion for India</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Plan your perfect Indian adventure with AI-powered itineraries, smart budgeting, and personalized recommendations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onNavigate('itinerary')} className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-saffron-500 to-teal-500 text-white font-semibold shadow-lg">
              <Map className="w-5 h-5" /> Plan Your Trip <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onNavigate('chat')} className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 text-gray-900 dark:text-white font-semibold">
              <MessageCircle className="w-5 h-5" /> Chat with AI
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Map and Distance Calculator Section */}
      <section className="grid lg:grid-cols-3 gap-6">
        {/* Distance Calculator */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1 p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
              <Route className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Distance Calculator</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">From</label>
              <select value={fromCity} onChange={(e) => setFromCity(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
                {majorCities.map(city => <option key={city.name} value={city.name}>{city.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">To</label>
              <select value={toCity} onChange={(e) => setToCity(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
                {majorCities.map(city => <option key={city.name} value={city.name}>{city.name}</option>)}
              </select>
            </div>

            {distance !== null && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-saffron-500/10 to-teal-500/10 border border-saffron-500/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Distance</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Est. Travel Time</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Navigation2 className={`w-5 h-5 ${getDistanceColor(distance)}`} />
                    <span className={`text-2xl font-bold ${getDistanceColor(distance)}`}>{distance} km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    <span className="text-lg font-semibold text-teal-600 dark:text-teal-400">{estimatedTime}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Map Visualization */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-saffron-500 to-orange-500 flex items-center justify-center">
                <Map className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Popular Routes Map</h3>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800" style={{ height: '320px' }}>
            <svg viewBox="0 0 800 600" className="w-full h-full">
              {/* India outline simplified */}
              <path d="M 200 550 Q 150 450 180 350 Q 200 250 350 150 Q 450 100 550 150 Q 650 200 700 350 Q 730 450 600 500 Q 450 550 350 520 Q 250 500 200 550" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 dark:text-gray-600" />

              {/* City markers */}
              {majorCities.map((city, idx) => {
                const x = 100 + (city.lng - 70) * 18;
                const y = 600 - (city.lat - 8) * 18;
                const isFrom = city.name === fromCity;
                const isTo = city.name === toCity;
                return (
                  <g key={city.name}>
                    <circle cx={x} cy={y} r={isFrom || isTo ? 8 : 5} fill={isFrom ? '#FF7A00' : isTo ? '#14B8A6' : '#9CA3AF'} className={isFrom || isTo ? 'animate-pulse' : ''} />
                    <text x={x} y={y + 20} textAnchor="middle" className="text-xs fill-gray-600 dark:fill-gray-400">{city.name}</text>
                  </g>
                );
              })}

              {/* Draw route line */}
              {(() => {
                const from = majorCities.find(c => c.name === fromCity);
                const to = majorCities.find(c => c.name === toCity);
                if (from && to) {
                  const x1 = 100 + (from.lng - 70) * 18;
                  const y1 = 600 - (from.lat - 8) * 18;
                  const x2 = 100 + (to.lng - 70) * 18;
                  const y2 = 600 - (to.lat - 8) * 18;
                  return (
                    <>
                      <defs>
                        <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#FF7A00" />
                          <stop offset="100%" stopColor="#14B8A6" />
                        </linearGradient>
                      </defs>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#routeGradient)" strokeWidth="3" strokeDasharray="8,4" />
                    </>
                  );
                }
                return null;
              })()}
            </svg>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 flex items-center gap-4 px-4 py-2 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-saffron-500"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">From</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">To</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Popular Routes Section */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Popular Travel Routes</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularRoutes.map((route, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-saffron-300 dark:hover:border-saffron-700 transition-colors cursor-pointer"
              onClick={() => { setFromCity(route.from); setToCity(route.to); }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-saffron-100 dark:bg-saffron-900/30 flex items-center justify-center">
                    <span className="text-sm font-bold text-saffron-600 dark:text-saffron-400">A</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{route.from}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">{route.to}</span>
                  <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                    <span className="text-sm font-bold text-teal-600 dark:text-teal-400">B</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{route.distance} km</span>
                <div className="flex items-center gap-1 text-teal-600 dark:text-teal-400">
                  <Car className="w-4 h-4" />
                  <span>{route.time}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            onClick={() => onNavigate(feature.page)}
            className="group p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 cursor-pointer card-hover"
          >
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg mb-4`}>
              <feature.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{feature.description}</p>
            <div className="flex items-center gap-2 text-saffron-600 font-semibold">Get Started <ArrowRight className="w-4 h-4" /></div>
          </motion.div>
        ))}
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Explore by Travel Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[{ name: 'Spiritual', emoji: '🙏' }, { name: 'Adventure', emoji: '🏔️' }, { name: 'Heritage', emoji: '🏛️' }, { name: 'Beach', emoji: '🏖️' }, { name: 'Wildlife', emoji: '🦁' }].map((cat) => (
            <motion.button key={cat.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onNavigate('destinations')} className="p-6 rounded-2xl bg-gradient-to-br from-saffron-500 to-teal-500 text-white aspect-square flex flex-col items-center justify-center shadow-lg">
              <span className="text-4xl mb-2">{cat.emoji}</span>
              <span className="font-semibold">{cat.name}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {!user && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-gradient-to-r from-saffron-500 to-teal-500 p-8 md:p-12 text-center text-white">
          <Plane className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="opacity-90 max-w-2xl mx-auto mb-8">Create your free account and start planning your dream trip to India today.</p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onNavigate('auth')} className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-saffron-600 font-semibold shadow-lg">
            <Calendar className="w-5 h-5" /> Get Started Free
          </motion.button>
        </motion.section>
      )}
    </div>
  );
}
