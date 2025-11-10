import { BookOpen, Clock, DollarSign, Users, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function BatchScheduleSection() {
  const [courses, setCourses] = useState([]);
  const [displayedCourses, setDisplayedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (showAll) {
      setDisplayedCourses(courses);
    } else {
      setDisplayedCourses(courses.slice(0, 3));
    }
  }, [courses, showAll]);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/make-courses`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setCourses(data.data || []);
    } catch (error) {
      console.error("কোর্স ফেচ করতে ত্রুটি:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* শিরোনাম */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-400 mb-4">
            আমাদের ব্যাচ সমূহ
          </h1>
          <p className="text-slate-400 text-lg">
            আপনার পছমন্দের ব্যাচ সম্পর্কে বিস্তারিত জেনে নিন
          </p>
        </div>

        {/* কার্ড গ্রিড */}
        {isLoading ? (
          <div className="text-center text-slate-400 py-12">লোড হচ্ছে...</div>
        ) : displayedCourses.length === 0 ? (
          <div className="text-center text-slate-400 py-12">
            কোন কোর্স পাওয়া যায়নি
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {displayedCourses.map((course) => (
              <div
                key={course._id}
                onClick={() => handleCardClick(course)}
                className="group bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl hover:border-blue-500 transition-all duration-300 cursor-pointer transform hover:scale-105"
              >
                {/* কার্ড হেডার */}
                <div className="h-40 bg-gradient-to-r from-blue-600 to-cyan-600 p-6 flex flex-col justify-end relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-8 -mt-8"></div>
                  </div>
                  <h3 className="text-xl font-bold text-white relative z-10 line-clamp-2">
                    {course.courseName}
                  </h3>
                </div>

                {/* কার্ড বডি */}
                <div className="p-6 space-y-4">
                  {/* শিক্ষক */}
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <p className="text-sm text-slate-300">
                      <span className="font-semibold">শিক্ষক:</span>{" "}
                      {course.instructor}
                    </p>
                  </div>

                  {/* ফি */}
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <p className="text-sm text-slate-300">
                      <span className="font-semibold">ফি:</span> ৳
                      {course.courseFee}
                    </p>
                  </div>

                  {/* টাইম */}
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <p className="text-sm text-slate-300">
                      <span className="font-semibold">সময়:</span>{" "}
                      {course.startTime} - {course.endTime}
                    </p>
                  </div>

                  {/* Type */}
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <p className="text-sm text-slate-300">
                      <span className="font-semibold">প্রকার:</span>{" "}
                      <span className="capitalize bg-slate-600 px-2 py-1 rounded text-xs">
                        {course.type}
                      </span>
                    </p>
                  </div>

                  {/* বর্ণনা (সংক্ষিপ্ত) */}
                  <p className="text-sm text-slate-400 line-clamp-2">
                    {course.description}
                  </p>
                </div>

                {/* ফুটার - বিস্তারিত দেখুন */}
                <div className="px-6 py-4 bg-slate-700/50 border-t border-slate-600 group-hover:bg-blue-600/20 transition-colors">
                  <button className="w-full text-blue-400 group-hover:text-blue-300 font-semibold text-sm transition-colors">
                    বিস্তারিত দেখুন →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View More বাটন */}
        {!showAll && courses.length > 3 && (
          <div className="flex justify-center">
            <button
              onClick={() => setShowAll(true)}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              আরও দেখুন ({courses.length - 3} আরও কোর্স)
            </button>
          </div>
        )}

        {showAll && courses.length > 3 && (
          <div className="flex justify-center">
            <button
              onClick={() => setShowAll(false)}
              className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
            >
              কম দেখুন
            </button>
          </div>
        )}
      </div>

      {/* মডাল */}
      {showModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* মডাল হেডার */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 flex justify-between items-start sticky top-0 z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {selectedCourse.courseName}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* মডাল বডি */}
            <div className="p-6 md:p-8 space-y-6">
              {/* শিরোনাম */}
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">
                  শিরোনাম
                </h3>
                <p className="text-slate-300">{selectedCourse.title}</p>
              </div>

              {/* বর্ণনা */}
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">
                  বর্ণনা
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {selectedCourse.description}
                </p>
              </div>

              {/* গ্রিড তথ্য */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* কোর্স ফি */}
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <p className="text-slate-400 text-sm mb-1">কোর্স ফি</p>
                  <p className="text-2xl font-bold text-green-400">
                    ৳{selectedCourse.courseFee}
                  </p>
                </div>

                {/* শিক্ষক */}
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <p className="text-slate-400 text-sm mb-1">শিক্ষক</p>
                  <p className="text-lg font-semibold text-slate-200">
                    {selectedCourse.instructor}
                  </p>
                </div>

                {/* প্রকার */}
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <p className="text-slate-400 text-sm mb-1">প্রকার</p>
                  <p className="text-lg font-semibold capitalize text-slate-200">
                    {selectedCourse.type}
                  </p>
                </div>

                {/* লিঙ্গ */}
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <p className="text-slate-400 text-sm mb-1">জন্য</p>
                  <p className="text-lg font-semibold capitalize text-slate-200">
                    {selectedCourse.gender === "all"
                      ? "সকলের জন্য"
                      : selectedCourse.gender === "male"
                      ? "পুরুষ"
                      : "মহিলা"}
                  </p>
                </div>

                {/* শুরু সময় */}
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <p className="text-slate-400 text-sm mb-1">শুরু সময়</p>
                  <p className="text-lg font-semibold text-slate-200">
                    {selectedCourse.startTime}
                  </p>
                </div>

                {/* শেষ সময় */}
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <p className="text-slate-400 text-sm mb-1">শেষ সময়</p>
                  <p className="text-lg font-semibold text-slate-200">
                    {selectedCourse.endTime}
                  </p>
                </div>

                {/* মোট সময় */}
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <p className="text-slate-400 text-sm mb-1">মোট সময়</p>
                  <p className="text-lg font-semibold text-slate-200">
                    {selectedCourse.totalTime}
                  </p>
                </div>

                {/* মোট MCQ */}
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <p className="text-slate-400 text-sm mb-1">মোট MCQ</p>
                  <p className="text-lg font-semibold text-slate-200">
                    {selectedCourse.totalMcq}
                  </p>
                </div>

                {/* মোট CQ */}
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <p className="text-slate-400 text-sm mb-1">মোট CQ</p>
                  <p className="text-lg font-semibold text-slate-200">
                    {selectedCourse.totalCq}
                  </p>
                </div>
              </div>

              {/* Features */}
              {selectedCourse.features &&
                selectedCourse.features.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">
                      বৈশিষ্ট্য
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedCourse.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-slate-700/50 p-3 rounded-lg"
                        >
                          <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                          <span className="text-slate-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* মডাল ফুটার */}
            <div className="border-t border-slate-700 p-6 bg-slate-700/50">
              <button
                onClick={closeModal}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
