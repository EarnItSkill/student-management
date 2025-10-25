import {
  Award,
  Calendar,
  Filter,
  Medal,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useAppContext } from "../context/useAppContext";

const RankPage = () => {
  const { students, batches, courses, quizzes, currentUser } = useAppContext();
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all"); // all, male, female
  const [timeFilter, setTimeFilter] = useState("all"); // all, month, year, all-time
  const [eiinFilter, setEiinFilter] = useState("all"); // College Code filter

  // Calculate rankings
  const rankings = useMemo(() => {
    // Get all quiz results with student and batch info
    const allResults = [];

    quizzes.forEach((quiz) => {
      quiz.results.forEach((result) => {
        const student = students.find((s) => s._id === result.studentId);
        const batch = batches.find((b) => b._id === result.batchId);
        const course = courses.find((c) => c._id === batch?.courseId);

        if (student && batch && course) {
          allResults.push({
            studentId: student._id,
            studentName: student.name,
            studentImage: student.image,
            gender: student.gender,
            eiin: student.eiin,
            batchId: batch._id,
            batchName: batch.batchName,
            courseId: course._id,
            courseName: course.title,
            quizTitle: quiz.title,
            score: result.score,
            totalMarks: quiz.totalMarks,
            submittedAt: new Date(result.submittedAt),
          });
        }
      });
    });

    // Filter by course
    let filteredResults =
      selectedCourse === "all"
        ? allResults
        : allResults.filter((r) => r.courseId === selectedCourse);

    // Filter by batch
    if (selectedBatch !== "all") {
      filteredResults = filteredResults.filter(
        (r) => r.batchId === selectedBatch
      );
    }

    // Filter by gender
    if (genderFilter !== "all") {
      filteredResults = filteredResults.filter(
        (r) => r.gender === genderFilter
      );
    }

    // Filter by EIIN (College Code)
    if (eiinFilter !== "all") {
      filteredResults = filteredResults.filter((r) => r.eiin === eiinFilter);
    }

    // Filter by time
    const now = new Date();
    if (timeFilter === "month") {
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      filteredResults = filteredResults.filter(
        (r) => r.submittedAt >= oneMonthAgo
      );
    } else if (timeFilter === "year") {
      const oneYearAgo = new Date(
        now.getFullYear() - 1,
        now.getMonth(),
        now.getDate()
      );
      filteredResults = filteredResults.filter(
        (r) => r.submittedAt >= oneYearAgo
      );
    }

    // Group by student and calculate total scores
    const studentScores = {};
    filteredResults.forEach((result) => {
      if (!studentScores[result.studentId]) {
        studentScores[result.studentId] = {
          studentId: result.studentId,
          studentName: result.studentName,
          studentImage: result.studentImage,
          gender: result.gender,
          eiin: result.eiin,
          totalScore: 0,
          totalMarks: 0,
          quizCount: 0,
          batches: new Set(),
          courses: new Set(),
        };
      }

      studentScores[result.studentId].totalScore += result.score;
      studentScores[result.studentId].totalMarks += result.totalMarks;
      studentScores[result.studentId].quizCount += 1;
      studentScores[result.studentId].batches.add(result.batchName);
      studentScores[result.studentId].courses.add(result.courseName);
    });

    // Convert to array and calculate percentage
    const rankingArray = Object.values(studentScores).map((student) => ({
      ...student,
      percentage:
        student.totalMarks > 0
          ? ((student.totalScore / student.totalMarks) * 100).toFixed(2)
          : 0,
      batches: Array.from(student.batches),
      courses: Array.from(student.courses),
    }));

    // Sort by percentage (descending)
    rankingArray.sort((a, b) => b.percentage - a.percentage);

    // Add rank
    rankingArray.forEach((student, index) => {
      student.rank = index + 1;
    });

    return rankingArray;
  }, [
    students,
    batches,
    courses,
    quizzes,
    selectedCourse,
    selectedBatch,
    genderFilter,
    timeFilter,
    eiinFilter,
  ]);

  // Get available courses for filter
  const availableCourses = useMemo(() => {
    return courses.filter((course) =>
      quizzes.some((quiz) =>
        batches.some(
          (batch) => batch.courseId === course._id && quiz.results.length > 0
        )
      )
    );
  }, [courses, quizzes, batches]);

  // Get available batches for selected course
  const availableBatches = useMemo(() => {
    if (selectedCourse === "all") return batches;
    return batches.filter((batch) => batch.courseId === selectedCourse);
  }, [batches, selectedCourse]);

  // Get unique EIINs from students
  const availableEIINs = useMemo(() => {
    const eiins = new Set();
    students.forEach((student) => {
      if (student.eiin) {
        eiins.add(student.eiin);
      }
    });
    return Array.from(eiins).sort();
  }, [students]);

  // Find current user's rank
  const currentUserRank = useMemo(() => {
    if (!currentUser) return null;
    return rankings.find((r) => r.studentId === currentUser._id);
  }, [rankings, currentUser]);

  // Get medal color
  const getMedalIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-8 h-8 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-8 h-8 text-gray-400" />;
    if (rank === 3) return <Medal className="w-8 h-8 text-amber-700" />;
    return <Award className="w-6 h-6 text-primary" />;
  };

  const getTimeFilterLabel = () => {
    switch (timeFilter) {
      case "month":
        return "This Month";
      case "year":
        return "This Year";
      case "all-time":
        return "All Time";
      default:
        return "All Time";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Trophy className="w-8 h-8 text-primary" />
          Student Rankings
        </h1>
        <p className="text-gray-400 mt-2">
          View student performance rankings based on quiz scores
        </p>
      </div>

      {/* Filters */}
      <div className="card bg-base-200 shadow-lg mb-6">
        <div className="card-body">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            Filters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Course Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Course</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  setSelectedBatch("all");
                }}
              >
                <option value="all">All Courses</option>
                {availableCourses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Batch Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Batch</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                disabled={selectedCourse === "all"}
              >
                <option value="all">All Batches</option>
                {availableBatches.map((batch) => (
                  <option key={batch._id} value={batch._id}>
                    {batch.batchName}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Gender</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
              >
                <option value="all">All (Combined)</option>
                <option value="male">Boys Only</option>
                <option value="female">Girls Only</option>
              </select>
            </div>

            {/* Time Period Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Time Period</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>

            {/* EIIN (College Code) Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">College (EIIN)</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={eiinFilter}
                onChange={(e) => setEiinFilter(e.target.value)}
              >
                <option value="all">All Colleges</option>
                {availableEIINs.map((eiin) => (
                  <option key={eiin} value={eiin}>
                    {eiin}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Current User's Rank */}
      {currentUserRank && (
        <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-xl mb-6">
          <div className="card-body">
            {/* <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              আপনার র‍্যাঙ্কিং
            </h3> */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">
                  #{currentUserRank.rank}
                </div>
                <div className="text-sm opacity-80">র‍্যাঙ্ক</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {currentUserRank.percentage}%
                </div>
                <div className="text-sm opacity-80">পারসেন্টেজ</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {currentUserRank.totalScore}/{currentUserRank.totalMarks}
                </div>
                <div className="text-sm opacity-80">মোট স্কোর</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {currentUserRank.quizCount}
                </div>
                <div className="text-sm opacity-80">কুইজ সম্পন্ন</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-primary">
            <Users className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Students</div>
          <div className="stat-value text-primary">{rankings.length}</div>
          <div className="stat-desc">{getTimeFilterLabel()}</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-success">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div className="stat-title">Average Score</div>
          <div className="stat-value text-success">
            {rankings.length > 0
              ? (
                  rankings.reduce(
                    (sum, s) => sum + parseFloat(s.percentage),
                    0
                  ) / rankings.length
                ).toFixed(1)
              : 0}
            %
          </div>
          <div className="stat-desc">Overall performance</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-warning">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Quizzes</div>
          <div className="stat-value text-warning">
            {rankings.reduce((sum, s) => sum + s.quizCount, 0)}
          </div>
          <div className="stat-desc">Completed</div>
        </div>
      </div>

      {/* Rankings Table */}
      {rankings.length === 0 ? (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body text-center py-20">
            <Trophy className="w-20 h-20 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Rankings Yet</h3>
            <p className="text-gray-500">
              No quiz results found for the selected filters
            </p>
          </div>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="font-bold text-xl mb-4">
              Rankings
              <span className="badge badge-primary badge-lg ml-2">
                {rankings.length} Students
              </span>
            </h3>

            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Student</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Quizzes</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((student) => (
                    <tr
                      key={student.studentId}
                      className={`hover ${
                        currentUser && student.studentId === currentUser._id
                          ? "bg-primary/10"
                          : ""
                      }`}
                    >
                      <td>
                        <div className="flex items-center gap-2">
                          {getMedalIcon(student.rank)}
                          <span className="font-bold text-lg">
                            #{student.rank}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-12 h-12 rounded-full">
                              <img
                                src={student.studentImage}
                                alt={student.studentName}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">
                              {student.studentName}
                              {currentUser &&
                                student.studentId === currentUser._id && (
                                  <span className="badge badge-sm badge-primary ml-2">
                                    You
                                  </span>
                                )}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student.gender === "male" ? "👦 Boy" : "👧 Girl"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="font-semibold">
                          {student.totalScore} / {student.totalMarks}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div
                            className={`badge badge-lg ${
                              student.percentage >= 80
                                ? "badge-success"
                                : student.percentage >= 60
                                ? "badge-warning"
                                : "badge-error"
                            }`}
                          >
                            {student.percentage}%
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-primary">
                          {student.quizCount} quizzes
                        </span>
                      </td>
                      <td>
                        <div className="text-xs space-y-1">
                          {student.courses.map((course, idx) => (
                            <div
                              key={idx}
                              className="badge badge-ghost badge-sm"
                            >
                              {course}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RankPage;
