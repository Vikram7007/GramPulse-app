import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Sparkles, Award, FileText, Bell, CheckCircle, XCircle } from 'lucide-react';

const VillageSummary = ({ stats, issues }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-8 animate-slideInUp">
      <h2 className="text-2xl sm:text-3xl font-black text-green-800 mb-6 flex items-center gap-3">
        <MapPin className="w-7 h-7 sm:w-8 sm:h-8 animate-bounce" />
        {t('villageSummary')}
        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 animate-spin-slow" />
      </h2>
      <div className="bg-gradient-to-br from-white to-green-50 rounded-3xl shadow-2xl p-6 sm:p-8 border-4 border-green-300 transform transition-all duration-500 hover:scale-105 hover:shadow-glow-green backdrop-blur-lg">
        <h3 className="text-2xl sm:text-3xl font-black text-green-800 mb-6 flex items-center gap-2">
          <Award className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-500" />
          {t('totalVillageIssues')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="summary-card bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-5 sm:p-6 border-3 border-green-500 shadow-xl transform hover:scale-105 sm:hover:scale-110 transition-all duration-500 hover:shadow-glow-green">
            <p className="text-white font-bold mb-2 text-xs sm:text-sm uppercase flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {t('totalIssues')}
            </p>
            <p className="text-4xl sm:text-5xl font-black text-white">{stats.total}</p>
          </div>
          <div className="summary-card bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-5 sm:p-6 border-3 border-orange-400 shadow-xl transform hover:scale-105 sm:hover:scale-110 transition-all duration-500 hover:shadow-glow-orange">
            <p className="text-white font-bold mb-2 text-xs sm:text-sm uppercase flex items-center gap-2">
              <Bell className="w-4 h-4 animate-wiggle" />
              {t('pending')}
            </p>
            <p className="text-4xl sm:text-5xl font-black text-white">{stats.pending}</p>
          </div>
          <div className="summary-card bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl p-5 sm:p-6 border-3 border-green-400 shadow-xl transform hover:scale-105 sm:hover:scale-110 transition-all duration-500 hover:shadow-glow-green">
            <p className="text-white font-bold mb-2 text-xs sm:text-sm uppercase flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {t('approved')}
            </p>
            <p className="text-4xl sm:text-5xl font-black text-white">{issues.filter(i => i.status === 'approved').length}</p>
          </div>
          <div className="summary-card bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl p-5 sm:p-6 border-3 border-red-400 shadow-xl transform hover:scale-105 sm:hover:scale-110 transition-all duration-500 hover:shadow-glow-red">
            <p className="text-white font-bold mb-2 text-xs sm:text-sm uppercase flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              {t('rejected')}
            </p>
            <p className="text-4xl sm:text-5xl font-black text-white">{issues.filter(i => i.status === 'rejected').length}</p>
          </div>
          <div className="summary-card bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl p-5 sm:p-6 border-3 border-emerald-400 shadow-xl transform hover:scale-105 sm:hover:scale-110 transition-all duration-500 hover:shadow-glow-emerald">
            <p className="text-white font-bold mb-2 text-xs sm:text-sm uppercase flex items-center gap-2">
              <Award className="w-4 h-4 animate-bounce" />
              {t('gramsevakCompleted')}
            </p>
            <p className="text-4xl sm:text-5xl font-black text-white">{stats.gramsevakCompleted}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VillageSummary;