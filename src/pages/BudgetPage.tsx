import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, MapPin, Users, Calendar, Wallet, Sparkles, Loader2, Lightbulb, PiggyBank } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { BudgetBreakdown, TravelType } from '../lib/supabase';

const travelTypes: { id: TravelType; label: string; emoji: string }[] = [
  { id: 'spiritual', label: 'Spiritual', emoji: '🙏' },
  { id: 'adventure', label: 'Adventure', emoji: '🏔️' },
  { id: 'heritage', label: 'Heritage', emoji: '🏛️' },
  { id: 'beach', label: 'Beach', emoji: '🏖️' },
  { id: 'wildlife', label: 'Wildlife', emoji: '🦁' },
];

const COLORS = ['#FF7A00', '#00B4AF', '#3B82F6', '#8B5CF6', '#EC4899'];

export function BudgetPage() {
  const { user } = useAuth();
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(5);
  const [travelersCount, setTravelersCount] = useState(2);
  const [budget, setBudget] = useState(50000);
  const [travelType, setTravelType] = useState<TravelType>('heritage');
  const [breakdown, setBreakdown] = useState<BudgetBreakdown | null>(null);
  const [tips, setTips] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const calculateBudget = async () => {
    if (!destination) return;
    setIsLoading(true);

    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const response = await fetch(`${SUPABASE_URL}/functions/v1/budget-agent`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, days, travelersCount, travelType, budget }),
      });
      const data = await response.json();
      setBreakdown(data.budget || generateMockBudget());
      setTips(data.tips || generateMockTips());
    } catch { setBreakdown(generateMockBudget()); setTips(generateMockTips()); }
    finally { setIsLoading(false); }
  };

  const generateMockBudget = (): BudgetBreakdown => ({
    accommodation: Math.round(budget * 0.35),
    transportation: Math.round(budget * 0.20),
    food: Math.round(budget * 0.20),
    activities: Math.round(budget * 0.15),
    miscellaneous: Math.round(budget * 0.10),
    total: budget,
    currency: 'INR',
  });

  const generateMockTips = () => [
    'Book accommodations in advance for better deals',
    'Use local transport to save money',
    'Try local street food for authentic experiences',
    'Travel during off-peak season for discounts',
    'Visit free attractions for cultural experiences',
    'Book group tours for better rates on activities',
  ];

  const chartData = breakdown ? [
    { name: 'Accommodation', value: breakdown.accommodation },
    { name: 'Transportation', value: breakdown.transportation },
    { name: 'Food', value: breakdown.food },
    { name: 'Activities', value: breakdown.activities },
    { name: 'Misc', value: breakdown.miscellaneous },
  ] : [];

  const perDayData = breakdown ? [
    { category: 'Accommodation', perDay: Math.round(breakdown.accommodation / days) },
    { category: 'Transport', perDay: Math.round(breakdown.transportation / days) },
    { category: 'Food', perDay: Math.round(breakdown.food / days) },
    { category: 'Activities', perDay: Math.round(breakdown.activities / days) },
    { category: 'Misc', perDay: Math.round(breakdown.miscellaneous / days) },
  ] : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Smart Budget Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400">Plan your trip budget with AI-powered insights</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g., Goa, Kerala..." className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-saffron-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Number of Days</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="number" value={days} onChange={(e) => setDays(Number(e.target.value))} min="1" max="30" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Travelers</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="number" value={travelersCount} onChange={(e) => setTravelersCount(Number(e.target.value))} min="1" max="20" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Total Budget (₹)</label>
                <div className="relative">
                  <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white" />
                </div>
                <input type="range" min="10000" max="500000" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full mt-2" />
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
              <motion.button onClick={calculateBudget} disabled={isLoading || !destination} className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-saffron-500 to-teal-500 text-white font-semibold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                {isLoading ? <><Loader2 className="w-5 h-5 spinner" />Calculating...</> : <><Sparkles className="w-5 h-5" />Calculate Budget</>}
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-6">
          {breakdown ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2"><div className="p-2 rounded-lg bg-saffron-100 dark:bg-saffron-900/20"><Wallet className="w-4 h-4 text-saffron-600" /></div><span className="text-xs text-gray-600 dark:text-gray-400">Total Budget</span></div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{breakdown.total.toLocaleString()}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2"><div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/20"><Calendar className="w-4 h-4 text-teal-600" /></div><span className="text-xs text-gray-600 dark:text-gray-400">Per Day Cost</span></div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{Math.round(breakdown.total / days).toLocaleString()}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2"><div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20"><Users className="w-4 h-4 text-blue-600" /></div><span className="text-xs text-gray-600 dark:text-gray-400">Per Person</span></div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{Math.round(breakdown.total / travelersCount).toLocaleString()}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2"><div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20"><PiggyBank className="w-4 h-4 text-green-600" /></div><span className="text-xs text-gray-600 dark:text-gray-400">Potential Savings</span></div>
                  <p className="text-2xl font-bold text-green-600">₹{Math.round(budget * 0.15).toLocaleString()}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Budget Distribution</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                        {chartData.map((_, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                      </Pie>
                      <Tooltip formatter={(value: any) => `₹${Number(value).toLocaleString()}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Expenses</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={perDayData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                      <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(value: any) => `₹${Number(value).toLocaleString()}`} />
                      <Bar dataKey="perDay" fill="#FF7A00" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gradient-to-r from-teal-50 to-saffron-50 dark:from-teal-900/20 dark:to-saffron-900/20 rounded-2xl p-6 border border-teal-100 dark:border-teal-800">
                <div className="flex items-center gap-2 mb-4"><Lightbulb className="w-5 h-5 text-teal-600" /><h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI-Powered Saving Tips</h3></div>
                <div className="grid md:grid-cols-2 gap-3">
                  {tips.map((tip, index) => (
                    <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center mt-0.5">{index + 1}</div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{tip}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-saffron-500/10 to-teal-500/10 flex items-center justify-center mb-4"><Calculator className="w-10 h-10 text-saffron-500" /></div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Budget Breakdown Will Appear Here</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">Fill in your travel details and click "Calculate Budget" to see a detailed breakdown.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
