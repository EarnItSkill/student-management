import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAppContext } from "../../context/useAppContext";

export default function PaymentForm() {
  const { addPaymentInfo, currentUser } = useAppContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      studentName: "",
      studentId: "",
      studentMobile: "",
      batchId: "",
      bkashNo: "",
      txId: "",
      payAmount: "",
      stuUid: "",
    },
  });

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const now = new Date();
      const submissionData = {
        ...data,
        timestamp: now.toLocaleString("bn-BD"),
        success: true,
        stuUid: currentUser?._id,
      };
      console.log(submissionData);

      // API-তে ডাটা পাঠানো
      const result = await addPaymentInfo(submissionData);

      setSuccessMessage("পেমেন্ট তথ্য সফলভাবে সংরক্ষণ হয়েছে!");
      setSubmitted(true);
      console.log("Submitted Data:", result);

      // ৩ সেকেন্ড পর reset করা
      setTimeout(() => {
        setSubmitted(false);
        reset();
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("ত্রুটি:", error);

      // এরর মেসেজ হ্যান্ডল করা
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.response?.status === 400) {
        setErrorMessage(
          "এই তথ্য দিয়ে ইতিমধ্যে একটি পেমেন্ট রেকর্ড আছে। একবারই পেমেন্ট করা যায়।"
        );
      } else {
        setErrorMessage("পেমেন্ট সংরক্ষণে ত্রুটি হয়েছে। পুনরায় চেষ্টা করুন।");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="rounded-lg shadow-2xl border border-slate-700 bg-slate-800 p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">
            শিক্ষার্থী পেমেন্ট তথ্য ফর্ম
          </h1>
          <p className="text-slate-400 mb-6">আপনার তথ্য প্রদান করুন</p>

          {/* সাফল্য মেসেজ */}
          {submitted && successMessage && (
            <div className="mb-6 bg-green-900/30 border border-green-600 rounded-lg p-4 flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0 h-6 w-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-green-400">{successMessage}</span>
            </div>
          )}

          {/* এরর মেসেজ */}
          {errorMessage && (
            <div className="mb-6 bg-red-900/30 border border-red-600 rounded-lg p-4 flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0 h-6 w-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-red-400">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Student Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Student Name
              </label>
              <input
                type="text"
                placeholder="শিক্ষার্থীর নাম"
                className={`w-full px-4 py-2 rounded-lg bg-slate-700 text-white border ${
                  errors.studentName ? "border-red-500" : "border-slate-600"
                } focus:outline-none focus:border-blue-500 transition disabled:opacity-50`}
                disabled={isLoading}
                {...register("studentName", {
                  required: "Student Name আবশ্যক",
                  minLength: {
                    value: 3,
                    message: "নাম কমপক্ষে 3 অক্ষর হতে হবে",
                  },
                })}
              />
              {errors.studentName && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.studentName.message}
                </p>
              )}
            </div>

            {/* Grid for Student ID and Student Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Student ID */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Student ID
                </label>
                <input
                  type="text"
                  placeholder="যেমন: STU001"
                  className={`w-full px-4 py-2 rounded-lg bg-slate-700 text-white border ${
                    errors.studentId ? "border-red-500" : "border-slate-600"
                  } focus:outline-none focus:border-blue-500 transition disabled:opacity-50`}
                  disabled={isLoading}
                  {...register("studentId", {
                    required: "Student ID আবশ্যক",
                  })}
                />
                {errors.studentId && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.studentId.message}
                  </p>
                )}
              </div>

              {/* Student Mobile */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Student Mobile
                </label>
                <input
                  type="tel"
                  placeholder="যেমন: 01700000000"
                  className={`w-full px-4 py-2 rounded-lg bg-slate-700 text-white border ${
                    errors.studentMobile ? "border-red-500" : "border-slate-600"
                  } focus:outline-none focus:border-blue-500 transition disabled:opacity-50`}
                  disabled={isLoading}
                  {...register("studentMobile", {
                    required: "Student Mobile আবশ্যক",
                    pattern: {
                      value: /^01\d{9}$/,
                      message: "সঠিক মোবাইল নম্বর প্রদান করুন (01 দিয়ে শুরু)",
                    },
                  })}
                />
                {errors.studentMobile && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.studentMobile.message}
                  </p>
                )}
              </div>
            </div>

            {/* Grid for Batch ID and Bkash No */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Batch ID */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Batch ID
                </label>
                <input
                  type="text"
                  placeholder="যেমন: B2024"
                  className={`w-full px-4 py-2 rounded-lg bg-slate-700 text-white border ${
                    errors.batchId ? "border-red-500" : "border-slate-600"
                  } focus:outline-none focus:border-blue-500 transition disabled:opacity-50`}
                  disabled={isLoading}
                  {...register("batchId", {
                    required: "Batch ID আবশ্যক",
                  })}
                />
                {errors.batchId && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.batchId.message}
                  </p>
                )}
              </div>

              {/* Bkash No */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Bkash No
                </label>
                <input
                  type="tel"
                  placeholder="যেমন: 01700000000"
                  className={`w-full px-4 py-2 rounded-lg bg-slate-700 text-white border ${
                    errors.bkashNo ? "border-red-500" : "border-slate-600"
                  } focus:outline-none focus:border-blue-500 transition disabled:opacity-50`}
                  disabled={isLoading}
                  {...register("bkashNo", {
                    required: "Bkash No আবশ্যক",
                    pattern: {
                      value: /^01\d{9}$/,
                      message: "সঠিক Bkash নম্বর প্রদান করুন (01 দিয়ে শুরু)",
                    },
                  })}
                />
                {errors.bkashNo && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.bkashNo.message}
                  </p>
                )}
              </div>
            </div>

            {/* Grid for TxId and Pay Amount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* TxId */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  TxId
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ABC123XYZ"
                  className={`w-full px-4 py-2 rounded-lg bg-slate-700 text-white border ${
                    errors.txId ? "border-red-500" : "border-slate-600"
                  } focus:outline-none focus:border-blue-500 transition disabled:opacity-50`}
                  disabled={isLoading}
                  {...register("txId", {
                    required: "TxId আবশ্যক",
                    minLength: {
                      value: 5,
                      message: "TxId কমপক্ষে 5 অক্ষর হতে হবে",
                    },
                  })}
                />
                {errors.txId && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.txId.message}
                  </p>
                )}
              </div>

              {/* Pay Amount */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Pay Amount (টাকা)
                </label>
                <input
                  type="number"
                  placeholder="যেমন: 5000"
                  className={`w-full px-4 py-2 rounded-lg bg-slate-700 text-white border ${
                    errors.payAmount ? "border-red-500" : "border-slate-600"
                  } focus:outline-none focus:border-blue-500 transition disabled:opacity-50`}
                  disabled={isLoading}
                  {...register("payAmount", {
                    required: "Pay Amount আবশ্যক",
                    min: {
                      value: 1,
                      message: "পরিমাণ 0 এর চেয়ে বেশি হতে হবে",
                    },
                  })}
                />
                {errors.payAmount && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.payAmount.message}
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full"></span>
                    পাঠাচ্ছে...
                  </>
                ) : (
                  "জমা করুন"
                )}
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  reset();
                  setErrorMessage("");
                }}
                className="flex-1 px-6 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-slate-200 font-semibold rounded-lg transition border border-slate-600"
              >
                রিসেট
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
