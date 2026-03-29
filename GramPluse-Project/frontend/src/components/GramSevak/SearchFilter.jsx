// src/components/GramSevak/SearchFilter.jsx
import React from 'react';
import { 
  Search, 
  Filter, 
  FileText, 
  Calendar,
  Clock,         // ← नवीन add केले
  CheckCircle,   // ← नवीन add केले
  AlertCircle    // ← नवीन add केले
} from 'lucide-react';

const SearchFilter = ({ 
  searchQuery, 
  setSearchQuery, 
  weekFilter, 
  setWeekFilter, 
  activeTab, 
  setActiveTab, 
  filteredIssues, 
  stats 
}) => {
  return (
    <>
      {/* Search & Filter */}
      <div className="mb-8 bg-white rounded-3xl shadow-2xl p-6 border-2 border-green-100 transform transition-all duration-300 hover:shadow-green-200">
        <div className="flex flex-col md:flex-row gap-5 items-center justify-between">
          <div className="relative flex-1 max-w-lg group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-green-600 w-6 h-6 transition-all duration-300 group-hover:scale-110" />
              <input
                type="text"
                placeholder="🔍 समस्येच्या नावाने शोधा..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-5 py-4 border-2 border-green-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all duration-300 text-green-900 font-semibold text-base shadow-inner"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 bg-gradient-to-r from-green-50 to-emerald-50 px-5 py-3 rounded-2xl border-2 border-green-200">
            <Filter className="w-6 h-6 text-green-700" />
            <select
              value={weekFilter}
              onChange={(e) => setWeekFilter(e.target.value)}
              className="px-5 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-300 bg-white text-green-900 font-bold text-base cursor-pointer transition-all duration-300 hover:border-green-500"
            >
              <option value="all">📅 सर्व समस्या</option>
              <option value="thisWeek">📌 हा आठवडा</option>
              <option value="lastWeek">📋 मागील आठवडा</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex flex-wrap justify-center gap-4">
        {[
          { key: 'all', label: 'सर्व', icon: FileText, count: filteredIssues.length },
          { key: 'pending', label: 'प्रगतीत', icon: Clock, count: stats.inProgress },
          { key: 'completed', label: 'पूर्ण', icon: CheckCircle, count: stats.completed },
          { key: 'rejected', label: 'अडचण', icon: AlertCircle, count: filteredIssues.filter(i => i.status === 'Issue').length }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-8 py-3 rounded-2xl font-black text-base transition-all duration-300 transform hover:scale-110 shadow-xl flex items-center gap-2 ${
                activeTab === tab.key 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-green-400/50' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-green-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label} ({tab.count})
            </button>
          );
        })}
      </div>
    </>
  );
};

export default SearchFilter;