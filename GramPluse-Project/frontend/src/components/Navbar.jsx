import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { notifySuccess } from './NotificationToast';
import {
  Bell,
  Menu,
  X,
  ChevronDown,
  Settings,
  LogOut,
  User,
  Globe,
  Search,
  Sparkles,
  Megaphone,
  Check,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import api from '../utils/api';

function Navbar({ onGramSabhaClick, onSearch, onMenuClick }) {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  // Ref for clicking outside to close dropdowns
  const navRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const socket = useSocket();

  const unreadCount = notifications.filter(n => !n.read).length;

  const fetchNotifs = async () => {
    try {
      const res = await api.get('/issues/notifications?recipient=all');
      if (res.data.success && Array.isArray(res.data.notifications)) {
        const formatted = res.data.notifications.map(n => ({
          id: n._id,
          title: n.title,
          desc: n.desc,
          time: new Date(n.createdAt).toLocaleTimeString('hi-IN'),
          read: n.read || false,
          type: n.type || 'info'
        }));
        setNotifications(formatted);
      }
    } catch (err) {
      console.error("Notif Fetch Error:", err);
    }
  };

  const markAsRead = async () => {
    try {
      await api.patch('/issues/notifications/read', { recipient: 'all' });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      notifySuccess(t('allNotificationsMarkedAsRead') || 'All notifications marked as read');
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('newNotification', (newNotif) => {
        if (newNotif.recipient === 'all') {
          setNotifications(prev => [
            {
              id: newNotif._id,
              title: newNotif.title,
              desc: newNotif.desc,
              time: 'Just now',
              read: false,
              type: newNotif.type || 'info'
            },
            ...prev.slice(0, 19)
          ]);
          notifySuccess(newNotif.title);
        }
      });

      return () => { socket.off('newNotification'); };
    }
  }, [socket]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setShowLangMenu(false);
        setShowProfileMenu(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const changeLanguage = (lng, label) => {
    i18n.changeLanguage(lng);
    setShowLangMenu(false);
    notifySuccess(t('languageChanged', { label }));
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    notifySuccess(t('logoutSuccess'));
    navigate('/');
  };

  const languages = [
    { code: 'mr', label: t('marathi'), flag: '🇮🇳' },
    { code: 'hi', label: t('hindi'), flag: '🇮🇳' },
    { code: 'en', label: t('english'), flag: '🇬🇧' }
  ];

  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
   <nav
  ref={navRef}
  className={`fixed top-0 left-0 right-0 z-[1001] transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${isScrolled
    ? 'h-16 bg-[#0C7779] text-white shadow-md border-b border-emerald-100'
    : 'h-20 bg-[#0C7779] text-white shadow-sm border-b border-emerald-50'
    }`}
>
      {/* Top Accent Line with animation */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 overflow-hidden">
        <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
      </div>

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">

          {/* Left: Brand & Mobile Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (onMenuClick) {
                  onMenuClick();
                } else {
                  setMobileMenuOpen(!mobileMenuOpen);
                }
              }}
              className="md:hidden p-2 text-white hover:bg-white/20 rounded-xl transition-all active:scale-95"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate('/dashboard')}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 rounded-xl blur opacity-20 group-hover:opacity-60 transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl border border-white/20 shadow-lg group-hover:rotate-[10deg] group-hover:scale-110 transition-all duration-500 ease-out">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white logo-spin" />
                </div>
              </div>
              <div className="hidden sm:block overflow-hidden">
                <h1 className={`text-xl sm:text-2xl font-black text-white tracking-tighter leading-none transition-all duration-500 ${isScrolled ? 'translate-y-0 opacity-100' : ''}`}>
                  GramPulse
                </h1>
                <p className="text-[9px] font-bold text-white tracking-[0.2em] uppercase opacity-70 group-hover:opacity-100 transition-opacity">Village Connect</p>
              </div>
            </div>

          </div>

          {/* Center: Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full group">
              <div className="relative flex items-center bg-white/90 backdrop-blur-md border-none rounded-full px-5 py-2.5 focus-within:bg-white transition-all duration-300 shadow-sm hover:shadow-md ring-0 outline-none">
                <Search className="w-4 h-4 text-emerald-900 mr-3 group-focus-within:scale-110 transition-transform" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder') || "Search issues, services..."}
                  value={searchQuery}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearchQuery(val);
                    if (onSearch) onSearch(val);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setSearchQuery('');
                      if (onSearch) onSearch('');
                    }
                  }}
                  className="bg-transparent border-none outline-none text-black placeholder-gray-500 text-sm w-full font-medium"
                />
                <div className="hidden group-focus-within:flex items-center gap-1.5 ml-2">
                  <span className="text-[10px] bg-gray-100/80 text-gray-600 px-1.5 py-0.5 rounded border-none font-bold">ESC</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-4">

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2.5 rounded-xl transition-all group overflow-hidden ${showNotifications ? 'bg-emerald-600 text-white shadow-lg' : 'text-white hover:bg-white/20'
                  }`}
              >
                <Bell className={`w-5 h-5 sm:w-6 sm:h-6 ${showNotifications ? '' : 'group-hover:animate-shake'}`} />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#016B61] animate-pulse"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute top-full right-0 mt-4 w-80 sm:w-96 bg-white/98 backdrop-blur-2xl border border-emerald-100 shadow-2xl rounded-[2rem] overflow-hidden animate-springUp origin-top-right z-50">
                  <div className="p-6 border-b border-emerald-50 flex justify-between items-center bg-gradient-to-r from-emerald-50/50 to-white">
                    <div>
                      <h3 className="font-black text-emerald-950 text-lg">Activity</h3>
                      <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{unreadCount} New items</p>
                    </div>
                    <button
                      onClick={markAsRead}
                      className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-full transition-colors"
                      title="Mark all as read"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto no-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Bell className="w-8 h-8 text-emerald-200" />
                        </div>
                        <p className="text-gray-400 font-medium">All caught up!</p>
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} className={`p-5 hover:bg-emerald-50/30 transition-all cursor-pointer relative group ${!notif.read ? 'bg-emerald-50/20' : ''}`}>
                          {!notif.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>}
                          <div className="flex gap-4">
                            <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center shadow-inner ${
                              notif.type === 'success' ? 'bg-emerald-100/80 text-emerald-600' :
                              notif.type === 'meeting' ? 'bg-orange-100/80 text-orange-600 ring-4 ring-orange-500/10' :
                              'bg-blue-100/80 text-blue-600'
                            }`}>
                              {notif.type === 'success' ? <CheckCircle className="w-5 h-5" /> : 
                               notif.type === 'meeting' ? <Megaphone className="w-5 h-5 animate-wiggle" /> : 
                               <Info className="w-5 h-5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-black mb-1 group-hover:text-emerald-700 transition-colors ${
                                notif.type === 'meeting' ? 'text-orange-950' : 'text-emerald-950'
                              }`}>{notif.title}</p>
                              <p className="text-[11px] font-medium text-gray-500 leading-relaxed mb-2 line-clamp-2">{notif.desc}</p>
                              <div className="flex items-center gap-3">
                                <span className="text-[9px] font-black text-emerald-500/60 flex items-center gap-1 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md">
                                  <Clock className="w-2.5 h-2.5" /> {notif.time}
                                </span>
                                {notif.type === 'meeting' && (
                                  <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded-md animate-pulse">Important</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-4 bg-gray-50/50 text-center border-t border-emerald-50">
                    <button className="w-full py-2 bg-white border border-emerald-100 rounded-xl text-xs font-bold text-emerald-700 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all shadow-sm">
                      View Performance Analytics
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Gram Sabha Button (Premium Look) */}
            <button
              onClick={onGramSabhaClick}
              className="hidden lg:flex items-center gap-2.5 px-6 py-2.5 bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              {t('gramSabhaNotice')}
            </button>

            {/* Language Selector (Modern Grid) */}
            <div className="hidden sm:flex p-1 bg-emerald-50/20 rounded-[1.2rem] border border-emerald-100/20 shadow-sm">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => i18n.changeLanguage(lang.code)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-[10px] font-black transition-all duration-500 ${i18n.language === lang.code
                    ? 'bg-white text-emerald-600 shadow-md'
                    : 'text-white hover:bg-white/10'
                    }`}
                  title={lang.label}
                >
                  {lang.code.toUpperCase()}
                </button>
              ))}
            </div>

            {/* User Profile - Premium Capsule */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={`flex items-center gap-3 p-1 rounded-2xl transition-all duration-300 border ${showProfileMenu
                    ? 'bg-white border-emerald-500 shadow-xl'
                    : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30 shadow-sm'
                    }`}
                >
                  <div className="relative w-9 h-9 sm:w-10 sm:h-10">
                    <div className={`absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl transition-transform duration-500 ${showProfileMenu ? 'rotate-12' : ''}`}></div>
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                      alt="Profile"
                      className="relative w-full h-full rounded-xl object-cover border-2 border-white shadow-sm"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="hidden md:block pr-3 text-left">
                    <p className="text-xs font-black text-white leading-tight truncate max-w-[80px]">{user.name}</p>
                    <p className="text-[10px] font-bold text-white opacity-80 uppercase">Level 4 Citizen</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-white hidden sm:block transition-transform duration-500 ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-lg active:scale-95"
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </button>
              )}

              {/* Profile Dropdown (Modern Design) */}
              {showProfileMenu && user && (
                <div className="absolute top-full right-0 mt-4 w-72 bg-white border border-emerald-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden animate-springUp origin-top-right z-50">
                  <div className="relative p-8 text-center bg-gradient-to-br from-emerald-50 to-teal-50 overflow-hidden">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <div className="absolute inset-0 bg-emerald-500 rounded-3xl rotate-6 opacity-20"></div>
                      <img
                        src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                        alt="Profile"
                        className="relative w-full h-full rounded-3xl object-cover border-4 border-white shadow-xl"
                      />
                    </div>
                    <h3 className="text-xl font-black text-emerald-950 mb-1">{user.name}</h3>
                    <p className="text-sm font-medium text-emerald-600">{user.email || 'Village Citizen'}</p>
                    <div className="mt-4 flex justify-center gap-2">
                      <span className="px-3 py-1 bg-white rounded-full text-[10px] font-bold text-emerald-500 shadow-sm border border-emerald-50 uppercase tracking-tighter">Verified Member</span>
                    </div>
                  </div>
                  <div className="p-4 space-y-1 bg-white">
                    <button onClick={() => navigate('/PeopleProfile')} className="w-full flex items-center justify-between px-5 py-4 rounded-3xl text-emerald-900 hover:bg-emerald-50 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                          <User className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-sm">{t('myProfile')}</p>
                          <p className="text-[10px] text-gray-400">Edit contact details</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button onClick={() => navigate('/PeopleProfile')} className="w-full flex items-center justify-between px-5 py-4 rounded-3xl text-emerald-900 hover:bg-emerald-50 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                          <Settings className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-sm">{t('settings')}</p>
                          <p className="text-[10px] text-gray-400">App preferences</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <div className="h-px bg-gray-50 my-2 mx-6"></div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 rounded-3xl text-red-500 hover:bg-red-50 transition-all group">
                      <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center text-red-500 group-hover:rotate-12 transition-transform">
                        <LogOut className="w-5 h-5" />
                      </div>
                      <p className="font-bold text-sm">Sign Out Securely</p>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Menu (Full Screen Overlay) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-0 bg-[#016B61]/95 backdrop-blur-2xl z-40 animate-fadeIn h-screen pt-24 px-6">
          <div className="space-y-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full bg-white/10 border-none rounded-[2rem] py-5 pl-12 pr-6 text-white placeholder-white/40 outline-none ring-2 ring-white/10"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => { onGramSabhaClick(); setMobileMenuOpen(false); }}
                className="col-span-2 flex items-center justify-center gap-3 py-5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-[2rem] font-black shadow-xl"
              >
                <Megaphone className="w-6 h-6" />
                {t('gramSabhaNotice')}
              </button>

              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { i18n.changeLanguage(lang.code); setMobileMenuOpen(false); }}
                  className={`py-4 rounded-[1.5rem] font-bold border transition-all ${i18n.language === lang.code
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg'
                    : 'bg-white text-emerald-900 border-emerald-100 shadow-sm'
                    }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <div className="pt-8 border-t border-white/10">
              <p className="text-center text-[10px] font-black text-emerald-200 uppercase tracking-[0.4em]">GramPulse V2.0</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes springUp {
          0% { opacity: 0; transform: translateY(20px) scale(0.9); }
          70% { opacity: 1; transform: translateY(-5px) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-springUp {
          animation: springUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(10deg); }
          75% { transform: rotate(-10deg); }
        }
        .group-hover\:animate-shake {
           animation: shake 0.5s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
        .logo-spin {
          animation: spin-slow 12s linear infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-12deg); }
          75% { transform: rotate(12deg); }
        }
        .animate-wiggle {
          animation: wiggle 1s ease-in-out infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </nav>
  );
}

export default Navbar;