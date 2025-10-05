import { Award, Plus, Save, Trash2, X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { useAppContext } from "../../context/useAppContext";

const QuizForm = ({ quiz, onClose, onSuccess }) => {
  const { batches, addQuiz, updateQuiz } = useAppContext();
  const isEdit = !!quiz;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: quiz || {
      batchId: "",
      title: "",
      totalMarks: 0,
      questions: [
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const onSubmit = async (data) => {
    try {
      const quizData = {
        ...data,
        batchId: data.batchId,
        totalMarks: parseInt(data.totalMarks),
        questions: data.questions.map((q, index) => ({
          id: index + 1,
          question: q.question,
          options: q.options,
          correctAnswer: parseInt(q.correctAnswer),
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
                    Select Batch *
                  </span>
                </label>
                <select
                  className={`select select-bordered ${
                    errors.batchId ? "select-error" : ""
                  }`}
                  {...register("batchId", {
                    required: "Batch is required",
                  })}
                >
                  <option value="">Choose a batch</option>
                  {batches.map((batch) => (
                    <option key={batch._id} value={batch._id}>
                      {batch.batchName}
                    </option>
                  ))}
                </select>
                {errors.batchId && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.batchId.message}
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

                  {/* Correct Answer */}
                  <div className="form-control mt-4">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Correct Answer *
                      </span>
                    </label>
                    <select
                      className="select select-bordered select-success"
                      {...register(`questions.${questionIndex}.correctAnswer`, {
                        required: "Correct answer is required",
                      })}
                    >
                      <option value={0}>Option A</option>
                      <option value={1}>Option B</option>
                      <option value={2}>Option C</option>
                      <option value={3}>Option D</option>
                    </select>
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
                correctAnswer: 0,
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
