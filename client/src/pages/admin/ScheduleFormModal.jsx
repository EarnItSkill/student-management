// =====================================================
// FILE: src/components/admin/ScheduleFormModal.jsx
// =====================================================
import { Calendar, Save, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useAppContext } from "../../context/useAppContext";

const ScheduleFormModal = ({ schedule, onClose, availableChapters }) => {
  const { batches, courses, createSchedule, updateSchedule } = useAppContext();
  const isEdit = !!schedule;

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: schedule || {
      batchId: "",
      chapter: "",
      startDate: "",
      endDate: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await updateSchedule(schedule._id, data);
      } else {
        await createSchedule(data);
      }
      onClose();
    } catch (error) {
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert("Schedule save করতে সমস্যা হয়েছে");
      }
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <div>
            <h3 className="font-bold text-2xl flex items-center gap-2">
              <Calendar className="w-7 h-7 text-primary" />
              {isEdit ? "Edit Schedule" : "Create New Schedule"}
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Set quiz availability dates for a chapter
            </p>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Batch Selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Select Batch</span>
              <span className="label-text-alt text-error">*</span>
            </label>
            <Controller
              name="batchId"
              control={control}
              rules={{ required: "Batch is required" }}
              render={({ field }) => (
                <>
                  <select
                    className={`select select-bordered w-full ${
                      errors.batchId ? "select-error" : ""
                    }`}
                    {...field}
                    disabled={isEdit}
                  >
                    <option value="">Choose a batch</option>
                    {batches.map((batch) => {
                      const course = courses.find(
                        (c) => c._id === batch.courseId
                      );
                      return (
                        <option key={batch._id} value={batch._id}>
                          {batch.batchName} - {course?.title}
                        </option>
                      );
                    })}
                  </select>
                  {errors.batchId && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.batchId.message}
                      </span>
                    </label>
                  )}
                </>
              )}
            />
          </div>

          {/* Chapter Selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Select Chapter</span>
              <span className="label-text-alt text-error">*</span>
            </label>
            <Controller
              name="chapter"
              control={control}
              rules={{ required: "Chapter is required" }}
              render={({ field }) => (
                <>
                  <select
                    className={`select select-bordered w-full ${
                      errors.chapter ? "select-error" : ""
                    }`}
                    {...field}
                    disabled={isEdit}
                  >
                    <option value="">Choose a chapter</option>
                    {availableChapters.map((chapter) => (
                      <option key={chapter} value={chapter}>
                        Chapter {chapter}
                      </option>
                    ))}
                  </select>
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

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Start Date</span>
                <span className="label-text-alt text-error">*</span>
              </label>
              <Controller
                name="startDate"
                control={control}
                rules={{
                  required: "Start date is required",
                }}
                render={({ field }) => (
                  <>
                    <input
                      type="date"
                      className={`input input-bordered w-full ${
                        errors.startDate ? "input-error" : ""
                      }`}
                      {...field}
                    />
                    {errors.startDate && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.startDate.message}
                        </span>
                      </label>
                    )}
                  </>
                )}
              />
            </div>

            {/* End Date */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">End Date</span>
                <span className="label-text-alt text-error">*</span>
              </label>
              <Controller
                name="endDate"
                control={control}
                rules={{
                  required: "End date is required",
                  validate: (value, formValues) => {
                    if (formValues.startDate && value <= formValues.startDate) {
                      return "End date must be after start date";
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <>
                    <input
                      type="date"
                      className={`input input-bordered w-full ${
                        errors.endDate ? "input-error" : ""
                      }`}
                      {...field}
                    />
                    {errors.endDate && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.endDate.message}
                        </span>
                      </label>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          {/* Info Alert */}
          <div className="alert alert-info">
            <div>
              <p className="text-sm">
                <strong>Note:</strong> Students will be able to attempt the quiz
                only during this date range. Make sure to set appropriate dates.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
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
                  {isEdit ? "Update" : "Create"} Schedule
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleFormModal;
