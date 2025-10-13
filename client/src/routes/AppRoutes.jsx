import { Navigate, Route, Routes } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";

// Pages
import AttendanceList from "../components/attendence/AttendanceList";
import BatchList from "../components/batches/BatchList";
import CourseList from "../components/courses/CourseList";
import EnrollmentList from "../components/enrollments/EnrollmentList";
import PaymentList from "../components/payments/PaymentList";
import QuizList from "../components/quizzes/QuizList";
import Settings from "../components/settings/settings";
import StudentList from "../components/students/StudentList";
import AdminChapterSchedule from "../pages/admin/AdminChapterSchedule";
import AdminQuizResults from "../pages/admin/AdminQuizResults";
import AdminDashboard from "../pages/AdminDashboard";
import CourseDetails from "../pages/CourseDetails";
import Home from "../pages/Home";
import Login from "../pages/Login";
import McqRankPage from "../pages/McqRankPage";
import NotFound from "../pages/NotFound";
import RankPage from "../pages/RankPage";
import Registration from "../pages/Registration";
import StudentDashboard from "../pages/StudentDashboard";
import StudentDetails from "../pages/StudentDetails";
import StudentProfile from "../pages/StudentProfilePage";
import StudentQuizPage from "../pages/StudentQuizPage";
import StudentQuizResults from "../pages/StudentQuizResults";
import StudentSearch from "../pages/StudentSearch";
import TestQuiz from "../pages/TestQuiz";

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
      <Route path="/course/:id" element={<CourseDetails />} />
      <Route path="/registration" element={<Registration />} />

      {/* Protected Student Routes */}
      <Route
        path="/dashboard/student"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      >
        {/* <Route index element={<StudentOverview />} />
        <Route path="courses" element={<StudentCourses />} />
        <Route path="payments" element={<StudentPayments />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="quizzes" element={<StudentQuizzes />} /> */}

        <Route path="profile" element={<StudentProfile />} />
        <Route path="test-quiz" element={<TestQuiz />} />
        <Route path="practice-quiz" element={<StudentQuizPage />} />
        <Route path="quiz-results" element={<StudentQuizResults />} />
        <Route path="rankings" element={<McqRankPage />} />
        <Route path="ranks" element={<RankPage />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        <Route path="students" element={<StudentList />} />
        <Route path="courses" element={<CourseList />} />
        <Route path="batches" element={<BatchList />} />
        <Route path="payments" element={<PaymentList />} />
        <Route path="attendance" element={<AttendanceList />} />
        <Route path="enrollments" element={<EnrollmentList />} />
        <Route path="quizzes" element={<QuizList />} />
        <Route path="chapter-schedules" element={<AdminChapterSchedule />} />
        <Route path="quiz-results" element={<AdminQuizResults />} />
        <Route path="rankings" element={<McqRankPage />} />
        <Route path="settings" element={<Settings />} />
        <Route
          path="/dashboard/admin/students/search"
          element={
            <ProtectedRoute allowedRole="admin">
              <StudentSearch />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/admin/students/:id"
          element={
            <ProtectedRoute allowedRole="admin">
              <StudentDetails />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      /> */}

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
