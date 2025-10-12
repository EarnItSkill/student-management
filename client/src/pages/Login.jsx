import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"; // lucide-react আইকন
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";

const Login = () => {
  const { login, isAuthenticated, currentUser } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleGoogleLogin = async () => {
    try {
      // const result = await loginWithGoogle(); // তোমার context ফাংশন
      // if (result.success) navigate("/dashboard");
    } catch (err) {
      console.log(err);
      setError("Google লগইনে সমস্যা হয়েছে");
    }
  };

  const handleGithubLogin = async () => {
    try {
      // const result = await loginWithGoogle(); // তোমার context ফাংশন
      // if (result.success) navigate("/dashboard");
    } catch (err) {
      console.log(err);
      setError("Google লগইনে সমস্যা হয়েছে");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.email || !formData.password) {
      setError("সব ফিল্ড পূরণ করুন");
      setLoading(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-600">লগইন করুন</h1>
          <p className="text-gray-500 mt-2">আপনার অ্যাকাউন্টে প্রবেশ করুন</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1">ইমেইল</label>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-gray-800 mb-1">পাসওয়ার্ড</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition font-semibold"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2 text-gray-400 text-sm">অথবা</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleGoogleLogin} // 🔹 এই ফাংশনটি তুমি context বা auth ফাইলে ডিফাইন করবে
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-gray-700 font-medium">Google দিয়ে লগইন</span>
          </button>

          <button
            type="button"
            onClick={handleGithubLogin} // 🔹 এটাও context/auth এ যোগ করবে
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition"
          >
            <img
              src="https://www.svgrepo.com/show/512317/github-142.svg"
              alt="GitHub"
              className="w-5 h-5"
            />
            <span className="text-gray-700 font-medium">GitHub দিয়ে লগইন</span>
          </button>
        </div>

        <div className="text-center mt-6 text-sm gap-4">
          <a href="/" className="text-indigo-600 hover:underline">
            ← হোমপেজে
          </a>
          <span className="font-bold text-sm text-blue-500 px-4">অথবা</span>
          <Link className="text-indigo-600 hover:underline" to="/registration">
            রেজিস্ট্রেশন →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
