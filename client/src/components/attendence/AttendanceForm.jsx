import { Calendar, Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAppContext } from "../../context/useAppContext";

const AttendanceForm = ({ onClose, onSuccess }) => {
  const { students, batches, enrollments, addAttendance } = useAppContext();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      batchId: "",
      date: new Date().toISOString().split("T")[0],
      studentAttendance: [],
    },
  });

  const selectedBatchId = watch("batchId");

  // Get students enrolled in selected batch
  const enrolledStudents = selectedBatchId
    ? enrollments
        .filter((e) => e.batchId === selectedBatchId)
        .map((e) => students.find((s) => s._id === e.studentId))
        .filter(Boolean)
    : [];

  const onSubmit = async (data) => {
    try {
      // Create attendance records for each student
      const attendanceRecords = enrolledStudents.map((student) => {
        const checkbox = document.getElementById(`student-${student._id}`);
        return {
          studentId: student._id,
          batchId: data.batchId,
          date: data.date,
          status: checkbox?.checked ? "present" : "absent",
        };
      });

      // Save all attendance records
      attendanceRecords.forEach((record) => {
        addAttendance(record);
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error saving attendance:", error);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-3xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-2xl flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            Mark Attendance
          </h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Batch and Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Select Batch *</span>
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
                <span className="label-text font-semibold">Date *</span>
              </label>
              <input
                type="date"
                className={`input input-bordered ${
                  errors.date ? "input-error" : ""
                }`}
                {...register("date", {
                  required: "Date is required",
                })}
              />
              {errors.date && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.date.message}
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* Student List */}
          {selectedBatchId && (
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Students ({enrolledStudents.length})
                </span>
                <span className="label-text-alt text-gray-500">
                  Check to mark present
                </span>
              </label>

              {enrolledStudents.length === 0 ? (
                <div className="alert alert-warning">
                  <span>No students enrolled in this batch</span>
                </div>
              ) : (
                <div className="bg-base-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <div className="space-y-3">
                    {enrolledStudents.map((student) => (
                      <div
                        key={student._id}
                        className="flex items-center gap-3 bg-base-100 p-3 rounded-lg"
                      >
                        <input
                          type="checkbox"
                          id={`student-${student._id}`}
                          className="checkbox checkbox-primary"
                          defaultChecked
                        />
                        <div className="avatar">
                          <div className="w-10 h-10 rounded-full">
                            <img src={student.image} alt={student.name} />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{student.name}</div>
                          <div className="text-sm text-gray-500">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

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
              disabled={
                isSubmitting ||
                !selectedBatchId ||
                enrolledStudents.length === 0
              }
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Attendance
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttendanceForm;
