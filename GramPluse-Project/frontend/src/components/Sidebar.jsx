import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Home,
  PlusCircle,
  Shield,
  BarChart3,
  Building2,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  User,
  CloudSun,
  Thermometer,
  Calendar,
  AlertTriangle,
  GraduationCap
} from "lucide-react";

import { useAuth } from '../context/AuthContext';

function Sidebar({ isOpen, onClose }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  // Grouped Menu Items for better structure
  const menuGroups = [
    {
      title: t("overview") || "Overview",
      items: [
        { path: "/dashboard", icon: Home, label: t("dashboard"), color: "emerald" },
        { path: "/PeopleProfile", icon: User, label: t("myProfile") || "My Profile", color: "blue" },
        { path: "/submit", icon: PlusCircle, label: t("newIssue"), color: "amber" },
      ]
    },
    {
      title: t("administration") || "Administration",
      items: [
        { path: "/admin", icon: Shield, label: t("adminDashboard"), color: "purple" },
        { path: "/VillageAdminDashboard", icon: Building2, label: t("VillageAdminDashboard"), color: "indigo" },
      ]
    },
    {
      title: t("community") || "Community",
      items: [
        { path: "/public", icon: BarChart3, label: t("publicDashboard"), color: "orange" },
      ]
    }
  ];

  // Weather Widget with Glassmorphism
  const WeatherWidget = () => (
    <div className="mx-4 mb-6 relative group overflow-hidden rounded-[2rem] p-5 bg-white/5 border border-white/10 text-white shadow-xl transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
        <CloudSun className="w-12 h-12 text-white animate-pulse" />
      </div>
      <div className="flex flex-col relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{user?.location || "Village"}</span>
          <div className="w-1 h-1 rounded-full bg-emerald-400"></div>
          <span className="text-[10px] font-bold text-white">LIVE</span>
        </div>
        <div className="flex items-end gap-3">
          <span className="text-4xl font-black">28°</span>
          <div className="mb-1.5">
            <p className="text-xs font-bold text-white leading-none">Partly Sunny</p>
            <p className="text-[10px] text-white opacity-80">Humidity: 45%</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-[10px] font-black text-white/80 border-t border-white/10 pt-3">
          <span className="flex items-center gap-1.5 uppercase tracking-tighter"><Thermometer className="w-3 h-3 text-orange-300" /> High 32°</span>
          <span className="flex items-center gap-1.5 uppercase tracking-tighter"><Calendar className="w-3 h-3 text-blue-300" /> {new Date().toLocaleDateString(undefined, { weekday: 'long' })}</span>
        </div>
      </div>
    </div>
  );


  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-[1001] animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`
          fixed top-0 bottom-0 left-0 z-[1002] md:z-[1000]
          w-[290px]
         bg-[#0C7779] 
         text-white
          shadow-[30px_0_80px_-20px_rgba(0,0,0,0.3)]
          border-r border-white/5
          transform transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)
          flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          md:top-0 md:h-screen md:pt-24
        `}
      >

        <div className="relative flex-1 overflow-y-auto no-scrollbar py-8 flex flex-col h-full">

          <WeatherWidget />

          {/* Navigation Groups */}
          <nav className="flex-1 px-4 space-y-10">
            {menuGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="animate-slideIn" style={{ animationDelay: `${groupIdx * 100}ms` }}>
                <h3 className="px-5 mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/50">
                  {group.title}
                </h3>
                <div className="space-y-1.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setOpen(false)}
                        className={`
                          group relative flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-500
                          ${active
                            ? "bg-white/10 text-white shadow-lg backdrop-blur-md border border-white/10 scale-[1.02]"
                            : "text-white/90 hover:text-white hover:bg-white/5 hover:translate-x-1"
                          }
                        `}
                      >
                        {active && (
                          <div className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-1.5 bg-emerald-400 rounded-full animate-pulseScale shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                        )}
                        <div className={`
                          p-2 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6
                          ${active
                            ? `bg-emerald-500 text-white shadow-lg`
                            : "bg-emerald-900/50 text-white group-hover:bg-emerald-800"
                          }
                        `}>
                          <Icon className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <span className={`font-bold text-base tracking-tight ${active ? "opacity-100" : "opacity-90"}`}>{item.label}</span>

                        {active && (
                          <ChevronRight className="w-4 h-4 ml-auto text-white animate-slideX" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

          </nav>

          {/* User Profile Footer - Premium Glass */}
          <div className="p-4 mt-12 bg-black/20 relative">
            {showProfileMenu && user && (
              <div className="absolute bottom-full left-4 mb-4 w-[258px] bg-white border border-emerald-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2rem] overflow-hidden animate-springUp origin-bottom-left z-[1002]">
                <div className="p-4 space-y-1 bg-white">
                  <button onClick={() => { navigate('/PeopleProfile'); setShowProfileMenu(false); }} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-emerald-900 hover:bg-emerald-50 transition-all">
                    <User className="w-4 h-4 text-emerald-600" />
                    <p className="font-bold text-sm">{t('myProfile')}</p>
                  </button>
                  <button onClick={() => { navigate('/PeopleProfile'); setShowProfileMenu(false); }} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-emerald-900 hover:bg-emerald-50 transition-all">
                    <Settings className="w-4 h-4 text-emerald-600" />
                    <p className="font-bold text-sm">{t('settings')}</p>
                  </button>
                  <div className="h-px bg-gray-50 my-1 mx-4"></div>
                  <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all">
                    <LogOut className="w-4 h-4 text-red-500" />
                    <p className="font-bold text-sm">Sign Out</p>
                  </button>
                </div>
              </div>
            )}
            <div 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="bg-white/5 backdrop-blur-2xl rounded-3xl p-4 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all duration-500 shadow-sm hover:shadow-xl cursor-pointer"
            >
              <div className="flex items-center gap-3 flex-1 overflow-hidden">
                <div className="relative">
                  <img
                    src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Felix'}`}
                    alt="user"
                    className="w-12 h-12 rounded-2xl border-2 border-white/10 shadow-md object-cover transform transition-transform group-hover:scale-105"
                  />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-emerald-950 rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-white truncate">{user?.name || 'Guest User'}</p>
                  <p className="text-[10px] font-bold text-white uppercase tracking-widest">{user?.points || 0} XP</p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-white transition-transform duration-500 ${showProfileMenu ? 'rotate-180' : ''}`} />
            </div>
          </div>

        </div>
      </div >

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes progress {
          from { width: 0; }
        }
        @keyframes pulseScale {
          0%, 100% { transform: translateY(-50%) scaleY(1); }
          50% { transform: translateY(-50%) scaleY(1.3); opacity: 0.7; }
        }
        @keyframes slideX {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(8deg); }
          75% { transform: rotate(-8deg); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .animate-slideIn { animation: slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-progress { animation: progress 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-pulseScale { animation: pulseScale 2s ease-in-out infinite; }
        .animate-slideX { animation: slideX 1.5s ease-in-out infinite; }
        .animate-wiggle { animation: wiggle 0.4s ease-in-out infinite; }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}

export default Sidebar;