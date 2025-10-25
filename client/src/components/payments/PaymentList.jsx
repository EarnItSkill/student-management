import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Edit,
  Filter,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../../context/useAppContext";

const PaymentList = ({ onEdit, onAdd }) => {
  const { payments, students, batches, deletePayment } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const itemsPerPage = 10;

  // Filter payments
  const filteredPayments = payments
    ?.filter((payment) => {
      const student = students?.find((s) => s._id === payment.studentId);
      const batch = batches?.find((b) => b._id === payment.batchId);

      const matchesSearch =
        student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student?.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch?.batchName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || payment.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by payment date (newest first)
      return new Date(b.paymentDate) - new Date(a.paymentDate);
    });

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, endIndex);

  // Calculate totals
  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = filteredPayments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const partialAmount = filteredPayments
    .filter((p) => p.status === "partial")
    .reduce((sum, p) => sum + p.amount, 0);

  // Handle delete
  const handleDelete = (paymentId) => {
    deletePayment(paymentId);
    setDeleteConfirm(null);

    // Adjust current page if needed
    if (currentPayments.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Payments Management</h2>
        <button onClick={onAdd} className="btn btn-primary gap-2">
          <Plus className="w-5 h-5" />
          Add Payment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-primary">
            <DollarSign className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Amount</div>
          <div className="stat-value text-primary">
            ৳{totalAmount.toLocaleString()}
          </div>
          <div className="stat-desc">{filteredPayments.length} payments</div>
        </div>
        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-success">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div className="stat-title">Paid</div>
          <div className="stat-value text-success">
            ৳{paidAmount.toLocaleString()}
          </div>
        </div>
        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-warning">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="stat-title">Partial</div>
          <div className="stat-value text-warning">
            ৳{partialAmount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="form-control flex-2">
          <div className="input-group flex items-center justify-center gap-4">
            <span className="bg-base-200">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search by student name, ID, or batch..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>
        </div>

        <div className="form-control flex-1">
          <div className="input-group flex items-center justify-center gap-4">
            <span className="bg-base-200">
              <Filter className="w-5 h-5" />
            </span>
            <select
              className="select select-bordered"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1); // Reset to first page on filter
              }}
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      {filteredPayments.length === 0 ? (
        <div className="text-center py-12 bg-base-100 rounded-lg shadow-lg">
          <DollarSign className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No payments found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-base-100 rounded-lg shadow-lg">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Batch</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPayments.map((payment, index) => {
                  const student = students.find(
                    (s) => s._id === payment.studentId
                  );
                  const batch = batches.find((b) => b._id === payment.batchId);

                  return (
                    <tr key={payment._id}>
                      <td className="font-semibold">
                        {startIndex + index + 1}
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                              <img src={student?.image} alt={student?.name} />
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold">{student?.name}</div>
                            <div className="text-xs text-gray-500">
                              {student?.studentId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-sm">{batch?.batchName}</td>
                      <td className="font-bold text-primary">
                        ৳{payment.amount.toLocaleString()}
                      </td>
                      <td>
                        <span className="badge badge-outline">
                          {payment.method}
                        </span>
                      </td>
                      <td className="text-sm">{payment.paymentDate}</td>
                      <td>
                        <span
                          className={`badge gap-1 ${
                            payment.status === "paid"
                              ? "badge-success"
                              : payment.status === "partial"
                              ? "badge-warning"
                              : "badge-error"
                          }`}
                        >
                          {payment.status === "paid" && (
                            <CheckCircle className="w-3 h-3" />
                          )}
                          {payment.status === "partial" && (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          {payment.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onEdit(payment)}
                            className="btn btn-info btn-sm gap-1"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(payment._id)}
                            className="btn btn-error btn-sm gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-sm btn-circle"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;

                  // Show first page, last page, current page and adjacent pages
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`btn btn-sm ${
                          currentPage === page ? "btn-primary" : "btn-ghost"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="px-2">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn btn-sm btn-circle"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <span className="text-sm text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete this payment? This action cannot
              be undone.
            </p>
            <div className="modal-action">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="btn btn-error gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentList;
