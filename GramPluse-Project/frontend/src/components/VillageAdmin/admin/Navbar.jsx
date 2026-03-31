// src/components/VillageAdmin/admin/Navbar.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import {
  HomeIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentCheckIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Navbar = ({ username = "सर्पंच महोदय" }) => {
  const { t } = useTranslation();

  const handleLogout = () => {
    // तुम्ही इथे खरा logout logic लिहू शकता (localStorage.clear(), navigate("/login") इ.)
    window.location.reload(); // साधा reload (तात्पुरता)
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0C7779] text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left: Logo & Title */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="flex-shrink-0">
              <svg
                width="48"
                height="48"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-lg w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
              >
                <circle cx="50" cy="50" r="45" fill="#10b981" opacity="0.9" />
                <path d="M20 70 Q50 30 80 70 L80 90 L20 90 Z" fill="#065f46" />
                <rect x="45" y="55" width="10" height="35" fill="#065f46" />
                <circle cx="50" cy="45" r="12" fill="#fbbf24" />
                <text
                  x="50"
                  y="95"
                  fontSize="14"
                  fill="white"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {t("villageVoice")}
                </text>
              </svg>
            </div>

            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide drop-shadow-md">
                {t("appName")}
              </h1>
              <p className="text-emerald-100 text-xs sm:text-sm">
                {t("tagline")}
              </p>
            </div>
          </div>

          {/* Right: User Profile + Logout */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* User Profile */}
            <div className="hidden xs:flex items-center space-x-2 sm:space-x-3 bg-white/10 backdrop-blur-md rounded-full px-3 sm:px-4 py-2 shadow-lg">
              <UserCircleIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              <div className="text-right hidden sm:block">
                <p className="text-white font-semibold text-sm sm:text-base">
                  {username} {/* हे props ने येतं – डायनॅमिक राहू द्या */}
                </p>
                <p className="text-emerald-100 text-xs">
                  {t("sarpanchTitle")}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg transition duration-300 shadow-md text-sm"
              title={t("logout")}
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span className="hidden sm:inline font-medium">
                {t("logout")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;