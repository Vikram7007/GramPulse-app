import { useState } from 'react';
import MapPicker from '../components/MapPicker';
import { notifySuccess, notifyError } from '../components/NotificationToast';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import {
  Camera, MapPin, UploadCloud, CheckCircle, AlertCircle,
  Loader2, Navigation, Lightbulb, Droplets, Truck,
  Trash2, Footprints, AlertTriangle, FileText, X
} from 'lucide-react';
import BottomNavbar from '../components/BottomNavbar';

function SubmitIssue() {
  const { t } = useTranslation();
  const [location, setLocation] = useState({ lat: 18.5204, lng: 73.8567 });
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Issue Categories with proper icons
  const issueTypes = [
    { id: 'water', label: t('issueTypes.water'), icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'road', label: t('issueTypes.road'), icon: Footprints, color: 'text-gray-700', bg: 'bg-gray-100' },
    { id: 'light', label: t('issueTypes.light'), icon: Lightbulb, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { id: 'drainage', label: t('issueTypes.drainage'), icon: Navigation, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { id: 'garbage', label: t('issueTypes.garbage'), icon: Trash2, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'other', label: t('issueTypes.other'), icon: AlertTriangle, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  const uploadToCloudinary = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'grampulse_issues');
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      console.error('Cloudinary upload failed:', err.message);
      throw err;
    }
  };

  const captureMapScreenshot = async () => {
    const mapElement = document.querySelector('.gm-style');
    if (!mapElement) return null;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(mapElement, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        scale: 2,
      });
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'map-screenshot.png', { type: 'image/png' });
            resolve(file);
          } else {
            resolve(null);
          }
        }, 'image/png');
      });
    } catch (err) {
      console.error('Screenshot error:', err);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!issueType || !description.trim()) {
      notifyError('Please fill in all details!');
      return;
    }
    if (!location.lat || !location.lng) {
      notifyError('Please select a location on the map!');
      return;
    }

    setLoading(true);
    try {
      let photoUrl = null;
      let mapScreenshotUrl = null;

      if (photoFile) {
        photoUrl = await uploadToCloudinary(photoFile);
      }

      const mapFile = await captureMapScreenshot();
      if (mapFile) {
        mapScreenshotUrl = await uploadToCloudinary(mapFile);
      }

      const payload = {
        type: issueType,
        description: description.trim(),
        location: {
          lat: Number(location.lat.toFixed(6)),
          lng: Number(location.lng.toFixed(6))
        },
        images: [photoUrl, mapScreenshotUrl].filter(Boolean)
      };

      await api.post('/issues', payload);
      notifySuccess(t('issueSubmittedSuccess') || 'Issue submitted successfully! 🚀');

      // Reset form
      setIssueType('');
      setDescription('');
      setPhotoFile(null);
      setStep(1);
      setLocation({ lat: 18.5204, lng: 73.8567 });
    } catch (err) {
      notifyError(t('error.somethingWentWrong') || 'Something went wrong. Please try again.');
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-50 font-sans">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="pt-20 md:ml-72 pb-32 md:pb-12 px-4 sm:px-6 lg:px-8 transition-all duration-500">
        <div className="max-w-4xl mx-auto py-6 space-y-8 animate-fade-in-up">
           
           {/* Header Section */}
           <section className="bg-brand-dark rounded-4xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10 space-y-4">
                 <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    <Navigation className="w-3 h-3" /> Report Center
                 </div>
                 <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none">
                    Submit <span className="text-emerald-400">Grievance</span>
                 </h1>
                 <p className="text-white/50 text-sm font-medium max-w-lg leading-relaxed">
                    Accuracy matters. Provide clear details to help our village administration solve issues faster.
                 </p>
              </div>
           </section>

           <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden min-h-[600px] flex flex-col">
              {/* Step indicator */}
              <div className="flex bg-gray-50/50 border-b border-gray-100 p-2">
                 {[1, 2, 3].map(s => (
                   <button 
                     key={s} 
                     onClick={() => step > s && setStep(s)}
                     className={`flex-1 py-4 flex items-center justify-center gap-2 transition-all rounded-2xl ${step === s ? 'bg-white shadow-sm text-brand-dark font-black scale-[1.02]' : 'text-gray-300 pointer-events-none'}`}
                   >
                     <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] ${step === s ? 'bg-brand-dark text-white' : 'bg-gray-100'}`}>{s}</span>
                     <span className="hidden sm:inline text-xs uppercase tracking-widest">{s === 1 ? 'Category' : s === 2 ? 'Evidence' : 'Location'}</span>
                   </button>
                 ))}
              </div>

              <div className="p-6 sm:p-10 flex-1">
                 {step === 1 && (
                   <div className="space-y-8 animate-fade-in">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                         {issueTypes.map(type => (
                           <button
                             key={type.id}
                             onClick={() => setIssueType(type.id)}
                             className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 group ${issueType === type.id ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-900/5' : 'border-gray-50 hover:border-emerald-200'}`}
                           >
                             <div className={`p-4 rounded-2xl ${type.bg} ${type.color} group-hover:scale-110 transition-transform`}>
                                <type.icon className="w-6 h-6" />
                             </div>
                             <span className={`text-[10px] font-black uppercase tracking-widest ${issueType === type.id ? 'text-emerald-700' : 'text-gray-400'}`}>{type.label}</span>
                           </button>
                         ))}
                      </div>

                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Detailed Narrative</label>
                         <textarea 
                           placeholder="Tell us everything about the problem..."
                           value={description}
                           onChange={(e) => setDescription(e.target.value)}
                           className="w-full bg-light-50 rounded-3xl p-6 text-sm font-medium text-dark-900 focus:bg-white focus:ring-4 focus:ring-emerald-50 border border-gray-100 outline-none transition-all placeholder:text-gray-300 min-h-[160px] shadow-inner"
                         />
                      </div>

                      <div className="flex justify-end pt-4">
                         <button 
                           onClick={() => setStep(2)}
                           disabled={!issueType || !description.trim()}
                           className="premium-button bg-brand-dark text-white px-10 shadow-xl shadow-emerald-900/20 disabled:opacity-30 disabled:pointer-events-none"
                         >
                            Continue <ChevronRight className="w-5 h-5" />
                         </button>
                      </div>
                   </div>
                 )}

                 {step === 2 && (
                   <div className="space-y-8 animate-fade-in text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                      <div className="w-24 h-24 bg-emerald-50 rounded-4xl flex items-center justify-center text-emerald-500 mb-6 shadow-inner ring-8 ring-emerald-50/50">
                         <Camera className="w-10 h-10" />
                      </div>
                      <div className="space-y-2 mb-10">
                         <h3 className="text-2xl font-black text-dark-900">Add Proof</h3>
                         <p className="text-gray-400 text-sm font-medium">Clear photos help us verify issues instantly.</p>
                      </div>

                      <label className={`w-full max-w-md h-64 border-3 border-dashed rounded-4xl flex flex-col items-center justify-center cursor-pointer transition-all ${photoFile ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:border-emerald-400 hover:bg-gray-50'}`}>
                         <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} className="hidden" />
                         {photoFile ? (
                           <div className="p-6 text-center">
                              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                              <p className="text-sm font-black text-emerald-800 truncate">{photoFile.name}</p>
                              <p className="text-[10px] text-emerald-600">{(photoFile.size/1024/1024).toFixed(2)} MB</p>
                              <button onClick={(e) => { e.preventDefault(); setPhotoFile(null); }} className="mt-4 text-xs font-black text-red-500 uppercase">Replace Photo</button>
                           </div>
                         ) : (
                           <div className="text-center group">
                              <UploadCloud className="w-12 h-12 text-gray-300 group-hover:text-emerald-500 transition-colors mx-auto mb-4" />
                              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Select Image File</p>
                           </div>
                         )}
                      </label>

                      <div className="flex justify-between w-full pt-10 border-t border-gray-50">
                         <button onClick={() => setStep(1)} className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-dark-900 transition-colors">Back</button>
                         <button onClick={() => setStep(3)} className="premium-button bg-brand-dark text-white px-10 shadow-xl shadow-emerald-900/20">Finalize Location <ChevronRight className="w-5 h-5" /></button>
                      </div>
                   </div>
                 )}

                 {step === 3 && (
                   <div className="space-y-6 animate-fade-in flex flex-col h-full min-h-[450px]">
                      <div className="flex items-center justify-between px-2">
                         <div className="flex items-center gap-2">
                           <MapPin className="w-4 h-4 text-rose-500" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Precise Location</span>
                         </div>
                         <div className="bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 font-mono text-[10px] font-black text-emerald-600">
                           {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                         </div>
                      </div>

                      <div className="flex-1 rounded-[2.5rem] overflow-hidden border-2 border-gray-50 shadow-inner relative group min-h-[300px]">
                         <MapPicker location={location} setLocation={setLocation} />
                         <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-100 animate-pulse">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Drag to target</span>
                         </div>
                      </div>

                      <div className="flex justify-between w-full pt-6 border-t border-gray-50">
                         <button onClick={() => setStep(2)} disabled={loading} className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-dark-900 transition-colors">Back</button>
                         <button 
                           onClick={handleSubmit} 
                           disabled={loading}
                           className="premium-button bg-brand-dark text-white px-10 shadow-xl shadow-emerald-900/20 disabled:opacity-50"
                         >
                            {loading ? (
                              <><Loader2 className="w-5 h-5 animate-spin" /> Transmitting...</>
                            ) : (
                              <><CheckCircle className="w-5 h-5" /> Submit Report</>
                            )}
                         </button>
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </main>

      <BottomNavbar />
    </div>
  );
}

export default SubmitIssue;