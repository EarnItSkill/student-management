import { GraduationCap, Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAppContext } from "../../context/useAppContext";

const BatchForm = ({ batch, onClose, onSuccess }) => {
  const { courses, addBatch, updateBatch } = useAppContext();
  const isEdit = !!batch;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: batch || {
      batchName: "",
      courseId: "",
      batchCategory: "",
      startDate: "",
      endDate: "",
      schedule: "",
      totalSeats: 20,
    },
  });

  const onSubmit = async (data) => {
    try {
      const batchData = {
        ...data,
        courseId: data.courseId,
        totalSeats: parseInt(data.totalSeats),
        enrolledStudents: 0,
      };

      if (isEdit) {
        updateBatch(batch._id, batchData);
      } else {
        addBatch(batchData);
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error saving batch:", error);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-2xl flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary" />
            {isEdit ? "Edit Batch" : "Add New Batch"}
          </h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Batch Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Batch Name *</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Batch A - Web Development"
              className={`input input-bordered ${
                errors.batchName ? "input-error" : ""
              }`}
              {...register("batchName", {
                required: "Batch name is required",
                minLength: {
                  value: 3,
                  message: "Batch name must be at least 3 characters",
                },
              })}
            />
            {errors.batchName && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.batchName.message}
                </span>
              </label>
            )}
          </div>

          {/* Course Selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Select Course *</span>
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

          {/* Batch Category */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Batch Category *</span>
            </label>
            <select
              className={`select select-bordered ${
                errors.batchCategory ? "select-error" : ""
              }`}
              {...register("batchCategory", {
                required: "Batch category is required",
              })}
            >
              <option value="">Choose a category</option>
              <option value="ict">ICT</option>
              <option value="excel">Excel</option>
              <option value="office">Office</option>
            </select>
            {errors.batchCategory && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.batchCategory.message}
                </span>
              </label>
            )}
          </div>

          {/* Start and End Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Start Date *</span>
              </label>
              <input
                type="date"
                className={`input input-bordered ${
                  errors.startDate ? "input-error" : ""
                }`}
                {...register("startDate", {
                  required: "Start date is required",
                })}
              />
              {errors.startDate && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.startDate.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">End Date *</span>
              </label>
              <input
                type="date"
                className={`input input-bordered ${
                  errors.endDate ? "input-error" : ""
                }`}
                {...register("endDate", {
                  required: "End date is required",
                })}
              />
              {errors.endDate && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.endDate.message}
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* Schedule */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Schedule *</span>
            </label>
            <input
              type="text"
              placeholder="e.g., শনি - মঙ্গল (সকাল ১০টা - ১২টা)"
              className={`input input-bordered ${
                errors.schedule ? "input-error" : ""
              }`}
              {...register("schedule", {
                required: "Schedule is required",
              })}
            />
            {errors.schedule && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.schedule.message}
                </span>
              </label>
            )}
          </div>

          {/* Total Seats */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Total Seats *</span>
            </label>
            <input
              type="number"
              placeholder="e.g., 20"
              className={`input input-bordered ${
                errors.totalSeats ? "input-error" : ""
              }`}
              {...register("totalSeats", {
                required: "Total seats is required",
                min: { value: 1, message: "Must be at least 1 seat" },
                max: { value: 100, message: "Cannot exceed 100 seats" },
              })}
            />
            {errors.totalSeats && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.totalSeats.message}
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
                  {isEdit ? "Update" : "Save"} Batch
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BatchForm;
