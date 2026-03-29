import React, { useState, useEffect } from 'react';
import { X, Bell, Calendar, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../../../utils/api';

const GramSabhaNoticeSlider = ({ open, onClose }) => {
  const { t } = useTranslation();
  const [notices, setNotices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchNotices();
    }
  }, [open]);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/villageadmin/gramsabhanotices');
      if (res.data?.data && Array.isArray(res.data.data)) {
        setNotices(res.data.data);
      }
    } catch (err) {
      console.error('Fetch notices error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < notices.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[85vh] animate-in zoom-in slide-in-from-bottom-5 duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 sm:p-8 text-white relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-white/10">
                <Bell className="w-3 h-3 animate-bounce" /> Official Notice
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">{t('gramsabhaNotice', 'ग्रामसभा सूचना')}</h3>
              {notices.length > 0 && (
                <div className="flex items-center gap-2 mt-2 opacity-90 text-sm font-medium">
                  <span className="bg-white/20 px-2.5 py-1 rounded-lg text-xs font-bold">{currentIndex + 1} of {notices.length}</span>
                  <span className="w-1 h-1 rounded-full bg-white/40"></span>
                  <span>Use arrows to navigate</span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-2.5 rounded-full transition-all active:scale-90"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-10 overflow-y-auto custom-scrollbar flex-1 bg-gradient-to-b from-orange-50/50 to-white">
          {loading ? (
             <div className="h-48 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500"></div>
             </div>
          ) : notices.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400 font-bold">कोणतीही सूचना उपलब्ध नाही (No notices available)</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-orange-100 mb-8 min-h-[160px] flex flex-col justify-center">
                {notices[currentIndex].agenda && (
                  <h4 className="text-2xl font-black text-gray-900 mb-4 text-center">
                    {notices[currentIndex].agenda}
                  </h4>
                )}
                {notices[currentIndex].message && (
                  <p className="text-gray-600 leading-relaxed font-medium whitespace-pre-wrap text-lg text-center">
                    {notices[currentIndex].message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  { icon: Calendar, label: t('date', 'दिनांक'), val: new Date(notices[currentIndex].date).toLocaleDateString(), bg: "bg-orange-50", text: "text-orange-600" },
                  { icon: Clock, label: t('time', 'वेळ'), val: notices[currentIndex].time, bg: "bg-emerald-50", text: "text-emerald-600" },
                  { icon: MapPin, label: t('location', 'स्थळ'), val: notices[currentIndex].location, bg: "bg-blue-50", text: "text-blue-600" }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 ${item.bg} ${item.text} rounded-full flex items-center justify-center mb-3 shadow-inner`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</span>
                    <span className="font-bold text-gray-900 text-sm leading-tight">{item.val}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {notices.length > 1 && (
          <div className="p-6 border-t border-gray-100 bg-white shrink-0 flex justify-between items-center px-10">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="group flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-xs uppercase bg-gray-50 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> {t('previous', 'मागील')}
            </button>
            
            <div className="flex gap-2">
              {notices.map((_, i) => (
                <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-orange-500 w-8' : 'bg-gray-200 w-2'}`}></div>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={currentIndex === notices.length - 1}
              className="group flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-xs uppercase bg-gray-900 text-white hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {t('next', 'पुढील')} <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoom-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default GramSabhaNoticeSlider;
