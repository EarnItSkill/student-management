import { Navigate, Route, Routes } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";

// Pages
import StudentForm from "../components/students/StudentForm";
import StudentList from "../components/students/StudentList";
import AdminDashboard from "../pages/AdminDashboard";
import Home from "../pages/Home";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, currentUser } = useAppContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && currentUser?.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<StudentForm />} />

      {/* Protected Admin Routes */}
      <Route
        path="/dashboard/student"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      >
        <Route path="ranks" element={<RankPage />} />
      </Route>

      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        <Route path="students" element={<StudentList />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
