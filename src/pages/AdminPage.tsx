import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Activity,
  Settings,
  Database,
  Shield,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Download,
  Trash2,
  Eye,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardStats {
  totalUsers: number;
  activeTrips: number;
  totalDestinations: number;
  totalBudgets: number;
  totalRevenue: number;
}

interface RecentActivity {
  id: string;
  type: 'user' | 'trip' | 'destination' | 'budget';
  action: string;
  timestamp: string;
  details: string;
}

interface ChartData {
  name: string;
  value: number;
}

export function AdminPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeTrips: 0,
    totalDestinations: 0,
    totalBudgets: 0,
    totalRevenue: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'analytics' | 'settings'>('dashboard');

  const chartData: ChartData[] = [
    { name: 'Jan', value: 2400 },
    { name: 'Feb', value: 1398 },
    { name: 'Mar', value: 9800 },
    { name: 'Apr', value: 3908 },
    { name: 'May', value: 4800 },
    { name: 'Jun', value: 3800 },
  ];

  const pieData = [
    { name: 'Active Trips', value: 45 },
    { name: 'Completed', value: 28 },
    { name: 'Planned', value: 27 },
  ];

  const COLORS = ['#FF7A00', '#00B4AF', '#FFB86C'];

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [usersCount, tripsCount, destCount, budgetsCount] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('trips').select('id', { count: 'exact', head: true }),
        supabase.from('destinations').select('id', { count: 'exact', head: true }),
        supabase.from('budgets').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        totalUsers: usersCount.count || 0,
        activeTrips: tripsCount.count || 0,
        totalDestinations: destCount.count || 0,
        totalBudgets: budgetsCount.count || 0,
        totalRevenue: 45230,
      });

      setRecentActivity([
        { id: '1', type: 'user', action: 'New user registered', timestamp: new Date().toISOString(), details: 'user@example.com' },
        { id: '2', type: 'trip', action: 'Trip created', timestamp: new Date(Date.now() - 3600000).toISOString(), details: 'Delhi to Jaipur' },
        { id: '3', type: 'budget', action: 'Budget calculated', timestamp: new Date(Date.now() - 7200000).toISOString(), details: '₹25,000' },
        { id: '4', type: 'destination', action: 'Destination viewed', timestamp: new Date(Date.now() - 10800000).toISOString(), details: 'Goa Beach Paradise' },
        { id: '5', type: 'user', action: 'User feedback received', timestamp: new Date(Date.now() - 14400000).toISOString(), details: '5-star review' },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { icon: Users, label: 'Total Users', value: stats.totalUsers, color: 'from-blue-500 to-blue-600', change: '+12%' },
    { icon: MapPin, label: 'Active Trips', value: stats.activeTrips, color: 'from-saffron-500 to-orange-500', change: '+8%' },
    { icon: Calendar, label: 'Destinations', value: stats.totalDestinations, color: 'from-teal-500 to-cyan-500', change: '+5%' },
    { icon: DollarSign, label: 'Total Budgets', value: stats.totalBudgets, color: 'from-green-500 to-emerald-500', change: '+15%' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return <Users className="w-4 h-4" />;
      case 'trip': return <MapPin className="w-4 h-4" />;
      case 'destination': return <Calendar className="w-4 h-4" />;
      case 'budget': return <DollarSign className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'trip': return 'bg-saffron-100 text-saffron-600 dark:bg-saffron-900/30 dark:text-saffron-400';
      case 'destination': return 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400';
      case 'budget': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  if (isLoading && stats.totalUsers === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 rounded-full border-4 border-saffron-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor and manage your travel platform</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-saffron-500 to-teal-500 text-white flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Security
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-saffron-600 dark:text-saffron-400 border-b-2 border-saffron-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Charts and Activity */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{activity.action}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{activity.details}</p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">System Status</h3>
              <div className="space-y-4">
                {[
                  { label: 'Database', status: 'healthy', icon: Database },
                  { label: 'API Services', status: 'healthy', icon: Activity },
                  { label: 'Authentication', status: 'healthy', icon: Shield },
                ].map((service) => (
                  <div key={service.label} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex items-center gap-3">
                      <service.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white text-sm">{service.label}</span>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-saffron-500/10 to-teal-500/10 border border-saffron-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-saffron-600 dark:text-saffron-400" />
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">Quick Actions</span>
                </div>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                    Export User Data
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                    Generate Reports
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                    Clear Cache
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#FF7A00" strokeWidth={2} dot={{ fill: '#FF7A00' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Trip Status Chart */}
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Trip Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex gap-4 justify-center mt-4 flex-wrap">
                {pieData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    ></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* User Growth Chart */}
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">User Growth</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="value" fill="#00B4AF" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Key Metrics */}
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Key Metrics</h3>
              <div className="space-y-4">
                {[
                  { label: 'Avg. User Sessions', value: '3.2', unit: '/week' },
                  { label: 'Conversion Rate', value: '12.4%', unit: '' },
                  { label: 'Avg. Budget Planned', value: '₹15,800', unit: '' },
                  { label: 'Platform Uptime', value: '99.8%', unit: '' },
                ].map((metric) => (
                  <div key={metric.label} className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{metric.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 dark:text-white">{metric.value}</span>
                      {metric.unit && <span className="text-gray-500 text-sm">{metric.unit}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">User Management</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">User</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Trips</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'John Doe', email: 'john@example.com', trips: 3, status: 'Active' },
                  { name: 'Jane Smith', email: 'jane@example.com', trips: 5, status: 'Active' },
                  { name: 'Mike Johnson', email: 'mike@example.com', trips: 1, status: 'Inactive' },
                ].map((user, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{user.name}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{user.trips}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                      <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Admin Settings</h3>
          <p className="text-gray-600 dark:text-gray-400">Settings and configurations coming soon...</p>
        </motion.div>
      )}
    </div>
  );
}
