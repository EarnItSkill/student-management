import {
  ChevronDown,
  GraduationCap,
  Home,
  LogIn,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/useAppContext";

const Navbar = () => {
  const { isAuthenticated, currentUser, logout } = useAppContext();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navDropdownOpen, setNavDropdownOpen] = useState(false);

  const path = location.pathname;

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const handleSmoothScroll = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
      setNavDropdownOpen(false);
    }
  };

  const navigationLinks = [
    { label: "কোর্স", id: "courses" },
    { label: "আসন্ন ব্যাচসমূহ", id: "batch-schedule" },
    { label: "MCQ কুইজ", id: "mcq-quiz" },
    { label: "শিক্ষা ব্যবস্থা", id: "course-process" },
    { label: "শিক্ষক", id: "instructor" },
    { label: "যোগাযোগ", id: "contact" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 ${
        isScrolled
          ? "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 shadow-xl"
          : "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-300 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <img
                className="relative w-10 h-10 rounded-full border-2 border-slate-700"
                src="https://office-course.vercel.app/assets/images/logo/logo.jpg"
                alt="Logo"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Earn IT Skill
              </h1>
              <p className="text-xs text-slate-400">(ICT-Ofline)</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Navigation Dropdown */}
            {location.pathname === "/" && (
              <div className="dropdown dropdown-end">
                <button
                  tabIndex={0}
                  className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-300 text-sm font-semibold flex items-center gap-2 group"
                >
                  📚 বিষয়বস্তু
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                </button>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-3 shadow-2xl bg-slate-800 rounded-xl w-56 border border-slate-700 backdrop-blur-xl"
                >
                  {navigationLinks.map((link) => (
                    <li key={link.id}>
                      <button
                        onClick={() => handleSmoothScroll(link.id)}
                        className="hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all rounded-lg"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Home Link */}
            {isAuthenticated && path !== "/" && (
              <Link
                to="/"
                className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-300 flex items-center gap-2 group"
              >
                <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold">হোম</span>
              </Link>
            )}

            {isAuthenticated ? (
              <>
                {/* User Dropdown */}
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    className="btn btn-ghost btn-circle avatar hover:ring-2 hover:ring-blue-500 transition-all"
                  >
                    <div className="w-10 rounded-full ring-2 ring-slate-600 hover:ring-blue-500">
                      <img
                        src={currentUser?.image}
                        alt={currentUser?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-3 shadow-2xl bg-slate-800 rounded-xl w-64 border border-slate-700 backdrop-blur-xl"
                  >
                    {/* User Info */}
                    <li className="px-3 py-2 mb-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={currentUser?.image}
                          alt={currentUser?.name}
                          className="w-12 h-12 rounded-lg ring-2 ring-slate-600"
                        />
                        <div>
                          <p className="font-bold text-white text-sm">
                            {currentUser?.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {currentUser?.email}
                          </p>
                          <Link to="/dashboard/student/profile">প্রোফাইল</Link>
                          <div className="mt-2">
                            <span
                              className={`badge text-xs px-2 py-1 ${
                                currentUser?.role === "admin"
                                  ? "badge-primary bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                                  : "badge-info bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                              }`}
                            >
                              {currentUser?.role === "admin"
                                ? "👨‍💼 Admin"
                                : "👨‍🎓 Student"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>

                    <div className="divider my-2"></div>

                    {/* Dashboard Link */}
                    <li>
                      <Link
                        to={
                          currentUser?.role === "admin"
                            ? "/dashboard/admin"
                            : "/dashboard/student"
                        }
                        className="flex items-center gap-2 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all rounded-lg"
                      >
                        <GraduationCap className="w-4 h-4" />
                        <span className="font-semibold">Dashboard</span>
                      </Link>
                    </li>

                    {/* Logout */}
                    <li>
                      <a
                        onClick={handleLogout}
                        className="flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all rounded-lg cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="font-semibold">Logout</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-300" />
            ) : (
              <Menu className="w-6 h-6 text-slate-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 space-y-2 animate-in fade-in duration-200">
            {/* Mobile Navigation Links */}
            {location.pathname === "/" && (
              <div className="space-y-2 border-b border-slate-700 pb-4">
                <button
                  onClick={() => setNavDropdownOpen(!navDropdownOpen)}
                  className="w-full text-left px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all flex items-center justify-between"
                >
                  <span>📚 বিষয়বস্তু</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      navDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {navDropdownOpen && (
                  <div className="space-y-1 pl-4 border-l border-slate-600">
                    {navigationLinks.map((link) => (
                      <button
                        key={link.id}
                        onClick={() => handleSmoothScroll(link.id)}
                        className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all text-sm"
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {isAuthenticated && path !== "/" && (
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all"
              >
                <Home className="w-4 h-4 inline mr-2" />
                হোম
              </Link>
            )}

            {isAuthenticated ? (
              <>
                <div className="px-4 py-3 bg-slate-700/30 rounded-lg border border-slate-600">
                  <p className="text-sm font-semibold text-white">
                    {currentUser?.name}
                  </p>
                  <p className="text-xs text-slate-400">{currentUser?.email}</p>
                  <span
                    className={`inline-block mt-2 badge text-xs px-2 py-1 ${
                      currentUser?.role === "admin"
                        ? "badge-primary"
                        : "badge-info"
                    }`}
                  >
                    {currentUser?.role === "admin" ? "Admin" : "Student"}
                  </span>
                </div>

                <Link
                  to={
                    currentUser?.role === "admin"
                      ? "/dashboard/admin"
                      : "/dashboard/student"
                  }
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all"
                >
                  <GraduationCap className="w-4 h-4 inline mr-2" />
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded-lg text-slate-300 hover:bg-red-600/20 hover:text-red-400 transition-all"
                >
                  <LogOut className="w-4 h-4 inline mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-center"
              >
                <LogIn className="w-4 h-4 inline mr-2" />
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
