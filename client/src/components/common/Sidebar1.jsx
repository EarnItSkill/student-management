import {
  Award,
  BookOpen,
  Calendar,
  ClipboardList,
  DollarSign,
  GraduationCap,
  Home,
  LayoutDashboard,
  Settings,
  UserCheck,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/useAppContext";

const Sidebar = () => {
  const { currentUser, setIsSideMenu } = useAppContext();
  const location = useLocation();

  // Admin Menu Items
  const adminMenuItems = [
    {
      path: "/dashboard/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      isDash: true,
    },
    {
      path: "/dashboard/admin/students",
      label: "Students",
      icon: Users,
      isDash: false,
    },
    {
      path: "/dashboard/admin/courses",
      label: "Courses",
      icon: BookOpen,
      isDash: false,
    },
    {
      path: "/dashboard/admin/batches",
      label: "Batches",
      icon: GraduationCap,
      isDash: false,
    },
    {
      path: "/dashboard/admin/enrollments",
      label: "Enrollments",
      icon: UserCheck,
      isDash: false,
    },
    {
      path: "/dashboard/admin/payments",
      label: "Payments",
      icon: DollarSign,
      isDash: false,
    },
    {
      path: "/dashboard/admin/attendance",
      label: "Attendance",
      icon: Calendar,
      isDash: false,
    },
    {
      path: "/dashboard/admin/quizzes",
      label: "Quizzes",
      icon: ClipboardList,
      isDash: false,
    },
    {
      path: "/dashboard/admin/settings",
      label: "Settings",
      icon: Settings,
      isDash: false,
    },
  ];

  // Student Menu Items
  const studentMenuItems = [
    {
      path: "/dashboard/student",
      label: "Dashboard",
      icon: LayoutDashboard,
      isDash: true,
    },
    {
      path: "/dashboard/student/courses",
      label: "My Courses",
      icon: BookOpen,
      isDash: false,
    },
    {
      path: "/dashboard/student/payments",
      label: "Payments",
      icon: DollarSign,
      isDash: false,
    },
    {
      path: "/dashboard/student/attendance",
      label: "Attendance",
      icon: Calendar,
      isDash: false,
    },
    {
      path: "/dashboard/student/quizzes",
      label: "Quizzes",
      icon: Award,
      isDash: false,
    },
  ];

  const menuItems =
    currentUser?.role === "admin" ? adminMenuItems : studentMenuItems;

  return (
    <div className="drawer-side">
      <label htmlFor="my-drawer" className="drawer-overlay"></label>
      <div className="menu p-4 w-64 min-h-full bg-base-100 text-base-content shadow-xl">
        {/* Sidebar Header */}
        <div className="mb-6 p-4 bg-gradient-to-r from-primary to-secondary rounded-lg text-white">
          <Link to="/" className="flex items-center gap-2">
            <Home className="w-6 h-6" />
            <div>
              <h2 className="font-bold text-lg">Training Center</h2>
              <p className="text-xs opacity-80">
                {currentUser?.role === "admin"
                  ? "Admin Panel"
                  : "Student Panel"}
              </p>
            </div>
          </Link>
        </div>

        {/* Menu Items */}
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  onClick={() => setIsSideMenu(item?.isDash)}
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-primary text-white font-semibold"
                      : "hover:bg-base-200"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Sidebar Footer */}
        <div className="mt-auto pt-6 border-t border-base-300">
          <div className="p-4 bg-base-200 rounded-lg">
            <p className="text-xs text-gray-400">Logged in as</p>
            <p className="font-semibold text-sm">{currentUser?.name}</p>
            <p className="text-xs text-gray-500">{currentUser?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
