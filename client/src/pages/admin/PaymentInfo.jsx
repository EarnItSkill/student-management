import { Check, Edit2, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppContext } from "../../context/useAppContext";

export default function PaymentInfo() {
  const {
    paymentInfo,
    getPaymentInfo,
    updatePaymentInfo,
    deletePaymentInfo,
    addPaymentInfo,
    patchPaymentInfo,
  } = useAppContext();

  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    studentName: "",
    studentId: "",
    studentMobile: "",
    batchId: "",
    bkashNo: "",
    txId: "",
    payAmount: "",
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      await getPaymentInfo();
    } catch (error) {
      console.error("পেমেন্ট তথ্য ফেচ করার সময় ত্রুটি:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // সার্চ ফাংশনালিটি
  const filteredPayments =
    paymentInfo?.filter(
      (payment) =>
        payment.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.bkashNo?.includes(searchTerm) ||
        payment.studentMobile?.includes(searchTerm)
    ) || [];

  // পেজিনেশন
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(
    startIdx,
    startIdx + itemsPerPage
  );

  const handleEdit = (payment) => {
    setFormData({
      studentName: payment.studentName,
      studentId: payment.studentId,
      studentMobile: payment.studentMobile,
      batchId: payment.batchId,
      bkashNo: payment.bkashNo,
      txId: payment.txId,
      payAmount: payment.payAmount,
    });
    setEditingId(payment._id);
    setIsAddMode(false);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setFormData({
      studentName: "",
      studentId: "",
      studentMobile: "",
      batchId: "",
      bkashNo: "",
      txId: "",
      payAmount: "",
    });
    setEditingId(null);
    setIsAddMode(true);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (isAddMode) {
        await addPaymentInfo(formData);
      } else {
        await updatePaymentInfo(editingId, formData);
      }
      setIsModalOpen(false);
      setFormData({
        studentName: "",
        studentId: "",
        studentMobile: "",
        batchId: "",
        bkashNo: "",
        txId: "",
        payAmount: "",
      });
      await fetchPayments();
    } catch (error) {
      console.error("সংরক্ষণে ত্রুটি:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "আপনি কি এই পেমেন্ট রেকর্ড মুছতে চান? তাহলে আপনাকে মেনুয়্যালি Enrollment ও Payment ডিলিট করতে হবে।"
      )
    ) {
      setIsLoading(true);
      try {
        await deletePaymentInfo(id);
        await fetchPayments();
      } catch (error) {
        console.error("মুছতে ত্রুটি:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVerify = async (id, newStatus) => {
    setIsLoading(true);
    try {
      await patchPaymentInfo(id, { isOk: newStatus });
      await fetchPayments();
    } catch (error) {
      console.error("যাচাইকরণে ত্রুটি:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen  py-8 px-4">
      {/* <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8 px-4"> */}
      <div className="container mx-auto max-w-7xl">
        {/* শিরোনাম */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
            অ্যাডমিন ড্যাশবোর্ড
          </h1>
          <p className="text-slate-400">
            সকল শিক্ষার্থীর পেমেন্ট তথ্য পরিচালনা করুন
          </p>
        </div>

        {/* কন্ট্রোল প্যানেল */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* সার্চ বার */}
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="নাম, ID, মোবাইল বা Bkash নম্বর দিয়ে খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* নতুন যোগ করুন বাটন */}
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              নতুন যোগ করুন
            </button>
          </div>

          {/* তথ্য */}
          <div className="mt-4 text-sm text-slate-400">
            মোট:{" "}
            <span className="text-blue-400 font-bold">
              {filteredPayments.length}
            </span>{" "}
            টি রেকর্ড
            {searchTerm && ` (${searchTerm} এর জন্য)`}
          </div>
        </div>

        {/* টেবিল */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          {isLoading && filteredPayments.length === 0 ? (
            <div className="p-8 text-center text-slate-400">লোড হচ্ছে...</div>
          ) : paginatedPayments.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              কোন পেমেন্ট রেকর্ড পাওয়া যায়নি
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
                      মোবাইল
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200">
                      Batch ID
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200">
                      পরিমাণ
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200">
                      TxId
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200">
                      অ্যাকশন
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200">
                      যাচাই
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPayments.map((payment, idx) => (
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
                        {payment.studentMobile}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300">
                        {payment.batchId}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-green-400">
                        ৳ {payment.payAmount}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300">
                        {payment.txId}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(payment)}
                            className={`p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition ${
                              payment.enroll === "yes" && "hidden"
                            }`}
                            title="সম্পাদনা করুন"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(payment._id)}
                            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
                            title="মুছুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <input
                          type="checkbox"
                          checked={payment.isOk === "yes"}
                          onChange={() =>
                            handleVerify(
                              payment._id,
                              payment.isOk === "yes" ? "no" : "yes"
                            )
                          }
                          disabled={payment.enroll === "yes"}
                          className="w-5 h-5 cursor-pointer rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* পেজিনেশন */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg"
            >
              আগে
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg transition ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 hover:bg-slate-600 text-slate-200"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg"
            >
              পরে
            </button>
          </div>
        )}
      </div>

      {/* মডাল - সম্পাদনা/যোগ করুন */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-400">
                {isAddMode ? "নতুন পেমেন্ট যোগ করুন" : "পেমেন্ট সম্পাদনা করুন"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Student Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  শিক্ষার্থীর নাম
                </label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Student ID */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Student ID
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  disabled={!isAddMode}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                />
              </div>

              {/* Student Mobile */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  মোবাইল নম্বর
                </label>
                <input
                  type="tel"
                  name="studentMobile"
                  value={formData.studentMobile}
                  onChange={handleInputChange}
                  disabled={!isAddMode}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                />
              </div>

              {/* Batch ID */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Batch ID
                </label>
                <input
                  type="text"
                  name="batchId"
                  value={formData.batchId}
                  onChange={handleInputChange}
                  disabled={!isAddMode}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                />
              </div>

              {/* Bkash No */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Bkash নম্বর
                </label>
                <input
                  type="tel"
                  name="bkashNo"
                  value={formData.bkashNo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* TxId */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  TxId
                </label>
                <input
                  type="text"
                  name="txId"
                  value={formData.txId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Pay Amount */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  পেমেন্ট পরিমাণ (টাকা)
                </label>
                <input
                  type="number"
                  name="payAmount"
                  value={formData.payAmount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* বাটন */}
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-lg transition"
              >
                <Check className="w-5 h-5" />
                {isLoading ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition"
              >
                বাতিল করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
