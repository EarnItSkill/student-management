import {
  BookOpen,
  Calendar,
  CheckCircle,
  DollarSign,
  Mail,
  MapPin,
  Phone,
  Search,
  TrendingUp,
  User,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";

const StudentProfile = () => {
  const navigate = useNavigate();
  const { currentUser, batches, courses, enrollments, attendance, payments } =
    useAppContext();

  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  // লগইন করা ছাত্রের তথ্য
  const student = currentUser;

  if (!student || student.role !== "student") {
    return (
      <div className="text-center py-20">
        <User className="w-20 h-20 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-4">অ্যাক্সেস নেই</h2>
        <button onClick={() => navigate("/login")} className="btn btn-primary">
          লগইন করুন
        </button>
      </div>
    );
  }

  // ছাত্রের enrollments
  const studentEnrollments = enrollments.filter(
    (e) => e.studentId === student._id
  );

  // ছাত্রের batches
  const studentBatches = studentEnrollments.map((enrollment) => {
    const batch = batches.find((b) => b._id === enrollment.batchId);
    const course = courses.find((c) => c._id === batch?.courseId);
    return { ...batch, course, enrollment };
  });

  // ছাত্রের attendance
  const studentAttendance = attendance.filter(
    (a) => a.studentId === student._id
  );

  // ছাত্রের payments
  const studentPayments = payments.filter((p) => p.studentId === student._id);

  // পরিসংখ্যান
  const totalPaid = studentPayments.reduce((sum, p) => sum + p.amount, 0);
  const presentCount = studentAttendance.filter(
    (a) => a.status === "present"
  ).length;
  const absentCount = studentAttendance.filter(
    (a) => a.status === "absent"
  ).length;
  const attendanceRate =
    studentAttendance.length > 0
      ? ((presentCount / studentAttendance.length) * 100).toFixed(1)
      : 0;

  return (
    <div className="space-y-6 p-6 bg-base-200 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold">আমার প্রোফাইল</h1>
      </div>

      {/* Student Profile Card */}
      <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 shadow-xl">
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
                    student.gender === "male" ? "badge-info" : "badge-secondary"
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-primary">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="stat-title">ভর্তিকৃত ব্যাচ</div>
          <div className="stat-value text-primary">{studentBatches.length}</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-success">
            <DollarSign className="w-8 h-8" />
          </div>
          <div className="stat-title">মোট পরিশোধ</div>
          <div className="stat-value text-success">
            ৳{totalPaid.toLocaleString()}
          </div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-info">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="stat-title">উপস্থিতির হার</div>
          <div className="stat-value text-info">{attendanceRate}%</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-accent">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div className="stat-title">মোট রেকর্ড</div>
          <div className="stat-value text-accent">
            {studentAttendance.length}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed bg-base-100 p-2 shadow-lg">
        <a
          className={`tab gap-2 ${
            activeTab === "overview" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("overview")}
        >
          <TrendingUp className="w-4 h-4" />
          সংক্ষিপ্ত তথ্য
        </a>
        <a
          className={`tab gap-2 ${activeTab === "batches" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("batches")}
        >
          <BookOpen className="w-4 h-4" />
          আমার ব্যাচসমূহ
        </a>
        <a
          className={`tab gap-2 ${
            activeTab === "attendance" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("attendance")}
        >
          <Calendar className="w-4 h-4" />
          উপস্থিতি
        </a>
        <a
          className={`tab gap-2 ${
            activeTab === "payments" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("payments")}
        >
          <DollarSign className="w-4 h-4" />
          পেমেন্ট
        </a>
      </div>

      {/* Tab Content */}
      <div className="bg-base-100 rounded-lg shadow-lg p-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">সংক্ষিপ্ত বিবরণ</h2>

            {/* Performance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="stat bg-success text-white rounded-lg shadow-lg">
                <div className="stat-title text-white">উপস্থিত দিন</div>
                <div className="stat-value">{presentCount}</div>
                <div className="stat-desc text-white">
                  {attendanceRate}% উপস্থিতি
                </div>
              </div>

              <div className="stat bg-error text-white rounded-lg shadow-lg">
                <div className="stat-title text-white">অনুপস্থিত দিন</div>
                <div className="stat-value">{absentCount}</div>
                <div className="stat-desc text-white">
                  {studentAttendance.length} মোট রেকর্ড
                </div>
              </div>

              <div className="stat bg-warning text-white rounded-lg shadow-lg">
                <div className="stat-title text-white">পেমেন্ট স্ট্যাটাস</div>
                <div className="stat-value">
                  {studentPayments.filter((p) => p.status === "paid").length}
                </div>
                <div className="stat-desc text-white">
                  {studentPayments.length} মোট পেমেন্ট
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Attendance */}
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">সাম্প্রতিক উপস্থিতি</h3>
                  {studentAttendance.length === 0 ? (
                    <p className="text-gray-500">কোন রেকর্ড নেই</p>
                  ) : (
                    <div className="space-y-2">
                      {studentAttendance
                        .slice(-5)
                        .reverse()
                        .map((record) => (
                          <div
                            key={record._id}
                            className="flex justify-between items-center p-3 bg-base-100 rounded-lg"
                          >
                            <span className="font-semibold">{record.date}</span>
                            {record.status === "present" ? (
                              <span className="badge badge-success gap-1">
                                <CheckCircle className="w-3 h-3" />
                                উপস্থিত
                              </span>
                            ) : (
                              <span className="badge badge-error gap-1">
                                <XCircle className="w-3 h-3" />
                                অনুপস্থিত
                              </span>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Payments */}
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">সাম্প্রতিক পেমেন্ট</h3>
                  {studentPayments.length === 0 ? (
                    <p className="text-gray-500">কোন রেকর্ড নেই</p>
                  ) : (
                    <div className="space-y-2">
                      {studentPayments
                        .slice(-5)
                        .reverse()
                        .map((payment) => (
                          <div
                            key={payment._id}
                            className="flex justify-between items-center p-3 bg-base-100 rounded-lg"
                          >
                            <div>
                              <div className="font-bold">৳{payment.amount}</div>
                              <div className="text-xs text-gray-500">
                                {payment.paymentDate}
                              </div>
                            </div>
                            <span
                              className={`badge ${
                                payment.status === "paid"
                                  ? "badge-success"
                                  : payment.status === "partial"
                                  ? "badge-warning"
                                  : "badge-error"
                              }`}
                            >
                              {payment.status}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Batches Tab */}
        {activeTab === "batches" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">আমার ব্যাচসমূহ</h2>
            {studentBatches.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">কোন ব্যাচে ভর্তি নেই</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {studentBatches.map((batch) => (
                  <div
                    key={batch._id}
                    className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all"
                  >
                    <div className="card-body">
                      <h3 className="card-title">{batch.batchName}</h3>
                      <p className="text-sm text-gray-400">
                        {batch.course?.title}
                      </p>

                      <div className="divider my-2"></div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">শুরুর তারিখ:</span>
                          <span className="font-semibold">
                            {new Date(batch.startDate).toLocaleDateString(
                              "en-GB"
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">শেষের তারিখ:</span>
                          <span className="font-semibold">
                            {new Date(batch.endDate).toLocaleDateString(
                              "en-GB"
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">ফি:</span>
                          <span className="font-bold text-primary">
                            ৳{batch.courseFee}
                          </span>
                        </div>
                      </div>

                      <div className="badge badge-success mt-2">
                        {batch.enrollment?.status || "সক্রিয়"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === "attendance" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">আমার উপস্থিতি</h2>
              <div className="form-control">
                <div className="input-group">
                  <span>
                    <Search className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    placeholder="তারিখ দিয়ে খুঁজুন..."
                    className="input input-bordered"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {studentAttendance.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">কোন উপস্থিতির রেকর্ড নেই</p>
              </div>
            ) : (
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <div className="overflow-x-auto">
                    <table className="table table-zebra">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>তারিখ</th>
                          <th>ব্যাচ</th>
                          <th>স্ট্যাটাস</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentAttendance
                          .filter((a) => a.date.includes(searchTerm))
                          .map((record, index) => {
                            const batch = batches.find(
                              (b) => b._id === record.batchId
                            );
                            return (
                              <tr key={record._id}>
                                <td>{index + 1}</td>
                                <td className="font-semibold">{record.date}</td>
                                <td>{batch?.batchName || "N/A"}</td>
                                <td>
                                  {record.status === "present" ? (
                                    <span className="badge badge-success gap-1">
                                      <CheckCircle className="w-4 h-4" />
                                      উপস্থিত
                                    </span>
                                  ) : (
                                    <span className="badge badge-error gap-1">
                                      <XCircle className="w-4 h-4" />
                                      অনুপস্থিত
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

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">আমার পেমেন্ট</h2>
              <div className="stat bg-base-200 rounded-lg">
                <div className="stat-title">মোট পরিশোধ</div>
                <div className="stat-value text-primary">
                  ৳{totalPaid.toLocaleString()}
                </div>
              </div>
            </div>

            {studentPayments.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">কোন পেমেন্ট রেকর্ড নেই</p>
              </div>
            ) : (
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <div className="overflow-x-auto">
                    <table className="table table-zebra">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>তারিখ</th>
                          <th>ব্যাচ</th>
                          <th>পরিমাণ</th>
                          <th>পদ্ধতি</th>
                          <th>স্ট্যাটাস</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentPayments.map((payment, index) => {
                          const batch = batches.find(
                            (b) => b._id === payment.batchId
                          );
                          return (
                            <tr key={payment._id}>
                              <td>{index + 1}</td>
                              <td>{payment.paymentDate}</td>
                              <td>{batch?.batchName || "N/A"}</td>
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
                                  className={`badge ${
                                    payment.status === "paid"
                                      ? "badge-success"
                                      : payment.status === "partial"
                                      ? "badge-warning"
                                      : "badge-error"
                                  }`}
                                >
                                  {payment.status === "paid"
                                    ? "পরিশোধিত"
                                    : payment.status === "partial"
                                    ? "আংশিক"
                                    : "বকেয়া"}
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
      </div>
    </div>
  );
};

export default StudentProfile;
