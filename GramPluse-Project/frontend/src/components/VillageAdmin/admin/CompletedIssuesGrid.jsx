import React, { useState } from 'react';
import { CheckCircle, Award, Users, Camera, Eye, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CompletedIssuesGrid = ({ issues, onViewDetail }) => {
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = issues.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(issues.length / itemsPerPage);

  return (
    <div className="mb-12 animate-slideInUp">
      <h2 className="text-2xl sm:text-3xl font-black text-emerald-800 mb-6 flex items-center gap-3">
        <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600 animate-pulse" />
        {t('completedWorksByGramsevak', { count: issues.length })}
        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 animate-spin-slow" />
      </h2>

      {issues.length === 0 ? (
        <div className="bg-gradient-to-br from-white to-emerald-50 rounded-3xl shadow-2xl p-8 sm:p-16 text-center border-4 border-emerald-300 transform hover:scale-105 transition-all duration-500">
          <CheckCircle className="w-24 h-24 sm:w-32 sm:h-32 text-emerald-300 mx-auto mb-8 animate-bounce" />
          <p className="text-2xl sm:text-3xl text-emerald-700 font-black">
            {t('noCompletedWorksYet')}
          </p>
          <p className="text-emerald-600 mt-4 text-lg sm:text-xl">
            {t('worksWillAppearHere')}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {currentItems.map((issue, idx) => (
              <div
                key={issue._id}
                className="completed-card bg-gradient-to-br from-white to-emerald-50 rounded-3xl shadow-2xl overflow-hidden border-4 border-emerald-400 transform hover:scale-105 hover:-rotate-1 transition-all duration-500 hover:shadow-glow-emerald"
                style={{ animation: `fadeInUp 0.6s ease-out ${idx * 0.15}s both` }}
              >
                {issue.images && issue.images.length > 0 && (
                  <div className="relative overflow-hidden">
                    <img 
                      src={issue.images[0]} 
                      alt={t('issueImage')} 
                      className="w-full h-40 sm:h-48 object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                )}
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-black text-emerald-900 text-lg sm:text-xl flex items-center gap-2">
                        {t(`issueTypes.${issue.type}`) || issue.type}
                        <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 animate-bounce" />
                      </p>
                      <p className="text-emerald-700 text-sm mt-2 line-clamp-2">{issue.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-3 text-xs">
                    <span className="flex items-center gap-1 bg-green-100 text-green-800 px-3 sm:px-4 py-2 rounded-full font-bold text-xs sm:text-sm">
                      <Users className="w-4 h-4" />
                      {issue.assignedTo || t('gramsevak')}
                    </span>
                    <span className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 sm:px-4 py-2 rounded-full font-bold text-xs sm:text-sm">
                      👍 {issue.votes?.length || 0}
                    </span>
                    {issue.proofPhotos && issue.proofPhotos.length > 0 && (
                      <span className="flex items-center gap-1 bg-purple-100 text-purple-800 px-3 sm:px-4 py-2 rounded-full font-bold text-xs sm:text-sm">
                        <Camera className="w-4 h-4" />
                        {issue.proofPhotos.length} {t('proofPhotos')}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => onViewDetail(issue)}
                    className="mt-6 w-full px-6 py-3 sm:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-black hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-glow-emerald transform hover:scale-105 text-sm sm:text-base"
                  >
                    <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                    {t('viewFullDetails')}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center gap-3 mt-12">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                disabled={currentPage === 1} 
                className="p-3 rounded-full bg-white shadow-lg disabled:opacity-50 hover:bg-emerald-50"
              >
                <ChevronLeft className="w-6 h-6 text-emerald-600" />
              </button>
              <div className="flex flex-wrap gap-2 justify-center">
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentPage(i + 1)} 
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full font-black text-sm sm:text-base ${currentPage === i + 1 ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-glow-emerald' : 'bg-white text-emerald-700 hover:bg-emerald-100 shadow-lg'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                disabled={currentPage === totalPages} 
                className="p-3 rounded-full bg-white shadow-lg disabled:opacity-50 hover:bg-emerald-50"
              >
                <ChevronRight className="w-6 h-6 text-emerald-600" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CompletedIssuesGrid;