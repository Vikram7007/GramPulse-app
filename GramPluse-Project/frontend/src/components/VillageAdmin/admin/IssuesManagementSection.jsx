// src/components/admin/IssuesManagementSection.jsx

import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Search, 
  Filter, 
  ChevronDown, 
  Send, 
  CheckCircle, 
  XCircle,
  Calendar,
  Users,
  Flag,
  Image,
  XCircle as CloseIcon
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const IssuesManagementSection = ({ issues, loading, setInProgress, approveIssue, rejectIssue }) => {
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(t('allIssues'));
  const [statusFilter, setStatusFilter] = useState('all');
  const [weekFilter, setWeekFilter] = useState('all');

  const categories = [
    t('allIssues'),
    t('issueTypes.water'),
    t('issueTypes.road'),
    t('issueTypes.electricity'),
    t('issueTypes.garbage'), // assuming स्वच्छता = garbage/drainage
    t('issueTypes.school'),
    t('issueTypes.health'),
    t('issueTypes.other')
  ];

  const statusCategories = [
    { key: 'all', label: t('all'), icon: FileText },
    { key: 'pending', label: t('pending'), icon: Flag },
    { key: 'approved', label: t('approved'), icon: CheckCircle },
    { key: 'rejected', label: t('rejected'), icon: XCircle }
  ];

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = 
      (issue.type || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (issue.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === t('allIssues') || 
                           issue.type === selectedCategory;
    
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    
    if (weekFilter !== 'all') {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const issueDate = new Date(issue.createdAt);
      if (!(issueDate >= weekAgo)) return false;
    }
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-gradient-to-r from-red-100 to-red-50 text-red-800 border-red-300';
      case 'medium': return 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border-blue-300';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-800 border-orange-300';
      case 'approved': return 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 border-green-300';
      case 'rejected': return 'bg-gradient-to-r from-red-100 to-red-50 text-red-800 border-red-300';
      case 'in-progress': return 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 border-purple-300';
      case 'Completed': return 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 border-emerald-300';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border-gray-300';
    }
  };

  const getStatusCount = (status) => {
    if (status === 'all') return issues.length;
    return issues.filter(issue => issue.status === status).length;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-200">
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-4 sm:px-6 py-4 sm:py-5">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
          <FileText className="w-6 h-6 sm:w-7 sm:h-7" />
          {t('issueManagement')}
          <Sparkles className="w-5 h-5" />
        </h2>
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {statusCategories.map((cat) => {
            const Icon = cat.icon;
            const count = getStatusCount(cat.key);
            const isActive = statusFilter === cat.key;
            
            return (
              <button
                key={cat.key}
                onClick={() => setStatusFilter(cat.key)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap shadow-sm text-sm ${
                  isActive
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-green-400'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{cat.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchByIssue')}
                className="w-full pl-10 sm:pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400 bg-white shadow-sm text-sm sm:text-base"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="relative w-full lg:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none w-full pl-10 sm:pl-11 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900 bg-white shadow-sm cursor-pointer font-medium text-sm sm:text-base"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Filter className="w-5 h-5 text-gray-400" />
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown className="w-5 h-5 text-gray-600" />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setWeekFilter('all')}
              className={`px-4 sm:px-5 py-3 rounded-lg font-semibold transition-all shadow-sm flex items-center gap-2 text-sm ${
                weekFilter === 'all'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              {t('all')}
            </button>
            <button
              onClick={() => setWeekFilter('week')}
              className={`px-4 sm:px-5 py-3 rounded-lg font-semibold transition-all shadow-sm flex items-center gap-2 text-sm ${
                weekFilter === 'week'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              {t('week')}
            </button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold text-sm">
            <Flag className="w-4 h-4" />
            {t('issuesFound', { count: filteredIssues.length })}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {loading ? (
          <div className="text-center py-20">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600 font-semibold text-base">{t('loadingIssues')}</p>
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl font-semibold">{t('noIssuesFound')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredIssues.map((issue, index) => (
              <IssueCard
                key={issue._id}
                issue={issue}
                index={index}
                getPriorityColor={getPriorityColor}
                getStatusColor={getStatusColor}
                setInProgress={setInProgress}
                approveIssue={approveIssue}
                rejectIssue={rejectIssue}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const IssueCard = ({ issue, index, getPriorityColor, getStatusColor, setInProgress, approveIssue, rejectIssue }) => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const images = issue.images || [];
  const issuePhoto = images[0] || null;
  const mapPhoto = images[1] || null;

  return (
    <>
      <div 
        className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
        style={{ animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both` }}
      >
        <div className="flex flex-col">
          {/* Image Grid Section */}
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-gray-50">
              {/* Issue Photo */}
              <div 
                className="relative h-48 sm:h-56 group overflow-hidden rounded-xl cursor-pointer border-2 border-gray-200 hover:border-blue-400 transition-all shadow-md"
                onClick={() => issuePhoto && setSelectedImage({ src: issuePhoto, title: t('issuePhoto') })}
              >
                {issuePhoto ? (
                  <>
                    <img
                      src={issuePhoto}
                      alt={t('issuePhoto')}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden absolute inset-0 items-center justify-center bg-gray-300">
                      <Image className="w-12 h-12 text-gray-500" />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2 shadow-lg">
                        <Search className="w-6 h-6 text-gray-800" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-md">
                      {t('issuePhoto')}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center bg-gray-200 h-full rounded-xl">
                    <Image className="w-16 h-16 text-gray-400 mb-2" />
                    <p className="text-gray-500 text-sm font-medium">{t('noImage')}</p>
                  </div>
                )}
              </div>

              {/* Map Photo */}
              <div 
                className="relative h-48 sm:h-56 group overflow-hidden rounded-xl cursor-pointer border-2 border-gray-200 hover:border-green-400 transition-all shadow-md"
                onClick={() => mapPhoto && setSelectedImage({ src: mapPhoto, title: t('mapPhoto') })}
              >
                {mapPhoto ? (
                  <>
                    <img
                      src={mapPhoto}
                      alt={t('mapPhoto')}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden absolute inset-0 items-center justify-center bg-gray-300">
                      <Image className="w-12 h-12 text-gray-500" />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2 shadow-lg">
                        <Search className="w-6 h-6 text-gray-800" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-md">
                      {t('mapPhoto')}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center bg-gray-200 h-full rounded-xl">
                    <Image className="w-16 h-16 text-gray-400 mb-2" />
                    <p className="text-gray-500 text-sm font-medium">{t('noImage')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-4 sm:p-6">
            <div className="flex flex-col gap-3 mb-3">
              <div className="flex-1">
                <div className="flex items-start gap-2 mb-2">
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 leading-tight">
                      {t(`issueTypes.${issue.type}`) || issue.type}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{issue.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border whitespace-nowrap shadow-sm ${getStatusColor(issue.status)}`}>
                  {issue.status === 'pending' ? t('pending') :
                   issue.status === 'approved' ? t('approved') :
                   issue.status === 'rejected' ? t('rejected') :
                   issue.status === 'in-progress' ? t('inProgress') :
                   issue.status === 'Completed' ? t('completed') : issue.status}
                </span>
                {issue.priority ? (
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border whitespace-nowrap shadow-sm ${getPriorityColor(issue.priority)}`}>
                    {issue.priority === 'high' ? t('highPriority') : 
                     issue.priority === 'medium' ? t('mediumPriority') : t('lowPriority')}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <span className="flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-1 rounded-lg font-semibold text-xs border border-blue-200">
                <Calendar className="w-3 h-3" />
                {new Date(issue.createdAt).toLocaleDateString('mr-IN')}
              </span>
              <span className="px-3 py-1 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 rounded-lg font-semibold text-xs border border-purple-200">
                {issue.category || t('general')}
              </span>
            </div>

            <div className="border-t border-gray-200 my-3"></div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                {issue.assignedTo ? (
                  <span className="px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-lg font-semibold flex items-center gap-1.5 border border-green-200 text-xs">
                    <Users className="w-3.5 h-3.5" />
                    {issue.assignedTo}
                  </span>
                ) : (
                  <span className="inline-flex items-center text-lime-700 font-semibold text-sm px-4 py-1.5 bg-lime-50 rounded-full border border-lime-300 shadow-sm">
                    {t('defaultGramsevak')}
                  </span>
                )}
                
                <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-1.5 rounded-lg border border-amber-200">
                  <span className="text-lg">👍</span>
                  <span className="font-bold text-gray-800 text-sm">{issue.votes?.length || 0}</span>
                  <span className="text-xs text-gray-600 font-medium">{t('votes')}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setInProgress(issue._id)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-xs sm:text-sm font-bold hover:from-purple-700 hover:to-purple-800 transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md"
                >
                  <Send className="w-4 h-4" />
                  {t('setInProgress')}
                </button>
                <button
                  onClick={() => approveIssue(issue._id)}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-xs sm:text-sm font-bold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md"
                >
                  <CheckCircle className="w-4 h-4" />
                  {t('approve')}
                </button>
                <button
                  onClick={() => rejectIssue(issue._id)}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg text-xs sm:text-sm font-bold hover:from-red-700 hover:to-rose-700 transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md"
                >
                  <XCircle className="w-4 h-4" />
                  {t('reject')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Popup Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-full max-h-full w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white text-gray-800 rounded-full p-3 hover:bg-gray-200 transition-all shadow-2xl z-10"
            >
              <CloseIcon className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            <div className="absolute top-4 left-4 bg-white/95 text-gray-800 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-base sm:text-lg shadow-2xl">
              {selectedImage.title}
            </div>

            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="w-full h-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default IssuesManagementSection;