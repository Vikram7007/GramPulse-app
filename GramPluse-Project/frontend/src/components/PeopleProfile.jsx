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
  ChevronRight, Zap, Target, ShieldCheck, TrendingUp, Share2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const PeopleProfile = () => {
  const { t } = useTranslation();
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
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
    <div className="min-h-screen bg-[#F8FAFB] selection:bg-emerald-500 selection:text-white">
      <Navbar />
      <div className="relative z-40">
        <Sidebar />
      </div>

      <div className="pt-24 md:ml-72 transition-all duration-500 pb-20 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Professional Layout: 2-Column Split */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Hero & Content (8/12) */}
            <div className="xl:col-span-8 space-y-8">
              
              {/* Premium Hero Card */}
              <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-springUp relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                
                <div className="p-10 sm:p-14 flex flex-col md:flex-row gap-12 items-center">
                   
                   {/* Centered Avatar Case */}
                   <div className="relative shrink-0">
                      <div className="w-44 h-44 rounded-full border-[10px] border-emerald-50/50 shadow-2xl shadow-emerald-900/10 overflow-hidden ring-1 ring-white relative z-10">
                         <img src={formData.avatar} className="w-full h-full object-cover" alt="profile" />
                      </div>
                      <div className="absolute -bottom-2 right-4 z-20 bg-white p-2 rounded-2xl shadow-xl border border-slate-50 flex items-center gap-1.5 animate-bounce-slow">
                         <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                         <span className="text-[10px] font-black text-emerald-950 uppercase tracking-widest">Active</span>
                      </div>
                   </div>

                   {/* Identitiy Block */}
                   <div className="flex-1 text-center md:text-left space-y-6">
                      <div className="space-y-1">
                         <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight drop-shadow-sm">
                            {formData.name || 'Citizen Participant'}
                         </h1>
                         <p className="text-xl font-medium text-emerald-600 tracking-tight flex items-center justify-center md:justify-start gap-3">
                            <Mail className="w-5 h-5 opacity-70" /> {formData.email || 'No email provided'}
                         </p>
                         <p className="text-xl font-semibold text-slate-600 tracking-tight flex items-center justify-center md:justify-start gap-3 mt-1">
                            <Phone className="w-5 h-5 opacity-60" /> {formData.phone || 'Enter Phone Number'}
                         </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                         <span className="px-5 py-2.5 bg-slate-50 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-100 shadow-sm flex items-center gap-2">
                            <Briefcase className="w-4 h-4" /> {formData.occupation || "Neighbor"}
                         </span>
                         <span className="px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> {formData.village || "Unknown Village"}
                         </span>
                      </div>

                      <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
                         <button 
                            onClick={() => setShowEditModal(true)}
                            className="px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black tracking-widest uppercase text-xs hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center gap-3"
                         >
                            <Edit className="w-5 h-5" /> Edit Profile
                         </button>
                         <button className="p-5 bg-white text-slate-400 rounded-2xl border border-slate-100 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm">
                            <Share2 className="w-5 h-5" />
                         </button>
                      </div>
                   </div>
                </div>

                {/* Tabbed Divider */}
                <div className="px-10 flex gap-10 border-t border-slate-50 bg-slate-50/10">
                   {[
                      { id: 'overview', label: 'Identity & Bio', icon: User },
                      { id: 'issues', label: 'My Submissions', icon: FileText }
                   ].map(tab => (
                      <button
                         key={tab.id}
                         onClick={() => setActiveTab(tab.id)}
                         className={`py-8 font-black text-[11px] uppercase tracking-[0.25em] transition-all flex items-center gap-3 border-b-[3px] 
                            ${activeTab === tab.id ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-400 hover:text-slate-600'}
                         `}
                      >
                         <tab.icon size={18} />
                         {tab.label}
                      </button>
                   ))}
                </div>
              </div>

              {/* Main Dynamic Content Area */}
              <div className="animate-fadeInUp delay-200">
                 {activeTab === 'overview' && (
                    <div className="bg-white p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 leading-relaxed min-h-[400px]">
                       <div className="flex items-center gap-4 mb-10">
                          <div className="w-2 h-10 bg-emerald-500 rounded-full"></div>
                          <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Biography</h3>
                       </div>
                       <p className="text-2xl text-slate-500 font-medium italic mb-12 leading-relaxed">
                          "{formData.bio || "This citizen hasn't shared their story yet. Their contributions to the village speak louder than words."}"
                       </p>

                       <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Service Recognition</h3>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          <div className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex items-center gap-8 group hover:bg-emerald-50 transition-all hover:shadow-lg">
                             <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center text-emerald-600 shadow-md shadow-emerald-500/5 group-hover:scale-110 transition-transform">
                                <Award className="w-10 h-10" />
                             </div>
                             <div>
                                <p className="text-xl font-black text-slate-900">Community Anchor</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Village Achievement</p>
                             </div>
                          </div>
                          <div className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex items-center gap-8 group hover:bg-emerald-50 transition-all hover:shadow-lg">
                             <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center text-blue-600 shadow-md shadow-blue-500/5 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="w-10 h-10" />
                             </div>
                             <div>
                                <p className="text-xl font-black text-slate-900">Verified Reporter</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Identity Status</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 )}

                 {activeTab === 'issues' && (
                    <div className="space-y-6">
                       {submittedIssues.length === 0 ? (
                          <div className="bg-white py-24 px-12 rounded-[3.5rem] shadow-xl border border-slate-100 text-center animate-fadeInUp">
                             <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-10 ring-8 ring-emerald-50/50">
                                <PlusCircle className="w-12 h-12 text-emerald-300" />
                             </div>
                             <h4 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Voices of the Village</h4>
                             <p className="text-slate-400 max-w-sm mx-auto font-medium text-lg leading-relaxed mb-10">Start identifying and reporting issues in your neighborhood to help build a better Gram Panchayat.</p>
                             <button onClick={() => navigate('/submit')} className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all shadow-2xl active:scale-95">
                                Submit New Report
                             </button>
                          </div>
                       ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
                             {submittedIssues.map((issue) => (
                                <div 
                                   key={issue._id} 
                                   onClick={() => navigate(`/issue-details/${issue._id}`)}
                                   className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-lg hover:shadow-emerald-900/5 transition-all hover:-translate-y-2 cursor-pointer group"
                                >
                                   <div className="h-56 rounded-[2rem] overflow-hidden mb-8 relative border-4 border-slate-50 shadow-sm">
                                      <img 
                                         src={getImageUrl(issue.images?.[0])} 
                                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                                         alt="issue"
                                      />
                                      <div className="absolute top-5 right-5 group-hover:scale-110 transition-transform">
                                         <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.25em] border backdrop-blur-md shadow-2xl ${
                                            issue.status === 'pending' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' :
                                            issue.status === 'in-progress' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                                            'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                         }`}>
                                            {issue.status}
                                         </span>
                                      </div>
                                   </div>
                                   <div className="space-y-5">
                                      <h4 className="text-2xl font-black text-slate-950 group-hover:text-emerald-600 transition-colors tracking-tighter line-clamp-1">
                                         {t(`issueTypes.${issue.type}`) || issue.type}
                                      </h4>
                                      <div className="flex items-center justify-between">
                                         <span className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                            <Calendar size={14} /> {new Date(issue.createdAt).toLocaleDateString()}
                                         </span>
                                         <span className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-1.5 rounded-full">
                                            <ThumbsUp size={16} /> {issue.votes?.length || 0}
                                         </span>
                                      </div>
                                   </div>
                                </div>
                             ))}
                          </div>
                       )}
                    </div>
                 )}
              </div>
            </div>

            {/* Right Column: Statistics & Info (4/12) */}
            <div className="xl:col-span-4 space-y-8 sticky top-24 animate-fadeInUp delay-400">
               
               {/* Impact Scoring Card */}
               <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-[3rem] shadow-2xl p-12 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative z-10 flex flex-col items-center text-center">
                     <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center mb-8 backdrop-blur-sm border border-white/20">
                        <Target className="w-10 h-10 text-emerald-100" />
                     </div>
                     <p className="text-[11px] font-black text-emerald-200 uppercase tracking-[0.4em] mb-4">Official Impact Hub</p>
                     <h4 className="text-4xl font-black mb-10 leading-none tracking-tighter">Guard Rank II</h4>
                     
                     <div className="w-full space-y-4 mb-10">
                        <div className="flex justify-between text-[11px] font-black text-emerald-100 uppercase tracking-widest">
                           <span>Experience</span>
                           <span>45%</span>
                        </div>
                        <div className="h-4 w-full bg-emerald-950/20 rounded-full overflow-hidden border border-emerald-400/20 p-1">
                           <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full shadow-lg" style={{ width: '45%' }}></div>
                        </div>
                     </div>
                     <p className="text-xs font-bold text-emerald-100/60 uppercase tracking-widest italic">Neighborhood Sentinel Level</p>
                  </div>
               </div>

               {/* Metrics Breakdown */}
               <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-100 p-10 space-y-10">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
                     <Activity className="w-7 h-7 text-emerald-500" /> Contribution
                  </h3>
                  <div className="space-y-6">
                     {[
                        { label: 'Issues Flagged', val: submittedIssues.length, icon: AlertTriangle, col: 'orange' },
                        { label: 'Public Support', val: submittedIssues.reduce((a,c) => a + (c.votes?.length||0), 0), icon: ThumbsUp, col: 'emerald' },
                        { label: 'Success Rate', val: submittedIssues.filter(i=>i.status==='resolved').length, icon: Zap, col: 'blue' }
                     ].map((met, i) => (
                        <div key={i} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-50 group hover:bg-white hover:shadow-xl transition-all">
                           <div className="flex items-center gap-6">
                              <div className={`w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-${met.col}-500 shadow-sm border border-slate-50 group-hover:scale-110 transition-transform`}>
                                 <met.icon size={26} />
                              </div>
                              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{met.label}</span>
                           </div>
                           <span className={`text-3xl font-black text-${met.col}-600 tracking-tighter`}>{met.val}</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Contact Info Summary (UPDATED SIZE & COLOR) */}
               <div className="bg-white rounded-[3rem] shadow-2xl shadow-emerald-900/5 border border-slate-100 p-10">
                  <h3 className="text-2xl font-black text-slate-950 tracking-tighter mb-10">Direct Presence</h3>
                  <div className="space-y-8">
                     <div className="flex items-center gap-8 p-6 rounded-[2.5rem] bg-emerald-50/30 border border-emerald-50 hover:bg-emerald-50 transition-all group">
                        <div className="w-16 h-16 bg-white text-emerald-600 rounded-[1.5rem] flex items-center justify-center shadow-md border border-emerald-100 group-hover:scale-110 transition-transform shrink-0">
                           <Phone size={28} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-2 leading-none">Authenticated Phone</p>
                           <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{formData.phone || "7028617576"}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-8 p-6 rounded-[2.5rem] bg-indigo-50/30 border border-indigo-50 hover:bg-indigo-50 transition-all group">
                        <div className="w-16 h-16 bg-white text-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-md border border-indigo-100 group-hover:scale-110 transition-transform shrink-0">
                           <MapPin size={28} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2 leading-none">Locality Ward</p>
                           <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{formData.address || "Main Square"}</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal (Premium Polished) */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-lg flex items-center justify-center z-[2000] animate-fadeIn p-4 overflow-hidden">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] relative animate-springUp border border-white">
            
            <div className="px-10 py-10 border-b border-slate-50 flex items-center justify-between shrink-0">
               <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Modify Identity</h2>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1 opacity-70">Secured Information Node</p>
               </div>
               <button onClick={() => !loading && setShowEditModal(false)} className="p-4 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-[1.5rem] transition-all group">
                  <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 md:p-14 no-scrollbar">
              <form id="editProfileForm" onSubmit={handleSubmit} className="space-y-12">
                <div className="flex flex-col lg:flex-row gap-16 items-start">
                   <div className="flex flex-col items-center shrink-0 w-full lg:w-48">
                      <div className="relative group cursor-pointer mb-6 transition-transform hover:scale-105 active:scale-95">
                        <div className="w-48 h-48 rounded-[2.5rem] overflow-hidden bg-slate-50 border-8 border-white shadow-2xl ring-1 ring-slate-100">
                          <img src={formData.avatar} className="w-full h-full object-cover" alt="avatar" />
                        </div>
                        <div className="absolute inset-0 bg-emerald-600/80 rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
                          <Camera className="w-10 h-10 text-white animate-pulse" />
                        </div>
                        <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageChange} />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 flex-1 w-full">
                      {[
                        { lab: 'Full Name', name: 'name', type: 'text', placeholder: 'Enter Name' },
                        { lab: 'Phone Number', name: 'phone', type: 'tel', placeholder: '+91' },
                        { lab: 'Official Email', name: 'email', type: 'email', placeholder: 'Email Address' },
                        { lab: 'Occupation', name: 'occupation', type: 'text', placeholder: 'Public Sector / Farmer' },
                        { lab: 'Village Name', name: 'village', type: 'text', placeholder: 'Rampur' },
                        { lab: 'Home Address', name: 'address', type: 'text', placeholder: 'Ward Details' },
                      ].map((input, k) => (
                        <div key={k} className="space-y-3">
                           <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">{input.lab}</label>
                           <input
                              {...input}
                              value={formData[input.name]}
                              onChange={handleChange}
                              className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-100/50 outline-none transition-all font-bold tracking-tight text-slate-900 shadow-inner text-lg"
                           />
                        </div>
                      ))}
                      <div className="md:col-span-2 space-y-3 pt-4">
                         <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Identity Statement (Bio)</label>
                         <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-100/50 outline-none transition-all font-bold tracking-tight text-slate-900 shadow-inner resize-none text-lg"
                            placeholder="Briefly describe your community focus..."
                         />
                      </div>
                   </div>
                </div>
              </form>
            </div>

            <div className="px-10 py-10 bg-slate-50/50 border-t border-slate-50 shrink-0 flex justify-end gap-6 items-center">
               <button type="button" onClick={() => setShowEditModal(false)} className="px-10 py-5 rounded-[1.5rem] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest text-xs">
                  Discard Changes
               </button>
               <button form="editProfileForm" type="submit" disabled={loading} className="px-12 py-5 rounded-[1.5rem] font-black bg-slate-950 text-white hover:bg-emerald-600 shadow-2xl shadow-slate-900/10 active:scale-95 transition-all text-xs uppercase tracking-[0.2em] flex items-center gap-4 group">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                  Finalize Identity
               </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes springUp {
          from { opacity: 0; transform: scale(0.95) translateY(40px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-springUp {
          animation: springUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounceSlow 3s ease-in-out infinite;
        }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default PeopleProfile;