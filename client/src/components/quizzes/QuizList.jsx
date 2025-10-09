import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle,
  Edit,
  Eye,
  Grid,
  List as ListIcon,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../../context/useAppContext";
import ConfirmModal from "../common/ConfirmModal";

const QuizList = ({ onEdit, onAdd }) => {
  const { quizzes, batches, courses, deleteQuiz } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [quizSearchTerm, setQuizSearchTerm] = useState("");
  const [viewType, setViewType] = useState("grid"); // "grid" or "table"
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, quiz: null });
  const [viewModal, setViewModal] = useState({ isOpen: false, quiz: null });

  // Group quizzes by batch with category matching
  const batchesWithQuizzes = batches.map((batch) => {
    // Find quizzes that match this batch's category
    const batchQuizzes = quizzes.filter(
      (quiz) => quiz.courseId === batch.courseId || quiz.batchId === batch._id // Also include specific batch quizzes
      // quiz.quizCategory === batch.batchCategory || quiz.batchId === batch._id // Also include specific batch quizzes
    );
    const course = courses.find((c) => c._id === batch.courseId);
    return {
      ...batch,
      quizzes: batchQuizzes,
      course: course,
      totalQuestions: batchQuizzes.reduce(
        (sum, q) => sum + q.questions.length,
        0
      ),
      totalSubmissions: batchQuizzes.reduce(
        (sum, q) => sum + q.results.length,
        0
      ),
    };
  });

  // Filter batches based on search
  const filteredBatches = batchesWithQuizzes?.filter(
    (batch) =>
      batch?.batchName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch?.course?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch?.courseId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected batch details
  const selectedBatchData = selectedBatch
    ? batchesWithQuizzes.find((b) => b._id === selectedBatch)
    : null;

  const handleDelete = (quiz) => {
    setDeleteModal({ isOpen: true, quiz });
  };

  const confirmDelete = () => {
    if (deleteModal.quiz) {
      deleteQuiz(deleteModal.quiz._id);
      setDeleteModal({ isOpen: false, quiz: null });
    }
  };

  const handleBackToBatches = () => {
    setSelectedBatch(null);
    setSearchTerm("");
    setQuizSearchTerm("");
  };

  // Show Batch List View
  if (!selectedBatch) {
    return (
      <div>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold">
            Quizzes Management - Select Batch
          </h2>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-figure text-primary">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Batches</div>
            <div className="stat-value text-primary">{batches.length}</div>
          </div>
          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-figure text-success">
              <Award className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Quizzes</div>
            <div className="stat-value text-success">{quizzes.length}</div>
          </div>
          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-figure text-info">
              <Award className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Questions</div>
            <div className="stat-value text-info">
              {quizzes.reduce((sum, q) => sum + q.questions.length, 0)}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="form-control mb-6">
          <div className="input-group">
            <span className="bg-base-200">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search batches, courses or categories..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Batches Grid */}
        {filteredBatches.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No batches found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBatches.map((batch) => (
              <div
                key={batch._id}
                onClick={() => setSelectedBatch(batch._id)}
                className="card bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg hover:shadow-2xl transition-all cursor-pointer border-2 border-primary/20 hover:border-primary/50"
              >
                <div className="card-body">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="card-title text-lg">{batch.batchName}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {batch.course?.title || "No Course"}
                      </p>
                    </div>
                    <BookOpen className="w-8 h-8 text-primary flex-shrink-0" />
                  </div>

                  <div className="divider my-2"></div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Schedule:</span>
                      <span className="font-semibold text-xs">
                        {batch.schedule}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quizzes:</span>
                      <span className="badge badge-primary">
                        {batch.quizzes.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Questions:</span>
                      <span className="badge badge-success">
                        {batch.totalQuestions}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Submissions:</span>
                      <span className="badge badge-info">
                        {batch.totalSubmissions}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <button className="btn btn-primary btn-sm w-full">
                      View Quizzes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Show Quiz List for Selected Batch (Category-based filtering)
  const selectedCourse = selectedBatchData?.courseId;
  const batchQuizzes = quizzes
    .filter(
      (quiz) =>
        quiz.courseId === selectedCourse || quiz.batchId === selectedBatch
    )
    .filter((quiz) =>
      quiz.title.toLowerCase().includes(quizSearchTerm.toLowerCase())
    );

  return (
    <div>
      {/* Header with Back Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackToBatches}
            className="btn btn-ghost btn-sm gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div>
            <h2 className="text-2xl font-bold">
              {selectedBatchData?.batchName}
            </h2>
            <p className="text-sm text-gray-400">
              {selectedBatchData?.course?.title}
            </p>
          </div>
        </div>
        <button onClick={onAdd} className="btn btn-primary gap-2">
          <Plus className="w-5 h-5" />
          Add Quiz
        </button>
      </div>

      {/* Batch Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-primary">
            <Award className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Quizzes</div>
          <div className="stat-value text-primary">{batchQuizzes.length}</div>
          {/* <div className="stat-desc">
            For {selectedCourse?.toUpperCase()} category
          </div> */}
        </div>
        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-success">
            <Award className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Questions</div>
          <div className="stat-value text-success">
            {batchQuizzes.reduce((sum, q) => sum + q.questions.length, 0)}
          </div>
        </div>
        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-info">
            <Award className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Submissions</div>
          <div className="stat-value text-info">
            {batchQuizzes.reduce((sum, q) => sum + q.results.length, 0)}
          </div>
        </div>
      </div>

      {/* Search and View Toggle */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="form-control flex-1">
          <div className="input-group flex items-center gap-3">
            <span className="bg-base-200">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search quizzes..."
              className="input input-bordered w-full"
              value={quizSearchTerm}
              onChange={(e) => setQuizSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="btn-group">
          <button
            className={`btn ${viewType === "grid" ? "btn-active" : ""}`}
            onClick={() => setViewType("grid")}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            className={`btn ${viewType === "table" ? "btn-active" : ""}`}
            onClick={() => setViewType("table")}
          >
            <ListIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Results Count */}
      {quizSearchTerm && (
        <div className="alert alert-info mb-4">
          <span>
            Found {batchQuizzes.length} quiz(es) matching "{quizSearchTerm}"
          </span>
        </div>
      )}

      {/* Quizzes Display */}
      {batchQuizzes.length === 0 ? (
        <div className="text-center py-12">
          <Award className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">
            {quizSearchTerm
              ? "No quizzes found matching your search"
              : `No quizzes found for ${selectedCourse?.toUpperCase()} category`}
          </p>
          {!quizSearchTerm && (
            <button
              onClick={onAdd}
              className="btn btn-primary btn-sm mt-4 gap-2"
            >
              <Plus className="w-4 h-4" />
              Add First Quiz
            </button>
          )}
        </div>
      ) : viewType === "grid" ? (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batchQuizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="card bg-base-100 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="card-body border rounded-2xl border-gray-500">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="card-title text-lg">{quiz.title}</h3>
                    {/* <div className="badge badge-accent badge-sm mt-2">
                      {quiz.quizCategory?.toUpperCase()}
                    </div> */}
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
                    <span className="font-semibold">{quiz.results.length}</span>
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
          ))}
        </div>
      ) : (
        // Table View
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Quiz Title</th>
                <th>Category</th>
                <th>Questions</th>
                <th>Total Marks</th>
                <th>Submissions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {batchQuizzes.map((quiz, index) => (
                <tr key={quiz._id} className="hover">
                  <td>{index + 1}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      <span className="font-semibold">{quiz.title}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-accent">
                      {quiz.quizCategory?.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-primary">
                      {quiz.questions.length}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-success">
                      {quiz.totalMarks}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-info">
                      {quiz.results.length}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewModal({ isOpen: true, quiz })}
                        className="btn btn-ghost btn-xs gap-1"
                        title="View Quiz"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(quiz)}
                        className="btn btn-info btn-xs gap-1"
                        title="Edit Quiz"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(quiz)}
                        className="btn btn-error btn-xs gap-1"
                        title="Delete Quiz"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
          <div className="modal-box max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-xl">{viewModal.quiz.title}</h3>
                <p className="text-sm text-gray-600">Quiz Preview</p>
              </div>
              <button
                onClick={() => setViewModal({ isOpen: false, quiz: null })}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            {/* Quiz Stats */}
            <div className="stats shadow mb-4 w-full">
              <div className="stat">
                <div className="stat-title">Total Questions</div>
                <div className="stat-value text-primary">
                  {viewModal.quiz.questions.length}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Total Marks</div>
                <div className="stat-value text-success">
                  {viewModal.quiz.totalMarks}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Submissions</div>
                <div className="stat-value text-info">
                  {viewModal.quiz.results?.length || 0}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {viewModal.quiz.questions.map((q, index) => {
                const correctAnswers = q.correctAnswers || [];
                const hasMultipleCorrect = correctAnswers.length > 1;

                return (
                  <div key={q.id} className="card bg-base-200 shadow-lg">
                    <div className="card-body p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-lg flex-1">
                          {index + 1}. {q.question}
                        </h4>
                        {hasMultipleCorrect && (
                          <div className="badge badge-info badge-lg gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Multiple Answers
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 mt-2">
                        {q.options.map((option, optIndex) => {
                          const isCorrect = correctAnswers.includes(optIndex);

                          return (
                            <div
                              key={optIndex}
                              className={`p-3 rounded-lg border-2 transition-all ${
                                isCorrect
                                  ? "bg-success text-white border-success font-semibold"
                                  : "bg-base-100 border-base-300"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold">
                                    {String.fromCharCode(65 + optIndex)}.
                                  </span>
                                  <span>{option}</span>
                                </div>
                                {isCorrect && (
                                  <div className="flex items-center gap-1">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="text-sm font-bold">
                                      Correct
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Show correct answers summary */}
                      <div className="divider my-2"></div>
                      <div className="alert alert-warning py-2">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-semibold">
                          Correct Answer{correctAnswers.length > 1 ? "s" : ""}:{" "}
                          {correctAnswers
                            .map((idx) => String.fromCharCode(65 + idx))
                            .join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="modal-action">
              <button
                onClick={() => setViewModal({ isOpen: false, quiz: null })}
                className="btn btn-primary"
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
