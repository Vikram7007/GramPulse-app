import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Bell, Shield, MapPin, Save, Globe, Smartphone, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { notifySuccess, notifyError } from '../../../components/NotificationToast';
import api from '../../../utils/api';

const VillageAdminSettingsPanel = ({ adminName, adminPhone }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [profileData, setProfileData] = useState(() => {
    const savedData = localStorage.getItem('villageAdminProfileData');
    if (savedData) return JSON.parse(savedData);
    return {
      name: adminName || user?.name || 'Village Admin',
      phone: adminPhone || user?.mobile || '7028615656',
      email: 'sarpanch@grampulse.com',
      village: 'Ralegan Siddhi',
      taluka: 'Parner',
      district: 'Ahmednagar'
    };
  });

  const [notifications, setNotifications] = useState({
    newIssues: true,
    gramsevakUpdates: true,
    weeklyReports: false,
    smsAlerts: true
  });

  const [passwordForm, setPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggle = (field) => {
    setNotifications(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = () => {
    localStorage.setItem('villageAdminProfileData', JSON.stringify(profileData));
    notifySuccess(t('settingsUpdated', 'Settings updated successfully!'));
  };

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new) {
       return notifyError(t('fillPasswords', "Please enter both current and new password"));
    }
    setPasswordLoading(true);
    try {
       const res = await api.put("/auth/village/sarpanch/password", {
          username: profileData.phone, // Admin's login is mobile number
          currentPassword: passwords.current,
          newPassword: passwords.new
       });
       notifySuccess(res.data.message || t('passwordChanged', "Password changed successfully!"));
       setPasswordForm(false);
       setPasswords({ current: '', new: '' });
    } catch (error) {
       notifyError(error.response?.data?.message || t('passwordFailed', "Failed to change password"));
    } finally {
       setPasswordLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up space-y-8">
      {/* Header */}
      <div className="bg-white rounded-[2.5rem] shadow-sm p-8 border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-bl-[100px] -z-10 transition-transform duration-700 group-hover:scale-150 group-hover:bg-emerald-500/10"></div>
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#0B8A5A] to-emerald-400 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/30">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-[#0B1A2C] tracking-tight">{t('systemSettings', 'System Settings')}</h2>
            <p className="text-gray-500 font-medium text-sm mt-1">{t('managePreferences', 'Manage your administrative profile, preferences, and security.')}</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-8 py-4 bg-[#0B8A5A] text-white font-black uppercase tracking-wider text-sm rounded-xl hover:bg-emerald-900 transition-all shadow-xl hover:-translate-y-1 active:scale-95 whitespace-nowrap"
        >
          <Save className="w-5 h-5" /> {t('saveChanges', 'Save Changes')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Forms) */}
        <div className="col-span-1 lg:col-span-2 space-y-8">
          
          {/* Profile Section */}
          <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 to-[#0B8A5A]"></div>
            
            <h3 className="text-xl font-black text-[#0B1A2C] flex items-center gap-3 mb-8">
              <User className="w-6 h-6 text-emerald-500" /> {t('adminProfile', 'Administrative Profile')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">{t('fullName', 'Full Name')}</label>
                <div className="relative">
                  <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type="text" value={profileData.name} onChange={(e) => handleProfileChange('name', e.target.value)} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-gray-800" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <Smartphone className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type="text" value={profileData.phone} onChange={(e) => handleProfileChange('phone', e.target.value)} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-gray-800" />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Official Email</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type="email" value={profileData.email} onChange={(e) => handleProfileChange('email', e.target.value)} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-gray-800" />
                </div>
              </div>
            </div>
          </div>

          {/* Region Section */}
          <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 border border-gray-100 shadow-sm relative overflow-hidden">
            <h3 className="text-xl font-black text-[#0B1A2C] flex items-center gap-3 mb-8">
              <MapPin className="w-6 h-6 text-emerald-500" /> {t('regionalConfig', 'Regional Configuration')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">{t('village', 'Village')}</label>
                <input type="text" value={profileData.village} onChange={(e) => handleProfileChange('village', e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all rounded-2xl font-bold text-gray-800" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">{t('taluka', 'Taluka')}</label>
                <input type="text" value={profileData.taluka} onChange={(e) => handleProfileChange('taluka', e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all rounded-2xl font-bold text-gray-800" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">{t('district', 'District')}</label>
                <input type="text" value={profileData.district} onChange={(e) => handleProfileChange('district', e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all rounded-2xl font-bold text-gray-800" />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="col-span-1 space-y-8">
          
          {/* Notifications */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black text-[#0B1A2C] flex items-center gap-3 mb-8">
              <Bell className="w-6 h-6 text-emerald-500" /> {t('alertPreferences', 'Alert Preferences')}
            </h3>
            <div className="space-y-6">
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <h4 className="font-bold text-[#0B1A2C] text-sm">{t('newIssuesNotify', 'New Issues')}</h4>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">{t('newIssuesDesc', 'Push notify for new requests')}</p>
                </div>
                <button onClick={() => handleToggle('newIssues')} className={`w-12 h-6 rounded-full transition-colors relative ${notifications.newIssues ? 'bg-[#0B8A5A]' : 'bg-gray-300'}`}>
                   <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications.newIssues ? 'left-7' : 'left-1'}`}></span>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <h4 className="font-bold text-[#0B1A2C] text-sm">{t('gramsevakUpdatesNotify', 'Gramsevak Updates')}</h4>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">{t('gramsevakUpdatesDesc', 'When staff marks as complete')}</p>
                </div>
                <button onClick={() => handleToggle('gramsevakUpdates')} className={`w-12 h-6 rounded-full transition-colors relative ${notifications.gramsevakUpdates ? 'bg-[#0B8A5A]' : 'bg-gray-300'}`}>
                   <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications.gramsevakUpdates ? 'left-7' : 'left-1'}`}></span>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <h4 className="font-bold text-[#0B1A2C] text-sm">{t('smsAlertsNotify', 'SMS Alerts')}</h4>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">{t('smsAlertsDesc', 'Critical notifications to phone')}</p>
                </div>
                <button onClick={() => handleToggle('smsAlerts')} className={`w-12 h-6 rounded-full transition-colors relative ${notifications.smsAlerts ? 'bg-[#0B8A5A]' : 'bg-gray-300'}`}>
                   <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications.smsAlerts ? 'left-7' : 'left-1'}`}></span>
                </button>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-gradient-to-br from-emerald-900 to-[#0B1A2C] rounded-[2.5rem] p-8 border border-white/10 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <Lock className="w-24 h-24 text-white" />
            </div>
            <h3 className="text-xl font-black text-white flex items-center gap-3 mb-4 relative z-10">
              <Shield className="w-6 h-6 text-emerald-400" /> {t('security', 'Security')}
            </h3>
            <p className="text-emerald-100/70 text-sm font-medium mb-8 relative z-10">{t('securityDesc', 'Ensure your administrative privileges are securely locked.')}</p>
            
            {!passwordForm ? (
               <button onClick={() => setPasswordForm(true)} className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all backdrop-blur-sm border border-white/20 relative z-10">
                 {t('changePassword', 'Change Password')}
               </button>
            ) : (
               <div className="space-y-4 relative z-10 animate-fade-in">
                 <input 
                   type="password" 
                   placeholder={t('currentPassword', 'Current Password')}
                   value={passwords.current}
                   onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                   className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-500 font-medium" 
                 />
                 <input 
                   type="password" 
                   placeholder={t('newPassword', 'New Password')}
                   value={passwords.new}
                   onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                   className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-500 font-medium" 
                 />
                 <div className="flex gap-3 pt-2">
                   <button onClick={() => setPasswordForm(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10">
                     {t('cancel', 'Cancel')}
                   </button>
                   <button disabled={passwordLoading} onClick={handleChangePassword} className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50">
                     {passwordLoading ? t('updating', "Updating...") : t('update', "Update")}
                   </button>
                 </div>
               </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default VillageAdminSettingsPanel;
