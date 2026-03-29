import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Target, Flag, TrendingUp, AlertTriangle } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const { t } = useTranslation();

  const cards = [
    { 
      value: stats.pending, 
      label: t('pendingApprovals'), 
      icon: Bell, 
      gradient: 'from-orange-500 to-red-500', 
      glow: 'orange' 
    },
    { 
      value: stats.high, 
      label: t('highPriority'), 
      icon: Target, 
      gradient: 'from-red-500 to-pink-600', 
      glow: 'red' 
    },
    { 
      value: stats.medium, 
      label: t('mediumPriority'), 
      icon: Flag, 
      gradient: 'from-yellow-500 to-orange-500', 
      glow: 'yellow' 
    },
    { 
      value: stats.low, 
      label: t('lowPriority'), 
      icon: TrendingUp, 
      gradient: 'from-blue-500 to-cyan-500', 
      glow: 'blue' 
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, i) => (
        <div 
          key={i} 
          className={`stats-card bg-gradient-to-br ${card.gradient} rounded-2xl shadow-2xl p-5 sm:p-6 border-2 border-${card.glow}-300 transform transition-all duration-500 hover:scale-105 sm:hover:scale-110 hover:${i % 2 === 0 ? '-' : ''}rotate-2 hover:shadow-glow-${card.glow}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-xs sm:text-sm font-bold uppercase tracking-wide mb-1 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 animate-pulse" />
                {card.label}
              </p>
              <p className="text-4xl sm:text-5xl font-black text-white animate-countUp">{card.value}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 sm:p-4 rounded-full backdrop-blur-sm animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
              <card.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;