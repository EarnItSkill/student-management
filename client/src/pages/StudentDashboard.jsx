import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Grid,
  List as ListIcon,
  Lock,
  Mail,
  MapPin,
  Phone,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/common/DashboardLayout";
import { useAppContext } from "../context/useAppContext";
import {
  getClassUnlockDate,
  getClassUnlockDates,
  isClassUnlocked,
  isQuizUnlocked,
} from "../utils/scheduleHelper";
import NotEnrolledPage from "./NotEnrolledPage";
import QuizzesTab from "./student/QuizzesTab";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    courses,
    batches,
    enrollments,
    payments,
    attendance,
    quizzes,
    fetchStudentResults,
  } = useAppContext();

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedBatchForQuiz, setSelectedBatchForQuiz] = useState(null);
  const [selectedBatchForAttendance, setSelectedBatchForAttendance] =
    useState(null);
  const [attendanceDateFilter, setAttendanceDateFilter] = useState("");
  const [attendanceViewType, setAttendanceViewType] = useState("cards");
  const [studentResults, setStudentResults] = useState([]);

  const student = currentUser;

  useEffect(() => {
    const loadStudentResults = async () => {
      if (currentUser?._id) {
        try {
          const results = await fetchStudentResults(currentUser._id);
          setStudentResults(results.data);
        } catch (error) {
          console.error("Results load করতে সমস্যা:", error);
        }
      }
    };
    loadStudentResults();
  }, [currentUser]);

  // Get student's data
  const myEnrollments = enrollments.filter(
    (e) => e.studentId === currentUser?._id
  );

  const myBatches = myEnrollments.map((enrollment) => {
    const batch = batches.find((b) => b._id === enrollment.batchId);
    const course = courses.find((c) => c._id === batch?.courseId);
    return { ...batch, course, enrollment };
  });

  const myPayments = payments.filter((p) => p.studentId === currentUser?._id);
  const myAttendance = attendance.filter(
    (a) => a.studentId === currentUser?._id
  );

  // Student এর enrolled courses থেকে courseIds বের করা
  const enrolledCourseIds = myBatches.map((batch) => batch.courseId);

  // ⭐ CHANGE: quizzes এর সাথে results merge করা
  const myQuizzes = quizzes
    .filter((quiz) => enrolledCourseIds.includes(quiz.courseId))
    .map((quiz) => ({
      ...quiz,
      results: studentResults.filter((r) => r.quizId === quiz._id),
    }));

  // Generate unlock dates for each batch
  const batchUnlockDates = {};
  myBatches.forEach((batch) => {
    if (batch.course?.classes) {
      batchUnlockDates[batch._id] = getClassUnlockDates(
        batch.startDate,
        batch.scheduleType,
        batch.course.classes.length
      );
    }
  });

  // Filter and map quizzes with unlock status
  const myQuizzesWithStatus = myQuizzes.map((quiz) => {
    // Find which batch this quiz belongs to
    const studentBatch = myBatches.find((b) => b.courseId === quiz.courseId);

    if (!studentBatch)
      return { ...quiz, isUnlocked: false, unlockDate: null, isPending: false };

    const unlockDates = batchUnlockDates[studentBatch._id] || [];

    // Get all quizzes for this course (sorted by _id)
    const courseQuizzes = myQuizzes
      .filter((q) => q.courseId === quiz.courseId)
      .sort((a, b) => a._id.localeCompare(b._id));

    // Get student's quiz results for this course (in order)
    const studentQuizResults = courseQuizzes.map((q) =>
      q.results.find((r) => r.studentId === currentUser?._id)
    );

    const currentQuizIndex = courseQuizzes.findIndex((q) => q._id === quiz._id);

    const isUnlocked = isQuizUnlocked(
      currentQuizIndex,
      unlockDates,
      studentQuizResults
    );

    const unlockDate = getClassUnlockDate(currentQuizIndex, unlockDates);

    // ⭐ NEW: Check if date unlocked but quiz locked (pending state)
    const isDateUnlocked = isClassUnlocked(currentQuizIndex, unlockDates);
    const isCompleted = quiz.results.some(
      (r) => r.studentId === currentUser?._id
    );
    const isPending = isDateUnlocked && !isCompleted; // সময় হয়েছে কিন্তু দেওয়া হয়নি

    return {
      ...quiz,
      isUnlocked,
      unlockDate,
      quizIndex: currentQuizIndex,
      isPending, // ⭐ NEW property
      isDateUnlocked, // ⭐ সময় হয়েছে কিনা
    };
  });

  // Calculate statistics
  const totalPaid = myPayments.reduce((sum, p) => sum + p.amount, 0);
  const presentCount = myAttendance.filter(
    (a) => a.status === "present"
  ).length;
  const absentCount = myAttendance.filter((a) => a.status === "absent").length;
  const attendancePercentage =
    myAttendance.length > 0
      ? ((presentCount / myAttendance.length) * 100).toFixed(1)
      : 0;
  const completedQuizzes = myQuizzes.filter((quiz) =>
    quiz.results.some((r) => r.studentId === currentUser?._id)
  ).length;

  // const pendingQuizzes = myQuizzes.length - completedQuizzes;
  const pendingQuizzes = myQuizzesWithStatus.filter(
    (q) => q.isPending && q.isUnlocked
  ).length;
  const lockedPendingQuizzes = myQuizzesWithStatus.filter(
    (q) => q.isPending && !q.isUnlocked
  ).length;

  // Calculate average quiz score
  const myQuizResults = myQuizzes
    .map((quiz) => quiz.results.find((r) => r.studentId === currentUser?._id))
    .filter(Boolean);
  const averageScore =
    myQuizResults.length > 0
      ? (
          myQuizResults.reduce((sum, r) => sum + r.score, 0) /
          myQuizResults.length
        ).toFixed(1)
      : 0;

  // Recent activities
  const recentPayments = [...myPayments].slice(-3).reverse();
  const recentAttendance = [...myAttendance].slice(-5).reverse();
  const recentQuizzes = myQuizzes.slice(-3).reverse();

  return (
    <DashboardLayout>
      {/* Welcome Card  */}
      {enrolledCourseIds.length !== 0 && (
        <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* Avatar */}
              <div className="avatar">
                <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={student.image} alt={student.name} />
                </div>
              </div>

              {/* Student Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h2 className="text-3xl font-bold">{student.name}</h2>
                  <div className="badge badge-primary badge-lg">
                    {student.studentId}
                  </div>
                  <div
                    className={`badge badge-lg ${
                      student.gender === "male"
                        ? "badge-info"
                        : "badge-secondary"
                    }`}
                  >
                    {student.gender === "male" ? "ছেলে" : "মেয়ে"}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>{student.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{student.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span>EIIN: {student.eiin}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {enrolledCourseIds.length !== 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="stat bg-base-100 rounded-lg shadow-lg hover:shadow-xl transition-all">
            <div className="stat-figure text-primary">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="stat-title">Enrolled Courses</div>
            <div className="stat-value text-primary">{myBatches.length}</div>
            <div className="stat-desc">Active enrollments</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-lg hover:shadow-xl transition-all">
            <div className="stat-figure text-secondary">
              <DollarSign className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Paid</div>
            <div className="stat-value text-secondary">
              ৳{totalPaid.toLocaleString()}
            </div>
            <div className="stat-desc">{myPayments.length} transactions</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-lg hover:shadow-xl transition-all">
            <div className="stat-figure text-accent">
              <Calendar className="w-8 h-8" />
            </div>
            <div className="stat-title">Attendance</div>
            <div className="stat-value text-accent">
              {attendancePercentage}%
            </div>
            <div className="stat-desc">
              {presentCount}/{myAttendance.length} present
            </div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-lg hover:shadow-xl transition-all">
            <div className="stat-figure text-info">
              <Award className="w-8 h-8" />
            </div>
            <div className="stat-title">Quiz Score</div>
            <div className="stat-value text-info">{averageScore}</div>
            <div className="stat-desc">Average score</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      {enrolledCourseIds.length !== 0 && (
        <div className="tabs tabs-boxed mb-6 bg-base-100 p-2 shadow-lg overflow-x-auto flex-nowrap">
          <a
            role="tab"
            className={`tab gap-2 whitespace-nowrap ${
              activeTab === "overview" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("overview")}
          >
            <TrendingUp className="w-4 h-4" />
            Overview
          </a>
          <a
            role="tab"
            className={`tab gap-2 whitespace-nowrap ${
              activeTab === "courses" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("courses")}
          >
            <BookOpen className="w-4 h-4" />
            My Courses
          </a>
          <a
            role="tab"
            className={`tab gap-2 whitespace-nowrap ${
              activeTab === "payments" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("payments")}
          >
            <DollarSign className="w-4 h-4" />
            Payments
          </a>
          <a
            role="tab"
            className={`tab gap-2 whitespace-nowrap ${
              activeTab === "attendance" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("attendance")}
          >
            <Calendar className="w-4 h-4" />
            Attendance
          </a>
          <a
            role="tab"
            className={`tab gap-2 whitespace-nowrap ${
              activeTab === "quizzes" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("quizzes")}
          >
            <Award className="w-4 h-4" />
            MCQs
          </a>
        </div>
      )}

      {/* Tab Content */}
      {enrolledCourseIds.length !== 0 ? (
        <div className="bg-base-100 rounded-lg shadow-lg p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>

              {/* Performance Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="stat bg-success text-white rounded-lg shadow-lg">
                  <div className="stat-figure text-white">
                    <Target className="w-8 h-8" />
                  </div>
                  <div className="stat-title text-white">Attendance Rate</div>
                  <div className="stat-value">{attendancePercentage}%</div>
                  <div className="stat-desc text-white">
                    {attendancePercentage >= 80
                      ? "Excellent!"
                      : attendancePercentage >= 60
                      ? "Good"
                      : "উন্নতি প্রয়োজন"}
                  </div>
                </div>

                <div className="stat bg-info text-white rounded-lg shadow-lg">
                  <div className="stat-figure text-white">
                    <Activity className="w-8 h-8" />
                  </div>
                  <div className="stat-title text-white">MCQ Performance</div>
                  <div className="stat-value">
                    {completedQuizzes}/{myQuizzes.length}
                  </div>
                  <div className="stat-desc text-white">
                    {lockedPendingQuizzes} pending
                  </div>
                </div>

                <div className="stat bg-warning text-white rounded-lg shadow-lg">
                  <div className="stat-figure text-white">
                    <DollarSign className="w-8 h-8" />
                  </div>
                  <div className="stat-title text-white">Payment Status</div>
                  <div className="stat-value">
                    {myPayments.filter((p) => p.status === "paid").length}
                  </div>
                  <div className="stat-desc text-white">
                    {myPayments.filter((p) => p.status === "partial").length}{" "}
                    partial payments
                  </div>
                </div>
              </div>

              {/* Alerts & Notifications */}
              <div className="space-y-3">
                {attendancePercentage < 75 && myAttendance.length > 0 && (
                  <div className="alert alert-warning">
                    <AlertCircle className="w-6 h-6" />
                    <div>
                      <h4 className="font-bold">Low Attendance Alert</h4>
                      <p className="text-sm">
                        Your attendance is {attendancePercentage}%. Try to
                        maintain at least 75% attendance.
                      </p>
                    </div>
                  </div>
                )}

                {pendingQuizzes > 0 && (
                  <div className="alert alert-info">
                    <Clock className="w-6 h-6" />
                    <div>
                      <h4 className="font-bold">Pending MCQ</h4>
                      <p className="text-sm">
                        You have {lockedPendingQuizzes} MCQ
                        {lockedPendingQuizzes && "zes"} pending. Complete them
                        to improve your score.
                      </p>
                    </div>
                  </div>
                )}

                {myPayments.some(
                  (p) => p.status === "partial" || p.status === "pending"
                ) && (
                  <div className="alert alert-error">
                    <DollarSign className="w-6 h-6" />
                    <div>
                      <h4 className="font-bold">Payment Reminder</h4>
                      <p className="text-sm">
                        You have pending/partial payments. Please clear them
                        soon.
                      </p>
                    </div>
                  </div>
                )}

                {attendancePercentage >= 90 && myAttendance.length > 5 && (
                  <div className="alert alert-success">
                    <CheckCircle className="w-6 h-6" />
                    <div>
                      <h4 className="font-bold">Excellent Attendance! 🎉</h4>
                      <p className="text-sm">
                        You're maintaining {attendancePercentage}% attendance.
                        Keep it up!
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* My Courses Progress */}
                <div className="card bg-base-200 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      My Courses
                    </h3>
                    {myBatches.length === 0 ? (
                      <div className="text-center py-8">
                        <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500 text-sm">
                          No courses enrolled
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {myBatches.slice(0, 3).map((batch) => (
                          <div
                            key={batch._id}
                            className="card bg-base-100 shadow"
                          >
                            <div className="card-body p-4">
                              <h4 className="font-bold text-sm">
                                {batch.course?.title}
                              </h4>
                              <p className="text-xs text-gray-400">
                                {batch.batchName}
                              </p>
                              <div className="badge badge-success badge-sm mt-2">
                                {batch.enrollment?.status} fsdf
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="card-actions justify-end mt-4">
                      <button
                        onClick={() => setActiveTab("courses")}
                        className="btn btn-sm btn-primary"
                      >
                        View All
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent Attendance */}
                <div className="card bg-base-200 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-accent" />
                      Recent Attendance
                    </h3>
                    {recentAttendance.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500 text-sm">
                          No attendance records
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentAttendance.map((record) => (
                              <tr key={record._id}>
                                <td className="text-sm">{record.date}</td>
                                <td>
                                  {record.status === "present" ? (
                                    <span className="badge badge-success badge-sm gap-1">
                                      <CheckCircle className="w-3 h-3" />
                                      Present
                                    </span>
                                  ) : (
                                    <span className="badge badge-error badge-sm gap-1">
                                      <XCircle className="w-3 h-3" />
                                      Absent
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    <div className="card-actions justify-end mt-4">
                      <button
                        onClick={() => setActiveTab("attendance")}
                        className="btn btn-sm btn-accent"
                      >
                        View All
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Payments */}
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-success" />
                    Recent Payments
                  </h3>
                  {recentPayments.length === 0 ? (
                    <div className="text-center py-8">
                      <DollarSign className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500 text-sm">
                        No payment records
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Batch</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentPayments.map((payment) => {
                            const batch = batches.find(
                              (b) => b._id === payment.batchId
                            );
                            return (
                              <tr key={payment._id}>
                                <td>{payment.paymentDate}</td>
                                <td className="text-sm">{batch?.batchName}</td>
                                <td className="font-bold text-primary">
                                  ৳{payment.amount}
                                </td>
                                <td>
                                  <span className="badge badge-outline badge-sm">
                                    {payment.method}
                                  </span>
                                </td>
                                <td>
                                  <span
                                    className={`badge badge-sm ${
                                      payment.status === "paid"
                                        ? "badge-success"
                                        : payment.status === "partial"
                                        ? "badge-warning"
                                        : "badge-error"
                                    }`}
                                  >
                                    {payment.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <div className="card-actions justify-end mt-4">
                    <button
                      onClick={() => setActiveTab("payments")}
                      className="btn btn-sm btn-success"
                    >
                      View All
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Quizzes */}
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title flex items-center gap-2">
                    <Award className="w-5 h-5 text-info" />
                    Recent Quizzes
                  </h3>
                  {recentQuizzes.length === 0 ? (
                    <div className="text-center py-8">
                      <Award className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500 text-sm">
                        No quizzes available
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {recentQuizzes.map((quiz) => {
                        const myResult = quiz.results.find(
                          (r) => r.studentId === currentUser?._id
                        );
                        const batch = batches.find(
                          (b) => b._id === quiz.batchId
                        );

                        return (
                          <div
                            key={quiz._id}
                            className="card bg-base-100 shadow"
                          >
                            <div className="card-body p-4">
                              <h4 className="font-bold text-sm line-clamp-2">
                                {quiz.title}
                              </h4>
                              <p className="text-xs text-gray-400">
                                {batch?.batchName}
                              </p>
                              {myResult ? (
                                <div className="badge badge-success mt-2">
                                  Score: {myResult.score}/{quiz.totalMarks}
                                </div>
                              ) : (
                                <div className="badge badge-warning mt-2">
                                  Pending
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="card-actions justify-end mt-4">
                    <button
                      onClick={() => setActiveTab("quizzes")}
                      className="btn btn-sm btn-info"
                    >
                      View All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === "courses" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">My Courses</h2>
              {myBatches.length === 0 ? (
                <div className="text-center py-20">
                  <BookOpen className="w-20 h-20 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Courses Yet</h3>
                  <p className="text-gray-500">
                    You haven't enrolled in any courses
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {myBatches.map((batch) => {
                    // Calculate class unlock dates for this batch
                    const classUnlockDates = batch.course?.classes
                      ? getClassUnlockDates(
                          batch.startDate,
                          batch.scheduleType,
                          batch.course.classes.length
                        )
                      : [];

                    // Calculate unlocked classes count
                    const today = new Date().toISOString().split("T")[0];
                    const unlockedClassesCount =
                      batch.course?.classes?.filter((_, index) =>
                        isClassUnlocked(index, classUnlockDates, today)
                      ).length || 0;

                    return (
                      <div
                        key={batch._id}
                        className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all"
                      >
                        <figure className="h-48 relative">
                          <img
                            src={batch.course?.image}
                            alt={batch.course?.title}
                            className="w-full h-full object-cover"
                          />
                          {/* Unlock Badge on Image */}
                          <div className="absolute top-2 right-2 badge badge-primary gap-1">
                            <Lock className="w-3 h-3" />
                            {unlockedClassesCount}/
                            {batch.course?.classes?.length || 0}
                          </div>
                        </figure>
                        <div className="card-body">
                          <h3 className="card-title text-xl">
                            {batch.course?.title}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {batch.course?.description}
                          </p>

                          <div className="divider my-2"></div>

                          {/* Batch Info */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-primary" />
                              <span className="font-semibold">Batch:</span>
                              <span>{batch.batchName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-primary" />
                              <span className="font-semibold">Duration:</span>
                              <span>
                                {new Date(batch.startDate).toLocaleDateString(
                                  "en-GB"
                                )}{" "}
                                to{" "}
                                {new Date(batch.endDate).toLocaleDateString(
                                  "en-GB"
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-primary" />
                              <span className="font-semibold">Schedule:</span>
                              <span>
                                {batch.scheduleType === "SIX_DAYS" &&
                                  "শনি - বৃহস্পতিবার"}
                                {batch.scheduleType === "THREE_DAYS_A" &&
                                  "শনি, সোম, বুধ"}
                                {batch.scheduleType === "THREE_DAYS_B" &&
                                  "রবি, মঙ্গল, বৃহ"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <DollarSign className="w-4 h-4 text-primary" />
                              <span className="font-semibold">Fee:</span>
                              <span>৳{batch.course?.fee}</span>
                            </div>
                          </div>

                          {/* Class Progress */}
                          <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-semibold">
                                Class Progress
                              </span>
                              <span className="text-gray-400">
                                {unlockedClassesCount} /{" "}
                                {batch.course?.classes?.length || 0} Unlocked
                              </span>
                            </div>
                            <progress
                              className="progress progress-primary w-full"
                              value={unlockedClassesCount}
                              max={batch.course?.classes?.length || 1}
                            ></progress>
                          </div>

                          {/* Classes Grid Preview */}
                          {batch.course?.classes &&
                            batch.course.classes.length > 0 && (
                              <div className="mt-3">
                                <div className="text-xs font-semibold mb-2">
                                  Classes:
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {batch.course.classes
                                    .slice(0, 5)
                                    .map((classItem, index) => {
                                      const isUnlocked = isClassUnlocked(
                                        index,
                                        classUnlockDates,
                                        today
                                      );
                                      const unlockDate = getClassUnlockDate(
                                        index,
                                        classUnlockDates
                                      );

                                      return (
                                        <div
                                          key={classItem.id}
                                          className={`tooltip ${
                                            !isUnlocked
                                              ? "tooltip-error"
                                              : "tooltip-success"
                                          }`}
                                          data-tip={
                                            isUnlocked
                                              ? `Class ${index + 1} - Unlocked`
                                              : `Unlocks on ${new Date(
                                                  unlockDate
                                                ).toLocaleDateString("en-GB")}`
                                          }
                                        >
                                          <div
                                            className={`badge gap-1 ${
                                              isUnlocked
                                                ? "badge-success"
                                                : "badge-ghost opacity-50"
                                            }`}
                                          >
                                            {!isUnlocked && (
                                              <Lock className="w-3 h-3" />
                                            )}
                                            Class {index + 1}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  {batch.course.classes.length > 5 && (
                                    <div className="badge badge-neutral">
                                      +{batch.course.classes.length - 5} more
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                          {/* Action Buttons */}
                          <div className="flex justify-between mt-4">
                            <button
                              onClick={() =>
                                navigate(`/course/${batch.courseId}`)
                              }
                              className="btn btn-primary btn-sm gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>

                            <div className="flex items-center gap-2">
                              <div className="badge badge-success">
                                {batch.enrollment?.status}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === "payments" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Payment History</h2>

              {/* Payment Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="stat bg-base-200 rounded-lg shadow-lg">
                  <div className="stat-figure text-primary">
                    <DollarSign className="w-8 h-8" />
                  </div>
                  <div className="stat-title">Total Paid</div>
                  <div className="stat-value text-primary">
                    ৳{totalPaid.toLocaleString()}
                  </div>
                </div>
                <div className="stat bg-base-200 rounded-lg shadow-lg">
                  <div className="stat-figure text-success">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div className="stat-title">Completed</div>
                  <div className="stat-value text-success">
                    {myPayments.filter((p) => p.status === "paid").length}
                  </div>
                </div>
                <div className="stat bg-base-200 rounded-lg shadow-lg">
                  <div className="stat-figure text-warning">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <div className="stat-title">Partial</div>
                  <div className="stat-value text-warning">
                    {myPayments.filter((p) => p.status === "partial").length}
                  </div>
                </div>
              </div>

              {myPayments.length === 0 ? (
                <div className="text-center py-20">
                  <DollarSign className="w-20 h-20 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No Payments Yet
                  </h3>
                  <p className="text-gray-500">You haven't made any payments</p>
                </div>
              ) : (
                <div className="card bg-base-200 shadow-xl">
                  <div className="card-body">
                    <div className="overflow-x-auto">
                      <table className="table table-zebra">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Batch</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myPayments.map((payment) => {
                            const batch = batches.find(
                              (b) => b._id === payment.batchId
                            );
                            return (
                              <tr key={payment._id}>
                                <td>{payment.paymentDate}</td>
                                <td>{batch?.batchName}</td>
                                <td className="font-bold text-primary">
                                  ৳{payment.amount}
                                </td>
                                <td>
                                  <span className="badge badge-outline">
                                    {payment.method}
                                  </span>
                                </td>
                                <td>
                                  <span
                                    className={`badge gap-1 ${
                                      payment.status === "paid"
                                        ? "badge-success"
                                        : payment.status === "partial"
                                        ? "badge-warning"
                                        : "badge-error"
                                    }`}
                                  >
                                    {payment.status === "paid" && (
                                      <CheckCircle className="w-3 h-3" />
                                    )}
                                    {payment.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === "attendance" && (
            <div>
              {!selectedBatchForAttendance ? (
                // Batch Selection View
                <div>
                  <h2 className="text-2xl font-bold mb-6">
                    Attendance Record - Select Batch
                  </h2>

                  {/* Overall Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="stat bg-base-200 rounded-lg shadow-lg">
                      <div className="stat-figure text-primary">
                        <BookOpen className="w-8 h-8" />
                      </div>
                      <div className="stat-title">My Batches</div>
                      <div className="stat-value text-primary">
                        {myBatches.length}
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg shadow-lg">
                      <div className="stat-figure text-success">
                        <Calendar className="w-8 h-8" />
                      </div>
                      <div className="stat-title">Total Records</div>
                      <div className="stat-value text-success">
                        {myAttendance.length}
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg shadow-lg">
                      <div className="stat-figure text-info">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                      <div className="stat-title">Overall Rate</div>
                      <div className="stat-value text-info">
                        {attendancePercentage}%
                      </div>
                    </div>
                  </div>

                  {/* Batch Cards */}
                  {myBatches.length === 0 ? (
                    <div className="text-center py-20">
                      <BookOpen className="w-20 h-20 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">
                        No Batches Found
                      </h3>
                      <p className="text-gray-500">
                        You are not enrolled in any batch yet
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myBatches.map((batch) => {
                        const course = courses.find(
                          (c) => c._id === batch.courseId
                        );
                        const batchAttendance = myAttendance.filter(
                          (a) => a.batchId === batch._id
                        );
                        const batchPresentCount = batchAttendance.filter(
                          (a) => a.status === "present"
                        ).length;
                        const batchAbsentCount = batchAttendance.filter(
                          (a) => a.status === "absent"
                        ).length;
                        const batchRate =
                          batchAttendance.length > 0
                            ? (
                                (batchPresentCount / batchAttendance.length) *
                                100
                              ).toFixed(1)
                            : 0;

                        return (
                          <div
                            key={batch._id}
                            onClick={() =>
                              setSelectedBatchForAttendance(batch._id)
                            }
                            className="card bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg hover:shadow-2xl transition-all cursor-pointer border-2 border-primary/20 hover:border-primary/50"
                          >
                            <div className="card-body">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <h3 className="card-title text-lg">
                                    {batch.batchName}
                                  </h3>
                                  <p className="text-sm text-gray-400 mt-1">
                                    {course?.title || "No Course"}
                                  </p>
                                </div>
                                <Calendar className="w-8 h-8 text-primary flex-shrink-0" />
                              </div>

                              <div className="divider my-2"></div>

                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-400">
                                    Schedule:
                                  </span>
                                  <span className="font-semibold text-xs">
                                    {batch.schedule}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">
                                    Total Records:
                                  </span>
                                  <span className="badge badge-primary">
                                    {batchAttendance.length}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">
                                    Present:
                                  </span>
                                  <span className="badge badge-success">
                                    {batchPresentCount}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Absent:</span>
                                  <span className="badge badge-error">
                                    {batchAbsentCount}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-400">Rate:</span>
                                  <span className="font-bold text-info">
                                    {batchRate}%
                                  </span>
                                </div>
                              </div>

                              <div className="mt-4 text-center">
                                <button className="btn btn-primary btn-sm w-full">
                                  View Attendance
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                // Attendance List View for Selected Batch
                <div>
                  {/* Header with Back Button */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedBatchForAttendance(null);
                        setAttendanceDateFilter("");
                      }}
                      className="btn btn-ghost btn-sm gap-2"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Back
                    </button>
                    <div className=" mb-6">
                      <div>
                        <h2 className="text-2xl font-bold">
                          {
                            myBatches.find(
                              (b) => b._id === selectedBatchForAttendance
                            )?.batchName
                          }
                        </h2>
                        <p className="text-sm text-gray-400">
                          {
                            courses.find(
                              (c) =>
                                c._id ===
                                myBatches.find(
                                  (b) => b._id === selectedBatchForAttendance
                                )?.courseId
                            )?.title
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Batch Attendance Stats */}
                  {(() => {
                    const batchAttendance = myAttendance.filter(
                      (a) => a.batchId === selectedBatchForAttendance
                    );
                    const batchPresentCount = batchAttendance.filter(
                      (a) => a.status === "present"
                    ).length;
                    const batchAbsentCount = batchAttendance.filter(
                      (a) => a.status === "absent"
                    ).length;
                    const batchRate =
                      batchAttendance.length > 0
                        ? (
                            (batchPresentCount / batchAttendance.length) *
                            100
                          ).toFixed(1)
                        : 0;

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="stat bg-base-200 rounded-lg shadow-lg">
                          <div className="stat-figure text-primary">
                            <Calendar className="w-8 h-8" />
                          </div>
                          <div className="stat-title">Attendance Rate</div>
                          <div className="stat-value text-primary">
                            {batchRate}%
                          </div>
                          <div className="stat-desc">
                            {batchPresentCount}/{batchAttendance.length} classes
                          </div>
                        </div>
                        <div className="stat bg-base-200 rounded-lg shadow-lg">
                          <div className="stat-figure text-success">
                            <CheckCircle className="w-8 h-8" />
                          </div>
                          <div className="stat-title">Present</div>
                          <div className="stat-value text-success">
                            {batchPresentCount}
                          </div>
                        </div>
                        <div className="stat bg-base-200 rounded-lg shadow-lg">
                          <div className="stat-figure text-error">
                            <XCircle className="w-8 h-8" />
                          </div>
                          <div className="stat-title">Absent</div>
                          <div className="stat-value text-error">
                            {batchAbsentCount}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Date Filter and View Toggle */}
                  <div className="flex-1 gap-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="form-control flex-1">
                        <div className="input-group flex justify-center items-center gap-3">
                          <span className="bg-base-200">
                            <Calendar className="w-5 h-5" />
                          </span>
                          <input
                            type="date"
                            className="input input-bordered w-full"
                            value={attendanceDateFilter}
                            onChange={(e) =>
                              setAttendanceDateFilter(e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className="btn-group">
                        <button
                          className={`btn ${
                            attendanceViewType === "table" ? "btn-active" : ""
                          }`}
                          onClick={() => setAttendanceViewType("table")}
                        >
                          <ListIcon className="w-5 h-5" />
                        </button>
                        <button
                          className={`btn ${
                            attendanceViewType === "cards" ? "btn-active" : ""
                          }`}
                          onClick={() => setAttendanceViewType("cards")}
                        >
                          <Grid className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Attendance Display */}
                  {(() => {
                    const batchAttendance = myAttendance
                      .filter((a) => a.batchId === selectedBatchForAttendance)
                      .filter(
                        (a) =>
                          !attendanceDateFilter ||
                          a.date === attendanceDateFilter
                      );

                    if (batchAttendance.length === 0) {
                      return (
                        <div className="text-center py-20">
                          <Calendar className="w-20 h-20 mx-auto text-gray-400 mb-4" />
                          <h3 className="text-xl font-semibold mb-2">
                            {attendanceDateFilter
                              ? "No records found"
                              : "No Attendance Records"}
                          </h3>
                          <p className="text-gray-500">
                            {attendanceDateFilter
                              ? `No attendance records for ${attendanceDateFilter}`
                              : "Your attendance hasn't been recorded yet for this batch"}
                          </p>
                        </div>
                      );
                    }

                    return (
                      <>
                        {attendanceDateFilter && (
                          <div className="alert alert-info mb-4">
                            <span>
                              Found {batchAttendance.length} record(s) for{" "}
                              {attendanceDateFilter}
                            </span>
                          </div>
                        )}

                        {attendanceViewType === "table" ? (
                          // Table View
                          <div className="card bg-base-200 shadow-xl">
                            <div className="card-body">
                              <div className="overflow-x-auto">
                                <table className="table table-zebra">
                                  <thead>
                                    <tr>
                                      <th>#</th>
                                      <th>Date</th>
                                      <th>Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {batchAttendance.map((record, index) => (
                                      <tr key={record._id}>
                                        <td>{index + 1}</td>
                                        <td className="font-semibold">
                                          {record.date}
                                        </td>
                                        <td>
                                          {record.status === "present" ? (
                                            <span className="badge badge-success gap-2">
                                              <CheckCircle className="w-4 h-4" />
                                              Present
                                            </span>
                                          ) : (
                                            <span className="badge badge-error gap-2">
                                              <XCircle className="w-4 h-4" />
                                              Absent
                                            </span>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // Cards View
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {batchAttendance.map((record) => (
                              <div
                                key={record._id}
                                className={`card shadow-xl transition-all ${
                                  record.status === "present"
                                    ? "bg-gradient-to-br from-success/10 to-success/5 border-2 border-success/30"
                                    : "bg-gradient-to-br from-error/10 to-error/5 border-2 border-error/30"
                                }`}
                              >
                                <div className="card-body">
                                  <div className="flex items-center justify-between mb-3">
                                    <div>
                                      <h3 className="font-bold text-lg">
                                        {record.date}
                                      </h3>
                                      <p className="text-sm text-gray-400">
                                        {new Date(
                                          record.date
                                        ).toLocaleDateString("en-US", {
                                          weekday: "long",
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })}
                                      </p>
                                    </div>
                                    <Calendar className="w-8 h-8 text-primary" />
                                  </div>

                                  <div className="divider my-2"></div>

                                  <div className="flex justify-center">
                                    {record.status === "present" ? (
                                      <div className="badge badge-success badge-lg gap-2 p-4">
                                        <CheckCircle className="w-6 h-6" />
                                        <span className="font-bold text-lg">
                                          Present
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="badge badge-error badge-lg gap-2 p-4">
                                        <XCircle className="w-6 h-6" />
                                        <span className="font-bold text-lg">
                                          Absent
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {activeTab === "quizzes" && (
            <QuizzesTab
              // Data props
              enrolledCourseIds={enrolledCourseIds}
              myQuizzesWithStatus={myQuizzesWithStatus}
              completedQuizzes={completedQuizzes}
              lockedPendingQuizzes={lockedPendingQuizzes}
              // State props
              selectedBatchForQuiz={selectedBatchForQuiz}
              setSelectedBatchForQuiz={setSelectedBatchForQuiz}
            />
          )}
        </div>
      ) : (
        <NotEnrolledPage />
      )}
    </DashboardLayout>
  );
};

export default StudentDashboard;
