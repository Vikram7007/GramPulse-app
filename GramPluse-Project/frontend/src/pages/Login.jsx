import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notifySuccess, notifyError } from "../components/NotificationToast";
import { useTranslation } from "react-i18next";
import api from "../utils/api";
import { Smartphone, Lock, ArrowRight, Loader, LogIn, ShieldCheck, User, Zap, Sparkles } from "lucide-react";

function Login() {
  const { t } = useTranslation();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!mobile || !password) {
      notifyError(t("error.fillFields") || "Please fill all fields");
      return;
    }

    if (mobile.length !== 10) {
      notifyError(t("error.invalidMobile") || "Mobile must be 10 digits");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        mobile,
        password,
      });

      const { user } = res.data;
      login(user);

      notifySuccess(`${t("welcome") || "Welcome"}, ${user.name}! 🏡`);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.msg || "Login failed, try again";
      notifyError(msg);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-hidden">
      {/* Decorative background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Showcase Side (Desktop) */}
      <div className="hidden lg:flex w-[55%] bg-[#064E3B] relative overflow-hidden items-center justify-center p-20 text-white shadow-2xl">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-emerald-400/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40"></div>
        </div>

        <div className="relative z-10 max-w-xl text-center space-y-10">
          <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl px-6 py-2.5 rounded-full border border-white/10 shadow-2xl animate-fade-in">
             <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
             <span className="text-[10px] font-black text-emerald-100 uppercase tracking-[0.4em]">GramPulse v2.0 Platform</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-7xl font-black tracking-tighter leading-none drop-shadow-2xl">
               Rural <span className="text-emerald-400">Excellence</span>
            </h1>
            <p className="text-xl text-emerald-100/60 leading-relaxed font-medium max-w-lg mx-auto">
               Empowering rural communities through intelligent digital infrastructure and transparent governance.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 text-left">
            {[
              { icon: ShieldCheck, title: "Verified Identity", desc: "Enterprise-grade security for every village citizen." },
              { icon: Zap, title: "Instant Access", desc: "Access reports, notices, and services in real-time." }
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

      {/* Login Form Side */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-sm space-y-10 animate-fade-in-up">
          <div className="text-center space-y-4">
             <div className="lg:hidden inline-block bg-[#064E3B] p-6 rounded-[2rem] shadow-2xl shadow-emerald-900/20 mb-6 transition-transform hover:rotate-3">
                <LogIn className="w-10 h-10 text-emerald-400" />
             </div>
             <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none">Welcome</h2>
             <p className="text-slate-400 font-bold text-lg">Log in to your citizen portal.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
             <div className="space-y-2.5">
                <div className="flex justify-between items-center px-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("mobile")}</label>
                   <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 uppercase tracking-tighter">Secure Link</span>
                </div>
                <div className="relative group">
                   <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                   <input
                     type="tel"
                     placeholder="9876543210"
                     value={mobile}
                     onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                     maxLength="10"
                     className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900 placeholder-slate-300 text-lg shadow-inner"
                     disabled={loading}
                   />
                </div>
             </div>

             <div className="space-y-2.5">
                <div className="flex justify-between items-center px-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("password")}</label>
                   <button type="button" className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest transition-colors tracking-tight">Recover Asset</button>
                </div>
                <div className="relative group">
                   <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                   <input
                     type="password"
                     placeholder="••••••••"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900 placeholder-slate-300 text-lg shadow-inner"
                     disabled={loading}
                   />
                </div>
             </div>

             <button
               type="submit"
               disabled={loading}
               className="w-full py-5 bg-[#064E3B] text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-emerald-900/40 hover:shadow-emerald-500/50 hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center gap-4 group disabled:opacity-70 disabled:cursor-wait"
             >
               {loading ? (
                 <><Loader className="w-5 h-5 animate-spin" /> Transmitting...</>
               ) : (
                 <>
                   {t("login")}
                   <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                 </>
               )}
             </button>
          </form>

          <div className="text-center pt-8 border-t border-slate-100">
             <p className="text-slate-400 font-bold text-sm">
               {t("noAccount")}{" "}
               <button onClick={() => navigate("/register")} className="text-emerald-600 font-black uppercase tracking-widest text-xs hover:text-emerald-700 hover:underline transition-all">
                  {t("register")}
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
      `}</style>
    </div>
  );
}

export default Login;