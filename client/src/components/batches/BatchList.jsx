import {
  Calendar,
  Edit,
  GraduationCap,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../../context/useAppContext";
import ConfirmModal from "../common/ConfirmModal";

const BatchList = ({ onEdit, onAdd }) => {
  const { batches, courses, deleteBatch } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    batch: null,
  });

  // Filter batches
  const filteredBatches = batches?.filter((batch) => {
    const course = courses?.find((c) => c._id === batch.courseId);
    return (
      batch?.batchName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDelete = (batch) => {
    setDeleteModal({ isOpen: true, batch });
  };

  const confirmDelete = () => {
    if (deleteModal.batch) {
      deleteBatch(deleteModal.batch._id);
      setDeleteModal({ isOpen: false, batch: null });
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Batches Management</h2>
        <button onClick={onAdd} className="btn btn-primary gap-2">
          <Plus className="w-5 h-5" />
          Add Batch
        </button>
      </div>

      {/* Search */}
      <div className="form-control mb-6">
        <div className="input-group">
          <span className="bg-base-200">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Search batches..."
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Batches Table */}
      {filteredBatches.length === 0 ? (
        <div className="text-center py-12">
          <GraduationCap className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No batches found</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-lg shadow-lg">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Batch Name</th>
                <th>Course</th>
                <th>Schedule</th>
                <th>Students</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBatches?.map((batch) => {
                const course = courses.find((c) => c._id === batch.courseId);
                const percentage =
                  (batch.enrolledStudents / batch.totalSeats) * 100;

                return (
                  <tr key={batch._id}>
                    <td>
                      <div className="font-bold">{batch.batchName}</div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-primary" />
                        {course?.title}
                      </div>
                    </td>
                    <td className="text-sm">{batch.schedule}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold">
                          {batch.enrolledStudents}/{batch.totalSeats}
                        </span>
                        <div
                          className="tooltip"
                          data-tip={`${percentage.toFixed(0)}% filled`}
                        >
                          <progress
                            className="progress progress-primary w-20"
                            value={batch.enrolledStudents}
                            max={batch.totalSeats}
                          ></progress>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {batch.startDate}
                        </div>
                        <div className="text-gray-500">to {batch.endDate}</div>
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(batch)}
                          className="btn btn-info btn-sm gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(batch)}
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
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, batch: null })}
        onConfirm={confirmDelete}
        title="Delete Batch"
        message={`Are you sure you want to delete "${deleteModal.batch?.batchName}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default BatchList;
