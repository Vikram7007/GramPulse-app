import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notifySuccess, notifyError } from "../components/NotificationToast";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { User, Smartphone, Lock, MapPin, ArrowRight, Loader, LogIn, Sparkles, CheckCircle, Shield, Zap } from "lucide-react";

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

function Register() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [village, setVillage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !mobile || !password || !village) {
      notifyError(t("error.fillFields"));
      return;
    }

    if (mobile.length !== 10) {
      notifyError(t("error.invalidMobile"));
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/register`, {
        name,
        mobile,
        password,
        village,
      });

      const { token, user } = res.data;

      login(user, token);
      notifySuccess(`${t("welcome")}, ${user.name}! 🏡`);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.msg || "Registration failed";
      notifyError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-hidden">
      {/* Decorative background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Showcase Side (Desktop) */}
      <div className="hidden lg:flex w-[55%] bg-[#064E3B] relative overflow-hidden items-center justify-center p-20 text-white shadow-2xl">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[1000px] h-[1000px] bg-emerald-400/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40"></div>
        </div>

        <div className="relative z-10 max-w-xl text-center space-y-10">
          <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl px-6 py-2.5 rounded-full border border-white/10 shadow-2xl animate-fade-in">
             <User className="w-5 h-5 text-emerald-400" />
             <span className="text-[10px] font-black text-emerald-100 uppercase tracking-[0.4em]">Community Registration</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-7xl font-black tracking-tighter leading-none drop-shadow-2xl">
               Join <span className="text-emerald-400">GramPulse</span>
            </h1>
            <p className="text-xl text-emerald-100/60 leading-relaxed font-medium max-w-lg mx-auto">
               Be part of a smarter, more connected village. Start your journey towards transparent governance today.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 text-left">
            {[
              { icon: CheckCircle, title: "Official Access", desc: "Gain direct access to your village ward and authorities." },
              { icon: Zap, title: "Real-time Impact", desc: "Your reports go directly to the Sarpanch and GramSevak desks." }
            ].map((feat, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 flex items-start gap-5 hover:bg-white/10 transition-all group">
                 <div className="bg-emerald-500/20 p-4 rounded-2xl group-hover:scale-110 transition-transform shadow-xl border border-emerald-500/20 text-emerald-400">
                    <feat.icon className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-lg font-black text-white mb-1">{feat.title}</h3>
                    <p className="text-emerald-100/50 text-sm leading-relaxed">{feat.desc}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Registration Form Side */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-12 relative z-10 py-12 overflow-y-auto no-scrollbar">
        <div className="w-full max-w-sm space-y-10 animate-fade-in-up">
          <div className="text-center space-y-4">
             <div className="lg:hidden inline-block bg-[#064E3B] p-6 rounded-[2rem] shadow-2xl shadow-emerald-900/20 mb-6 transition-transform hover:rotate-3">
                <Sparkles className="w-10 h-10 text-emerald-400" />
             </div>
             <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none">Sign Up</h2>
             <p className="text-slate-400 font-bold text-lg">Create your official citizen profile.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t("fullName")}</label>
                <div className="relative group">
                   <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                   <input
                     type="text"
                     placeholder="John Doe"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900 placeholder-slate-300 text-sm shadow-inner"
                     disabled={loading}
                   />
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t("mobile")}</label>
                <div className="relative group">
                   <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                   <input
                     type="tel"
                     placeholder="9876543210"
                     value={mobile}
                     onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                     maxLength="10"
                     className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900 placeholder-slate-300 text-sm shadow-inner"
                     disabled={loading}
                   />
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t("password")}</label>
                <div className="relative group">
                   <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                   <input
                     type="password"
                     placeholder="••••••••"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900 placeholder-slate-300 text-sm shadow-inner"
                     disabled={loading}
                   />
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t("villageName")}</label>
                <div className="relative group">
                   <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                   <input
                     type="text"
                     placeholder="e.g. Ralegan Siddhi"
                     value={village}
                     onChange={(e) => setVillage(e.target.value)}
                     className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900 placeholder-slate-300 text-sm shadow-inner"
                     disabled={loading}
                   />
                </div>
             </div>

             <button
               type="submit"
               disabled={loading}
               className="w-full mt-4 py-5 bg-[#064E3B] text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-emerald-900/40 hover:shadow-emerald-500/50 hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center gap-4 group disabled:opacity-70 disabled:cursor-wait"
             >
               {loading ? (
                 <><Loader className="w-5 h-5 animate-spin" /> Finalizing Profile...</>
               ) : (
                 <>
                   {t("register")}
                   <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                 </>
               )}
             </button>
          </form>

          <div className="text-center pt-8 border-t border-slate-100">
             <p className="text-slate-400 font-bold text-sm">
               {t("haveAccount")}{" "}
               <button onClick={() => navigate("/")} className="text-emerald-600 font-black uppercase tracking-widest text-xs hover:text-emerald-700 hover:underline transition-all">
                  {t("login")}
               </button>
             </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

export default Register;