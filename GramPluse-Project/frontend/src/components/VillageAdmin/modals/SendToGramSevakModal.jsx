// src/components/VillageAdmin/modals/SendToGramSevakModal.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Send, XCircle, Flag, Users, CheckCircle } from 'lucide-react';

const SendToGramSevakModal = ({ open, issue, priority, setPriority, gramSevak, setGramSevak, onSend, onClose }) => {
  const { t } = useTranslation();

  if (!open) return null;

  const gramSevaks = [
    { key: 'gramSevakNames.rajeshKumar', default: 'राजेश कुमार' },
    { key: 'gramSevakNames.sureshPatil', default: 'सुरेश पाटील' },
    { key: 'gramSevakNames.amitSharma', default: 'अमित शर्मा' },
    { key: 'gramSevakNames.priyaDevi', default: 'प्रिया देवी' },
    { key: 'gramSevakNames.rameshSingh', default: 'रमेश सिंह' },
  ];

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="modal-content bg-gradient-to-br from-white to-green-50 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border-4 border-green-400">
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-5 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 rounded-t-3xl">
          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Send className="w-6 h-6 animate-pulse" />
            {t('sendToGramSevakTitle')}
          </h3>
          <button 
            onClick={onClose} 
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200 transform hover:scale-110 hover:rotate-90"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar">
          <div className="mb-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-4 sm:p-5 border-3 border-green-300 shadow-lg">
            <h4 className="font-black text-green-900 text-base sm:text-lg mb-2">{issue?.type}</h4>
            <p className="text-green-700 text-sm mb-3">{issue?.description}</p>
            {issue?.images && issue.images.length > 0 && (
              <div className="image-container relative overflow-hidden rounded-xl mt-3 shadow-lg">
                <img 
                  src={issue.images[0]} 
                  alt="Issue" 
                  className="w-full h-40 sm:h-48 object-cover transform hover:scale-110 transition-all duration-500" 
                />
              </div>
            )}
            <div className="flex gap-4 text-sm mt-3">
              <span className="text-green-600 bg-white px-3 py-1 rounded-full font-bold">
                {t('votesLabel')}: <strong>{issue?.votes?.length || 0}</strong>
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-green-800 font-black mb-3 text-base">
                {t('selectPriorityLabel')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button 
                  onClick={() => setPriority('high')} 
                  className={`p-4 rounded-2xl border-3 font-black text-base transition-all duration-300 transform hover:scale-105 sm:hover:scale-110 shadow-lg ${priority === 'high' ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white border-red-600 shadow-glow-red' : 'bg-white text-red-600 border-red-300 hover:bg-red-50'}`}
                >
                  <Flag className="w-5 h-5 mx-auto mb-1 animate-wave" />
                  {t('priority.high')}
                </button>
                <button 
                  onClick={() => setPriority('medium')} 
                  className={`p-4 rounded-2xl border-3 font-black text-base transition-all duration-300 transform hover:scale-105 sm:hover:scale-110 shadow-lg ${priority === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-yellow-600 shadow-glow-yellow' : 'bg-white text-yellow-600 border-yellow-300 hover:bg-yellow-50'}`}
                >
                  <Flag className="w-5 h-5 mx-auto mb-1 animate-wave" />
                  {t('priority.medium')}
                </button>
                <button 
                  onClick={() => setPriority('low')} 
                  className={`p-4 rounded-2xl border-3 font-black text-base transition-all duration-300 transform hover:scale-105 sm:hover:scale-110 shadow-lg ${priority === 'low' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-600 shadow-glow-blue' : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'}`}
                >
                  <Flag className="w-5 h-5 mx-auto mb-1 animate-wave" />
                  {t('priority.low')}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-green-800 font-black mb-3 text-base">
                {t('selectGramSevakLabel')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {gramSevaks.map((sevakItem, index) => {
                  const sevak = t(sevakItem.key) === sevakItem.key ? sevakItem.default : t(sevakItem.key);
                  return (
                    <button
                      key={sevakItem.key}
                      onClick={() => setGramSevak(sevak)}
                      className={`w-full p-4 rounded-2xl border-3 font-black text-base transition-all duration-300 transform hover:scale-105 flex items-center gap-3 shadow-lg ${gramSevak === sevak ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-600 shadow-glow-green' : 'bg-white text-green-800 border-green-300 hover:bg-green-50'}`}
                    >
                      <Users className="w-5 h-5" />
                      {sevak}
                      {gramSevak === sevak && <CheckCircle className="w-5 h-5 ml-auto animate-bounce" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 border-t-4 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onSend}
              disabled={!priority || !gramSevak}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-black text-base hover:from-green-700 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-xl hover:shadow-glow-green"
            >
              <Send className="w-5 h-5" />
              {t('sendToProgressButton')}
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 rounded-2xl font-black text-base hover:from-gray-300 hover:to-gray-400 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendToGramSevakModal;