import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Mail,
  Phone,
  Plus,
  Search,
  Trash2,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useAppContext } from "../../context/useAppContext";
import ConfirmModal from "../common/ConfirmModal";

const StudentList = ({ onEdit, onAdd }) => {
  const { students, deleteStudent } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    student: null,
  });

  const STUDENTS_PER_PAGE = 12;

  // Filter students
  const filteredStudents = useMemo(() => {
    return students?.filter((student) => {
      const search = searchTerm.toLowerCase();
      return (
        student?.name?.toLowerCase().includes(search) ||
        student?.email?.toLowerCase().includes(search) ||
        student?.phone?.includes(searchTerm) ||
        student?.studentId?.toLowerCase().includes(search)
      );
    });
  }, [students, searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / STUDENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * STUDENTS_PER_PAGE;
  const endIndex = startIndex + STUDENTS_PER_PAGE;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = (student) => {
    setDeleteModal({ isOpen: true, student });
  };

  const confirmDelete = () => {
    if (deleteModal.student) {
      deleteStudent(deleteModal.student._id);
      setDeleteModal({ isOpen: false, student: null });

      // Adjust current page if needed after deletion
      const newTotalPages = Math.ceil(
        (filteredStudents.length - 1) / STUDENTS_PER_PAGE
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

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Students Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            Total: {filteredStudents.length} student
            {filteredStudents.length !== 1 ? "s" : ""}
            {searchTerm && ` (filtered from ${students.length})`}
          </p>
        </div>
        <button onClick={onAdd} className="btn btn-primary gap-2">
          <Plus className="w-5 h-5" />
          Add Student
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
            placeholder="Search by name, email, phone or student ID..."
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

      {/* Students Grid */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-12">
          <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">
            {searchTerm
              ? "No students found matching your search"
              : "No students found"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {currentStudents.map((student) => (
              <div
                key={student._id}
                className="card bg-base-100 shadow-lg hover:shadow-xl transition-all border border-gray-500"
              >
                <div className="card-body">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                          <img src={student.image} alt={student.name} />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold">{student.name}</h3>
                        <span className="badge badge-sm badge-primary">
                          {student?.studentId}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="divider my-2"></div>

                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="truncate">{student.email}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      {student.phone}
                    </p>
                  </div>

                  <div className="card-actions justify-end mt-4">
                    <button
                      onClick={() => onEdit(student)}
                      className="btn btn-info btn-sm gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(student)}
                      className="btn btn-error btn-sm gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              {/* Page Info */}
              <div className="text-sm text-gray-400">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredStudents.length)} of{" "}
                {filteredStudents.length} students
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
        onClose={() => setDeleteModal({ isOpen: false, student: null })}
        onConfirm={confirmDelete}
        title="Delete Student"
        message={`Are you sure you want to delete ${deleteModal.student?.name}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default StudentList;
