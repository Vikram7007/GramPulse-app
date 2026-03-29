import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

function ReturnToDashboard({ className = "" }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/dashboard')}
      className={`
        group flex items-center gap-2
        px-4 py-2
        bg-emerald-100/50 hover:bg-emerald-600 text-emerald-700 hover:text-white
        font-bold text-sm
        rounded-xl
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2
        backdrop-blur-sm border border-emerald-200 hover:border-emerald-600
        ${className}
      `}
      type="button"
    >
      <ArrowLeft
        size={18}
        className="text-emerald-600 group-hover:text-white transition-colors"
      />

      <span className="font-bold">Dashboard</span>
    </button>
  );
}

export default ReturnToDashboard;