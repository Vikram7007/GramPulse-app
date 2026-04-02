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
    <div className="flex min-h-screen bg-white lg:bg-gray-50 font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-hidden">
      {/* Decorative Blobs for Mobile */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-teal-50 rounded-full blur-3xl opacity-40"></div>
      </div>

      {/* Left Decoration Side (Desktop) */}
      <div className="hidden lg:flex w-[55%] bg-[#064E3B] relative overflow-hidden items-center justify-center p-16 text-white shadow-2xl">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#064E3B]/50 to-black/40"></div>
        </div>

        <div className="relative z-10 max-w-xl text-center">
          <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl px-6 py-2 rounded-full border border-white/10 mb-10 shadow-2xl animate-fadeInDown">
            <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            <span className="text-xs font-black text-emerald-100 uppercase tracking-[0.3em]">Smart Village V2.0</span>
          </div>

          <h1 className="text-7xl font-black mb-8 leading-none tracking-tighter drop-shadow-2xl font-display">
            Gram <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Pulse</span>
          </h1>
          <p className="text-xl text-emerald-100/70 leading-relaxed mb-12 font-medium max-w-lg mx-auto">
            Empowering more than 10,000 villagers through next-gen digital connectivity. Your voice, your village, your future.
          </p>

          <div className="grid grid-cols-1 gap-6 text-left">
            {[
              { icon: ShieldCheck, title: "Secure Infrastructure", desc: "Military-grade encryption for all community records and reports." },
              { icon: Zap, title: "Real-time Connectivity", desc: "Instant notifications and updates from your local Gram Panchayat." }
            ].map((feat, i) => (
              <div key={i} className="bg-white/5 p-6 rounded-[2.5rem] backdrop-blur-xl border border-white/10 flex items-start gap-5 hover:bg-white/10 transition-all group cursor-default">
                <div className="bg-emerald-500/20 p-4 rounded-2xl group-hover:scale-110 transition-transform shadow-lg border border-emerald-500/20">
                  <feat.icon className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white mb-1 tracking-tight">{feat.title}</h3>
                  <p className="text-emerald-100/60 text-sm leading-relaxed font-medium">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 flex items-center justify-center gap-6 text-[10px] font-black text-emerald-100/30 uppercase tracking-[0.4em]">
            <span>© 2024 Project GramPulse</span>
            <span className="w-1 h-1 rounded-full bg-emerald-600/30"></span>
            <span>Enterprise Terms</span>
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-sm animate-springUp">
          <div className="text-center mb-12">
            <div className="inline-block bg-emerald-50 p-4 rounded-3xl mb-8 lg:hidden shadow-xl shadow-emerald-500/10 border border-emerald-100/50">
              <LogIn className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-3 tracking-tighter drop-shadow-sm">{t("login")}</h2>
            <p className="text-slate-400 font-bold text-lg leading-tight">Welcome back to GramPulse.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] font-black text-slate-300 uppercase tracking-widest">{t("mobile")}</label>
                <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-black text-emerald-600 uppercase tracking-tighter">
                   <ShieldCheck className="w-3 h-3" /> Encrypted
                </div>
              </div>
              <div className="relative group">
                <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  maxLength="10"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900 placeholder-slate-300 text-lg shadow-inner"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] font-black text-slate-300 uppercase tracking-widest">{t("password")}</label>
                <button type="button" className="text-[11px] text-emerald-600 hover:text-emerald-700 hover:underline font-black uppercase tracking-widest transition-colors">Forgot?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-slate-50/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900 placeholder-slate-300 text-lg shadow-inner"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-gradient-to-br from-[#064E3B] via-emerald-600 to-teal-500 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-emerald-900/40 hover:shadow-emerald-500/50 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-4 group disabled:opacity-70 disabled:cursor-wait"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  {t("loggingIn")}...
                </>
              ) : (
                <>
                  {t("login")}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center pt-8 border-t border-slate-50">
            <p className="text-slate-400 font-bold text-sm">
              {t("noAccount")}{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-emerald-600 font-black hover:text-emerald-700 hover:underline inline-flex items-center gap-2 transition-colors ml-2 uppercase tracking-widest text-xs"
              >
                {t("register")} <ArrowRight className="w-4 h-4 translate-y-[1px]" />
              </button>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes springUp {
          from { opacity: 0; transform: scale(0.9) translateY(60px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-springUp {
          animation: springUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Login;