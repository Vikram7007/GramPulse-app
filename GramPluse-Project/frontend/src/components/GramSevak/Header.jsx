// src/components/GramSevak/Header.jsx
import React from 'react';
import { Bell, Sparkles, User, MapPin, Target } from 'lucide-react';

const Header = ({ gramSevak, notifications, showNotifications, setShowNotifications, newNotificationsCount }) => {
  return (
    <div className="bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 shadow-2xl sticky top-0 z-40 backdrop-blur-lg border-b-4 border-green-400">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-xl opacity-60 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-white to-green-50 p-4 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-110 hover:rotate-6">
                <User className="w-10 h-10 text-green-700" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                <h1 className="text-3xl font-black text-white tracking-tight">ग्रामसेवक डॅशबोर्ड</h1>
              </div>
              <div className="flex items-center gap-3 text-green-50">
                <div className="flex items-center gap-1.5 bg-white bg-opacity-20 px-3 py-1 rounded-full backdrop-blur-sm">
                  <User className="w-4 h-4" />
                  <span className="font-bold text-sm">{gramSevak.name}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white bg-opacity-20 px-3 py-1 rounded-full backdrop-blur-sm">
                  <MapPin className="w-4 h-4" />
                  <span className="font-semibold text-sm">{gramSevak.village}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white bg-opacity-20 px-3 py-1 rounded-full backdrop-blur-sm">
                  <Target className="w-4 h-4" />
                  <span className="font-semibold text-sm">{gramSevak.id}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setNotifications([]);
              }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white bg-opacity-20 hover:bg-opacity-30 p-4 rounded-2xl transition-all duration-300 transform hover:scale-110">
                <Bell className="w-7 h-7 text-white" />
                {newNotificationsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs font-black rounded-full w-7 h-7 flex items-center justify-center animate-bounce shadow-lg">
                    {newNotificationsCount}
                  </span>
                )}
              </div>
            </button>

            {showNotifications && notifications.length > 0 && (
              <div className="absolute right-0 mt-4 w-96 bg-white rounded-3xl shadow-2xl overflow-hidden animate-slideDown z-50 border-4 border-green-200">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                  <h3 className="text-white font-black text-lg flex items-center gap-2">
                    <Bell className="w-5 h-5 animate-wiggle" />
                    नवीन सूचना ({newNotificationsCount})
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto custom-scrollbar">
                  {notifications.map((notif, idx) => (
                    <div key={notif.id} className="px-6 py-4 border-b border-green-100 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 bg-green-50" style={{animation: `slideRight 0.5s ease-out ${idx * 0.1}s both`}}>
                      <div className="flex items-start gap-3">
                        <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-2 rounded-xl shadow-lg">
                          <AlertCircle className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-green-900 font-bold text-base mb-1">{notif.title}</p>
                          <p className="text-green-700 text-sm mb-2">{notif.preview}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full font-bold shadow-md">
                              {notif.priority}
                            </span>
                            <span className="text-green-600 font-semibold">{notif.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;