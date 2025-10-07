import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";

const Login = () => {
  const { login, isAuthenticated, currentUser } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [show, setShow] = useState(false);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!formData.email || !formData.password) {
      setError("সব ফিল্ড পূরণ করুন");
      setLoading(false);
      return;
    }

    // Login attempt
    const result = login(formData.email, formData.password);

    if (result.success) {
      // Redirect based on role
      setTimeout(() => {
        if (result.user.role === "admin") {
          navigate("/dashboard/admin");
        } else {
          navigate("/dashboard/student");
        }
      }, 500);
    } else {
      setError(result.message || "লগইন ব্যর্থ হয়েছে");
      setLoading(false);
    }
  };

  // Demo credentials helper
  const fillDemo = (type) => {
    if (type === "admin") {
      setFormData({
        email: "mrmozammal@gmail.com",
        password: "admin123",
      });
    } else {
      setFormData({
        email: "karim@example.com",
        password: "student123",
      });
    }
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-primary">🎓 লগইন করুন</h1>
            <p className="text-gray-600 mt-2">আপনার অ্যাকাউন্টে প্রবেশ করুন</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-error mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">ইমেইল</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                className="input input-bordered"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">পাসওয়ার্ড</span>
              </label>
              <input
                type={`${show ? "password" : "text"}`}
                name="password"
                placeholder="••••••••"
                className="input input-bordered"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
            </button>
          </form>
          <button onClick={() => setShow(!show)}>show</button>

          <div className="divider">অথবা</div>

          {/* Demo Credentials */}
          <div className="space-y-2">
            <p className="text-sm text-center text-gray-600 mb-2">ডেমো লগইন:</p>
            <button
              onClick={() => fillDemo("admin")}
              className="btn btn-outline btn-sm w-full"
            >
              👨‍💼 Admin হিসেবে লগইন
            </button>
            <button
              onClick={() => fillDemo("student")}
              className="btn btn-outline btn-sm w-full"
            >
              🧑‍🎓 Student হিসেবে লগইন
            </button>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-4">
            <a href="/" className="link link-primary text-sm">
              ← হোমপেজে ফিরে যান
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
