{
  activeTab === "quizzes" && (
    <div>
      {!selectedBatchForQuiz ? (
        // Batch Selection View
        <div>
          <h2 className="text-2xl font-bold mb-6">My Quizzes - Select Batch</h2>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="stat bg-base-200 rounded-lg shadow-lg">
              <div className="stat-figure text-primary">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="stat-title">My Batches</div>
              <div className="stat-value text-primary">{myBatches.length}</div>
            </div>
            <div className="stat bg-base-200 rounded-lg shadow-lg">
              <div className="stat-figure text-success">
                <Award className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Quizzes</div>
              <div className="stat-value text-success">{myQuizzes.length}</div>
            </div>
            <div className="stat bg-base-200 rounded-lg shadow-lg">
              <div className="stat-figure text-warning">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="stat-title">Completed</div>
              <div className="stat-value text-warning">{completedQuizzes}</div>
            </div>
          </div>

          {/* Batch Cards */}
          {myBatches.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-20 h-20 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Batches Found</h3>
              <p className="text-gray-500">
                You are not enrolled in any batch yet
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myBatches.map((batch) => {
                const course = courses.find((c) => c._id === batch.courseId);
                const batchQuizzes = myQuizzes.filter(
                  (q) => q.batchId === batch._id
                );
                const completedInBatch = batchQuizzes.filter((quiz) =>
                  quiz.results.some((r) => r.studentId === currentUser?._id)
                ).length;

                return (
                  <div
                    key={batch._id}
                    onClick={() => setSelectedBatchForQuiz(batch._id)}
                    className="card bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg hover:shadow-2xl transition-all cursor-pointer border-2 border-primary/20 hover:border-primary/50"
                  >
                    <div className="card-body">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="card-title text-lg">
                            {batch.batchName}
                          </h3>
                          <p className="text-sm text-gray-400 mt-1">
                            {course?.title || "No Course"}
                          </p>
                        </div>
                        <BookOpen className="w-8 h-8 text-primary flex-shrink-0" />
                      </div>

                      <div className="divider my-2"></div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Schedule:</span>
                          <span className="font-semibold text-xs">
                            {batch.schedule}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Quizzes:</span>
                          <span className="badge badge-primary">
                            {batchQuizzes.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Completed:</span>
                          <span className="badge badge-success">
                            {completedInBatch}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Pending:</span>
                          <span className="badge badge-warning">
                            {batchQuizzes.length - completedInBatch}
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
          )}
        </div>
      ) : (
        // Quiz List View for Selected Batch
        <div>
          {/* Header with Back Button */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => {
                setSelectedBatchForQuiz(null);
                setQuizSearchTerm("");
              }}
              className="btn btn-ghost btn-sm gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <div>
              <h2 className="text-2xl font-bold">
                {
                  myBatches.find((b) => b._id === selectedBatchForQuiz)
                    ?.batchName
                }
              </h2>
              <p className="text-sm text-gray-400">
                {
                  courses.find(
                    (c) =>
                      c._id ===
                      myBatches.find((b) => b._id === selectedBatchForQuiz)
                        ?.courseId
                  )?.title
                }
              </p>
            </div>
          </div>

          {/* Batch Quiz Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="stat bg-base-200 rounded-lg shadow-lg">
              <div className="stat-figure text-primary">
                <Award className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Quizzes</div>
              <div className="stat-value text-primary">
                {
                  myQuizzes.filter((q) => q.batchId === selectedBatchForQuiz)
                    .length
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
                  myQuizzes
                    .filter((q) => q.batchId === selectedBatchForQuiz)
                    .filter((quiz) =>
                      quiz.results.some((r) => r.studentId === currentUser?._id)
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
                {
                  myQuizzes
                    .filter((q) => q.batchId === selectedBatchForQuiz)
                    .filter(
                      (quiz) =>
                        !quiz.results.some(
                          (r) => r.studentId === currentUser?._id
                        )
                    ).length
                }
              </div>
            </div>
          </div>

          {/* Search and View Toggle */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="form-control flex-1">
              <div className="input-group">
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

          {/* Quiz Display */}
          {(() => {
            const batchQuizzes = myQuizzes
              .filter((q) => q.batchId === selectedBatchForQuiz)
              .filter((q) =>
                q.title.toLowerCase().includes(quizSearchTerm.toLowerCase())
              );

            if (batchQuizzes.length === 0) {
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
                      : "No quizzes have been assigned to this batch yet"}
                  </p>
                </div>
              );
            }

            return (
              <>
                {quizSearchTerm && (
                  <div className="alert alert-info mb-4">
                    <span>
                      Found {batchQuizzes.length} quiz(es) matching "
                      {quizSearchTerm}"
                    </span>
                  </div>
                )}

                {quizViewType === "grid" ? (
                  // Grid View
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {batchQuizzes.map((quiz) => {
                      const myResult = quiz.results.find(
                        (r) => r.studentId === currentUser?._id
                      );
                      const batch = batches.find(
                        (b) => b._id === quiz.courseId
                        // (b) => b._id === quiz.batchId
                      );
                      const percentage = myResult
                        ? ((myResult.score / quiz.totalMarks) * 100).toFixed(1)
                        : 0;

                      return (
                        <div
                          key={quiz._id}
                          className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all"
                        >
                          <div className="card-body">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="card-title text-lg">
                                  {quiz.title}
                                </h3>
                                <p className="text-sm text-gray-400 mt-1">
                                  Batch: {batch?.batchName}
                                </p>
                              </div>
                              <Award className="w-8 h-8 text-primary flex-shrink-0" />
                            </div>

                            <div className="divider my-2"></div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">
                                  Questions:
                                </span>
                                <span className="font-semibold">
                                  {quiz.questions.length}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">
                                  Total Marks:
                                </span>
                                <span className="font-semibold">
                                  {quiz.totalMarks}
                                </span>
                              </div>
                              {myResult && (
                                <>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">
                                      Your Score:
                                    </span>
                                    <span className="font-bold text-primary">
                                      {myResult.score}/{quiz.totalMarks}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">
                                      Percentage:
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
                                        ? "Excellent!"
                                        : percentage >= 60
                                        ? "Good Job!"
                                        : "Need Improvement"}
                                    </div>
                                    <div className="text-sm">
                                      Submitted:{" "}
                                      {new Date(
                                        myResult.submittedAt
                                      ).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>

                                <button
                                  onClick={() =>
                                    setResultModal({ isOpen: true, quiz })
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
                                  setQuizModal({ isOpen: true, quiz })
                                }
                                className="btn btn-primary btn-block mt-4 gap-2"
                              >
                                <Clock className="w-5 h-5" />
                                Take Quiz
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // Table View
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
                        {batchQuizzes.map((quiz, index) => {
                          const myResult = quiz.results.find(
                            (r) => r.studentId === currentUser?._id
                          );
                          const percentage = myResult
                            ? (
                                (myResult.score / quiz.totalMarks) *
                                100
                              ).toFixed(1)
                            : 0;

                          return (
                            <tr key={quiz._id} className="hover">
                              <td>{index + 1}</td>
                              <td>
                                <div className="flex items-center gap-2">
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
                                {myResult ? (
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
                                {myResult ? (
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
                                {myResult ? (
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
                                      setQuizModal({ isOpen: true, quiz })
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
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
