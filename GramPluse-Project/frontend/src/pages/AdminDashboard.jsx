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

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

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
          // Update: Server returns { gramsevak: { name, ... } }
          const userData = res.data.gramsevak || res.data.user || { name, username, village };
          onSuccess(userData);
        }
      } else {
        const res = await api.post("/auth/gramsevak/login", { username, password });
        if (res.data?.token || res.data?.success) {
          notifySuccess(t('success.loginSuccess'));
          // Update: Server returns { gramsevak: { name, ... } }
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
    <div className="fixed inset-0 z-50 flex overflow-hidden bg-white">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex w-1/2 bg-emerald-900 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599939571322-792a326991f2?q=80&w=1925&auto=format&fit=crop')] bg-cover bg-center opacity-20 filter mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 to-teal-900/90"></div>

        {/* Animated Shapes */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative z-10 text-center px-12">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl mx-auto mb-8 flex items-center justify-center border border-white/20 shadow-2xl">
            <Building2 className="w-12 h-12 text-emerald-300" />
          </div>
          <h1 className="text-5xl font-black text-white mb-6 font-display tracking-tight">Gram Sevak</h1>
          <p className="text-emerald-100 text-xl font-light leading-relaxed max-w-lg mx-auto">
            {t('villageVoice') || "The voice of administration for a better village."}
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative bg-gray-50/50">
        <button
          onClick={() => navigate('/dashboard')}
          className="absolute top-8 left-8 text-gray-400 hover:text-emerald-600 transition-colors flex items-center gap-2 font-medium"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>

        <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 animate-fadeIn">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600 rotate-3 transform hover:rotate-6 transition-all duration-300">
              {type === 'signup' ? <UserPlus className="w-8 h-8" /> : <LogIn className="w-8 h-8" />}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {type === 'signup' ? t('register') : t('login')}
            </h2>
            <p className="text-gray-500 text-sm">
              {type === 'signup' ? "Create a new Gram Sevak account" : "Welcome back, please login"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {type === 'signup' && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">{t('fullName')}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all font-medium"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">{t('villageName')}</label>
                  <input
                    type="text"
                    name="village"
                    value={formData.village}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all font-medium"
                    placeholder="Village Name"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">{t('username')}</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all font-medium"
                placeholder="Username"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">{t('password')}</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all font-medium"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-500/30 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (type === 'signup' ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />)}
                {loading ? t('loggingIn') : (type === 'signup' ? t('register') : t('login'))}
              </button>
            </div>
          </form>

          <div className="text-center pt-6">
            <p className="text-sm text-gray-500">
              {type === 'signup' ? t('haveAccount') : t('noAccount')} {' '}
              <button
                onClick={onSwitch}
                className="font-bold text-emerald-600 hover:underline"
              >
                {type === 'signup' ? t('login') : t('register')}
              </button>
            </p>
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
    <div className="min-h-screen bg-[#F0F4F2] font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
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

      <div className="pt-24 md:ml-80 transition-all duration-500 ease-in-out pb-24 md:pb-12 px-4 sm:px-10 lg:px-14 bg-gradient-to-br from-white via-[#F0F7F2] to-[#E8F1EC] min-h-screen relative overflow-hidden">
        
        {/* Decorative Background Elements */}
        <div className="fixed top-0 right-72 w-[500px] h-[500px] bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none z-0"></div>
        <div className="fixed bottom-0 left-72 w-[600px] h-[600px] bg-gradient-to-tr from-green-200/20 to-cyan-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none z-0"></div>
        {/* Header - Optimized for Gram Sevak Pro */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-white/40 backdrop-blur-xl p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl shadow-emerald-900/5 border border-white/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/10 transition-colors"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-emerald-100/50 rounded-lg border border-emerald-200">
                   <Shield className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span className="text-[9px] font-black text-emerald-800 uppercase tracking-[0.2em] font-display">{t('officialDashboard')} • {t('village')}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-2 leading-tight">
                {t('namaste')}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">{gramSevak.name || t('defaultGramsevak')}</span>
              </h1>
              <p className="text-gray-500 font-medium text-sm max-w-lg leading-relaxed opacity-80">
                {stats.inProgress} {t('tasksActiveToday')} {t('village')}.
              </p>
            </div>

            <div className="relative z-10 flex flex-col items-center sm:items-end gap-6">
              <div className="bg-white p-4 px-6 rounded-[1.5rem] shadow-xl shadow-emerald-900/5 border border-emerald-50 text-center sm:text-right">
                 <div className="flex items-center justify-center sm:justify-end gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-2xl font-black text-gray-900 tracking-tighter">75%</span>
                 </div>
                 <p className="text-[9px] font-black text-emerald-700 uppercase tracking-widest mb-3">{t('efficiency')}</p>
                 <div className="h-1.5 w-32 bg-emerald-50 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[75%] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.2)]"></div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
            {[
              { label: t('totalIssues'), value: stats.total, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: FileText },
              { label: t('inProgress'), value: stats.inProgress, color: 'text-blue-600', bg: 'bg-blue-50', icon: Clock },
              { label: t('completed'), value: stats.completed, color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
              { label: t('totalVotes'), value: stats.totalVotes, color: 'text-orange-600', bg: 'bg-orange-50', icon: Award },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100/50 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className={`${stat.bg} w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-500 font-medium text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-10">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('searchByIssue')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-none shadow-lg shadow-emerald-900/5 bg-white text-gray-700 outline-none ring-2 ring-transparent focus:ring-emerald-200 transition-all font-medium"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {['all', 'pending', 'completed', 'rejected'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {t(tab) || tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Issues List */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-8 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
              <h2 className="text-2xl font-black text-gray-900">{t('myIssues')}</h2>
              <span className="text-gray-400 font-bold text-lg">({displayedIssues.length})</span>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
              </div>
            ) : displayedIssues.length === 0 ? (
              <div className="text-center py-24 bg-white/50 rounded-3xl border-2 border-dashed border-emerald-100">
                <FileText className="w-16 h-16 text-emerald-200 mx-auto mb-4" />
                <p className="text-emerald-800 font-bold text-lg">{t('noIssues')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {displayedIssues.map((issue) => (
                  <div key={issue._id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-emerald-900/5 border border-emerald-50/50 flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-900/10 hover:-translate-y-2">
                    {/* Top Section - Glass Image Card */}
                    <div className="relative h-64 overflow-hidden">
                      {issue.images && issue.images.length > 0 ? (
                        <img src={issue.images[0]} alt="Issue" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-gray-300">
                          <Camera className="w-12 h-12 mb-2 opacity-50" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{t('noImage')}</span>
                        </div>
                      )}
                      
                      {/* Floating Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest backdrop-blur-xl border border-white/20 shadow-lg ${getPriorityColor(issue.priority)}`}>
                          {issue.priority}
                        </span>
                      </div>

                      <div className="absolute top-4 right-4">
                        <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest backdrop-blur-xl border border-white/20 shadow-lg ${getStatusColor(issue.status)}`}>
                          {issue.status}
                        </span>
                      </div>

                      {/* Bottom Image Overlay Details */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-emerald-400" /> {new Date(issue.createdAt).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1.5"><ThumbsUp className="w-3.5 h-3.5 text-blue-400" /> {issue.votes?.length || 0} Votes</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-7 flex-1 flex flex-col">
                      <h3 className="text-2xl font-black text-[#1E293B] mb-2 group-hover:text-emerald-700 transition-colors line-clamp-1 leading-tight tracking-tight">{issue.type}</h3>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6 line-clamp-3 opacity-90">
                        {issue.description}
                      </p>

                      {/* Status Selection Pill */}
                      <div className="bg-gray-50 rounded-3xl p-5 border border-gray-100 mb-6">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                           <Activity className="w-3 h-3" /> {t('updateTaskStatus')}
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'in-progress', label: 'Progress', color: 'bg-blue-600', icon: Clock },
                            { id: 'Completed', label: 'Done', color: 'bg-emerald-600', icon: CheckCircle },
                            { id: 'Issue', label: 'Reject', color: 'bg-rose-600', icon: AlertCircle }
                          ].map(mode => (
                            <button 
                              key={mode.id}
                              onClick={() => updateStatus(issue._id, mode.id)} 
                              className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl transition-all border ${
                                issue.status === mode.id 
                                ? `${mode.color} text-white shadow-lg border-transparent scale-105` 
                                : 'bg-white text-gray-500 border-gray-100 hover:border-emerald-200'
                              }`}
                            >
                              <mode.icon className={`w-4 h-4 ${issue.status === mode.id ? 'text-white' : 'text-gray-400'}`} />
                              <span className="text-[10px] font-black uppercase tracking-widest">{mode.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Utility Row */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <button onClick={() => { setSelectedIssue(issue); setShowCommentModal(true); }} className="flex items-center justify-center gap-2 py-3.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-[11px] uppercase tracking-wider rounded-2xl border border-indigo-200/50 transition-all">
                          <MessageSquare className="w-4 h-4" /> Notes ({issue.comments?.length || 0})
                        </button>
                        <label className="flex items-center justify-center gap-2 py-3.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-black text-[11px] uppercase tracking-wider rounded-2xl border border-amber-200/50 transition-all cursor-pointer">
                          <Upload className="w-4 h-4" /> {uploadingProof ? 'Up...' : 'Proof'}
                          <input type="file" multiple accept="image/*" onChange={(e) => handleProofFileChange(e, issue._id)} className="hidden" disabled={uploadingProof} />
                        </label>
                      </div>

                      {/* Evidence Strip */}
                      {issueProofUrls[issue._id] && issueProofUrls[issue._id].length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-2 border-b border-gray-100">
                          {issueProofUrls[issue._id].map((url, i) => (
                            <div key={i} className="relative group h-14 w-14 shrink-0 rounded-xl overflow-hidden shadow-sm border border-white">
                              <img src={url} alt="proof" className="w-full h-full object-cover" />
                              <button onClick={() => removeProofPhoto(issue._id, i)} className="absolute inset-0 bg-rose-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Updated Premium Action Button */}
                      <button 
                        onClick={() => handleSubmitUpdate(issue)}
                        className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-[0_8px_25px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_35px_rgba(16,185,129,0.4)] transition-all duration-500 hover:-translate-y-1 active:scale-95 group relative overflow-hidden"
                      >
                         <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                         <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
                            <Sparkles className="w-4 h-4 text-white" />
                         </div>
                         <span className="font-black text-xs uppercase tracking-[0.2em]">{t('saveAndUpdateTask')}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notes Modal */}
        {showCommentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white flex justify-between items-center">
                <h3 className="text-2xl font-black flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  Gram Sabha Notes
                </h3>
                <button onClick={() => setShowCommentModal(false)} className="hover:bg-white/20 p-2 rounded-full transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8">
                <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100">
                  <p className="font-bold text-gray-900 mb-1">{selectedIssue?.type}</p>
                  <p className="text-gray-600 text-sm line-clamp-2">{selectedIssue?.description}</p>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">Add New Note</p>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full h-32 bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all resize-none font-medium"
                    placeholder="Enter details discussed in Gram Sabha..."
                  ></textarea>
                </div>

                <div className="flex gap-4 mt-8">
                  <button onClick={() => setShowCommentModal(false)} className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all">Cancel</button>
                  <button onClick={addComment} disabled={!comment.trim()} className="flex-1 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50">Save Note</button>
                </div>
              </div>
            </div>
          </div>
        )}
        <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { animation: slideDown 0.2s ease-out forwards; }
      `}</style>
      </div>
    </div>
  );
};

export default GramSevakDashboard;
