import {
  ArrowLeft,
  ArrowRight,
  BarChart2,
  BookOpen,
  Clock,
  GraduationCap,
  Users,
  Zap,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../../context/useAppContext";
import Navbar from "../common/Navbar";

// ডেটা প্রসেসিং ফাংশন (কোর্স টাইপ ধরে)
const getCourseDetailsByType = (type, batches, enrollments, quizzes) => {
  const typeBatches = batches.filter((b) => b.batchType === type);
  if (typeBatches.length === 0) return null;

  const courseId = typeBatches[0].courseId;

  // মোট এনরোলমেন্ট গণনা
  const allBatchIds = typeBatches.map((b) => b._id);
  const totalEnrolled = enrollments.filter(
    (e) => allBatchIds.includes(e.batchId) && e.status === "active"
  ).length;

  // মোট সিট গণনা
  const totalSeats = typeBatches.reduce(
    (sum, batch) => sum + batch.totalSeats,
    0
  );

  // কুইজ ও CQ গণনা
  const quizCount = quizzes.filter((q) => q.courseId === courseId).length;
  const cqCount = type === "ict" ? 15 : 10; // ডামি CQ সংখ্যা

  // ব্যাচগুলোর জন্য এনরোলমেন্ট আপডেট করা
  const detailedBatches = typeBatches.map((batch) => ({
    ...batch,
    enrolled: enrollments.filter(
      (e) => e.batchId === batch._id && e.status === "active"
    ).length,
  }));

  // কমন তথ্য
  const courseTitle =
    type === "ict"
      ? "উচ্চ মাধ্যমিক ICT ও এডমিশন প্রস্তুতি"
      : "কম্পিউটার অফিস অ্যাপ্লিকেশন প্রো";
  const courseIcon = type === "ict" ? "💻" : "🗄️";
  const courseDescription =
    type === "ict"
      ? "আইসিটি বিষয়টিকে একদম বেসিক থেকে এডভান্স লেভেল পর্যন্ত প্র্যাকটিক্যালভাবে শেখার সুবর্ণ সুযোগ।"
      : "চাকরি ও পেশাগত জীবনের জন্য প্রয়োজনীয় সকল অফিস সফটওয়্যার ও স্কিলস।";
  const features = [
    `সর্বমোট ${quizCount}টি অধ্যায়ভিত্তিক MCQ কুইজ`,
    `মোট ${cqCount}টি সৃজনশীল প্রশ্ন (CQ) সমাধান`,
    "৩ মাস মেয়াদী সম্পূর্ণ কোর্স",
    "প্র্যাকটিক্যাল ক্লাস সুবিধা",
    "লাইফটাইম এক্সেস",
  ];

  return {
    type,
    courseTitle,
    courseIcon,
    courseDescription,
    totalEnrolled,
    totalSeats,
    quizCount,
    cqCount,
    features,
    batches: detailedBatches, // এই কোর্সের অধীনে সকল ব্যাচ
  };
};

const BatchDetails = () => {
  const { batches, enrollments, quizzes, cqQuestions } = useAppContext();

  const { batchType } = useParams();

  // ২. ডেটা প্রসেস করা
  const details = getCourseDetailsByType(
    batchType,
    batches,
    enrollments,
    quizzes
  );

  if (!details) {
    return (
      <div className="text-center py-20 bg-gray-50">
        কোর্সটির তথ্য খুঁজে পাওয়া যায়নি।
      </div>
    );
  }

  const {
    courseTitle,
    courseIcon,
    courseDescription,
    totalEnrolled,
    totalSeats,
    quizCount,
    cqCount,
    features,
    batches: activeBatches,
  } = details;

  return (
    <div className="container mx-auto px-4 pb-12 relative">
      <Navbar />
      <Link
        to="/"
        className="text-indigo-600 hover:underline flex items-center mb-6 font-semibold absolute top-24 right-10"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> ফিরুন
      </Link>
      <div className="bg-white p-8 rounded-xl shadow-2xl border-t-8 border-indigo-600">
        {/* 📌 কোর্স হেডার */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b">
          <span className="text-6xl">{courseIcon}</span>
          <div>
            <h1 className="text-4xl font-extrabold text-indigo-700">
              {courseTitle}
            </h1>
            <p className="text-lg text-gray-400 mt-1">{courseDescription}</p>
          </div>
        </div>

        {/* 📌 লাইভ স্ট্যাটাস (MCQ, এনরোলমেন্ট) */}
        <h2 className="text-2xl font-bold mb-4 text-gray-700 flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-pink-600" />
          কোর্স স্ট্যাটাস{" "}
          <span className="text-sm font-medium text-pink-600">
            (লাইভ আপডেট)
          </span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="মোট এনরোলমেন্ট"
            value={`${totalEnrolled} জন`}
            color="bg-red-100 text-red-600"
          />
          <StatCard
            icon={Zap}
            title="মোট সিট সংখ্যা"
            value={`${totalSeats} টি`}
            color="bg-yellow-100 text-yellow-600"
          />
          <StatCard
            icon={BookOpen}
            title="মোট MCQ কুইজ"
            value={`${quizCount} টি`}
            color="bg-purple-100 text-purple-600"
          />
          <StatCard
            icon={BookOpen}
            title="মোট CQ প্রশ্ন"
            // value={`${cqCount} টি`}
            value={`${cqQuestions.length} টি`}
            color="bg-teal-100 text-teal-600"
          />
        </div>

        {/* 📌 কোর্সের মূল সুবিধা */}
        <h2 className="text-2xl font-bold mb-4 text-gray-700 border-t pt-6 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-green-600" />
          কোর্সের মূল সুবিধা
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start text-gray-700 bg-green-50 p-3 rounded-lg border-l-4 border-green-400"
            >
              <span className="text-green-500 mr-2 mt-1">✓</span>
              <p className="font-medium">{feature}</p>
            </div>
          ))}
        </div>

        {/* 📌 চলমান সকল ব্যাচের সময়সূচী */}
        <h2 className="text-2xl font-bold mb-6 text-gray-700 border-t pt-6 flex items-center gap-2">
          <Clock className="w-6 h-6 text-indigo-600" />
          চলমান সকল ব্যাচের সময়সূচী ({activeBatches.length} টি)
        </h2>
        <div className="space-y-4 grid grid-cols-2 md:grid-cols-3 gap-4">
          {activeBatches.map((batch) => (
            <div
              key={batch._id}
              className="p-5 border border-indigo-200 rounded-xl shadow-md hover:shadow-lg transition-shadow bg-white"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-indigo-800">
                  {batch.batchName}
                </h3>
                <div className="flex items-center gap-2 bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  <Clock className="w-4 h-4" />
                  {batch.startTime}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mt-2">
                <p>
                  <span className="font-semibold text-gray-700">
                    ক্লাসের দিন:
                  </span>{" "}
                  {getDaysString(batch.scheduleType)}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">ট্রেইনার:</span>{" "}
                  {batch.instructor || "নির্ধারিত নয়"}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">মোট ফি:</span>{" "}
                  {batch.courseFee} টাকা
                </p>
                <p className="font-bold text-red-600">
                  <span className="font-semibold text-gray-700">ভর্তি:</span>{" "}
                  {batch.enrolled}/{batch.totalSeats} জন
                </p>
              </div>
              <div className="mt-4 text-right">
                <a
                  href={`/enroll/${batch._id}`}
                  className="text-green-600 hover:text-green-700 font-bold flex items-center justify-end"
                >
                  এই ব্যাচে এখনই ভর্তি হন{" "}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ছোট হেল্পার কম্পোনেন্ট
const StatCard = ({ icon: Icon, title, value, color }) => (
  <div
    className={`p-4 rounded-xl flex flex-col items-center justify-center ${color} shadow-lg`}
  >
    <Icon className="w-8 h-8 mb-2" />
    <p className="text-xs font-semibold">{title}</p>
    <p className="font-extrabold text-2xl">{value}</p>
  </div>
);

const getDaysString = (scheduleType) => {
  if (scheduleType === "SIX_DAYS") return "৬ দিন (শনি - বৃহঃ)";
  if (scheduleType === "THREE_DAYS_A") return "৩ দিন (রবি, মঙ্গল, বৃহঃ)";
  if (scheduleType === "THREE_DAYS_B") return "৩ দিন (শনি, সোম, বুধ)";
  return "অজানা";
};

// এই কম্পোনেন্টটিকে আপনার রাউটারে CourseDetails হিসেবে ব্যবহার করুন।
export default BatchDetails;
