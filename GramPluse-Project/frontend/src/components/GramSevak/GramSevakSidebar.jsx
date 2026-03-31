import React from 'react';
import { 
  LayoutDashboard, 
  CheckCircle, 
  Clock, 
  Settings, 
  LogOut, 
  TrendingUp, 
  ShieldCheck, 
  Calendar,
  MessageSquare,
  AlertCircle,
  Activity,
  User,
  ArrowRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const GramSevakSidebar = ({ activeTab, onTabChange, adminName, village, isOpen, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/GramSevakDashboard');
    window.location.reload();
  };

  const navItems = [
    { id: 'all', icon: LayoutDashboard, label: t('allIssues'), sub: 'All Tasks', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 'pending', icon: Clock, label: t('pending'), sub: 'Pending', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 'completed', icon: CheckCircle, label: t('completed'), sub: 'Completed', color: 'text-teal-400', bg: 'bg-teal-500/10' },
    { id: 'rejected', icon: AlertCircle, label: t('rejected'), sub: 'Rejected', color: 'text-rose-400', bg: 'bg-rose-500/10' }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-[80] animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      <aside className={`fixed left-0 top-0 bottom-0 w-80 bg-[#0C7779] border-r border-white/5 z-[90] transition-transform duration-500 ease-in-out flex flex-col shadow-2xl overflow-hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        
        {/* Dynamic Background Glow */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

        {/* Top Profile Region */}
        <div className="pt-24 px-6 pb-8 relative z-10">
        <div className="relative group p-6 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden hover:bg-white/10 transition-all duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
               <div className="w-10 h-10 bg-white text-[#064E3B] rounded-xl flex items-center justify-center font-black text-lg shadow-lg">
                  {adminName?.[0]}
               </div>
            </div>
            <div>
              <h3 className="text-lg font-black text-white leading-tight mb-0.5">{adminName}</h3>
              <p className="text-emerald-300/60 text-[9px] font-black uppercase tracking-[0.2em]">{village} • {t('gramsevak')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar relative z-10">
        <div className="px-6 mb-6">
           <p className="text-[9px] font-black text-emerald-200/30 uppercase tracking-[0.4em]">{t('menu')}</p>
        </div>
        
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full group relative flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-500 transform active:scale-95 ${
              activeTab === item.id 
              ? 'bg-white text-[#064E3B] shadow-[0_10px_30px_rgba(255,255,255,0.1)] translate-x-2' 
              : 'text-emerald-100/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
              activeTab === item.id 
              ? 'bg-[#064E3B]/10 text-[#064E3B] rotate-6' 
              : `bg-white/10 text-emerald-300 group-hover:bg-white/20`
            }`}>
              <item.icon className="w-5 h-5 stroke-[2.5]" />
            </div>

            <div className="text-left flex-1">
              <p className={`text-sm font-black tracking-tight leading-none mb-1 ${activeTab === item.id ? 'text-[#064E3B]' : 'text-white'}`}>
                {item.label}
              </p>
              <p className={`text-[9px] font-bold uppercase tracking-widest leading-none ${activeTab === item.id ? 'text-[#064E3B]/60' : 'text-emerald-200/40'}`}>
                {item.sub}
              </p>
            </div>

            {activeTab === item.id && (
               <div className="w-1.5 h-1.5 rounded-full bg-[#064E3B] shadow-[0_0_10px_#064E3B] animate-pulse"></div>
            )}
          </button>
        ))}

        {/* Separator / Site Navigation */}
        <div className="px-6 mt-8 mb-4 border-t border-white/5 pt-8">
           <p className="text-[9px] font-black text-emerald-200/20 uppercase tracking-[0.4em]">{t('siteLinks') || 'Village Portal'}</p>
        </div>

        <button
          onClick={() => navigate('/public')}
          className="w-full group relative flex items-center gap-4 px-4 py-4 rounded-2xl text-emerald-100/60 hover:text-white hover:bg-white/5 transition-all duration-500"
        >
          <div className="w-11 h-11 rounded-xl bg-white/10 text-emerald-300 flex items-center justify-center group-hover:bg-white/20 transition-all">
            <LayoutDashboard className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="text-left flex-1">
             <p className="text-sm font-black tracking-tight leading-none mb-1 text-white">Village Dashboard</p>
             <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-200/40">गावविकास डॅशबोर्ड</p>
          </div>
          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
        </button>

        {/* Efficiency Card */}
        <div className="mt-12 px-6 pb-6">
           <div className="p-5 bg-white/5 rounded-3xl border border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700"></div>
              <div className="relative z-10">
                 <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-300" />
                      <span className="text-[10px] font-black text-emerald-100/60 uppercase tracking-widest">{t('efficiency') || 'Efficiency'}</span>
                   </div>
                   <span className="text-xs font-black text-white">75%</span>
                </div>
                <div className="h-1.5 bg-[#043327] rounded-full overflow-hidden mb-2">
                   <div className="h-full bg-emerald-400 w-[75%] rounded-full shadow-[0_0_10px_rgba(52,211,153,0.4)]"></div>
                </div>
              </div>
           </div>
        </div>
      </nav>

      {/* Signature & Sign Out */}
      <div className="p-6 relative z-10 bottom-0 mt-auto">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 text-emerald-100/60 hover:text-rose-400 transition-all duration-300 group font-black text-[10px] uppercase tracking-[0.2em]"
        >
          <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{t('logout')}</span>
        </button>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </aside>
    </>
  );
};

export default GramSevakSidebar;
