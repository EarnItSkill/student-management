import {
  AlertTriangle,
  Award,
  CheckCircle,
  Clock,
  Send,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const TakeQuizWithTimer = ({ quiz, onClose, onSuccess, onSubmit }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [shuffledQuiz, setShuffledQuiz] = useState(null);
  const [optionMappings, setOptionMappings] = useState([]);
  const [timeLeft, setTimeLeft] = useState(50 * 60); // 50 minutes in seconds
  const [startTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shuffle function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Shuffle quiz options on component mount
  useEffect(() => {
    if (quiz) {
      const mappings = [];

      const shuffledQuestions = quiz.questions.map((question) => {
        const optionsWithIndex = question.options.map((opt, idx) => ({
          option: opt,
          originalIndex: idx,
        }));

        const shuffledOptions = shuffleArray(optionsWithIndex);
        const mapping = shuffledOptions.map((item) => item.originalIndex);
        mappings.push(mapping);

        const newCorrectAnswers = question.correctAnswers.map((correctIdx) => {
          return shuffledOptions.findIndex(
            (item) => item.originalIndex === correctIdx
          );
        });

        return {
          ...question,
          options: shuffledOptions.map((item) => item.option),
          correctAnswers: newCorrectAnswers,
        };
      });

      setOptionMappings(mappings);
      setShuffledQuiz({
        ...quiz,
        questions: shuffledQuestions,
      });
    }
  }, [quiz]);

  // Timer countdown
  useEffect(() => {
    if (!shuffledQuiz || showResult) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [shuffledQuiz, showResult]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Auto submit when time runs out
  const handleAutoSubmit = () => {
    if (!isSubmitting) {
      handleSubmit(true);
    }
  };

  if (!shuffledQuiz) {
    return (
      <div className="modal modal-open">
        <div className="modal-box">
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    const question = shuffledQuiz.questions[questionIndex];
    const currentAnswers = answers[questionIndex] || [];
    const hasMultipleAnswers = question.correctAnswers.length > 1;

    if (hasMultipleAnswers) {
      let newAnswers;
      if (currentAnswers.includes(optionIndex)) {
        newAnswers = currentAnswers.filter((idx) => idx !== optionIndex);
      } else {
        newAnswers = [...currentAnswers, optionIndex];
      }

      setAnswers({
        ...answers,
        [questionIndex]: newAnswers.length > 0 ? newAnswers : undefined,
      });
    } else {
      setAnswers({
        ...answers,
        [questionIndex]: [optionIndex],
      });
    }
  };

  const handleNext = () => {
    if (currentQuestion < shuffledQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async (isAutoSubmit = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Calculate score
    let totalScore = 0;
    const marksPerQuestion = 100 / shuffledQuiz.questions.length;

    shuffledQuiz.questions.forEach((question, index) => {
      const userAnswers = answers[index] || [];
      const correctAnswers = question.correctAnswers;

      const isCorrect =
        userAnswers.length === correctAnswers.length &&
        userAnswers
          .sort()
          .every((val, idx) => val === correctAnswers.sort()[idx]);

      if (isCorrect) {
        totalScore += marksPerQuestion;
      }
    });

    const finalScore = Math.round(totalScore);
    setScore(finalScore);

    // Calculate time taken
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    // Convert shuffled answers back to original indices
    const originalAnswers = {};
    Object.keys(answers).forEach((questionIdx) => {
      const shuffledIndices = answers[questionIdx];
      const mapping = optionMappings[questionIdx];

      originalAnswers[questionIdx] = shuffledIndices.map(
        (shuffledIdx) => mapping[shuffledIdx]
      );
    });

    // Prepare quiz data for submission
    const quizData = {
      score: finalScore,
      answers: originalAnswers,
      questions: quiz.questions, // Original questions
      timeTaken,
    };

    // Call parent submit handler
    try {
      const success = await onSubmit(quizData);
      if (success) {
        setShowResult(true);
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("কুইজ জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  const question = shuffledQuiz.questions[currentQuestion];
  const isAnswered =
    answers[currentQuestion] !== undefined &&
    answers[currentQuestion].length > 0;
  const allAnswered = shuffledQuiz.questions.every(
    (_, idx) => answers[idx] !== undefined && answers[idx].length > 0
  );
  const percentage = score;
  const hasMultipleAnswers = question.correctAnswers.length > 1;

  const handleClose = () => {
    if (showResult) {
      onSuccess?.();
    }
    onClose();
  };

  // Timer warning colors
  const getTimerColor = () => {
    if (timeLeft <= 300) return "text-error"; // Last 5 minutes
    if (timeLeft <= 600) return "text-warning"; // Last 10 minutes
    return "text-info";
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-3xl">
        {!showResult ? (
          <>
            {/* Header with Timer */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-2xl">{shuffledQuiz.title}</h3>
                <p className="text-sm text-gray-400">
                  প্রশ্ন {currentQuestion + 1} / {shuffledQuiz.questions.length}
                </p>
              </div>
              <div className="flex items-center gap-4">
                {/* Timer */}
                <div
                  className={`flex items-center gap-2 font-mono text-2xl font-bold ${getTimerColor()}`}
                >
                  <Clock className="w-6 h-6" />
                  {formatTime(timeLeft)}
                </div>
                <button
                  onClick={handleClose}
                  className="btn btn-sm btn-circle btn-ghost"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Time Warning */}
            {timeLeft <= 300 && (
              <div className="alert alert-error mb-4">
                <AlertTriangle className="w-5 h-5" />
                <span>
                  সতর্কতা! মাত্র {Math.floor(timeLeft / 60)} মিনিট বাকি!
                </span>
              </div>
            )}

            {/* Progress Bar */}
            <div className="mb-6">
              <progress
                className="progress progress-primary w-full"
                value={currentQuestion + 1}
                max={shuffledQuiz.questions.length}
              ></progress>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>
                  অগ্রগতি:{" "}
                  {Math.round(
                    ((currentQuestion + 1) / shuffledQuiz.questions.length) *
                      100
                  )}
                  %
                </span>
                <span>
                  উত্তরিত:{" "}
                  {
                    Object.keys(answers).filter((k) => answers[k]?.length > 0)
                      .length
                  }
                  /{shuffledQuiz.questions.length}
                </span>
              </div>
            </div>

            {/* Question Card */}
            <div className="card bg-base-200 shadow-lg mb-6">
              <div className="card-body">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-bold flex-1">
                    {currentQuestion + 1}. {question.question}
                  </h4>
                  {hasMultipleAnswers && (
                    <span className="badge badge-info">একাধিক উত্তর</span>
                  )}
                </div>

                {hasMultipleAnswers && (
                  <div className="alert alert-info mb-4">
                    <span className="text-sm">
                      ℹ️ এই প্রশ্নের একাধিক সঠিক উত্তর আছে। সব উত্তর নির্বাচন
                      করুন।
                    </span>
                  </div>
                )}

                <div className="space-y-3">
                  {question.options.map((option, index) => {
                    const isSelected =
                      answers[currentQuestion]?.includes(index);

                    return (
                      <button
                        key={index}
                        onClick={() =>
                          handleAnswerSelect(currentQuestion, index)
                        }
                        className={`btn btn-block justify-start text-left h-auto py-4 ${
                          isSelected ? "btn-primary" : "btn-outline"
                        }`}
                      >
                        {hasMultipleAnswers ? (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="checkbox checkbox-sm mr-3"
                          />
                        ) : (
                          <span className="font-bold mr-3">
                            {String.fromCharCode(65 + index)}.
                          </span>
                        )}
                        <span className="flex-1">{option}</span>
                        {isSelected && !hasMultipleAnswers && (
                          <CheckCircle className="w-5 h-5" />
                        )}
                      </button>
                    );
                  })}
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
                ← পূর্ববর্তী
              </button>

              <div className="text-sm text-gray-400">
                {isAnswered ? (
                  <span className="text-success">✓ উত্তরিত</span>
                ) : (
                  <span className="text-warning">⚠ উত্তর দেননি</span>
                )}
              </div>

              {currentQuestion === shuffledQuiz.questions.length - 1 ? (
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={!allAnswered || isSubmitting}
                  className="btn btn-success gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      জমা দেওয়া হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      কুইজ জমা দিন
                    </>
                  )}
                </button>
              ) : (
                <button onClick={handleNext} className="btn btn-primary">
                  পরবর্তী →
                </button>
              )}
            </div>

            {/* Submit Warning */}
            {!allAnswered &&
              currentQuestion === shuffledQuiz.questions.length - 1 && (
                <div className="alert alert-warning mt-4">
                  <span>⚠ কুইজ জমা দেওয়ার আগে সব প্রশ্নের উত্তর দিন</span>
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
                  ? "চমৎকার! 🎉"
                  : percentage >= 60
                  ? "ভালো করেছেন! 👍"
                  : "আরো চেষ্টা করুন! 💪"}
              </h3>

              <p className="text-gray-400 mb-6">আপনি কুইজটি সম্পন্ন করেছেন</p>

              {/* Score Display */}
              <div className="stats shadow mb-6">
                <div className="stat">
                  <div className="stat-title">আপনার স্কোর</div>
                  <div
                    className={`stat-value ${
                      percentage >= 80
                        ? "text-success"
                        : percentage >= 60
                        ? "text-warning"
                        : "text-error"
                    }`}
                  >
                    {score}%
                  </div>
                  <div className="stat-desc">
                    {shuffledQuiz.questions.length} টি প্রশ্নের মধ্যে{" "}
                    {Math.round((score / 100) * shuffledQuiz.questions.length)}{" "}
                    টি সঠিক
                  </div>
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
                  <p>অসাধারণ! আপনি এই বিষয়ে দক্ষতা অর্জন করেছেন।</p>
                )}
                {percentage >= 60 && percentage < 80 && (
                  <p>ভালো কাজ! আরো উন্নতির জন্য বিষয়গুলো পুনরায় পড়ুন।</p>
                )}
                {percentage < 60 && (
                  <p>চিন্তা করবেন না! আরো অনুশীলন করলে আপনি আরো ভালো করবেন।</p>
                )}
              </div>

              {/* Answer Review */}
              <div className="text-left mb-6 max-h-96 overflow-y-auto">
                <h4 className="font-bold text-lg mb-4">উত্তর পর্যালোচনা:</h4>
                <div className="space-y-3">
                  {shuffledQuiz.questions.map((q, index) => {
                    const userAnswers = answers[index] || [];
                    const correctAnswers = q.correctAnswers;

                    const isCorrect =
                      userAnswers.length === correctAnswers.length &&
                      userAnswers
                        .sort()
                        .every(
                          (val, idx) => val === correctAnswers.sort()[idx]
                        );

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
                                <div
                                  className={
                                    isCorrect ? "text-success" : "text-error"
                                  }
                                >
                                  আপনার উত্তর:{" "}
                                  {userAnswers.length > 0
                                    ? userAnswers
                                        .map(
                                          (idx) =>
                                            `${String.fromCharCode(
                                              65 + idx
                                            )}. ${q.options[idx]}`
                                        )
                                        .join(", ")
                                    : "কোন উত্তর দেননি"}
                                </div>
                                {!isCorrect && (
                                  <div className="text-success mt-1">
                                    সঠিক উত্তর:{" "}
                                    {correctAnswers
                                      .map(
                                        (idx) =>
                                          `${String.fromCharCode(65 + idx)}. ${
                                            q.options[idx]
                                          }`
                                      )
                                      .join(", ")}
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
                বন্ধ করুন
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TakeQuizWithTimer;
