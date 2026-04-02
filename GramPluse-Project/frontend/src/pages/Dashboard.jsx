import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import IssueCard from '../components/IssueCard';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { notifyError } from '../components/NotificationToast';
import BottomNavbar from '../components/BottomNavbar';
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
  Megaphone,
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
      const label = `${t('week')} ${i} (${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()})`;
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
        }
      } catch (err) {
        console.error('Fetch error:', err);
        notifyError(t('error.loadingIssues') || "Failed to load issues");
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
      } catch (err) { console.error(err); }
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
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
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
    rejected: issues.filter((i) => i.status === 'rejected' || i.status === 'Rejected').length,
  };

  const displayedIssues = (activeTab === 'all'
    ? issues
    : issues.filter((issue) => {
        if (activeTab === 'inProgress') return issue.status === 'in-progress';
        if (activeTab === 'approved') return issue.status === 'approved' || issue.status === 'Completed';
        if (activeTab === 'rejected') return issue.status === 'rejected' || issue.status === 'Rejected';
        return true;
      })
  ).filter(issue => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      issue.title?.toLowerCase().includes(q) ||
      (t(issue.descriptionKey || issue.description))?.toLowerCase().includes(q)
    );
  });

  const handleGramSabhaClick = () => {
    if (notices.length > 0) {
      setShowNoticePopup(true);
      setCurrentNoticeIndex(0);
    } else {
      notifyError(t('noNotices') || "No active notices");
    }
  };

  return (
    <div className="min-h-screen bg-light-50 font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      <Navbar
        onGramSabhaClick={handleGramSabhaClick}
        onSearch={(query) => setSearchQuery(query)}
        onMenuClick={() => setIsSidebarOpen(true)}
      />

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="pt-20 md:ml-72 pb-32 md:pb-12 px-4 sm:px-6 lg:px-8 transition-all duration-500">
        <div className="max-w-7xl mx-auto py-6 space-y-8 animate-fade-in">
          
          {/* Header Card */}
          <section className="bg-brand-dark rounded-4xl p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                <TrendingUp className="w-3 h-3" /> Community Insights
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none">
                Village <span className="text-emerald-400 font-display italic">Voices</span>
              </h1>
              <p className="text-white/50 text-sm font-medium max-w-lg leading-relaxed">
                Report issues, track progress, and build a better village together. Collaborative governance for everyone.
              </p>
            </div>
          </section>

          {/* Quick Filters */}
          <section className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-2 overflow-x-auto hide-scrollbar w-full sm:w-auto pb-1">
               {[
                 { id: 'all', label: 'All Issues', count: stats.all },
                 { id: 'inProgress', label: 'In Progress', count: stats.inProgress },
                 { id: 'approved', label: 'Resolved', count: stats.completed },
                 { id: 'rejected', label: 'Rejected', count: stats.rejected },
               ].map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`px-5 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 ${
                     activeTab === tab.id 
                       ? 'bg-brand-dark text-white shadow-lg' 
                       : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'
                   }`}
                 >
                   {tab.label} <span className={`text-[10px] px-2 py-0.5 rounded-lg ${activeTab === tab.id ? 'bg-white/10' : 'bg-gray-100'}`}>{tab.count}</span>
                 </button>
               ))}
            </div>

            <div className="relative w-full sm:w-auto">
               <div className="bg-white border border-gray-100 rounded-2xl p-1 flex items-center shadow-sm">
                  <div className="pl-3 py-2"><Calendar className="w-4 h-4 text-emerald-500" /></div>
                  <select
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-xs font-black text-dark-900 pr-8 pl-2 outline-none appearance-none"
                  >
                    {weekOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
               </div>
            </div>
          </section>

          {/* Issues Grid */}
          {loading ? (
             <div className="py-20 flex justify-center"><div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>
          ) : displayedIssues.length === 0 ? (
             <div className="bg-white rounded-4xl p-12 text-center border-2 border-dashed border-gray-100">
                <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-black text-dark-900">No issues found</h3>
                <p className="text-gray-400 text-sm mt-1">Be the first to report something in this category!</p>
                <Link to="/submit" className="mt-8 inline-flex items-center gap-2 bg-brand-dark text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">
                  <Plus className="w-5 h-5" /> File Report
                </Link>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedIssues.map((issue) => (
                <div key={issue._id} className="mobile-card group flex flex-col h-full animate-fade-in-up">
                  <div className="relative aspect-[16/10] bg-gray-50 rounded-2xl overflow-hidden mb-4">
                     <IssueCard issue={issue} isCardView={true} hideActions={true} />
                     <div className="absolute top-2 right-2 flex gap-1.5">
                        <span className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-black shadow-sm flex items-center gap-1">
                           <Heart className={`w-3 h-3 ${issue.votes?.length > 0 ? 'text-red-500 fill-red-500' : 'text-gray-300'}`} /> {issue.votes?.length || 0}
                        </span>
                     </div>
                  </div>
                  <div className="flex-1 px-1">
                     <h3 className="text-lg font-black text-dark-900 leading-tight mb-2 truncate group-hover:text-brand-dark transition-colors">{issue.title || issue.type}</h3>
                     <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed mb-4">{t(issue.descriptionKey || issue.description)}</p>
                  </div>
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50 px-1">
                     <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${issue.status === 'approved' || issue.status === 'Completed' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'}`}></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{issue.status}</span>
                     </div>
                     <Link to={`/issue-details/${issue._id}`} className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:underline flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Details <ArrowRight className="w-3 h-3" />
                     </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Notice Modal - Premium Refactor */}
      {showNoticePopup && notices.length > 0 && (
         <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md">
            <div className="bg-white w-full max-w-lg rounded-4xl shadow-2xl overflow-hidden animate-spring-in">
               <div className="bg-brand-dark p-8 text-white relative">
                  <button onClick={() => setShowNoticePopup(false)} className="absolute top-6 right-6 text-white/50 hover:text-white"><X className="w-6 h-6" /></button>
                  <div className="flex items-center gap-3 mb-2 text-emerald-400">
                     <Megaphone className="w-4 h-4 animate-bounce" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Gram Sabha Notice</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black">Official Bulletin</h2>
               </div>
               <div className="p-8 space-y-6">
                  <div className="space-y-2">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Agenda</p>
                     <p className="text-xl font-bold text-dark-900">{notices[currentNoticeIndex].agenda}</p>
                     <p className="text-sm text-gray-500 font-medium italic">"{notices[currentNoticeIndex].message}"</p>
                  </div>
                  <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 flex items-center justify-between">
                     <div className="text-center flex-1">
                        <Calendar className="w-5 h-5 mx-auto text-brand-dark mb-1" />
                        <p className="text-[10px] text-gray-400 font-black uppercase">Date</p>
                        <p className="text-xs font-bold">{new Date(notices[currentNoticeIndex].date).toLocaleDateString()}</p>
                     </div>
                     <div className="w-px h-10 bg-gray-200"></div>
                     <div className="text-center flex-1">
                        <Clock className="w-5 h-5 mx-auto text-blue-500 mb-1" />
                        <p className="text-[10px] text-gray-400 font-black uppercase">Time</p>
                        <p className="text-xs font-bold">{notices[currentNoticeIndex].time}</p>
                     </div>
                  </div>
               </div>
               <div className="p-8 pt-0 flex gap-4">
                  <button onClick={() => setCurrentNoticeIndex(Math.max(0, currentNoticeIndex - 1))} className={`flex-1 py-4 rounded-2xl border border-gray-100 text-xs font-black transition-all ${currentNoticeIndex === 0 ? 'opacity-30' : 'hover:bg-gray-50'}`}>Previous</button>
                  <button onClick={() => setCurrentNoticeIndex(Math.min(notices.length - 1, currentNoticeIndex + 1))} className={`flex-1 py-4 rounded-2xl bg-brand-dark text-white text-xs font-black transition-all ${currentNoticeIndex === notices.length - 1 ? 'opacity-30' : 'hover:scale-105 shadow-xl'}`}>Next Notice</button>
               </div>
            </div>
         </div>
      )}

      {/* Floating Action Button */}
      <Link to="/submit" className="md:hidden fixed bottom-28 right-6 z-[100] animate-bounce-slow">
         <button className="w-16 h-16 bg-brand-dark text-white rounded-3xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
            <Plus className="w-8 h-8 stroke-[3]" />
         </button>
      </Link>

      <BottomNavbar />
    </div>
  );
}

export default Dashboard;