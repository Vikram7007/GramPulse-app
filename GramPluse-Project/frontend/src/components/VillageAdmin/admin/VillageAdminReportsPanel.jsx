import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DownloadCloud, TrendingUp, AlertCircle, CheckCircle, Activity } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';

const VillageAdminReportsPanel = ({ issues, gramsevakCompletedIssues }) => {
  const { t } = useTranslation();
  // Analytical processing
  const stats = useMemo(() => {
    const total = issues.length;
    const completed = issues.filter(i => i.status === 'completed' || i.status === 'approved').length + gramsevakCompletedIssues.length;
    const pending = issues.filter(i => i.status === 'pending').length;
    const inProgress = issues.filter(i => i.status === 'in-progress' || i.status === 'assigned').length;
    const successRate = total > 0 ? Math.round((completed / (total + gramsevakCompletedIssues.length)) * 100) : 0;
    
    return { total: total + gramsevakCompletedIssues.length, completed, pending, inProgress, successRate };
  }, [issues, gramsevakCompletedIssues]);

  // Issue Category Distribution (Pie Chart Logic)
  const pieData = useMemo(() => {
    const defaultData = [
      { name: t('water', 'पाणी (Water)'), value: 45, color: '#3b82f6' }, // Blue
      { name: t('roads', 'रस्ते (Roads)'), value: 30, color: '#64748b' }, // Gray
      { name: t('electricity', 'वीज (Electricity)'), value: 25, color: '#f59e0b' }, // Amber
      { name: t('sanitation', 'स्वच्छता (Sanitation)'), value: 35, color: '#10b981' } // Emerald
    ];

    if (issues.length > 5) {
      const counts = {};
      issues.forEach(i => {
         const t = i.type || 'Other';
         counts[t] = (counts[t] || 0) + 1;
      });
      const dynamicData = Object.keys(counts).map((key, idx) => ({
        name: key,
        value: counts[key],
        color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'][idx % 6]
      }));
      return dynamicData;
    }
    return defaultData;
  }, [issues]);

  // Monthly Trend (Bar Chart Logic)
  const trendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    // We'll generate data for the last 6 months
    const lastSixMonths = [];
    for (let i = 5; i >= 0; i--) {
       let m = currentMonth - i;
       let y = new Date().getFullYear();
       if (m < 0) {
          m += 12;
          y -= 1;
       }
       lastSixMonths.push({ name: months[m], targetMonth: m, targetYear: y, resolved: 0, pending: 0, new: 0 });
    }

    // Process all issues
    issues.forEach(i => {
       const d = new Date(i.createdAt || Date.now());
       const monthIdx = d.getMonth();
       const year = d.getFullYear();
       
       const bucket = lastSixMonths.find(b => b.targetMonth === monthIdx && b.targetYear === year);
       if (bucket) {
          bucket.new += 1;
          if (i.status === 'completed' || i.status === 'approved') {
             bucket.resolved += 1;
          } else if (i.status === 'pending') {
             bucket.pending += 1;
          }
       }
    });

    // Process gramsevak issues (treat as resolved)
    gramsevakCompletedIssues.forEach(i => {
       const d = new Date(i.updatedAt || i.createdAt || Date.now());
       const monthIdx = d.getMonth();
       const year = d.getFullYear();
       
       const bucket = lastSixMonths.find(b => b.targetMonth === monthIdx && b.targetYear === year);
       if (bucket) {
          bucket.resolved += 1;
       }
    });

    return lastSixMonths;
  }, [issues, gramsevakCompletedIssues]);

  return (
    <div className="animate-fade-in-up">
      {/* Premium Header */}
      <div className="bg-white rounded-[2.5rem] shadow-sm p-8 mb-8 border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-bl-[100px] -z-10 transition-transform duration-700 group-hover:scale-150 group-hover:bg-emerald-500/10"></div>
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#0B8A5A] to-emerald-400 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/30">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-[#0B1A2C] tracking-tight">{t('villageReports', 'Village Reports & Analytics')}</h2>
            <p className="text-gray-500 font-medium text-sm mt-1">{t('reportsSubtitle', 'Comprehensive overview of issue resolution and administrative capacity.')}</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-6 py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-[#0B1A2C] transition-all shadow-xl hover:-translate-y-1 active:scale-95 whitespace-nowrap">
          <DownloadCloud className="w-5 h-5" /> {t('exportPDF', 'Export PDF')}
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <Activity className="w-6 h-6" />
          </div>
          <h4 className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">{t('totalRequests', 'Total Requests')}</h4>
          <p className="text-3xl font-black text-[#0B1A2C]">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-white transition-colors">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h4 className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">{t('pendingAssignment', 'Pending Assignment')}</h4>
          <p className="text-3xl font-black text-[#0B1A2C]">{stats.pending}</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h4 className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">{t('fullyResolved', 'Fully Resolved')}</h4>
          <p className="text-3xl font-black text-[#0B1A2C]">{stats.completed}</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B8A5A] to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
          <div className="relative z-10 text-[#0B1A2C] group-hover:text-white transition-colors">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 text-[#0B8A5A] flex items-center justify-center mb-4 group-hover:bg-white/20 group-hover:text-white transition-colors">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h4 className="font-bold uppercase tracking-widest text-[10px] mb-1 text-gray-400 group-hover:text-emerald-100">{t('successRate', 'Success Rate')}</h4>
            <p className="text-3xl font-black">{stats.successRate}%</p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart */}
        <div className="col-span-1 lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
          <h3 className="font-black text-xl text-[#0B1A2C] mb-8 flex items-center gap-3">
             <Activity className="w-6 h-6 text-emerald-500" /> {t('resolutionTrend', 'Resolution Velocity Trend')}
          </h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontWeight: 'bold' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontWeight: 'bold' }} dx={-10} />
                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold' }} />
                <Bar dataKey="new" name={t('newIssues', 'New Issues')} fill="#93C5FD" radius={[6, 6, 0, 0]} maxBarSize={40} />
                <Bar dataKey="resolved" name={t('resolved', 'Resolved')} fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Panel: Demographics / Category */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col items-center">
          <h3 className="font-black text-xl text-[#0B1A2C] mb-8 w-full">{t('categoryDistribution', 'Category Distribution')}</h3>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
              <span className="text-3xl font-black text-[#0B1A2C]">{pieData.reduce((acc, curr) => acc + curr.value, 0)}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('all', 'Total')}</span>
            </div>
          </div>
          
          <div className="w-full mt-6 space-y-4">
             {pieData.map((item, idx) => (
               <div key={idx} className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                   <span className="text-sm font-bold text-gray-600">{item.name}</span>
                 </div>
                 <span className="text-sm font-black text-[#0B1A2C] bg-gray-50 px-3 py-1 rounded-lg">{item.value}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VillageAdminReportsPanel;
