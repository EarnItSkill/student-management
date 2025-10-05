import { DollarSign, Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAppContext } from "../../context/useAppContext";

const PaymentForm = ({ payment, onClose, onSuccess }) => {
  const { students, batches, addPayment, updatePayment } = useAppContext();
  const isEdit = !!payment;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: payment || {
      studentId: "",
      batchId: "",
      amount: "",
      method: "Cash",
      status: "paid",
    },
  });

  const onSubmit = async (data) => {
    try {
      const paymentData = {
        ...data,
        // studentId: parseInt(data.studentId),
        studentId: data.studentId,
        batchId: data.batchId,
        // batchId: parseInt(data.batchId),
        amount: parseFloat(data.amount),
        paymentDate: new Date().toISOString().split("T")[0],
      };

      if (isEdit) {
        updatePayment(payment._id, paymentData);
      } else {
        addPayment(paymentData);
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error saving payment:", error);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-2xl flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-primary" />
            {isEdit ? "Edit Payment" : "Add New Payment"}
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

          {/* Amount and Method */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Amount (৳) *</span>
              </label>
              <input
                type="number"
                placeholder="e.g., 5000"
                className={`input input-bordered ${
                  errors.amount ? "input-error" : ""
                }`}
                {...register("amount", {
                  required: "Amount is required",
                  min: { value: 0, message: "Amount must be positive" },
                })}
              />
              {errors.amount && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.amount.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Payment Method *
                </span>
              </label>
              <select
                className="select select-bordered"
                {...register("method")}
              >
                <option value="Cash">Cash</option>
                <option value="Bkash">Bkash</option>
                <option value="Nagad">Nagad</option>
                <option value="Bank">Bank Transfer</option>
                <option value="Card">Card</option>
              </select>
            </div>
          </div>

          {/* Payment Status */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Payment Status *</span>
            </label>
            <select className="select select-bordered" {...register("status")}>
              <option value="paid">Paid (Full)</option>
              <option value="partial">Partial</option>
              <option value="pending">Pending</option>
            </select>
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
                  {isEdit ? "Update" : "Save"} Payment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
