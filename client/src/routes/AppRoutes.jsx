import { Navigate, Route, Routes } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";

// Pages
import AttendanceList from "../components/attendence/AttendanceList";
import BatchList from "../components/batches/BatchList";
import UpComming from "../components/batches/UpComming";
import MarkdownEditor from "../components/common/editor/MarkdownEditor";
import MarkdownRender from "../components/common/MarkdownRender";
import PaymentForm from "../components/common/PaymentForm";
import PrivacyPolicy from "../components/common/PrivacyPolicy";
import QuizClassBrowser from "../components/common/QuizClassBrowser";
import RefundPolicy from "../components/common/RefundPolicy";
import TermsConditions from "../components/common/TermsConditions";
import CourseList from "../components/courses/CourseList";
import CourseMakeForm from "../components/courses/CourseMakeForm";
import BanglaVoiceTextarea from "../components/cq/BanglaVoiceTextarea";
import CreativeQuestionGenerator from "../components/cq/CreativeQuestionGenerator";
import EnrollmentList from "../components/enrollments/EnrollmentList";
import BatchDetails from "../components/home/BatchDetails";
import PaymentList from "../components/payments/PaymentList";
import QuizList from "../components/quizzes/QuizList";
import Settings from "../components/settings/settings";
import StudentList from "../components/students/StudentList";
import AdminChapterSchedule from "../pages/admin/AdminChapterSchedule";
import AdminQuizResults from "../pages/admin/AdminQuizResults";
import BatchDetailsPage from "../pages/admin/BatchDetailsPage";
import CourseClassesViewer from "../pages/admin/CourseClassesViewer";
import CqForm from "../pages/admin/CqForm";
import CqPageList from "../pages/admin/CqPageList";
import PaymentInfo from "../pages/admin/PaymentInfo";
import VerifiedStudentInfo from "../pages/admin/VerifiedStudentInfo";
import AdminDashboard from "../pages/AdminDashboard";
import CourseDetails from "../pages/CourseDetails";
import ForgotCredentials from "../pages/ForgotCredentials";
import Home from "../pages/Home";
import Login from "../pages/Login";
import McqPage from "../pages/McqPage";
import McqRankPage from "../pages/McqRankPage";
import NotFound from "../pages/NotFound";
import RankPage from "../pages/RankPage";
import Registration from "../pages/Registration";
import Certificates from "../pages/student/Certificates";
import StudentCqPage from "../pages/StudentCqPage";
import StudentDashboard from "../pages/StudentDashboard";
import StudentDetails from "../pages/StudentDetails";
import StudentProfile from "../pages/StudentProfilePage";
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
      <Route path="/code-render" element={<MarkdownRender />} />
      <Route path="/code-editor" element={<MarkdownEditor />} />
      <Route path="/course/:id" element={<CourseDetails />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/forgot" element={<ForgotCredentials />} />
      <Route path="/course-details/:batchType" element={<BatchDetails />} />
      <Route path="/up-comming" element={<UpComming />} />
      <Route path="/certificate" element={<Certificates />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-conditions" element={<TermsConditions />} />
      <Route path="/refund-policy" element={<RefundPolicy />} />
      <Route path="/voice" element={<BanglaVoiceTextarea />} />

      {/* Protected Student Routes */}
      <Route
        path="/dashboard/student"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      >
        <Route path="profile" element={<StudentProfile />} />
        <Route path="cq" element={<StudentCqPage />} />
        <Route path="test-quiz" element={<TestQuiz />} />
        <Route path="ranks" element={<RankPage />} />
        <Route path="payment-info" element={<PaymentForm />} />
        <Route path="mcq" element={<McqPage />} />
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
        <Route path="batch-details" element={<BatchDetailsPage />} />
        <Route path="cq" element={<CqPageList />} />
        <Route path="cq/add" element={<CqForm />} />
        <Route path="cq/edit/:id" element={<CqForm />} />
        <Route path="quizzes" element={<QuizList />} />
        <Route path="chapter-schedules" element={<AdminChapterSchedule />} />
        <Route path="quiz-results" element={<AdminQuizResults />} />
        <Route path="rankings" element={<McqRankPage />} />
        <Route path="payment-info" element={<PaymentInfo />} />
        <Route path="verified-info" element={<VerifiedStudentInfo />} />
        <Route path="make-course" element={<CourseMakeForm />} />
        <Route path="topic-viewer" element={<CourseClassesViewer />} />
        <Route path="cqg" element={<CreativeQuestionGenerator />} />
        <Route path="mcq" element={<QuizClassBrowser />} />
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
