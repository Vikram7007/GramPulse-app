import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  PlusCircle, 
  Search, 
  Bell, 
  User,
  Megaphone
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BottomNavbar = ({ onGramSabhaClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { icon: Home, label: t('dashboard'), path: '/dashboard' },
    { icon: Search, label: t('search'), path: '/public' },
    { icon: PlusCircle, label: t('submit'), path: '/submit', isAction: true },
    { icon: Megaphone, label: 'Notice', onClick: onGramSabhaClick },
    { icon: User, label: t('profile'), path: '/PeopleProfile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[1000] px-4 pb-4">
      <div className="bg-white/90 backdrop-blur-2xl border border-white/20 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] rounded-[2.5rem] h-20 flex items-center justify-around relative overflow-hidden">
        {/* Animated background highlights could be added here */}
        
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = item.path ? isActive(item.path) : false;

          return (
            <button
              key={index}
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                } else if (item.path) {
                  navigate(item.path);
                }
              }}
              className={`flex flex-col items-center justify-center transition-all duration-300 relative ${
                item.isAction ? '-translate-y-4' : ''
              }`}
            >
              {item.isAction ? (
                <div className="w-14 h-14 bg-gradient-to-br from-[#0C7779] to-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/40 border-4 border-white active:scale-90 transition-transform">
                  <Icon className="w-7 h-7" />
                </div>
              ) : (
                <>
                  <div className={`p-2 rounded-2xl transition-all duration-500 ${
                    active ? 'bg-emerald-50 text-[#0C7779]' : 'text-gray-400'
                  }`}>
                    <Icon className={`w-6 h-6 ${active ? 'scale-110' : ''}`} />
                  </div>
                  {active && (
                    <span className="absolute -bottom-1 w-1 h-1 bg-[#0C7779] rounded-full animate-pulse"></span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavbar;
