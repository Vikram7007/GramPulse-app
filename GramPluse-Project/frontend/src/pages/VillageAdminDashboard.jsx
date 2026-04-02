import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Shield,
  User,
  ArrowLeft,
  Lock,
  Mail,
  Building2,
  CheckCircle,
  Loader2,
  FileText,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Filter,
  Search,
  ChevronDown,
  Bell,
  Check,
  X,
  UserPlus,
  ArrowRight,
  MoreHorizontal,
  LayoutDashboard
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

import api from "../utils/api";
import { notifyError, notifySuccess } from "../components/NotificationToast";
import VillageAdminNavbar from "../components/VillageAdmin/admin/VillageAdminNavbar";
import VillageAdminSidebar from "../components/VillageAdmin/admin/VillageAdminSidebar";
import GramSabhaNoticePanel from "../components/VillageAdmin/admin/GramSabhaNoticePanel";
import VillageAdminReportsPanel from "../components/VillageAdmin/admin/VillageAdminReportsPanel";
import VillageAdminSettingsPanel from "../components/VillageAdmin/admin/VillageAdminSettingsPanel";
import BottomNavbar from "../components/BottomNavbar";

// Modals
import CompletedDetailModal from "../components/VillageAdmin/modals/CompletedDetailModal";
import SendToGramSevakModal from "../components/VillageAdmin/modals/SendToGramSevakModal";
import GramSabhaNotesModal from "../components/VillageAdmin/modals/GramSabhaNotesModal";
import GramSabhaNoticeModal from "../components/VillageAdmin/modals/GramSabhaNoticeModal";
import GramSabhaNoticeSlider from "../components/VillageAdmin/modals/GramSabhaNoticeSlider";

