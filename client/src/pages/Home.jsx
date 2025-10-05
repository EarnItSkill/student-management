import { Headset, Mail, MapPinHouse, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import { useAppContext } from "../context/useAppContext";

const Home = () => {
  const { courses, batches } = useAppContext();

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}

      <Navbar />

      {/* Hero Section */}
      <div className="hero min-h-[60vh] bg-gradient-to-r from-primary to-secondary">
        <div className="hero-content text-center text-white">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-4">স্বাগতম!</h1>
            <p className="text-xl mb-6">
              আমাদের কম্পিউটার ট্রেনিং সেন্টারে আপনাকে স্বাগতম। মানসম্মত শিক্ষা
              এবং প্রশিক্ষণের মাধ্যমে আপনার ক্যারিয়ার গড়ুন।
            </p>
            <div className="space-x-4">
              <Link to="/login" className="btn btn-accent btn-lg">
                এখনই শুরু করুন
              </Link>
              <a href="#courses" className="btn btn-outline btn-lg text-white">
                কোর্স দেখুন
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex justify-center">
        <div className="stats shadow w-full bg-base-100 -mt-16 mx-auto max-w-4xl">
          <div className="stat place-items-center">
            <div className="stat-title">মোট কোর্স</div>
            <div className="stat-value text-primary">{courses.length}</div>
            <div className="stat-desc">বিভিন্ন ধরনের কোর্স</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">চলমান ব্যাচ</div>
            <div className="stat-value text-secondary">{batches.length}</div>
            <div className="stat-desc">এখনই ভর্তি চলছে</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">সফল শিক্ষার্থী</div>
            <div className="stat-value text-accent">500+</div>
            <div className="stat-desc">গর্বিত শিক্ষার্থী</div>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div id="courses" className="container mx-auto px-16 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">
          আমাদের কোর্সসমূহ
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all"
            >
              <figure>
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{course.title}</h2>
                <p className="text-sm">{course.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <div className="badge badge-primary">
                    <Timer className="w-4 h-4" /> {course.duration}
                  </div>
                  <div className="badge badge-secondary"> ৳ {course.fee}</div>
                </div>
                <div className="card-actions justify-end mt-4">
                  <Link to="/login" className="btn btn-primary btn-sm">
                    ভর্তি হন
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Batches Section */}
      <div className="bg-base-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            চলমান ব্যাচসমূহ 🎓
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.map((batch) => {
              const course = courses.find((c) => c.id === batch.courseId);
              return (
                <div key={batch.id} className="card bg-base-200 shadow-lg">
                  <div className="card-body">
                    <h3 className="card-title text-lg">{batch.batchName}</h3>
                    <p className="text-sm text-gray-600">{course?.title}</p>
                    <div className="divider my-2"></div>
                    <div className="space-y-2 text-sm">
                      <p>📅 শুরু: {batch.startDate}</p>
                      <p>🕒 সময়: {batch.schedule}</p>
                      <p>
                        👥 সিট: {batch.enrolledStudents}/{batch.totalSeats}
                      </p>
                    </div>
                    <progress
                      className="progress progress-primary mt-3"
                      value={batch.enrolledStudents}
                      max={batch.totalSeats}
                    ></progress>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-r from-primary to-secondary py-32 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12 ">যোগাযোগ করুন</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center flex-col justify-center">
              <MapPinHouse className="mb-3 w-10 h-10" />
              <h3 className="font-bold mb-2">ঠিকানা</h3>
              <p>হরিশ্চর, লালমাই, কুমিল্লা।</p>
            </div>
            <div className="flex items-center flex-col justify-center">
              <Mail className="mb-3 w-10 h-10" />
              <h3 className="font-bold mb-2">ইমেইল</h3>
              <p>mrmozammal@gmail.com</p>
            </div>
            <div className="flex items-center flex-col justify-center">
              <Headset className="mb-3 w-10 h-10" />
              <h3 className="font-bold mb-2">ফোন</h3>
              <p>+880 1914708856</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
