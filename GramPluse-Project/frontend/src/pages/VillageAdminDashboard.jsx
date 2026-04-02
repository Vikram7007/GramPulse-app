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

  return (
    <div className="fixed inset-0 z-[1000] bg-brand-dark flex flex-col font-sans overflow-y-auto hide-scrollbar">
      {/* Background Decor */}
      <div className="fixed top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="relative flex-1 flex flex-col items-center justify-center p-4 min-h-screen">
        <button 
          onClick={() => navigate('/')} 
          className="absolute top-6 left-6 flex items-center gap-2 text-white/50 hover:text-white transition-all font-bold text-xs bg-white/5 px-4 py-2 rounded-xl border border-white/5"
        >
          <ArrowLeft className="w-4 h-4" /> Exit
        </button>

        <div className="w-full max-w-sm">
          <div className="text-center mb-10 space-y-4">
             <div className="w-20 h-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl mx-auto flex items-center justify-center shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <Shield className="w-10 h-10 text-emerald-400 -rotate-3 hover:rotate-0 transition-transform duration-500" />
             </div>
             <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Sarpanch<span className="text-emerald-400">Hub</span></h1>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">Grievance Management System</p>
             </div>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-4xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <h2 className="text-xl font-black text-white mb-6">
              {view === 'login' ? 'Official Login' : 'Village Registration'}
            </h2>

            <form className="space-y-4" onSubmit={view === 'login' ? handleLogin : (e) => e.preventDefault()}>
              {view === 'login' ? (
                <>
                  <div className="space-y-4">
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
                      <input
                        type="text"
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:bg-white/10 focus:border-emerald-500/50 outline-none transition-all font-bold text-white placeholder-white/20 text-sm"
                        placeholder="Admin Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                      />
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
                      <input
                        type="password"
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:bg-white/10 focus:border-emerald-500/50 outline-none transition-all font-bold text-white placeholder-white/20 text-sm"
                        placeholder="Secret Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-950/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enter Dashboard'}
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <input type="text" placeholder="Full Admin Name" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none text-sm focus:border-emerald-500/50" value={signupName} onChange={e => setSignupName(e.target.value)} />
                  <input type="text" placeholder="Username" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none text-sm focus:border-emerald-500/50" value={signupUsername} onChange={e => setSignupUsername(e.target.value)} />
                  <input type="password" placeholder="Password" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none text-sm focus:border-emerald-500/50" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} />
                  <button type="button" onClick={handleSignup} className="w-full py-4 bg-emerald-500 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all">Register Admin</button>
                </div>
              )}
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              {view === 'login' ? (
                <p className="text-white/40 text-xs font-bold">
                  Restricted Access. <button onClick={() => setView('signup')} className="text-emerald-400 hover:underline">New Village?</button>
                </p>
              ) : (
                <button onClick={() => setView('login')} className="text-emerald-400 text-xs font-bold hover:underline flex items-center gap-2 mx-auto"><ArrowLeft className="w-4 h-4" /> Back to Login</button>
              )}
            </div>
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
    rejected: issues.filter(i => i.status === 'rejected' || i.status === 'Rejected' || i.status === 'Issue').length,
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
    <div className="min-h-screen bg-light-50 font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
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

      <div className="pt-20 md:ml-72 min-h-screen transition-all duration-300 relative pb-32 md:pb-12 px-4 sm:px-6">
        <main className="max-w-7xl mx-auto py-6 space-y-8 animate-fade-in">
          
          {activePanel === 'dashboard' && (
            <>
              {/* Premium Android-style Header */}
              <section className="bg-brand-dark rounded-4xl p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 space-y-4">
                  <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    <Shield className="w-3 h-3" /> Sarpanch Dashboard
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none">
                    Namaste, <span className="text-emerald-400 block sm:inline">{currentUsername}</span>
                  </h1>
                  <p className="text-white/50 text-sm font-medium max-w-lg leading-relaxed">
                    You have <span className="text-white font-black">{stats.active}</span> reports awaiting your attention today.
                  </p>
                  <div className="pt-2">
                    <button 
                      onClick={() => setShowNoticeModal(true)}
                      className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95"
                    >
                      <Bell className="w-4 h-4" /> Post Notice
                    </button>
                  </div>
                </div>
              </section>

              {/* Metrics Grid */}
              <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { label: "Reports", value: stats.total, icon: FileText, color: "text-blue-500", bg: "bg-blue-50/50" },
                  { label: "Solved", value: stats.completed, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50/50" },
                  { label: "Pending", value: stats.active, icon: Clock, color: "text-amber-500", bg: "bg-amber-50/50" },
                  { label: "Rejected", value: stats.rejected, icon: X, color: "text-rose-500", bg: "bg-rose-50/50" },
                  { label: "Critical", value: stats.highPriority, icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50/50" },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 flex flex-col items-center text-center group hover:border-emerald-200 transition-all cursor-default">
                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} mb-3 group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900">{stat.value}</h3>
                  </div>
                ))}
              </section>

              {/* Issues Section */}
              <section className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2">
                  <h2 className="text-xl font-black text-dark-900 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" /> Community Grievances
                  </h2>
                  <div className="flex gap-2 overflow-x-auto hide-scrollbar w-full sm:w-auto">
                    {userTabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-brand-dark text-white' : 'bg-gray-100 text-gray-400'}`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {loading ? (
                    <div className="col-span-full py-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-emerald-500" /></div>
                  ) : issues.filter(i => {
                    if (activeTab === 'pending') return i.status === 'pending';
                    if (activeTab === 'assigned') return i.status === 'in-progress';
                    if (activeTab === 'completed') return i.status === 'Completed' || i.status === 'approved';
                    if (activeTab === 'rejected') return i.status === 'Issue' || i.status === 'rejected' || i.status === 'Rejected';
                    return true;
                  }).length === 0 ? (
                    <div className="col-span-full bg-white rounded-4xl p-10 text-center border-2 border-dashed border-gray-100">
                      <p className="text-gray-400 font-bold">No reports in this category.</p>
                    </div>
                  ) : issues.filter(i => {
                    if (activeTab === 'pending') return i.status === 'pending';
                    if (activeTab === 'assigned') return i.status === 'in-progress';
                    if (activeTab === 'completed') return i.status === 'Completed' || i.status === 'approved';
                    if (activeTab === 'rejected') return i.status === 'Issue' || i.status === 'rejected' || i.status === 'Rejected';
                    return true;
                  }).map(issue => (
                    <div key={issue._id} className="mobile-card !p-4 flex flex-col group h-full">
                       <div className="relative aspect-[16/10] bg-gray-50 rounded-2xl overflow-hidden mb-4">
                          {issue.images?.[0] ? (
                            <img src={issue.images[0]} alt="issue" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-200"><FileText className="w-12 h-12" /></div>
                          )}
                          <div className="absolute top-2 left-2">
                             <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg ${issue.priority === 'high' ? 'bg-rose-500' : issue.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                                {issue.priority}
                             </span>
                          </div>
                       </div>
                       <div className="flex-1">
                          <h3 className="text-lg font-black text-dark-900 mb-2 truncate">{issue.title || issue.type}</h3>
                          <p className="text-sm text-gray-500 font-medium line-clamp-2 mb-4">{issue.description}</p>
                       </div>
                       <div className="pt-4 border-t border-gray-50 grid grid-cols-2 gap-2">
                          <button onClick={() => { setSelectedIssue(issue); setShowSendModal(true); }} className="py-2.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all">Assign</button>
                          <button onClick={() => handleApprove(issue._id)} className="py-2.5 bg-brand-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-800 transition-all">Approve</button>
                       </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {activePanel === 'gramsevaks' && (
            <div className="animate-fade-in space-y-6">
               <h2 className="text-2xl font-black text-dark-900">{t('gramsevakResolvedHead', 'Gramsevak Resolved')}</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {gramsevakCompletedIssues.map((issue, idx) => (
                    <div key={idx} onClick={() => { setSelectedCompletedIssue(issue); setShowCompletedDetailModal(true); }} className="mobile-card cursor-pointer group">
                       <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center"><CheckCircle className="w-6 h-6" /></div>
                          <span className="text-[10px] font-black text-gray-400">{new Date(issue.updatedAt).toLocaleDateString()}</span>
                       </div>
                       <h4 className="font-black text-dark-900 group-hover:text-brand-dark transition-colors">{issue.title || "Resolved Issue"}</h4>
                       <p className="text-xs text-gray-400 mt-2 line-clamp-2">{issue.description}</p>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activePanel === 'notices' && <GramSabhaNoticePanel />}
          {activePanel === 'reports' && <VillageAdminReportsPanel issues={issues} gramsevakCompletedIssues={gramsevakCompletedIssues} />}
          {activePanel === 'settings' && <VillageAdminSettingsPanel adminName={currentUsername} adminPhone={currentMobile} />}

        </main>
      </div>

      <SendToGramSevakModal open={showSendModal} onClose={() => setShowSendModal(false)} issue={selectedIssue} priority={selectedPriority} setPriority={setSelectedPriority} gramSevak={selectedGramSevak} setGramSevak={setSelectedGramSevak} onSend={handleAssign} />
      <GramSabhaNoticeModal open={showNoticeModal} onClose={() => setShowNoticeModal(false)} />
      <GramSabhaNoticeSlider open={showNoticeSlider} onClose={() => setShowNoticeSlider(false)} />
      <CompletedDetailModal open={showCompletedDetailModal} issue={selectedCompletedIssue} onClose={() => setShowCompletedDetailModal(false)} />

      <BottomNavbar />
    </div>
  );
};

export default VillageAdminDashboard;