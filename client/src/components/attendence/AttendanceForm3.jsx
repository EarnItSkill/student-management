import { AlertCircle, Calendar, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAppContext } from "../../context/useAppContext";

const AttendanceForm = ({ onClose, onSuccess }) => {
  const { students, batches, enrollments, addAttendance, attendance } =
    useAppContext();
  const [duplicateWarning, setDuplicateWarning] = useState(null);

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
  const selectedDate = watch("date");

  // Get students enrolled in selected batch
  const enrolledStudents = selectedBatchId
    ? enrollments
        .filter((e) => e.batchId === selectedBatchId)
        .map((e) => students.find((s) => s._id === e.studentId))
        .filter(Boolean)
    : [];

  // Check for duplicate attendance
  useEffect(() => {
    if (selectedBatchId && selectedDate) {
      const isDuplicate = attendance.some(
        (record) =>
          record.batchId === selectedBatchId && record.date === selectedDate
      );

      if (isDuplicate) {
        const batch = batches.find((b) => b._id === selectedBatchId);
        setDuplicateWarning(
          `Attendance already marked for ${batch?.batchName} on ${new Date(
            selectedDate
          ).toLocaleDateString("en-GB")}`
        );
      } else {
        setDuplicateWarning(null);
      }
    } else {
      setDuplicateWarning(null);
    }
  }, [selectedBatchId, selectedDate, attendance, batches]);

  const onSubmit = async (data) => {
    try {
      // Double check for duplicates before saving
      const isDuplicate = attendance.some(
        (record) => record.batchId === data.batchId && record.date === data.date
      );

      if (isDuplicate) {
        alert("Attendance already marked for this batch on this date!");
        return;
      }

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
      <div className="modal-box max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b sticky top-0 bg-base-100 z-10">
          <div>
            <h3 className="font-bold text-2xl flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary" />
              Mark Attendance
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Record student attendance for today's class
            </p>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Batch and Date Selection */}
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Class Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Select Batch
                    </span>
                    <span className="label-text-alt text-error">*</span>
                  </label>
                  <select
                    className={`select select-bordered w-full ${
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
                    <span className="label-text font-semibold">Date</span>
                    <span className="label-text-alt text-error">*</span>
                  </label>
                  <input
                    type="date"
                    className={`input input-bordered w-full ${
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

              {/* Duplicate Warning */}
              {duplicateWarning && (
                <div className="alert alert-error mt-4">
                  <AlertCircle className="w-5 h-5" />
                  <div>
                    <div className="font-bold">Attendance Already Marked!</div>
                    <div className="text-sm">{duplicateWarning}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Student List */}
          {selectedBatchId && !duplicateWarning && (
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-lg flex items-center gap-2">
                    Students List
                    <span className="badge badge-primary">
                      {enrolledStudents.length}
                    </span>
                  </h4>
                  <span className="text-sm text-gray-600">
                    Check to mark present
                  </span>
                </div>

                {enrolledStudents.length === 0 ? (
                  <div className="alert alert-warning">
                    <AlertCircle className="w-5 h-5" />
                    <span>No students enrolled in this batch</span>
                  </div>
                ) : (
                  <div className="bg-base-100 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <div className="space-y-3">
                      {enrolledStudents.map((student) => (
                        <div
                          key={student._id}
                          className="flex items-center gap-3 bg-base-200 p-3 rounded-lg hover:bg-base-300 transition-colors"
                        >
                          <input
                            type="checkbox"
                            id={`student-${student._id}`}
                            className="checkbox checkbox-primary checkbox-lg"
                            defaultChecked
                          />
                          <label
                            htmlFor={`student-${student._id}`}
                            className="flex items-center gap-3 flex-1 cursor-pointer"
                          >
                            <div className="avatar">
                              <div className="w-10 h-10 rounded-full">
                                <img src={student.image} alt={student.name} />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold">
                                {student.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {student.email}
                              </div>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

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
              disabled={
                isSubmitting ||
                !selectedBatchId ||
                enrolledStudents.length === 0 ||
                !!duplicateWarning
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
