import {
  GraduationCap,
  Home,
  LogIn,
  LogOut,
  Moon,
  Sun,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/useAppContext";

const NavbarD = () => {
  const { isAuthenticated, currentUser, logout } = useAppContext();
  const location = useLocation();
  const [theme, setTheme] = useState("business");
  const [mounted, setMounted] = useState(false);

  const path = location.pathname;

  // Theme initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "business";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const toggleTheme = () => {
    const newTheme = theme === "business" ? "dark" : "business";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  if (!mounted) return null;

  return (
    <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          <img
            className="w-10 h-10 rounded-full"
            src="https://office-course.vercel.app/assets/images/logo/logo.jpg"
            alt=""
          />
          Earn IT Skill <span className="text-sm text-gray-400">(Offline)</span>
        </Link>
      </div>

      <div className="flex-none gap-2">
        {/* Home Link */}
        {isAuthenticated && path !== "/" && (
          <Link to="/" className="btn btn-ghost btn-sm">
            <Home className="w-4 h-4 mr-1" />
            হোম
          </Link>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="btn btn-ghost btn-circle btn-sm mr-4"
          title="Toggle theme"
        >
          {theme === "business" ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </button>

        {isAuthenticated ? (
          <>
            {/* User Dropdown */}
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={currentUser?.image}
                    alt={currentUser?.name}
                    onError={(e) => {
                      e.target.src = "#";
                    }}
                  />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-300"
              >
                <li className="menu-title">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {currentUser?.name}
                  </span>
                </li>
                <li className="menu-title text-xs text-gray-500">
                  <span>{currentUser?.email}</span>
                </li>
                <li>
                  <Link to="/dashboard/student/profile">প্রোফাইল</Link>
                </li>
                <li className="menu-title text-xs">
                  <span className="badge badge-primary badge-sm">
                    {currentUser?.role === "admin" ? "👨‍💼 Admin" : "Student"}
                  </span>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <Link
                    to={
                      currentUser?.role === "admin"
                        ? "/dashboard/admin"
                        : "/dashboard/student"
                    }
                    className="hover:bg-primary hover:text-white"
                  >
                    <GraduationCap className="w-4 h-4" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <a
                    onClick={handleLogout}
                    className="hover:bg-error hover:text-white"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm">
            <LogIn className="w-4 h-4 mr-1" />
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default NavbarD;
