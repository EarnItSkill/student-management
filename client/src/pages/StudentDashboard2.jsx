import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  DollarSign,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import DashboardLayout from "../components/common/DashboardLayout";
import { useAppContext } from "../context/useAppContext";

const StudentDashboard = () => {
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

  // --- Performance Optimization: Create lookup maps to avoid slow .find() in loops ---
  const courseMap = new Map(courses.map((c) => [c._id, c]));
  const batchMap = new Map(batches.map((b) => [b._id, b]));

  // --- Data Filtering & Calculations ---

  // Get student's enrollments
  const myEnrollments = enrollments.filter(
    (e) => e.studentId === currentUser?._id
  );

  // Get student's batches and their associated courses using the fast lookup maps
  const myBatches = myEnrollments
    .map((enrollment) => {
      const batch = batchMap.get(enrollment.batchId);
      const course = batch ? courseMap.get(batch.courseId) : null;
      return { ...batch, course, enrollment };
    })
    .filter(Boolean); // Remove any invalid entries

  // Get student's payments and calculate total
  const myPayments = payments.filter((p) => p.studentId === currentUser?._id);
  const totalPaid = myPayments.reduce((sum, p) => sum + p.amount, 0);

  // Get student's attendance and calculate percentage
  const myAttendance = attendance.filter(
    (a) => a.studentId === currentUser?._id
  );
  const presentCount = myAttendance.filter(
    (a) => a.status === "present"
  ).length;
  const attendancePercentage =
    myAttendance.length > 0
      ? ((presentCount / myAttendance.length) * 100).toFixed(1)
      : 0;

  // Get student's quizzes
  const myEnrolledBatchIds = new Set(myEnrollments.map((e) => e.batchId));
  const myQuizzes = quizzes.filter((quiz) =>
    myEnrolledBatchIds.has(quiz.batchId)
  );

  return (
    <DashboardLayout>
      {/* Welcome Card */}
      <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title text-2xl">
            স্বাগতম, {currentUser?.name}! 👋
          </h2>
          <p>আপনার শেখার যাত্রা চলছে দুর্দান্ত!</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-primary">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="stat-title">Enrolled Courses</div>
          <div className="stat-value text-primary">{myBatches.length}</div>
          <div className="stat-desc">Active courses</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-secondary">
            <DollarSign className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Payments</div>
          <div className="stat-value text-secondary">
            ৳{totalPaid.toLocaleString()}
          </div>
          <div className="stat-desc">All transactions</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-accent">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="stat-title">Attendance</div>
          <div className="stat-value text-accent">{attendancePercentage}%</div>
          <div className="stat-desc">
            {presentCount} of {myAttendance.length} days
          </div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-info">
            <Award className="w-8 h-8" />
          </div>
          <div className="stat-title">Quizzes</div>
          <div className="stat-value text-info">{myQuizzes.length}</div>
          <div className="stat-desc">Available quizzes</div>
        </div>
      </div>

      {/* Tabs - CORRECTED */}
      <div
        role="tablist"
        className="tabs tabs-boxed mb-6 bg-base-100 p-2 shadow-lg"
      >
        <a
          role="tab"
          className={`tab gap-2 ${
            activeTab === "overview" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("overview")}
        >
          <TrendingUp className="w-4 h-4" />
          Overview
        </a>
        <a
          role="tab"
          className={`tab gap-2 ${activeTab === "courses" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("courses")}
        >
          <BookOpen className="w-4 h-4" />
          My Courses
        </a>
        <a
          role="tab"
          className={`tab gap-2 ${
            activeTab === "payments" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("payments")}
        >
          <DollarSign className="w-4 h-4" />
          Payments
        </a>
        <a
          role="tab"
          className={`tab gap-2 ${
            activeTab === "attendance" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("attendance")}
        >
          <Calendar className="w-4 h-4" />
          Attendance
        </a>
        <a
          role="tab"
          className={`tab gap-2 ${activeTab === "quizzes" ? "tab-active" : ""}`}
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
            <div className="alert alert-info">
              <TrendingUp className="w-6 h-6" />
              <span>You're doing great! Keep up the good work! 🎉</span>
            </div>
            {/* You can add more overview components here, like charts or upcoming deadlines */}
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">My Courses</h2>
            {myBatches.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">কোনো কোর্সে এনরোল করা হয়নি</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myBatches.map((batch) => (
                  <div
                    key={batch._id}
                    className="card bg-base-200 shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="card-body">
                      <h3 className="card-title">
                        {batch.course?.title || "Unknown Course"}
                      </h3>
                      <p className="text-sm text-gray-600">{batch.batchName}</p>
                      <div className="divider my-2"></div>
                      <div className="space-y-1 text-sm">
                        <p className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(
                            batch.startDate
                          ).toLocaleDateString()} -{" "}
                          {new Date(batch.endDate).toLocaleDateString()}
                        </p>
                        <p className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Fee: ৳{batch.course?.fee.toLocaleString() || "N/A"}
                        </p>
                      </div>
                      <div className="card-actions justify-end">
                        <div className="badge badge-primary mt-2">
                          {batch.enrollment?.status}
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
            {myPayments.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">কোনো পেমেন্ট নেই</p>
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
                    {myPayments.map((payment) => (
                      <tr key={payment._id}>
                        <td>
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </td>
                        <td>
                          {batchMap.get(payment.batchId)?.batchName || "N/A"}
                        </td>
                        <td>৳{payment.amount.toLocaleString()}</td>
                        <td>{payment.method}</td>
                        <td>
                          <span
                            className={`badge ${
                              payment.status === "paid"
                                ? "badge-success"
                                : "badge-warning"
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === "attendance" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Attendance Record</h2>
            {myAttendance.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">কোনো উপস্থিতি রেকর্ড নেই</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Batch</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myAttendance.map((record) => (
                      <tr key={record._id}>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td>
                          {batchMap.get(record.batchId)?.batchName || "N/A"}
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
            )}
          </div>
        )}

        {/* Quizzes Tab */}
        {activeTab === "quizzes" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">My Quizzes</h2>
            {myQuizzes.length === 0 ? (
              <div className="text-center py-12">
                <Award className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">কোনো কুইজ নেই</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myQuizzes.map((quiz) => {
                  const myResult = quiz.results.find(
                    (r) => r.studentId === currentUser?._id
                  );
                  return (
                    <div key={quiz._id} className="card bg-base-200 shadow-lg">
                      <div className="card-body">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="card-title">{quiz.title}</h3>
                            <p className="text-sm text-gray-600">
                              Batch:{" "}
                              {batchMap.get(quiz.batchId)?.batchName || "N/A"}
                            </p>
                            <p className="text-sm">
                              Total Marks: {quiz.totalMarks}
                            </p>
                          </div>
                          <Award className="w-8 h-8 text-primary" />
                        </div>
                        <div className="divider my-1"></div>
                        {myResult ? (
                          <div className="alert alert-success mt-2">
                            <CheckCircle className="w-6 h-6" />
                            <span>
                              Completed | Score: {myResult.score}/
                              {quiz.totalMarks}
                            </span>
                          </div>
                        ) : (
                          <div className="card-actions justify-end">
                            <button className="btn btn-primary btn-sm mt-2">
                              Take Quiz
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
