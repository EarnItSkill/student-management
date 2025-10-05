import { Award, Edit, Eye, Filter, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../../context/useAppContext";
import ConfirmModal from "../common/ConfirmModal";

const QuizList = ({ onEdit, onAdd }) => {
  const { quizzes, batches, deleteQuiz } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [batchFilter, setBatchFilter] = useState("all");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, quiz: null });
  const [viewModal, setViewModal] = useState({ isOpen: false, quiz: null });

  // Filter quizzes
  const filteredQuizzes = quizzes.filter((quiz) => {
    const batch = batches.find((b) => b._id === quiz.batchId);

    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch?.batchName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBatch =
      batchFilter === "all" || quiz.batchId === parseInt(batchFilter);

    return matchesSearch && matchesBatch;
  });

  const handleDelete = (quiz) => {
    setDeleteModal({ isOpen: true, quiz });
  };

  const confirmDelete = () => {
    if (deleteModal.quiz) {
      deleteQuiz(deleteModal.quiz._id);
      setDeleteModal({ isOpen: false, quiz: null });
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Quizzes Management</h2>
        <button onClick={onAdd} className="btn btn-primary gap-2">
          <Plus className="w-5 h-5" />
          Add Quiz
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-primary">
            <Award className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Quizzes</div>
          <div className="stat-value text-primary">{quizzes.length}</div>
        </div>
        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-success">
            <Award className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Questions</div>
          <div className="stat-value text-success">
            {quizzes.reduce((sum, q) => sum + q.questions.length, 0)}
          </div>
        </div>
        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-info">
            <Award className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Submissions</div>
          <div className="stat-value text-info">
            {quizzes.reduce((sum, q) => sum + q.results.length, 0)}
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="form-control">
          <div className="input-group">
            <span className="bg-base-200">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search quizzes..."
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
      </div>

      {/* Quizzes Grid */}
      {filteredQuizzes.length === 0 ? (
        <div className="text-center py-12">
          <Award className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No quizzes found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => {
            const batch = batches.find((b) => b._id === quiz.batchId);

            return (
              <div
                key={quiz._id}
                className="card bg-base-100 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="card-title text-lg">{quiz.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {batch?.batchName}
                      </p>
                    </div>
                    <Award className="w-8 h-8 text-primary flex-shrink-0" />
                  </div>

                  <div className="divider my-2"></div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Questions:</span>
                      <span className="font-semibold">
                        {quiz.questions.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Marks:</span>
                      <span className="font-semibold">{quiz.totalMarks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Submissions:</span>
                      <span className="font-semibold">
                        {quiz.results.length}
                      </span>
                    </div>
                  </div>

                  <div className="card-actions justify-end mt-4 gap-2">
                    <button
                      onClick={() => setViewModal({ isOpen: true, quiz })}
                      className="btn btn-ghost btn-sm gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => onEdit(quiz)}
                      className="btn btn-info btn-sm gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(quiz)}
                      className="btn btn-error btn-sm gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, quiz: null })}
        onConfirm={confirmDelete}
        title="Delete Quiz"
        message={`Are you sure you want to delete "${deleteModal.quiz?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />

      {/* View Quiz Modal */}
      {viewModal.isOpen && viewModal.quiz && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl">{viewModal.quiz.title}</h3>
              <button
                onClick={() => setViewModal({ isOpen: false, quiz: null })}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {viewModal.quiz.questions.map((q, index) => (
                <div key={q._id} className="card bg-base-200">
                  <div className="card-body p-4">
                    <h4 className="font-semibold">
                      {index + 1}. {q.question}
                    </h4>
                    <div className="space-y-2 mt-2">
                      {q.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`p-2 rounded ${
                            optIndex === q.correctAnswer
                              ? "bg-success text-white"
                              : "bg-base-100"
                          }`}
                        >
                          {String.fromCharCode(65 + optIndex)}. {option}
                          {optIndex === q.correctAnswer && " ✓"}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="modal-action">
              <button
                onClick={() => setViewModal({ isOpen: false, quiz: null })}
                className="btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizList;
