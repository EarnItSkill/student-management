import { Award, Plus, Save, Trash2, X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { useAppContext } from "../../context/useAppContext";

const QuizForm = ({ quiz, onClose, onSuccess }) => {
  const { courses, addQuiz, updateQuiz } = useAppContext();
  const isEdit = !!quiz;

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: quiz || {
      courseId: "",
      title: "",
      totalMarks: 0,
      questions: [
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswers: [0],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const watchQuestions = watch("questions");

  const toggleCorrectAnswer = (questionIndex, optionIndex) => {
    const currentAnswers = watchQuestions[questionIndex]?.correctAnswers || [];
    const isSelected = currentAnswers.includes(optionIndex);

    let newAnswers;
    if (isSelected) {
      // Remove if already selected
      newAnswers = currentAnswers.filter((idx) => idx !== optionIndex);
    } else {
      // Add if not selected
      newAnswers = [...currentAnswers, optionIndex];
    }

    // Ensure at least one answer is selected
    if (newAnswers.length === 0) {
      return;
    }

    setValue(`questions.${questionIndex}.correctAnswers`, newAnswers.sort());
  };

  const onSubmit = async (data) => {
    try {
      const quizData = {
        ...data,
        courseId: data.courseId,
        totalMarks: parseInt(data.totalMarks),
        questions: data.questions.map((q, index) => ({
          id: index + 1,
          question: q.question,
          options: q.options,
          correctAnswers: q.correctAnswers || [0],
        })),
        results: quiz?.results || [],
      };

      if (isEdit) {
        updateQuiz(quiz._id, quizData);
      } else {
        addQuiz(quizData);
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error saving quiz:", error);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-base-100 z-10 pb-4">
          <h3 className="font-bold text-2xl flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" />
            {isEdit ? "Edit Quiz" : "Add New Quiz"}
          </h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Quiz Basic Info */}
          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Quiz Title *</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Microsoft Word - Basic Quiz"
                className={`input input-bordered ${
                  errors.title ? "input-error" : ""
                }`}
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 5,
                    message: "Title must be at least 5 characters",
                  },
                })}
              />
              {errors.title && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.title.message}
                  </span>
                </label>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Select Course *
                  </span>
                </label>
                <select
                  className={`select select-bordered ${
                    errors.courseId ? "select-error" : ""
                  }`}
                  {...register("courseId", {
                    required: "Course is required",
                  })}
                >
                  <option value="">Choose a course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                {errors.courseId && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.courseId.message}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Total Marks *
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="e.g., 20"
                  className={`input input-bordered ${
                    errors.totalMarks ? "input-error" : ""
                  }`}
                  {...register("totalMarks", {
                    required: "Total marks is required",
                    min: { value: 1, message: "Must be at least 1" },
                  })}
                />
                {errors.totalMarks && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.totalMarks.message}
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="divider">Questions</div>

          {/* Questions */}
          <div className="space-y-6">
            {fields.map((field, questionIndex) => (
              <div key={field.id} className="card bg-base-200 shadow-lg">
                <div className="card-body">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-lg">
                      Question {questionIndex + 1}
                    </h4>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(questionIndex)}
                        className="btn btn-error btn-sm gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Question Text */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Question *
                      </span>
                    </label>
                    <textarea
                      placeholder="Enter your question"
                      className={`textarea textarea-bordered h-20 ${
                        errors.questions?.[questionIndex]?.question
                          ? "textarea-error"
                          : ""
                      }`}
                      {...register(`questions.${questionIndex}.question`, {
                        required: "Question is required",
                      })}
                    />
                    {errors.questions?.[questionIndex]?.question && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.questions[questionIndex].question.message}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Options */}
                  <div className="space-y-3 mt-4">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Options *
                      </span>
                    </label>
                    {[0, 1, 2, 3].map((optionIndex) => (
                      <div key={optionIndex} className="form-control">
                        <div className="input-group">
                          <span className="bg-base-300 px-4 font-semibold">
                            {String.fromCharCode(65 + optionIndex)}
                          </span>
                          <input
                            type="text"
                            placeholder={`Option ${String.fromCharCode(
                              65 + optionIndex
                            )}`}
                            className={`input input-bordered w-full ${
                              errors.questions?.[questionIndex]?.options?.[
                                optionIndex
                              ]
                                ? "input-error"
                                : ""
                            }`}
                            {...register(
                              `questions.${questionIndex}.options.${optionIndex}`,
                              {
                                required: "Option is required",
                              }
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Correct Answers - Multiple Selection */}
                  <div className="form-control mt-4">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Correct Answer(s) *
                        <span className="text-xs text-gray-500 ml-2">
                          (Click to select multiple)
                        </span>
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[0, 1, 2, 3].map((optionIndex) => {
                        const isSelected =
                          watchQuestions[
                            questionIndex
                          ]?.correctAnswers?.includes(optionIndex);
                        return (
                          <button
                            key={optionIndex}
                            type="button"
                            onClick={() =>
                              toggleCorrectAnswer(questionIndex, optionIndex)
                            }
                            className={`btn ${
                              isSelected ? "btn-success" : "btn-outline"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              readOnly
                              className="checkbox checkbox-sm mr-2"
                            />
                            Option {String.fromCharCode(65 + optionIndex)}
                          </button>
                        );
                      })}
                    </div>
                    {watchQuestions[questionIndex]?.correctAnswers?.length >
                      1 && (
                      <div className="alert alert-info mt-2">
                        <span className="text-sm">
                          Multiple correct answers selected:{" "}
                          {watchQuestions[questionIndex].correctAnswers.length}{" "}
                          options
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Question Button */}
          <button
            type="button"
            onClick={() =>
              append({
                question: "",
                options: ["", "", "", ""],
                correctAnswers: [0],
              })
            }
            className="btn btn-outline btn-primary w-full gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Another Question
          </button>

          {/* Actions */}
          <div className="modal-action sticky bottom-0 bg-base-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isEdit ? "Update" : "Save"} Quiz
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizForm;
