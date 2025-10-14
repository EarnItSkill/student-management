import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  GraduationCap,
  Headset,
  Mail,
  MapPinHouse,
  Target,
  Timer,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import Slider from "../components/common/Slider";
import { useAppContext } from "../context/useAppContext";

const Home = () => {
  const { courses, batches, enrollments } = useAppContext();
  const navigate = useNavigate();

  // Get upcoming batches (within next 30 days)
  const upcomingBatches = batches
    .filter((batch) => {
      const startDate = new Date(batch.startDate);
      const today = new Date();
      const daysUntilStart = Math.ceil(
        (startDate - today) / (1000 * 60 * 60 * 24)
      );
      return daysUntilStart >= 0 && daysUntilStart <= 30;
    })
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  // Calculate days until batch starts
  const getDaysUntilStart = (startDate) => {
    const start = new Date(startDate);
    const today = new Date();
    const diff = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
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
        return "সপ্তাহে ৬ দিন";

      case "THREE_DAYS_A":
        return "শনি, সোম, মঙ্গল";

      case "THREE_DAYS_B":
        return "রবি, মঙ্গল, বৃহস্পতি";

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <Slider />

      {/* Stats Section */}
      <div className="flex justify-center -mt-16 px-4">
        <div className="stats shadow-2xl bg-base-100 w-full max-w-5xl">
          <div className="stat place-items-center">
            <div className="stat-figure text-primary">
              <BookOpen className="w-10 h-10" />
            </div>
            <div className="stat-title">মোট কোর্স</div>
            <div className="stat-value text-primary">{courses.length}</div>
            <div className="stat-desc">বিভিন্ন ধরনের কোর্স</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-figure text-secondary">
              <GraduationCap className="w-10 h-10" />
            </div>
            <div className="stat-title">চলমান ব্যাচ</div>
            <div className="stat-value text-secondary">{batches.length}</div>
            <div className="stat-desc">এখনই ভর্তি চলছে</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-figure text-accent">
              <Users className="w-10 h-10" />
            </div>
            <div className="stat-title">সফল শিক্ষার্থী</div>
            <div className="stat-value text-accent">{enrollments.length}+</div>
            <div className="stat-desc">গর্বিত শিক্ষার্থী</div>
          </div>
        </div>
      </div>

      {/* Upcoming Batches Section */}
      {upcomingBatches.length > 0 && (
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">আসন্ন ব্যাচসমূহ</h2>
            <p className="text-gray-600">শীঘ্রই শুরু হতে যাচ্ছে যে ব্যাচগুলো</p>
          </div>

          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6" style={{ width: "max-content" }}>
              {upcomingBatches.map((batch) => {
                const course = courses.find((c) => c._id === batch.courseId);
                const daysUntil = getDaysUntilStart(batch.startDate);
                const enrolledCount = enrollments.filter(
                  (e) => e.batchId === batch._id
                ).length;

                const availableSeats =
                  batch.totalSeats + enrolledCount - enrolledCount;

                return (
                  <div
                    key={batch._id}
                    className="card mt-2.5 w-96 bg-gradient-to-br from-primary/10 to-primary/5 shadow-xl border-2 border-primary/20 hover:shadow-2xl transition-all"
                  >
                    <div className="card-body ">
                      {/* Countdown Badge */}
                      <div className="badge badge-error badge-lg gap-2 absolute -top-3 -right-3">
                        <Clock className="w-4 h-4" />
                        {daysUntil === 0 ? "আজ শুরু!" : `${daysUntil} দিন বাকি`}
                      </div>

                      <h3 className="card-title text-xl">{batch.batchName}</h3>
                      <p className="text-primary font-semibold">
                        {course?.title}
                      </p>

                      <div className="divider my-2"></div>

                      {/* Batch Details */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-primary" />
                          <div>
                            <div className="text-sm text-gray-600">
                              শুরু হবে
                            </div>
                            <div className="font-semibold">
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

                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-primary" />
                          <div>
                            <div className="text-sm text-gray-600">সময়</div>
                            <div className="font-semibold">
                              {formatTime(batch.startTime)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-primary" />
                          <div>
                            <div className="text-sm text-gray-600">
                              ক্লাসের দিন
                            </div>
                            <div className="font-semibold">
                              {classDay(batch.scheduleType)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary" />
                          <div className="flex-1">
                            <div className="text-sm text-gray-600">
                              আসন সংখ্যা
                            </div>
                            <div className="font-semibold">
                              {enrolledCount}/{batch.totalSeats + enrolledCount}{" "}
                              (
                              <span className="text-success">
                                {availableSeats === 0
                                  ? " খালি নাই"
                                  : availableSeats + " খালি"}
                              </span>
                              )
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <progress
                          className="progress progress-primary"
                          value={enrolledCount}
                          max={batch.totalSeats}
                        ></progress>

                        {/* Gender Badge */}
                        <div className="badge badge-secondary">
                          {/* {batch.batchName.includes("ছেলে")
                            ? "👦 ছেলে"
                            : "👧 মেয়ে"} */}
                          {batch?.gender}
                        </div>
                      </div>

                      <div className="card-actions justify-end mt-4">
                        <Link
                          to="/login"
                          disabled={availableSeats === 0}
                          className="btn btn-primary btn-block"
                        >
                          {availableSeats === 0 ? "আসন পূর্ণ" : "এখনই ভর্তি হন"}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Quiz Features Section */}
      <div className="bg-gradient-to-br from-secondary/10 to-accent/10 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">MCQ কুইজ সুবিধা</h2>
            <p className="text-gray-600">
              নিয়মিত কুইজের মাধ্যমে নিজের দক্ষতা যাচাই করুন
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
              <div className="card-body items-center text-center">
                <Award className="w-16 h-16 text-primary mb-4" />
                <h3 className="card-title">নিয়মিত কুইজ</h3>
                <p className="text-sm">
                  প্রতিটি ক্লাসের পর MCQ কুইজ দিয়ে নিজের শেখা যাচাই করুন
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
              <div className="card-body items-center text-center">
                <Trophy className="w-16 h-16 text-warning mb-4" />
                <h3 className="card-title">র‍্যাংকিং সিস্টেম</h3>
                <p className="text-sm">
                  ব্যাচে নিজের অবস্থান জানুন এবং প্রথম হওয়ার জন্য প্রতিযোগিতা
                  করুন
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
              <div className="card-body items-center text-center">
                <Target className="w-16 h-16 text-success mb-4" />
                <h3 className="card-title">তাৎক্ষণিক ফলাফল</h3>
                <p className="text-sm">
                  কুইজ শেষ হওয়ার সাথে সাথেই ফলাফল এবং সঠিক উত্তর দেখুন
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
              <div className="card-body items-center text-center">
                <TrendingUp className="w-16 h-16 text-info mb-4" />
                <h3 className="card-title">পারফরম্যান্স ট্র্যাকিং</h3>
                <p className="text-sm">
                  সময়ের সাথে আপনার উন্নতি দেখুন এবং দুর্বল জায়গা চিহ্নিত করুন
                </p>
              </div>
            </div>
          </div>

          {/* Ranking Example */}
          <div className="card bg-base-100 shadow-2xl mt-12 max-w-4xl mx-auto">
            <div className="card-body">
              <h3 className="card-title text-2xl mb-6 justify-center">
                <Trophy className="w-8 h-8 text-warning" />
                র‍্যাংকিং কিভাবে কাজ করে
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                  <div className="text-4xl">🥇</div>
                  <div className="flex-1">
                    <div className="font-bold">১ম স্থান - গোল্ড মেডেল</div>
                    <div className="text-sm text-gray-600">
                      সবচেয়ে বেশি স্কোর অর্জনকারী
                    </div>
                  </div>
                  <div className="badge badge-warning badge-lg">90%+</div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                  <div className="text-4xl">🥈</div>
                  <div className="flex-1">
                    <div className="font-bold">২য় স্থান - সিলভার মেডেল</div>
                    <div className="text-sm text-gray-600">
                      দ্বিতীয় সর্বোচ্চ স্কোর
                    </div>
                  </div>
                  <div className="badge badge-lg">80%+</div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                  <div className="text-4xl">🥉</div>
                  <div className="flex-1">
                    <div className="font-bold">৩য় স্থান - ব্রোঞ্জ মেডেল</div>
                    <div className="text-sm text-gray-600">
                      তৃতীয় সর্বোচ্চ স্কোর
                    </div>
                  </div>
                  <div className="badge badge-accent badge-lg">70%+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div id="courses" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">আমাদের কোর্সসমূহ</h2>
          <p className="text-gray-600">মানসম্মত এবং আধুনিক কোর্স</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2"
            >
              <figure className="h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{course.title}</h2>
                <p className="text-sm text-gray-600">{course.description}</p>

                <div className="divider my-2"></div>

                <div className="flex justify-between items-center">
                  <div className="badge badge-primary gap-1">
                    <Timer className="w-4 h-4" />
                    {course.duration}
                  </div>
                  <div className="badge badge-secondary text-lg font-bold">
                    ৳{course.fee}
                  </div>
                </div>

                {course.classes && (
                  <div className="text-xs text-gray-500 mt-2">
                    <CheckCircle className="w-3 h-3 inline mr-1" />
                    {course.classes.length} টি ক্লাস
                  </div>
                )}

                <div className="card-actions justify-between mt-4">
                  <button
                    onClick={() => navigate(`/course/${course._id}`)}
                    className="btn btn-success btn-sm gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    বিস্তারিত
                  </button>
                  <Link to="/login" className="btn btn-primary btn-sm">
                    ভর্তি হন
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructor Section */}
      <div className="bg-base-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">আমাদের ইন্সট্রাক্টর</h2>
            <p className="text-gray-600">অভিজ্ঞ এবং দক্ষ প্রশিক্ষক</p>
          </div>

          <div className="card lg:card-side bg-gradient-to-br from-primary/10 to-secondary/10 shadow-2xl max-w-4xl mx-auto">
            <figure className="lg:w-1/3">
              <img
                src="https://avatars.githubusercontent.com/u/31990245?v=4"
                alt="Instructor"
                className="w-full h-full object-cover"
              />
            </figure>
            <div className="card-body lg:w-2/3">
              <h2 className="card-title text-3xl">মো. মোজাম্মেল হক</h2>
              <p className="text-xl text-primary font-semibold">
                প্রধান ইন্সট্রাক্টর
              </p>

              <div className="divider"></div>

              <div className="space-y-4">
                <p className="text-gray-700">
                  ১০+ বছরের অভিজ্ঞতা সম্পন্ন কম্পিউটার প্রশিক্ষক। শত শত
                  শিক্ষার্থীকে সফলভাবে প্রশিক্ষণ দিয়েছেন এবং তাদের ক্যারিয়ার
                  গঠনে সহায়তা করেছেন।
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="stat bg-base-100 rounded-lg shadow">
                    <div className="stat-value text-primary">10+</div>
                    <div className="stat-title">বছরের অভিজ্ঞতা</div>
                  </div>
                  <div className="stat bg-base-100 rounded-lg shadow">
                    <div className="stat-value text-success">500+</div>
                    <div className="stat-title">সফল শিক্ষার্থী</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="badge badge-primary">ICT Expert</div>
                  <div className="badge badge-secondary">MS Office</div>
                  <div className="badge badge-accent">Graphic Design</div>
                  <div className="badge badge-info">Web Development</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-r from-primary to-secondary py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12">যোগাযোগ করুন</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="card bg-white/10 backdrop-blur">
              <div className="card-body items-center">
                <MapPinHouse className="w-12 h-12 mb-3" />
                <h3 className="font-bold text-xl mb-2">ঠিকানা</h3>
                <p>হরিশ্চর, লালমাই, কুমিল্লা।</p>
              </div>
            </div>
            <div className="card bg-white/10 backdrop-blur">
              <div className="card-body items-center">
                <Mail className="w-12 h-12 mb-3" />
                <h3 className="font-bold text-xl mb-2">ইমেইল</h3>
                <p>mrmozammal@gmail.com</p>
              </div>
            </div>
            <div className="card bg-white/10 backdrop-blur">
              <div className="card-body items-center">
                <Headset className="w-12 h-12 mb-3" />
                <h3 className="font-bold text-xl mb-2">ফোন</h3>
                <p>+880 1914708856</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
