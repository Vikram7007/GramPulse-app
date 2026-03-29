// src/components/GramSevak/CommentModal.jsx
import React from 'react';
import { MessageSquare, XCircle, CheckCircle, Zap } from 'lucide-react';

const CommentModal = ({ showCommentModal, setShowCommentModal, selectedIssue, comment, setComment, addComment }) => {
  if (!showCommentModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="relative w-full max-w-3xl transform transition-all duration-500 scale-100">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-40"></div>
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-purple-200">
          <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-pink-600 px-8 py-6 flex justify-between items-center">
            <h3 className="text-2xl font-black text-white flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
                <MessageSquare className="w-7 h-7" />
              </div>
              💬 प्रगती टिप्पणी जोडा
            </h3>
            <button
              onClick={() => {
                setShowCommentModal(false);
                setComment('');
              }}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-3 transition-all duration-300 transform hover:scale-110 hover:rotate-90"
            >
              <XCircle className="w-7 h-7" />
            </button>
          </div>
          <div className="p-8">
            <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
              <h4 className="font-black text-green-900 text-lg mb-3 flex items-center gap-2">
                <Flag className="w-5 h-5" />
                {selectedIssue?.type}
              </h4>
              <p className="text-green-700 text-base leading-relaxed">{selectedIssue?.description}</p>
            </div>
            <label className="block text-purple-900 font-black mb-4 text-base flex items-center gap-2">
              <Zap className="w-5 h-5" />
              आजचे काम / प्रगती लिहा
            </label>
            <div className="relative">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="आज काय काम केले ते येथे सविस्तर लिहा... 📝"
                className="w-full h-48 px-6 py-4 border-2 border-purple-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300 text-purple-900 resize-none text-base font-medium shadow-inner"
              />
              <div className="absolute bottom-4 right-4 text-purple-400 text-sm font-bold">
                {comment.length} अक्षरे
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={addComment}
                disabled={!comment.trim()}
                className={`relative flex-1 group/save ${comment.trim() ? '' : 'opacity-60 cursor-not-allowed'}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-50 group-hover/save:opacity-75 transition-opacity"></div>
                <div className={`relative px-8 py-4 rounded-2xl font-black text-base transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-3 ${
                  comment.trim() 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                    : 'bg-gray-300 text-gray-500'
                }`}>
                  <CheckCircle className="w-6 h-6" />
                  टिप्पणी जतन करा ✅
                </div>
              </button>
              <button
                onClick={() => {
                  setShowCommentModal(false);
                  setComment('');
                }}
                className="flex-1 px-8 py-4 bg-gray-200 text-gray-800 rounded-2xl font-black text-base hover:bg-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <XCircle className="w-6 h-6" />
                रद्द करा
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;