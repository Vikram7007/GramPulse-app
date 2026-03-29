// src/components/VillageAdmin/modals/CompletedDetailModal.jsx
import React from 'react';
import { X, CheckCircle2, Award, Camera, Download, Calendar, User, ListOrdered, AlertTriangle } from 'lucide-react';
import { notifySuccess, notifyError } from '../../NotificationToast';

const CompletedDetailModal = ({ open, issue, onClose }) => {
  if (!open || !issue) return null;

  const downloadImage = (url, filename = 'proof-photo.jpg') => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        notifySuccess('Image downloaded successfully!');
      })
      .catch(() => notifyError('Failed to download image'));
  };

  return (
    <div className="fixed inset-0 bg-[#0B1A2C]/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 sm:p-8">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col relative animate-fade-in-up overflow-hidden border border-white/50">
        
        {/* Header (Sticky inside modal) */}
        <div className="bg-[#0B8A5A] px-6 sm:px-10 py-6 sm:py-8 flex justify-between items-center z-10 sticky top-0 flex-shrink-0">
          <div>
            <h3 className="text-xl sm:text-3xl font-black text-white flex items-center gap-3">
              <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-300" />
              पूर्ण झालेल्या समस्येची सविस्तर माहिती
            </h3>
            <p className="text-emerald-100 mt-2 text-sm sm:text-base font-semibold">
              ग्रामसेवकाने यशस्वीपणे सोडवलेले काम
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 sm:p-3 transition-all transform hover:scale-105 backdrop-blur-sm flex-shrink-0"
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="overflow-y-auto w-full flex-grow p-6 sm:p-10 custom-scrollbar space-y-10">
          
          {/* Issue Details Box */}
          <div className="bg-gradient-to-br from-gray-50 to-emerald-50/30 rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
            
            <h4 className="text-2xl sm:text-3xl font-black text-[#0B1A2C] mb-4 flex items-center gap-3 relative z-10">
              {issue.type || issue.title || 'Other Issue'} 
              <span className="bg-emerald-100 text-[#0B8A5A] p-2 rounded-xl"><Award className="w-5 h-5 sm:w-6 sm:h-6" /></span>
            </h4>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-8 relative z-10 font-medium">
              {issue.description}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center relative z-10">
              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all">
                <p className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> दिनांक</p>
                <p className="text-[#0B1A2C] font-black text-base sm:text-lg">
                  {new Date(issue.createdAt || Date.now()).toLocaleDateString('en-GB')}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all">
                <p className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5"><User className="w-3.5 h-3.5"/> नियुक्त ग्रामसेवक</p>
                <p className="text-[#0B8A5A] font-black text-base sm:text-lg">
                  {issue.assignedTo || "राजेश कुमार"}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all">
                <p className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5"><ListOrdered className="w-3.5 h-3.5"/> एकूण मतं</p>
                <p className="text-[#0B1A2C] font-black text-base sm:text-lg">
                  {issue.votes?.length || 0}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all">
                <p className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5"/> प्राधान्य</p>
                <p className={`font-black text-base sm:text-lg ${
                  issue.priority === 'high' ? 'text-rose-500' : 
                  issue.priority === 'medium' ? 'text-amber-500' : 'text-[#0B8A5A]'
                }`}>
                  {issue.priority === 'high' ? 'उच्च' : issue.priority === 'medium' ? 'मध्यम' : 'कमी'}
                </p>
              </div>
            </div>
          </div>

          {/* Original Issue Images */}
          {issue.images && issue.images.length > 0 && (
            <div className="mb-8">
              <h4 className="text-xl sm:text-2xl font-black text-[#0B1A2C] mb-6 flex items-center gap-2">
                <Camera className="w-6 h-6 text-gray-400" />
                मूळ समस्येचे फोटो (Original Photos)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {issue.images.map((url, idx) => (
                  <div key={idx} className="group relative rounded-[2rem] overflow-hidden shadow-sm border-2 border-transparent hover:border-emerald-500/50 transition-all duration-300">
                    <img 
                      src={url} 
                      alt={`Original Photo ${idx + 1}`} 
                      className="w-full h-56 sm:h-64 object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A2C]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                      <button
                        onClick={() => downloadImage(url, `original-issue-${issue._id}-${idx + 1}.jpg`)}
                        className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white/90 backdrop-blur-sm text-[#0B1A2C] px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-white text-sm"
                      >
                        <Download className="w-4 h-4" /> Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Proof Photos */}
          {issue.proofPhotos && issue.proofPhotos.length > 0 && (
            <div className="mb-8">
              <h4 className="text-xl sm:text-2xl font-black text-[#0B8A5A] mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-[#0B8A5A]" />
                पूर्ण झालेल्या कामाचे पुरावे (Proof Photos)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {issue.proofPhotos.map((url, idx) => (
                  <div key={idx} className="group relative rounded-[2rem] overflow-hidden shadow-sm border-2 border-transparent hover:border-emerald-500 transition-all duration-300">
                    <img 
                      src={url} 
                      alt={`Proof Photo ${idx + 1}`} 
                      className="w-full h-56 sm:h-64 object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                      <button
                        onClick={() => downloadImage(url, `proof-${issue._id}-${idx + 1}.jpg`)}
                        className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-[#0B8A5A] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-xl hover:bg-emerald-600 text-sm"
                      >
                        <Download className="w-4 h-4" /> Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CompletedDetailModal;