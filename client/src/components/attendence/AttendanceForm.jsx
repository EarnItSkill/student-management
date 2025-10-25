import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Save,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAppContext } from "../../context/useAppContext";

const AttendanceForm = ({ attendance: editAttendance, onClose, onSuccess }) => {
  const {
    students,
    batches,
    enrollments,
    addAttendance,
    updateAttendance,
    attendance,
  } = useAppContext();
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [checkedCount, setCheckedCount] = useState(0);
  const [dateValidation, setDateValidation] = useState(null);

  const isEdit = !!editAttendance;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: isEdit
      ? {
          batchId: editAttendance.batchId,
          date: editAttendance.date,
          studentAttendance: [],
        }
      : {
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

  // Get selected batch details
  const selectedBatch = batches.find((b) => b._id === selectedBatchId);

  // Validate date based on schedule type
  const validateDate = (date, scheduleType) => {
    const dayOfWeek = new Date(date).getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday

    // Friday is always off
    if (dayOfWeek === 5) {
      return "শুক্রবার বন্ধ থাকে। অন্য দিন নির্বাচন করুন।";
    }

    switch (scheduleType) {
      case "SIX_DAYS":
        // Saturday to Thursday (0=Sunday not allowed, 6=Saturday allowed, 1-4 allowed)
        if (dayOfWeek === 0) {
          return "এই ব্যাচে রবিবার ক্লাস নেই। শনিবার-বৃহস্পতিবার নির্বাচন করুন।";
        }
        return null;

      case "THREE_DAYS_A":
        // Saturday(6), Monday(1), Wednesday(3)
        if (![6, 1, 3].includes(dayOfWeek)) {
          return "এই ব্যাচে শুধু শনিবার, সোমবার ও বুধবার ক্লাস আছে।";
        }
        return null;

      case "THREE_DAYS_B":
        // Sunday(0), Tuesday(2), Thursday(4)
        if (![0, 2, 4].includes(dayOfWeek)) {
          return "এই ব্যাচে শুধু রবিবার, মঙ্গলবার ও বৃহস্পতিবার ক্লাস আছে।";
        }
        return null;

      default:
        return null;
    }
  };

  // Check date validation
  useEffect(() => {
    if (selectedBatchId && selectedDate && selectedBatch) {
      const validation = validateDate(selectedDate, selectedBatch.scheduleType);
      setDateValidation(validation);
    } else {
      setDateValidation(null);
    }
  }, [selectedBatchId, selectedDate, selectedBatch]);

  // Check for duplicate attendance
  useEffect(() => {
    if (selectedBatchId && selectedDate && !isEdit) {
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
  }, [selectedBatchId, selectedDate, attendance, batches, isEdit]);

  // Set initial checked status for edit mode
  useEffect(() => {
    if (isEdit && editAttendance) {
      // Set checkbox checked status
      setTimeout(() => {
        const checkbox = document.getElementById(
          `student-${editAttendance.studentId}`
        );
        if (checkbox) {
          checkbox.checked = editAttendance.status === "present";
          updateCheckedCount();
        }
      }, 100);
    }
  }, [isEdit, editAttendance, enrolledStudents]);

  // Update checked count
  const updateCheckedCount = () => {
    const checkboxes = document.querySelectorAll('input[id^="student-"]');
    const count = Array.from(checkboxes).filter((cb) => cb.checked).length;
    setCheckedCount(count);
  };

  // Initialize checked count
  useEffect(() => {
    if (enrolledStudents.length > 0 && !isEdit) {
      setCheckedCount(enrolledStudents.length);
    }
  }, [enrolledStudents, isEdit]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        // Update single attendance record
        const checkbox = document.getElementById(
          `student-${editAttendance.studentId}`
        );
        const updatedRecord = {
          ...editAttendance,
          status: checkbox?.checked ? "present" : "absent",
          date: data.date,
        };

        updateAttendance(editAttendance._id, updatedRecord);
      } else {
        // Double check for duplicates before saving
        const isDuplicate = attendance.some(
          (record) =>
            record.batchId === data.batchId && record.date === data.date
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
      }

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
              {isEdit ? "Edit Attendance" : "Mark Attendance"}
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              {isEdit
                ? "Update student attendance record"
                : "Record student attendance for today's class"}
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
                    disabled={isEdit}
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
                      errors.date || dateValidation ? "input-error" : ""
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

              {/* Schedule Type Info */}
              {selectedBatch && (
                <div className="alert alert-info mt-4">
                  <AlertCircle className="w-5 h-5" />
                  <div>
                    <div className="font-bold">Class Schedule:</div>
                    <div className="text-sm">
                      {selectedBatch.scheduleType === "SIX_DAYS" &&
                        "শনিবার - বৃহস্পতিবার (৬ দিন)"}
                      {selectedBatch.scheduleType === "THREE_DAYS_A" &&
                        "শনিবার, সোমবার, বুধবার (৩ দিন)"}
                      {selectedBatch.scheduleType === "THREE_DAYS_B" &&
                        "রবিবার, মঙ্গলবার, বৃহস্পতিবার (৩ দিন)"}
                      {" - শুক্রবার বন্ধ"}
                    </div>
                  </div>
                </div>
              )}

              {/* Date Validation Error */}
              {dateValidation && (
                <div className="alert alert-error mt-4">
                  <AlertCircle className="w-5 h-5" />
                  <div>
                    <div className="font-bold">Invalid Date!</div>
                    <div className="text-sm">{dateValidation}</div>
                  </div>
                </div>
              )}

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
          {selectedBatchId && !duplicateWarning && !dateValidation && (
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-lg flex items-center gap-2">
                    Students List
                    <span className="badge badge-primary">
                      {enrolledStudents.length}
                    </span>
                  </h4>
                  <span className="text-sm text-gray-400">
                    Check to mark present
                  </span>
                </div>

                {/* Attendance Summary */}
                {enrolledStudents.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="stat bg-base-100 rounded-lg shadow p-3">
                      <div className="stat-title text-xs">Total</div>
                      <div className="stat-value text-2xl text-primary">
                        {enrolledStudents.length}
                      </div>
                    </div>
                    <div className="stat bg-base-100 rounded-lg shadow p-3">
                      <div className="stat-title text-xs flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Present
                      </div>
                      <div className="stat-value text-2xl text-success">
                        {checkedCount}
                      </div>
                    </div>
                    <div className="stat bg-base-100 rounded-lg shadow p-3">
                      <div className="stat-title text-xs flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Absent
                      </div>
                      <div className="stat-value text-2xl text-error">
                        {enrolledStudents.length - checkedCount}
                      </div>
                    </div>
                  </div>
                )}

                {enrolledStudents.length === 0 ? (
                  <div className="alert alert-warning">
                    <AlertCircle className="w-5 h-5" />
                    <span>No students enrolled in this batch</span>
                  </div>
                ) : isEdit ? (
                  // Edit mode - show only single student
                  <div className="bg-base-100 rounded-lg p-4">
                    {(() => {
                      const student = students.find(
                        (s) => s._id === editAttendance.studentId
                      );
                      return (
                        <div className="flex items-center gap-3 bg-base-200 p-3 rounded-lg">
                          <input
                            type="checkbox"
                            id={`student-${student._id}`}
                            className="checkbox checkbox-primary checkbox-lg"
                            defaultChecked={editAttendance.status === "present"}
                            onChange={updateCheckedCount}
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
                      );
                    })()}
                  </div>
                ) : (
                  // Add mode - show all students
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
                            onChange={updateCheckedCount}
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
                !!duplicateWarning ||
                !!dateValidation
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
                  {isEdit ? "Update" : "Save"} Attendance
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
