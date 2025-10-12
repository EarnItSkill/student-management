import {
  AlertCircle,
  CheckCircle,
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
  const { payments, students, batches } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter payments
  const filteredPayments = payments?.filter((payment) => {
    const student = students?.find((s) => s._id === payment.studentId);
    const batch = batches?.find((b) => b._id === payment.batchId);

    const matchesSearch =
      student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch?.batchName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate totals
  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = filteredPayments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const partialAmount = filteredPayments
    .filter((p) => p.status === "partial")
    .reduce((sum, p) => sum + p.amount, 0);

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
          <div className="stat-value text-primary">৳{totalAmount}</div>
        </div>
        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-success">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div className="stat-title">Paid</div>
          <div className="stat-value text-success">৳{paidAmount}</div>
        </div>
        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-warning">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="stat-title">Partial</div>
          <div className="stat-value text-warning">৳{partialAmount}</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="form-control flex-2">
          <div className="input-group">
            <span className="bg-base-200">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search by student or batch..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="form-control flex-1">
          <div className="input-group">
            <span className="bg-base-200">
              <Filter className="w-5 h-5" />
            </span>
            <select
              className="select select-bordered"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
        <div className="text-center py-12">
          <DollarSign className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No payments found</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-lg shadow-lg">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>ID</th>
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
              {filteredPayments.map((payment) => {
                const student = students.find(
                  (s) => s._id === payment.studentId
                );
                const batch = batches.find((b) => b._id === payment.batchId);

                return (
                  <tr key={payment._id}>
                    <td className="font-mono">#{payment.id}Need</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-8 h-8 rounded-full">
                            <img src={student?.image} alt={student?.name} />
                          </div>
                        </div>
                        <span className="font-semibold">{student?.name}</span>
                      </div>
                    </td>
                    <td className="text-sm">{batch?.batchName}</td>
                    <td className="font-bold text-primary">
                      ৳{payment.amount}
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
                    <td className="text-end">
                      <button
                        onClick={() => onEdit(payment)}
                        className="btn btn-info btn-sm gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button className="btn btn-error btn-sm gap-1 ms-2">
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentList;
