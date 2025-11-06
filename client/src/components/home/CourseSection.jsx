import { ArrowRight, CheckCircle, Eye, Timer } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const CourseSection = ({ courses = [] }) => {
  const navigate = useNavigate();

  // if (!courses || courses.length === 0) {
  //   return (
  //     <div id="courses" className="container mx-auto px-4 py-16 text-center">
  //       <p className="text-gray-400">কোর্স পাওয়া যাচ্ছে না</p>
  //     </div>
  //   );
  // }

  return (
    <section
      id="courses"
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 px-4 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 opacity-10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
            আমাদের কোর্সসমূহ
          </h2>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            মানসম্মত এবং আধুনিক কোর্স যা আপনার দক্ষতা বৃদ্ধি করবে
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {courses.map((course, index) => (
            <div
              key={course._id}
              className="group relative h-full"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              {/* Glowing Background */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>

              {/* Card */}
              <div className="relative bg-slate-800 bg-opacity-80 backdrop-blur-xl rounded-2xl border border-slate-700 overflow-hidden shadow-2xl group-hover:border-blue-500 transition-all duration-500 h-full flex flex-col hover:shadow-blue-500/50">
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden bg-slate-700">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x250?text=Course+Image";
                    }}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300"></div>

                  {/* Badge */}
                  {course.classes && (
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      {course.classes.length} ক্লাস
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Title */}
                  <h3 className="text-2xl font-black text-white mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors">
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-2 flex-grow">
                    {course.description}
                  </p>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-blue-600 to-purple-600 opacity-30 mb-4"></div>

                  {/* Course Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Timer className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-semibold">
                          {course.duration}
                        </span>
                      </div>
                      <div className="text-2xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        ৳{course.fee}
                      </div>
                    </div>

                    {course.classes && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm">
                          {course.classes.length} টি ক্লাস অন্তর্ভুক্ত
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-auto">
                    <button
                      onClick={() => navigate(`/course/${course._id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-blue-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 group/btn"
                    >
                      <Eye className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      বিস্তারিত
                    </button>
                    <Link
                      to="/login"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 group/btn shadow-lg hover:shadow-xl"
                    >
                      ভর্তি হন
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        {/* <div className="relative group mt-16">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-20 group-hover:opacity-30 rounded-3xl blur-2xl transition-opacity duration-500"></div>
          <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 backdrop-blur-xl rounded-3xl border border-slate-700 p-12 text-center">
            <h3 className="text-3xl font-black text-white mb-4">
              সব কোর্স এক নজরে দেখুন
            </h3>
            <p className="text-slate-300 text-lg mb-6 max-w-2xl mx-auto">
              আমাদের সম্পূর্ণ কোর্স ক্যাটালগ অন্বেষণ করুন এবং আপনার পছন্দের
              কোর্স খুঁজে নিন
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full hover:shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300">
              সব কোর্স দেখুন
            </button>
          </div>
        </div> */}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default CourseSection;
