import { AlertCircle, ArrowRight, Calendar, Clock, Users } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/useAppContext";

const UpcomingBatchesSection = ({ limit }) => {
  const { batches, courses, enrollments } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const path = location.pathname;

  const visibleCards = limit ? batches.slice(0, limit) : batches;

  const handleClick = () => {
    navigate("/up-comming");
    window.scrollTo({ top: 0 });
  };

  // Get upcoming batches
  const upcomingBatches = visibleCards
    .filter((batch) => {
      const startDateUTC = new Date(batch.startDate);

      // UTC থেকে local time এ রূপান্তর
      const startDateLocal = new Date(
        startDateUTC.getTime() + startDateUTC.getTimezoneOffset() * 60000
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0); // আজকের তারিখ (সময় ছাড়া)

      // দিনের পার্থক্য বের করা
      const daysUntilStart = Math.floor(
        (startDateLocal - today) / (1000 * 60 * 60 * 24)
      );

      // শুধু আজ বা ভবিষ্যতের ব্যাচ
      return daysUntilStart >= 0;
    })
    .sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);

      const localA = new Date(
        dateA.getTime() + dateA.getTimezoneOffset() * 60000
      );
      const localB = new Date(
        dateB.getTime() + dateB.getTimezoneOffset() * 60000
      );

      return localA - localB;
    });

  if (upcomingBatches.length === 0) {
    return null;
  }

  // Calculate days until batch starts
  const getDaysUntilStart = (startDate) => {
    const startDateUTC = new Date(startDate);
    // UTC থেকে local date এ convert করো
    const startDateLocal = new Date(
      startDateUTC.getTime() + startDateUTC.getTimezoneOffset() * 60000
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diff = Math.ceil((startDateLocal - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Format time
  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const classDay = (scheduleType) => {
    switch (scheduleType) {
      case "SIX_DAYS":
        return "সপ্তাহে ৬ দিন, শনি-বৃহ:";

      case "THREE_DAYS_A":
        return "শনি, সোম, মঙ্গল";

      case "THREE_DAYS_B":
        return "রবি, মঙ্গল, বৃহস্পতি";

      default:
        return null;
    }
  };

  return (
    <section
      id="batch-schedule"
      className=" min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 px-4 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 opacity-10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          {/* <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-red-500 bg-opacity-10 border border-red-400 border-opacity-30">
            <Zap className="w-5 h-5 text-red-400 animate-pulse" />
            <span className="text-red-300 font-semibold text-sm">
              সীমিত সময়ের অফার
            </span>
          </div> */}

          <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
            আসন্ন ব্যাচসমূহ
          </h2>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            শীঘ্রই শুরু হতে যাচ্ছে যে ব্যাচগুলো - এখনই ভর্তি হন
          </p>
        </div>

        {/* Batches Carousel */}
        <>
          <div className="overflow-x-auto scrollbar-hide">
            <div
              className="grid md:grid-cols-3 gap-4 p-10"
              style={{ minWidth: "max-content" }}
            >
              {upcomingBatches.map((batch, index) => {
                const course = courses.find((c) => c._id === batch.courseId);
                const daysUntil = getDaysUntilStart(batch.startDate);
                const enrolledCount = enrollments.filter(
                  (e) => e.batchId === batch._id
                ).length;
                const availableSeats = batch.totalSeats - enrolledCount;
                const occupancyPercent =
                  (enrolledCount / batch.totalSeats) * 100;

                return (
                  <div
                    key={batch._id}
                    className="group relative flex-shrink-0 w-11/12 mb-5 h-auto"
                    style={{
                      animation: `slideInLeft 0.6s ease-out ${
                        index * 0.1
                      }s both`,
                    }}
                  >
                    {/* Glowing Background */}
                    <div className="absolute -inset-1 bg-gradient-to-br from-red-600 via-orange-600 to-pink-600 opacity-20 group-hover:opacity-40 rounded-2xl blur-xl transition-opacity duration-500"></div>

                    {/* Card */}
                    <div className="relative bg-slate-800 bg-opacity-80 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-2xl group-hover:border-red-500 transition-all duration-500 hover:shadow-red-500/50">
                      {/* Countdown Badge */}
                      <div
                        className={`absolute -top-3 -right-3 px-4 py-2 rounded-full text-white font-bold shadow-lg flex items-center gap-2 z-10 ${
                          daysUntil === 0
                            ? "bg-gradient-to-r from-red-600 to-pink-600 animate-bounce"
                            : daysUntil <= 7
                            ? "bg-gradient-to-r from-orange-600 to-red-600"
                            : "bg-gradient-to-r from-blue-600 to-purple-600"
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          {daysUntil === 0
                            ? "আজ শুরু!"
                            : `${daysUntil} দিন বাকি`}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        {/* Batch Name and Course */}
                        <div>
                          <h3 className="text-2xl font-black text-white mb-1 group-hover:text-red-300 transition-colors">
                            {batch.batchName}
                          </h3>
                          <p className="text-blue-300 font-semibold text-lg">
                            {course?.title}
                          </p>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gradient-to-r from-blue-600 to-purple-600 opacity-30"></div>

                        {/* Batch Details */}
                        <div className="space-y-3">
                          {/* Start Date */}
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-blue-400" />
                            </div>
                            <div>
                              <div className="text-xs text-slate-400 uppercase tracking-wider">
                                শুরু হবে
                              </div>
                              <div className="font-semibold text-white">
                                {new Date(batch.startDate).toLocaleDateString(
                                  "bn-BD",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Start Time */}
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center">
                              <Clock className="w-4 h-4 text-purple-400" />
                            </div>
                            <div>
                              <div className="text-xs text-slate-400 uppercase tracking-wider">
                                ক্লাসের সময়
                              </div>
                              <div className="font-semibold text-white">
                                {formatTime(batch.startTime)}
                              </div>
                            </div>
                          </div>

                          {/* Class Days */}
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-600/20 flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-green-400" />
                            </div>
                            <div>
                              <div className="text-xs text-slate-400 uppercase tracking-wider">
                                ক্লাসের দিন
                              </div>
                              <div className="font-semibold text-white">
                                {classDay(batch.scheduleType)}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            {/* Gender Badge */}
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-bold text-white ${
                                batch?.gender === "male"
                                  ? "bg-blue-600/50"
                                  : batch?.gender === "female"
                                  ? "bg-pink-600/50"
                                  : "bg-slate-600/50"
                              }`}
                            >
                              {batch?.gender}
                            </span>
                            {/* batchMode Badge */}
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-bold text-white ${
                                batch?.batchMode === "online"
                                  ? "bg-yellow-600/50"
                                  : batch?.batchMode === "offline"
                                  ? "bg-indigo-600/50"
                                  : "bg-slate-600/50"
                              }`}
                            >
                              {batch?.batchMode}
                            </span>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gradient-to-r from-blue-600 to-purple-600 opacity-30"></div>

                        {/* Seat Information */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-300">
                              <Users className="w-4 h-4 text-orange-400" />
                              <span className="text-sm font-semibold">
                                আসন সংখ্যা
                              </span>
                            </div>
                            <span className="text-sm font-bold text-white">
                              {enrolledCount}/{batch.totalSeats}
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                occupancyPercent >= 80
                                  ? "bg-gradient-to-r from-red-600 to-red-500"
                                  : occupancyPercent >= 50
                                  ? "bg-gradient-to-r from-orange-600 to-orange-500"
                                  : "bg-gradient-to-r from-green-600 to-emerald-500"
                              }`}
                              style={{ width: `${occupancyPercent}%` }}
                            ></div>
                          </div>

                          {/* Available Seats */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400">
                              {availableSeats === 0
                                ? "🔴 আসন পূর্ণ"
                                : `✅ ${availableSeats} টি আসন খালি`}
                            </span>
                            <span className="text-xs font-bold text-slate-300">
                              {Math.round(occupancyPercent)}% পূর্ণ
                            </span>
                          </div>
                        </div>

                        {/* CTA Button */}
                        {availableSeats === 0 ? (
                          <div className="bg-red-600/20 border border-red-600/50 rounded-xl p-3 flex items-center gap-2 text-red-300">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm font-semibold">
                              আসন পূর্ণ - অন্য ব্যাচ দেখুন
                            </span>
                          </div>
                        ) : (
                          <Link
                            to="/login"
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group/btn"
                          >
                            এখনই ভর্তি হন
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scroll Indicator */}
          {upcomingBatches.length > 3 && (
            <div className="flex justify-center">
              {path === "/" && (
                <button
                  onClick={handleClick}
                  className="w-64 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group/btn"
                >
                  আসন্ন সকল ব্যাচ দেখুন
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              )}
              {path !== "/" && (
                <button
                  onClick={() => navigate(-1)}
                  className="btn btn-primary"
                >
                  ফিরুন
                </button>
              )}
            </div>
          )}
        </>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default UpcomingBatchesSection;
