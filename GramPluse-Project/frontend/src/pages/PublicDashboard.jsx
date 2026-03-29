import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, CheckCircle, Clock, AlertTriangle, Users, FileText, Target, Award, Activity, Sparkles, Home, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function PublicDashboard() {
  // Data
  const pieData = [
    { name: 'सोडवले', value: 60 },
    { name: 'प्रलंबित', value: 40 }
  ];

  const barData = [
    { month: 'जानेवारी', complaints: 30, solved: 25 },
    { month: 'फेब्रुवारी', complaints: 45, solved: 38 },
    { month: 'मार्च', complaints: 38, solved: 32 },
    { month: 'एप्रिल', complaints: 52, solved: 45 }
  ];

  const trendData = [
    { month: 'जान', value: 30 },
    { month: 'फेब', value: 45 },
    { month: 'मार्च', value: 38 },
    { month: 'एप्रिल', value: 52 },
    { month: 'मे', value: 48 },
    { month: 'जून', value: 65 }
  ];

  // Stats data
  const stats = [
    {
      icon: CheckCircle,
      title: 'सोडवलेल्या समस्या',
      value: '156',
      change: '+12%',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      iconColor: 'text-green-600'
    },
    {
      icon: Clock,
      title: 'प्रलंबित समस्या',
      value: '42',
      change: '-8%',
      color: 'from-orange-500 to-yellow-600',
      bgColor: 'from-orange-50 to-yellow-50',
      iconColor: 'text-orange-600'
    },
    {
      icon: TrendingUp,
      title: 'एकूण तक्रारी',
      value: '198',
      change: '+5%',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: Users,
      title: 'सक्रिय नागरिक',
      value: '1,245',
      change: '+18%',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'from-purple-50 to-pink-50',
      iconColor: 'text-purple-600'
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-xl p-4 rounded-xl shadow-2xl border-2 border-emerald-100">
          <p className="text-emerald-900 font-bold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-bold" style={{ color: entry.dataKey === 'solved' ? '#059669' : '#0ea5e9' }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      <Sidebar />

      {/* Main Content */}
      <div className="pt-24 md:ml-72 transition-all duration-500 ease-in-out pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fadeInDown">
          <div className="inline-flex items-center justify-center gap-3 mb-6 bg-white/50 backdrop-blur-md border border-emerald-100 px-6 py-2 rounded-full shadow-sm">
            <Sparkles className="w-5 h-5 text-yellow-500 animate-spin-slow" />
            <span className="text-sm font-bold text-emerald-800 uppercase tracking-widest">Live Village Stats</span>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse ml-2"></div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            गावाचा <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">सार्वजनिक डॅशबोर्ड</span>
          </h1>
          <p className="text-emerald-700 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            आमच्या गावाच्या प्रगतीचा आणि समस्या निवारणाचा पारदर्शक आढावा. नागरिक आणि प्रशासन यांच्यातील विश्वासाचा सेतू.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl shadow-emerald-900/5 hover:shadow-2xl hover:shadow-emerald-900/10 transform hover:-translate-y-1 transition-all duration-300 border border-white/60 animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]`}></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg shadow-${stat.iconColor}/20 group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wide ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.title}</p>
                  <p className="text-4xl font-black text-gray-900 tracking-tight">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
          {/* Pie Chart Card */}
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl shadow-emerald-900/5 border border-white/60 animate-fadeInLeft relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                    <Target className="w-6 h-6 text-emerald-600" />
                    समस्या स्थिती
                  </h2>
                  <p className="text-emerald-600 text-sm font-bold mt-1">Status Analysis</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-2xl">
                  <Award className="w-6 h-6 text-yellow-500" />
                </div>
              </div>

              <div className="h-[300px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                        <stop offset="100%" stopColor="#059669" stopOpacity={1} />
                      </linearGradient>
                      <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                        <stop offset="100%" stopColor="#dc2626" stopOpacity={1} />
                      </linearGradient>
                    </defs>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? "url(#greenGradient)" : "url(#redGradient)"} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-center gap-6 mt-4">
                <div className="bg-emerald-50 px-4 py-3 rounded-xl flex items-center gap-3 border border-emerald-100">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <div>
                    <p className="text-xs font-bold text-emerald-400 uppercase">Solved</p>
                    <p className="text-lg font-black text-emerald-700">60%</p>
                  </div>
                </div>
                <div className="bg-red-50 px-4 py-3 rounded-xl flex items-center gap-3 border border-red-100">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div>
                    <p className="text-xs font-bold text-red-400 uppercase">Pending</p>
                    <p className="text-lg font-black text-red-700">40%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bar Chart Card */}
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl shadow-emerald-900/5 border border-white/60 animate-fadeInRight relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                    <FileText className="w-6 h-6 text-emerald-600" />
                    मासिक अहवाल
                  </h2>
                  <p className="text-emerald-600 text-sm font-bold mt-1">Monthly Reports</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-2xl">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                </div>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} barSize={20}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
                        <stop offset="100%" stopColor="#059669" stopOpacity={1} />
                      </linearGradient>
                      <linearGradient id="solvedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={1} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                    <Bar dataKey="complaints" fill="url(#barGradient)" radius={[10, 10, 10, 10]} name="तक्रारी" stackId="a" />
                    <Bar dataKey="solved" fill="url(#solvedGradient)" radius={[10, 10, 10, 10]} name="सोडवले" stackId="b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Trend Chart - Full Width */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl shadow-emerald-900/5 border border-white/60 animate-fadeInUp relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <Activity className="w-6 h-6 text-emerald-600" />
                प्रगती आलेख
              </h2>
              <p className="text-emerald-600 text-sm font-bold mt-1">Growth Trend (Last 6 Months)</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100/50 border border-green-200 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-green-700 uppercase tracking-wide">Live Updates</span>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#059669"
                  strokeWidth={4}
                  fill="url(#areaGradient)"
                  name="तक्रारी"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-fadeInDown { animation: fadeInDown 0.8s ease-out forwards; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fadeInLeft { animation: fadeInLeft 0.8s ease-out forwards; }
        .animate-fadeInRight { animation: fadeInRight 0.8s ease-out forwards; }
        .animate-blob { animation: blob 7s infinite; }
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}

export default PublicDashboard;