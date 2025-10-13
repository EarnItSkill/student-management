// =====================================================
// FILE: src/pages/admin/AdminQuizResults.jsx
// =====================================================
import {
  BookOpen,
  Download,
  Eye,
  Search,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import QuizReviewModal from "../../components/quizzes/QuizReviewModal";
import { useAppContext } from "../../context/useAppContext";

const AdminQuizResults = () => {
  const { mcqQuizzes, students, batches, courses, quizzes } = useAppContext();

  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [sortBy, setSortBy] = useState("score-desc"); // score-desc, score-asc, date-desc

  // Get unique chapters
  const availableChapters = useMemo(() => {
    const chapters = [...new Set(quizzes.map((q) => q.chapter))];
    return chapters.sort((a, b) => {
      const numA = parseInt(a);
      const numB = parseInt(b);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.localeCompare(b);
    });
  }, [quizzes]);

  // Filter and sort attempts
  const filteredAttempts = useMemo(() => {
    let filtered = mcqQuizzes;

    // Filter by batch
    if (selectedBatch) {
      filtered = filtered.filter((a) => a.batchId === selectedBatch);
    }

    // Filter by chapter
    if (selectedChapter) {
      filtered = filtered.filter((a) => a.chapter === selectedChapter);
    }

    // Search by student name or ID
    if (searchTerm) {
      filtered = filtered.filter((attempt) => {
        const student = students.find((s) => s._id === attempt.studentId);
        return (
          student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student?.studentId.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "score-desc":
          return b.score - a.score;
        case "score-asc":
          return a.score - b.score;
        case "date-desc":
          return new Date(b.submittedAt) - new Date(a.submittedAt);
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    mcqQuizzes,
    selectedBatch,
    selectedChapter,
    searchTerm,
    sortBy,
    students,
  ]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (filteredAttempts.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        passRate: 0,
      };
    }

    const scores = filteredAttempts.map((a) => a.score);
    const averageScore = Math.round(
      scores.reduce((sum, s) => sum + s, 0) / scores.length
    );
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);
    const passCount = filteredAttempts.filter((a) => a.score >= 60).length;
    const passRate = Math.round((passCount / filteredAttempts.length) * 100);

    return {
      totalAttempts: filteredAttempts.length,
      averageScore,
      highestScore,
      lowestScore,
      passRate,
    };
  }, [filteredAttempts]);

  // Get student info
  const getStudentInfo = (studentId) => {
    return students.find((s) => s._id === studentId);
  };

  // Get batch info
  const getBatchInfo = (batchId) => {
    const batch = batches.find((b) => b._id === batchId);
    const course = courses.find((c) => c._id === batch?.courseId);
    return { batch, course };
  };

  // Export to CSV
  const handleExport = () => {
    if (filteredAttempts.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = [
      "Student ID",
      "Student Name",
      "Batch",
      "Chapter",
      "Score",
      "Correct",
      "Wrong",
      "Total Questions",
      "Time Taken (min)",
      "Submitted At",
    ];

    const rows = filteredAttempts.map((attempt) => {
      const student = getStudentInfo(attempt.studentId);
      const { batch } = getBatchInfo(attempt.batchId);

      return [
        student?.studentId || "",
        student?.name || "",
        batch?.batchName || "",
        attempt.chapter,
        attempt.score,
        attempt.correctAnswers,
        attempt.wrongAnswers,
        attempt.totalQuestions,
        Math.floor(attempt.timeTaken / 60),
        new Date(attempt.submittedAt).toLocaleString("en-GB"),
      ];
    });

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quiz-results-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Quiz Results Management</h2>
          <p className="text-gray-600 mt-1">
            View and analyze student quiz performance
          </p>
        </div>
        <button
          onClick={handleExport}
          className="btn btn-success gap-2"
          disabled={filteredAttempts.length === 0}
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-primary">
            <Users className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Attempts</div>
          <div className="stat-value text-primary">{stats.totalAttempts}</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-info">
            <Trophy className="w-8 h-8" />
          </div>
          <div className="stat-title">Average Score</div>
          <div className="stat-value text-info">{stats.averageScore}%</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-success">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div className="stat-title">Highest</div>
          <div className="stat-value text-success">{stats.highestScore}%</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-error">
            <TrendingDown className="w-8 h-8" />
          </div>
          <div className="stat-title">Lowest</div>
          <div className="stat-value text-error">{stats.lowestScore}%</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-accent">
            <Trophy className="w-8 h-8" />
          </div>
          <div className="stat-title">Pass Rate</div>
          <div className="stat-value text-accent">{stats.passRate}%</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Batch Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Batch</span>
              </label>
              <select
                className="select select-bordered"
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
              >
                <option value="">All Batches</option>
                {batches.map((batch) => {
                  const course = courses.find((c) => c._id === batch.courseId);
                  return (
                    <option key={batch._id} value={batch._id}>
                      {batch.batchName} - {course?.title}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Chapter Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Chapter</span>
              </label>
              <select
                className="select select-bordered"
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
              >
                <option value="">All Chapters</option>
                {availableChapters.map((chapter) => (
                  <option key={chapter} value={chapter}>
                    Chapter {chapter}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Sort By</span>
              </label>
              <select
                className="select select-bordered"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="score-desc">Score (High to Low)</option>
                <option value="score-asc">Score (Low to High)</option>
                <option value="date-desc">Date (Recent First)</option>
              </select>
            </div>

            {/* Search */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Search</span>
              </label>
              <div className="input-group">
                <span className="bg-base-200">
                  <Search className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  placeholder="Student name or ID..."
                  className="input input-bordered w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      {filteredAttempts.length === 0 ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No quiz attempts found</p>
          </div>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student</th>
                    <th>Batch</th>
                    <th>Chapter</th>
                    <th>Score</th>
                    <th>Correct/Total</th>
                    <th>Time</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttempts.map((attempt, index) => {
                    const student = getStudentInfo(attempt.studentId);
                    const { batch } = getBatchInfo(attempt.batchId);
                    const percentage = attempt.score;

                    return (
                      <tr key={attempt._id}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="w-10 h-10 rounded-full">
                                <img src={student?.image} alt={student?.name} />
                              </div>
                            </div>
                            <div>
                              <div className="font-semibold">
                                {student?.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {student?.studentId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-sm">{batch?.batchName}</td>
                        <td>
                          <span className="badge badge-primary">
                            Ch. {attempt.chapter}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              percentage >= 80
                                ? "badge-success"
                                : percentage >= 60
                                ? "badge-warning"
                                : "badge-error"
                            }`}
                          >
                            {percentage}%
                          </span>
                        </td>
                        <td>
                          <span className="font-semibold">
                            {attempt.correctAnswers}/{attempt.totalQuestions}
                          </span>
                        </td>
                        <td className="text-sm">
                          {Math.floor(attempt.timeTaken / 60)}m
                        </td>
                        <td className="text-sm">
                          {new Date(attempt.submittedAt).toLocaleDateString(
                            "en-GB"
                          )}
                        </td>
                        <td>
                          <button
                            onClick={() => setSelectedAttempt(attempt)}
                            className="btn btn-primary btn-sm gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedAttempt && (
        <QuizReviewModal
          attempt={selectedAttempt}
          onClose={() => setSelectedAttempt(null)}
        />
      )}
    </div>
  );
};

export default AdminQuizResults;
