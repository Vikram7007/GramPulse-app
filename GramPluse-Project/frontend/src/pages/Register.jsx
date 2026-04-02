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
    <div className="flex min-h-screen bg-white lg:bg-gray-50 font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      {/* Decorative Blobs for Mobile */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-teal-50 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute -bottom-24 right-0 w-72 h-72 bg-emerald-50 rounded-full blur-[100px] opacity-50"></div>
      </div>

      {/* Left Decoration Side (Desktop) */}
      <div className="hidden lg:flex w-[55%] bg-[#064E3B] relative overflow-hidden items-center justify-center p-16 text-white shadow-2xl">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#064E3B]/60 to-black/30"></div>
        </div>

        <div className="relative z-10 max-w-xl text-center">
          <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl px-6 py-2 rounded-full border border-white/10 mb-10 shadow-2xl animate-fadeInDown">
            <User className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-black text-emerald-100 uppercase tracking-[0.3em]">Join the Initiative</span>
          </div>

          <h1 className="text-7xl font-black mb-8 leading-none tracking-tighter drop-shadow-2xl">
            Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Journey</span>
          </h1>
          <p className="text-xl text-emerald-100/70 leading-relaxed mb-12 font-medium max-w-lg mx-auto">
            Connect with your village, report issues, and be a part of the change. It only takes a minute.
          </p>

          <div className="grid grid-cols-1 gap-6 text-left">
            {[
              { icon: CheckCircle, title: "Verified Citizens", desc: "Join a trusted network of verified villagers." },
              { icon: Shield, title: "Secure Data", desc: "Your information is protected by industry-standard encryption." }
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
            <span>Empowering Communities</span>
            <span className="w-1 h-1 rounded-full bg-emerald-600/30"></span>
            <span>Est. 2024</span>
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 lg:p-12 relative z-10 py-12 lg:py-12 no-scrollbar overflow-y-auto">
        <div className="w-full max-w-sm animate-springUp py-8">
          <div className="text-center mb-10">
            <div className="inline-block bg-emerald-50 p-4 rounded-3xl mb-8 lg:hidden shadow-xl shadow-emerald-500/10 border border-emerald-100/50">
              <Sparkles className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-3 tracking-tighter drop-shadow-sm">{t("register")}</h2>
            <p className="text-slate-400 font-bold text-lg">Create your digital village profile.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2.5">
              <label className="text-[11px] font-black text-slate-300 uppercase tracking-widest ml-1">{t("fullName")}</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900 placeholder-slate-300 text-lg shadow-inner"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[11px] font-black text-slate-300 uppercase tracking-widest ml-1">{t("mobile")}</label>
              <div className="relative group">
                <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  maxLength="10"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900 placeholder-slate-300 text-lg shadow-inner"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[11px] font-black text-slate-300 uppercase tracking-widest ml-1">{t("password")}</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900 placeholder-slate-300 text-lg shadow-inner"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[11px] font-black text-slate-300 uppercase tracking-widest ml-1">{t("villageName")}</label>
              <div className="relative group">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type="text"
                  placeholder="e.g. Ralegan Siddhi"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900 placeholder-slate-300 text-lg shadow-inner"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-5 bg-gradient-to-br from-[#064E3B] via-emerald-600 to-teal-500 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-emerald-900/40 hover:shadow-emerald-500/50 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-4 group disabled:opacity-70 disabled:cursor-wait"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  {t("registering")}...
                </>
              ) : (
                <>
                  {t("register")}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center pt-8 border-t border-slate-50">
            <p className="text-slate-400 font-bold text-sm">
              {t("haveAccount")}{" "}
              <button
                onClick={() => navigate("/")}
                className="text-emerald-600 font-black hover:text-emerald-700 hover:underline inline-flex items-center gap-2 transition-colors ml-2 uppercase tracking-widest text-xs"
              >
                {t("login")} <ArrowRight className="w-4 h-4 translate-y-[1px]" />
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
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

export default Register;