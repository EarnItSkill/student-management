import {
  AlertCircle,
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Eye,
  Grid,
  ListIcon,
  Lock,
  Search,
} from "lucide-react";
import { useState } from "react";
import TakeQuiz from "../../components/quizzes/TakeQuiz";
import ViewQuizResult from "../../components/quizzes/ViewQuizResult";
import { useAppContext } from "../../context/useAppContext";

const QuizzesTab = ({
  enrolledCourseIds,
  myQuizzesWithStatus,
  completedQuizzes,
  lockedPendingQuizzes,
  selectedBatchForQuiz,
  setSelectedBatchForQuiz,
}) => {
  const { courses, currentUser } = useAppContext();
  const [courseCurrentPage, setCourseCurrentPage] = useState(1);
  const [quizCurrentPage, setQuizCurrentPage] = useState(1);
  const [quizViewType, setQuizViewType] = useState("grid");
  const [quizSearchTerm, setQuizSearchTerm] = useState("");
  const [quizModal, setQuizModal] = useState({ isOpen: false, quiz: null });
  const [resultModal, setResultModal] = useState({ isOpen: false, quiz: null });
  const itemsPerPage = 12;

  return (
    <div>
      {!selectedBatchForQuiz ? (
        // ========================
        // COURSE SELECTION VIEW
        // ========================
        <div>
          <h2 className="text-2xl font-bold mb-6">
            My Quizzes - Select Course
          </h2>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="stat bg-base-200 rounded-lg shadow-lg">
              <div className="stat-figure text-primary">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="stat-title">My Courses</div>
              <div className="stat-value text-primary">
                {enrolledCourseIds.length}
              </div>
            </div>
            <div className="stat bg-base-200 rounded-lg shadow-lg">
              <div className="stat-figure text-success">
                <Award className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Quizzes</div>
              <div className="stat-value text-success">
                {myQuizzesWithStatus.length}
              </div>
            </div>
            <div className="stat bg-base-200 rounded-lg shadow-lg">
              <div className="stat-figure text-warning">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="stat-title">Completed</div>
              <div className="stat-value text-warning">{completedQuizzes}</div>
            </div>
          </div>

          {/* Course Cards */}
          {enrolledCourseIds.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-20 h-20 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Courses Found</h3>
              <p className="text-gray-500">
                You are not enrolled in any course yet
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourseIds
                  .slice(
                    (courseCurrentPage - 1) * itemsPerPage,
                    courseCurrentPage * itemsPerPage
                  )
                  .map((courseId) => {
                    const course = courses.find((c) => c._id === courseId);
                    // ✅ ObjectId comparison fix
                    const courseQuizzes = myQuizzesWithStatus.filter(
                      (q) => q.courseId?.toString() === courseId?.toString()
                    );
                    // ✅ ObjectId comparison fix
                    const completedInCourse = courseQuizzes.filter((quiz) =>
                      quiz.results.some(
                        (r) =>
                          r.studentId?.toString() ===
                          currentUser?._id?.toString()
                      )
                    ).length;
                    const unlockedCount = courseQuizzes.filter(
                      (q) => q.isUnlocked
                    ).length;

                    return (
                      <div
                        key={courseId}
                        onClick={() => {
                          setSelectedBatchForQuiz(courseId);
                          setQuizCurrentPage(1);
                        }}
                        className="card bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg hover:shadow-2xl transition-all cursor-pointer border-2 border-primary/20 hover:border-primary/50"
                      >
                        <div className="card-body">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h3 className="card-title text-lg">
                                {course?.title || "Unknown Course"}
                              </h3>
                              <p className="text-sm text-gray-400 mt-1">
                                {course?.description?.substring(0, 50)}
                                ...
                              </p>
                            </div>
                            <BookOpen className="w-8 h-8 text-primary flex-shrink-0" />
                          </div>

                          <div className="divider my-2"></div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                Total Quizzes:
                              </span>
                              <span className="badge badge-primary">
                                {courseQuizzes.length}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Unlocked:</span>
                              <span className="badge badge-info">
                                {unlockedCount}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Completed:</span>
                              <span className="badge badge-success">
                                {completedInCourse}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Pending:</span>
                              <span className="badge badge-warning">
                                {lockedPendingQuizzes}
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
                    );
                  })}
              </div>

              {/* Course Pagination */}
              {enrolledCourseIds.length > itemsPerPage && (
                <div className="flex justify-center mt-8">
                  <div className="btn-group">
                    <button
                      className="btn btn-sm"
                      onClick={() =>
                        setCourseCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={courseCurrentPage === 1}
                    >
                      «
                    </button>
                    {Array.from(
                      {
                        length: Math.ceil(
                          enrolledCourseIds.length / itemsPerPage
                        ),
                      },
                      (_, i) => i + 1
                    ).map((page) => (
                      <button
                        key={page}
                        className={`btn btn-sm ${
                          courseCurrentPage === page ? "btn-active" : ""
                        }`}
                        onClick={() => setCourseCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      className="btn btn-sm"
                      onClick={() =>
                        setCourseCurrentPage((prev) =>
                          Math.min(
                            Math.ceil(enrolledCourseIds.length / itemsPerPage),
                            prev + 1
                          )
                        )
                      }
                      disabled={
                        courseCurrentPage ===
                        Math.ceil(enrolledCourseIds.length / itemsPerPage)
                      }
                    >
                      »
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        // ========================
        // QUIZ LIST VIEW
        // ========================
        <div>
          {/* Header with Back Button */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => {
                setSelectedBatchForQuiz(null);
                setQuizSearchTerm("");
                setQuizCurrentPage(1);
              }}
              className="btn btn-ghost btn-sm gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <div>
              <h2 className="text-2xl font-bold">
                {courses.find((c) => c._id === selectedBatchForQuiz)?.title}
              </h2>
              <p className="text-sm text-gray-400">
                {
                  courses.find((c) => c._id === selectedBatchForQuiz)
                    ?.description
                }
              </p>
            </div>
          </div>

          {/* Course Quiz Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="stat bg-base-200 rounded-lg shadow-lg">
              <div className="stat-figure text-primary">
                <Award className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Quizzes</div>
              <div className="stat-value text-primary">
                {
                  myQuizzesWithStatus.filter(
                    (q) =>
                      q.courseId?.toString() ===
                      selectedBatchForQuiz?.toString()
                  ).length
                }
              </div>
            </div>
            <div className="stat bg-base-200 rounded-lg shadow-lg">
              <div className="stat-figure text-info">
                <Lock className="w-8 h-8" />
              </div>
              <div className="stat-title">Unlocked</div>
              <div className="stat-value text-info">
                {
                  myQuizzesWithStatus
                    .filter(
                      (q) =>
                        q.courseId?.toString() ===
                        selectedBatchForQuiz?.toString()
                    )
                    .filter((q) => q.isUnlocked).length
                }
              </div>
            </div>
            <div className="stat bg-base-200 rounded-lg shadow-lg">
              <div className="stat-figure text-success">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="stat-title">Completed</div>
              <div className="stat-value text-success">
                {
                  myQuizzesWithStatus
                    .filter(
                      (q) =>
                        q.courseId?.toString() ===
                        selectedBatchForQuiz?.toString()
                    )
                    .filter((quiz) =>
                      quiz.results.some(
                        (r) =>
                          r.studentId?.toString() ===
                          currentUser?._id?.toString()
                      )
                    ).length
                }
              </div>
            </div>
            <div className="stat bg-base-200 rounded-lg shadow-lg">
              <div className="stat-figure text-warning">
                <Clock className="w-8 h-8" />
              </div>
              <div className="stat-title">Pending</div>
              <div className="stat-value text-warning">
                {lockedPendingQuizzes}
              </div>
            </div>
          </div>

          {/* Search and View Toggle */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="form-control flex-1">
              <div className="input-group flex justify-center items-center gap-3">
                <span>
                  <Search className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  placeholder="Search quizzes..."
                  className="input input-bordered w-full"
                  value={quizSearchTerm}
                  onChange={(e) => {
                    setQuizSearchTerm(e.target.value);
                    setQuizCurrentPage(1);
                  }}
                />
              </div>
            </div>

            <div className="btn-group">
              <button
                className={`btn ${quizViewType === "grid" ? "btn-active" : ""}`}
                onClick={() => setQuizViewType("grid")}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                className={`btn ${
                  quizViewType === "table" ? "btn-active" : ""
                }`}
                onClick={() => setQuizViewType("table")}
              >
                <ListIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quiz Display - Grid or Table */}
          {(() => {
            // ✅ ObjectId comparison fix
            const courseQuizzes = myQuizzesWithStatus
              .filter(
                (q) =>
                  q.courseId?.toString() === selectedBatchForQuiz?.toString()
              )
              .filter((q) =>
                q.title.toLowerCase().includes(quizSearchTerm.toLowerCase())
              );

            const totalPages = Math.ceil(courseQuizzes.length / itemsPerPage);
            const paginatedQuizzes = courseQuizzes.slice(
              (quizCurrentPage - 1) * itemsPerPage,
              quizCurrentPage * itemsPerPage
            );

            if (courseQuizzes.length === 0) {
              return (
                <div className="text-center py-20">
                  <Award className="w-20 h-20 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {quizSearchTerm
                      ? "No quizzes found"
                      : "No Quizzes Available"}
                  </h3>
                  <p className="text-gray-500">
                    {quizSearchTerm
                      ? `No quizzes matching "${quizSearchTerm}"`
                      : "No quizzes have been assigned to this course yet"}
                  </p>
                </div>
              );
            }

            return (
              <>
                {quizSearchTerm && (
                  <div className="alert alert-info mb-4">
                    <span>
                      Found {courseQuizzes.length} quiz(es) matching "
                      {quizSearchTerm}"
                    </span>
                  </div>
                )}

                {quizViewType === "grid" ? (
                  // ========================
                  // GRID VIEW
                  // ========================
                  <>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                      {paginatedQuizzes.map((quiz) => {
                        // ✅ ObjectId comparison fix
                        const myResult = quiz.results.find(
                          (r) =>
                            r.studentId?.toString() ===
                            currentUser?._id?.toString()
                        );
                        const course = courses.find(
                          (c) => c._id === quiz.courseId
                        );
                        const percentage = myResult
                          ? ((myResult.score / quiz.totalMarks) * 100).toFixed(
                              1
                            )
                          : 0;

                        return (
                          <div
                            key={quiz._id}
                            className={`card shadow-xl hover:shadow-2xl transition-all ${
                              !quiz.isUnlocked
                                ? "bg-base-300 opacity-75"
                                : "bg-base-200"
                            }`}
                          >
                            <div className="card-body">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h3 className="card-title text-lg">
                                    {quiz.title}
                                  </h3>
                                  <p className="text-sm text-gray-400 mt-1">
                                    কোর্স: {course?.title}
                                  </p>
                                  <div className="flex gap-2 mt-2">
                                    {!quiz.isUnlocked && (
                                      <div className="badge badge-error badge-sm gap-1">
                                        <Lock className="w-3 h-3" />
                                        Locked
                                      </div>
                                    )}
                                    <div className="badge badge-neutral badge-sm">
                                      MCQ নং #{quiz.quizIndex + 1}
                                    </div>
                                  </div>
                                </div>
                                <Award className="w-8 h-8 text-primary flex-shrink-0" />
                              </div>

                              <div className="divider my-2"></div>

                              {!quiz.isUnlocked ? (
                                <div
                                  className={`alert ${
                                    !quiz.isUnlocked && quiz.isPending
                                      ? "bg-error/20 border-2 border-error"
                                      : "alert-warning"
                                  }`}
                                >
                                  <AlertCircle className="w-5 h-5" />
                                  <div className="text-sm">
                                    <div className="font-bold">
                                      {quiz.isDateUnlocked
                                        ? "কুইজ Pending"
                                        : "কুইজ Locked"}
                                    </div>
                                    {quiz.quizIndex === 0 ? (
                                      <div>
                                        Unlocks on:{" "}
                                        {new Date(
                                          quiz.unlockDate
                                        ).toLocaleDateString("en-GB", {
                                          weekday: "short",
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                        })}
                                      </div>
                                    ) : quiz.isDateUnlocked ? (
                                      <div>
                                        আনলক করার জন্য আগের কুইজ সম্পন্ন করুন
                                      </div>
                                    ) : (
                                      <div>
                                        কুইজ সম্পন্ন করুন #{quiz.quizIndex} এবং
                                        অপেক্ষা করুন{" "}
                                        {new Date(
                                          quiz.unlockDate
                                        ).toLocaleDateString("en-GB")}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-400">
                                        মোট প্রশ্ন:
                                      </span>
                                      <span className="font-semibold">
                                        {quiz.questions.length}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-400">
                                        মোট মার্ক:
                                      </span>
                                      <span className="font-semibold">
                                        {quiz.totalMarks}
                                      </span>
                                    </div>
                                    {myResult && (
                                      <>
                                        <div className="flex justify-between text-sm">
                                          <span className="text-gray-400">
                                            তোমার মার্ক:
                                          </span>
                                          <span className="font-bold text-primary">
                                            {myResult.score}/{quiz.totalMarks}
                                          </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                          <span className="text-gray-400">
                                            গড় মার্ক:
                                          </span>
                                          <span
                                            className={`font-bold ${
                                              percentage >= 80
                                                ? "text-success"
                                                : percentage >= 60
                                                ? "text-warning"
                                                : "text-error"
                                            }`}
                                          >
                                            {percentage}%
                                          </span>
                                        </div>
                                      </>
                                    )}
                                  </div>

                                  {myResult ? (
                                    <div className="space-y-3 mt-4">
                                      <div
                                        className={`alert ${
                                          percentage >= 80
                                            ? "alert-success"
                                            : percentage >= 60
                                            ? "alert-warning"
                                            : "alert-error"
                                        }`}
                                      >
                                        <CheckCircle className="w-6 h-6" />
                                        <div>
                                          <div className="font-bold">
                                            {percentage >= 80
                                              ? "অসাধারণ!"
                                              : percentage >= 60
                                              ? "দারুণ!"
                                              : "উন্নতি প্রয়োজন"}
                                          </div>
                                          <div className="text-sm">
                                            সাবমিটেড:{" "}
                                            {new Date(
                                              myResult.submittedAt
                                            ).toLocaleDateString()}
                                          </div>
                                        </div>
                                      </div>

                                      <button
                                        onClick={() =>
                                          setResultModal({
                                            isOpen: true,
                                            quiz,
                                          })
                                        }
                                        className="btn btn-outline btn-primary btn-block gap-2"
                                      >
                                        <Eye className="w-5 h-5" />
                                        View Result & Answers
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        setQuizModal({
                                          isOpen: true,
                                          quiz,
                                        })
                                      }
                                      className="btn btn-primary btn-block mt-4 gap-2"
                                    >
                                      <Clock className="w-5 h-5" />
                                      Take Quiz
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Grid Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center mt-8">
                        <div className="btn-group">
                          <button
                            className="btn btn-sm"
                            onClick={() =>
                              setQuizCurrentPage((prev) =>
                                Math.max(1, prev - 1)
                              )
                            }
                            disabled={quizCurrentPage === 1}
                          >
                            «
                          </button>
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <button
                              key={page}
                              className={`btn btn-sm ${
                                quizCurrentPage === page ? "btn-active" : ""
                              }`}
                              onClick={() => setQuizCurrentPage(page)}
                            >
                              {page}
                            </button>
                          ))}
                          <button
                            className="btn btn-sm"
                            onClick={() =>
                              setQuizCurrentPage((prev) =>
                                Math.min(totalPages, prev + 1)
                              )
                            }
                            disabled={quizCurrentPage === totalPages}
                          >
                            »
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  // ========================
                  // TABLE VIEW
                  // ========================
                  <>
                    <div className="overflow-x-auto">
                      <table className="table table-zebra w-full">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Quiz Title</th>
                            <th>Questions</th>
                            <th>Total Marks</th>
                            <th>Status</th>
                            <th>Score</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedQuizzes.map((quiz, index) => {
                            // ✅ ObjectId comparison fix
                            const myResult = quiz.results.find(
                              (r) =>
                                r.studentId?.toString() ===
                                currentUser?._id?.toString()
                            );
                            const percentage = myResult
                              ? (
                                  (myResult.score / quiz.totalMarks) *
                                  100
                                ).toFixed(1)
                              : 0;
                            const globalIndex =
                              (quizCurrentPage - 1) * itemsPerPage + index + 1;

                            return (
                              <tr
                                key={quiz._id}
                                className={`hover ${
                                  !quiz.isUnlocked ? "opacity-60" : ""
                                }`}
                              >
                                <td>{globalIndex}</td>
                                <td>
                                  <div className="flex items-center gap-2">
                                    {!quiz.isUnlocked && (
                                      <Lock className="w-4 h-4 text-error" />
                                    )}
                                    <Award className="w-5 h-5 text-primary" />
                                    <span className="font-semibold">
                                      {quiz.title}
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <span className="badge badge-primary">
                                    {quiz.questions.length}
                                  </span>
                                </td>
                                <td>
                                  <span className="badge badge-info">
                                    {quiz.totalMarks}
                                  </span>
                                </td>
                                <td>
                                  {!quiz.isUnlocked ? (
                                    <span className="badge badge-error gap-1">
                                      <Lock className="w-3 h-3" />
                                      Locked
                                    </span>
                                  ) : myResult ? (
                                    <span
                                      className={`badge ${
                                        percentage >= 80
                                          ? "badge-success"
                                          : percentage >= 60
                                          ? "badge-warning"
                                          : "badge-error"
                                      }`}
                                    >
                                      Completed
                                    </span>
                                  ) : (
                                    <span className="badge badge-ghost">
                                      Pending
                                    </span>
                                  )}
                                </td>
                                <td>
                                  {!quiz.isUnlocked ? (
                                    <span className="text-gray-400 text-xs">
                                      {quiz.quizIndex === 0
                                        ? new Date(
                                            quiz.unlockDate
                                          ).toLocaleDateString("en-GB")
                                        : `Complete Quiz #${quiz.quizIndex}`}
                                    </span>
                                  ) : myResult ? (
                                    <div className="flex flex-col">
                                      <span className="font-bold">
                                        {myResult.score}/{quiz.totalMarks}
                                      </span>
                                      <span
                                        className={`text-xs ${
                                          percentage >= 80
                                            ? "text-success"
                                            : percentage >= 60
                                            ? "text-warning"
                                            : "text-error"
                                        }`}
                                      >
                                        {percentage}%
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </td>
                                <td>
                                  {!quiz.isUnlocked ? (
                                    <button
                                      className="btn btn-ghost btn-xs gap-1"
                                      disabled
                                    >
                                      <Lock className="w-4 h-4" />
                                      Locked
                                    </button>
                                  ) : myResult ? (
                                    <button
                                      onClick={() =>
                                        setResultModal({
                                          isOpen: true,
                                          quiz,
                                        })
                                      }
                                      className="btn btn-ghost btn-xs gap-1"
                                      title="View Result"
                                    >
                                      <Eye className="w-4 h-4" />
                                      View
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        setQuizModal({
                                          isOpen: true,
                                          quiz,
                                        })
                                      }
                                      className="btn btn-primary btn-xs gap-1"
                                      title="Take Quiz"
                                    >
                                      <Clock className="w-4 h-4" />
                                      Start
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Table Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center mt-8">
                        <div className="btn-group">
                          <button
                            className="btn btn-sm"
                            onClick={() =>
                              setQuizCurrentPage((prev) =>
                                Math.max(1, prev - 1)
                              )
                            }
                            disabled={quizCurrentPage === 1}
                          >
                            «
                          </button>
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <button
                              key={page}
                              className={`btn btn-sm ${
                                quizCurrentPage === page ? "btn-active" : ""
                              }`}
                              onClick={() => setQuizCurrentPage(page)}
                            >
                              {page}
                            </button>
                          ))}
                          <button
                            className="btn btn-sm"
                            onClick={() =>
                              setQuizCurrentPage((prev) =>
                                Math.min(totalPages, prev + 1)
                              )
                            }
                            disabled={quizCurrentPage === totalPages}
                          >
                            »
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            );
          })()}
        </div>
      )}

      {/* ======================== */}
      {/* QUIZ TAKING MODAL */}
      {/* ======================== */}
      {quizModal.isOpen && quizModal.quiz && (
        <TakeQuiz
          quiz={quizModal.quiz}
          onClose={() => setQuizModal({ isOpen: false, quiz: null })}
          onSuccess={() => {
            setQuizModal({ isOpen: false, quiz: null });
          }}
        />
      )}

      {/* ======================== */}
      {/* VIEW RESULT MODAL */}
      {/* ======================== */}
      {resultModal.isOpen && resultModal.quiz && (
        <ViewQuizResult
          quiz={resultModal.quiz}
          studentId={currentUser?._id}
          onClose={() => setResultModal({ isOpen: false, quiz: null })}
        />
      )}
    </div>
  );
};

export default QuizzesTab;
