import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Plus, 
  LayoutGrid, 
  MapPin, 
  User
} from 'lucide-react';

const BottomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: MapPin, label: 'Explore', path: '/public' },
    { icon: Plus, label: 'Report', path: '/submit', isAction: true },
    { icon: LayoutGrid, label: 'Services', path: '/admission' },
    { icon: User, label: 'Profile', path: '/PeopleProfile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[1000] px-4 pb-4 pointer-events-none">
      <div className="bg-brand-dark/95 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-4xl h-18 flex items-center justify-around relative overflow-visible pointer-events-auto">
        
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          if (item.isAction) {
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className="relative -translate-y-6 active:scale-95 transition-transform"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 border-4 border-brand-dark">
                  <Plus className="w-8 h-8 stroke-[3]" />
                </div>
              </button>
            );
          }

          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 transition-all flex-1 h-full ${
                active ? 'text-emerald-400' : 'text-white/40'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${active ? 'scale-110 stroke-[2.5]' : ''}`} />
              <span className={`text-[10px] font-bold ${active ? 'opacity-100' : 'opacity-0'}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavbar;
