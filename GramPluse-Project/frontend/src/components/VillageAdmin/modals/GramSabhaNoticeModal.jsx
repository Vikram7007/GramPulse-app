// src/components/VillageAdmin/modals/GramSabhaNoticeModal.jsx
import React, { useState } from 'react';
import { X, Check, Calendar, Clock, MapPin, AlignLeft, Send } from 'lucide-react';
import api from '../../../utils/api';
import { notifySuccess, notifyError } from '../../../components/NotificationToast';

const GramSabhaNoticeModal = ({ open, onClose }) => {
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
      notifySuccess('Gram Sabha Notice Published!');
      onClose();
    } catch (err) {
      console.error(err);
      notifyError('Failed to publish notice');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-[#0B1A2C]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col relative animate-fade-in-up">
        
        {/* Header */}
        <div className="bg-[#0B8A5A] px-8 py-6 rounded-t-[2rem] flex justify-between items-center sticky top-0 z-10">
          <div>
            <h3 className="text-2xl font-black text-white">Gram Sabha Notice</h3>
            <p className="text-emerald-100/80 font-medium text-sm mt-1">Schedule and notify citizens about the upcoming Gram Sabha</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6">
          
          {/* Date & Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#0B1A2C] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0B8A5A]" /> Date
              </label>
              <input
                type="date"
                value={noticeData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-gray-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#0B1A2C] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0B8A5A]" /> Time
              </label>
              <input
                type="time"
                value={noticeData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-gray-700"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#0B1A2C] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0B8A5A]" /> Location
            </label>
            <input
              type="text"
              value={noticeData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g. Gram Panchayat Office"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-gray-700"
            />
          </div>

          {/* Agenda */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#0B1A2C] flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-[#0B8A5A]" /> Meeting Agenda
            </label>
            <textarea
              value={noticeData.agenda}
              onChange={(e) => handleChange('agenda', e.target.value)}
              rows="3"
              placeholder="List the key points to be discussed..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-gray-700 resize-none"
            />
          </div>

          {/* Additional Message */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#0B1A2C] flex items-center gap-2">
              <Send className="w-4 h-4 text-[#0B8A5A]" /> Notice Message (Optional)
            </label>
            <textarea
              value={noticeData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              rows="2"
              placeholder="Any additional instructions for the villagers..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-gray-700 resize-none"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3 rounded-b-[2rem]">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-8 py-2.5 bg-[#0B8A5A] text-white rounded-xl font-bold hover:bg-[#076a44] transition-all shadow-md shadow-emerald-200 flex items-center gap-2 active:scale-95 disabled:opacity-70"
          >
            {loading ? <span className="animate-pulse">Publishing...</span> : <><Check className="w-4 h-4" /> Publish Notice</>}
          </button>
        </div>

      </div>
    </div>
  );
};

export default GramSabhaNoticeModal;





