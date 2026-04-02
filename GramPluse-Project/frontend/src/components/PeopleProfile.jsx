import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { notifySuccess, notifyError } from './NotificationToast';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import {
  Phone, MapPin, Calendar, Edit, MessageCircle, Award,
  Tractor, Sprout, Clock, Mail, CheckCircle, Save,
  X, User, Camera, Loader2, Briefcase, Star, Globe,
  Users, FileText, PlusCircle, Activity, Heart,
  ThumbsUp, MessageSquare, AlertTriangle, Settings, ArrowLeft,
  ChevronRight, Zap, Target, ShieldCheck, TrendingUp, Share2,
  Lock, LayoutGrid, Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BottomNavbar from './BottomNavbar';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const PeopleProfile = () => {
  const { t } = useTranslation();
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    village: '',
    bio: '',
    occupation: '',
    skills: [],
    avatar: '',
    age: '',
    languages: [],
  });
  const [submittedIssues, setSubmittedIssues] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        village: user.village || '',
        bio: user.bio || '',
        occupation: user.occupation || '',
        skills: user.skills || [],
        avatar: user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.name,
        age: user.age || '',
        languages: user.languages || []
      });
      calculateCompletion(user);
      fetchSubmittedIssues();
    }
  }, [user]);

  const calculateCompletion = (userData) => {
    const fields = ['name', 'email', 'phone', 'address', 'village', 'bio', 'occupation'];
    const filled = fields.filter(f => userData[f] && userData[f].trim() !== '').length;
    setProfileCompletion(Math.round((filled / fields.length) * 100));
  };

  const fetchSubmittedIssues = async () => {
    try {
      const res = await api.get('/issues/my-issues');
      setSubmittedIssues(res.data.issues || []);
    } catch (err) {
      console.error('Error fetching issues', err);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1595389134175-e83f20cc161d?w=400';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_URL}${cleanPath}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', formData);
      login(res.data.user);
      notifySuccess('Profile updated successfully!');
      setShowEditModal(false);
    } catch (err) {
      notifyError('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-50 font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="pt-20 md:ml-72 pb-32 md:pb-12 px-4 sm:px-6 lg:px-8 transition-all duration-500">
        <div className="max-w-7xl mx-auto py-6 space-y-8 animate-fade-in">
          
          {/* Header Profile Section - Android Style Card */}
          <section className="bg-brand-dark rounded-4xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                
                {/* Avatar with Ring */}
                <div className="relative group shrink-0">
                   <div className="w-40 h-40 rounded-[2.5rem] bg-white/10 backdrop-blur-xl border-4 border-white/20 p-2 shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-500">
                      <img src={formData.avatar} className="w-full h-full object-cover rounded-[2rem]" alt="profile" />
                   </div>
                   <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-emerald-500 px-4 py-1.5 rounded-xl shadow-xl border-4 border-brand-dark">
                      <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Verified Citizen</span>
                   </div>
                </div>

                {/* Identity Info */}
                <div className="flex-1 text-center md:text-left space-y-4">
                   <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                      <ShieldCheck className="w-3 h-3" /> Profile Status: Active
                   </div>
                   <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none drop-shadow-sm">
                      {formData.name || 'Citizen User'}
                   </h1>
                   <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <div className="flex items-center gap-2 text-white/60 font-medium">
                         <Mail className="w-4 h-4 text-emerald-400" /> {formData.email || 'N/A'}
                      </div>
                      <div className="flex items-center gap-2 text-white/60 font-medium">
                         <Phone className="w-4 h-4 text-emerald-400" /> {formData.phone || 'N/A'}
                      </div>
                   </div>
                   <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
                      <button 
                        onClick={() => setShowEditModal(true)}
                        className="px-8 py-3.5 bg-white text-brand-dark rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" /> Edit Profile
                      </button>
                      <button className="p-3.5 bg-white/10 rounded-2xl border border-white/10 text-white hover:bg-white/20 transition-all shadow-sm">
                        <Share2 className="w-5 h-5" />
                      </button>
                   </div>
                </div>

                {/* Completion Metric */}
                <div className="hidden xl:flex flex-col items-center gap-4 bg-white/5 p-8 rounded-4xl border border-white/10 backdrop-blur-md">
                   <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90">
                         <circle cx="48" cy="48" r="40" className="stroke-white/10 fill-none" strokeWidth="8" />
                         <circle cx="48" cy="48" r="40" className="stroke-emerald-400 fill-none transition-all duration-1000" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * profileCompletion) / 100} strokeLinecap="round" />
                      </svg>
                      <span className="absolute text-xl font-black">{profileCompletion}%</span>
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Completion</p>
                </div>
             </div>
          </section>

          {/* Tab Navigation */}
          <section className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
             {[
               { id: 'overview', label: 'Personal Details', icon: User },
               { id: 'issues', label: 'My Contributions', icon: LayoutGrid },
               { id: 'impact', label: 'Village Impact', icon: Zap }
             ].map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`px-6 py-3 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-3 ${
                   activeTab === tab.id ? 'bg-brand-dark text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'
                 }`}
               >
                 <tab.icon className="w-4 h-4" /> {tab.label}
               </button>
             ))}
          </section>

          {/* Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
             
             {/* Left Main Content */}
             <div className="lg:col-span-8 space-y-8 animate-fade-in-up">
                
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                     <div className="bg-white rounded-4xl p-10 border border-gray-100 shadow-sm leading-relaxed">
                        <div className="flex items-center gap-4 mb-8">
                           <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
                           <h3 className="text-2xl font-black text-dark-900 tracking-tight">Biography</h3>
                        </div>
                        <p className="text-lg text-gray-500 font-medium italic leading-relaxed">
                           "{formData.bio || "This citizen is a dedicated member of the village community, actively participating in identifying local challenges and suggesting improvements for a better tomorrow."}"
                        </p>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[
                          { label: "Occupation", value: formData.occupation || "Independent", icon: Briefcase, col: "bg-blue-50 text-blue-500" },
                          { label: "Locality", value: formData.village || "Main Sector", icon: MapPin, col: "bg-emerald-50 text-emerald-500" },
                          { label: "Member Since", value: "2024 (Beta)", icon: Calendar, col: "bg-purple-50 text-purple-500" },
                          { label: "Security Level", value: "Verified", icon: Lock, col: "bg-orange-50 text-orange-500" }
                        ].map((node, i) => (
                          <div key={i} className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm flex items-center gap-6 group hover:border-emerald-200 transition-all">
                             <div className={`p-4 rounded-2xl ${node.col} group-hover:scale-110 transition-transform shadow-sm`}>
                                <node.icon className="w-6 h-6" />
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{node.label}</p>
                                <p className="text-xl font-black text-dark-900 leading-none tracking-tight">{node.value}</p>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                )}

                {activeTab === 'issues' && (
                  <div className="space-y-6">
                     {submittedIssues.length === 0 ? (
                        <div className="bg-white rounded-4xl p-20 text-center border-2 border-dashed border-gray-100 animate-fade-in-up">
                           <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                              <PlusCircle className="w-12 h-12 text-gray-200" />
                           </div>
                           <h3 className="text-2xl font-black text-dark-900">No Reports Made</h3>
                           <p className="text-gray-400 font-medium mt-2 max-w-xs mx-auto">Identify issues in your neighborhood to help build a better Gram Panchayat.</p>
                           <button onClick={() => navigate('/submit')} className="mt-10 px-10 py-4 bg-brand-dark text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">
                              Start Reporting
                           </button>
                        </div>
                     ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                           {submittedIssues.map((issue) => (
                              <div 
                                 key={issue._id} 
                                 onClick={() => navigate(`/issue-details/${issue._id}`)}
                                 className="bg-white rounded-4xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all cursor-pointer group flex flex-col"
                              >
                                 <div className="aspect-[16/10] rounded-3xl overflow-hidden mb-6 relative">
                                    <img src={getImageUrl(issue.images?.[0])} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="issue" />
                                    <div className="absolute top-4 right-4">
                                       <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border backdrop-blur-md shadow-lg ${
                                          issue.status === 'pending' ? 'bg-orange-500/80 text-white border-orange-400' :
                                          issue.status === 'in-progress' ? 'bg-blue-500/80 text-white border-blue-400' :
                                          'bg-emerald-500/80 text-white border-emerald-400'
                                       }`}>
                                          {issue.status}
                                       </span>
                                    </div>
                                 </div>
                                 <h4 className="text-xl font-black text-dark-900 group-hover:text-emerald-600 transition-colors mb-4 line-clamp-1">
                                    {t(`issueTypes.${issue.type}`) || issue.type}
                                 </h4>
                                 <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4">
                                    <span className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                       <Calendar className="w-3 h-3" /> {new Date(issue.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-full">
                                       <ThumbsUp className="w-3.5 h-3.5" /> {issue.votes?.length || 0}
                                    </span>
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
                )}

                {activeTab === 'impact' && (
                  <div className="bg-white rounded-4xl p-10 border border-gray-100 shadow-sm text-center space-y-8 py-20">
                     <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border-8 border-emerald-100 animate-pulse-slow">
                        <Zap className="w-16 h-16 text-emerald-500" />
                     </div>
                     <h2 className="text-3xl font-black text-dark-900">Neighborhood Impact Hub</h2>
                     <p className="text-gray-500 max-w-sm mx-auto font-medium">Tracking the positive transformations fueled by your active participation in village governance.</p>
                     
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10">
                        <div className="space-y-2">
                           <p className="text-3xl font-black text-emerald-600">Level 4</p>
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Citizen Rank</p>
                        </div>
                        <div className="space-y-2">
                           <p className="text-3xl font-black text-blue-600">{submittedIssues.reduce((a,c) => a + (c.votes?.length||0), 0)}</p>
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Voter Support</p>
                        </div>
                        <div className="space-y-2">
                           <p className="text-3xl font-black text-amber-600">85%</p>
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Credibility Score</p>
                        </div>
                     </div>
                  </div>
                )}
             </div>

             {/* Right Column Stats */}
             <div className="lg:col-span-4 space-y-8 sticky top-24 animat-fade-in-up delay-300">
                
                {/* Modern Stat Widget */}
                <div className="bg-white p-10 rounded-4xl border border-gray-100 shadow-sm space-y-10">
                   <h3 className="text-2xl font-black text-dark-900 flex items-center gap-3 tracking-tighter">
                      <TrendingUp className="w-6 h-6 text-emerald-500" /> Key Insights
                   </h3>
                   <div className="space-y-6">
                      {[
                        { label: 'Issues Flagged', val: submittedIssues.length, icon: AlertTriangle, col: 'bg-amber-50 text-amber-500' },
                        { label: 'Network Support', val: submittedIssues.reduce((a,c) => a + (c.votes?.length||0), 0), icon: ThumbsUp, col: 'bg-emerald-50 text-emerald-500' },
                        { label: 'Active Reports', val: submittedIssues.filter(i=>i.status!=='resolved').length, icon: Activity, col: 'bg-blue-50 text-blue-500' }
                      ].map((met, i) => (
                        <div key={i} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-gray-50 border-dashed group hover:bg-white hover:shadow-lg transition-all cursor-default">
                           <div className="flex items-center gap-5">
                              <div className={`p-4 rounded-2xl ${met.col} group-hover:rotate-12 transition-transform`}>
                                 <met.icon size={22} className="stroke-[3]" />
                              </div>
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{met.label}</span>
                           </div>
                           <span className="text-3xl font-black text-dark-900 tabular-nums">{met.val}</span>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Village Info Node */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-4xl p-10 text-white relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl transition-transform duration-700 -translate-y-1/2 translate-x-1/2 group-hover:scale-150"></div>
                   <div className="relative z-10 flex flex-col items-center text-center py-4">
                      <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center mb-6">
                        <Globe className="w-8 h-8 text-emerald-100" />
                      </div>
                      <p className="text-[10px] font-black text-emerald-200 uppercase tracking-[0.4em] mb-4">Official Node</p>
                      <h4 className="text-4xl font-black tracking-tighter leading-none mb-8">{formData.village || "Rampur Node"}</h4>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-8">
                         <div className="w-2/3 h-full bg-emerald-400 shadow-glow rounded-full"></div>
                      </div>
                      <p className="text-[11px] font-black text-emerald-100/60 uppercase tracking-widest italic flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> Area Ward-03 Active
                      </p>
                   </div>
                </div>

                <div className="bg-white p-10 rounded-4xl border border-gray-100 shadow-sm">
                   <div className="flex items-center gap-4 text-emerald-600 mb-6 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                      <Info className="w-5 h-5 shrink-0" />
                      <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">Identity verification is fully encrypted and stored securely.</p>
                   </div>
                </div>

             </div>
          </div>
        </div>
      </main>

      {/* Modern Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-xl animate-fade-in">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-spring-up border border-white/20">
            
            <div className="p-8 sm:p-10 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
               <div>
                  <h2 className="text-3xl font-black text-dark-900 uppercase tracking-tighter">Modify Profile</h2>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Official Citizen Update</p>
               </div>
               <button onClick={() => !loading && setShowEditModal(false)} className="p-3.5 bg-white text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all shadow-sm">
                  <X className="w-6 h-6" />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 sm:p-14 custom-scrollbar">
              <form id="editProfileForm" onSubmit={handleSubmit} className="space-y-12">
                <div className="flex flex-col lg:flex-row gap-16 items-start">
                   
                   {/* Avatar Upload Container */}
                   <div className="flex flex-col items-center shrink-0 w-full lg:w-48 group">
                      <div className="relative group cursor-pointer mb-6 transform group-hover:scale-105 transition-all">
                        <div className="w-48 h-48 rounded-[3rem] overflow-hidden bg-gray-50 border-8 border-white shadow-2xl relative">
                           <img src={formData.avatar} className="w-full h-full object-cover rounded-[2 rem]" alt="avatar" />
                           <div className="absolute inset-0 bg-emerald-600/60 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Camera className="w-10 h-10 text-white animate-bounce-slow" />
                           </div>
                        </div>
                        <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageChange} />
                      </div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Tap to change avatar</p>
                   </div>

                   {/* Form Inputs Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 w-full">
                      {[
                        { lab: 'Full Official Name', name: 'name', type: 'text', icon: User },
                        { lab: 'Phone Number', name: 'phone', type: 'tel', icon: Phone },
                        { lab: 'Contact Email', name: 'email', type: 'email', icon: Mail },
                        { lab: 'Primary Occupation', name: 'occupation', type: 'text', icon: Briefcase },
                        { lab: 'Village Name', name: 'village', type: 'text', icon: MapPin },
                        { lab: 'Resident Address', name: 'address', type: 'text', icon: Home },
                      ].map((input, k) => (
                        <div key={k} className="space-y-2 group">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{input.lab}</label>
                           <div className="relative">
                              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors">
                                 <input.icon size={18} />
                              </div>
                              <input
                                {...input}
                                value={formData[input.name]}
                                onChange={handleChange}
                                className="w-full pl-14 pr-8 py-4.5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-100/50 outline-none transition-all font-bold text-dark-900 shadow-inner text-lg"
                                placeholder={`Enter ${input.lab.split(' ').pop()}`}
                              />
                           </div>
                        </div>
                      ))}
                      <div className="md:col-span-2 space-y-2 pt-4 group">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Identity Bio / Commitment</label>
                         <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-8 py-5 rounded-3xl bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-100/50 outline-none transition-all font-bold text-dark-900 shadow-inner resize-none text-lg"
                            placeholder="Share your focus for the village community..."
                         />
                      </div>
                   </div>
                </div>
              </form>
            </div>

            <div className="p-8 bg-gray-50/80 border-t border-gray-100 shrink-0 flex justify-end gap-6 items-center">
               <button 
                 type="button" 
                 onClick={() => setShowEditModal(false)} 
                 className="px-8 py-4 font-black text-gray-400 hover:text-dark-900 transition-colors uppercase tracking-widest text-[10px]"
               >
                  Cancel
               </button>
               <button 
                 form="editProfileForm" 
                 type="submit" 
                 disabled={loading} 
                 className="px-10 py-5 bg-brand-dark text-white rounded-[1.5rem] font-black shadow-2xl active:scale-95 transition-all text-xs uppercase tracking-[0.2em] flex items-center gap-3 disabled:opacity-50"
               >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Finalize Changes
               </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavbar />
    </div>
  );
};

export default PeopleProfile;