import {
  AlertCircle,
  Award,
  BookOpen,
  Calendar,
  Clock,
  Download,
  Eye,
  FileText,
  GraduationCap,
  Medal,
  Printer,
  Share2,
  Star,
  Target,
  Trophy,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const Certificates = () => {
  const [certificatesData, setCertificatesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchCertificatesData = async () => {
      try {
        const courses = [
          {
            _id: "68e609e49e158e162999fa2c",
            title: "ICT: এইচ.এস.সি এবং আলিম",
            description:
              "একটি ভিন্ন ধরনের কোর্স। এই কোর্সটি করলে ইনশাআল্লাহ, আপনাকে আর কোনদিন ICT প্রাইভেট পড়তে হবে না।",
            duration: "৩ মাস",
            fee: 4000,
            instructorName: "মো. মোজাম্মেল হক",
          },
          {
            _id: "68f4f0622b1807a6b2e04572",
            title: "Office Course",
            description: "MS Office Course",
            duration: "৩ মাস",
            fee: 8000,
            instructorName: "মো. মোজাম্মেল হক",
          },
        ];

        const batches = [
          {
            _id: "68ea66906f4afcbeebf85f5e",
            batchName: "ICT - সকাল - ছেলে",
            courseId: "68e609e49e158e162999fa2c",
            startDate: "2025-10-13",
            endDate: "2025-10-31",
            sBatchId: "BATCH-0001",
            instructor: "মো. মোজাম্মেল হক",
          },
          {
            _id: "68ea76ef6f4afcbeebf85f66",
            batchName: "ICT - সকাল - মেয়ে",
            courseId: "68e609e49e158e162999fa2c",
            startDate: "2025-10-10",
            endDate: "2025-10-18",
            sBatchId: "BATCH-0002",
            instructor: "মো. মোজাম্মেল হক",
          },
        ];

        const currentUser = {
          _id: "69020a379a609757955ea217",
          studentId: "STU-0001",
          name: "ইকবাল হোসেইন",
        };

        const enrollments = [
          {
            _id: "68eb1c8f200f2e5fb7efd582",
            studentId: "69020a379a609757955ea217",
            batchId: "68ea76ef6f4afcbeebf85f66",
            courseId: "68e609e49e158e162999fa2c",
            enrollDate: "2025-10-12",
            status: "active",
            grade: "A+",
            percentage: 92,
            completionDate: "2024-04-15",
            issueDate: "2024-04-20",
            certificateStatus: "issued",
          },
        ];

        const studentCourses = enrollments.filter(
          (e) => e.studentId === currentUser._id
        );

        const certificatesWithDetails = studentCourses.map((enrollment) => {
          const course = courses.find((c) => c._id === enrollment.courseId);
          const batch = batches.find((b) => b._id === enrollment.batchId);

          return {
            _id: enrollment._id,
            certificateId: `CTC-CERT-${new Date().getFullYear()}-${enrollment._id
              .slice(-6)
              .toUpperCase()}`,
            courseName: course?.title || "Unknown Course",
            courseCode: course?._id?.slice(-6).toUpperCase() || "UNKNOWN",
            courseType: "সার্টিফিকেট কোর্স",
            duration: course?.duration || "Unknown",
            completionDate: enrollment.completionDate,
            issueDate: enrollment.issueDate,
            status:
              enrollment.certificateStatus === "issued"
                ? "জারিকৃত"
                : "অগ্রগতিতে",
            grade: enrollment.grade || null,
            percentage: enrollment.percentage || 0,
            instructor: batch?.instructor || "Unknown",
            skills: [
              "Microsoft Word Advanced",
              "Microsoft Excel Professional",
              "Microsoft PowerPoint Design",
              "Data Analysis & Reporting",
            ],
            verificationCode: `VERIFY-${course?._id
              ?.slice(-6)
              .toUpperCase()}-${new Date().getFullYear()}-${enrollment._id
              .slice(-3)
              .toUpperCase()}`,
            downloadUrl: `/certificates/CTC-CERT-${new Date().getFullYear()}.pdf`,
          };
        });

        const mockData = {
          studentInfo: {
            name: currentUser.name,
            studentId: currentUser.studentId,
            totalCertificates: certificatesWithDetails.filter(
              (c) => c.status === "জারিকৃত"
            ).length,
            pendingCertificates: certificatesWithDetails.filter(
              (c) => c.status === "অগ্রগতিতে"
            ).length,
            joinDate: enrollments[0]?.enrollDate || "2024-01-15",
          },
          certificates: certificatesWithDetails,
          achievements: {
            totalCoursesCompleted: certificatesWithDetails.filter(
              (c) => c.status === "জারিকৃত"
            ).length,
            averageGrade:
              certificatesWithDetails.length > 0
                ? Math.round(
                    certificatesWithDetails.reduce(
                      (sum, c) => sum + (c.percentage || 0),
                      0
                    ) / certificatesWithDetails.length
                  )
                : 0,
            highestGrade: Math.max(
              ...certificatesWithDetails.map((c) => c.percentage || 0),
              0
            ),
            certificatesEarned: certificatesWithDetails.filter(
              (c) => c.status === "জারিকৃত"
            ).length,
            skillsLearned: certificatesWithDetails.reduce((sum) => sum + 4, 0),
            totalHoursCompleted: 180,
          },
          recentActivities: [
            {
              date: new Date().toISOString(),
              activity: "নতুন কোর্স শুরু করেছেন",
              type: "course_started",
            },
          ],
        };

        setTimeout(() => {
          setCertificatesData(mockData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching certificates data:", error);
        setLoading(false);
      }
    };

    fetchCertificatesData();
  }, []);

  const handleViewCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setShowPreviewModal(true);
  };

  const handleDownloadCertificate = (certificate) => {
    if (certificate.status !== "জারিকৃত") {
      alert("এই সার্টিফিকেট এখনো জারি হয়নি");
      return;
    }
    alert(`সার্টিফিকেট ডাউনলোড হচ্ছে - ${certificate.certificateId}`);
  };

  const handleShareCertificate = (certificate) => {
    if (certificate.status !== "জারিকৃত") {
      alert("এই সার্টিফিকেট এখনো জারি হয়নি");
      return;
    }

    const shareData = {
      title: `${certificate.courseName} - সার্টিফিকেট`,
      text: `Computer Training Center থেকে ${certificate.courseName} কোর্সের সার্টিফিকেট।`,
      url: `https://ctc-edu.com/verify/${certificate.verificationCode}`,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert("সার্টিফিকেট লিংক কপি করা হয়েছে");
    }
  };

  const handlePrintCertificate = (certificate) => {
    if (certificate.status !== "জারিকৃত") {
      alert("এই সার্টিফিকেট এখনো জারি হয়নি");
      return;
    }
    window.print();
  };

  const filteredCertificates =
    certificatesData?.certificates.filter((cert) => {
      if (filterStatus === "all") return true;
      return cert.status === filterStatus;
    }) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!certificatesData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">
            সার্টিফিকেট তথ্য লোড করতে সমস্যা হয়েছে
          </p>
        </div>
      </div>
    );
  }

  const { studentInfo, certificates, achievements, recentActivities } =
    certificatesData;

  return (
    <div className="space-y-6 p-4">
      {/* Achievement Summary */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">আমার সার্টিফিকেট</h1>
            <p className="text-green-100">
              মোট {studentInfo.totalCertificates} টি সার্টিফিকেট অর্জিত
            </p>
            <p className="text-green-100 text-sm mt-1">
              গড় গ্রেড: {achievements.averageGrade}%
            </p>
          </div>
          <div className="hidden md:block">
            <div className="h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Award className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Trophy className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">সার্টিফিকেট</p>
              <p className="text-2xl font-bold text-gray-900">
                {achievements.certificatesEarned}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">সম্পন্ন কোর্স</p>
              <p className="text-2xl font-bold text-gray-900">
                {achievements.totalCoursesCompleted}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">সর্বোচ্চ গ্রেড</p>
              <p className="text-2xl font-bold text-gray-900">
                {achievements.highestGrade}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">দক্ষতা অর্জন</p>
              <p className="text-2xl font-bold text-gray-900">
                {achievements.skillsLearned}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Certificates Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Award className="h-5 w-5 mr-2 text-green-600" />
              আমার সার্টিফিকেটসমূহ
            </h2>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">সব সার্টিফিকেট</option>
              <option value="জারিকৃত">জারিকৃত</option>
              <option value="অগ্রগতিতে">অগ্রগতিতে</option>
            </select>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCertificates.map((certificate) => (
              <div
                key={certificate._id}
                className={`border-2 rounded-lg p-6 transition-all hover:shadow-lg ${
                  certificate.status === "জারিকৃত"
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-green-600 mb-2">
                      {certificate.courseName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      কোড: {certificate.courseCode} | {certificate.courseType}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      মেয়াদ: {certificate.duration}
                    </p>
                  </div>
                  <div className="text-center">
                    <div
                      className={`p-3 rounded-full ${
                        certificate.status === "জারিকৃত"
                          ? "bg-green-100"
                          : "bg-yellow-100"
                      }`}
                    >
                      {certificate.status === "জারিকৃত" ? (
                        <Award className="h-6 w-6 text-green-600" />
                      ) : (
                        <Clock className="h-6 w-6 text-yellow-600" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Status and Grade */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      certificate.status === "জারিকৃত"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {certificate.status}
                  </span>

                  {certificate.grade && (
                    <div className="flex items-center space-x-2">
                      <Medal className="h-4 w-4 text-yellow-500" />
                      <span className="font-bold text-lg text-gray-900">
                        {certificate.grade}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({certificate.percentage}%)
                      </span>
                    </div>
                  )}
                </div>

                {/* Certificate Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      শিক্ষক: {certificate.instructor}
                    </span>
                  </div>

                  {certificate.completionDate && (
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">
                        সমাপ্তি:{" "}
                        {new Date(
                          certificate.completionDate
                        ).toLocaleDateString("bn-BD")}
                      </span>
                    </div>
                  )}

                  {certificate.issueDate && (
                    <div className="flex items-center text-sm">
                      <FileText className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">
                        জারি:{" "}
                        {new Date(certificate.issueDate).toLocaleDateString(
                          "bn-BD"
                        )}
                      </span>
                    </div>
                  )}

                  {certificate.certificateId && (
                    <div className="flex items-center text-sm">
                      <span className="text-gray-600">সার্টিফিকেট ID: </span>
                      <span className="font-mono text-xs ml-1">
                        {certificate.certificateId}
                      </span>
                    </div>
                  )}
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    অর্জিত দক্ষতা:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {certificate.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {certificate.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{certificate.skills.length - 3} আরো
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewCertificate(certificate)}
                    className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    দেখুন
                  </button>

                  {certificate.status === "জারিকৃত" && (
                    <>
                      <button
                        onClick={() => handleDownloadCertificate(certificate)}
                        className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        title="ডাউনলোড"
                      >
                        <Download className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleShareCertificate(certificate)}
                        className="px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        title="শেয়ার করুন"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handlePrintCertificate(certificate)}
                        className="px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        title="প্রিন্ট করুন"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredCertificates.length === 0 && (
            <div className="text-center py-8">
              <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                কোন সার্টিফিকেট পাওয়া যায়নি
              </h3>
              <p className="text-gray-600">
                আপনার কোর্স সম্পন্ন করুন সার্টিফিকেট পেতে
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Certificate Preview Modal */}
      {showPreviewModal && selectedCertificate && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                সার্টিফিকেট প্রিভিউ
              </h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Certificate Design */}
            <div className="p-8">
              <div className="border-4 border-green-600 rounded-lg p-8 bg-gradient-to-br from-white to-green-50">
                <div className="text-center">
                  {/* Header */}
                  <div className="mb-8">
                    <div className="flex justify-center mb-4">
                      <div className="h-16 w-16 bg-green-600 rounded-full flex items-center justify-center">
                        <GraduationCap className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Computer Training Center
                    </h1>
                    <p className="text-lg text-gray-600">
                      সার্টিফিকেট অফ কমপ্লিশন
                    </p>
                  </div>

                  {/* Certificate Content */}
                  <div className="mb-8">
                    <p className="text-lg text-gray-700 mb-4">
                      এই মর্মে প্রত্যয়ন করা যাচ্ছে যে,
                    </p>
                    <h2 className="text-4xl font-bold text-gray-900 mb-6 border-b-2 border-green-600 inline-block pb-2">
                      {studentInfo.name}
                    </h2>
                    <p className="text-lg text-gray-700 mb-2">
                      সফলভাবে সম্পন্ন করেছেন
                    </p>
                    <h3 className="text-3xl font-bold text-green-600 mb-4">
                      {selectedCertificate.courseName}
                    </h3>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-3 gap-6 mb-8 text-sm">
                    <div>
                      <p className="text-gray-600">কোর্স কোড</p>
                      <p className="font-bold text-gray-900">
                        {selectedCertificate.courseCode}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">গ্রেড</p>
                      <p className="font-bold text-gray-900">
                        {selectedCertificate.grade} (
                        {selectedCertificate.percentage}%)
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">তারিখ</p>
                      <p className="font-bold text-gray-900">
                        {new Date(
                          selectedCertificate.issueDate
                        ).toLocaleDateString("bn-BD")}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t-2 border-green-600 pt-6">
                    <p className="text-xs text-gray-600 mb-4">
                      সার্টিফিকেট নং: {selectedCertificate.certificateId}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedCertificate.instructor}
                    </p>
                    <p className="text-xs text-gray-600">শিক্ষক</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                বন্ধ করুন
              </button>
              <button
                onClick={() => handlePrintCertificate(selectedCertificate)}
                className="px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center"
              >
                <Printer className="h-4 w-4 mr-1" />
                প্রিন্ট
              </button>
              <button
                onClick={() => handleShareCertificate(selectedCertificate)}
                className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
              >
                <Share2 className="h-4 w-4 mr-1" />
                শেয়ার
              </button>
              <button
                onClick={() => handleDownloadCertificate(selectedCertificate)}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
              >
                <Download className="h-4 w-4 mr-1" />
                ডাউনলোড
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;
