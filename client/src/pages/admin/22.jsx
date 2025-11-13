import { Eye, Filter, Search } from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../../context/useAppContext";
import { parseSpecialToJSX } from "../../utils/parseSpecialToJSX";

export default function CourseClassesViewer() {
  const { courses } = useAppContext();

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [showAnswer, setShowAnswer] = useState(1);

  // কোর্স সিলেক্ট করা
  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setSelectedKey(null);
    setSelectedClass(null);
    setSearchTerm("");
  };

  // বিষয় সিলেক্ট করা
  const handleSelectKey = (key) => {
    setSelectedKey(key);
    setSelectedClass(null);
    setSearchTerm("");
  };

  // ক্লাস সিলেক্ট করা
  const handleSelectClass = (classItem) => {
    setSelectedClass(classItem);
    setSearchTerm("");
  };

  // কোর্সে কোন কী আছে তা চেক করা
  const getAvailableKeys = () => {
    if (!selectedCourse || selectedCourse.classes.length === 0) return [];

    const keys = new Set();
    selectedCourse.classes.forEach((classItem) => {
      if (classItem.topic?.length > 0) keys.add("topic");
      if (classItem.quesAns?.length > 0) keys.add("quesAns");
      if (classItem.homeWork?.length > 0) keys.add("homeWork");
      if (classItem.someWord?.length > 0) keys.add("someWord");
    });
    return Array.from(keys);
  };

  // সব ক্লাস বা নির্দিষ্ট ক্লাসের ডাটা পাওয়া
  const getAllOrFilteredData = () => {
    if (!selectedKey) return [];

    if (selectedClass) {
      // শুধু নির্বাচিত ক্লাসের ডাটা
      return selectedClass[selectedKey] || [];
    } else {
      // সব ক্লাসের ডাটা একসাথে
      const allData = [];
      selectedCourse.classes.forEach((classItem) => {
        const data = classItem[selectedKey] || [];
        allData.push(...data);
      });
      return allData;
    }
  };

  // সার্চ করা
  const classData = getAllOrFilteredData();
  const filteredData = classData.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    if (typeof item === "string") {
      return item.toLowerCase().includes(searchLower);
    }
    if (typeof item === "object") {
      return JSON.stringify(item).toLowerCase().includes(searchLower);
    }
    return true;
  });

  // সর্ট করা - শুধু টেক্সট ভিত্তিক
  const sortedData = [...filteredData].sort((a, b) => {
    let textA = "";
    let textB = "";

    if (typeof a === "string") {
      textA = a.toLowerCase();
    } else if (typeof a === "object") {
      textA =
        Object.values(a)
          .find((val) => typeof val === "string")
          ?.toLowerCase() || "";
    }

    if (typeof b === "string") {
      textB = b.toLowerCase();
    } else if (typeof b === "object") {
      textB =
        Object.values(b)
          .find((val) => typeof val === "string")
          ?.toLowerCase() || "";
    }

    if (sortOrder === "asc") {
      return textA.localeCompare(textB, "bn");
    } else {
      return textB.localeCompare(textA, "bn");
    }
  });

  const keyLabels = {
    topic: "টপিক সমূহ",
    quesAns: "প্রশ্ন ও উত্তর",
    homeWork: "বাড়ির কাজ",
    someWord: "গুরুত্বপূর্ণ শব্দ",
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-blue-400 mb-8 text-center">
          কোর্স কন্টেন্ট ভিউয়ার
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* কোর্স লিস্ট */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 h-max sticky top-4 lg:col-span-1">
            <h2 className="text-lg font-bold text-blue-400 mb-4">কোর্স সমূহ</h2>
            <div className="space-y-2">
              {courses.map((course) => (
                <button
                  key={course._id}
                  onClick={() => handleSelectCourse(course)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    selectedCourse?._id === course._id
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  <p className="font-semibold line-clamp-2 text-sm">
                    {course.title}
                  </p>
                  <p className="text-xs mt-1 opacity-75">
                    {course.classes.length} ক্লাস
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* মূল কন্টেন্ট */}
          <div className="lg:col-span-4 space-y-6">
            {selectedCourse ? (
              <>
                {/* কোর্স ইনফো */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">
                    {selectedCourse.title}
                  </h2>
                  <p className="text-blue-100 mb-3">
                    {selectedCourse.description}
                  </p>
                  <div className="flex flex-wrap gap-6 text-sm">
                    <span>⏱️ {selectedCourse.duration}</span>
                    <span>💰 ৳{selectedCourse.fee}</span>
                    <span>👨‍🏫 {selectedCourse.instructorName}</span>
                  </div>
                </div>

                {selectedCourse.classes.length === 0 ? (
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center text-slate-400">
                    এই কোর্সে কোন ক্লাস নেই
                  </div>
                ) : (
                  <>
                    {/* বিষয় সিলেকশন */}
                    <div>
                      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6">
                        <h3 className="text-lg font-bold text-blue-400 mb-4">
                          ক্লাস দ্বারা ফিল্টার করুন
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setSelectedClass(null)}
                            className={`px-4 py-2 rounded-lg transition-all font-semibold text-sm ${
                              !selectedClass
                                ? "bg-blue-600 text-white"
                                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                            }`}
                          >
                            সব ক্লাস
                          </button>
                          {selectedCourse.classes.map((classItem) => {
                            const hasData = classItem[selectedKey]?.length > 0;
                            return (
                              <button
                                key={classItem.id}
                                onClick={() => handleSelectClass(classItem)}
                                disabled={!hasData}
                                className={`px-4 py-2 rounded-lg transition-all font-semibold text-sm ${
                                  selectedClass?.id === classItem.id
                                    ? "bg-blue-600 text-white"
                                    : hasData
                                    ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                    : "bg-slate-700/50 text-slate-400 cursor-not-allowed"
                                }`}
                              >
                                ক্লাস {classItem.id}
                                {hasData && (
                                  <span className="ml-2 text-xs">
                                    ({classItem[selectedKey].length})
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-blue-400 mb-4">
                        বিষয় নির্বাচন করুন
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {getAvailableKeys().map((key) => (
                          <button
                            key={key}
                            onClick={() => handleSelectKey(key)}
                            className={`px-4 py-3 rounded-lg transition-all font-semibold text-sm ${
                              selectedKey === key
                                ? "bg-blue-600 text-white shadow-lg"
                                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                            }`}
                          >
                            {keyLabels[key]}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ডাটা ভিউয়ার */}
                    {selectedKey && (
                      <div className="md:col-span-3 bg-slate-800 border border-slate-700 rounded-lg p-6">
                        {/* সার্চ এবং সর্ট */}
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                          <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                            <input
                              type="text"
                              placeholder="খুঁজুন..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          {(selectedKey === "quesAns" ||
                            selectedKey === "homeWork") && (
                            <button
                              onClick={() =>
                                setShowAnswer((prev) => (prev === 1 ? 2 : 1))
                              }
                              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition whitespace-nowrap"
                            >
                              <Eye className="w-5 h-5" />
                              উত্তর দেখান
                            </button>
                          )}

                          <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition whitespace-nowrap"
                          >
                            <Filter className="w-5 h-5" />
                            সাজান
                          </button>
                        </div>

                        {/* সর্ট অপশন */}
                        {showFilters && (
                          <div className="mb-6 p-4 bg-slate-700/50 rounded-lg flex gap-2">
                            <button
                              onClick={() => setSortOrder("asc")}
                              className={`px-4 py-2 rounded-lg transition text-sm font-semibold ${
                                sortOrder === "asc"
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                              }`}
                            >
                              ক্রমবর্ধমান
                            </button>
                            <button
                              onClick={() => setSortOrder("desc")}
                              className={`px-4 py-2 rounded-lg transition text-sm font-semibold ${
                                sortOrder === "desc"
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                              }`}
                            >
                              ক্রমহ্রাসমান
                            </button>
                          </div>
                        )}

                        {/* সংখ্যা সারসংক্ষেপ */}
                        <div className="mb-4 p-3 bg-slate-700/50 rounded-lg">
                          <p className="text-slate-300">
                            <span className="font-semibold text-blue-400">
                              {sortedData.length}
                            </span>{" "}
                            টি {keyLabels[selectedKey].toLowerCase()}
                            {selectedClass && ` (ক্লাস ${selectedClass.id})`}
                          </p>
                        </div>

                        {/* ডাটা লিস্ট */}
                        <div>
                          {sortedData.length === 0 ? (
                            <p className="text-slate-400 text-center py-8">
                              কোন ডাটা পাওয়া যায়নি
                            </p>
                          ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                              {sortedData.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 hover:border-blue-500 transition"
                                >
                                  {typeof item === "string" ? (
                                    <p className="text-slate-200">
                                      <span className="text-blue-400 mr-2">
                                        ✓
                                      </span>
                                      {item}
                                    </p>
                                  ) : (
                                    <div className="space-y-2">
                                      {Object.entries(item)
                                        .slice(0, showAnswer)
                                        .map(([key, value]) => (
                                          <div key={key}>
                                            <p className="text-slate-400 text-xs font-semibold mb-1">
                                              {key}:
                                            </p>
                                            <p className="text-slate-200 ml-4 text-sm">
                                              {typeof value === "object"
                                                ? JSON.stringify(
                                                    parseSpecialToJSX(value)
                                                  )
                                                : parseSpecialToJSX(value)}
                                            </p>
                                          </div>
                                        ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center text-slate-400">
                একটি কোর্স নির্বাচন করুন শুরু করতে
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
