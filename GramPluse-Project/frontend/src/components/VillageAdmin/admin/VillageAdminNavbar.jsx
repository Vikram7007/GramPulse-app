import React, { useState, useEffect, useRef } from 'react';
import api from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search, Bell, CheckCircle, User, Settings, LogOut, ChevronDown, Building2, Megaphone, Menu
} from 'lucide-react';
import { notifySuccess } from '../../NotificationToast';
import { useSocket } from '../../../context/SocketContext';

const VillageAdminNavbar = ({ onGramSabhaClick, adminNameProp, onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navRef = useRef(null);
  const socket = useSocket();

  // Mock Notifications for Admin
  const [notifications, setNotifications] = useState([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await api.patch('/issues/notifications/read');
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
     const fetchNotifications = async () => {
       try {
         const res = await api.get('/issues/notifications');
         if (res.data?.success && Array.isArray(res.data.notifications)) {
            const mapped = res.data.notifications.map(n => ({
               id: n._id || Date.now(),
               title: n.title,
               desc: n.desc,
               time: new Date(n.createdAt || Date.now()).toLocaleTimeString('hi-IN'),
               read: n.read || false,
               type: n.type || 'info'
            }));
            setNotifications(mapped);
         }
       } catch (err) { 
         console.error("Notif Fetch Error:", err);
       }
     };

     fetchNotifications();

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setShowProfileMenu(false);
        setShowNotifications(false);
        setShowLangMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
 
  useEffect(() => {
    if (socket) {
       socket.emit('joinVillageAdmin');
       
       socket.on('gramsevakTaskUpdate', (data) => {
          if (data.status === 'Completed') {
             // Check if already exists by some unique ID if possible, else just let it be
             setNotifications(prev => {
                if (prev.find(n => n.issueId === data.id)) return prev;
                const newNotif = {
                  id: Date.now(),
                  issueId: data.id,
                  title: 'समस्या सुटली (Issue Resolved)',
                  desc: `ग्रामसेवक ${data.assignedTo} यांनी "${data.title}" चे काम पूर्ण केले आहे.`,
                  time: 'Just now',
                  read: false,
                  type: 'success'
                };
                return [newNotif, ...prev.slice(0, 19)];
             });
             notifySuccess(`काम पूर्ण झाले: ${data.title}`);
          }
       });
       
       return () => {
          socket.off('gramsevakTaskUpdate');
       };
    }
  }, [socket]);

  const handleLogout = () => {
    logout();
    navigate('/');
    notifySuccess('Logged out successfully');
  };

  const languages = [
    { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { code: 'en', label: 'English', flag: '🇬🇧' }
  ];

  const adminName = adminNameProp || user?.name || user?.mobile || 'Village Admin';
  const adminRole = 'Village Admin'; // Hardcoded for this specific navbar

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-[1001] transition-all duration-700 bg-[#0B1E1C] text-white ${
        isScrolled ? 'h-16 shadow-lg border-b border-white/10' : 'h-20 shadow-sm'
      }`}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 overflow-hidden">
        <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
      </div>

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all active:scale-95"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="relative group cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="absolute inset-0 bg-white/20 rounded-xl blur group-hover:bg-white/40 transition-all duration-500"></div>
              <div className="relative bg-[#0B4A3A] p-2 sm:p-2.5 rounded-xl border border-emerald-400/30 shadow-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-100" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none">
                {t('adminPanel', 'Admin Panel')}
              </h1>
              <p className="text-[9px] sm:text-[10px] font-bold text-emerald-200 tracking-widest uppercase">
                GramPulse • {user?.village || t('villageAdmin', 'Village Admin')}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full group">
              <div className="absolute -inset-1 bg-emerald-900/20 rounded-full blur-md opacity-0 group-focus-within:opacity-100 transition-all duration-500"></div>
              <div className="relative flex items-center bg-emerald-900/40 backdrop-blur-md rounded-full px-5 py-2 hover:bg-emerald-900/60 focus-within:bg-emerald-900/80 transition-all border border-emerald-700/50">
                <Search className="w-4 h-4 text-emerald-300 mr-3" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder', 'Search citizens, issues, reports...')}
                  className="bg-transparent border-none outline-none text-emerald-50 placeholder-emerald-400/70 text-sm w-full font-medium"
                />
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            <button
              onClick={onGramSabhaClick}
              className="hidden md:flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-orange-500 to-rose-600 text-white rounded-[1rem] font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-900/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>{t('gramSabhaNotice')}</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2.5 rounded-xl transition-all ${
                  showNotifications ? 'bg-emerald-900 text-emerald-100' : 'text-emerald-50 hover:bg-emerald-800'
                }`}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0B8A5A] animate-pulse"></span>}
              </button>
              
              {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-4 w-96 bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 to-teal-50/50">
                      <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                        <Bell className="w-5 h-5 text-emerald-600" />
                        अॅडमिन अलर्ट्स
                      </h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAsRead}
                          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full transition-all active:scale-95"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-[min(480px,70vh)] overflow-y-auto custom-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                            <Megaphone className="w-8 h-8 text-gray-300" />
                          </div>
                          <p className="text-gray-400 font-medium">नवीन अलर्ट नाहीत</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-50">
                          {notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-5 transition-all duration-300 hover:bg-emerald-50/30 group cursor-default ${!notif.read ? 'bg-emerald-50/10' : ''}`}
                            >
                              <div className="flex gap-4">
                                <div className={`mt-1 h-11 w-11 shrink-0 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                                  notif.type === 'alert' ? 'bg-amber-100 text-amber-600' :
                                  notif.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                                  'bg-blue-100 text-blue-600'
                                }`}>
                                  {notif.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <p className={`text-sm font-bold truncate ${notif.read ? 'text-gray-500' : 'text-gray-900'}`}>
                                      {notif.title}
                                    </p>
                                    {!notif.read && <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0 animate-pulse" />}
                                  </div>
                                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-2">
                                    {notif.desc}
                                  </p>
                                  <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1.5 uppercase tracking-wider">
                                    <div className="w-1 h-1 rounded-full bg-gray-300" />
                                    {notif.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-gray-50/50 border-t border-gray-100 text-center">
                      <button className="text-xs font-bold text-gray-500 hover:text-emerald-600 transition-colors">
                        View all history
                      </button>
                    </div>
                  </div>
                )}
            </div>

            {/* Language Selection - Premium Switcher */}
            <div className="hidden sm:flex p-1.5 bg-emerald-950/20 backdrop-blur-md rounded-2xl border border-white/10 shadow-inner">
              {['mr', 'hi', 'en'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => i18n.changeLanguage(lang)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl text-[11px] font-black transition-all duration-300 relative group overflow-hidden ${
                    i18n.language === lang
                      ? 'bg-white text-emerald-800 shadow-lg scale-105 z-10'
                      : 'text-emerald-100/70 hover:text-white hover:bg-white/10'
                  }`}
                  title={lang.toUpperCase()}
                >
                  <span className="relative z-10">{lang.toUpperCase()}</span>
                  {/* Subtle highlight for active state */}
                  {i18n.language === lang && (
                     <div className="absolute inset-0 bg-gradient-to-br from-white via-emerald-50 to-white opacity-20 animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Admin Profile Dropdown */}
            <div className="relative ml-2">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`flex items-center gap-3 p-1 rounded-full sm:rounded-[1.5rem] transition-all duration-300 border backdrop-blur-md ${
                  showProfileMenu ? 'bg-emerald-900/80 border-emerald-400' : 'bg-emerald-900/40 border-emerald-700/50 hover:bg-emerald-900/60'
                }`}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full sm:rounded-2xl flex items-center justify-center border-2 border-white overflow-hidden p-0.5">
                   <div className="w-full h-full bg-[#0B4A3A] rounded-full sm:rounded-xl flex items-center justify-center text-white font-black text-sm">
                     {adminName.substring(0, 2).toUpperCase()}
                   </div>
                </div>
                <div className="hidden md:flex flex-col pr-4 text-left">
                  <span className="text-xs font-black text-white leading-tight">{adminName}</span>
                  <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest">{adminRole}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-emerald-200 mr-2 hidden sm:block" />
              </button>

              {showProfileMenu && (
                <div className="absolute top-full right-0 mt-4 w-72 bg-white border border-gray-100 shadow-2xl rounded-[2rem] overflow-hidden z-50 animate-fade-in-up origin-top-right">
                  <div className="p-6 bg-gradient-to-br from-emerald-50 to-white border-b border-gray-50 flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#0B4A3A] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-900/20 shadow-inner">
                      {adminName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-black text-[#0B1A2C] text-lg leading-tight">{adminName}</h3>
                      <p className="text-xs font-bold text-[#0B8A5A] flex items-center gap-1 mt-1">
                        <CheckCircle className="w-3 h-3" /> {t('villageAdmin', 'Village Admin')}
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-white">
                     <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left text-sm font-bold text-gray-700 group">
                       <div className="bg-gray-100 p-2 rounded-lg text-gray-500 group-hover:text-[#0B8A5A] transition-colors"><User className="w-4 h-4" /></div>
                       Profile Overview
                     </button>
                     <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left text-sm font-bold text-gray-700 group">
                       <div className="bg-gray-100 p-2 rounded-lg text-gray-500 group-hover:text-[#0B8A5A] transition-colors"><Settings className="w-4 h-4" /></div>
                       Admin Settings
                     </button>
                     <div className="h-px bg-gray-100 my-2 mx-2"></div>
                     <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-rose-50 transition-colors text-left text-sm font-bold text-rose-600 group">
                       <div className="bg-rose-100 p-2 rounded-lg text-rose-500 group-hover:scale-110 transition-transform"><LogOut className="w-4 h-4" /></div>
                       Secure Logout
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

export default VillageAdminNavbar;
