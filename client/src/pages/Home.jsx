import { BookOpen, GraduationCap, Users } from "lucide-react";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import BatchScheduleSection from "../components/home/BatchScheduleSection";
import Contact from "../components/home/Contact";
import CourseProcessSection from "../components/home/CourseProcessSection";
import CourseSection from "../components/home/CourseSection";
import Instructor from "../components/home/Instructor";
import Quiz from "../components/home/Quiz";
import Slider from "../components/home/Slider";
import UpcomingBatchesSection from "../components/home/UpcomingBatchesSection";
import { useAppContext } from "../context/useAppContext";

const Home = () => {
  const { courses, batches, enrollments } = useAppContext();

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <Navbar />

      {/* Heoro Slider */}
      <Slider />

      {/* Stats Section */}
      <div className="absolute left-0 right-0 z-20">
        <div className="flex justify-center -mt-16 px-4">
          <div className="w-full max-w-5xl rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stat Card 1 */}
              <div className="relative group h-40">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 opacity-20 group-hover:opacity-40 rounded-2xl blur-xl transition-opacity duration-700"></div>
                <div className="relative bg-slate-800 bg-opacity-80 backdrop-blur-xl rounded-2xl border border-slate-700 p-2 text-center group-hover:border-blue-500 transition-all duration-700 transform hover:scale-105 h-32 flex gap-4 items-center justify-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 group-hover:scale-110 transition-transform duration-700">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-300 mb-1">
                      মোট কোর্স
                    </div>
                    <div className="text-4xl font-black text-white">
                      {courses.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stat Card 2 */}
              <div className="relative group h-40">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 opacity-20 group-hover:opacity-40 rounded-2xl blur-xl transition-opacity duration-700"></div>
                <div className="relative bg-slate-800 bg-opacity-80 backdrop-blur-xl rounded-2xl border border-slate-700 p-2 text-center group-hover:border-purple-500 transition-all duration-700 transform hover:scale-105 h-32 flex gap-4 items-center justify-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 group-hover:scale-110 transition-transform duration-700">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-300 mb-1">
                      চলমান ব্যাচ
                    </div>
                    <div className="text-4xl font-black text-white">
                      {batches.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stat Card 3 */}
              <div className="relative group h-40">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-600 opacity-20 group-hover:opacity-40 rounded-2xl blur-xl transition-opacity duration-700"></div>
                <div className="relative bg-slate-800 bg-opacity-80 backdrop-blur-xl rounded-2xl border border-slate-700 p-2 text-center group-hover:border-green-500 transition-all duration-700 transform hover:scale-105 h-32 flex gap-4 items-center justify-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 group-hover:scale-110 transition-transform duration-700">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-300 mb-1">
                      সফল শিক্ষার্থী
                    </div>
                    <div className="text-4xl font-black text-white">
                      {enrollments.length}+
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <CourseSection courses={courses} />

      {/* ============ dont Delete Batch Schedule */}
      <div id="batch-schedule">
        <BatchScheduleSection />
      </div>

      {/* Upcoming Batches Section */}
      <UpcomingBatchesSection limit={3} />

      {/* Quiz Features Section */}
      <Quiz />

      {/* Course process */}
      <CourseProcessSection />

      {/* Instructor Section */}
      <Instructor />

      {/* Contact Section */}
      <Contact />

      <Footer />
    </div>
  );
};

export default Home;
