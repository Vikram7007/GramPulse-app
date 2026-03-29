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
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Left Decoration Side */}
      <div className="hidden lg:flex w-[55%] bg-emerald-900 relative overflow-hidden items-center justify-center p-16 text-white">
        {/* Decorative Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-950/80"></div>
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-emerald-800/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-emerald-700/50 mb-8 shadow-lg">
            <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
            <span className="text-sm font-bold text-emerald-100 uppercase tracking-widest">Smart Village Initiative</span>
          </div>

          <h1 className="text-6xl font-black mb-6 font-display leading-tight tracking-tight">
            Gram <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Pulse</span>
          </h1>
          <p className="text-xl text-emerald-100/90 leading-relaxed mb-10 font-medium">
            Empowering communities through digital connectivity. Your voice, your village, your future.
          </p>

          <div className="grid grid-cols-1 gap-5">
            <div className="bg-emerald-800/30 p-5 rounded-2xl backdrop-blur-md border border-emerald-700/30 flex items-start gap-4 hover:bg-emerald-800/40 transition-colors">
              <div className="bg-emerald-500/20 p-3 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Secure & Private</h3>
                <p className="text-emerald-200/80 text-sm leading-relaxed">
                  Enterprise-grade security ensuring your data and complaints remain confidential.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex items-center gap-4 text-sm text-emerald-400/60 font-medium">
            <span>© 2024 GramPulse Project</span>
            <span className="w-1 h-1 rounded-full bg-emerald-600"></span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 lg:p-12 bg-white relative">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center lg:text-left mb-10">
            <div className="inline-block bg-emerald-50 p-3 rounded-2xl mb-6 lg:hidden">
              <Sparkles className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3 tracking-tight">{t("login")}</h2>
            <p className="text-gray-500 font-medium text-lg">Your gateway to village services.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1 block">{t("mobile")}</label>
              <div className="relative group">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  maxLength="10"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-semibold text-gray-900 placeholder-gray-400"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-gray-700">{t("password")}</label>
                <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline font-bold">Forgot password?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-semibold text-gray-900 placeholder-gray-400"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  {t("loggingIn")}...
                </>
              ) : (
                <>
                  {t("login")}
                  <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-500 font-medium">
              {t("noAccount")}{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-emerald-600 font-black hover:text-emerald-700 hover:underline inline-flex items-center gap-1 transition-colors ml-1"
              >
                {t("register")}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;