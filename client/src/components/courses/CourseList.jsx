import {
  BookOpen,
  Clock,
  DollarSign,
  Edit,
  Eye,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/useAppContext";
import ConfirmModal from "../common/ConfirmModal";

const CourseList = ({ onEdit, onAdd }) => {
  const navigate = useNavigate();
  const { courses, deleteCourse } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    course: null,
  });

  // Filter courses
  const filteredCourses = courses?.filter(
    (course) =>
      course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course?.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (course) => {
    setDeleteModal({ isOpen: true, course });
  };

  const confirmDelete = () => {
    if (deleteModal.course) {
      deleteCourse(deleteModal.course._id);
      setDeleteModal({ isOpen: false, course: null });
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Courses Management</h2>
        <button onClick={onAdd} className="btn btn-primary gap-2">
          <Plus className="w-5 h-5" />
          Add Course
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
            placeholder="Search courses..."
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No courses found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="card bg-base-100 shadow-lg hover:shadow-xl transition-all"
            >
              <figure className="h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </figure>
              <div className="card-body">
                <h3 className="card-title text-lg">{course.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {course.description}
                </p>

                <div className="divider my-2"></div>

                <div className="flex justify-between items-center text-sm">
                  <span className="badge badge-primary gap-1">
                    <Clock className="w-3 h-3" />
                    {course.duration}
                  </span>
                  <span className="badge badge-secondary gap-1">
                    <DollarSign className="w-3 h-3" />৳{course.fee}
                  </span>
                </div>

                <div className="card-actions justify-end mt-4">
                  <button
                    onClick={() => navigate(`/course/${course._id}`)}
                    className="btn btn-success btn-sm gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => onEdit(course)}
                    className="btn btn-info btn-sm gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course)}
                    className="btn btn-error btn-sm gap-2"
                    disabled
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
        onClose={() => setDeleteModal({ isOpen: false, course: null })}
        onConfirm={confirmDelete}
        title="Delete Course"
        message={`Are you sure you want to delete "${deleteModal.course?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default CourseList;
