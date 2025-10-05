import {
  ArrowUp,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  GraduationCap,
  Settings,
  TrendingUp,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import DashboardLayout from "../components/common/DashboardLayout";
import { useAppContext } from "../context/useAppContext";

// Import CRUD Components
import AttendanceForm from "../components/attendence/AttendanceForm";
import AttendanceList from "../components/attendence/AttendanceList";
import BatchForm from "../components/batches/BatchForm";
import BatchList from "../components/batches/BatchList";
import CourseForm from "../components/courses/CourseForm";
import CourseList from "../components/courses/CourseList";
import EnrollmentForm from "../components/enrollments/EnrollmentForm";
import EnrollmentList from "../components/enrollments/EnrollmentList";
import PaymentForm from "../components/payments/PaymentForm";
import PaymentList from "../components/payments/PaymentList";
import QuizForm from "../components/quizzes/QuizForm";
import QuizList from "../components/quizzes/QuizList";
import StudentForm from "../components/students/StudentForm";
import StudentList from "../components/students/StudentList";

const AdminDashboard = () => {
  const {
    currentUser,
    students,
    courses,
    batches,
    enrollments,
    payments,
    attendance,
    quizzes,
  } = useAppContext();

  const [activeTab, setActiveTab] = useState("overview");

  // Modal States
  const [studentModal, setStudentModal] = useState({
    isOpen: false,
    student: null,
  });
  const [courseModal, setCourseModal] = useState({
    isOpen: false,
    course: null,
  });
  const [batchModal, setBatchModal] = useState({ isOpen: false, batch: null });
  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    payment: null,
  });
  const [attendanceModal, setAttendanceModal] = useState({ isOpen: false });
  const [enrollmentModal, setEnrollmentModal] = useState({ isOpen: false });
  const [quizModal, setQuizModal] = useState({ isOpen: false, quiz: null });

  // Calculate statistics
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalEnrollments = enrollments.length;
  const activeEnrollments = enrollments.filter(
    (e) => e.status === "active"
  ).length;
  const totalAttendance = attendance.length;
  const presentCount = attendance.filter((a) => a.status === "present").length;
  const attendanceRate =
    totalAttendance > 0
      ? ((presentCount / totalAttendance) * 100).toFixed(1)
      : 0;
  const paidPayments = payments.filter((p) => p.status === "paid").length;
  const partialPayments = payments.filter((p) => p.status === "partial").length;
  const pendingPayments = payments.filter((p) => p.status === "pending").length;

  // Recent activities
  const recentStudents = [...students].slice(-5).reverse();
  const recentPayments = [...payments].slice(-5).reverse();
  const recentEnrollments = [...enrollments].slice(-5).reverse();

  // Course wise enrollment
  const courseEnrollments = courses.map((course) => {
    const courseBatches = batches.filter((b) => b.courseId === course._id);
    const batchIds = courseBatches.map((b) => b._id);
    const enrolled = enrollments.filter((e) =>
      batchIds.includes(e.batchId)
    ).length;
    return { name: course.title, enrolled };
  });

  return (
    <DashboardLayout>
      {/* Welcome Card */}
      <div className="card bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title text-2xl">
            Welcome Admin, {currentUser?.name}! 👨‍💼
          </h2>
          <p>Manage your training center efficiently from this dashboard</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Students */}
        <div className="stat bg-base-100 rounded-lg shadow-lg hover:shadow-xl transition-all">
          <div className="stat-figure text-primary">
            <Users className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Students</div>
          <div className="stat-value text-primary">{students.length}</div>
          <div className="stat-desc flex items-center gap-1">
            <ArrowUp className="w-4 h-4 text-success" />
            <span className="text-success">12%</span> from last month
          </div>
        </div>

        {/* Total Courses */}
        <div className="stat bg-base-100 rounded-lg shadow-lg hover:shadow-xl transition-all">
          <div className="stat-figure text-secondary">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Courses</div>
          <div className="stat-value text-secondary">{courses.length}</div>
          <div className="stat-desc">Available courses</div>
        </div>

        {/* Active Batches */}
        <div className="stat bg-base-100 rounded-lg shadow-lg hover:shadow-xl transition-all">
          <div className="stat-figure text-accent">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div className="stat-title">Active Batches</div>
          <div className="stat-value text-accent">{batches.length}</div>
          <div className="stat-desc">
            {activeEnrollments} active enrollments
          </div>
        </div>

        {/* Total Revenue */}
        <div className="stat bg-base-100 rounded-lg shadow-lg hover:shadow-xl transition-all">
          <div className="stat-figure text-success">
            <DollarSign className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Revenue</div>
          <div className="stat-value text-success">
            ৳{totalRevenue.toLocaleString()}
          </div>
          <div className="stat-desc flex items-center gap-1">
            <ArrowUp className="w-4 h-4 text-success" />
            <span className="text-success">8%</span> from last month
          </div>
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
            activeTab === "students" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("students")}
        >
          <Users className="w-4 h-4" />
          Students
        </a>
        <a
          role="tab"
          className={`tab gap-2 whitespace-nowrap ${
            activeTab === "courses" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("courses")}
        >
          <BookOpen className="w-4 h-4" />
          Courses
        </a>
        <a
          role="tab"
          className={`tab gap-2 whitespace-nowrap ${
            activeTab === "batches" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("batches")}
        >
          <GraduationCap className="w-4 h-4" />
          Batches
        </a>
        <a
          role="tab"
          className={`tab gap-2 whitespace-nowrap ${
            activeTab === "enrollments" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("enrollments")}
        >
          <UserCheck className="w-4 h-4" />
          Enrollments
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
        <a
          role="tab"
          className={`tab gap-2 whitespace-nowrap ${
            activeTab === "settings" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("settings")}
        >
          <Settings className="w-4 h-4" />
          Settings
        </a>
      </div>

      {/* Tab Content */}
      <div className="bg-base-100 rounded-lg shadow-lg p-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Attendance Rate */}
              <div className="stat bg-primary text-white rounded-lg shadow-lg">
                <div className="stat-figure text-white">
                  <Calendar className="w-8 h-8" />
                </div>
                <div className="stat-title text-white">Attendance Rate</div>
                <div className="stat-value">{attendanceRate}%</div>
                <div className="stat-desc text-white">
                  {presentCount}/{totalAttendance} present
                </div>
              </div>

              {/* Payment Status */}
              <div className="stat bg-success text-white rounded-lg shadow-lg">
                <div className="stat-figure text-white">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="stat-title text-white">Paid Payments</div>
                <div className="stat-value">{paidPayments}</div>
                <div className="stat-desc text-white">
                  {partialPayments} partial, {pendingPayments} pending
                </div>
              </div>

              {/* Total Quizzes */}
              <div className="stat bg-info text-white rounded-lg shadow-lg">
                <div className="stat-figure text-white">
                  <Award className="w-8 h-8" />
                </div>
                <div className="stat-title text-white">Total Quizzes</div>
                <div className="stat-value">{quizzes.length}</div>
                <div className="stat-desc text-white">
                  {quizzes.reduce((sum, q) => sum + q.results.length, 0)}{" "}
                  submissions
                </div>
              </div>
            </div>

            {/* Course Enrollment Chart */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Course-wise Enrollments</h3>
                <div className="space-y-4 mt-4">
                  {courseEnrollments.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">{item.name}</span>
                        <span className="badge badge-primary">
                          {item.enrolled} students
                        </span>
                      </div>
                      <progress
                        className="progress progress-primary w-full"
                        value={item.enrolled}
                        max={Math.max(
                          ...courseEnrollments.map((c) => c.enrolled)
                        )}
                      ></progress>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Two Column Layout for Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Students */}
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Recent Students
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentStudents.map((student) => (
                          <tr key={student._id}>
                            <td>
                              <div className="flex items-center gap-2">
                                <div className="avatar">
                                  <div className="w-8 h-8 rounded-full">
                                    <img
                                      src={student.image}
                                      alt={student.name}
                                    />
                                  </div>
                                </div>
                                <span className="font-semibold text-sm">
                                  {student.name}
                                </span>
                              </div>
                            </td>
                            <td className="text-sm">{student.email}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="card-actions justify-end mt-4">
                    <button
                      onClick={() => setActiveTab("students")}
                      className="btn btn-sm btn-primary"
                    >
                      View All
                    </button>
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
                  <div className="overflow-x-auto">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentPayments.map((payment) => {
                          const student = students.find(
                            (s) => s._id === payment.studentId
                          );
                          return (
                            <tr key={payment._id}>
                              <td className="text-sm font-semibold">
                                {student?.name}
                              </td>
                              <td className="text-sm font-bold text-primary">
                                ৳{payment.amount}
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
            </div>

            {/* Recent Enrollments */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-accent" />
                  Recent Enrollments
                </h3>
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Batch</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentEnrollments.map((enrollment) => {
                        const student = students.find(
                          (s) => s._id === enrollment.studentId
                        );
                        const batch = batches.find(
                          (b) => b._id === enrollment.batchId
                        );
                        return (
                          <tr key={enrollment._id}>
                            <td>
                              <div className="flex items-center gap-3">
                                <div className="avatar">
                                  <div className="w-10 h-10 rounded-full">
                                    <img
                                      src={student?.image}
                                      alt={student?.name}
                                    />
                                  </div>
                                </div>
                                <span className="font-semibold">
                                  {student?.name}
                                </span>
                              </div>
                            </td>
                            <td>{batch?.batchName}</td>
                            <td>{enrollment.enrollDate}</td>
                            <td>
                              <span
                                className={`badge ${
                                  enrollment.status === "active"
                                    ? "badge-success"
                                    : "badge-error"
                                }`}
                              >
                                {enrollment.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="card-actions justify-end mt-4">
                  <button
                    onClick={() => setActiveTab("enrollments")}
                    className="btn btn-sm btn-accent"
                  >
                    View All
                  </button>
                </div>
              </div>
            </div>

            {/* Batch Status Overview */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-secondary" />
                  Batch Status Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {batches.map((batch) => {
                    const course = courses.find(
                      (c) => c._id === batch.courseId
                    );
                    const percentage =
                      (batch.enrolledStudents / batch.totalSeats) * 100;

                    return (
                      <div key={batch._id} className="card bg-base-100 shadow">
                        <div className="card-body p-4">
                          <h4 className="font-bold text-sm">
                            {batch.batchName}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {course?.title}
                          </p>
                          <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Enrolled</span>
                              <span className="font-semibold">
                                {batch.enrolledStudents}/{batch.totalSeats}
                              </span>
                            </div>
                            <progress
                              className={`progress w-full ${
                                percentage >= 90
                                  ? "progress-success"
                                  : percentage >= 70
                                  ? "progress-warning"
                                  : "progress-primary"
                              }`}
                              value={batch.enrolledStudents}
                              max={batch.totalSeats}
                            ></progress>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <button
                    onClick={() => {
                      setActiveTab("students");
                      setTimeout(
                        () => setStudentModal({ isOpen: true, student: null }),
                        100
                      );
                    }}
                    className="btn btn-outline border-white text-white hover:bg-white hover:text-primary gap-2"
                  >
                    <Users className="w-5 h-5" />
                    Add Student
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("courses");
                      setTimeout(
                        () => setCourseModal({ isOpen: true, course: null }),
                        100
                      );
                    }}
                    className="btn btn-outline border-white text-white hover:bg-white hover:text-secondary gap-2"
                  >
                    <BookOpen className="w-5 h-5" />
                    Add Course
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("batches");
                      setTimeout(
                        () => setBatchModal({ isOpen: true, batch: null }),
                        100
                      );
                    }}
                    className="btn btn-outline border-white text-white hover:bg-white hover:text-accent gap-2"
                  >
                    <GraduationCap className="w-5 h-5" />
                    Add Batch
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("payments");
                      setTimeout(
                        () => setPaymentModal({ isOpen: true, payment: null }),
                        100
                      );
                    }}
                    className="btn btn-outline border-white text-white hover:bg-white hover:text-success gap-2"
                  >
                    <DollarSign className="w-5 h-5" />
                    Add Payment
                  </button>
                </div>
              </div>
            </div>

            {/* System Alerts */}
            <div className="space-y-3">
              {batches.filter((b) => b.enrolledStudents >= b.totalSeats * 0.9)
                .length > 0 && (
                <div className="alert alert-warning">
                  <Clock className="w-6 h-6" />
                  <div>
                    <h4 className="font-bold">Batches Almost Full</h4>
                    <p className="text-sm">
                      {
                        batches.filter(
                          (b) => b.enrolledStudents >= b.totalSeats * 0.9
                        ).length
                      }{" "}
                      batches are 90% or more full
                    </p>
                  </div>
                </div>
              )}

              {pendingPayments > 0 && (
                <div className="alert alert-info">
                  <DollarSign className="w-6 h-6" />
                  <div>
                    <h4 className="font-bold">Pending Payments</h4>
                    <p className="text-sm">
                      {pendingPayments} payments are pending. Follow up with
                      students.
                    </p>
                  </div>
                </div>
              )}

              {attendanceRate < 70 && totalAttendance > 0 && (
                <div className="alert alert-error">
                  <XCircle className="w-6 h-6" />
                  <div>
                    <h4 className="font-bold">Low Attendance Rate</h4>
                    <p className="text-sm">
                      Overall attendance is {attendanceRate}%. Consider reaching
                      out to students.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === "students" && (
          <StudentList
            onAdd={() => setStudentModal({ isOpen: true, student: null })}
            onEdit={(student) => setStudentModal({ isOpen: true, student })}
          />
        )}

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <CourseList
            onAdd={() => setCourseModal({ isOpen: true, course: null })}
            onEdit={(course) => setCourseModal({ isOpen: true, course })}
          />
        )}

        {/* Batches Tab */}
        {activeTab === "batches" && (
          <BatchList
            onAdd={() => setBatchModal({ isOpen: true, batch: null })}
            onEdit={(batch) => setBatchModal({ isOpen: true, batch })}
          />
        )}

        {/* Enrollments Tab */}
        {activeTab === "enrollments" && (
          <EnrollmentList onAdd={() => setEnrollmentModal({ isOpen: true })} />
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <PaymentList
            onAdd={() => setPaymentModal({ isOpen: true, payment: null })}
            onEdit={(payment) => setPaymentModal({ isOpen: true, payment })}
          />
        )}

        {/* Attendance Tab */}
        {activeTab === "attendance" && (
          <AttendanceList onAdd={() => setAttendanceModal({ isOpen: true })} />
        )}

        {/* Quizzes Tab */}
        {activeTab === "quizzes" && (
          <QuizList
            onAdd={() => setQuizModal({ isOpen: true, quiz: null })}
            onEdit={(quiz) => setQuizModal({ isOpen: true, quiz })}
          />
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && <Settings />}
      </div>

      {/* Modals */}
      {studentModal.isOpen && (
        <StudentForm
          student={studentModal.student}
          onClose={() => setStudentModal({ isOpen: false, student: null })}
          onSuccess={() => {
            // Optional: Show success toast
          }}
        />
      )}

      {courseModal.isOpen && (
        <CourseForm
          course={courseModal.course}
          onClose={() => setCourseModal({ isOpen: false, course: null })}
          onSuccess={() => {
            // Optional: Show success toast
          }}
        />
      )}

      {batchModal.isOpen && (
        <BatchForm
          batch={batchModal.batch}
          onClose={() => setBatchModal({ isOpen: false, batch: null })}
          onSuccess={() => {
            // Optional: Show success toast
          }}
        />
      )}

      {paymentModal.isOpen && (
        <PaymentForm
          payment={paymentModal.payment}
          onClose={() => setPaymentModal({ isOpen: false, payment: null })}
          onSuccess={() => {
            // Optional: Show success toast
          }}
        />
      )}

      {attendanceModal.isOpen && (
        <AttendanceForm
          onClose={() => setAttendanceModal({ isOpen: false })}
          onSuccess={() => {
            // Optional: Show success toast
          }}
        />
      )}

      {enrollmentModal.isOpen && (
        <EnrollmentForm
          onClose={() => setEnrollmentModal({ isOpen: false })}
          onSuccess={() => {
            // Optional: Show success toast
          }}
        />
      )}

      {quizModal.isOpen && (
        <QuizForm
          quiz={quizModal.quiz}
          onClose={() => setQuizModal({ isOpen: false, quiz: null })}
          onSuccess={() => {
            // Optional: Show success toast
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
