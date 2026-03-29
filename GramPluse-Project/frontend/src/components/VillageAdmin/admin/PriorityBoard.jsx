import React from 'react';
import { useTranslation } from 'react-i18next';
import { Flag, Target, Sparkles, Users } from 'lucide-react';

const PriorityBoard = ({ issues }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-8 animate-slideInUp">
      <h2 className="text-2xl sm:text-3xl font-black text-green-800 mb-6 flex items-center gap-3">
        <Flag className="w-7 h-7 sm:w-8 sm:h-8 animate-wave" />
        {t('priorityBoard')}
        <Target className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 animate-pulse" />
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['high', 'medium', 'low'].map((priority, index) => {
          const label = 
            priority === 'high' ? t('highPriority') :
            priority === 'medium' ? t('mediumPriority') :
            t('lowPriority');
          
          const filtered = issues.filter(i => i.priority === priority);
          const gradient = priority === 'high' ? 'from-red-500 to-pink-600' : 
                          priority === 'medium' ? 'from-yellow-500 to-orange-500' : 
                          'from-blue-500 to-cyan-500';

          return (
            <div 
              key={priority} 
              className="priority-board bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-500 border-3" 
              style={{ animation: `slideInUp 0.5s ease-out ${index * 0.2}s both` }}
            >
              <div className={`px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r ${gradient} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-all duration-500"></div>
                <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 relative z-10">
                  <Flag className="w-5 h-5 sm:w-6 sm:h-6 animate-wave" />
                  {label} {t('priority')}
                </h3>
                <p className="text-white text-sm opacity-90 font-bold mt-1 relative z-10">
                  {filtered.length} {t('issues')}
                </p>
              </div>
              <div className="p-4 sm:p-5 space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                {filtered.map((issue, idx) => (
                  <div 
                    key={issue._id} 
                    className="priority-item bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-5 border-2 border-green-300 hover:shadow-xl transition-all duration-500 transform hover:scale-105" 
                    style={{ animation: `fadeIn 0.3s ease-out ${idx * 0.1}s both` }}
                  >
                    {issue.images && issue.images.length > 0 && (
                      <div className="image-container relative overflow-hidden rounded-xl mb-4 shadow-lg">
                        <img 
                          src={issue.images[0]} 
                          alt="Issue" 
                          className="w-full h-32 sm:h-36 object-cover transform hover:scale-110 transition-all duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-all duration-300"></div>
                      </div>
                    )}
                    <p className="font-black text-green-900 mb-2 text-base sm:text-lg">{t(`issueTypes.${issue.type}`)}</p>
                    <p className="text-sm text-green-700 mb-3">{issue.description}</p>
                    {issue.assignedTo && (
                      <p className="text-xs text-green-600 flex items-center gap-2 font-semibold bg-green-100 px-3 py-1 rounded-full w-fit">
                        <Users className="w-4 h-4" />
                        {issue.assignedTo}
                      </p>
                    )}
                  </div>
                ))}
                {filtered.length === 0 && (
                  <p className="text-gray-500 text-center py-10 text-sm">
                    {t('noIssuesInThisPriority')}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PriorityBoard;