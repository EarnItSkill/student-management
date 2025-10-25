import {
  ArrowRight,
  BookOpen,
  Calendar,
  DollarSign,
  GraduationCap,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/useAppContext";

// সকল ডেটা একত্রিত করে কোর্সের ধরন (batchType) অনুযায়ী সারসংক্ষেপ তৈরি করে
const aggregateBatchData = (batches, enrollments, quizzes) => {
  const aggregatedData = {};

  batches.forEach((batch) => {
    const type = batch.batchType;
    const batchId = batch._id;
    const courseId = batch.courseId;

    if (!aggregatedData[type]) {
      aggregatedData[type] = {
        type,
        courseId,
        totalEnrolled: 0,
        totalBatches: 0,
        minFee: Infinity,
        batchIds: [],
        // পুরাতন কমন স্টাইল/নামকরণ
        ...getBatchTypeStyle(type),
      };
    }

    // এনরোলমেন্ট গণনা (ঐ ব্যাচের)
    const enrolledInBatch = enrollments.filter(
      (e) => e.batchId === batchId && e.status === "active"
    ).length;

    // তথ্য একত্রিত করা
    aggregatedData[type].totalEnrolled += enrolledInBatch;
    aggregatedData[type].totalBatches += 1;
    if (batch.courseFee < aggregatedData[type].minFee) {
      aggregatedData[type].minFee = batch.courseFee;
    }
    aggregatedData[type].batchIds.push(batchId);
  });

  // কুইজ গণনা (কোর্সের ID ধরে)
  const courseQuizCounts = quizzes.reduce((acc, quiz) => {
    acc[quiz.courseId] = (acc[quiz.courseId] || 0) + 1;
    return acc;
  }, {});

  // চূড়ান্ত ডেটা ফর্মেট
  return Object.values(aggregatedData).map((data) => ({
    ...data,
    quizCount: courseQuizCounts[data.courseId] || 0,
    cqCount: data.type === "ict" ? 15 : 10, // ডামি CQ সংখ্যা
  }));
};

// ব্যাচ টাইপ অনুযায়ী কার্ডের স্টাইল এবং বিবরণ নির্ধারণ
const getBatchTypeStyle = (type) => {
  if (type === "ict") {
    return {
      title: "ICT এডমিশন ও একাডেমিক",
      icon: "💻",
      color: "from-blue-500 to-indigo-600",
      tColor: "text-indigo-600",
      bgColor: "from-blue-50 to-indigo-50",
      borderColor: "border-indigo-300",
      description:
        "উচ্চ মাধ্যমিক ও এডমিশন আইসিটি কোর্সের চলমান ব্যাচসমূহ ও তথ্য।",
      popular: true,
    };
  } else if (type === "office") {
    return {
      title: "কম্পিউটার অফিস অ্যাপ্লিকেশন",
      icon: "🗄️",
      color: "from-green-500 to-teal-600",
      tColor: "text-teal-600",
      bgColor: "from-green-50 to-teal-50",
      borderColor: "border-teal-300",
      description:
        "কম্পিউটার বেসিক ও পেশাগত অফিস অ্যাপ্লিকেশনের চলমান ব্যাচসমূহ।",
      popular: false,
    };
  }
  //... অন্যান্য টাইপ
  return {};
};

// স্থায়ী তথ্য (সব কোর্সের জন্য একই)
const commonInfo = {
  duration: "৩ মাস",
  daysPerWeek: "৬ দিন (শনি - বৃহস্পতিবার)",
  features: [
    "অভিজ্ঞ শিক্ষক",
    "ছোট ব্যাচ সাইজ",
    "প্র্যাকটিক্যাল ক্লাস",
    "সার্টিফিকেট প্রদান",
  ],
};

const BatchScheduleSection = () => {
  // ডেটা একত্রিত করা
  const { batches, enrollments, quizzes } = useAppContext();
  const processedBatchGroups = aggregateBatchData(
    batches,
    enrollments,
    quizzes
  );

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold">
              কোর্স ও ব্যাচ সময়সূচী
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl py-3 font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            আপনার পছন্দের ব্যাচটি সম্পর্কে জেনে নিন
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            চলমান সকল ব্যাচের তথ্য নিচে দেওয়া হলো। বিস্তারিত জানতে যেকোনো কার্ডে
            ক্লিক করুন।
          </p>
        </div>

        {/* Batch Type Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {processedBatchGroups.map((group) => (
            <Link
              key={group.type}
              to={`/course-details/${group.type}`} // এখানে টাইপ অনুযায়ী বিস্তারিত পেজে পাঠানো হচ্ছে
              className={`card rounded-2xl shadow-xl bg-gradient-to-br ${group.bgColor} border-4 ${group.borderColor} hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden group/card relative block`}
            >
              {/* Popular Badge */}
              {group.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="flex items-center gap-1 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    জনপ্রিয়
                  </div>
                </div>
              )}

              <div className="card-body p-6">
                {/* Icon & Title */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">{group.icon}</div>
                  <div className="flex-1">
                    <h3 className={`text-2xl font-bold mb-1 ${group.tColor}`}>
                      {group.title}
                    </h3>
                    <p className="text-sm text-gray-400">{group.description}</p>
                  </div>
                </div>

                {/* Quick Stats - Highlighted */}
                <div
                  className={`bg-gradient-to-r ${group.color} p-4 rounded-xl mb-4 transform group-hover/card:scale-[1.02] transition-transform text-white`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      <span className="text-sm">কোর্স ফি:</span>
                    </div>
                    <span className="text-xl font-bold">
                      {group.minFee} টাকা
                    </span>
                  </div>
                </div>

                {/* Live Data Info */}
                <div className="space-y-3">
                  <InfoItem
                    icon={Users}
                    title="মোট এনরোলমেন্ট"
                    value={`${group.totalEnrolled} জন`}
                    color="text-red-500"
                  />
                  <InfoItem
                    icon={Calendar}
                    title="মোট ব্যাচ"
                    value={`${group.totalBatches} টি`}
                    color="text-blue-500"
                  />
                  <InfoItem
                    icon={BookOpen}
                    title="মোট MCQ সেট"
                    value={`${group.quizCount} টি`}
                    color="text-purple-500"
                  />
                </div>

                {/* CTA Button */}
                <button className="btn btn-primary w-full mt-6 gap-2 group-hover/card:gap-4 transition-all">
                  বিস্তারিত দেখুন
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </Link>
          ))}
        </div>

        {/* Additional Info Section (Common Info) */}
        <div className="card bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-2xl rounded-2xl">
          <div className="card-body p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left Side - Features */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <GraduationCap className="w-12 h-12" />
                  <h3 className="text-3xl font-bold">কোর্সের বিশেষত্ব</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {commonInfo.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-white/20 backdrop-blur-sm p-3 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="font-semibold">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - Class Days */}
              <div>
                <div className="card bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl">
                  <div className="card-body p-6">
                    <h4 className="text-xl font-bold mb-4">
                      সাধারণ সময়কাল ও দিন
                    </h4>
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="w-6 h-6" />
                      <span className="text-lg font-semibold">
                        {commonInfo.duration} মেয়াদী কোর্স
                      </span>
                    </div>
                    <p className="font-semibold mb-3">সাধারণত প্রতি সপ্তাহে:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {["শনি", "রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ"].map(
                        (day) => (
                          <div
                            key={day}
                            className="bg-white/30 backdrop-blur-sm py-2 px-3 rounded-lg text-center font-bold"
                          >
                            {day}
                          </div>
                        )
                      )}
                    </div>
                    <div className="mt-4 p-3 bg-white/30 backdrop-blur-sm rounded-lg text-center">
                      <span className="text-sm font-semibold">
                        শুক্রবার সাপ্তাহিক ছুটি
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ছোট হেল্পার কম্পোনেন্ট
const InfoItem = ({ icon: Icon, title, value, color }) => (
  <div className="flex items-center gap-3 text-sm p-2 rounded-lg bg-white/50 border border-gray-100">
    <div className="p-1 rounded-lg">
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
    <div className="flex justify-between flex-1">
      <p className="text-xs text-gray-400">{title}</p>
      <p className="font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default BatchScheduleSection;
