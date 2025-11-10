import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppContext } from "../../context/useAppContext";

export default function VerifiedStudentInfo() {
  const { paymentInfo, batches, addPayment, enrollStudent, patchPaymentInfo } =
    useAppContext();

  const [verifiedStudents, setVerifiedStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // isOk: "yes" এমন সকল শিক্ষার্থী ফিল্টার করা
    const verified =
      paymentInfo?.filter((payment) => payment.isOk === "yes") || [];
    setVerifiedStudents(verified);
  }, [paymentInfo]);

  // সার্চ ফিল্টার
  const filteredStudents = verifiedStudents.filter(
    (payment) =>
      payment.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.batchId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.studentMobile?.includes(searchTerm)
  );

  const initializeStudent = (paymentId) => {
    if (!selectedStudents[paymentId]) {
      setSelectedStudents((prev) => ({
        ...prev,
        [paymentId]: {
          paid: false,
          enrolled: false,
        },
      }));
    }
  };

  const handlePaidChange = (paymentId) => {
    initializeStudent(paymentId);
    setSelectedStudents((prev) => ({
      ...prev,
      [paymentId]: {
        ...prev[paymentId],
        paid: !prev[paymentId].paid,
      },
    }));
  };

  const handleEnrolledChange = (paymentId, isPaid) => {
    // Enrolled শুধুমাত্র enable হবে যদি Paid checked থাকে
    if (!isPaid) {
      setErrorMessage("প্রথমে 'Paid' চেকবক্স চেক করুন");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    initializeStudent(paymentId);
    setSelectedStudents((prev) => ({
      ...prev,
      [paymentId]: {
        ...prev[paymentId],
        enrolled: !prev[paymentId].enrolled,
      },
    }));
  };

  const getBatchIdFromPayment = (payment) => {
    const matchedBatch = batches?.find(
      (batch) => batch.sBatchId === payment.batchId
    );
    return matchedBatch?._id || null;
  };

  const handleSubmit = async (payment, isPaid, isEnrolled) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const batchId = getBatchIdFromPayment(payment);

      if (!batchId) {
        throw new Error("ব্যাচ খুঁজে পাওয়া যায়নি");
      }

      // Paid সাবমিট করা
      if (isPaid && payment.paid === "no") {
        const paymentData = {
          studentId: payment.stuUid,
          batchId: batchId,
          amount: Number(payment.payAmount),
          method: "Bkash",
          status: "paid",
          paymentDate: payment.createdAt,
        };
        console.log(payment._id);
        await addPayment(paymentData);
        await patchPaymentInfo(payment._id, { paid: "yes" });
      }

      // Enroll সাবমিট করা
      if (isEnrolled && payment.enroll === "no") {
        const courseId = batches?.find(
          (batch) => batch.sBatchId === payment.batchId
        )?.courseId;

        await enrollStudent(payment.stuUid, batchId, courseId);
        await patchPaymentInfo(payment._id, { enroll: "yes" });
      }

      setSuccessMessage("সফলভাবে সম্পন্ন হয়েছে");

      // সিলেকশন রিসেট করা
      setSelectedStudents((prev) => ({
        ...prev,
        [payment._id]: {
          paid: false,
          enrolled: false,
        },
      }));

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("ত্রুটি:", error);
      setErrorMessage(
        error.message || "কোন ত্রুটি ঘটেছে। পুনরায় চেষ্টা করুন।"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* শিরোনাম */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
            যাচাইকৃত শিক্ষার্থী এনরোলমেন্ট
          </h1>
          <p className="text-slate-400">
            পেমেন্ট রেকর্ড এবং এনরোলমেন্ট সম্পন্ন করুন
          </p>
        </div>

        {/* সফলতা মেসেজ */}
        {successMessage && (
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

        {/* সার্চ বার */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="নাম, Student ID, Batch ID বা মোবাইল দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* টেবিল */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              কোন যাচাইকৃত শিক্ষার্থী পাওয়া যায়নি
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700 border-b border-slate-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200">
                      শিক্ষার্থীর নাম
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200">
                      Student ID
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200">
                      Batch ID
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-slate-200">
                      Paid
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-slate-200">
                      Enroll
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200">
                      অ্যাকশন
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((payment, idx) => {
                    const studentSelection = selectedStudents[payment._id] || {
                      paid: false,
                      enrolled: false,
                    };
                    const isPaidAlready = payment.paid === "yes";
                    const isEnrolledAlready = payment.enroll === "yes";

                    return (
                      <tr
                        key={payment._id}
                        className={`border-b border-slate-700 ${
                          idx % 2 === 0 ? "bg-slate-800" : "bg-slate-750"
                        } hover:bg-slate-700 transition`}
                      >
                        <td className="px-4 py-3 text-sm text-slate-200">
                          {payment.studentName}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-300">
                          {payment.studentId}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-300">
                          {payment.batchId}
                        </td>

                        {/* Paid চেকবক্স */}
                        <td className="px-4 py-3 text-center">
                          {isPaidAlready ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-900/30 border border-green-600 text-green-400 text-xs font-semibold rounded">
                              <Check className="w-4 h-4" />
                              সম্পন্ন
                            </span>
                          ) : (
                            <input
                              type="checkbox"
                              checked={studentSelection.paid}
                              onChange={() => handlePaidChange(payment._id)}
                              disabled={isLoading}
                              className="w-5 h-5 cursor-pointer rounded"
                            />
                          )}
                        </td>

                        {/* Enroll চেকবক্স */}
                        <td className="px-4 py-3 text-center">
                          {isEnrolledAlready ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-900/30 border border-green-600 text-green-400 text-xs font-semibold rounded">
                              <Check className="w-4 h-4" />
                              সম্পন্ন
                            </span>
                          ) : (
                            <input
                              type="checkbox"
                              checked={studentSelection.enrolled}
                              onChange={() =>
                                handleEnrolledChange(
                                  payment._id,
                                  studentSelection.paid || isPaidAlready
                                )
                              }
                              disabled={
                                isLoading ||
                                (!studentSelection.paid && !isPaidAlready)
                              }
                              className="w-5 h-5 cursor-pointer rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                          )}
                        </td>

                        {/* অ্যাকশন বাটন */}
                        <td className="px-4 py-3 text-sm">
                          {(studentSelection.paid ||
                            studentSelection.enrolled) && (
                            <button
                              onClick={() =>
                                handleSubmit(
                                  payment,
                                  studentSelection.paid,
                                  studentSelection.enrolled
                                )
                              }
                              disabled={isLoading}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition disabled:cursor-not-allowed"
                            >
                              {isLoading ? "প্রক্রিয়া করছে..." : "সাবমিট করুন"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* তথ্য */}
        <div className="mt-6 bg-slate-800 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm">
            📌 <strong>নোট:</strong> "Paid" চেকবক্স চেক করলে পেমেন্ট রেকর্ড হবে।
            "Enroll" শুধুমাত্র "Paid" চেক করার পরে সক্রিয় হবে। উভয় চেক করে
            "সাবমিট করুন" বাটনে ক্লিক করুন।
          </p>
        </div>
      </div>
    </div>
  );
}
