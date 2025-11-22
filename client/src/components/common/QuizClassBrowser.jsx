import { BookOpen, ChevronDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useAppContext } from "../../context/useAppContext";

const QuizClassBrowser = () => {
  const { quizzes } = useAppContext();

  const [searchText, setSearchText] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [expandedQuestions, setExpandedQuestions] = useState({});

  // সব unique chapters বের করা
  const chapters = useMemo(() => {
    return [...new Set(quizzes.map((item) => item.chapter))].sort();
  }, [quizzes]);

  // বাংলা সংখ্যা থেকে ইংরেজী সংখ্যায় রূপান্তর
  const convertToEnglish = (str) => {
    const banglaToEnglish = {
      "০": "0",
      "১": "1",
      "২": "2",
      "৩": "3",
      "৪": "4",
      "৫": "5",
      "৬": "6",
      "৭": "7",
      "৮": "8",
      "৯": "9",
    };
    return str.replace(/[০-৯]/g, (match) => banglaToEnglish[match] || match);
  };

  // সার্চ ফিল্টার প্রয়োগ করা - প্রশ্নের ভিত্তিতে
  const filteredClasses = useMemo(() => {
    if (!searchText) return quizzes;

    const normalizedSearch = convertToEnglish(searchText.toLowerCase());

    return quizzes
      .map((cls) => ({
        ...cls,
        questions: cls.questions.filter((q) => {
          const normalizedQuestion = convertToEnglish(q.question.toLowerCase());
          return normalizedQuestion.includes(normalizedSearch);
        }),
      }))
      .filter((cls) => cls.questions.length > 0);
  }, [searchText]);

  // বর্তমান ক্লাস খুঁজে বের করা
  const currentClass = selectedClass
    ? filteredClasses.find((c) => c._id === selectedClass)
    : null;

  const toggleChapter = (chapter) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapter]: !prev[chapter],
    }));
  };

  const toggleQuestion = (questionId) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* হেডার */}
      <div className="bg-gray-900 border-b border-gray-800 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <BookOpen size={32} className="text-cyan-400" />
            পরীক্ষার প্রশ্ন ব্যবস্থাপনা
          </h1>
          <p className="text-gray-400">
            চ্যাপ্টার এবং ক্লাস অনুযায়ী MCQ প্রশ্ন দেখুন
          </p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* বাম সাইডবার - ক্লাস লিস্ট */}
        <div className="w-80 bg-gray-900 border-r border-gray-800 overflow-y-auto">
          {/* সার্চ বার */}
          {/* <div className="p-4 border-b border-gray-800 sticky top-0 bg-gray-900">
            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-gray-500"
                size={20}
              />
              <input
                type="text"
                placeholder="প্রশ্ন খুঁজুন..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition text-sm"
              />
            </div>
          </div> */}

          {/* চ্যাপ্টার এবং ক্লাস - কোলাপ্স আকারে */}
          <div className="p-4">
            {chapters.map((chapter) => {
              const classesInChapter = filteredClasses.filter(
                (cls) => cls.chapter === chapter
              );
              return (
                <div key={chapter} className="mb-2">
                  <button
                    onClick={() => toggleChapter(chapter)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-800 transition text-cyan-400 font-semibold mb-2"
                  >
                    <span>অধ্যায় {chapter}</span>
                    <ChevronDown
                      size={18}
                      className={`transition ${
                        expandedChapters[chapter] ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandedChapters[chapter] && (
                    <div className="space-y-2 ml-2">
                      {classesInChapter.map((cls) => (
                        <button
                          key={cls._id}
                          onClick={() => setSelectedClass(cls._id)}
                          className={`w-full text-left px-4 py-3 rounded-lg transition border ${
                            selectedClass === cls._id
                              ? "bg-cyan-600 border-cyan-500 text-white"
                              : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                          }`}
                        >
                          <p className="font-medium text-sm">{cls.title}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {cls.questions.length} প্রশ্ন • {cls.totalMarks}{" "}
                            মার্ক
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredClasses.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">কোনো ফলাফল পাওয়া যায়নি।</p>
              </div>
            )}
          </div>
        </div>

        {/* ডান কন্টেন্ট এরিয়া */}
        <div className="flex-1 overflow-y-auto">
          {currentClass ? (
            <div className="p-6">
              <div className="max-w-4xl mx-auto">
                <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800 mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {currentClass.title}
                  </h2>
                  <div className="flex gap-6 text-gray-400">
                    <span>
                      মোট মার্ক:{" "}
                      <span className="text-cyan-400">
                        {currentClass.totalMarks}
                      </span>
                    </span>
                    <span>
                      প্রশ্ন সংখ্যা:{" "}
                      <span className="text-cyan-400">
                        {currentClass.questions.length}
                      </span>
                    </span>
                  </div>
                </div>

                {/* প্রশ্নগুলি */}
                <div className="space-y-4">
                  {currentClass.questions.map((q, idx) => (
                    <div
                      key={`${currentClass._id}-${q.id}`}
                      className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800"
                    >
                      <button
                        onClick={() =>
                          toggleQuestion(`${currentClass._id}-${q.id}`)
                        }
                        className="w-full p-4 hover:bg-gray-700 flex items-start justify-between transition"
                      >
                        <div className="flex items-start gap-3 text-left">
                          <span className="flex-shrink-0 w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {idx + 1}
                          </span>
                          <p className="text-gray-100 font-medium">
                            {q.question}
                          </p>
                        </div>
                        <ChevronDown
                          size={20}
                          className={`text-gray-400 transition flex-shrink-0 ${
                            expandedQuestions[`${currentClass._id}-${q.id}`]
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </button>

                      {expandedQuestions[`${currentClass._id}-${q.id}`] && (
                        <div className="p-4 bg-gray-900 border-t border-gray-700">
                          <p className="text-sm font-semibold text-gray-300 mb-3">
                            অপশন:
                          </p>
                          <div className="space-y-2">
                            {q.options.map((option, optIdx) => (
                              <div
                                key={optIdx}
                                className={`p-3 rounded-lg transition ${
                                  q.correctAnswers.includes(optIdx)
                                    ? "bg-emerald-900 border border-emerald-600 text-emerald-100"
                                    : "bg-gray-800 border border-gray-700 text-gray-300"
                                }`}
                              >
                                <p>
                                  <span className="font-semibold">
                                    {String.fromCharCode(97 + optIdx)}.
                                  </span>{" "}
                                  {option}
                                  {q.correctAnswers.includes(optIdx) && (
                                    <span className="ml-2 text-emerald-400 font-semibold">
                                      ✓ সঠিক
                                    </span>
                                  )}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-6 gap-4">
                  <h2 className="text-2xl font-bold text-white">
                    সব ম্যাচিং প্রশ্ন
                  </h2>
                  <div className="sticky top-0">
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-2 text-gray-500"
                        size={20}
                      />
                      <input
                        type="text"
                        placeholder="প্রশ্ন খুঁজুন..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition text-sm"
                      />
                    </div>
                  </div>
                </div>
                {filteredClasses.length > 0 ? (
                  <>
                    <div className="space-y-6">
                      {filteredClasses.map((cls) => (
                        <div key={cls._id}>
                          <div className="bg-gray-900 rounded-lg shadow-lg p-4 border border-gray-800 mb-4">
                            <h3 className="text-lg font-semibold text-cyan-400">
                              {cls.title}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">
                              {cls.questions.length} প্রশ্ন • {cls.totalMarks}{" "}
                              মার্ক
                            </p>
                          </div>

                          <div className="space-y-4">
                            {cls.questions.map((q, idx) => (
                              <div
                                key={`${cls._id}-${q.id}`}
                                className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800"
                              >
                                <button
                                  onClick={() =>
                                    toggleQuestion(`${cls._id}-${q.id}`)
                                  }
                                  className="w-full p-4 hover:bg-gray-700 flex items-start justify-between transition"
                                >
                                  <div className="flex items-start gap-3 text-left">
                                    <span className="flex-shrink-0 w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                      {idx + 1}
                                    </span>
                                    <p className="text-gray-100 font-medium">
                                      {q.question}
                                    </p>
                                  </div>
                                  <ChevronDown
                                    size={20}
                                    className={`text-gray-400 transition flex-shrink-0 ${
                                      expandedQuestions[`${cls._id}-${q.id}`]
                                        ? "rotate-180"
                                        : ""
                                    }`}
                                  />
                                </button>

                                {expandedQuestions[`${cls._id}-${q.id}`] && (
                                  <div className="p-4 bg-gray-900 border-t border-gray-700">
                                    <p className="text-sm font-semibold text-gray-300 mb-3">
                                      অপশন:
                                    </p>
                                    <div className="space-y-2">
                                      {q.options.map((option, optIdx) => (
                                        <div
                                          key={optIdx}
                                          className={`p-3 rounded-lg transition ${
                                            q.correctAnswers.includes(optIdx)
                                              ? "bg-emerald-900 border border-emerald-600 text-emerald-100"
                                              : "bg-gray-800 border border-gray-700 text-gray-300"
                                          }`}
                                        >
                                          <p>
                                            <span className="font-semibold">
                                              {String.fromCharCode(97 + optIdx)}
                                              .
                                            </span>{" "}
                                            {option}
                                            {q.correctAnswers.includes(
                                              optIdx
                                            ) && (
                                              <span className="ml-2 text-emerald-400 font-semibold">
                                                ✓ সঠিক
                                              </span>
                                            )}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <p className="text-gray-400 text-lg">
                        কোনো ক্লাস নির্বাচন করুন অথবা প্রশ্ন খুঁজুন
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizClassBrowser;
