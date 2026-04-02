import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { notifySuccess, notifyError } from '../components/NotificationToast';
import {
  MapPin, Calendar, ThumbsUp, MessageCircle, Share2,
  CheckCircle, Clock, AlertTriangle, ArrowLeft, Maximize2, X,
  ChevronRight, Activity, TrendingUp, Users, ExternalLink, ShieldCheck
} from 'lucide-react';
import BottomNavbar from '../components/BottomNavbar';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function IssueDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await api.get(`/issues/${id}`);
        setIssue(res.data.issue);
      } catch (err) {
        console.error('Issue fetch error:', err);
        notifyError(t('error.loadingIssues'));
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id, t]);

  const handleVote = async () => {
    if (voting) return;
    setVoting(true);
    try {
      const res = await api.post(`/issues/${id}/vote`);
      setIssue(res.data.issue);
      notifySuccess(t('success.voteRecorded') || 'Vote recorded successfully!');
    } catch (err) {
      notifyError(err.response?.data?.msg || t('error.somethingWentWrong'));
    } finally {
      setVoting(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/800x400?text=No+Image';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_URL}${cleanPath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F7F2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl animate-spin shadow-2xl shadow-emerald-500/20 flex items-center justify-center mb-6 mx-auto">
             <Activity className="text-white w-10 h-10" />
          </div>
          <h2 className="text-emerald-950 font-black tracking-widest uppercase text-xs animate-pulse">{t('pleaseWait')}</h2>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-[#F0F7F2] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl text-center max-w-md w-full border border-gray-100 animate-fadeInUp">
          <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-12 h-12 text-rose-500" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">{t('issueNotFound')}</h2>
          <p className="text-gray-500 mb-8 font-medium leading-relaxed">{t('goBackToSeeAllIssues')}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-center px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 mr-3" /> {t('backToDashboard')}
          </button>
        </div>
      </div>
    );
  }

  const isPending = issue.status === 'pending';
  const isResolved = issue.status === 'resolved';
  const isInProgress = issue.status === 'in-progress' || issue.status === 'In Progress';

  return (
    <div className="min-h-screen bg-light-50 selection:bg-emerald-500 selection:text-white">
      <Navbar />
      <div className="relative z-40">
        <Sidebar />
      </div>

      <div className="pt-20 md:ml-72 transition-all duration-500 pb-32 md:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
          
          {/* Navigation & Header */}
          <div className="flex items-center justify-between mb-2">
            <button 
              onClick={() => navigate(-1)}
              className="group flex items-center gap-3 px-5 py-2.5 bg-white rounded-2xl shadow-sm border border-emerald-50 hover:bg-emerald-600 hover:text-white transition-all duration-300 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold text-sm uppercase tracking-wider">{t('backToDashboard')}</span>
            </button>

            <div className="flex gap-2">
               <button className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-400 hover:text-emerald-600 transition-colors">
                 <Share2 className="w-5 h-5" />
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Details & Media */}
            <div className="lg:col-span-8 space-y-8 animate-fadeInUp">
              
              {/* Main Issue Card */}
              <div className="bg-white rounded-[3rem] shadow-xl shadow-emerald-900/5 border border-white overflow-hidden relative">
                
                {/* Status Hero Gradient */}
                <div className={`absolute top-0 left-0 right-0 h-48 opacity-10 
                  ${isResolved ? 'bg-emerald-500' : isInProgress ? 'bg-blue-500' : 'bg-orange-500'}`}>
                </div>

                <div className="relative z-10 p-8 sm:p-12">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-10">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm
                          ${isResolved ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            isInProgress ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-orange-50 text-orange-700 border-orange-200'}
                        `}>
                          {t(issue.status) || issue.status}
                        </span>
                        <span className="flex items-center gap-1.5 px-4 py-1.5 bg-gray-50 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100 shadow-sm">
                          <Calendar className="w-3.5 h-3.5" /> {new Date(issue.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h1 className="text-3xl sm:text-5xl font-black text-gray-900 leading-[1.1] tracking-tighter">
                         <span className="text-emerald-600">{t(`issueTypes.${issue.type}`) || issue.type}</span> {t('issues')}
                      </h1>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <div className="flex -space-x-4 mb-3">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="w-12 h-12 rounded-2xl border-4 border-white overflow-hidden shadow-lg transform hover:-translate-y-1 transition-all">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i+issue.votes?.length}`} alt="avatar" />
                          </div>
                        ))}
                        <div className="w-12 h-12 rounded-2xl border-4 border-white bg-emerald-500 flex items-center justify-center text-xs font-black text-white shadow-xl z-10">
                          +{issue.votes?.length || 0}
                        </div>
                      </div>
                      <span className="text-xs font-black text-emerald-950/40 uppercase tracking-[0.2em]">
                         {t('peopleAffected')}
                      </span>
                    </div>
                  </div>

                  <div className="bg-emerald-50/30 rounded-[2rem] p-6 sm:p-10 border border-emerald-100/30 mb-8 sm:mb-10">
                    <div className="flex items-start gap-4 mb-4">
                       <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
                       <h3 className="text-lg sm:text-xl font-black text-emerald-950 tracking-tight">{t('fullDescription')}</h3>
                    </div>
                    <p className="text-gray-600 text-sm sm:text-lg leading-relaxed font-medium">
                      {issue.description}
                    </p>
                  </div>

                  {/* Location Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-rose-50/50 p-6 rounded-[2rem] border border-rose-100/50 flex items-center gap-5 transition-transform hover:scale-[1.02] cursor-default">
                      <div className="w-14 h-14 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
                         <MapPin className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-rose-300 uppercase tracking-widest mb-1">{t('location')}</p>
                        <p className="text-sm font-black text-rose-950 tracking-tight">
                           {issue.location?.address || `${issue.location?.lat?.toFixed(4)}, ${issue.location?.lng?.toFixed(4)}`}
                        </p>
                      </div>
                    </div>

                    <button className="bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100/50 flex items-center gap-5 transition-all hover:bg-emerald-600 hover:text-white group">
                      <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-white group-hover:text-emerald-600 transition-colors shadow-sm">
                         <ExternalLink className="w-7 h-7" />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-black text-emerald-300 group-hover:text-white/70 uppercase tracking-widest mb-1">Navigation</p>
                        <p className="text-sm font-black text-emerald-950 group-hover:text-white tracking-tight">
                           {t('googleMaps')}
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Media Gallery Section */}
              {issue.images && issue.images.length > 0 && (
                <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-emerald-900/5 border border-white">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-gray-950 tracking-tight flex items-center gap-3">
                      <Maximize2 className="w-6 h-6 text-emerald-600" /> {t('issuePhotos')}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {issue.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative group rounded-[2rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all h-80 border border-gray-100 aspect-square sm:aspect-auto"
                        onClick={() => setSelectedImage(getImageUrl(img))}
                      >
                        <img
                          src={getImageUrl(img)}
                          alt={`Evidence ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8 p-4">
                           <span className="text-white bg-white/20 backdrop-blur-xl px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest border border-white/30 shadow-2xl">
                              {t('viewPhotoLarge')}
                           </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Actions & Timeline */}
            <div className="lg:col-span-4 space-y-8 sticky top-24">
              
              {/* Take Action Card */}
              <div className="bg-white rounded-[2.5rem] shadow-xl shadow-emerald-900/10 border border-white p-10 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-[60px] opacity-10 -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-500 rounded-full blur-[50px] opacity-10 translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-emerald-50/50">
                     <TrendingUp className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">{t('takeAction')}</h3>
                  <p className="text-sm font-medium text-gray-400 mb-10 leading-relaxed px-2">
                    {t('facingSameIssueVote')}
                  </p>

                  <button
                    onClick={handleVote}
                    disabled={voting}
                    className={`
                      w-full py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-wider flex items-center justify-center gap-4 transition-all duration-300 transform active:scale-95 shadow-2xl
                      ${voting
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                        : 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white hover:shadow-emerald-500/40 hover:-translate-y-1 group'}
                    `}
                  >
                    {voting ? (
                      <span className="animate-pulse">{t('submitting')}</span>
                    ) : (
                      <>
                        <ThumbsUp className="w-6 h-6 group-hover:rotate-[15deg] transition-transform" />
                        {t('imAlsoAffected')}
                      </>
                    )}
                  </button>

                  <div className="mt-8 flex items-center justify-center gap-2.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 py-3 rounded-2xl border border-emerald-100/50">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                    {t('voteMatters')}
                  </div>
                </div>
              </div>

              {/* Enhanced Status Tracker */}
              <div className="bg-white rounded-[2.5rem] shadow-xl shadow-emerald-900/5 border border-white p-10">
                <div className="flex items-center gap-3 mb-10">
                   <div className="p-3 bg-gray-50 rounded-2xl">
                      <Activity className="w-6 h-6 text-gray-900" />
                   </div>
                   <h3 className="text-2xl font-black text-gray-900 tracking-tight">{t('statusHistory')}</h3>
                </div>

                <div className="space-y-10 relative">
                  {/* Vertical Line */}
                  <div className="absolute left-[23px] top-2 bottom-2 w-1 bg-gradient-to-b from-emerald-500 via-gray-100 to-gray-100 rounded-full"></div>

                  {/* Stage 1: Reported */}
                  <div className="relative flex gap-6 group">
                    <div className="relative z-10 w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 shrink-0 ring-8 ring-white">
                       <CheckCircle className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col pt-1">
                       <p className="font-black text-gray-900 text-[15px]">{t('issueReported')}</p>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{new Date(issue.createdAt).toLocaleDateString()}</p>
                       <p className="text-xs font-medium text-emerald-600/80">Village administration notified.</p>
                    </div>
                  </div>

                  {/* Stage 2: In Progress */}
                  <div className="relative flex gap-6 group">
                    <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ring-8 ring-white transition-all
                      ${isInProgress ? 'bg-blue-500 text-white shadow-blue-500/20' : 'bg-gray-100 text-gray-400 shadow-none'}`}>
                       <Clock className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col pt-1">
                       <p className={`font-black text-[15px] ${isInProgress ? 'text-gray-900' : 'text-gray-400'}`}>{t('workInProgress')}</p>
                       {isInProgress ? (
                         <>
                           <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Active Stage</p>
                           <p className="text-xs font-medium text-blue-500/80">Authorities are currently addressing this.</p>
                         </>
                       ) : (
                         <p className="text-xs font-medium text-gray-300 italic">Waiting for assignment.</p>
                       )}
                    </div>
                  </div>

                  {/* Stage 3: Resolved */}
                  <div className="relative flex gap-6 group">
                    <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ring-8 ring-white transition-all
                      ${isResolved ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-gray-100 text-gray-400 shadow-none'}`}>
                       <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col pt-1">
                       <p className={`font-black text-[15px] ${isResolved ? 'text-gray-900' : 'text-gray-400'}`}>{t('resolved')}</p>
                       {isResolved ? (
                         <p className="text-xs font-medium text-green-500/80">Successfully completed! 🎉</p>
                       ) : (
                         <p className="text-xs font-medium text-gray-300 italic">Expected after verification.</p>
                       )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Premium Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-emerald-950/95 backdrop-blur-3xl animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500"></div>
          
          <button
            className="absolute top-10 right-10 text-white/50 hover:text-white transition-all bg-white/10 hover:bg-white/20 p-4 rounded-[1.5rem] active:scale-95 group"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" />
          </button>

          <div className="relative max-w-[95vw] max-h-[85vh] group/img" onClick={e => e.stopPropagation()}>
             <img
               src={selectedImage}
               alt="Fullscreen view"
               className="max-w-full max-h-full object-contain rounded-[2rem] shadow-2xl border-4 border-white/20"
             />
             <div className="absolute -bottom-16 left-0 right-0 text-center">
                <p className="text-white/60 font-black text-xs uppercase tracking-[0.5em]">{t('photo')}</p>
             </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .7; }
        }
      `}</style>
      {/* Bottom Navigation for Mobile */}
      <BottomNavbar />
    </div>
  );
}

export default IssueDetails;