import { Award, CheckCircle, X } from "lucide-react";

const ViewQuizResult = ({ quiz, studentId, onClose }) => {
  // Find student's result
  const myResult = quiz.results.find((r) => r.studentId === studentId);

  if (!myResult) {
    return null;
  }

  // Calculate which answers were correct
  const userAnswers = {};
  let correctCount = 0;

  // We need to reconstruct the answers from the score
  // Since we don't store individual answers, we'll show the review differently
  const percentage = ((myResult.score / quiz.totalMarks) * 100).toFixed(1);

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-base-100 z-10 pb-4">
          <div>
            <h3 className="font-bold text-2xl">{quiz.title}</h3>
            <p className="text-sm text-gray-600">Quiz Result Review</p>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Display */}
        <div className="text-center py-6 mb-6">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
              percentage >= 80
                ? "bg-success"
                : percentage >= 60
                ? "bg-warning"
                : "bg-error"
            }`}
          >
            <Award className="w-12 h-12 text-white" />
          </div>

          <h3 className="text-3xl font-bold mb-2">
            {percentage >= 80
              ? "Excellent! 🎉"
              : percentage >= 60
              ? "Good Job! 👍"
              : "Keep Practicing! 💪"}
          </h3>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Your Score</div>
              <div
                className={`stat-value ${
                  percentage >= 80
                    ? "text-success"
                    : percentage >= 60
                    ? "text-warning"
                    : "text-error"
                }`}
              >
                {myResult.score}/{quiz.totalMarks}
              </div>
              <div className="stat-desc">{percentage}%</div>
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            Submitted:{" "}
            {new Date(myResult.submittedAt).toLocaleDateString("en-GB")} at{" "}
            {new Date(myResult.submittedAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Performance Message */}
        <div
          className={`alert ${
            percentage >= 80
              ? "alert-success"
              : percentage >= 60
              ? "alert-warning"
              : "alert-error"
          } mb-6`}
        >
          {percentage >= 80 && (
            <p>Outstanding performance! You've mastered this topic.</p>
          )}
          {percentage >= 60 && percentage < 80 && (
            <p>Good work! Review the topics you missed to improve further.</p>
          )}
          {percentage < 60 && (
            <p>Don't worry! Practice more and you'll do better next time.</p>
          )}
        </div>

        {/* Questions and Answers */}
        <div className="mb-6">
          <h4 className="font-bold text-lg mb-4">Questions & Answers:</h4>
          <div className="space-y-4">
            {quiz.questions.map((question, index) => (
              <div key={question.id} className="card bg-base-200 shadow">
                <div className="card-body p-4">
                  <h5 className="font-semibold text-sm mb-3">
                    {index + 1}. {question.question}
                  </h5>

                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => {
                      const isCorrectAnswer =
                        optIndex === question.correctAnswer;

                      return (
                        <div
                          key={optIndex}
                          className={`p-3 rounded-lg border-2 ${
                            isCorrectAnswer
                              ? "border-success bg-success/10"
                              : "border-base-300 bg-base-100"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold">
                              {String.fromCharCode(65 + optIndex)}.
                            </span>
                            <span className="flex-1">{option}</span>
                            {isCorrectAnswer && (
                              <div className="flex items-center gap-1 text-success">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-xs font-semibold">
                                  Correct Answer
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <div className="modal-action sticky bottom-0 bg-base-100 pt-4">
          <button onClick={onClose} className="btn btn-primary btn-block">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewQuizResult;
