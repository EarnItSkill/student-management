import { Award, CheckCircle, Send, X } from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../client/src/context/useAppContext";

const TakeQuiz = ({ quiz, onClose, onSuccess }) => {
  const { currentUser, submitQuiz } = useAppContext();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    // Calculate score
    let totalScore = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        totalScore += quiz.totalMarks / quiz.questions.length;
      }
    });

    const finalScore = Math.round(totalScore);
    setScore(finalScore);

    // Submit quiz result with answers
    submitQuiz(quiz._id, currentUser._id, finalScore, answers); // 👈 answers যোগ করুন

    setShowResult(true);
  };

  const handleClose = () => {
    if (showResult) {
      onSuccess?.();
    }
    onClose();
  };

  const question = quiz.questions[currentQuestion];
  const isAnswered = answers[currentQuestion] !== undefined;
  const allAnswered = Object.keys(answers).length === quiz.questions.length;
  const percentage =
    score > 0 ? ((score / quiz.totalMarks) * 100).toFixed(1) : 0;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-3xl">
        {!showResult ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-2xl">{quiz.title}</h3>
                <p className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="btn btn-sm btn-circle btn-ghost"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <progress
                className="progress progress-primary w-full"
                value={currentQuestion + 1}
                max={quiz.questions.length}
              ></progress>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>
                  Progress:{" "}
                  {Math.round(
                    ((currentQuestion + 1) / quiz.questions.length) * 100
                  )}
                  %
                </span>
                <span>
                  Answered: {Object.keys(answers).length}/
                  {quiz.questions.length}
                </span>
              </div>
            </div>

            {/* Question Card */}
            <div className="card bg-base-200 shadow-lg mb-6">
              <div className="card-body">
                <h4 className="text-lg font-bold mb-4">
                  {currentQuestion + 1}. {question.question}
                </h4>

                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(currentQuestion, index)}
                      className={`btn btn-block justify-start text-left h-auto py-4 ${
                        answers[currentQuestion] === index
                          ? "btn-primary"
                          : "btn-outline"
                      }`}
                    >
                      <span className="font-bold mr-3">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span className="flex-1">{option}</span>
                      {answers[currentQuestion] === index && (
                        <CheckCircle className="w-5 h-5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="btn btn-ghost"
              >
                ← Previous
              </button>

              <div className="text-sm text-gray-600">
                {isAnswered ? "✓ Answered" : "⚠ Not answered"}
              </div>

              {currentQuestion === quiz.questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                  className="btn btn-success gap-2"
                >
                  <Send className="w-5 h-5" />
                  Submit Quiz
                </button>
              ) : (
                <button onClick={handleNext} className="btn btn-primary">
                  Next →
                </button>
              )}
            </div>

            {/* Submit Warning */}
            {!allAnswered && currentQuestion === quiz.questions.length - 1 && (
              <div className="alert alert-warning mt-4">
                <span>⚠ Please answer all questions before submitting</span>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Result Screen */}
            <div className="text-center py-8">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
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

              <p className="text-gray-600 mb-6">You have completed the quiz</p>

              {/* Score Display */}
              <div className="stats shadow mb-6">
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
                    {score}/{quiz.totalMarks}
                  </div>
                  <div className="stat-desc">{percentage}%</div>
                </div>
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
                  <p>
                    Good work! Review the topics you missed to improve further.
                  </p>
                )}
                {percentage < 60 && (
                  <p>
                    Don't worry! Practice more and you'll do better next time.
                  </p>
                )}
              </div>

              {/* Answer Review */}
              <div className="text-left mb-6">
                <h4 className="font-bold text-lg mb-4">Answer Review:</h4>
                <div className="space-y-3">
                  {quiz.questions.map((q, index) => {
                    const isCorrect = answers[index] === q.correctAnswer;
                    return (
                      <div
                        key={index}
                        className={`card ${
                          isCorrect ? "bg-success/10" : "bg-error/10"
                        } shadow`}
                      >
                        <div className="card-body p-4">
                          <div className="flex items-start gap-2">
                            {isCorrect ? (
                              <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                            ) : (
                              <X className="w-5 h-5 text-error flex-shrink-0 mt-1" />
                            )}
                            <div className="flex-1">
                              <p className="font-semibold text-sm">
                                {index + 1}. {q.question}
                              </p>
                              <div className="text-xs mt-2">
                                <span
                                  className={
                                    isCorrect ? "text-success" : "text-error"
                                  }
                                >
                                  Your answer:{" "}
                                  {String.fromCharCode(65 + answers[index])}.{" "}
                                  {q.options[answers[index]]}
                                </span>
                                {!isCorrect && (
                                  <div className="text-success mt-1">
                                    Correct answer:{" "}
                                    {String.fromCharCode(65 + q.correctAnswer)}.{" "}
                                    {q.options[q.correctAnswer]}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Close Button */}
              <button onClick={handleClose} className="btn btn-primary btn-lg">
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TakeQuiz;
