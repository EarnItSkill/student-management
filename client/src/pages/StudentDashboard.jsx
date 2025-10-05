import {
  Activity,
  AlertCircle,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/common/DashboardLayout";
import TakeQuiz from "../components/quizzes/TakeQuiz";
import ViewQuizResult from "../components/quizzes/ViewQuizResult";
import { useAppContext } from "../context/useAppContext";

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
  } = useAppContext();

  const [activeTab, setActiveTab] = useState("overview");
  const [quizModal, setQuizModal] = useState({ isOpen: false, quiz: null });
  const [resultModal, setResultModal] = useState({ isOpen: false, quiz: null });

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
  const myQuizzes = quizzes.filter((quiz) =>
    myEnrollments.some((e) => e.batchId === quiz.batchId)
  );

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
  const pendingQuizzes = myQuizzes.length - completedQuizzes;

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
      {/* Welcome Card */}
      <div className="card bg-gradient-to-r from-primary to-secondary text-white shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title text-2xl">
            স্বাগতম, {currentUser?.name}! 👋
          </h2>
          <p>আপনার শেখার যাত্রা চলছে দুর্দান্ত! Keep up the good work!</p>
        </div>
      </div>

      {/* Stats Cards */}
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
          <div className="stat-value text-accent">{attendancePercentage}%</div>
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

      {/* Tabs */}
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
          Quizzes
        </a>
      </div>

      {/* Tab Content */}
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
                    : "Need Improvement"}
                </div>
              </div>

              <div className="stat bg-info text-white rounded-lg shadow-lg">
                <div className="stat-figure text-white">
                  <Activity className="w-8 h-8" />
                </div>
                <div className="stat-title text-white">Quiz Performance</div>
                <div className="stat-value">
                  {completedQuizzes}/{myQuizzes.length}
                </div>
                <div className="stat-desc text-white">
                  {pendingQuizzes} pending
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
                    <h4 className="font-bold">Pending Quizzes</h4>
                    <p className="text-sm">
                      You have {pendingQuizzes} quiz(zes) pending. Complete them
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
                      You have pending/partial payments. Please clear them soon.
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
                            <p className="text-xs text-gray-600">
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
                    <p className="text-gray-500 text-sm">No payment records</p>
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
                      const batch = batches.find((b) => b._id === quiz.batchId);

                      return (
                        <div key={quiz._id} className="card bg-base-100 shadow">
                          <div className="card-body p-4">
                            <h4 className="font-bold text-sm line-clamp-2">
                              {quiz.title}
                            </h4>
                            <p className="text-xs text-gray-600">
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
                {myBatches.map((batch) => (
                  <div
                    key={batch._id}
                    className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all"
                  >
                    <figure className="h-48">
                      <img
                        src={batch.course?.image}
                        alt={batch.course?.title}
                        className="w-full h-full object-cover"
                      />
                    </figure>
                    <div className="card-body">
                      <h3 className="card-title text-xl">
                        {batch.course?.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {batch.course?.description}
                      </p>

                      <div className="divider my-2"></div>

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
                            {batch.startDate} to {batch.endDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-primary" />
                          <span className="font-semibold">Fee:</span>
                          <span>৳{batch.course?.fee}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="font-semibold">Schedule:</span>
                          <span>{batch.schedule}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div className="card-actions justify-end mt-4">
                          <button
                            onClick={() =>
                              navigate(`/course/${batch.courseId}`)
                            }
                            className="btn btn-success btn-sm gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </div>

                        <div className="card-actions justify-end mt-4">
                          <div className="badge badge-success">
                            {batch.enrollment?.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                <h3 className="text-xl font-semibold mb-2">No Payments Yet</h3>
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
            <h2 className="text-2xl font-bold mb-4">Attendance Record</h2>

            {/* Attendance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="stat bg-base-200 rounded-lg shadow-lg">
                <div className="stat-figure text-primary">
                  <Calendar className="w-8 h-8" />
                </div>
                <div className="stat-title">Attendance Rate</div>
                <div className="stat-value text-primary">
                  {attendancePercentage}%
                </div>
                <div className="stat-desc">
                  {presentCount}/{myAttendance.length} classes
                </div>
              </div>
              <div className="stat bg-base-200 rounded-lg shadow-lg">
                <div className="stat-figure text-success">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="stat-title">Present</div>
                <div className="stat-value text-success">{presentCount}</div>
              </div>
              <div className="stat bg-base-200 rounded-lg shadow-lg">
                <div className="stat-figure text-error">
                  <XCircle className="w-8 h-8" />
                </div>
                <div className="stat-title">Absent</div>
                <div className="stat-value text-error">{absentCount}</div>
              </div>
            </div>

            {myAttendance.length === 0 ? (
              <div className="text-center py-20">
                <Calendar className="w-20 h-20 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No Attendance Records
                </h3>
                <p className="text-gray-500">
                  Your attendance hasn't been recorded yet
                </p>
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
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myAttendance.map((record) => {
                          const batch = batches.find(
                            (b) => b._id === record.batchId
                          );
                          return (
                            <tr key={record._id}>
                              <td className="font-semibold">{record.date}</td>
                              <td>{batch?.batchName}</td>
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

        {activeTab === "quizzes" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">My Quizzes</h2>

            {/* Quiz Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="stat bg-base-200 rounded-lg shadow-lg">
                <div className="stat-figure text-primary">
                  <Award className="w-8 h-8" />
                </div>
                <div className="stat-title">Total Quizzes</div>
                <div className="stat-value text-primary">
                  {myQuizzes.length}
                </div>
              </div>
              <div className="stat bg-base-200 rounded-lg shadow-lg">
                <div className="stat-figure text-success">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="stat-title">Completed</div>
                <div className="stat-value text-success">
                  {completedQuizzes}
                </div>
              </div>
              <div className="stat bg-base-200 rounded-lg shadow-lg">
                <div className="stat-figure text-warning">
                  <Clock className="w-8 h-8" />
                </div>
                <div className="stat-title">Pending</div>
                <div className="stat-value text-warning">{pendingQuizzes}</div>
              </div>
            </div>

            {myQuizzes.length === 0 ? (
              <div className="text-center py-20">
                <Award className="w-20 h-20 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No Quizzes Available
                </h3>
                <p className="text-gray-500">
                  No quizzes have been assigned yet
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {myQuizzes.map((quiz) => {
                  const myResult = quiz.results.find(
                    (r) => r.studentId === currentUser?._id
                  );
                  const batch = batches.find((b) => b._id === quiz.batchId);
                  const percentage = myResult
                    ? ((myResult.score / quiz.totalMarks) * 100).toFixed(1)
                    : 0;

                  return (
                    <div
                      key={quiz._id}
                      className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all"
                    >
                      <div className="card-body">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="card-title text-lg">{quiz.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Batch: {batch?.batchName}
                            </p>
                          </div>
                          <Award className="w-8 h-8 text-primary flex-shrink-0" />
                        </div>

                        <div className="divider my-2"></div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Questions:</span>
                            <span className="font-semibold">
                              {quiz.questions.length}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Total Marks:</span>
                            <span className="font-semibold">
                              {quiz.totalMarks}
                            </span>
                          </div>
                          {myResult && (
                            <>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  Your Score:
                                </span>
                                <span className="font-bold text-primary">
                                  {myResult.score}/{quiz.totalMarks}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  Percentage:
                                </span>
                                <span
                                  className={`font-bold ${
                                    percentage >= 80
                                      ? "text-success"
                                      : percentage >= 60
                                      ? "text-warning"
                                      : "text-error"
                                  }`}
                                >
                                  {percentage}%
                                </span>
                              </div>
                            </>
                          )}
                        </div>

                        {myResult ? (
                          <div className="space-y-3 mt-4">
                            <div
                              className={`alert ${
                                percentage >= 80
                                  ? "alert-success"
                                  : percentage >= 60
                                  ? "alert-warning"
                                  : "alert-error"
                              }`}
                            >
                              <CheckCircle className="w-6 h-6" />
                              <div>
                                <div className="font-bold">
                                  {percentage >= 80
                                    ? "Excellent!"
                                    : percentage >= 60
                                    ? "Good Job!"
                                    : "Need Improvement"}
                                </div>
                                <div className="text-sm">
                                  Submitted:{" "}
                                  {new Date(
                                    myResult.submittedAt
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                            </div>

                            {/* 👇 View Result Button যোগ করুন */}
                            <button
                              onClick={() =>
                                setResultModal({ isOpen: true, quiz })
                              }
                              className="btn btn-outline btn-primary btn-block gap-2"
                            >
                              <Eye className="w-5 h-5" />
                              View Result & Answers
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setQuizModal({ isOpen: true, quiz })}
                            className="btn btn-primary btn-block mt-4 gap-2"
                          >
                            <Clock className="w-5 h-5" />
                            Take Quiz
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Quiz Taking Modal */}
        {quizModal.isOpen && quizModal.quiz && (
          <TakeQuiz
            quiz={quizModal.quiz}
            onClose={() => setQuizModal({ isOpen: false, quiz: null })}
            onSuccess={() => {
              setQuizModal({ isOpen: false, quiz: null });
            }}
          />
        )}

        {/* 👇 View Result Modal যোগ করুন */}
        {resultModal.isOpen && resultModal.quiz && (
          <ViewQuizResult
            quiz={resultModal.quiz}
            studentId={currentUser?._id}
            onClose={() => setResultModal({ isOpen: false, quiz: null })}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
