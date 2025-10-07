import { Calendar, Clock, GraduationCap, Save, Users, X } from "lucide-react";
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
      startDate: "",
      endDate: "",
      scheduleType: "",
      startTime: "",
      totalSeats: 20,
    },
  });

  const onSubmit = async (data) => {
    try {
      const batchData = {
        ...data,
        totalSeats: parseInt(data.totalSeats),
        enrolledStudents: batch?.enrolledStudents || 0,
        instructor: "মো. মোজাম্মেল হক",
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
      <div className="modal-box max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b sticky top-0 bg-base-100 z-10">
          <div>
            <h3 className="font-bold text-2xl flex items-center gap-2">
              <GraduationCap className="w-7 h-7 text-primary" />
              {isEdit ? "Edit Batch" : "Add New Batch"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {isEdit
                ? "Update batch information"
                : "Create a new batch for students"}
            </p>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information Section */}
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                Basic Information
              </h4>

              <div className="grid grid-cols-1 gap-4">
                {/* Batch Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Batch Name</span>
                    <span className="label-text-alt text-error">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., সকাল ব্যাচ - ২০২৫"
                    className={`input input-bordered w-full ${
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
                    <span className="label-text font-semibold">
                      Select Course
                    </span>
                    <span className="label-text-alt text-error">*</span>
                  </label>
                  <select
                    className={`select select-bordered w-full ${
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
              </div>
            </div>
          </div>

          {/* Schedule Information Section */}
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Schedule Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Date */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Start Date</span>
                    <span className="label-text-alt text-error">*</span>
                  </label>
                  <input
                    type="date"
                    className={`input input-bordered w-full ${
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

                {/* End Date */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">End Date</span>
                    <span className="label-text-alt text-error">*</span>
                  </label>
                  <input
                    type="date"
                    className={`input input-bordered w-full ${
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

                {/* Schedule Type */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Class Schedule
                    </span>
                    <span className="label-text-alt text-error">*</span>
                  </label>
                  <select
                    className={`select select-bordered w-full ${
                      errors.scheduleType ? "select-error" : ""
                    }`}
                    {...register("scheduleType", {
                      required: "Schedule type is required",
                    })}
                  >
                    <option value="">Choose schedule</option>
                    <option value="SIX_DAYS">সপ্তাহে ৬ দিন (শনি-বৃহ)</option>
                    <option value="THREE_DAYS_A">৩ দিন (শনি, সোম, বুধ)</option>
                    <option value="THREE_DAYS_B">
                      ৩ দিন (রবি, মঙ্গল, বৃহ)
                    </option>
                    <option value="WEEKEND">সপ্তাহান্তে (শুক্র, শনি)</option>
                    <option value="CUSTOM">কাস্টম শিডিউল</option>
                  </select>
                  {errors.scheduleType && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.scheduleType.message}
                      </span>
                    </label>
                  )}
                </div>

                {/* Start Time */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Class Time</span>
                    <span className="label-text-alt text-error">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      className={`input input-bordered w-full pr-10 ${
                        errors.startTime ? "input-error" : ""
                      }`}
                      {...register("startTime", {
                        required: "Start time is required",
                      })}
                    />
                    <Clock className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.startTime && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.startTime.message}
                      </span>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Capacity Section */}
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Batch Capacity
              </h4>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Total Seats</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g., 20"
                  className={`input input-bordered w-full ${
                    errors.totalSeats ? "input-error" : ""
                  }`}
                  {...register("totalSeats", {
                    required: "Total seats is required",
                    min: { value: 1, message: "Must be at least 1 seat" },
                    max: { value: 100, message: "Cannot exceed 100 seats" },
                    valueAsNumber: true,
                  })}
                />
                {errors.totalSeats && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.totalSeats.message}
                    </span>
                  </label>
                )}
                <label className="label">
                  <span className="label-text-alt text-gray-500">
                    Maximum number of students allowed in this batch
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 sticky bottom-0 bg-base-100 pt-4 border-t">
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
                  {isEdit ? "Update" : "Create"} Batch
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
