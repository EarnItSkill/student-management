import { BookOpen, Clock, Play, Target, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import TakeQuizTest from "../components/quizzes/TakeQuizTest";
import { useAppContext } from "../context/useAppContext";

const TestQuiz = () => {
  const { quizzes } = useAppContext();
  const [selectedChapter, setSelectedChapter] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [iNumber, setINumber] = useState("");
  console.log(quizzes);

  // Group quizzes by chapter
  const chapterGroups = useMemo(() => {
    const groups = {};

    quizzes.forEach((quiz) => {
      const chapter = quiz.chapter || "Unknown";
      if (!groups[chapter]) {
        groups[chapter] = [];
      }
      groups[chapter].push(quiz);
    });

    return groups;
  }, [quizzes]);

  // Get available chapters
  const chapters = useMemo(() => {
    return Object.keys(chapterGroups).sort((a, b) => {
      // Sort chapters numerically if possible
      const numA = parseInt(a);
      const numB = parseInt(b);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.localeCompare(b);
    });
  }, [chapterGroups]);

  // Shuffle array function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Generate 50 random questions from selected chapter
  const generateRandomQuiz = (chapter) => {
    const chapterQuizzes = chapterGroups[chapter];

    // Collect all questions from this chapter
    const allQuestions = [];
    chapterQuizzes.forEach((quiz) => {
      quiz.questions.forEach((question) => {
        allQuestions.push({
          ...question,
          quizTitle: quiz.title,
          quizId: quiz._id,
        });
      });
    });

    // Shuffle and take 50 questions (or all if less than 50)
    const shuffledQuestions = shuffleArray(allQuestions);
    const selectedQuestions = shuffledQuestions.slice(
      0,
      Math.min(iNumber || 6, allQuestions.length)
    );

    // Create a new quiz object
    const randomQuiz = {
      _id: `random-${Date.now()}`,
      title: `অধ্যায় ${chapter} - র‍্যান্ডম কুইজ`,
      totalMarks: selectedQuestions.length,
      chapter: chapter,
      questions: selectedQuestions.map((q, index) => ({
        id: index + 1,
        question: q.question,
        options: q.options,
        correctAnswers: q.correctAnswers,
      })),
      isRandomQuiz: true,
    };

    return randomQuiz;
  };

  // Handle start quiz
  const handleStartQuiz = () => {
    if (!selectedChapter) {
      alert("অনুগ্রহ করে একটি অধ্যায় নির্বাচন করুন");
      return;
    }

    const quiz = generateRandomQuiz(selectedChapter);
    setGeneratedQuiz(quiz);
    setShowQuiz(true);
  };

  // Handle quiz complete
  const handleQuizComplete = () => {
    setShowQuiz(false);
    setGeneratedQuiz(null);
    setSelectedChapter("");
  };

  // Calculate chapter stats
  const getChapterStats = (chapter) => {
    const chapterQuizzes = chapterGroups[chapter];
    const totalQuestions = chapterQuizzes.reduce(
      (sum, quiz) => sum + quiz.questions.length,
      0
    );
    const totalQuizzes = chapterQuizzes.length;

    return { totalQuestions, totalQuizzes };
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          {/* <button
            onClick={() => navigate("/dashboard/student")}
            className="btn btn-ghost gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            ড্যাশবোর্ডে ফিরুন
          </button> */}
          <h1 className="text-3xl font-bold">র‍্যান্ডম MCQ অনুশীলন</h1>
        </div>

        {/* Info Card */}
        <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold">কুইজ নির্দেশনা</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                <Target className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-semibold">৫০টি প্রশ্ন</p>
                  <p className="text-sm text-gray-400">র‍্যান্ডম নির্বাচন</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-semibold">অধ্যায় ভিত্তিক</p>
                  <p className="text-sm text-gray-400">আপনার পছন্দ অনুযায়ী</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                <Clock className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-semibold">অসীম সময়</p>
                  <p className="text-sm text-gray-400">নিজের গতিতে শিখুন</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter Selection */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="text-xl font-bold mb-4">অধ্যায় নির্বাচন করুন</h3>

            {chapters.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">কোন কুইজ পাওয়া যায়নি</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chapters.map((chapter) => {
                  const stats = getChapterStats(chapter);
                  const isSelected = selectedChapter === chapter;

                  return (
                    <div
                      key={chapter}
                      onClick={() => setSelectedChapter(chapter)}
                      className={`card cursor-pointer transition-all hover:shadow-xl ${
                        isSelected
                          ? "bg-primary text-white ring-4 ring-primary ring-offset-2"
                          : "bg-base-200 hover:bg-base-300"
                      }`}
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-2xl font-bold">
                            অধ্যায় {chapter}
                          </h4>
                          {isSelected && (
                            <div className="badge badge-secondary">
                              নির্বাচিত
                            </div>
                          )}
                        </div>

                        <div className="divider my-2"></div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span
                              className={
                                isSelected ? "text-white/80" : "text-gray-400"
                              }
                            >
                              মোট প্রশ্ন:
                            </span>
                            <span className="font-bold">
                              {stats.totalQuestions}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span
                              className={
                                isSelected ? "text-white/80" : "text-gray-400"
                              }
                            >
                              মোট কুইজ:
                            </span>
                            <span className="font-bold">
                              {stats.totalQuizzes}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span
                              className={
                                isSelected ? "text-white/80" : "text-gray-400"
                              }
                            >
                              এলোমেলো প্রশ্ন:
                            </span>
                            <span className="font-bold">
                              {Math.min(50, stats.totalQuestions)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Start Button */}
        {selectedChapter && (
          <div className="flex justify-center items-center gap-4">
            <div>
              <input
                className="btn border border-gray-400"
                type="number"
                placeholder="সংখ্যা লিখুন ১ থেকে ১০"
                value={iNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  if (
                    value === "" ||
                    (Number(value) <= 10 && Number(value) >= 1)
                  ) {
                    setINumber(value);
                  }
                }}
              />
            </div>
            <button
              onClick={handleStartQuiz}
              className="btn btn-primary btn-lg gap-3 px-8"
            >
              <Play className="w-6 h-6" />
              কুইজ শুরু করুন
            </button>
          </div>
        )}
      </div>

      {/* Quiz Modal */}
      {showQuiz && generatedQuiz && (
        <TakeQuizTest
          quiz={generatedQuiz}
          onClose={() => setShowQuiz(false)}
          onSuccess={handleQuizComplete}
        />
      )}
    </div>
  );
};

export default TestQuiz;
