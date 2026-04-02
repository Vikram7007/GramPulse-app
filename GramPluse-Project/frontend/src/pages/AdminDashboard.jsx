// src/pages/GramSevakDashboard.jsx
import React, { useState, useEffect } from 'react';
import api from "../utils/api";
import { notifyError, notifySuccess } from "../components/NotificationToast";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

import {
  Bell, CheckCircle, XCircle, Flag, ThumbsUp, MessageSquare, Upload, AlertCircle, Clock,
  Camera, FileText, User, TrendingUp, Award, MapPin, Calendar, Search, Filter, Zap,
  Activity, Target, Sparkles, ChevronRight, ArrowLeft, Loader2, LogIn, UserPlus, Building2,
  Menu, X, Shield
} from 'lucide-react';

import GramSevakNavbar from '../components/GramSevak/GramSevakNavbar';
import GramSevakSidebar from '../components/GramSevak/GramSevakSidebar';
import BottomNavbar from '../components/BottomNavbar';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// ==================== AUTH MODAL (Unified) ====================
// ==================== AUTH MODAL (Unified) ====================
const AuthModal = ({ type, onSuccess, onSwitch }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    village: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, username, password, village } = formData;

    if (type === 'signup') {
      if (!name || !username || !password || !village) {
        notifyError(t('error.fillFields'));
        return;
      }
    } else {
      if (!username || !password) {
        notifyError(t('error.fillFields'));
        return;
      }
    }

    setLoading(true);
    try {
      if (type === 'signup') {
        const res = await api.post("/auth/gramsevak/signup", { name, username, password, village });
        if (res.data?.success) {
          notifySuccess(t('success.signupSuccess'));
          const userData = res.data.gramsevak || res.data.user || { name, username, village };
          onSuccess(userData);
        }
      } else {
        const res = await api.post("/auth/gramsevak/login", { username, password });
        if (res.data?.token || res.data?.success) {
          notifySuccess(t('success.loginSuccess'));
          const userData = res.data.gramsevak || res.data.user || { name: res.data.name || username, username };
          onSuccess(userData);
        } else {
          notifyError(t('error.somethingWentWrong'));
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || t('error.somethingWentWrong');
      notifyError(msg);
    } finally {
      setLoading(false);
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
                <h1 className="text-3xl font-black text-white tracking-tight">Gram<span className="text-emerald-400">Sevak</span></h1>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">Administrative Gateway</p>
             </div>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-4xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <h2 className="text-xl font-black text-white mb-6">
              {type === 'signup' ? 'New Registration' : 'Official Portal'}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {type === 'signup' && (
                <>
                  <input type="text" name="name" placeholder="Full Admin Name" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none text-sm focus:border-emerald-500/50" value={formData.name} onChange={handleChange} />
                  <input type="text" name="village" placeholder="Village Jurisdiction" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none text-sm focus:border-emerald-500/50" value={formData.village} onChange={handleChange} />
                </>
              )}
              <input type="text" name="username" placeholder="Username" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none text-sm focus:border-emerald-500/50" value={formData.username} onChange={handleChange} />
              <input type="password" name="password" placeholder="Password" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none text-sm focus:border-emerald-500/50" value={formData.password} onChange={handleChange} />
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-950/20 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (type === 'signup' ? 'Register' : 'Enter Portal')}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-white/40 text-xs font-bold">
                {type === 'signup' ? 'Already an official?' : 'New administrator?'} <button onClick={onSwitch} className="text-emerald-400 hover:underline">{type === 'signup' ? 'Login' : 'Register'}</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// ==================== MAIN DASHBOARD ====================
const GramSevakDashboard = () => {
  const { t } = useTranslation();
  const { user, login } = useAuth();

  const [gramSevak, setGramSevak] = useState(user || {
    name: t('defaultGramsevak'),
    village: t('village'),
    id: 'GS001'
  });

  const isAuthenticated = !!user;
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comment, setComment] = useState('');
  const [issueProofUrls, setIssueProofUrls] = useState({});
  const [uploadingProof, setUploadingProof] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [weekFilter, setWeekFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  const [isAuthenticated_local, setIsAuthenticated_local] = useState(false); // temp local toggle if not using context yet
  const [authMode, setAuthMode] = useState('login'); 
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setGramSevak(user);
    }
  }, [user]);

  useEffect(() => {
    setCheckingAuth(false);
  }, []);

  const uploadToCloudinary = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'grampulse/proof');

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      throw err;
    }
  };

  const handleProofFileChange = async (e, issueId) => {
    const files = e.target.files;
    if (files.length === 0) return;

    setUploadingProof(true);
    const newUrls = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const url = await uploadToCloudinary(files[i]);
        newUrls.push(url);
      }
      setIssueProofUrls(prev => ({ ...prev, [issueId]: [...(prev[issueId] || []), ...newUrls] }));
      notifySuccess(`${newUrls.length} ${t('proof')} ${t('photos')} ${t('success.imageDownloadSuccess')}`);
    } catch (err) {
      notifyError(t('error.somethingWentWrong'));
    } finally {
      setUploadingProof(false);
      e.target.value = '';
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchAssignedIssues = async () => {
      setLoading(true);
      try {
        const res = await api.get('/issues/gramsevek');
        const fetchedIssues = res.data?.issues || [];
        setIssues(fetchedIssues.map(issue => ({ ...issue, statusChanged: false })));
        setFilteredIssues(fetchedIssues);

        if (fetchedIssues.length > 0) {
          setNotifications(fetchedIssues.slice(0, 5).map(issue => ({
            id: issue._id,
            title: issue.type,
            preview: issue.description?.substring(0, 35) + '...',
            priority: issue.priority,
            time: new Date(issue.createdAt).toLocaleTimeString('mr-IN', { hour: '2-digit', minute: '2-digit' })
          })));
        }
      } catch (err) {
        notifyError(t('error.loadingIssues'));
      } finally {
        setLoading(false);
      }
    };
    fetchAssignedIssues();
  }, [isAuthenticated]);

  useEffect(() => {
    let filtered = [...issues];

    if (searchQuery.trim()) {
      filtered = filtered.filter(issue =>
        issue.type?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const now = new Date();
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - now.getDay());
    startOfThisWeek.setHours(0, 0, 0, 0);

    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

    if (weekFilter === 'thisWeek') {
      filtered = filtered.filter(issue => new Date(issue.createdAt) >= startOfThisWeek);
    } else if (weekFilter === 'lastWeek') {
      filtered = filtered.filter(issue =>
        new Date(issue.createdAt) >= startOfLastWeek && new Date(issue.createdAt) < startOfThisWeek
      );
    }

    setFilteredIssues(filtered);
  }, [searchQuery, weekFilter, issues]);

  const handleSubmitUpdate = async (issue) => {
    if (!issue || !issue._id) { notifyError(t('error.fillFields')); return; }
    const hasComment = comment.trim().length > 0;
    const hasProof = issueProofUrls[issue._id] && issueProofUrls[issue._id].length > 0;
    const hasStatusChange = issue.statusChanged === true;

    if (!hasComment && !hasProof && !hasStatusChange) {
      notifyError(t('error.fillAllFields')); return;
    }

    const payload = {
      ...issue,
      status: hasStatusChange ? issue.status : (issue.status || 'in-progress'),
      comments: hasComment
        ? [...(issue.comments || []), {
          text: comment.trim(),
          date: new Date().toLocaleDateString('hi-IN'),
          time: new Date().toLocaleTimeString('hi-IN')
        }]
        : (issue.comments || []),
      proofPhotos: hasProof
        ? [...(issue.proofPhotos || []), ...issueProofUrls[issue._id]]
        : (issue.proofPhotos || []),
      originalIssueId: issue.originalIssueId || issue._id
    };

    try {
      const res = await api.patch(`/issues/gramsevek/${issue._id}/approval`, payload);
      await api.patch(`/issues/gramsevek/${payload.status}/${issue._id}`);

      setIssues(prev => prev.map(i =>
        i._id === issue._id
          ? { ...i, ...res.data.gramSevakIssue, statusChanged: false }
          : i
      ));
      notifySuccess(t('success.issueApproved'));
      setIssueProofUrls(prev => { const newState = { ...prev }; delete newState[issue._id]; return newState; });
      setComment('');
    } catch (err) {
      notifyError(err.response?.data?.message || t('error.somethingWentWrong'));
    }
  };

  const updateStatus = (issueId, newStatus) => {
    setIssues(prev => prev.map(issue =>
      issue._id === issueId ? { ...issue, status: newStatus, statusChanged: true } : issue
    ));
  };

  const addComment = () => {
    if (comment.trim() && selectedIssue) {
      const newComment = {
        text: comment.trim(),
        date: new Date().toLocaleDateString('hi-IN'),
        time: new Date().toLocaleTimeString('hi-IN')
      };
      setIssues(prev => prev.map(issue =>
        issue._id === selectedIssue._id
          ? { ...issue, comments: [...(issue.comments || []), newComment] }
          : issue
      ));
      setComment('');
      setShowCommentModal(false);
    }
  };

  const removeProofPhoto = (issueId, index) => {
    setIssueProofUrls(prev => ({
      ...prev, [issueId]: (prev[issueId] || []).filter((_, i) => i !== index)
    }));
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Issue': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const stats = {
    total: filteredIssues.length,
    inProgress: filteredIssues.filter(i => i.status === 'in-progress').length,
    completed: filteredIssues.filter(i => i.status === 'Completed').length,
    totalVotes: filteredIssues.reduce((sum, issue) => sum + (issue.votes?.length || 0), 0)
  };

  const displayedIssues = activeTab === 'all'
    ? filteredIssues
    : filteredIssues.filter(issue => {
      if (activeTab === 'pending') return issue.status === 'in-progress';
      if (activeTab === 'completed') return issue.status === 'Completed';
      if (activeTab === 'rejected') return issue.status === 'Issue';
      return true;
    });

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-light-50">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthModal
      type={authMode}
      onSuccess={(userData) => login(userData)}
      onSwitch={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
    />;
  }

  return (
    <div className="min-h-screen bg-light-50 font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      <GramSevakNavbar 
        adminName={gramSevak.name} 
        village={gramSevak.village} 
        onMenuClick={() => setIsSidebarOpen(true)}
      />
      <GramSevakSidebar 
        activeTab={activeTab} 
        onTabChange={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} 
        adminName={gramSevak.name} 
        village={gramSevak.village}
        stats={stats}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="pt-20 md:ml-80 transition-all duration-300 pb-32 md:pb-12 px-4 sm:px-6">
        <main className="max-w-7xl mx-auto py-6 space-y-8 animate-fade-in">
          
          {/* Global Header Card */}
          <section className="bg-brand-dark rounded-4xl p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                <Shield className="w-3 h-3" /> Official Portal
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none">
                Jai Hind, <span className="text-emerald-400 block sm:inline">{gramSevak.name}</span>
              </h1>
              <p className="text-white/50 text-sm font-medium max-w-lg leading-relaxed">
                Management portal for <span className="text-white font-black">{gramSevak.village}</span>. You have <span className="text-white font-black">{stats.inProgress}</span> active assignments.
              </p>
            </div>
          </section>

          {/* Stats Summary */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Assigned", value: stats.total, icon: FileText, color: "text-blue-500", bg: "bg-blue-50/50" },
              { label: "Progress", value: stats.inProgress, icon: Clock, color: "text-amber-500", bg: "bg-amber-50/50" },
              { label: "Closed", value: stats.completed, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50/50" },
              { label: "Impact", value: stats.totalVotes, icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-50/50" },
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

          {/* Filters & Search */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
               <div className="flex gap-2 overflow-x-auto hide-scrollbar w-full sm:w-auto pb-1">
                  {['all', 'pending', 'completed', 'rejected'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${activeTab === tab ? 'bg-brand-dark text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
               </div>
               <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search tasks..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  />
               </div>
            </div>

            {/* Displayed Issues */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full py-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-emerald-500" /></div>
              ) : displayedIssues.length === 0 ? (
                <div className="col-span-full bg-white rounded-4xl p-10 text-center border-2 border-dashed border-gray-100">
                  <p className="text-gray-400 font-bold">No tasks found in this category.</p>
                </div>
              ) : displayedIssues.map(issue => (
                <div key={issue._id} className="mobile-card !p-4 flex flex-col group h-full">
                   <div className="relative aspect-[16/10] bg-gray-50 rounded-2xl overflow-hidden mb-4">
                      {issue.images?.[0] ? (
                        <img src={issue.images[0]} alt="issue" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200"><FileText className="w-12 h-12" /></div>
                      )}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                         <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg ${issue.priority === 'high' ? 'bg-rose-500' : issue.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                            {issue.priority}
                         </span>
                         <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg bg-black/50 backdrop-blur-md`}>
                            {issue.status}
                         </span>
                      </div>
                   </div>
                   
                   <div className="flex-1 space-y-2">
                      <h3 className="text-lg font-black text-dark-900 truncate leading-tight">{issue.type}</h3>
                      <p className="text-sm text-gray-500 font-medium line-clamp-2 leading-relaxed">{issue.description}</p>
                   </div>

                   {/* Quick Status Update */}
                   <div className="mt-6 pt-4 border-t border-gray-50 space-y-4">
                      <div className="grid grid-cols-3 gap-1.5">
                         {[
                           { id: 'in-progress', label: 'WIP', color: 'bg-blue-500' },
                           { id: 'Completed', label: 'Done', color: 'bg-emerald-500' },
                           { id: 'Issue', label: 'Refuse', color: 'bg-rose-500' }
                         ].map(s => (
                           <button 
                             key={s.id} 
                             onClick={() => updateStatus(issue._id, s.id)}
                             className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${issue.status === s.id ? `${s.color} text-white border-transparent shadow-md` : 'bg-white text-gray-400 border-gray-100 hover:border-emerald-200'}`}
                           >
                             {s.label}
                           </button>
                         ))}
                      </div>

                      <div className="flex items-center gap-2">
                         <button onClick={() => { setSelectedIssue(issue); setShowCommentModal(true); }} className="flex-1 py-3 bg-gray-50 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-100 transition-all">
                            <MessageSquare className="w-3.5 h-3.5" /> Notes
                         </button>
                         <label className="flex-1 py-3 bg-gray-50 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-100 transition-all cursor-pointer">
                            <Upload className="w-3.5 h-3.5" /> Photo
                            <input type="file" multiple accept="image/*" onChange={(e) => handleProofFileChange(e, issue._id)} className="hidden" />
                         </label>
                      </div>

                      {issueProofUrls[issue._id]?.length > 0 && (
                         <div className="flex gap-2 overflow-x-auto py-1 hide-scrollbar">
                            {issueProofUrls[issue._id].map((url, i) => (
                              <div key={i} className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden border border-white shadow-sm">
                                <img src={url} alt="proof" className="w-full h-full object-cover" />
                                <button onClick={() => removeProofPhoto(issue._id, i)} className="absolute inset-0 bg-rose-500/80 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                              </div>
                            ))}
                         </div>
                      )}

                      <button 
                        onClick={() => handleSubmitUpdate(issue)}
                        className="w-full py-4 bg-emerald-500 hover:bg-brand-dark text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
                      >
                        Update Task
                      </button>
                   </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Notes Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-t-4xl sm:rounded-4xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in-up">
             <div className="p-6 bg-brand-dark text-white flex justify-between items-center">
                <h3 className="text-xl font-black">{t('addComment')}</h3>
                <button onClick={() => setShowCommentModal(false)}><X className="w-6 h-6" /></button>
             </div>
             <div className="p-6 space-y-4">
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Enter specific updates or field notes..."
                  className="w-full h-40 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-medium focus:bg-white outline-none transition-all resize-none"
                />
                <button 
                  onClick={addComment}
                  disabled={!comment.trim()}
                  className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 disabled:opacity-50"
                >
                  Save Note
                </button>
             </div>
          </div>
        </div>
      )}

      <BottomNavbar />
    </div>
  );
};


export default GramSevakDashboard;
