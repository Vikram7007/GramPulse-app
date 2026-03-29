import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, XCircle, CheckCircle, Sparkles, Users, CalendarDays, Gavel, Lightbulb } from 'lucide-react';

const GramSabhaNotesModal = ({ open, issue, notes, setNotes, onSave, onClose }) => {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-md overflow-y-auto">
      <div className="modal-content bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col border-4 border-emerald-500 relative overflow-hidden">
        {/* Decorative Header Banner */}
        <div className="absolute inset-x-0 top-0 h-32 sm:h-40 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 rounded-t-3xl opacity-95"></div>

        {/* Header */}
        <div className="relative z-10 px-6 sm:px-8 py-5 sm:py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="p-4 sm:p-5 bg-white rounded-3xl shadow-2xl border-4 border-emerald-400">
              <Gavel className="w-12 h-12 sm:w-14 sm:h-14 text-emerald-600 animate-pulse" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-4xl font-black text-white drop-shadow-2xl">
                {t('gramSabhaNotes')}
              </h3>
              <p className="text-lg sm:text-xl text-emerald-100 mt-2 font-bold flex items-center gap-3">
                <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6" />
                {t('meetingDecisionRecord')}
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-spin-slow" />
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-3 sm:p-4 transition-all transform hover:scale-110 hover:rotate-90 shadow-xl"
          >
            <XCircle className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar space-y-8 relative z-10">
          {/* Issue Summary Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-6 sm:p-8 border-4 border-emerald-300 shadow-2xl">
            <h4 className="text-xl sm:text-2xl font-black text-emerald-900 mb-4 flex items-center gap-3">
              <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600" />
              {t('relatedIssue')}
            </h4>
            <div className="space-y-4">
              <p className="text-base sm:text-lg font-bold text-emerald-800">
                {t(`issueTypes.${issue?.type || 'unknown'}`)}
              </p>
              <p className="text-emerald-700 leading-relaxed text-sm sm:text-base">
                {issue?.description || t('descriptionNotAvailable')}
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <span className="bg-white px-4 sm:px-5 py-3 rounded-2xl shadow-lg font-bold text-emerald-700 border-2 border-emerald-400 text-sm">
                  {t('status')}: {issue?.status === 'approved' ? t('approved') : 
                                 issue?.status === 'in-progress' ? t('inProgress') : 
                                 issue?.status || t('unknown')}
                </span>
                {issue?.priority && (
                  <span className="bg-white px-4 sm:px-5 py-3 rounded-2xl shadow-lg font-bold text-emerald-700 border-2 border-emerald-400 text-sm">
                    {t('priority')}: {t(`priorityLevels.${issue?.priority}`)}
                  </span>
                )}
                {issue?.assignedTo && (
                  <span className="bg-white px-4 sm:px-5 py-3 rounded-2xl shadow-lg font-bold text-emerald-700 border-2 border-emerald-400 text-sm">
                    <Users className="w-5 h-5 inline" /> {t('assigned')}: {issue?.assignedTo}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Notes Input Card */}
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl p-6 sm:p-8 border-4 border-teal-300 shadow-2xl">
            <label className="block text-xl sm:text-2xl font-black text-teal-900 mb-6 flex items-center gap-4">
              <Lightbulb className="w-8 h-8 sm:w-10 sm:h-10 text-teal-600 animate-bounce" />
              {t('recordGramSabhaDiscussionAndDecisions')}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('gramSabhaNotesPlaceholder')}
              rows="10"
              className="w-full px-4 sm:px-6 py-4 sm:py-5 text-base sm:text-lg border-4 border-teal-400 rounded-2xl focus:outline-none focus:ring-8 focus:ring-teal-300 focus:border-teal-600 transition-all shadow-inner resize-none font-medium text-teal-900 leading-relaxed"
            />
            <p className="text-teal-700 mt-4 text-sm italic">
              {t('gramSabhaNotesTip')}
            </p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-6 sm:p-8 border-t-4 border-emerald-400 bg-gradient-to-r from-emerald-50 to-green-50">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <button
              onClick={onSave}
              className="flex-1 py-4 sm:py-5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-3xl font-black text-xl sm:text-2xl hover:from-emerald-700 hover:to-green-700 transition-all transform hover:scale-105 flex items-center justify-center gap-4 shadow-2xl"
            >
              <CheckCircle className="w-8 h-8 sm:w-9 sm:h-9" />
              {t('saveNotes')}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-4 sm:py-5 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 rounded-3xl font-black text-xl sm:text-2xl hover:from-gray-400 hover:to-gray-500 transition-all transform hover:scale-105 shadow-xl"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GramSabhaNotesModal;