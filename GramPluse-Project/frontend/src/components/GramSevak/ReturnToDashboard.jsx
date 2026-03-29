// src/components/GramSevak/ReturnToDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const ReturnToDashboard = () => (
  <div className="fixed bottom-8 right-8 z-50">
    <Link to="/dashboard">
      <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-110 flex items-center gap-2 font-bold animate-bounce-slow">
        <ChevronRight className="w-5 h-5" />
        मुख्य डॅशबोर्ड
      </button>
    </Link>
  </div>
);

export default ReturnToDashboard;