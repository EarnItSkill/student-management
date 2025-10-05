import { Save, UserCheck, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAppContext } from "../../context/useAppContext";

const EnrollmentForm = ({ onClose, onSuccess }) => {
  const { students, batches, courses, enrollStudent } = useAppContext();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      studentId: "",
      batchId: "",
    },
  });

  const selectedBatchId = watch("batchId");
  const selectedBatch = batches.find((b) => b._id === selectedBatchId);
  // const selectedBatch = batches.find(
  //   (b) => b._id === parseInt(selectedBatchId)
  // );

  const selectedCourse = courses.find((c) => c._id === selectedBatch?.courseId);
  console.log(selectedCourse);

  const onSubmit = async (data) => {
    try {
      enrollStudent(data.studentId, data.batchId);
      // enrollStudent(parseInt(data.studentId), parseInt(data.batchId));
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error enrolling student:", error);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-2xl flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-primary" />
            Enroll Student
          </h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Student Selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Select Student *</span>
            </label>
            <select
              className={`select select-bordered ${
                errors.studentId ? "select-error" : ""
              }`}
              {...register("studentId", {
                required: "Student is required",
              })}
            >
              <option value="">Choose a student</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} - {student.email}
                </option>
              ))}
            </select>
            {errors.studentId && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.studentId.message}
                </span>
              </label>
            )}
          </div>

          {/* Batch Selection */}
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
              {batches.map((batch) => {
                const course = courses.find((c) => c._id === batch.courseId);
                const isFull = batch.enrolledStudents >= batch.totalSeats;
                return (
                  <option key={batch._id} value={batch._id} disabled={isFull}>
                    {batch.batchName} - {course?.title}
                    {isFull && " (Full)"}
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
          </div>

          {/* Batch Details */}
          {selectedBatch && (
            <div className="alert alert-info">
              <div>
                <h4 className="font-bold">Batch Details:</h4>
                <p className="text-sm">Course: {selectedCourse?.title}</p>
                <p className="text-sm">Schedule: {selectedBatch.schedule}</p>
                <p className="text-sm">
                  Available Seats:{" "}
                  {selectedBatch.totalSeats - selectedBatch.enrolledStudents}/
                  {selectedBatch.totalSeats}
                </p>
                <p className="text-sm">Fee: ৳{selectedCourse?.fee}</p>
              </div>
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Enrolling...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Enroll Student
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollmentForm;
