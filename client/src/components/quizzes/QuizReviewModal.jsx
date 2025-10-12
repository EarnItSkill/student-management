import { Award, CheckCircle, X } from "lucide-react";

const QuizReviewModal = ({ attempt, onClose }) => {
  const percentage = attempt.score;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b sticky top-0 bg-base-100 z-10">
          <div>
            <h3 className="font-bold text-2xl">
              অধ্যায় {attempt.chapter} - কুইজ রিভিউ
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              জমা: {new Date(attempt.submittedAt).toLocaleDateString("bn-BD")}
            </p>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Summary */}
        <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 shadow-lg mb-6">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center ${
                    percentage >= 80
                      ? "bg-success"
                      : percentage >= 60
                      ? "bg-warning"
                      : "bg-error"
                  }`}
                >
                  <Award className="w-10 h-10 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">আপনার স্কোর</p>
                  <p className="text-4xl font-bold">{percentage}%</p>
                </div>
              </div>

              <div className="stats shadow">
                <div className="stat place-items-center">
                  <div className="stat-title">সঠিক</div>
                  <div className="stat-value text-success text-2xl">
                    {attempt.correctAnswers}
                  </div>
                </div>
                <div className="stat place-items-center">
                  <div className="stat-title">ভুল</div>
                  <div className="stat-value text-error text-2xl">
                    {attempt.wrongAnswers}
                  </div>
                </div>
                <div className="stat place-items-center">
                  <div className="stat-title">সময়</div>
                  <div className="stat-value text-info text-2xl">
                    {Math.floor(attempt.timeTaken / 60)}m
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Answer Review */}
        <div className="overflow-y-auto max-h-[60vh]">
          <h4 className="font-bold text-lg mb-4">প্রশ্ন ও উত্তর পর্যালোচনা:</h4>
          <div className="space-y-4">
            {attempt.questions.map((question, index) => {
              const userAnswers = attempt.answers[index] || [];
              const correctAnswers = question.correctAnswers;

              const isCorrect =
                userAnswers.length === correctAnswers.length &&
                userAnswers
                  .sort()
                  .every((val, idx) => val === correctAnswers.sort()[idx]);

              return (
                <div
                  key={index}
                  className={`card shadow-lg border-2 ${
                    isCorrect
                      ? "border-success bg-success/5"
                      : "border-error bg-error/5"
                  }`}
                >
                  <div className="card-body p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {isCorrect ? (
                          <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-error flex items-center justify-center">
                            <X className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="font-bold mb-3">
                          {index + 1}. {question.question}
                        </p>

                        {/* Options */}
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => {
                            const isUserAnswer = userAnswers.includes(optIndex);
                            const isCorrectAnswer =
                              correctAnswers.includes(optIndex);

                            return (
                              <div
                                key={optIndex}
                                className={`p-3 rounded-lg border-2 ${
                                  isCorrectAnswer
                                    ? "border-success bg-success/10"
                                    : isUserAnswer
                                    ? "border-error bg-error/10"
                                    : "border-base-300"
                                }`}
                              >
                                <div className="flex items-start gap-2">
                                  <span className="font-bold">
                                    {String.fromCharCode(65 + optIndex)}.
                                  </span>
                                  <span className="flex-1">{option}</span>
                                  {isCorrectAnswer && (
                                    <span className="badge badge-success badge-sm">
                                      সঠিক
                                    </span>
                                  )}
                                  {isUserAnswer && !isCorrectAnswer && (
                                    <span className="badge badge-error badge-sm">
                                      আপনার উত্তর
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Answer Summary */}
                        <div className="mt-3 text-sm">
                          {!isCorrect && (
                            <div className="alert alert-error py-2">
                              <div>
                                <p className="font-semibold">আপনার উত্তর ভুল</p>
                                {userAnswers.length === 0 ? (
                                  <p className="text-xs">
                                    আপনি কোন উত্তর দেননি
                                  </p>
                                ) : (
                                  <p className="text-xs">
                                    সঠিক উত্তর:{" "}
                                    {correctAnswers
                                      .map(
                                        (idx) =>
                                          `${String.fromCharCode(65 + idx)}`
                                      )
                                      .join(", ")}
                                  </p>
                                )}
                              </div>
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

        {/* Footer */}
        <div className="flex justify-end mt-6 pt-4 border-t sticky bottom-0 bg-base-100">
          <button onClick={onClose} className="btn btn-primary">
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizReviewModal;
