import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, MessageSquare, MapPin, AlertCircle, CheckCircle, Clock, Image as ImageIcon } from 'lucide-react';

function IssueCard({ issue }) {
  const { t } = useTranslation();

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Issue':
      case 'rejected':
        return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', icon: AlertCircle, label: t('rejected') };
      case 'in-progress':
        return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: Clock, label: t('inProgress') };
      case 'Completed':
      case 'approved':
        return { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: CheckCircle, label: t('completed') };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-100', icon: Clock, label: t('pending') };
    }
  };

  const statusConfig = getStatusConfig(issue.status);
  const StatusIcon = statusConfig.icon;
  const mainImage = issue.images?.[0];

  return (
    <div className="flex flex-col h-full">
      {/* Image Section */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-100 group-hover:scale-105 transition-transform duration-500">
        {mainImage ? (
          <img
            src={mainImage}
            alt={issue.type || "Issue"}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
        ) : null}

        {/* Fallback Grid/Pattern if no image or error */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 ${mainImage ? 'hidden' : 'flex'}`}>
          <ImageIcon className="w-12 h-12 text-gray-300 mb-2" />
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{t('noImage')}</p>
        </div>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>

        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <div className="flex items-center gap-1.5 text-white/90 text-xs font-bold bg-black/20 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
            <MapPin className="w-3 h-3" />
            <span className="truncate max-w-[150px]">{issue.location?.address || t('villageLocation')}</span>
          </div>
        </div>
      </div>

      {/* Content Section - Implicitly rendered by parent or here if needed */}
      {/* Since Dashboard handles the content part separately for the layout, 
          IssueCard specifically handles the visual "Card" representation, 
          mainly the header/image part in the new dashboard design. 
          However, for other views, we render the body below. */}

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-gray-900 line-clamp-1 text-xl group-hover:text-emerald-700 transition-colors">
            {t(issue.type) || issue.title || t('issueReported')}
          </h3>
          <span className={`px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wide border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border} flex items-center gap-1`}>
            {statusConfig.label}
          </span>
        </div>

        <p className="text-gray-800 text-base leading-relaxed line-clamp-2 mb-4 flex-1">
          {t(issue.descriptionKey || issue.description)}
        </p>

        <div className="flex items-center gap-4 text-sm font-bold text-gray-600 mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(issue.createdAt).toLocaleDateString()}
          </div>
          {issue.comments && (
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              {issue.comments.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper icon component for use in other files if needed
function Calendar(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

export default IssueCard;