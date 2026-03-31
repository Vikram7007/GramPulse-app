import React, { useState, useEffect } from 'react';
import { Bell, Search, Globe, LogOut, User, Activity, Shield, Menu, X, Sparkles, LayoutGrid } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { notifySuccess, notifyError } from '../../components/NotificationToast';
import { io } from 'socket.io-client';
import api from '../../utils/api';

const GramSevakNavbar = ({ adminName, village, unreadCount = 0, onMenuClick }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const unreadCountReal = notifications.filter(n => !n.read).length;

  const marathiName = t('defaultGramsevak', { lng: 'mr' });

  // Fetch from DB
  const fetchNotifications = async () => {
    try {
      // Query with multiple possible names to be safe against translation shifts
      const res = await api.get('/issues/notifications', { 
        params: { 
          assignedTo: adminName,
          marathiName: marathiName 
        } 
      });
      if (res.data?.success) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.error('Fetch Notif Error:', err);
    }
  };

  useEffect(() => {
    if (!adminName) return;
    console.log("🔔 Notification Listener active for [", adminName, "] & Marathi [", marathiName, "]");
    fetchNotifications();

    const socket = io(import.meta.env.VITE_API_URL);

    // Join rooms for both names to ensure live arrival regardless of Sarpanch's language
    const roomEN = `gramsevak:${adminName.trim().toLowerCase()}`;
    const roomMR = `gramsevak:${marathiName.trim().toLowerCase()}`;
    
    console.log("🏠 Joining Socket Rooms:", roomEN, "and", roomMR);
    socket.emit('joinRoom', roomEN);
    socket.emit('joinRoom', roomMR);

    socket.on('newNotification', (newNotif) => {
       console.log("📩 New Live Notification Received:", newNotif);
       setNotifications(prev => [newNotif, ...prev]);
    });

    return () => socket.disconnect();
  }, [adminName, marathiName]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Important
    notifySuccess('Logged out successfully');
    navigate('/admin'); // Redirect back to itself (will show AuthModal) 
    window.location.reload();
  };

  const handleClearAll = async () => {
    try {
      await api.patch('/issues/notifications/read', { assignedTo: adminName });
      setNotifications(notifications.map(n => ({...n, read: true})));
    } catch (err) {
      notifyError("Couldn't sync notifications");
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      isScrolled ? 'h-16 bg-white/90 backdrop-blur-xl shadow-lg border-b border-emerald-100' : 'h-20 bg-[#0C7779] text-white border-b border-white/10'
    }`}>
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-600"></div>

      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* Brand & Badge */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all active:scale-95"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3">
               <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/20 hidden xs:flex">
                  <Shield className={`w-6 h-6 ${isScrolled ? 'text-emerald-600' : 'text-emerald-400'}`} />
               </div>
               <div className="block">
                  <h1 className={`text-lg sm:text-xl font-black tracking-tight ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                    Gram<span className="text-emerald-400">Pulse</span> <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Pro</span>
                  </h1>
                  <p className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-widest ${isScrolled ? 'text-emerald-600' : 'text-emerald-300'}`}>
                    Gram Sevak Dashboard
                  </p>
               </div>
            </div>
            
            <div className={`hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
              isScrolled ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-white/10 border-white/10 text-emerald-100'
            }`}>
              <Activity className="w-3 h-3 animate-pulse text-emerald-400" /> Live Duty • {village}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Search - Glass Look */}
            <div className="hidden md:flex relative group">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isScrolled ? 'text-gray-400' : 'text-emerald-300/50'}`} />
              <input 
                type="text" 
                placeholder="पॅनेलमध्ये शोधा..." 
                className={`pl-11 pr-4 py-2.5 rounded-xl text-sm font-medium outline-none transition-all w-64 ${
                  isScrolled ? 'bg-gray-100 focus:bg-white focus:ring-2 focus:ring-emerald-100 text-gray-700' : 'bg-white/10 border border-white/10 text-white placeholder-emerald-100/30'
                }`}
              />
            </div>

            {/* Language Selection */}
            <div className={`hidden sm:flex p-1 rounded-xl transition-all ${isScrolled ? 'bg-gray-100' : 'bg-white/10 border border-white/10'}`}>
              {['mr', 'hi', 'en'].map(lang => (
                <button
                  key={lang}
                  onClick={() => i18n.changeLanguage(lang)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                    i18n.language === lang 
                    ? 'bg-white text-emerald-900 shadow-sm scale-110' 
                    : isScrolled ? 'text-gray-400 hover:text-emerald-600' : 'text-emerald-100/50 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className={`relative p-2.5 rounded-xl transition-all ${isScrolled ? 'bg-gray-100 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600' : 'bg-white/10 text-emerald-100 hover:bg-white/20'}`}
              >
                <Bell className="w-6 h-6" />
                {unreadCountReal > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-bounce"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-[2rem] shadow-2xl border border-emerald-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                   <div className="p-5 border-b border-emerald-50 bg-emerald-50/50 flex items-center justify-between">
                      <div>
                        <h3 className="font-black text-gray-900 text-sm">{t('notifications')}</h3>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{unreadCountReal} New Updates</p>
                      </div>
                      <button 
                        onClick={handleClearAll}
                        className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest font-display"
                      >
                        Clear All
                      </button>
                   </div>

                   <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                     {notifications.length > 0 ? (
                       notifications.map((notif) => (
                         <button 
                           key={notif._id || notif.id}
                           onClick={() => setNotifications(notifications.map(n => (n._id === notif._id || (n.id && n.id === notif.id)) ? {...n, read: true} : n))}
                           className={`w-full p-4 flex gap-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${!notif.read ? 'bg-emerald-50/20' : ''}`}
                         >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              notif.type === 'urgent' ? 'bg-rose-100 text-rose-600' : 
                              notif.type === 'meeting' ? 'bg-blue-100 text-blue-600' :
                              'bg-emerald-100 text-emerald-600'
                            }`}>
                               {notif.type === 'urgent' ? <Shield className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                            </div>
                            <div className="flex-1">
                               <div className="flex items-center justify-between mb-0.5">
                                 <p className="font-black text-gray-900 text-xs">{notif.title}</p>
                                 <span className="text-[9px] font-bold text-gray-400">
                                   {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                 </span>
                               </div>
                               <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{notif.desc}</p>
                               {!notif.read && (
                                 <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2"></span>
                               )}
                            </div>
                         </button>
                       ))
                     ) : (
                       <div className="p-10 text-center">
                          <Bell className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                          <p className="text-xs font-bold text-gray-400">No new notifications</p>
                       </div>
                     )}
                   </div>

                   <div className="p-3 bg-gray-50 border-top border-gray-100 text-center">
                      <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-emerald-600 transition-colors">
                        View All Activity
                      </button>
                   </div>
                </div>
              )}
            </div>

            {/* User Profile Capsule */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className={`flex items-center gap-3 p-1.5 rounded-2xl border transition-all ${
                  isScrolled ? 'bg-white border-emerald-100 shadow-sm' : 'bg-white/10 border-white/20 hover:bg-white/20'
                }`}
              >
                <div className="w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-black text-sm shadow-inner">
                  {adminName?.[0] || 'G'}
                </div>
                <div className="hidden lg:block text-left mr-2">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isScrolled ? 'text-emerald-600' : 'text-emerald-300'}`}>Gram Sevak</p>
                  <p className={`text-xs font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>{adminName}</p>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-[2rem] shadow-2xl border border-emerald-50 p-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="p-4 bg-emerald-50 rounded-2xl mb-2 flex items-center gap-4">
                     <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 font-black text-lg shadow-sm border border-emerald-100">
                        {adminName?.[0]}
                     </div>
                     <div>
                        <p className="font-black text-gray-900 leading-tight">{adminName}</p>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{village}</p>
                     </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-emerald-50/50 border border-emerald-50 transition-all font-bold text-[10px] text-emerald-600 uppercase tracking-widest">
                      <Activity className="w-4 h-4 text-emerald-600" />
                      Listener: {adminName?.trim().toLowerCase()}
                    </div>
                    <div className="h-px bg-gray-100 my-2 mx-4"></div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm">
                      <LogOut className="w-4 h-4" /> Sign Out Securely
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default GramSevakNavbar;
