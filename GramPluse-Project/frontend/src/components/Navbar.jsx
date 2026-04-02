import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { notifySuccess } from './NotificationToast';
import {
  Bell,
  Menu,
  ChevronDown,
  LogOut,
  User,
  Search,
  Sparkles,
  CheckCircle,
  Clock,
  ChevronRight,
  Info
} from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import api from '../utils/api';

function Navbar({ onGramSabhaClick, onSearch, onMenuClick }) {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

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

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    notifySuccess(t('logoutSuccess'));
    navigate('/');
  };

  const languages = [
    { code: 'mr', label: t('marathi') },
    { code: 'hi', label: t('hindi') },
    { code: 'en', label: t('english') }
  ];

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-[1001] transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
        isScrolled
        ? 'h-16 bg-brand-dark/95 backdrop-blur-xl text-white shadow-lg border-b border-white/10'
        : 'h-20 bg-brand-dark text-white'
      }`}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* Left: Menu Toggle & Brand */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={onMenuClick}
              className="p-2.5 hover:bg-white/10 rounded-2xl transition-all active:scale-90 md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div
              className={`flex items-center gap-2.5 cursor-pointer group transition-transform ${isScrolled ? 'scale-95' : ''}`}
              onClick={() => navigate('/dashboard')}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-400 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-emerald-400 to-teal-600 p-1.5 sm:p-2 rounded-xl shadow-lg group-hover:rotate-6 group-hover:scale-105 transition-all">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg sm:text-xl font-black tracking-tighter leading-none">GramPulse</h1>
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] opacity-60">Connected Village</span>
              </div>
            </div>
          </div>

          {/* Center: Search (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-emerald-400 transition-colors" />
              <input
                type="text"
                placeholder={t('searchPlaceholder') || "Quick search..."}
                value={searchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  if (onSearch) onSearch(val);
                }}
                className="w-full bg-white/10 border border-white/10 rounded-2xl pl-11 pr-4 py-2.5 text-sm outline-none focus:bg-white focus:text-gray-900 transition-all placeholder:text-white/40"
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Lang Dropdown (Icon only on mobile) */}
            <div className="flex bg-white/10 p-1 rounded-xl sm:rounded-2xl border border-white/5">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => i18n.changeLanguage(lang.code)}
                  className={`px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[10px] font-black transition-all ${
                    i18n.language === lang.code
                    ? 'bg-white text-brand-dark shadow-md'
                    : 'text-white/50 hover:text-white'
                  }`}
                >
                  {lang.code.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2.5 rounded-2xl transition-all relative ${
                  showNotifications ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'
                }`}
              >
                <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-brand-dark animate-pulse"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute top-full right-0 mt-4 w-[calc(100vw-2rem)] sm:w-96 bg-white text-gray-900 shadow-2xl rounded-3xl overflow-hidden animate-springUp origin-top-right z-50 border border-gray-100">
                  <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <div>
                      <h3 className="font-black text-sm">Notifications</h3>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{unreadCount} New</p>
                    </div>
                    <button onClick={markAsRead} className="p-2 text-gray-400 hover:text-emerald-500 transition-colors">
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto hide-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-10 text-center text-gray-400 italic text-sm">No new alerts</div>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-emerald-50/20' : ''}`}>
                          <div className="flex gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5"></div>
                            <div>
                              <p className="text-xs font-bold text-gray-900">{notif.title}</p>
                              <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{notif.desc}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={`flex items-center gap-2 p-1 rounded-2xl transition-all border ${
                    showProfileMenu ? 'bg-white/20 border-white/20 shadow-inner' : 'border-transparent'
                  }`}
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt="Profile"
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover border border-white/20 shadow-sm"
                  />
                  <ChevronDown className={`w-3.5 h-3.5 hidden sm:block transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <button
                  onClick={() => navigate('/')}
                  className="px-4 py-2 bg-white text-brand-dark rounded-xl font-bold text-[11px] uppercase tracking-wider hover:bg-emerald-50 active:scale-95 transition-all"
                >
                  Join
                </button>
              )}

              {showProfileMenu && user && (
                <div className="absolute top-full right-0 mt-4 w-64 bg-white text-gray-900 shadow-2xl rounded-3xl overflow-hidden animate-springUp origin-top-right z-50 border border-gray-100">
                  <div className="p-6 text-center bg-brand-dark/5">
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                      alt="Profile"
                      className="w-16 h-16 mx-auto rounded-3xl border-4 border-white shadow-lg mb-3"
                    />
                    <h3 className="font-black text-base leading-none">{user.name}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Village Citizen</p>
                  </div>
                  <div className="p-2">
                    <button onClick={() => navigate('/PeopleProfile')} className="w-full flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-gray-50 transition-all">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold">Profile Settings</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all mt-1">
                      <LogOut className="w-4 h-4" />
                      <span className="text-xs font-bold">Sign Out</span>
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
}

export default Navbar;
