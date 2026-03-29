// src/components/GramSevak/StatsCards.jsx
import React from 'react';
import { FileText, Clock, CheckCircle, Award, Sparkles, TrendingUp } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const cards = [
    { icon: FileText, label: 'एकूण समस्या', value: stats.total, color: 'from-green-600 to-emerald-500', delay: '0s' },
    { icon: Clock, label: 'प्रगतीत', value: stats.inProgress, color: 'from-blue-600 to-cyan-500', delay: '0.1s' },
    { icon: CheckCircle, label: 'पूर्ण झाले', value: stats.completed, color: 'from-emerald-600 to-teal-500', delay: '0.2s' },
    { icon: Award, label: 'एकूण मते', value: stats.totalVotes, color: 'from-orange-600 to-red-500', delay: '0.3s' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
      {cards.map((stat, idx) => (
        <div key={idx} className="group relative" style={{animation: `fadeInUp 0.8s ease-out ${stat.delay} both`}}>
          <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300`}></div>
          <div className="relative bg-white rounded-3xl shadow-xl p-6 border-2 border-white transform transition-all duration-500 hover:scale-105 hover:-translate-y-2">
            <div className="flex items-start justify-between mb-4">
              <div className={`bg-gradient-to-br ${stat.color} p-4 rounded-2xl shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            </div>
            <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</p>
            <p className={`text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}
            </p>
            <div className="mt-3 flex items-center gap-1 text-green-600 text-xs font-semibold">
              <TrendingUp className="w-4 h-4" />
              <span>सक्रिय स्थिती</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;