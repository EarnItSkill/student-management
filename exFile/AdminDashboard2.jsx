import {
  BookOpen,
  DollarSign,
  GraduationCap,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import DashboardLayout from "../client/src/components/common/DashboardLayout";
import { useAppContext } from "../client/src/context/useAppContext";

// Import CRUD Components
import AttendanceForm from "../client/src/components/attendence/AttendanceForm";
import AttendanceList from "../client/src/components/attendence/AttendanceList";
import BatchForm from "../client/src/components/batches/BatchForm";
import BatchList from "../client/src/components/batches/BatchList";
import CourseForm from "../client/src/components/courses/CourseForm";
import CourseList from "../client/src/components/courses/CourseList";
import EnrollmentForm from "../client/src/components/enrollments/EnrollmentForm";
import EnrollmentList from "../client/src/components/enrollments/EnrollmentList";
import PaymentForm from "../client/src/components/payments/PaymentForm";
import PaymentList from "../client/src/components/payments/PaymentList";
import QuizForm from "../client/src/components/quizzes/QuizForm";
import QuizList from "../client/src/components/quizzes/QuizList";
import StudentForm from "../client/src/components/students/StudentForm";
import StudentList from "../client/src/components/students/StudentList";

const AdminDashboard = () => {
  const { currentUser, students, courses, batches, enrollments, payments } =
    useAppContext();

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
  const [enrollmentModal, setEnrollmentModal] = useState({
    isOpen: false,
    enrollment: null,
  });
  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    payment: null,
  });
  const [attandenceModal, setAttandenceModal] = useState({
    isOpen: false,
    attandence: null,
  });
  const [quizzesModal, setQuizzesModal] = useState({
    isOpen: false,
    quiz: null,
  });

  // Calculate stats
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalEnrollments = enrollments.length;

  return (
    <DashboardLayout>
      {/* Welcome Card */}
      <div className="card bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title text-2xl">
            Welcome Admin, {currentUser?.name}! 👨‍💼
          </h2>
          <p>Manage your training center efficiently</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="stat bg-primary text-white rounded-lg shadow-lg">
          <div className="stat-figure text-white">
            <Users className="w-8 h-8" />
          </div>
          <div className="stat-title text-white">Total Students</div>
          <div className="stat-value">{students.length}</div>
        </div>
        <div className="stat bg-secondary text-white rounded-lg shadow-lg">
          <div className="stat-figure text-white">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="stat-title text-white">Total Courses</div>
          <div className="stat-value">{courses.length}</div>
        </div>
        <div className="stat bg-accent text-white rounded-lg shadow-lg">
          <div className="stat-figure text-white">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div className="stat-title text-white">Active Batches</div>
          <div className="stat-value">{batches.length}</div>
        </div>
        <div className="stat bg-info text-white rounded-lg shadow-lg">
          <div className="stat-figure text-white">
            <UserCheck className="w-8 h-8" />
          </div>
          <div className="stat-title text-white">Enrollments</div>
          <div className="stat-value">{totalEnrollments}</div>
        </div>
        <div className="stat bg-success text-white rounded-lg shadow-lg">
          <div className="stat-figure text-white">
            <DollarSign className="w-8 h-8" />
          </div>
          <div className="stat-title text-white">Total Revenue</div>
          <div className="stat-value">৳{totalRevenue}</div>
        </div>
      </div>

      {/* Tabs */}
      <div role="tablist" className="tabs tabs-boxed mb-6 bg-base-100 p-2">
        <a
          role="tab"
          className={`tab ${activeTab === "overview" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📊 Overview
        </a>
        <a
          role="tab"
          className={`tab ${activeTab === "students" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("students")}
        >
          🧑‍🎓 Students
        </a>
        <a
          role="tab"
          className={`tab ${activeTab === "courses" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("courses")}
        >
          📚 Courses
        </a>
        <a
          role="tab"
          className={`tab ${activeTab === "batches" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("batches")}
        >
          🎓 Batches
        </a>
        <a
          role="tab"
          className={`tab ${activeTab === "enrollments" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("enrollments")}
        >
          🎓 Enrollments
        </a>
        <a
          role="tab"
          className={`tab ${activeTab === "payments" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("payments")}
        >
          💰 Payments
        </a>
        <a
          role="tab"
          className={`tab ${activeTab === "attendence" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("attendence")}
        >
          💰 Attendence
        </a>
        <a
          role="tab"
          className={`tab ${activeTab === "quizzes" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("quizzes")}
        >
          💰 Quizzes
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
              <span>
                Welcome to your admin dashboard! Manage everything from here.
              </span>
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
          <EnrollmentList
            onAdd={() => setEnrollmentModal({ isOpen: true, enrollment: null })}
            onEdit={(enrollment) =>
              setEnrollmentModal({ isOpen: true, enrollment })
            }
          />
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <PaymentList
            onAdd={() => setPaymentModal({ isOpen: true, payment: null })}
            onEdit={(payment) => setPaymentModal({ isOpen: true, payment })}
          />
        )}

        {/* Attandence Tab */}
        {activeTab === "attendence" && (
          <AttendanceList
            onAdd={() => setAttandenceModal({ isOpen: true, attandence: null })}
            onEdit={(attandence) =>
              setAttandenceModal({ isOpen: true, attandence })
            }
          />
        )}

        {/* Quizzes Tab */}
        {activeTab === "quizzes" && (
          <QuizList
            onAdd={() => setQuizzesModal({ isOpen: true, quiz: null })}
            onEdit={(quiz) => setQuizzesModal({ isOpen: true, quiz })}
          />
        )}
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

      {enrollmentModal.isOpen && (
        <EnrollmentForm
          batch={enrollmentModal.enrollment}
          onClose={() =>
            setEnrollmentModal({ isOpen: false, enrollment: null })
          }
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

      {attandenceModal.isOpen && (
        <AttendanceForm
          attandence={attandenceModal.attandence}
          onClose={() =>
            setAttandenceModal({ isOpen: false, attandence: null })
          }
          onSuccess={() => {
            // Optional: Show success toast
          }}
        />
      )}

      {quizzesModal.isOpen && (
        <QuizForm
          quiz={quizzesModal.quiz}
          onClose={() => setQuizzesModal({ isOpen: false, quiz: null })}
          onSuccess={() => {
            // Optional: Show success toast
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
