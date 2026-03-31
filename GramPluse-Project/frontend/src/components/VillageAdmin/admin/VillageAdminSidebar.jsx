import React, { useState } from "react";
import { Users, LayoutDashboard, FileText, BarChart3, Settings, Menu, X, LogOut, ChevronRight, CheckCircle2 } from "lucide-react";
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function VillageAdminSidebar({ activePanel, setActivePanel, adminName, adminPhone, isOpen, setOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('mainDashboard', 'मुख्य डॅशबोर्ड'), color: 'text-blue-400', bg: 'bg-blue-400/20' },
    { id: 'gramsevaks', icon: CheckCircle2, label: t('gramsevakResolved', 'Gramsevak Resolved'), color: 'text-emerald-400', bg: 'bg-emerald-400/20' },
    { id: 'notices', icon: FileText, label: t('gramSabhaNotices', 'ग्रामसभा नोटिसी'), color: 'text-amber-400', bg: 'bg-amber-400/20' },
    { id: 'reports', icon: BarChart3, label: t('reports', 'रिपोर्ट्स'), color: 'text-indigo-400', bg: 'bg-indigo-400/20' },
    { id: 'settings', icon: Settings, label: t('settings', 'Settings'), color: 'text-rose-400', bg: 'bg-rose-400/20' }
  ];

  const displayAdminName = adminName || user?.name || 'Village Admin';
  const displayAdminPhone = adminPhone || user?.mobile || '';

  return (
    <>
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-[#0B1A2C]/40 backdrop-blur-sm z-[1001]"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 bottom-0 left-0 z-[1002] md:z-[1000] w-[280px] bg-[#0C7779] text-white shadow-2xl border-r border-emerald-500/20 transform transition-transform duration-500 flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:top-0 md:h-screen md:pt-20`}
      >
        <div className="relative flex-1 overflow-y-auto py-8 px-4 flex flex-col h-full custom-scrollbar">
          
          <div className="mb-10 px-2 mt-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-4 ml-2">Administration</h3>
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePanel === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActivePanel(item.id); setOpen(false); }}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                      isActive ? `${item.bg} border border-white/10 shadow-lg ${item.color}` : "text-white hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {isActive && <div className={`absolute left-0 top-0 bottom-0 w-1 bg-current opacity-50 rounded-r-md`}></div>}
                    <div className={`p-2 rounded-xl transition-transform duration-300 group-hover:scale-110 ${
                      isActive ? "bg-white/10" : "bg-black/20 text-white/40"
                    }`}>
                      <Icon className={`w-5 h-5 ${isActive ? item.color : "text-white group-hover:" + item.color}`} />
                    </div>
                    <span className={`font-bold text-sm tracking-wide whitespace-nowrap ${isActive ? "" : "group-hover:text-white"}`}>{item.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Profile Area */}
          <div className="p-4 mt-auto">
             <div className="bg-black/20 backdrop-blur-md rounded-[1.5rem] p-4 border border-white/5 flex items-center justify-between group hover:bg-black/30 transition-all shadow-inner">
                <div className="flex items-center gap-3 overflow-hidden">
                 <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-black text-white shrink-0">
                   {displayAdminName.substring(0,2).toUpperCase()}
                 </div>
                 <div className="min-w-0 pr-2 block">
                   <p className="font-bold text-sm text-white truncate">{displayAdminName}</p>
                   {displayAdminPhone && (
                     <p className="text-[10px] text-white/50 font-bold tracking-wider mt-0.5">{displayAdminPhone}</p>
                   )}
                 </div>
               </div>
               <button onClick={() => { logout(); navigate('/'); }} className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all">
                 <LogOut className="w-4 h-4" />
               </button>
             </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VillageAdminSidebar;
