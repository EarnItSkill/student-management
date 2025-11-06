import {
  AlertCircle,
  Eye,
  EyeOff,
  Home,
  Loader2,
  Lock,
  Mail,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";

const Login = () => {
  const { login, isAuthenticated, currentUser } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  // Redirect if already logged in
  if (isAuthenticated) {
    return (
      <Navigate
        to={
          currentUser?.role === "admin"
            ? "/dashboard/admin"
            : "/dashboard/student"
        }
        replace
      />
    );
  }

  // const handleGoogleLogin = async () => {
  //   try {
  //     // const result = await loginWithGoogle();
  //     // if (result.success) navigate("/dashboard");
  //   } catch (err) {
  //     console.log(err);
  //     setError("Google লগইনে সমস্যা হয়েছে");
  //   }
  // };

  // const handleGithubLogin = async () => {
  //   try {
  //     // const result = await loginWithGithub();
  //     // if (result.success) navigate("/dashboard");
  //   } catch (err) {
  //     console.log(err);
  //     setError("GitHub লগইনে সমস্যা হয়েছে");
  //   }
  // };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCount(count + 1);

    if (!formData.identifier || !formData.password) {
      setError("সব ফিল্ড পূরণ করুন");
      setLoading(false);
      return;
    }

    try {
      const result = await login(formData.identifier, formData.password);

      if (result.success) {
        if (result.user.role === "admin") {
          navigate("/dashboard/admin");
        } else {
          navigate("/dashboard/student");
        }
      } else {
        setError(result.message || "লগইন ব্যর্থ হয়েছে");
      }
    } catch (err) {
      console.log(err);
      setError("সার্ভারে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 opacity-10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="relative group">
          {/* Glowing Background */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-20 group-hover:opacity-30 rounded-2xl blur-xl transition-opacity duration-500"></div>

          {/* Form Container */}
          <div className="relative bg-slate-800 bg-opacity-80 backdrop-blur-xl rounded-2xl border border-slate-700 p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-block mb-4 p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-black text-white mb-2">লগইন করুন</h1>
              <p className="text-slate-400">
                আপনার অ্যাকাউন্টে প্রবেশ করুন এবং শিখতে শুরু করুন
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-600/20 border border-red-600/50 rounded-xl flex items-start gap-3 animate-in fade-in duration-300">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Forgot Password Link */}
            {count > 3 && (
              <div className="mb-6 p-4 bg-blue-600/20 border border-blue-600/50 rounded-xl">
                <Link
                  to="/forgot"
                  className="flex items-center justify-between text-blue-300 hover:text-blue-200 transition-colors font-semibold"
                >
                  <span>🔑 ইউজার নেম বা পাসওয়ার্ড ভুলে গেছেন?</span>
                  <span>→</span>
                </Link>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 mb-6">
              {/* Email/Phone Input */}
              <div>
                <label className="block text-white font-semibold mb-2 text-sm">
                  ইমেইল অথবা ফোন নম্বর
                </label>
                <div className="relative group/input">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/input:text-blue-400 transition-colors" />
                  <input
                    type="text"
                    name="identifier"
                    placeholder="example@email.com অথবা 01xxx-xxx"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-slate-700/80 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    value={formData.identifier}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-white font-semibold mb-2 text-sm">
                  পাসওয়ার্ড
                </label>
                <div className="relative group/input">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/input:text-blue-400 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-slate-700/80 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none mt-6"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
              </button>
            </form>

            {/* Divider */}
            {/* <div className="flex items-center gap-3 my-6">
              <div className="flex-grow h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
              <span className="text-slate-400 text-sm font-semibold">অথবা</span>
              <div className="flex-grow h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
            </div> */}

            {/* Social Login */}
            {/* <div className="space-y-3 mb-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-700/50 border border-slate-600 hover:border-blue-500/50 hover:bg-slate-700 rounded-xl transition-all duration-300 group"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                <span className="text-slate-300 font-semibold group-hover:text-white transition-colors">
                  Google দিয়ে লগইন
                </span>
              </button>

              <button
                type="button"
                onClick={handleGithubLogin}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-700/50 border border-slate-600 hover:border-purple-500/50 hover:bg-slate-700 rounded-xl transition-all duration-300 group"
              >
                <img
                  src="https://www.svgrepo.com/show/512317/github-142.svg"
                  alt="GitHub"
                  className="w-5 h-5"
                />
                <span className="text-slate-300 font-semibold group-hover:text-white transition-colors">
                  GitHub দিয়ে লগইন
                </span>
              </button>
            </div> */}

            {/* Footer Links */}
            <div className="border-t border-slate-700 pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                >
                  <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  হোমপেজ
                </Link>

                <div className="hidden sm:block w-1 h-1 bg-slate-600 rounded-full"></div>

                <Link
                  to="/registration"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-600/50 text-blue-300 hover:text-blue-200 rounded-lg transition-all duration-300 group font-semibold"
                >
                  <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  নতুন অ্যাকাউন্ট তৈরি করুন
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-slate-400 text-sm mt-6">
          আমরা আপনার তথ্য সুরক্ষিত রাখি। আমাদের{" "}
          <Link
            to="/privacy"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            গোপনীয়তা নীতি
          </Link>{" "}
          দেখুন।
        </p>
      </div>
    </div>
  );
};

export default Login;
