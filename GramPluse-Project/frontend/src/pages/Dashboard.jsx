import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import IssueCard from '../components/IssueCard';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { notifyError } from '../components/NotificationToast';
import {
  TrendingUp,
  Calendar,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Plus,
  Zap,
  Heart,
  ArrowRight,
  Bell,
  X,
  MapPin,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

function Dashboard() {
  const { t } = useTranslation();

  const [issues, setIssues] = useState([]);
  const [allIssues, setAllIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [activeTab, setActiveTab] = useState('all');
  const [notices, setNotices] = useState([]);
  const [showNoticePopup, setShowNoticePopup] = useState(false);
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getWeekOptions = () => {
    const options = [{ value: 'current', label: t('currentWeek') }];
    const today = new Date();

    for (let i = 1; i <= 8; i++) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay() - i * 7);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const label = `${t('week')} ${i} (${weekStart.toLocaleDateString('mr-IN')} - ${weekEnd.toLocaleDateString('mr-IN')})`;
      options.push({ value: i, label });
    }

    return options;
  };

  const weekOptions = getWeekOptions();

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      try {
        const res = await api.get('/issues');
        const fetchedIssues = res.data?.issues || res.data || [];
        if (Array.isArray(fetchedIssues)) {
          setAllIssues(fetchedIssues);
          setIssues(fetchedIssues);
        } else {
          console.error("Invalid issues format:", fetchedIssues);
          setAllIssues([]);
          setIssues([]);
        }
      } catch (err) {
        console.error('Fetch issues error:', err);
        notifyError(t('error.loadingIssues') || "Failed to load issues");
        setAllIssues([]);
        setIssues([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [t]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await api.get('/villageadmin/gramsabhanotices');
        if (res.data?.data && Array.isArray(res.data.data)) {
          setNotices(res.data.data);
        }
      } catch (err) {
        console.error('Fetch notices error:', err);
        setNotices([]);
      }
    };

    fetchNotices();
  }, []);

  useEffect(() => {
    if (!allIssues || allIssues.length === 0) return;

    if (selectedWeek === 'current') {
      setIssues(allIssues);
      return;
    }

    const weekOffset = Number(selectedWeek);
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() - weekOffset * 7);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const filtered = allIssues.filter((issue) => {
      const created = new Date(issue.createdAt);
      return created >= startOfWeek && created <= endOfWeek;
    });

    setIssues(filtered);
  }, [selectedWeek, allIssues]);

  const stats = {
    all: issues.length,
    inProgress: issues.filter((i) => i.status === 'in-progress').length,
    completed: issues.filter((i) => i.status === 'approved' || i.status === 'Completed').length,
    issue: issues.filter((i) => i.status === 'rejected' || i.status === 'Issue').length,
  };

  const displayedIssues = (activeTab === 'all'
    ? issues
    : issues.filter((issue) => {
        if (activeTab === 'inProgress') return issue.status === 'in-progress';
        if (activeTab === 'approved') return issue.status === 'approved' || issue.status === 'Completed';
        if (activeTab === 'rejected') return issue.status === 'rejected' || issue.status === 'Issue';
        return true;
      })
  ).filter(issue => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      issue.title?.toLowerCase().includes(q) ||
      (t(issue.descriptionKey || issue.description))?.toLowerCase().includes(q) ||
      issue.category?.toLowerCase().includes(q)
    );
  });

  const handleNextNotice = () => {
    if (currentNoticeIndex < notices.length - 1) {
      setCurrentNoticeIndex(currentNoticeIndex + 1);
    }
  };

  const handlePrevNotice = () => {
    if (currentNoticeIndex > 0) {
      setCurrentNoticeIndex(currentNoticeIndex - 1);
    }
  };

  const handleGramSabhaClick = () => {
    if (notices.length > 0) {
      setShowNoticePopup(true);
      setCurrentNoticeIndex(0);
    } else {
      notifyError(t('noNotices') || "No notices available");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      {/* 
        NAVBAR: Fixed at top. 
        Sidebar will sit below it or overlay it depending on design.
      */}
      <Navbar
        onGramSabhaClick={handleGramSabhaClick}
        onSearch={(query) => setSearchQuery(query)}
        onMenuClick={() => setIsSidebarOpen(true)}
      />

      {/* 
        SIDEBAR: Fixed position.
        Desktop: fixed left-0 top-16/20 w-72.
        Mobile: fixed inset, toggled.
      */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* 
        MAIN CONTENT:
        - pt-20: Push down to avoid Navbar overlap.
        - md:ml-72: Push right to avoid Sidebar overlap on Desktop.
        - transition: Smooth resize if sidebar were collapsible (optional).
      */}
      <div className="pt-24 md:ml-72 transition-all duration-500 ease-in-out pb-20 px-3.5 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-[#F0F7F2] to-[#E8F1EC] min-h-screen relative overflow-hidden">

        {/* Decorative Background Elements */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none z-0"></div>
        <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-green-200/20 to-cyan-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto py-8">

          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-emerald-100/80 backdrop-blur-md text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 border border-emerald-200 shadow-sm animate-pulse-slow">
                  <TrendingUp className="w-3.5 h-3.5" /> {t('communityFirst', 'Community First')}
                </span>
              </div>
              <h1 className="text-3xl sm:text-6xl font-black text-[#0B1A2C] leading-none mb-4 tracking-tighter">
                {t('village', 'Village')} <span className="text-[#0C7779]">{t('issues', 'Issues')}</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-500 font-bold max-w-2xl leading-relaxed">
                {t('dashboardSubtitle', 'Track, report, and solve community problems together. Your voice matters in building a better village.')}
              </p>
            </div>

            {/* Week Selector */}
            <div className="bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-2xl p-1.5 shadow-lg shadow-emerald-500/5 items-center flex relative group min-w-[280px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-emerald-500" />
              </div>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="block w-full pl-10 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-0 focus:border-transparent bg-transparent font-medium text-gray-700 appearance-none cursor-pointer"
              >
                {weekOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="h-4 w-4 text-emerald-500" />
              </div>
            </div>
          </div>

          {/* Stats & Filters */}
          <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-emerald-900/5 border border-emerald-50 mb-10 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 opacity-30"></div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="w-full md:w-auto">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-emerald-600" /> {t('filterByStatus', 'Filter by Status')}
                </h2>
                <div className="flex p-1 bg-gray-100/80 rounded-xl overflow-x-auto no-scrollbar">
                  {[
                    { id: 'all', label: t('all'), count: stats.all, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { id: 'inProgress', label: t('inProgress'), count: stats.inProgress, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
                    { id: 'approved', label: t('resolved'), count: stats.completed, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { id: 'rejected', label: t('rejected'), count: stats.issue, icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                         flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black whitespace-nowrap transition-all duration-300
                         ${activeTab === tab.id
                          ? 'bg-white text-gray-900 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.1)] border border-gray-100 transform scale-105'
                          : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
                        }
                       `}
                    >
                      <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? tab.color : 'text-gray-300'}`} />
                      {tab.label}
                      <span className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-500'}`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-auto hidden md:flex items-center gap-8 border-l border-gray-100 pl-8">
                <div className="text-center group transition-transform hover:-translate-y-1">
                  <p className="text-3xl font-black text-emerald-600 drop-shadow-sm">{stats.completed}</p>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{t('resolved', 'Resolved')}</p>
                </div>
                <div className="text-center group transition-transform hover:-translate-y-1">
                  <p className="text-3xl font-black text-blue-600 drop-shadow-sm">{stats.inProgress}</p>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{t('active', 'Active')}</p>
                </div>
                <div className="text-center group transition-transform hover:-translate-y-1">
                  <p className="text-3xl font-black text-gray-900 drop-shadow-sm">{stats.all}</p>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{t('total', 'Total')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Issues Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-emerald-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-emerald-500 fill-emerald-500" />
                </div>
              </div>
              <p className="mt-6 text-emerald-800 font-bold animate-pulse">{t('loadingIssues') || "Loading..."}</p>
            </div>
          ) : displayedIssues.length === 0 ? (
            <div className="text-center py-20 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-emerald-100">
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-emerald-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('noIssues')}</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                {t('submitNewIssueHelpVillage') || "Be the first to report an issue and help improve your village community."}
              </p>
              <Link
                to="/submit"
                className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all hover:scale-105 shadow-lg shadow-emerald-500/30"
              >
                <Plus className="w-5 h-5" />
                {t('submitNewIssue')}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedIssues.map((issue, index) => (
                <div key={issue._id} style={{ animationDelay: `${index * 100}ms` }} className="animate-fadeInUp h-full">
                  <div className="group bg-white rounded-[2rem] border border-gray-100 p-2 shadow-lg shadow-emerald-900/5 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                    <div className="relative rounded-[1.5rem] overflow-hidden mb-4">

                      <div className="absolute top-4 right-4 z-20 flex gap-2">
                        <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                          <Heart className="w-3 h-3 text-red-500 fill-red-500" /> {issue.votes?.length || 0}
                        </span>
                      </div>

                      <IssueCard
                        issue={{
                          ...issue,
                          description: t(issue.descriptionKey || issue.description),
                        }}
                        isCardView={true}
                      />
                    </div>

                    <div className="px-4 pb-4 flex-1 flex flex-col">
                      <Link to={`/issue-details/${issue._id}`} className="mt-auto">
                        <button className="w-full py-3.5 bg-gray-50 hover:bg-emerald-50 text-gray-900 hover:text-emerald-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 group-hover:bg-emerald-600 group-hover:text-white">
                          {t('viewDetails')} <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        <Link to="/submit" className="fixed bottom-8 right-8 z-40 group">
          <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-20 group-hover:opacity-40 animate-ping"></span>
          <button className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center border-4 border-white/20 backdrop-blur-sm">
            <Plus className="w-8 h-8 stroke-[3]" />
          </button>
        </Link>
      </div>

      {/* Gram Sabha Notice Popup */}
      {showNoticePopup && notices.length > 0 && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 sm:p-8 text-white relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-white/10">
                    <Bell className="w-3 h-3 animate-wiggle" /> {t('officialNotice', 'Official Notice')}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight">{t('gramsabhaNotice', 'Gram Sabha Notice')}</h3>
                  <div className="flex items-center gap-2 mt-2 opacity-90 text-sm font-medium">
                    <span className="bg-white/20 px-2 py-0.5 rounded text-xs">{currentNoticeIndex + 1} of {notices.length}</span>
                    <span>•</span>
                    <span>{t('useArrowsToNavigate', 'Use arrows to navigate')}</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowNoticePopup(false)}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-2 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar flex-1 bg-gradient-to-b from-orange-50 to-white">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-orange-100 mb-6">
                {notices[currentNoticeIndex].agenda && (
                  <h4 className="text-xl font-black text-gray-900 mb-4 font-display">
                    {notices[currentNoticeIndex].agenda}
                  </h4>
                )}
                {notices[currentNoticeIndex].message && (
                  <p className="text-gray-600 leading-relaxed font-medium whitespace-pre-wrap">
                    {notices[currentNoticeIndex].message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center shadow-sm">
                  <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 mb-2">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase">{t('date')}</span>
                  <span className="font-bold text-gray-900 mt-1">
                    {new Date(notices[currentNoticeIndex].date).toLocaleDateString()}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center shadow-sm">
                  <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-2">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase">{t('time')}</span>
                  <span className="font-bold text-gray-900 mt-1">
                    {notices[currentNoticeIndex].time}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center shadow-sm">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-2">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase">{t('location')}</span>
                  <span className="font-bold text-gray-900 mt-1 text-sm">
                    {notices[currentNoticeIndex].location}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer (Controls) */}
            <div className="p-4 border-t border-gray-100 bg-white shrink-0 flex justify-between items-center">
              <button
                onClick={handlePrevNotice}
                disabled={currentNoticeIndex === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" /> {t('previous')}
              </button>
              <div className="flex gap-1 justify-center">
                {notices.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentNoticeIndex ? 'bg-orange-500 w-6' : 'bg-gray-200'}`}></div>
                ))}
              </div>
              <button
                onClick={handleNextNotice}
                disabled={currentNoticeIndex === notices.length - 1}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-gray-900 text-white hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {t('next')} <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        .animate-wiggle {
          animation: wiggle 1s ease-in-out infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
           from { opacity: 0; }
           to { opacity: 1; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
}

export default Dashboard;