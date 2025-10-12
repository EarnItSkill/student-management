import { Filter, Plus, Search, Trash2, UserCheck } from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../../context/useAppContext";
import ConfirmModal from "../common/ConfirmModal";

const EnrollmentList = ({ onAdd }) => {
  const {
    enrollments,
    students,
    batches,
    courses,
    unenrollStudent,
    updateBatch,
  } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [batchFilter, setBatchFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    enrollment: null,
  });

  // Filter enrollments
  const filteredEnrollments = enrollments?.filter((enrollment) => {
    const student = students?.find((s) => s._id === enrollment.studentId);
    const batch = batches?.find((b) => b._id === enrollment.batchId);

    const matchesSearch =
      student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch?.batchName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBatch =
      batchFilter === "all" || enrollment.batchId === parseInt(batchFilter);
    // batchFilter === "all" || enrollment.batchId === batchFilter;

    const matchesStatus =
      statusFilter === "all" || enrollment.status === statusFilter;

    return matchesSearch && matchesBatch && matchesStatus;
  });

  const handleDelete = (enrollment) => {
    setDeleteModal({ isOpen: true, enrollment });
  };

  // const confirmDelete = () => {
  //   if (deleteModal.enrollment) {
  //     unenrollStudent(deleteModal.enrollment._id);
  //     setDeleteModal({ isOpen: false, enrollment: null });
  //   }
  // };

  const confirmDelete = async () => {
    if (deleteModal.enrollment) {
      const batchId = deleteModal.enrollment.batchId; // এনরোলমেন্ট ডাটা থেকে ব্যাচ ID নিন

      // ১. MongoDB-তে ব্যাচ আপডেটের জন্য ডাটা প্রস্তুত করা
      const batchUpdateData = {
        // Unenrollment-এর জন্য: totalSeats +1 এবং enrolledStudents -1
        $inc: {
          totalSeats: 1,
          enrolledStudents: -1,
        },
      };

      try {
        // ২. ব্যাচের সিট কাউন্ট আপডেট করা
        await updateBatch(batchId, batchUpdateData);

        // ৩. স্টুডেন্টকে আন-এনরোল করা (আপনার বিদ্যমান লজিক)
        unenrollStudent(deleteModal.enrollment._id);
        setDeleteModal({ isOpen: false, enrollment: null });
      } catch (error) {
        console.error("Error during unenrollment batch update:", error);
        // ত্রুটি হ্যান্ডলিং এখানে যোগ করতে পারেন
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Enrollments Management</h2>
        <button onClick={onAdd} className="btn btn-primary gap-2">
          <Plus className="w-5 h-5" />
          Enroll Student
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-primary">
            <UserCheck className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Enrollments</div>
          <div className="stat-value text-primary">{enrollments.length}</div>
        </div>
        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-success">
            <UserCheck className="w-8 h-8" />
          </div>
          <div className="stat-title">Active</div>
          <div className="stat-value text-success">
            {enrollments.filter((e) => e.status === "active").length}
          </div>
        </div>
        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-error">
            <UserCheck className="w-8 h-8" />
          </div>
          <div className="stat-title">Inactive</div>
          <div className="stat-value text-error">
            {enrollments.filter((e) => e.status !== "active").length}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="form-control">
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

        <div className="form-control">
          <div className="input-group">
            <span className="bg-base-200">
              <Filter className="w-5 h-5" />
            </span>
            <select
              className="select select-bordered w-full"
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
            >
              <option value="all">All Batches</option>
              {batches.map((batch) => (
                <option key={batch._id} value={batch._id}>
                  {batch.batchName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-control">
          <div className="input-group">
            <span className="bg-base-200">
              <Filter className="w-5 h-5" />
            </span>
            <select
              className="select select-bordered w-full"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enrollments Table */}
      {filteredEnrollments.length === 0 ? (
        <div className="text-center py-12">
          <UserCheck className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No enrollments found</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-lg shadow-lg">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Batch</th>
                <th>Course</th>
                <th>Enroll Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnrollments.map((enrollment) => {
                const student = students.find(
                  (s) => s._id === enrollment.studentId
                );
                const batch = batches.find((b) => b._id === enrollment.batchId);
                const course = courses.find((c) => c._id === batch?.courseId);

                return (
                  <tr key={enrollment._id}>
                    <td className="font-mono">#{enrollment?.id}Need</td>
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
                    <td className="text-sm">{course?.title}</td>
                    <td>{enrollment.enrollDate}</td>
                    <td>
                      <span
                        className={`badge ${
                          enrollment.status === "active"
                            ? "badge-success"
                            : enrollment.status === "completed"
                            ? "badge-info"
                            : "badge-error"
                        }`}
                      >
                        {enrollment.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(enrollment)}
                        className="btn btn-error btn-sm gap-1"
                      >
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, enrollment: null })}
        onConfirm={confirmDelete}
        title="Remove Enrollment"
        message="Are you sure you want to remove this enrollment? This action cannot be undone."
        confirmText="Remove"
        type="danger"
      />
    </div>
  );
};

export default EnrollmentList;
