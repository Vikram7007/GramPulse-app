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

  // Issue Categories with proper icons
  const issueTypes = [
    { id: 'water', label: t('issueTypes.water'), icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'road', label: t('issueTypes.road'), icon: Footprints, color: 'text-gray-700', bg: 'bg-gray-100' },
    { id: 'light', label: t('issueTypes.light'), icon: Lightbulb, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { id: 'drainage', label: t('issueTypes.drainage'), icon: Navigation, color: 'text-cyan-600', bg: 'bg-cyan-50' }, // Approximation
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

  const currentType = issueTypes.find(t => t.id === issueType);

  return (
    <>
      <Navbar />
      <div className="relative z-40">
        <Sidebar />
      </div>

      <div className="min-h-screen bg-light-50 pt-16 md:pt-20 pb-32 md:pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
        <div className="max-w-4xl mx-auto lg:ml-[350px]">

          <div className="mb-6 sm:mb-10 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mb-2 font-display">
              {t('newIssue')}
            </h1>
            <p className="text-gray-600 text-sm sm:text-lg">
              {t('submitDescription') || "Help us improve the village by reporting issues correctly."}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

            {/* Progress Steps */}
            <div className="flex border-b border-gray-100">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  onClick={() => setStep(s)}
                  className={`flex-1 py-4 text-center cursor-pointer transition-colors duration-300 relative ${step === s ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-gray-400 hover:bg-gray-50'
                    }`}
                >
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full border-2 mr-2 ${step === s ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-200 bg-white'
                    }`}>
                    {s}
                  </span>
                  <span className="hidden sm:inline">
                    {s === 1 ? t('details') : s === 2 ? t('media') : t('location')}
                  </span>
                  {step === s && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500"></div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-6 md:p-10 min-h-[500px]">

              {/* Step 1: Details */}
              {step === 1 && (
                <div className="space-y-8 animate-fade-in">
                  <div>
                    <label className="block text-gray-700 font-bold mb-4 text-lg flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-emerald-500" />
                      {t('selectIssueType')}
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {issueTypes.map((type) => (
                        <div
                          key={type.id}
                          onClick={() => setIssueType(type.id)}
                          className={`
                            cursor-pointer rounded-2xl p-4 border-2 transition-all duration-200 flex flex-col items-center justify-center gap-3 text-center
                            ${issueType === type.id
                              ? 'border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-200'
                              : 'border-gray-100 hover:border-emerald-200 hover:bg-gray-50'}
                          `}
                        >
                          <div className={`p-3 rounded-full ${type.bg}`}>
                            <type.icon className={`w-6 h-6 ${type.color}`} />
                          </div>
                          <span className={`font-semibold ${issueType === type.id ? 'text-emerald-800' : 'text-gray-600'}`}>
                            {type.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-4 text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-500" />
                      {t('description')}
                    </label>
                    <div className="relative">
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all resize-none shadow-sm min-h-[160px]"
                        placeholder={t('descriptionPlaceholder') || "Describe the issue in detail..."}
                      />
                      <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-white px-2 py-1 rounded-md border">
                        {description.length} chars
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => setStep(2)}
                      disabled={!issueType || !description}
                      className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center gap-2"
                    >
                      Next Step <Navigation className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Media */}
              {step === 2 && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{t('uploadPhoto')}</h3>
                    <p className="text-gray-500 mb-6">{t('photoUploadIndication') || "Upload a clear photo of the issue to help us promote it."}</p>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <label className={`
                      w-full max-w-md h-64 border-3 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300
                      ${photoFile
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'}
                    `}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setPhotoFile(e.target.files[0])}
                        className="hidden"
                      />

                      {photoFile ? (
                        <div className="relative w-full h-full p-4 flex flex-col items-center justify-center">
                          <CheckCircle className="w-16 h-16 text-emerald-500 mb-4 animate-bounce" />
                          <p className="text-emerald-800 font-bold text-lg">{photoFile.name}</p>
                          <p className="text-emerald-600 text-sm">{(photoFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          <button
                            onClick={(e) => { e.preventDefault(); setPhotoFile(null); }}
                            className="mt-4 px-4 py-2 bg-white text-red-500 rounded-full shadow-md hover:bg-red-50 border border-red-100 flex items-center gap-2 font-medium"
                          >
                            <Trash2 className="w-4 h-4" /> Remove
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-gray-500 p-8 text-center">
                          <div className="bg-blue-50 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                            <UploadCloud className="w-10 h-10 text-blue-500" />
                          </div>
                          <p className="font-bold text-lg text-gray-700">Click to upload photo</p>
                          <p className="text-sm text-gray-400 mt-2">SVG, PNG, JPG or GIF (max. 5MB)</p>
                        </div>
                      )}
                    </label>
                  </div>

                  <div className="flex justify-between pt-8">
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-all"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-2"
                    >
                      Next Step <Navigation className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Location & Submit */}
              {step === 3 && (
                <div className="space-y-6 animate-fade-in h-full flex flex-col">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <MapPin className="w-6 h-6 text-red-500" />
                        {t('confirmLocation')}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">{t('dragPinToAdjust') || "Drag the pin to exact location"}</p>
                    </div>
                    <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg text-xs font-mono font-bold">
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </div>
                  </div>

                  <div className="flex-1 min-h-[350px] rounded-2xl overflow-hidden shadow-inner border-4 border-white ring-1 ring-gray-200 relative">
                    <MapPicker location={location} setLocation={setLocation} />

                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg text-xs font-semibold text-gray-600 max-w-[150px]">
                      <AlertCircle className="w-4 h-4 inline mr-1 text-blue-500" />
                      Map screenshot will be auto-generated.
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-gray-100 mt-auto">
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-all"
                      disabled={loading}
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 bg-[length:200%_200%] animate-gradient-x flex items-center gap-3 disabled:opacity-70 disabled:cursor-wait"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          {t('submitIssue')}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation for Mobile */}
      <BottomNavbar />
    </>
  );
}

export default SubmitIssue;