import { ArrowLeft, BookOpen, Filter, Medal, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";

const McqRankPage = () => {
  const navigate = useNavigate();
  const { mcqQuizzes, students, batches, courses, currentUser } =
    useAppContext();

  const [genderFilter, setGenderFilter] = useState("all"); // all, male, female
  const [batchFilter, setBatchFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all"); // all, this-month, this-year
  const [collegeFilter, setCollegeFilter] = useState("all"); // EIIN number

  // Get unique EIINs (colleges)
  const colleges = useMemo(() => {
    const eiins = [...new Set(students.map((s) => s.eiin))];
    return eiins.filter((e) => e);
  }, [students]);

  // Calculate rankings
  const rankings = useMemo(() => {
    // Filter quizzes based on time
    let filteredQuizzes = mcqQuizzes;

    if (timeFilter === "this-month") {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      filteredQuizzes = filteredQuizzes.filter((quiz) => {
        const quizDate = new Date(quiz.submittedAt);
        return (
          quizDate.getMonth() === currentMonth &&
          quizDate.getFullYear() === currentYear
        );
      });
    } else if (timeFilter === "this-year") {
      const currentYear = new Date().getFullYear();

      filteredQuizzes = filteredQuizzes.filter((quiz) => {
        const quizDate = new Date(quiz.submittedAt);
        return quizDate.getFullYear() === currentYear;
      });
    }

    // Group by student and calculate average
    const studentScores = {};

    filteredQuizzes.forEach((quiz) => {
      if (!studentScores[quiz.studentId]) {
        studentScores[quiz.studentId] = {
          totalScore: 0,
          count: 0,
          quizzes: [],
        };
      }
      studentScores[quiz.studentId].totalScore += quiz.score;
      studentScores[quiz.studentId].count += 1;
      studentScores[quiz.studentId].quizzes.push(quiz);
    });

    // Calculate average and prepare ranking data
    const rankingData = Object.keys(studentScores).map((studentId) => {
      const student = students.find((s) => s._id === studentId);
      const data = studentScores[studentId];
      const averageScore = Math.round(data.totalScore / data.count);

      return {
        studentId,
        student,
        averageScore,
        totalQuizzes: data.count,
        quizzes: data.quizzes,
      };
    });

    // Filter by gender
    let filtered = rankingData;
    if (genderFilter !== "all") {
      filtered = filtered.filter((r) => r.student?.gender === genderFilter);
    }

    // Filter by batch
    if (batchFilter !== "all") {
      filtered = filtered.filter((r) => {
        return r.quizzes.some((q) => q.batchId === batchFilter);
      });
    }

    // Filter by college (EIIN)
    if (collegeFilter !== "all") {
      filtered = filtered.filter((r) => r.student?.eiin === collegeFilter);
    }

    // Sort by average score (descending)
    filtered.sort((a, b) => {
      if (b.averageScore === a.averageScore) {
        // If scores are equal, sort by total quizzes
        return b.totalQuizzes - a.totalQuizzes;
      }
      return b.averageScore - a.averageScore;
    });

    // Assign ranks (with tie handling)
    let currentRank = 1;
    let displayRank = 1;
    let previousScore = null;

    filtered.forEach((item, index) => {
      if (previousScore !== null && item.averageScore < previousScore) {
        currentRank = index + 1;
        displayRank = index + 1;
      } else if (
        previousScore !== null &&
        item.averageScore === previousScore
      ) {
        // Same score, keep display rank same but increment current rank
        currentRank = index + 1;
      }

      item.serialNumber = index + 1; // Sequential serial
      item.rank = displayRank; // Rank with ties

      previousScore = item.averageScore;
    });

    // Limit to top 50
    return filtered.slice(0, 50);
  }, [
    mcqQuizzes,
    students,
    genderFilter,
    batchFilter,
    timeFilter,
    collegeFilter,
  ]);

  // Find current user's rank
  const currentUserRank = useMemo(() => {
    if (!currentUser) return null;

    return rankings.find((r) => r.studentId === currentUser._id);
  }, [rankings, currentUser]);

  // Get medal icon
  const getMedalIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-700" />;
    return null;
  };

  // Get rank badge color
  const getRankBadgeColor = (rank) => {
    if (rank === 1) return "badge-warning";
    if (rank === 2) return "badge-info";
    if (rank === 3) return "badge-accent";
    return "badge-ghost";
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="btn btn-ghost gap-2">
            <ArrowLeft className="w-5 h-5" />
            ফিরে যান
          </button>
          <div className="flex items-center gap-3">
            <Trophy className="w-10 h-10 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">MCQ Quiz Rankings</h1>
              <p className="text-gray-600">Top 50 Performers</p>
            </div>
          </div>
        </div>

        {/* Current User Rank Card */}
        {currentUserRank && (
          <div className="card bg-gradient-to-br from-primary/20 to-secondary/20 shadow-xl mb-6 border-2 border-primary">
            <div className="card-body">
              {/* <h3 className="text-xl font-bold mb-3">Your Ranking</h3> */}
              <div className="flex items-center gap-6">
                <div className="avatar">
                  <div className="w-20 h-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img
                      src={currentUserRank.student?.image}
                      alt={currentUserRank.student?.name}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-2xl font-bold">
                      {currentUserRank.student?.name}
                    </h4>
                    {getMedalIcon(currentUserRank.rank)}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Position</p>
                      <p className="text-xl font-bold text-primary">
                        #{currentUserRank.rank}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Serial</p>
                      <p className="text-xl font-bold">
                        #{currentUserRank.serialNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avg Score</p>
                      <p className="text-xl font-bold text-success">
                        {currentUserRank.averageScore}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Quizzes</p>
                      <p className="text-xl font-bold">
                        {currentUserRank.totalQuizzes}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold">Filters</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Gender Filter */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Gender</span>
                </label>
                <select
                  className="select select-bordered"
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="male">ছেলে (Male)</option>
                  <option value="female">মেয়ে (Female)</option>
                </select>
              </div>

              {/* Batch Filter */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Batch</span>
                </label>
                <select
                  className="select select-bordered"
                  value={batchFilter}
                  onChange={(e) => setBatchFilter(e.target.value)}
                >
                  <option value="all">All Batches</option>
                  {batches.map((batch) => {
                    const course = courses.find(
                      (c) => c._id === batch.courseId
                    );
                    return (
                      <option key={batch._id} value={batch._id}>
                        {batch.batchName} - {course?.title}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Time Filter */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Time Period</span>
                </label>
                <select
                  className="select select-bordered"
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="this-month">This Month</option>
                  <option value="this-year">This Year</option>
                </select>
              </div>

              {/* College Filter */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    College (EIIN)
                  </span>
                </label>
                <select
                  className="select select-bordered"
                  value={collegeFilter}
                  onChange={(e) => setCollegeFilter(e.target.value)}
                >
                  <option value="all">All Colleges</option>
                  {colleges.map((eiin) => (
                    <option key={eiin} value={eiin}>
                      EIIN: {eiin}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Rankings Table */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="text-xl font-bold mb-4">
              Top {rankings.length} Students
            </h3>

            {rankings.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No rankings available</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Serial</th>
                      <th>Rank</th>
                      <th>Student</th>
                      <th>Gender</th>
                      <th>EIIN</th>
                      <th>Avg Score</th>
                      <th>Quizzes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.map((item) => {
                      const isCurrentUser =
                        currentUser && item.studentId === currentUser._id;

                      return (
                        <tr
                          key={item.studentId}
                          className={
                            isCurrentUser ? "bg-primary/10 font-semibold" : ""
                          }
                        >
                          <td className="font-mono">#{item.serialNumber}</td>
                          <td>
                            <div className="flex items-center gap-2">
                              {getMedalIcon(item.rank)}
                              <span
                                className={`badge ${getRankBadgeColor(
                                  item.rank
                                )}`}
                              >
                                #{item.rank}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="avatar">
                                <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                                  <img
                                    src={item.student?.image}
                                    alt={item.student?.name}
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="font-semibold">
                                  {item.student?.name}
                                  {isCurrentUser && (
                                    <span className="badge badge-primary badge-sm ml-2">
                                      You
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {item.student?.studentId}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                item.student?.gender === "male"
                                  ? "badge-info"
                                  : "badge-secondary"
                              }`}
                            >
                              {item.student?.gender === "male"
                                ? "ছেলে"
                                : "মেয়ে"}
                            </span>
                          </td>
                          <td className="text-sm">{item.student?.eiin}</td>
                          <td>
                            <span
                              className={`badge badge-lg ${
                                item.averageScore >= 80
                                  ? "badge-success"
                                  : item.averageScore >= 60
                                  ? "badge-warning"
                                  : "badge-error"
                              }`}
                            >
                              {item.averageScore}%
                            </span>
                          </td>
                          <td>
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4 text-primary" />
                              <span className="font-semibold">
                                {item.totalQuizzes}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default McqRankPage;