// ==================== AUTH MODAL COMPONENT ====================
const AuthModal = ({ onLoginSuccess }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("login");

  const [signupName, setSignupName] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [forgotUsername, setForgotUsername] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) return notifyError(t("error.fillFields"));

    setLoading(true);
    try {
      const res = await api.post("/auth/village/sarpanchlogin", { username, password });
      if (res.data?.token) {
        notifySuccess(t("success.loginSuccess") || "Login Successful!");
        onLoginSuccess({
           name: res.data.name || username,
           mobile: res.data.mobile || username
        });
      } else {
        notifyError(t("error.loginFailed"));
      }
    } catch (err) {
      notifyError(t("error.somethingWentWrong"));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!signupName || !signupUsername || !signupPassword) return notifyError(t("error.fillAllFields"));
    try {
      await api.post("/auth/village/sarpanchSignup", { name: signupName, username: signupUsername, password: signupPassword });
      notifySuccess(t("success.signupSuccess"));
      setView("login");
    } catch (err) {
      notifyError(err.response?.data?.message || t("error.somethingWentWrong"));
    }
  };

  const handleForgot = async () => {
    if (!forgotUsername) return notifyError(t("error.fillFields"));
    try {
      const res = await api.post("/auth/forgot-password", { username: forgotUsername });
      notifySuccess(res.data.message);
      setView("login");
    } catch (err) {
      notifyError(err.response?.data?.message || t("error.somethingWentWrong"));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex overflow-hidden bg-white font-sans">
      <div className="hidden lg:flex w-5/12 bg-emerald-950 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1623945199859-6e3e1174092b?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/95 via-green-900/90 to-teal-900/90"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

        <div className="relative z-10 p-12 text-center text-white">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl mx-auto mb-8 flex items-center justify-center border border-white/20 shadow-2xl skew-y-3">
            <Building2 className="w-12 h-12 text-emerald-300 -skew-y-3" />
          </div>
          <h1 className="text-5xl font-black mb-6 tracking-tight drop-shadow-lg">Sarpanch<span className="text-emerald-300">Hub</span></h1>
          <p className="text-emerald-100/90 text-lg leading-relaxed max-w-md mx-auto font-medium">
            Advanced governance platform. Monitor progress, manage issues, and unite your community.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 bg-gray-50 relative">
        <button onClick={() => navigate('/')} className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-emerald-600 transition-colors font-bold text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 border border-white relative overflow-hidden">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              {view === 'login' ? 'Sarpanch Login' : view === 'signup' ? 'Admin Registration' : 'Restoration'}
            </h2>
            <p className="text-gray-500 font-medium">
              {view === 'login' ? 'Access your administrative dashboard' : view === 'signup' ? 'Create a secure admin profile' : 'Recover your account access'}
            </p>
          </div>

          <form className="space-y-5" onSubmit={view === 'login' ? handleLogin : (e) => e.preventDefault()}>
            {view === 'login' && (
              <>
                <div className="space-y-4">
                  <div className="relative group">
                    <User className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                    <input
                      type="text"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-gray-700 placeholder-gray-400"
                      placeholder="Username"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                      <input
                        type="password"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-gray-700 placeholder-gray-400"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end mt-2">
                      <button type="button" onClick={() => setView('forgot')} className="text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:underline">Forgot password?</button>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-500/30 transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {loading ? "Verifying..." : "Access Dashboard"}
                </button>
              </>
            )}

            {view === 'signup' && (
              <div className="space-y-4">
                <input type="text" placeholder="Full Name" className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-emerald-500 font-bold outline-none" value={signupName} onChange={e => setSignupName(e.target.value)} />
                <input type="text" placeholder="Username" className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-emerald-500 font-bold outline-none" value={signupUsername} onChange={e => setSignupUsername(e.target.value)} />
                <input type="password" placeholder="Password" className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-emerald-500 font-bold outline-none" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} />
                <button type="button" onClick={handleSignup} className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg">Register Admin</button>
              </div>
            )}

            {view === 'forgot' && (
              <div className="space-y-4">
                <div className="relative group">
                  <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                  <input type="text" placeholder="Registered Username" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-emerald-500 font-bold outline-none" value={forgotUsername} onChange={e => setForgotUsername(e.target.value)} />
                </div>
                <button type="button" onClick={handleForgot} className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg">Send Link</button>
              </div>
            )}
          </form>

          <div className="mt-8 text-center pt-6 border-t border-gray-100">
            {view === 'login' ? (
              <p className="text-gray-500 font-medium">New Village? <button onClick={() => setView('signup')} className="text-emerald-600 font-bold hover:underline">Register Village</button></p>
            ) : (
              <button onClick={() => setView('login')} className="text-emerald-600 font-bold hover:underline flex items-center gap-2 mx-auto"><ArrowLeft className="w-4 h-4" /> Cancel</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN DASHBOARD ====================
const VillageAdminDashboard = () => {
  const { t } = useTranslation();

  // State
  const [issues, setIssues] = useState([]);
  const [gramsevakCompletedIssues, setGramsevakCompletedIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUsername, setCurrentUsername] = useState("Sarpanch");
  const [currentMobile, setCurrentMobile] = useState("7028615656");

  // Modals
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showNoticeSlider, setShowNoticeSlider] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedGramSevak, setSelectedGramSevak] = useState("राजेश कुमार");
  const [showCompletedDetailModal, setShowCompletedDetailModal] = useState(false);
  const [selectedCompletedIssue, setSelectedCompletedIssue] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [resolvedFilter, setResolvedFilter] = useState('this-week');
  const [activePanel, setActivePanel] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const userTabs = [
    { id: 'all', label: t('all', 'सर्व') },
    { id: 'pending', label: t('pending', 'प्रलंबित') },
    { id: 'assigned', label: t('assigned', 'नेमून दिलेले') },
    { id: 'completed', label: t('completed', 'पूर्ण') },
    { id: 'rejected', label: t('rejected', 'नाकारले') }
  ];

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const issuesRes = await api.get("issues");
      const completedRes = await api.get("issues/gramsevek/completed");

      let fetchedIssues = issuesRes.data?.issues || [];
      // Normalize data
      fetchedIssues = fetchedIssues.map(i => ({
        ...i,
        status: i.status || "pending",
        priority: i.priority || (i.votes?.length > 10 ? 'high' : i.votes?.length > 5 ? 'medium' : 'low'),
        title: i.title || "Community Issue Report" // Better fallback
      }));
      setIssues(fetchedIssues.sort((a, b) => (b.votes?.length || 0) - (a.votes?.length || 0)));
      setGramsevakCompletedIssues(completedRes.data?.data || []);
    } catch (err) {
      console.error(err);
      notifyError(t("error.loadingIssues"));
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: issues.length + gramsevakCompletedIssues.length,
    active: issues.filter(i => i.status === 'in-progress' || i.status === 'pending').length,
    completed: gramsevakCompletedIssues.length + issues.filter(i => i.status === 'approved' || i.status === 'Completed').length,
    highPriority: issues.filter(i => i.priority === 'high').length
  };

  const chartData = [
    { name: 'Mon', active: 4, resolved: 2 },
    { name: 'Tue', active: 3, resolved: 4 },
    { name: 'Wed', active: 7, resolved: 5 },
    { name: 'Thu', active: 5, resolved: 8 },
    { name: 'Fri', active: 6, resolved: 4 },
    { name: 'Sat', active: 2, resolved: 3 },
    { name: 'Sun', active: 4, resolved: 6 },
  ];

  const pieData = [
    { name: 'Resolved', value: stats.completed, color: '#10B981' },
    { name: 'Pending', value: stats.active, color: '#F59E0B' },
  ];

  const handleApprove = async (id) => {
    try {
      await api.patch(`issues/${id}/approved`);
      notifySuccess("Issue marked as Approved");
      fetchData();
    } catch (e) { notifyError("Action failed"); }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`issues/${id}/rejected`);
      notifySuccess("Issue Rejected");
      fetchData();
    } catch (e) { notifyError("Action failed"); }
  };

  const handleAssign = async () => {
    try {
      await api.patch(`issues/${selectedIssue._id}/in-progress`, {
        priority: selectedPriority.toLowerCase(),
        assignedTo: selectedGramSevak
      });
      notifySuccess("Assigned to Gram Sevak");
      setShowSendModal(false);
      fetchData();
    } catch (e) { notifyError("Failed to assign"); }
  };

  if (!isAuthenticated) {
    return <AuthModal onLoginSuccess={(data) => { 
       setCurrentUsername(data.name); 
       setCurrentMobile(data.mobile);
       setIsAuthenticated(true); 
    }} />;
  }

  return (
    <div className="min-h-screen bg-[#F0F4F2] font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      <VillageAdminNavbar 
        adminNameProp={currentUsername} 
        onGramSabhaClick={() => setShowNoticeSlider(true)} 
        onMenuClick={() => setIsSidebarOpen(true)}
      />
      <VillageAdminSidebar 
        activePanel={activePanel} 
        setActivePanel={(panel) => { setActivePanel(panel); setIsSidebarOpen(false); }} 
        adminName={currentUsername} 
        adminPhone={currentMobile}
        isOpen={isSidebarOpen}
        setOpen={setIsSidebarOpen}
      />

      <div className="pt-20 md:ml-72 min-h-screen transition-all duration-300 relative pb-32 md:pb-0">
        <main className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in overflow-hidden">
          
          {activePanel === 'dashboard' && (
            <>
              {/* Header Section - Premium Banner */}
          <section className="relative overflow-hidden rounded-[2.5rem] bg-emerald-900 px-8 py-10 text-white shadow-2xl">
            <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-emerald-500/20 to-transparent"></div>
            <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/50 border border-emerald-700/50 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {t('sarpanchAdmin', 'Sarpanch Administration')}
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                  {t('welcomeBack', 'Welcome back')}, <span className="text-emerald-400">{currentUsername}</span>
                </h1>
                <p className="text-emerald-100/70 font-medium max-w-xl">
                  {t('monitoringVillage', 'Monitoring village progress and managing community issues. You have {{count}} pending tasks to review today.', { count: stats.active })}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => setShowNoticeModal(true)}
                  className="group flex items-center gap-2 px-6 py-3.5 bg-white text-emerald-900 rounded-2xl font-bold shadow-lg hover:shadow-emerald-500/20 transition-all hover:-translate-y-1 active:scale-95"
                >
                  <Bell className="w-5 h-5 group-hover:animate-bounce" /> {t('postNotice', 'Post Notice')}
                </button>
              </div>
            </div>
          </section>

          {/* Key Metrics Dashboard */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: t('communityReports', 'Community Reports'), value: stats.total, icon: LayoutDashboard, color: "text-blue-600", bg: "bg-blue-50", trend: "+12%" },
              { label: t('issuesResolved', 'Issues Resolved'), value: stats.completed, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+8%" },
              { label: t('pendingReview', 'Pending Review'), value: stats.active, icon: Clock, color: "text-amber-600", bg: "bg-amber-50", trend: "-5%" },
              { label: t('criticalPriority', 'Critical Priority'), value: stats.highPriority, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", trend: "+2" },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {stat.trend}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 font-bold text-xs uppercase tracking-wider">{stat.label}</p>
                  <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
                </div>
              </div>
            ))}
          </section>

          {/* Main Content Layout */}
          <div className="w-full">
            
            {/* Full Width Issues List */}
            <section className="space-y-6 w-full">
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-gray-50/50 p-4 rounded-3xl border border-gray-100 mb-6">
                <h2 className="text-xl leading-tight font-black text-[#0B1A2C] flex items-start gap-2 min-w-max">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-1" />
                  <div>
                    {t('priorityAttention', 'Priority Attention Needed')}
                  </div>
                </h2>
                
                {/* Tabs & Search */}
                <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
                  <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {userTabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-2.5 rounded-xl font-bold text-[13px] transition-all whitespace-nowrap shadow-sm ${activeTab === tab.id
                          ? 'bg-[#0B8A5A] text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-50'
                          }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full md:w-64 flex-shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder={t('searchIssuesPlaceholder', 'Search issues...')}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#0B8A5A] focus:ring-4 focus:ring-[#0B8A5A]/10 transition-all outline-none font-bold text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                  <div className="col-span-full h-64 flex items-center justify-center">
                    <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
                  </div>
                ) : (() => {
                  const filteredIssuesForDisplay = issues.filter(i => {
                    if (activeTab === 'pending') return i.status === 'pending';
                    if (activeTab === 'assigned') return i.status === 'in-progress';
                    if (activeTab === 'completed') return i.status === 'Completed' || i.status === 'approved';
                    if (activeTab === 'rejected') return i.status === 'Issue' || i.status === 'rejected';
                    return true;
                  });

                  return filteredIssuesForDisplay.length === 0 ? (
                    <div className="col-span-full bg-white rounded-[2rem] p-12 text-center border-2 border-dashed border-gray-100">
                      <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-emerald-500" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{t('allIssuesProcessed', 'All Issues Processed')}</h3>
                      <p className="text-gray-500">{t('noIssuesInCategory', 'There are no {{category}} issues.', { category: activeTab === 'all' ? t('pending', 'pending') : activeTab })}</p>
                    </div>
                  ) : (
                    filteredIssuesForDisplay.slice(0, 10).map((issue) => (
                    <div key={issue._id} className="group bg-white rounded-[2rem] p-5 border border-emerald-100/50 shadow-sm hover:shadow-xl hover:border-emerald-300/60 transition-all duration-300 flex flex-col h-full">
                      
                      {/* Flex Header: Date */}
                      <div className="flex justify-between items-center mb-4">
                         <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                           <Calendar className="w-3.5 h-3.5 text-gray-300" /> 
                           {new Date(issue.createdAt).toLocaleDateString('en-GB')}
                         </span>
                      </div>

                      {/* Image Layer with Floating Badges */}
                      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 mb-5 flex items-center justify-center shadow-sm relative group-hover:shadow-md transition-all">
                         {issue.images && issue.images.length > 0 ? (
                           <img src={issue.images[0]} alt="Issue" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                         ) : (
                           <div className="flex flex-col items-center text-gray-300">
                             <FileText className="w-10 h-10 mb-2 opacity-50" />
                             <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">No Image</span>
                           </div>
                         )}

                         {/* Floating Top Left: Status Badge */}
                         <div className="absolute top-3 left-3">
                             <div className={`px-3 py-1.5 rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-sm border flex items-center gap-1.5 backdrop-blur-md ${
                                issue.status === 'in-progress' ? 'bg-indigo-600/95 text-white border-indigo-400/50' :
                                issue.status === 'Completed' || issue.status === 'approved' ? 'bg-[#0B8A5A]/95 text-white border-emerald-400/50' :
                                (issue.status === 'Issue' || issue.status === 'rejected') ? 'bg-rose-500/95 text-white border-rose-400/50' :
                                'bg-amber-500/95 text-white border-amber-400/50'
                             }`}>
                               {issue.status === 'in-progress' ? <User className="w-3.5 h-3.5" /> : 
                                issue.status === 'Completed' || issue.status === 'approved' ? <CheckCircle className="w-3.5 h-3.5" /> : 
                                (issue.status === 'Issue' || issue.status === 'rejected') ? <X className="w-3.5 h-3.5" /> : 
                                <AlertTriangle className="w-3.5 h-3.5" />}
                               
                               {issue.status === 'in-progress' ? t('assigned', 'Assigned') : 
                                issue.status === 'Completed' || issue.status === 'approved' ? t('approved', 'Approved') : 
                                (issue.status === 'Issue' || issue.status === 'rejected') ? t('rejected', 'Rejected') : t('pending', 'Pending')}
                             </div>
                         </div>

                         {/* Floating Top Right: Priority Badge */}
                         <div className="absolute top-3 right-3">
                           <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-white shadow-sm flex items-center gap-1 backdrop-blur-md ${
                              issue.priority === 'high' ? 'bg-[#EF4444]/95 border border-red-400/50' : issue.priority === 'medium' ? 'bg-amber-500/95 border border-amber-400/50' : 'bg-[#10B981]/95 border border-emerald-400/50'
                            }`}>
                              {issue.priority === 'high' ? <AlertTriangle className="w-3 h-3" /> : null}
                              {issue.priority}
                           </div>
                         </div>

                         {/* Floating Bottom Left: Votes */}
                         <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-[12px] font-bold text-[#0B4A3A] flex items-center gap-1.5 shadow-sm border border-white/50">
                           <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" /> 
                           {issue.votes?.length || 0} {t('votes', 'Votes')}
                         </div>
                      </div>

                      <div className="flex flex-col flex-grow">
                         <h3 className="text-xl font-black text-[#0B8A5A] group-hover:text-emerald-700 transition-colors mb-2 line-clamp-1">
                           {issue.type || issue.title || t('unknownIssue', 'Unknown Issue')}
                         </h3>
                         <p className="text-gray-500 font-medium text-[15px] leading-relaxed line-clamp-3 mb-5 text-justify">
                           {issue.description}
                         </p>
                      </div>

                      {/* Action Buttons (Bottom) */}
                      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center gap-2">
                         <button 
                           onClick={() => { setSelectedIssue(issue); setSelectedPriority(issue.priority); setShowSendModal(true); }}
                           className="flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 px-3 py-3 bg-blue-50/50 text-blue-700 rounded-xl hover:bg-blue-100 hover:text-blue-800 transition-all font-black text-[13px] active:scale-95 border border-transparent hover:border-blue-200"
                         >
                           <UserPlus className="w-3.5 h-3.5" /> {t('assign', 'Assign')}
                         </button>
                         <button 
                           onClick={() => handleReject(issue._id)}
                           className="flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 px-3 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all font-black text-[13px] active:scale-95"
                         >
                           <X className="w-3.5 h-3.5" /> {t('reject', 'Reject')}
                         </button>
                         <button 
                           onClick={() => handleApprove(issue._id)}
                           className="flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 px-3 py-3 bg-[#0B8A5A] text-white rounded-xl shadow-md shadow-emerald-200 hover:bg-[#076a44] transition-all font-black text-[13px] active:scale-95 border border-transparent"
                         >
                           <Check className="w-3.5 h-3.5" /> {t('approve', 'Approve')}
                         </button>
                         <button className="px-3 py-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl transition-all border border-gray-100 shadow-sm flex-shrink-0">
                           <MoreHorizontal className="w-4 h-4" />
                         </button>
                      </div>
                    </div>
                  ))
                );
              })()}
              </div>
                
              <div className="mt-8">
                <button className="w-full py-4 text-gray-500 font-bold text-sm bg-white/50 border border-dashed border-gray-300 rounded-2xl hover:bg-white hover:border-emerald-300 hover:text-emerald-600 transition-all">
                  {t('loadMore', 'Load More Issues')}
                </button>
              </div>
            </section>
          </div>

          {/* Gramsevak Resolved section has been moved to its own dedicated panel */}
            </>
          )}

          {activePanel === 'gramsevaks' && (
            <div className="animate-fade-in-up">
              <section className="bg-white/40 p-6 sm:p-8 rounded-[3rem] border border-white shadow-sm backdrop-blur-sm">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#0B1A2C] flex items-center gap-3">
                      <CheckCircle className="w-8 h-8 text-[#0B8A5A]" /> {t('gramsevakResolvedHead', 'Gramsevak Resolved')}
                    </h2>
                    <p className="text-sm font-medium text-gray-500 mt-2">{t('gramsevakResolvedDesc', 'Issues recently addressed and marked completed by assigned Gram Sevaks.')}</p>
                  </div>
                  
                  {/* Weekly Filter Tabs */}
                   <div className="flex bg-gray-100/80 p-1.5 rounded-2xl shadow-inner border border-gray-200 w-full xl:w-auto overflow-x-auto scrollbar-hide">
                      {[
                        { id: 'all', label: 'All Time' },
                        { id: 'this-month', label: 'This Month' },
                        { id: 'this-week', label: 'This Week' }
                      ].map(filter => (
                        <button
                          key={filter.id}
                          onClick={() => setResolvedFilter(filter.id)}
                          className={`px-6 py-2.5 rounded-xl text-[13px] font-black tracking-wide whitespace-nowrap transition-all ${resolvedFilter === filter.id ? 'bg-white text-[#0B8A5A] shadow-md border border-white' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50 border border-transparent'}`}
                        >
                          {filter.label}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {(() => {
                    // Apply filter locally
                    let filtered = [...gramsevakCompletedIssues];
                    const now = new Date();
                    
                    if (resolvedFilter === 'this-week') {
                      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                      filtered = filtered.filter(i => new Date(i.updatedAt || i.createdAt) >= oneWeekAgo);
                    } else if (resolvedFilter === 'this-month') {
                      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                      filtered = filtered.filter(i => new Date(i.updatedAt || i.createdAt) >= oneMonthAgo);
                    }
                    
                    filtered.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));

                    if (filtered.length === 0) {
                      return (
                         <div className="col-span-full text-center py-20 bg-white/50 rounded-[2rem] border-2 border-dashed border-gray-200">
                            <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-bold text-lg">No resolved activity available for this period</p>
                         </div>
                      );
                    }

                    return filtered.map((issue, idx) => (
                      <div key={idx} onClick={() => { setSelectedCompletedIssue(issue); setShowCompletedDetailModal(true); }} className="bg-white rounded-[2rem] p-6 sm:p-7 border-2 border-transparent hover:border-emerald-500/20 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group flex flex-col justify-between h-full relative overflow-hidden">
                        {/* Background Accent */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-50 to-transparent rounded-bl-[100px] -z-10 group-hover:scale-110 group-hover:from-emerald-100 transition-all duration-500"></div>

                        <div className="z-10">
                          <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:from-emerald-500 group-hover:to-green-500 group-hover:text-white transition-all shadow-sm border border-emerald-100 group-hover:border-emerald-500">
                              <CheckCircle className="w-7 h-7" />
                            </div>
                            <span className="text-[12px] font-black tracking-widest text-[#0B8A5A] bg-emerald-50/50 border border-emerald-100 px-4 py-2 flex items-center gap-2 rounded-xl shadow-sm backdrop-blur-sm group-hover:bg-emerald-100 transition-colors">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(issue.updatedAt || issue.createdAt).toLocaleDateString('en-GB')}
                            </span>
                          </div>

                          <div className="mb-6">
                            <h4 className="text-xl font-black text-[#0B1A2C] mb-3 line-clamp-1 group-hover:text-[#0B8A5A] transition-colors">{issue.type || issue.title || "Resolved Issue"}</h4>
                            <p className="text-[15px] text-gray-500 line-clamp-3 leading-relaxed font-medium text-justify">{issue.description}</p>
                          </div>
                        </div>

                        {/* Bottom Section */}
                        <div className="pt-5 mt-auto border-t border-gray-100 flex items-center justify-between z-10 group-hover:border-emerald-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-sm font-black text-[#0B1A2C] border-2 border-white shadow-sm">
                               {issue.assignedTo?.[0] || "G"}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-emerald-500/70 transition-colors">Gram Sevak</span>
                              <span className="text-[14px] font-black text-[#0B1A2C] leading-none mt-1">{issue.assignedTo?.split(' ')[0] || "Rajesh"}</span>
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-emerald-500 transition-colors shadow-sm border border-gray-100 group-hover:border-emerald-500">
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </section>
            </div>
          )}

          {activePanel === 'notices' && (
            <GramSabhaNoticePanel />
          )}

          {activePanel === 'reports' && (
            <VillageAdminReportsPanel issues={issues} gramsevakCompletedIssues={gramsevakCompletedIssues} />
          )}

          {activePanel === 'settings' && (
            <VillageAdminSettingsPanel adminName={currentUsername} adminPhone={currentMobile} />
          )}

        </main>
      </div>

      {/* Modals - Unchanged logic */}
      <SendToGramSevakModal
        open={showSendModal}
        onClose={() => setShowSendModal(false)}
        issue={selectedIssue}
        priority={selectedPriority}
        setPriority={setSelectedPriority}
        gramSevak={selectedGramSevak}
        setGramSevak={setSelectedGramSevak}
        onSend={handleAssign}
      />

      <GramSabhaNoticeModal
        open={showNoticeModal}
        onClose={() => setShowNoticeModal(false)}
      />

      <GramSabhaNoticeSlider
        open={showNoticeSlider}
        onClose={() => setShowNoticeSlider(false)}
      />

      <CompletedDetailModal
        open={showCompletedDetailModal}
        issue={selectedCompletedIssue}
        onClose={() => setShowCompletedDetailModal(false)}
      />

      <BottomNavbar />
    </div>
  );
};

export default VillageAdminDashboard;