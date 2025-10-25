import {
  BookOpen,
  Calendar,
  FileText,
  Home,
  LayoutDashboard,
  Search,
  Settings,
  Trophy,
  User,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/useAppContext";

const Sidebar = () => {
  const { currentUser, setIsSideMenu, enrollments } = useAppContext();
  const location = useLocation();

  const isEnrolled =
    currentUser?.role === "student" &&
    enrollments?.some(
      (enrollment) => enrollment.studentId === currentUser?._id
    );

  // Admin Menu Items
  const adminMenuItems = [
    {
      path: "/dashboard/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      isDash: true,
    },
    // {
    //   path: "/dashboard/admin/students",
    //   label: "Students",
    //   icon: Users,
    //   isDash: false,
    // },
    // {
    //   path: "/dashboard/admin/courses",
    //   label: "Courses",
    //   icon: BookOpen,
    //   isDash: false,
    // },
    // {
    //   path: "/dashboard/admin/batches",
    //   label: "Batches",
    //   icon: GraduationCap,
    //   isDash: false,
    // },
    // {
    //   path: "/dashboard/admin/enrollments",
    //   label: "Enrollments",
    //   icon: UserCheck,
    //   isDash: false,
    // },
    // {
    //   path: "/dashboard/admin/payments",
    //   label: "Payments",
    //   icon: DollarSign,
    //   isDash: false,
    // },
    // {
    //   path: "/dashboard/admin/attendance",
    //   label: "Attendance",
    //   icon: Calendar,
    //   isDash: false,
    // },
    // {
    //   path: "/dashboard/admin/quizzes",
    //   label: "Quizzes",
    //   icon: ClipboardList,
    //   isDash: false,
    // },
    {
      path: "/dashboard/admin/students/search",
      label: "Students Search",
      icon: Search,
      isDash: false,
    },
    {
      path: "/dashboard/admin/chapter-schedules",
      label: "Quiz Schedules",
      icon: Calendar,
      isDash: false,
    },
    {
      path: "/dashboard/admin/batch-details",
      label: "Batch Details",
      icon: Search,
      isDash: false,
    },
    {
      path: "/dashboard/admin/quiz-results",
      label: "Quiz Results",
      icon: Trophy,
      isDash: false,
    },
    {
      path: "/dashboard/admin/rankings",
      label: "Rankings",
      icon: Trophy,
      isDash: false,
    },
    {
      path: "/dashboard/admin/cq",
      label: "CQ Questions",
      icon: FileText,
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
      label: "ডেশবোর্ড",
      icon: LayoutDashboard,
      isDash: true,
      requiredEnrollment: false,
    },
    // {
    //   path: "/dashboard/student/courses",
    //   label: "My Courses",
    //   icon: BookOpen,
    //   isDash: false,
    // },
    // {
    //   path: "/dashboard/student/payments",
    //   label: "Payments",
    //   icon: DollarSign,
    //   isDash: false,
    // },
    // {
    //   path: "/dashboard/student/attendance",
    //   label: "Attendance",
    //   icon: Calendar,
    //   isDash: false,
    // },
    // {
    //   path: "/dashboard/student/quizzes",
    //   label: "Quizzes",
    //   icon: Award,
    //   isDash: false,
    // },
    {
      path: "/dashboard/student/profile",
      label: "আমার প্রোপাইল",
      icon: User,
      isDash: false,
      requiredEnrollment: false,
    },
    {
      path: "/dashboard/student/ranks",
      label: "ক্লাস MCQ অবস্থান",
      icon: Trophy,
      isDash: false,
      requiredEnrollment: true,
    },
    {
      path: "/dashboard/student/cq",
      label: "সৃজনশীল প্রশ্ন",
      icon: FileText,
      isDash: false,
      requiredEnrollment: true,
    },
    {
      path: "/dashboard/student/test-quiz",
      label: "আমাকে যাচাই করি",
      icon: BookOpen,
      isDash: false,
      requiredEnrollment: false,
    },
    {
      path: "/dashboard/student/practice-quiz",
      label: "MCQ পরীক্ষা",
      icon: BookOpen,
      isDash: false,
      requiredEnrollment: true,
    },
    {
      path: "/dashboard/student/quiz-results",
      label: "MCQ রেজাল্ট",
      icon: Trophy,
      isDash: false,
      requiredEnrollment: true,
    },
    {
      path: "/dashboard/student/rankings",
      label: "MCQ পরীক্ষার অবস্থান",
      icon: Trophy,
      isDash: false,
      requiredEnrollment: true,
    },
  ];

  let menuItems =
    currentUser?.role === "admin" ? adminMenuItems : studentMenuItems;

  if (currentUser?.role === "student") {
    menuItems = studentMenuItems.filter((item) => {
      // যদি item-এর requiredEnrollment: true থাকে এবং isEnrolled: false হয়, তবে এটিকে বাদ দিন
      if (item.requiredEnrollment && !isEnrolled) {
        return false;
      }
      return true;
    });
  }

  return (
    <div className="drawer-side">
      <label htmlFor="my-drawer" className="drawer-overlay"></label>
      <div className="menu p-4 w-64 min-h-full bg-base-100 text-base-content shadow-xl">
        {/* Sidebar Header */}
        <div className="mb-6 p-4 bg-gradient-to-r from-primary to-secondary rounded-lg text-white">
          <Link to="/" className="flex items-center gap-2">
            <Home className="w-6 h-6" />
            <div>
              <h2 className="font-bold text-lg">আর্ন IT স্কিল</h2>
              <p className="text-xs opacity-80">
                {currentUser?.role === "admin"
                  ? "এডমিন প্যানেল"
                  : "ছাত্র/ছাত্রী প্যানেল"}
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
