import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle,
  Eye,
  Target,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizReviewModal from "../components/quizzes/QuizReviewModal";
import { useAppContext } from "../context/useAppContext";

const StudentQuizResults = () => {
  const navigate = useNavigate();
  const { currentUser, enrollments, batches, getMcqAttemptsByStudent } =
    useAppContext();

  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAttempt, setSelectedAttempt] = useState(null);

  // Get student's enrollment
  const studentEnrollment = enrollments.find(
    (e) => e.studentId === currentUser?._id
  );
  const studentBatch = batches.find(
    (b) => b._id === studentEnrollment?.batchId
  );

  // Fetch attempts
  useEffect(() => {
    const fetchAttempts = async () => {
      if (!currentUser || !studentEnrollment) {
        setLoading(false);
        return;
      }

      try {
        const data = await getMcqAttemptsByStudent(
          currentUser._id,
          studentEnrollment.batchId
        );

        // Sort by chapter
        const sortedData = data.sort((a, b) => {
          const chapterA = parseInt(a.chapter);
          const chapterB = parseInt(b.chapter);
          return chapterA - chapterB;
        });

        setAttempts(sortedData);
      } catch (error) {
        console.error("Error fetching attempts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, [currentUser, studentEnrollment, getMcqAttemptsByStudent]);

  // Calculate overall stats
  const averageScore =
    attempts.length > 0
      ? Math.round(
          attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length
        )
      : 0;

  const totalQuestions = attempts.reduce((sum, a) => sum + a.totalQuestions, 0);
  const totalCorrect = attempts.reduce((sum, a) => sum + a.correctAnswers, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
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
          <h1 className="text-3xl font-bold">আমার কুইজ ফলাফল</h1>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-figure text-primary">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="stat-title">সম্পন্ন কুইজ</div>
            <div className="stat-value text-primary">{attempts.length}</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-figure text-success">
              <Target className="w-8 h-8" />
            </div>
            <div className="stat-title">গড় স্কোর</div>
            <div className="stat-value text-success">{averageScore}%</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-figure text-info">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="stat-title">সঠিক উত্তর</div>
            <div className="stat-value text-info">
              {totalCorrect}/{totalQuestions}
            </div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-figure text-accent">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div className="stat-title">সফলতার হার</div>
            <div className="stat-value text-accent">
              {totalQuestions > 0
                ? Math.round((totalCorrect / totalQuestions) * 100)
                : 0}
              %
            </div>
          </div>
        </div>

        {/* Attempts List */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="text-2xl font-bold mb-4">কুইজ হিস্ট্রি</h2>

            {attempts.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">এখনো কোন কুইজ সম্পন্ন হয়নি</p>
                <button
                  onClick={() => navigate("/dashboard/student/practice-quiz")}
                  className="btn btn-primary mt-4"
                >
                  কুইজ শুরু করুন
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {attempts.map((attempt) => {
                  const percentage = attempt.score;
                  const isPassed = percentage >= 60;

                  return (
                    <div
                      key={attempt._id}
                      className={`card shadow-lg border-2 ${
                        isPassed
                          ? "border-success bg-success/5"
                          : "border-warning bg-warning/5"
                      }`}
                    >
                      <div className="card-body">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold">
                            অধ্যায় {attempt.chapter}
                          </h3>
                          <div
                            className={`badge ${
                              isPassed ? "badge-success" : "badge-warning"
                            }`}
                          >
                            {percentage}%
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">মোট প্রশ্ন:</span>
                            <span className="font-semibold">
                              {attempt.totalQuestions}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">সঠিক:</span>
                            <span className="font-semibold text-success">
                              {attempt.correctAnswers}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">ভুল:</span>
                            <span className="font-semibold text-error">
                              {attempt.wrongAnswers}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">সময়:</span>
                            <span className="font-semibold">
                              {Math.floor(attempt.timeTaken / 60)} মিনিট
                            </span>
                          </div>
                        </div>

                        <div className="divider my-2"></div>

                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(attempt.submittedAt).toLocaleDateString(
                              "bn-BD",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedAttempt(attempt)}
                          className="btn btn-primary btn-sm gap-2 mt-3"
                        >
                          <Eye className="w-4 h-4" />
                          বিস্তারিত দেখুন
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {selectedAttempt && (
        <QuizReviewModal
          attempt={selectedAttempt}
          onClose={() => setSelectedAttempt(null)}
        />
      )}
    </div>
  );
};

export default StudentQuizResults;
