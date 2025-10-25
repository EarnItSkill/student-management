import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit,
  GraduationCap,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useAppContext } from "../../context/useAppContext";
import ConfirmModal from "../common/ConfirmModal";

const BatchList = ({ onEdit, onAdd }) => {
  const { batches, courses, deleteBatch } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    batch: null,
  });

  const BATCHES_PER_PAGE = 20;

  // Filter batches
  const filteredBatches = useMemo(() => {
    return batches?.filter((batch) => {
      const course = courses?.find((c) => c._id === batch.courseId);
      const search = searchTerm.toLowerCase();
      return (
        batch?.batchName?.toLowerCase().includes(search) ||
        batch?.sBatchId?.toLowerCase().includes(search) ||
        course?.title?.toLowerCase().includes(search)
      );
    });
  }, [batches, courses, searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredBatches.length / BATCHES_PER_PAGE);
  const startIndex = (currentPage - 1) * BATCHES_PER_PAGE;
  const endIndex = startIndex + BATCHES_PER_PAGE;
  const currentBatches = filteredBatches.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = (batch) => {
    setDeleteModal({ isOpen: true, batch });
  };

  const confirmDelete = () => {
    if (deleteModal.batch) {
      deleteBatch(deleteModal.batch._id);
      setDeleteModal({ isOpen: false, batch: null });

      // Adjust current page if needed after deletion
      const newTotalPages = Math.ceil(
        (filteredBatches.length - 1) / BATCHES_PER_PAGE
      );
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisibleButtons / 2)
    );
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    // Adjust start if we're near the end
    if (endPage - startPage < maxVisibleButtons - 1) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    // First page button
    if (startPage > 1) {
      buttons.push(
        <button
          key="first"
          onClick={() => handlePageChange(1)}
          className="btn btn-sm"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="dots1" className="px-2">
            ...
          </span>
        );
      }
    }

    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`btn btn-sm ${currentPage === i ? "btn-primary" : ""}`}
        >
          {i}
        </button>
      );
    }

    // Last page button
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="dots2" className="px-2">
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key="last"
          onClick={() => handlePageChange(totalPages)}
          className="btn btn-sm"
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  const formatTimeToBangla = (timeString) => {
    if (!timeString) return "";
    const [hourStr, minuteStr] = timeString.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    const period = hour >= 12 ? "pm" : "am";
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;

    // ইংরেজি সংখ্যা → বাংলা সংখ্যা
    const engToBn = (num) =>
      num
        .toString()
        .replace(/0/g, "০")
        .replace(/1/g, "১")
        .replace(/2/g, "২")
        .replace(/3/g, "৩")
        .replace(/4/g, "৪")
        .replace(/5/g, "৫")
        .replace(/6/g, "৬")
        .replace(/7/g, "৭")
        .replace(/8/g, "৮")
        .replace(/9/g, "৯");

    const bnHour = engToBn(hour);
    const bnMinute = engToBn(minute.toString().padStart(2, "0"));

    return `${bnHour}:${bnMinute} ${period}`;
  };

  const getClassSchedule = (schedule) => {
    if (schedule.scheduleType == "SIX_DAYS") {
      return `শনি - বৃহ: ${formatTimeToBangla(schedule.startTime)}`;
    } else if (schedule.type == "THREE_DAYS_A") {
      return `শনি, সোম, বুধ: ${formatTimeToBangla(schedule.startTime)}`;
    } else if (schedule.type == "THREE_DAYS_B") {
      return `রবি, মঙ্গল, বৃহ: ${formatTimeToBangla(schedule?.startTime)}`;
    } else {
      return `অন্য সময়: ${formatTimeToBangla(schedule?.startTime)}`;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Batches Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            Total: {filteredBatches.length} batch
            {filteredBatches.length !== 1 ? "es" : ""}
            {searchTerm && ` (filtered from ${batches.length})`}
          </p>
        </div>
        <button onClick={onAdd} className="btn btn-primary gap-2">
          <Plus className="w-5 h-5" />
          Add Batch
        </button>
      </div>

      {/* Search */}
      <div className="form-control mb-6">
        <div className="input-group flex items-center gap-3">
          <span className="bg-base-200 p-3 rounded-l-lg">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Search by batch name, batch ID or course..."
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setCurrentPage(1);
              }}
              className="btn btn-ghost btn-sm"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Batches Table */}
      {filteredBatches.length === 0 ? (
        <div className="text-center py-12">
          <GraduationCap className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">
            {searchTerm
              ? "No batches found matching your search"
              : "No batches found"}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-base-100 rounded-lg shadow-lg mb-6">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Batch ID</th>
                  <th>Batch Name</th>
                  <th>Course</th>
                  <th>Schedule</th>
                  <th>Students</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBatches?.map((batch) => {
                  const course = courses.find((c) => c._id === batch.courseId);
                  const percentage =
                    (batch.enrolledStudents / batch.totalSeats) * 100;

                  return (
                    <tr key={batch._id}>
                      <td>
                        <span className="badge badge-ghost badge-sm">
                          {batch.sBatchId || "N/A"}
                        </span>
                      </td>
                      <td>
                        <div className="font-bold">{batch.batchName}</div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-primary" />
                          {course?.title}
                        </div>
                      </td>
                      <td className="text-sm">{getClassSchedule(batch)}</td>
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
                          <div className="text-gray-500">
                            to {batch.endDate}
                          </div>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Page Info */}
              <div className="text-sm text-gray-400">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredBatches.length)} of{" "}
                {filteredBatches.length} batches
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn btn-sm gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="hidden sm:flex items-center gap-1">
                  {renderPaginationButtons()}
                </div>

                {/* Mobile Page Indicator */}
                <div className="sm:hidden">
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn btn-sm gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
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
