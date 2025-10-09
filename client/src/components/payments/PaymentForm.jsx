import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  DollarSign,
  Save,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAppContext } from "../../context/useAppContext";

// Import SearchableSelect from EnrollmentForm
import SearchableSelect from "../common/SearchableSelect"; // You'll need to move it to a common file

const PaymentForm = ({ payment, onClose, onSuccess }) => {
  const { students, batches, courses, payments, addPayment, updatePayment } =
    useAppContext();
  const isEdit = !!payment;

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: payment || {
      studentId: "",
      batchId: "",
      amount: "",
      method: "Cash",
      status: "pending",
    },
  });

  const selectedStudentId = watch("studentId");
  const selectedBatchId = watch("batchId");
  const selectedStatus = watch("status");

  // Prepare student options (sorted - latest first)
  const studentOptions = useMemo(() => {
    return [...students]
      .sort((a, b) => b._id.localeCompare(a._id))
      .map((student) => ({
        value: student._id,
        label: `${student.name} - ${student.email}`,
        data: student,
      }));
  }, [students]);

  // Prepare batch options (sorted - latest first)
  const batchOptions = useMemo(() => {
    return [...batches]
      .sort((a, b) => b._id.localeCompare(a._id))
      .map((batch) => {
        const course = courses.find((c) => c._id === batch.courseId);
        return {
          value: batch._id,
          label: `${batch.batchName} - ${course?.title}`,
          data: batch,
        };
      });
  }, [batches, courses]);

  const selectedBatch = batches.find((b) => b._id === selectedBatchId);
  const selectedCourse = courses.find((c) => c._id === selectedBatch?.courseId);
  const selectedStudent = students.find((s) => s._id === selectedStudentId);

  // Calculate payment details
  // const paymentDetails = useMemo(() => {
  //   if (!selectedStudentId || !selectedBatchId) {
  //     return null;
  //   }

  //   const totalFee = selectedBatch?.courseFee || 0;

  //   // Calculate total paid by this student for this batch
  //   const previousPayments = payments.filter(
  //     (p) =>
  //       p.studentId === selectedStudentId &&
  //       p.batchId === selectedBatchId &&
  //       (!isEdit || p._id !== payment._id) // Exclude current payment if editing
  //   );
  //   console.log(previousPayments);

  //   const totalPaid = previousPayments.reduce((sum, p) => sum + p.amount, 0);
  //   const remaining = totalFee - totalPaid;
  //   const isFullyPaid = remaining <= 0;

  //   return {
  //     totalFee,
  //     totalPaid,
  //     remaining: remaining > 0 ? remaining : 0,
  //     isFullyPaid,
  //     paymentCount: previousPayments.length,
  //   };
  // }, [
  //   selectedStudentId,
  //   selectedBatchId,
  //   selectedBatch,
  //   payments,
  //   isEdit,
  //   payment,
  // ]);

  const paymentDetails = useMemo(() => {
    if (!selectedStudentId || !selectedBatchId) {
      return null;
    }

    const totalFee = selectedBatch?.courseFee || 0;

    // Calculate total paid by this student for this batch
    const previousPayments = payments.filter((p) => {
      // Must match student and batch
      const matchesStudentAndBatch =
        p.studentId === selectedStudentId && p.batchId === selectedBatchId;

      // If editing, exclude current payment
      if (isEdit && payment?._id) {
        // return matchesStudentAndBatch && p._id !== payment._id;
        console.log(matchesStudentAndBatch, p._id !== payment._id);
        return matchesStudentAndBatch && p._id !== payment._id;
      }

      // If adding new payment, include all
      return matchesStudentAndBatch;
    });

    // console.log("Previous Payments:", previousPayments);
    // console.log("Is Edit Mode:", isEdit);
    // console.log("Current Payment ID:", payment?._id);

    const totalPaid = previousPayments.reduce((sum, p) => sum + p.amount, 0);
    const remaining = totalFee - totalPaid;
    const isFullyPaid = remaining <= 0;

    return {
      totalFee,
      totalPaid,
      remaining: remaining > 0 ? remaining : 0,
      isFullyPaid,
      paymentCount: previousPayments.length,
    };
  }, [
    selectedStudentId,
    selectedBatchId,
    selectedBatch,
    payments,
    isEdit,
    payment,
  ]);

  const onSubmit = async (data) => {
    try {
      const paymentData = {
        ...data,
        studentId: data.studentId,
        batchId: data.batchId,
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

  // Check if save should be disabled
  const isSaveDisabled =
    paymentDetails?.isFullyPaid && selectedStatus === "paid";

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b sticky top-0 bg-base-100 z-10">
          <div>
            <h3 className="font-bold text-2xl flex items-center gap-2">
              <DollarSign className="w-7 h-7 text-primary" />
              {isEdit ? "Edit Payment" : "Add New Payment"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Record student payment for batch enrollment
            </p>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Student Selection Section */}
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Select Student
              </h4>

              <Controller
                name="studentId"
                control={control}
                rules={{ required: "Student is required" }}
                render={({ field }) => (
                  <SearchableSelect
                    options={studentOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Choose a student"
                    renderOption={(option) => option.label}
                    error={errors.studentId?.message}
                    label="Student"
                    required
                  />
                )}
              />

              {/* Selected Student Info */}
              {selectedStudent && (
                <div className="alert alert-info mt-4">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-12 h-12 rounded-full">
                        <img
                          src={selectedStudent.image}
                          alt={selectedStudent.name}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{selectedStudent.name}</div>
                      <div className="text-sm">{selectedStudent.email}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Batch Selection Section */}
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Select Batch
              </h4>

              <Controller
                name="batchId"
                control={control}
                rules={{ required: "Batch is required" }}
                render={({ field }) => (
                  <SearchableSelect
                    options={batchOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Choose a batch"
                    renderOption={(option) => option.label}
                    error={errors.batchId?.message}
                    label="Batch"
                    required
                  />
                )}
              />
            </div>
          </div>

          {/* Payment Summary */}
          {paymentDetails && (
            <div
              className={`card shadow-lg border-2 ${
                paymentDetails.isFullyPaid
                  ? "bg-gradient-to-br from-success/10 to-success/5 border-success/30"
                  : "bg-gradient-to-br from-warning/10 to-warning/5 border-warning/30"
              }`}
            >
              <div className="card-body">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Payment Summary
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Total Fee */}
                  <div className="stat bg-base-100 rounded-lg shadow">
                    <div className="stat-figure text-primary">
                      <DollarSign className="w-8 h-8" />
                    </div>
                    <div className="stat-title">Total Fee</div>
                    <div className="stat-value text-primary text-2xl">
                      ৳{paymentDetails.totalFee}
                    </div>
                    <div className="stat-desc">{selectedCourse?.title}</div>
                  </div>

                  {/* Total Paid */}
                  <div className="stat bg-base-100 rounded-lg shadow">
                    <div className="stat-figure text-success">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <div className="stat-title">Total Paid</div>
                    <div className="stat-value text-success text-2xl">
                      ৳{paymentDetails.totalPaid}
                    </div>
                    <div className="stat-desc">
                      {paymentDetails.paymentCount} payment(s) made
                    </div>
                  </div>

                  {/* Remaining */}
                  <div className="stat bg-base-100 rounded-lg shadow">
                    <div className="stat-figure text-warning">
                      <AlertCircle className="w-8 h-8" />
                    </div>
                    <div className="stat-title">Remaining</div>
                    <div
                      className={`stat-value text-2xl ${
                        paymentDetails.remaining === 0
                          ? "text-success"
                          : "text-warning"
                      }`}
                    >
                      ৳{paymentDetails.remaining}
                    </div>
                    <div className="stat-desc">
                      {paymentDetails.isFullyPaid ? "Fully Paid ✓" : "Due"}
                    </div>
                  </div>
                </div>

                {/* Fully Paid Alert */}
                {paymentDetails.isFullyPaid && (
                  <div className="alert alert-success mt-4">
                    <CheckCircle className="w-5 h-5" />
                    <div>
                      <div className="font-bold">Payment Complete!</div>
                      <div className="text-sm">
                        This student has fully paid for this batch.
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Warning */}
                {!paymentDetails.isFullyPaid &&
                  paymentDetails.totalPaid > 0 && (
                    <div className="alert alert-warning mt-4">
                      <AlertCircle className="w-5 h-5" />
                      <div>
                        <div className="font-bold">Partial Payment</div>
                        <div className="text-sm">
                          ৳{paymentDetails.remaining} remaining to complete the
                          payment.
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Payment Details Section */}
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Payment Details
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Amount */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Amount (৳)</span>
                    <span className="label-text-alt text-error">*</span>
                  </label>
                  <Controller
                    name="amount"
                    control={control}
                    rules={{
                      required: "Amount is required",
                      min: { value: 1, message: "Amount must be positive" },
                      validate: (value) => {
                        if (paymentDetails && !isEdit) {
                          const total =
                            paymentDetails.totalPaid + parseFloat(value || 0);
                          if (total > paymentDetails.totalFee) {
                            return `Amount exceeds remaining balance (৳${paymentDetails.remaining})`;
                          }
                        }
                        return true;
                      },
                    }}
                    render={({ field }) => (
                      <>
                        <input
                          type="number"
                          placeholder="e.g., 5000"
                          className={`input input-bordered w-full ${
                            errors.amount ? "input-error" : ""
                          }`}
                          {...field}
                        />
                        {errors.amount && (
                          <label className="label">
                            <span className="label-text-alt text-error">
                              {errors.amount.message}
                            </span>
                          </label>
                        )}
                        {paymentDetails && (
                          <label className="label">
                            <span className="label-text-alt text-gray-500">
                              Max: ৳{paymentDetails.remaining}
                            </span>
                          </label>
                        )}
                      </>
                    )}
                  />
                </div>

                {/* Payment Method */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Payment Method
                    </span>
                    <span className="label-text-alt text-error">*</span>
                  </label>
                  <Controller
                    name="method"
                    control={control}
                    render={({ field }) => (
                      <select
                        className="select select-bordered w-full"
                        {...field}
                      >
                        <option value="Cash">Cash</option>
                        <option value="Bkash">Bkash</option>
                        <option value="Nagad">Nagad</option>
                        <option value="Bank">Bank Transfer</option>
                        <option value="Card">Card</option>
                      </select>
                    )}
                  />
                </div>
              </div>

              {/* Payment Status */}
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text font-semibold">
                    Payment Status
                  </span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <select
                      className="select select-bordered w-full"
                      {...field}
                    >
                      <option value="paid">Paid (Full)</option>
                      <option value="partial">Partial</option>
                      <option value="pending">Pending</option>
                    </select>
                  )}
                />
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
              disabled={isSubmitting || isSaveDisabled}
              title={
                isSaveDisabled ? "Payment already complete for this batch" : ""
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
