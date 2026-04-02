import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Home,
  PlusCircle,
  Shield,
  BarChart3,
  Building2,
  X,
  ChevronRight,
  Settings,
  LogOut,
  User,
  CloudSun,
  Thermometer,
  Calendar,
  Layers
} from "lucide-react";

import { useAuth } from '../context/AuthContext';

function Sidebar({ isOpen, onClose }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const menuGroups = [
    {
      title: "Navigation",
      items: [
        { path: "/dashboard", icon: Home, label: "Home Dashboard" },
        { path: "/PeopleProfile", icon: User, label: "My Profile" },
        { path: "/submit", icon: PlusCircle, label: "Report Issue" },
      ]
    },
    {
      title: "Administration",
      items: [
        { path: "/admin", icon: Shield, label: "Gramsevak Portal" },
        { path: "/VillageAdminDashboard", icon: Building2, label: "Sarpanch Portal" },
      ]
    },
    {
      title: "Community",
      items: [
        { path: "/public", icon: BarChart3, label: "Public Dashboard" },
        { path: "/admission", icon: Layers, label: "Village Services" },
      ]
    }
  ];

  const WeatherWidget = () => (
    <div className="mx-4 mb-6 rounded-3xl p-5 bg-white/5 border border-white/10 text-white shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <CloudSun className="w-16 h-16" />
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Village Weather</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-4xl font-black">28°</span>
          <div>
            <p className="text-xs font-bold leading-none">Sunny</p>
            <p className="text-[10px] opacity-60 mt-1">Clear Skies</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[1002] transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } md:hidden`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 bottom-0 left-0 z-[1003]
          w-[280px] bg-brand-dark text-white
          shadow-2xl border-r border-white/5
          transform transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
          flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          md:pt-24
        `}
      >
        {/* Header (Mobile only) */}
        <div className="flex items-center justify-between p-6 md:hidden">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-white/10 rounded-xl">
                <Shield className="w-5 h-5 text-emerald-400" />
             </div>
             <span className="font-black text-lg">Menu</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar py-2">
          <WeatherWidget />

          <nav className="px-4 space-y-6">
            {menuGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-2">
                <h3 className="px-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                  {group.title}
                </h3>
                <div className="grid gap-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={`
                          flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all
                          ${active 
                            ? "bg-white/10 text-white shadow-xl border border-white/10" 
                            : "opacity-70 hover:opacity-100 hover:bg-white/5"
                          }
                        `}
                      >
                        <Icon className={`w-5 h-5 ${active ? 'text-emerald-400' : ''}`} />
                        <span className="font-bold text-sm">{item.label}</span>
                        {active && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 bg-black/20 border-t border-white/5">
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="p-3 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-all"
          >
            <img 
              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} 
              className="w-10 h-10 rounded-xl border border-white/20"
              alt="User"
            />
            <div className="flex-1 min-w-0">
               <p className="text-sm font-black truncate">{user?.name || 'Guest Citizen'}</p>
               <p className="text-[10px] font-bold opacity-40 uppercase">Level 4</p>
            </div>
            <Link to="/" onClick={(e) => { e.stopPropagation(); logout(); navigate('/'); }} className="p-2 hover:bg-red-500/20 text-red-400 rounded-xl transition-all">
               <LogOut className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;