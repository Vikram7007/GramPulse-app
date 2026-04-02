import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, CheckCircle, Clock, AlertTriangle, Users, FileText, Target, Award, Activity, Sparkles, Home, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import BottomNavbar from '../components/BottomNavbar';

function PublicDashboard() {
  const { t } = useTranslation();
  // Data
  const pieData = [
    { name: 'Solved', value: 60 },
    { name: 'Pending', value: 40 }
  ];

  const barData = [
    { month: 'Jan', complaints: 30, solved: 25 },
    { month: 'Feb', complaints: 45, solved: 38 },
    { month: 'Mar', complaints: 38, solved: 32 },
    { month: 'Apr', complaints: 52, solved: 45 }
  ];

  const trendData = [
    { month: 'Jan', value: 30 },
    { month: 'Feb', value: 45 },
    { month: 'Mar', value: 38 },
    { month: 'Apr', value: 52 },
    { month: 'May', value: 48 },
    { month: 'Jun', value: 65 }
  ];

  // Stats data
  const stats = [
    {
      icon: CheckCircle,
      title: 'Resolved',
      value: '156',
      change: '+12%',
      color: 'text-emerald-500',
      bg: 'bg-emerald-50/50'
    },
    {
      icon: Clock,
      title: 'Pending',
      value: '42',
      change: '-8%',
      color: 'text-amber-500',
      bg: 'bg-amber-50/50'
    },
    {
      icon: TrendingUp,
      title: 'Total Files',
      value: '198',
      change: '+5%',
      color: 'text-blue-500',
      bg: 'bg-blue-50/50'
    },
    {
      icon: Users,
      title: 'Citizens',
      value: '1,245',
      change: '+18%',
      color: 'text-purple-500',
      bg: 'bg-purple-50/50'
    }
  ];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-emerald-100">
          <p className="text-dark-900 font-black mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs font-bold" style={{ color: entry.dataKey === 'solved' ? '#10b981' : '#0ea5e9' }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-light-50 font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="pt-20 md:pt-24 md:ml-72 pb-32 md:pb-20 px-4 sm:px-6 lg:px-8 transition-all duration-500">
        <div className="max-w-7xl mx-auto py-6 space-y-12">
          
          {/* Global Header Card */}
          <section className="bg-brand-dark rounded-4xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl animate-fade-in">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-3 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                <Activity className="w-3.5 h-3.5 animate-pulse" /> Live Village Performance
              </div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none">
                Transparency <span className="text-emerald-400">Hub</span>
              </h1>
              <p className="text-white/50 text-base sm:text-lg font-medium leading-relaxed">
                Real-time tracking of village development and grievance resolution. We empower citizens through data-driven governance.
              </p>
            </div>
          </section>

          {/* Stats Grid */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col items-center text-center group hover:border-emerald-200 transition-all animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.title}</p>
                  <h3 className="text-2xl sm:text-3xl font-black text-dark-900">{stat.value}</h3>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${stat.change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-700'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </section>

          {/* Charts Grid */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Pie Chart Card */}
            <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm hover:shadow-xl transition-all h-[500px] flex flex-col animate-fade-in-up">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-black text-dark-900">Success Ratio</h2>
                  <p className="text-xs font-black text-emerald-500 uppercase tracking-widest">Resolution Status</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl">
                  <Target className="w-6 h-6 text-emerald-500" />
                </div>
              </div>

              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#f1f5f9" />
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-50">
                <div className="text-center">
                  <p className="text-2xl font-black text-emerald-500">60%</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Resolved</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-gray-200">40%</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Unfinished</p>
                </div>
              </div>
            </div>

            {/* Bar/Trend Card */}
            <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm hover:shadow-xl transition-all h-[500px] flex flex-col animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-black text-dark-900">Resolution Velocity</h2>
                  <p className="text-xs font-black text-blue-500 uppercase tracking-widest">Last 4 Months</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-2xl">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                </div>
              </div>

              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} barSize={12}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} dy={10} />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="complaints" fill="#f1f5f9" radius={[10, 10, 10, 10]} name="Total" />
                    <Bar dataKey="solved" fill="#3b82f6" radius={[10, 10, 10, 10]} name="Solved" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Growth Trend */}
          <section className="bg-brand-dark rounded-4xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl animate-fade-in-up" style={{ animationDelay: '300ms' }}>
             <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-2xl font-black">Digital Penetration</h2>
                  <p className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Growth Forecast</p>
                </div>
             </div>
             
             <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={trendData}>
                   <defs>
                     <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <XAxis dataKey="month" hide />
                   <YAxis hide />
                   <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                   <Tooltip content={<CustomTooltip />} />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </section>

        </div>
      </main>

      <BottomNavbar />
    </div>
  );
}


export default PublicDashboard;