import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  Play,
  Target,
  Trophy,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TakeQuizWithTimer from "../components/quizzes/TakeQuizWithTimer";
import { useAppContext } from "../context/useAppContext";

const StudentQuizPage = () => {
  const navigate = useNavigate();
  const {
    quizzes,
    currentUser,
    enrollments,
    checkQuizAttempt,
    submitQuizAttempt,
  } = useAppContext();

  const [selectedChapter, setSelectedChapter] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [chapterAttempts, setChapterAttempts] = useState({});
  const [loading, setLoading] = useState(true);

  // Get current student's enrollment
  const studentEnrollment = useMemo(() => {
    return enrollments.find((e) => e.studentId === currentUser?._id);
  }, [enrollments, currentUser]);

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
      const numA = parseInt(a);
      const numB = parseInt(b);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.localeCompare(b);
    });
  }, [chapterGroups]);

  // Check attempts for all chapters
  useEffect(() => {
    const checkAllAttempts = async () => {
      if (!currentUser || !studentEnrollment) {
        setLoading(false);
        return;
      }

      const attempts = {};

      for (const chapter of chapters) {
        const result = await checkQuizAttempt(
          currentUser._id,
          studentEnrollment.batchId,
          chapter
        );
        attempts[chapter] = result;
      }

      setChapterAttempts(attempts);
      setLoading(false);
    };

    checkAllAttempts();
  }, [chapters, currentUser, studentEnrollment, checkQuizAttempt]);

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
      Math.min(50, allQuestions.length)
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
      timeLimit: 50, // 50 minutes
    };

    return randomQuiz;
  };

  // Handle start quiz
  const handleStartQuiz = () => {
    if (!selectedChapter) {
      alert("অনুগ্রহ করে একটি অধ্যায় নির্বাচন করুন");
      return;
    }

    if (!studentEnrollment) {
      alert("আপনি কোন ব্যাচে ভর্তি নন");
      return;
    }

    // Check if already attempted
    if (chapterAttempts[selectedChapter]?.hasAttempted) {
      alert("আপনি ইতিমধ্যে এই অধ্যায়ের কুইজ সম্পন্ন করেছেন");
      return;
    }

    const quiz = generateRandomQuiz(selectedChapter);
    setGeneratedQuiz(quiz);
    setShowQuiz(true);
  };

  // Handle quiz submit
  const handleQuizSubmit = async (quizData) => {
    try {
      const { score, answers, questions, timeTaken } = quizData;

      // Calculate correct and wrong answers
      const correctAnswers = questions.filter((q, index) => {
        const userAnswers = answers[index] || [];
        const correctAns = q.correctAnswers;

        return (
          userAnswers.length === correctAns.length &&
          userAnswers.sort().every((val, idx) => val === correctAns.sort()[idx])
        );
      }).length;

      const wrongAnswers = questions.length - correctAnswers;

      // Prepare submission data
      const attemptData = {
        studentId: currentUser._id,
        batchId: studentEnrollment.batchId,
        chapter: selectedChapter,
        totalQuestions: questions.length,
        correctAnswers,
        wrongAnswers,
        score,
        answers,
        questions,
        submittedAt: new Date().toISOString(),
        timeTaken,
      };

      // Submit to backend
      await submitQuizAttempt(attemptData);

      // Update local state
      setChapterAttempts({
        ...chapterAttempts,
        [selectedChapter]: {
          hasAttempted: true,
          attempt: attemptData,
        },
      });

      return true;
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("কুইজ জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      return false;
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!studentEnrollment) {
    return (
      <div className="min-h-screen bg-base-200 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center py-12">
              <AlertCircle className="w-20 h-20 mx-auto text-warning mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                আপনি কোন ব্যাচে ভর্তি নন
              </h2>
              <p className="text-gray-400 mb-6">
                কুইজে অংশগ্রহণ করতে প্রথমে একটি ব্যাচে ভর্তি হন
              </p>
              <button
                onClick={() => navigate("/dashboard/student")}
                className="btn btn-primary"
              >
                ড্যাশবোর্ডে ফিরুন
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/dashboard/student")}
            className="btn btn-ghost gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            ড্যাশবোর্ডে ফিরুন
          </button>
          <h1 className="text-3xl font-bold">র‍্যান্ডম কুইজ অনুশীলন</h1>
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
                <Clock className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-semibold">৫০ মিনিট</p>
                  <p className="text-sm text-gray-400">সময় সীমা</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-semibold">একবার মাত্র</p>
                  <p className="text-sm text-gray-400">প্রতি অধ্যায়ে</p>
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
                  const attemptInfo = chapterAttempts[chapter];
                  const isAttempted = attemptInfo?.hasAttempted;
                  const isSelected = selectedChapter === chapter;
                  const isDisabled = isAttempted;

                  return (
                    <div
                      key={chapter}
                      onClick={() => !isDisabled && setSelectedChapter(chapter)}
                      className={`card cursor-pointer transition-all ${
                        isDisabled
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:shadow-xl"
                      } ${
                        isSelected && !isDisabled
                          ? "bg-primary text-white ring-4 ring-primary ring-offset-2"
                          : isAttempted
                          ? "bg-success/20 border-2 border-success"
                          : "bg-base-200 hover:bg-base-300"
                      }`}
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-2xl font-bold">
                            অধ্যায় {chapter}
                          </h4>
                          {isSelected && !isDisabled && (
                            <div className="badge badge-secondary">
                              নির্বাচিত
                            </div>
                          )}
                          {isAttempted && (
                            <div className="badge badge-success gap-1">
                              <CheckCircle className="w-3 h-3" />
                              সম্পন্ন
                            </div>
                          )}
                        </div>

                        <div className="divider my-2"></div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span
                              className={
                                isSelected && !isDisabled
                                  ? "text-white/80"
                                  : "text-gray-400"
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
                                isSelected && !isDisabled
                                  ? "text-white/80"
                                  : "text-gray-400"
                              }
                            >
                              এলোমেলো প্রশ্ন:
                            </span>
                            <span className="font-bold">
                              {Math.min(50, stats.totalQuestions)}
                            </span>
                          </div>
                          {isAttempted && attemptInfo.attempt && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                আপনার স্কোর:
                              </span>
                              <span className="font-bold text-success">
                                {attemptInfo.attempt.score}%
                              </span>
                            </div>
                          )}
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
        {selectedChapter && !chapterAttempts[selectedChapter]?.hasAttempted && (
          <div className="flex justify-center">
            <button
              onClick={handleStartQuiz}
              className="btn btn-primary btn-lg gap-3 px-8"
            >
              <Play className="w-6 h-6" />
              কুইজ শুরু করুন (৫০ মিনিট)
            </button>
          </div>
        )}
      </div>

      {/* Quiz Modal */}
      {showQuiz && generatedQuiz && (
        <TakeQuizWithTimer
          quiz={generatedQuiz}
          onClose={() => setShowQuiz(false)}
          onSuccess={handleQuizComplete}
          onSubmit={handleQuizSubmit}
        />
      )}
    </div>
  );
};

export default StudentQuizPage;
