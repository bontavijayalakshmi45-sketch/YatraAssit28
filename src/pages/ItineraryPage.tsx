import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Map, Calendar, Users, Wallet, Download, Sparkles, Loader2, Heart, MapPin, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Itinerary, ItineraryDay, TravelType, supabase } from '../lib/supabase';
import html2canvas from 'html2canvas';

const travelTypes: { id: TravelType; label: string; emoji: string }[] = [
  { id: 'spiritual', label: 'Spiritual', emoji: '🙏' },
  { id: 'adventure', label: 'Adventure', emoji: '🏔️' },
  { id: 'heritage', label: 'Heritage', emoji: '🏛️' },
  { id: 'beach', label: 'Beach', emoji: '🏖️' },
  { id: 'wildlife', label: 'Wildlife', emoji: '🦁' },
];

export function ItineraryPage() {
  const { user } = useAuth();
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState(30000);
  const [travelersCount, setTravelersCount] = useState(2);
  const [travelType, setTravelType] = useState<TravelType>('heritage');
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const itineraryRef = useRef<HTMLDivElement>(null);

  const daysCount = startDate && endDate ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1 : 0;

  const generateItinerary = async () => {
    if (!destination || !startDate || !endDate || !user) return;
    setIsLoading(true);

    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const response = await fetch(`${SUPABASE_URL}/functions/v1/itinerary-agent`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, startDate, endDate, budget, travelersCount, travelType, language: 'english' }),
      });
      const data = await response.json();
      setItinerary(data.itinerary || generateMockItinerary());
    } catch { setItinerary(generateMockItinerary()); }
    finally { setIsLoading(false); }
  };

  const generateMockItinerary = (): Itinerary => {
    const days: ItineraryDay[] = [];
    for (let i = 0; i < daysCount; i++) {
      const dayDate = new Date(startDate);
      dayDate.setDate(dayDate.getDate() + i);
      days.push({
        day: i + 1,
        date: dayDate.toISOString().split('T')[0],
        activities: [
          { time: '08:00', title: `Morning Activity - Day ${i + 1}`, description: 'Explore local attractions', location: destination, duration: '2 hours', cost: Math.round(budget * 0.1 / daysCount) },
          { time: '12:00', title: `Afternoon Activity - Day ${i + 1}`, description: 'Visit famous sites', location: destination, duration: '3 hours', cost: Math.round(budget * 0.15 / daysCount) },
        ],
        meals: { breakfast: 'Hotel buffet', lunch: 'Local restaurant', dinner: 'Traditional cuisine' },
        accommodation: 'Quality hotel',
        notes: 'Carry water and comfortable shoes',
      });
    }
    return days;
  };

  const saveTrip = async () => {
    if (!itinerary || !user) return;
    await supabase.from('trips').insert({ user_id: user.id, destination, start_date: startDate, end_date: endDate, budget, travel_type: travelType, travelers_count: travelersCount, itinerary, status: 'planned' });
    setSaved(true);
  };

  const downloadItinerary = async () => {
    if (!itineraryRef.current) return;
    const canvas = await html2canvas(itineraryRef.current);
    const link = document.createElement('a');
    link.download = `${destination}-itinerary.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">AI Itinerary Generator</h1>
        <p className="text-gray-600 dark:text-gray-400">Create personalized travel plans with AI recommendations</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g., Rajasthan, Goa..." className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-saffron-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white" />
                </div>
              </div>
              {daysCount > 0 && <div className="px-4 py-2 rounded-lg bg-saffron-50 dark:bg-saffron-900/20 text-saffron-600 text-sm">{daysCount} day{daysCount > 1 ? 's' : ''} trip</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Budget (₹)</label>
                <input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white" />
                <input type="range" min="10000" max="200000" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full mt-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Travelers</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="number" value={travelersCount} onChange={(e) => setTravelersCount(Number(e.target.value))} min="1" max="20" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Travel Type</label>
                <div className="grid grid-cols-5 gap-2">
                  {travelTypes.map((type) => (
                    <button key={type.id} onClick={() => setTravelType(type.id)} className={`p-3 rounded-xl text-center ${travelType === type.id ? 'bg-gradient-to-r from-saffron-500 to-teal-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                      <span className="text-xl">{type.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>
              <motion.button onClick={generateItinerary} disabled={isLoading || !destination || !startDate || !endDate} className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-saffron-500 to-teal-500 text-white font-semibold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                {isLoading ? <><Loader2 className="w-5 h-5 spinner" />Generating...</> : <><Sparkles className="w-5 h-5" />Generate Itinerary</>}
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
          {itinerary ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{destination} Itinerary</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{daysCount} days • ₹{budget.toLocaleString()} • {travelersCount} travelers</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {user && !saved && <button onClick={saveTrip} className="p-2.5 rounded-xl bg-teal-500 text-white hover:bg-teal-600"><Heart className="w-5 h-5" /></button>}
                    <button onClick={downloadItinerary} className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"><Download className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>
              <div ref={itineraryRef} className="p-6 max-h-[600px] overflow-y-auto space-y-4">
                {itinerary.map((day) => (
                  <div key={day.day} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">Day {day.day}</h3>
                        <p className="text-xs text-gray-500">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {day.activities.map((act, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-16 text-xs text-saffron-600 font-medium">{act.time}</div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{act.title}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{act.description}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500"><span>{act.location}</span><span>•</span><span>{act.duration}</span><span>•</span><span>₹{act.cost}</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-600 dark:text-gray-400"><span className="font-medium">Stay:</span> {day.accommodation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-saffron-500/10 to-teal-500/10 flex items-center justify-center mb-4"><Map className="w-10 h-10 text-saffron-500" /></div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Your Itinerary Will Appear Here</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">Fill in your travel details and click "Generate Itinerary" to create your plan.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
