import { ArrowLeft, FileText, Image as ImageIcon, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../context/useAppContext";

const CqForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { courses, cqQuestions, addCqQuestion, updateCqQuestion } =
    useAppContext();

  const isEdit = !!id;
  const editCq = cqQuestions.find((cq) => cq._id === id);

  const [stimulusType, setStimulusType] = useState("text");
  const [imagePreview, setImagePreview] = useState("");

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: editCq || {
      courseId: "",
      chapter: "",
      stimulusType: "text",
      stimulusContent: "",
      questions: [
        { question: "", marks: 3 },
        { question: "", marks: 4 },
      ],
    },
  });

  const watchStimulusType = watch("stimulusType");
  const watchStimulusContent = watch("stimulusContent");

  // Update stimulus type
  useEffect(() => {
    setStimulusType(watchStimulusType);
  }, [watchStimulusType]);

  // Update image preview
  useEffect(() => {
    if (watchStimulusType === "image" && watchStimulusContent) {
      setImagePreview(watchStimulusContent);
    }
  }, [watchStimulusContent, watchStimulusType]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await updateCqQuestion(id, data);
      } else {
        await addCqQuestion(data);
      }
      navigate("/dashboard/admin/cq");
    } catch (error) {
      alert("Failed to save CQ question", { error });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard/admin/cq")}
          className="btn btn-ghost gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h2 className="text-3xl font-bold">
          {isEdit ? "Edit" : "Add New"} CQ Question
        </h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="text-xl font-bold mb-4">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Course */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Course</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <Controller
                  name="courseId"
                  control={control}
                  rules={{ required: "Course is required" }}
                  render={({ field }) => (
                    <>
                      <select
                        className={`select select-bordered ${
                          errors.courseId ? "select-error" : ""
                        }`}
                        {...field}
                      >
                        <option value="">Select Course</option>
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
                    </>
                  )}
                />
              </div>

              {/* Chapter */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Chapter</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <Controller
                  name="chapter"
                  control={control}
                  rules={{ required: "Chapter is required" }}
                  render={({ field }) => (
                    <>
                      <input
                        type="text"
                        placeholder="e.g., 3"
                        className={`input input-bordered ${
                          errors.chapter ? "input-error" : ""
                        }`}
                        {...field}
                      />
                      {errors.chapter && (
                        <label className="label">
                          <span className="label-text-alt text-error">
                            {errors.chapter.message}
                          </span>
                        </label>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stimulus Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="text-xl font-bold mb-4">Stimulus (উদ্দীপক)</h3>

            {/* Stimulus Type */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-semibold">Stimulus Type</span>
              </label>
              <Controller
                name="stimulusType"
                control={control}
                render={({ field }) => (
                  <div className="btn-group">
                    <button
                      type="button"
                      onClick={() => {
                        field.onChange("text");
                        setValue("stimulusContent", "");
                      }}
                      className={`btn gap-2 ${
                        field.value === "text" ? "btn-primary" : "btn-outline"
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                      Text
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        field.onChange("image");
                        setValue("stimulusContent", "");
                      }}
                      className={`btn gap-2 ${
                        field.value === "image" ? "btn-primary" : "btn-outline"
                      }`}
                    >
                      <ImageIcon className="w-5 h-5" />
                      Image URL
                    </button>
                  </div>
                )}
              />
            </div>

            {/* Stimulus Content */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  {stimulusType === "image"
                    ? "Image URL"
                    : "Stimulus Text (উদ্দীপক)"}
                </span>
                <span className="label-text-alt text-error">*</span>
              </label>
              <Controller
                name="stimulusContent"
                control={control}
                rules={{ required: "Stimulus content is required" }}
                render={({ field }) => (
                  <>
                    {stimulusType === "image" ? (
                      <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        className={`input input-bordered ${
                          errors.stimulusContent ? "input-error" : ""
                        }`}
                        {...field}
                      />
                    ) : (
                      <textarea
                        placeholder="Enter stimulus text here..."
                        className={`textarea textarea-bordered h-20 w-full ${
                          errors.stimulusContent ? "textarea-error" : ""
                        }`}
                        {...field}
                      />
                    )}
                    {errors.stimulusContent && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.stimulusContent.message}
                        </span>
                      </label>
                    )}
                  </>
                )}
              />
            </div>

            {/* Image Preview */}
            {stimulusType === "image" && imagePreview && (
              <div className="mt-4">
                <label className="label">
                  <span className="label-text font-semibold">Preview</span>
                </label>
                <div className="w-full max-w-md bg-base-200 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-auto"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=Invalid+Image";
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Questions Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="text-xl font-bold mb-4">Questions (প্রশ্ন)</h3>

            {[0, 1].map((index) => (
              <div key={index} className="card bg-base-200 shadow mb-4">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold">Question {index + 1}</h4>
                    <div className="badge badge-primary">Required</div>
                  </div>

                  <div className="form-control mb-3">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Question Text
                      </span>
                      <span className="label-text-alt text-error">*</span>
                    </label>
                    <Controller
                      name={`questions.${index}.question`}
                      control={control}
                      rules={{ required: "Question is required" }}
                      render={({ field }) => (
                        <>
                          <textarea
                            placeholder={`Enter question ${index + 1}...`}
                            className={`textarea textarea-bordered h-20 w-full ${
                              errors.questions?.[index]?.question
                                ? "textarea-error"
                                : ""
                            }`}
                            {...field}
                          />
                          {errors.questions?.[index]?.question && (
                            <label className="label">
                              <span className="label-text-alt text-error">
                                {errors.questions[index].question.message}
                              </span>
                            </label>
                          )}
                        </>
                      )}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Marks</span>
                    </label>
                    <Controller
                      name={`questions.${index}.marks`}
                      control={control}
                      render={({ field }) => (
                        <input
                          disabled
                          type="number"
                          min="1"
                          max="10"
                          className="input input-bordered w-24"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="alert alert-info">
              <div>
                <p className="text-sm">
                  <strong>Note:</strong> Exactly 2 questions are required for
                  each CQ stimulus.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 sticky bottom-0 bg-base-200 p-4 rounded-lg">
          <button
            type="button"
            onClick={() => navigate("/dashboard/admin/cq")}
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
                {isEdit ? "Update" : "Save"} CQ Question
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CqForm;
