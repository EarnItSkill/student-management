import { Edit, Mail, Phone, Plus, Search, Trash2, User } from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../../context/useAppContext";
import ConfirmModal from "../common/ConfirmModal";

const StudentList = ({ onEdit, onAdd }) => {
  const { students, deleteStudent } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    student: null,
  });

  // Filter students
  const filteredStudents = students?.filter(
    (student) =>
      student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.phone?.includes(searchTerm)
  );

  const handleDelete = (student) => {
    setDeleteModal({ isOpen: true, student });
  };

  const confirmDelete = () => {
    if (deleteModal.student) {
      deleteStudent(deleteModal.student._id);
      setDeleteModal({ isOpen: false, student: null });
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Students Management</h2>
        <button onClick={onAdd} className="btn btn-primary gap-2">
          <Plus className="w-5 h-5" />
          Add Student
        </button>
      </div>

      {/* Search */}
      <div className="form-control mb-6">
        <div className="input-group flex items-center gap-3">
          <span className="bg-base-200">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Students Grid */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-12">
          <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No students found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => (
            <div
              key={student._id}
              className="card bg-base-100 shadow-lg hover:shadow-xl transition-all"
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
                        ID: {student?.studentId}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="divider my-2"></div>

                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    {student.email}
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
