import React, { useState } from 'react';
import { Calendar, Clock, MapPin, AlignLeft, Send, CheckCircle } from 'lucide-react';
import api from '../../../utils/api';
import { notifySuccess, notifyError } from '../../../components/NotificationToast';

const GramSabhaNoticePanel = () => {
  const [noticeData, setNoticeData] = useState({
    date: '',
    time: '',
    location: 'Gram Panchayat Office',
    agenda: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setNoticeData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!noticeData.date || !noticeData.time || !noticeData.location) {
      notifyError('Please fill in Date, Time and Location');
      return;
    }

    setLoading(true);
    try {
      await api.post('/gram-sabha-notice/SabhaNotice', {
        ...noticeData,
        postedDate: new Date().toISOString(),
      });
      notifySuccess('Gram Sabha Notice Published Successfully!');
      setNoticeData({
        date: '',
        time: '',
        location: 'Gram Panchayat Office',
        agenda: '',
        message: '',
      });
    } catch (err) {
      console.error(err);
      notifyError('Failed to publish notice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="bg-white rounded-[3rem] shadow-xl border border-emerald-50 overflow-hidden relative group">
        
        {/* Header Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-emerald-400 via-[#0B8A5A] to-green-500"></div>
        
        <div className="p-8 sm:p-12 relative z-10">
          <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 shadow-inner shadow-emerald-200/50">
               <Send className="w-10 h-10 -ml-1 mt-1" />
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0B1A2C] tracking-tight">Post Gram Sabha Notice</h2>
              <p className="text-gray-500 font-medium text-lg mt-2">Create and publish the official schedule for the upcoming village meeting.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column - Instructions/Tips */}
            <div className="col-span-1 lg:col-span-4 space-y-6">
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-[2rem] border border-emerald-100/50">
                <h4 className="font-black text-emerald-900 mb-4 flex items-center gap-2">
                   <CheckCircle className="w-5 h-5 text-emerald-500" /> Best Practices
                </h4>
                <ul className="space-y-4 text-sm font-medium text-emerald-800/80">
                  <li className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-200/50 flex items-center justify-center shrink-0 mt-0.5 text-emerald-700 font-bold">1</div>
                    <span>Schedule at least <strong>7 days</strong> in advance so citizens can plan to attend.</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-200/50 flex items-center justify-center shrink-0 mt-0.5 text-emerald-700 font-bold">2</div>
                    <span>Clearly list <strong>key agendas</strong> to encourage relevant discussions.</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-200/50 flex items-center justify-center shrink-0 mt-0.5 text-emerald-700 font-bold">3</div>
                    <span>Double check the <strong>Time and Location</strong> accuracy.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="col-span-1 lg:col-span-8 bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="space-y-8">
                
                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-black text-[#0B1A2C] flex items-center gap-2 uppercase tracking-wide">
                      <Calendar className="w-4 h-4 text-emerald-500" /> Date
                    </label>
                    <input
                      type="date"
                      value={noticeData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-gray-700 shadow-sm hover:border-emerald-300"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-black text-[#0B1A2C] flex items-center gap-2 uppercase tracking-wide">
                      <Clock className="w-4 h-4 text-emerald-500" /> Time
                    </label>
                    <input
                      type="time"
                      value={noticeData.time}
                      onChange={(e) => handleChange('time', e.target.value)}
                      className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-gray-700 shadow-sm hover:border-emerald-300"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-3">
                  <label className="text-sm font-black text-[#0B1A2C] flex items-center gap-2 uppercase tracking-wide">
                    <MapPin className="w-4 h-4 text-emerald-500" /> Meeting Location
                  </label>
                  <input
                    type="text"
                    value={noticeData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="Enter precise location (e.g., Gram Panchayat Main Hall)"
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-gray-700 shadow-sm hover:border-emerald-300"
                  />
                </div>

                {/* Agenda */}
                <div className="space-y-3">
                  <label className="text-sm font-black text-[#0B1A2C] flex items-center gap-2 uppercase tracking-wide">
                    <AlignLeft className="w-4 h-4 text-emerald-500" /> Key Form Agendas
                  </label>
                  <textarea
                    rows={4}
                    value={noticeData.agenda}
                    onChange={(e) => handleChange('agenda', e.target.value)}
                    placeholder="1. Review of annual budget...&#10;2. Discussion on new water project..."
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-gray-700 shadow-sm resize-none hover:border-emerald-300"
                  />
                </div>

                {/* Note */}
                <div className="space-y-3">
                  <label className="text-sm font-black text-[#0B1A2C] uppercase tracking-wide">
                    Additional Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={noticeData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder="Any specific requests or requirements for attendees..."
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-gray-700 shadow-sm resize-none hover:border-emerald-300"
                  />
                </div>

                {/* Actions */}
                <div className="pt-4 flex items-center justify-end border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full sm:w-auto px-10 py-4 bg-[#0B8A5A] text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-emerald-900 hover:shadow-xl hover:shadow-emerald-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95"
                  >
                    {loading ? (
                       <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                       <><Send className="w-5 h-5" /> Publish Official Notice</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GramSabhaNoticePanel;
