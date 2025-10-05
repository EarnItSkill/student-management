import { BookOpen, Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAppContext } from "../../context/useAppContext";

const CourseForm = ({ course, onClose, onSuccess }) => {
  const { addCourse, updateCourse } = useAppContext();
  const isEdit = !!course;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: course || {
      title: "",
      description: "",
      duration: "",
      fee: "",
      image: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const courseData = {
        ...data,
        fee: parseFloat(data.fee),
      };

      if (isEdit) {
        updateCourse(course._id, courseData);
      } else {
        addCourse(courseData);
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-2xl flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            {isEdit ? "Edit Course" : "Add New Course"}
          </h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Course Title *</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Web Development"
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

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Description *</span>
            </label>
            <textarea
              placeholder="Course description..."
              className={`textarea textarea-bordered h-24 ${
                errors.description ? "textarea-error" : ""
              }`}
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Description must be at least 10 characters",
                },
              })}
            />
            {errors.description && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.description.message}
                </span>
              </label>
            )}
          </div>

          {/* Duration and Fee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Duration *</span>
              </label>
              <input
                type="text"
                placeholder="e.g., 3 মাস"
                className={`input input-bordered ${
                  errors.duration ? "input-error" : ""
                }`}
                {...register("duration", {
                  required: "Duration is required",
                })}
              />
              {errors.duration && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.duration.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Fee (৳) *</span>
              </label>
              <input
                type="number"
                placeholder="e.g., 5000"
                className={`input input-bordered ${
                  errors.fee ? "input-error" : ""
                }`}
                {...register("fee", {
                  required: "Fee is required",
                  min: { value: 0, message: "Fee must be positive" },
                })}
              />
              {errors.fee && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.fee.message}
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* Image URL */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Image URL *</span>
            </label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              className={`input input-bordered ${
                errors.image ? "input-error" : ""
              }`}
              {...register("image", {
                required: "Image URL is required",
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: "Invalid URL",
                },
              })}
            />
            {errors.image && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.image.message}
                </span>
              </label>
            )}
          </div>

          {/* Actions */}
          <div className="modal-action">
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
                  {isEdit ? "Update" : "Save"} Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
