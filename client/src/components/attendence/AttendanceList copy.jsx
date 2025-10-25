import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle,
  Edit,
  Grid,
  List as ListIcon,
  Plus,
  Search,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../../context/useAppContext";

const AttendanceList = ({ onAdd, onEdit }) => {
  const { attendance, students, batches, courses } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [dateFilter, setDateFilter] = useState("");
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [viewType, setViewType] = useState("table"); // "table" or "cards"

  // Group attendance by batch
  const batchesWithAttendance = batches.map((batch) => {
    const batchAttendance = attendance.filter((a) => a.batchId === batch._id);
    const course = courses.find((c) => c._id === batch.courseId);
    const presentCount = batchAttendance.filter(
      (a) => a.status === "present"
    ).length;
    const absentCount = batchAttendance.filter(
      (a) => a.status === "absent"
    ).length;
    const attendanceRate =
      batchAttendance.length > 0
        ? ((presentCount / batchAttendance.length) * 100).toFixed(1)
        : 0;

    return {
      ...batch,
      course,
      attendanceRecords: batchAttendance,
      presentCount,
      absentCount,
      attendanceRate,
    };
  });

  // Filter batches based on search
  const filteredBatches = batchesWithAttendance.filter(
    (batch) =>
      batch.batchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.course?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected batch details
  const selectedBatchData = selectedBatch
    ? batchesWithAttendance.find((b) => b._id === selectedBatch)
    : null;

  const handleBackToBatches = () => {
    setSelectedBatch(null);
    setSearchTerm("");
    setDateFilter("");
    setStudentSearchTerm("");
  };

  // Show Batch List View
  if (!selectedBatch) {
    return (
      <div>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold">
            Attendance Management - Select Batch
          </h2>
          <button onClick={onAdd} className="btn btn-primary gap-2">
            <Plus className="w-5 h-5" />
            Mark Attendance
          </button>
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
              <Calendar className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Records</div>
            <div className="stat-value text-success">{attendance.length}</div>
          </div>
          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-figure text-info">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="stat-title">Overall Rate</div>
            <div className="stat-value text-info">
              {attendance.length > 0
                ? (
                    (attendance.filter((a) => a.status === "present").length /
                      attendance.length) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="form-control mb-6">
          <div className="input-group flex items-center gap-3">
            <span className="bg-base-200">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search batches or courses..."
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
                      <p className="text-sm text-gray-400 mt-1">
                        {batch.course?.title || "No Course"}
                      </p>
                    </div>
                    <Calendar className="w-8 h-8 text-primary flex-shrink-0" />
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
                      <span className="text-gray-400">Total Records:</span>
                      <span className="badge badge-primary">
                        {batch.attendanceRecords.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Present:</span>
                      <span className="badge badge-success">
                        {batch.presentCount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Absent:</span>
                      <span className="badge badge-error">
                        {batch.absentCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Attendance Rate:</span>
                      <span className="font-bold text-info">
                        {batch.attendanceRate}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <button className="btn btn-primary btn-sm w-full">
                      View Attendance
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

  // Show Attendance List for Selected Batch
  const batchAttendance = attendance
    .filter((a) => a.batchId === selectedBatch)
    .filter((a) => {
      const student = students.find((s) => s._id === a.studentId);
      const matchesStudent =
        !studentSearchTerm ||
        student?.name.toLowerCase().includes(studentSearchTerm.toLowerCase());
      const matchesDate = !dateFilter || a.date === dateFilter;
      return matchesStudent && matchesDate;
    });

  const presentCount = batchAttendance.filter(
    (a) => a.status === "present"
  ).length;
  const absentCount = batchAttendance.filter(
    (a) => a.status === "absent"
  ).length;
  const attendanceRate =
    batchAttendance.length > 0
      ? ((presentCount / batchAttendance.length) * 100).toFixed(1)
      : 0;

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
          Mark Attendance
        </button>
      </div>

      {/* Batch Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-primary">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="stat-title">Attendance Rate</div>
          <div className="stat-value text-primary">{attendanceRate}%</div>
          <div className="stat-desc">
            {presentCount}/{batchAttendance.length} present
          </div>
        </div>
        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-success">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div className="stat-title">Present</div>
          <div className="stat-value text-success">{presentCount}</div>
        </div>
        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-error">
            <XCircle className="w-8 h-8" />
          </div>
          <div className="stat-title">Absent</div>
          <div className="stat-value text-error">{absentCount}</div>
        </div>
      </div>

      {/* Search, Filters and View Toggle */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="form-control flex-1">
          <div className="input-group">
            <span className="bg-base-200">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search by student name..."
              className="input input-bordered w-full"
              value={studentSearchTerm}
              onChange={(e) => setStudentSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="form-control">
          <div className="input-group">
            <span className="bg-base-200">
              <Calendar className="w-5 h-5" />
            </span>
            <input
              type="date"
              className="input input-bordered"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="btn-group">
          <button
            className={`btn ${viewType === "table" ? "btn-active" : ""}`}
            onClick={() => setViewType("table")}
          >
            <ListIcon className="w-5 h-5" />
          </button>
          <button
            className={`btn ${viewType === "cards" ? "btn-active" : ""}`}
            onClick={() => setViewType("cards")}
          >
            <Grid className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Results Count */}
      {(studentSearchTerm || dateFilter) && (
        <div className="alert alert-info mb-4">
          <span>Found {batchAttendance.length} attendance record(s)</span>
        </div>
      )}

      {/* Attendance Display */}
      {batchAttendance.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">
            {studentSearchTerm || dateFilter
              ? "No attendance records found matching your filters"
              : "No attendance records found for this batch"}
          </p>
        </div>
      ) : viewType === "table" ? (
        // Table View
        <div className="overflow-x-auto bg-base-100 rounded-lg shadow-lg">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Student</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {batchAttendance.map((record, index) => {
                const student = students.find(
                  (s) => s._id === record.studentId
                );

                return (
                  <tr key={record._id} className="hover">
                    <td>{index + 1}</td>
                    <td className="font-semibold">{record.date}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-8 h-8 rounded-full">
                            <img src={student?.image} alt={student?.name} />
                          </div>
                        </div>
                        <span>{student?.name}</span>
                      </div>
                    </td>
                    <td>
                      {record.status === "present" ? (
                        <span className="badge badge-success gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Present
                        </span>
                      ) : (
                        <span className="badge badge-error gap-2">
                          <XCircle className="w-4 h-4" />
                          Absent
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => onEdit(record)}
                        className="btn btn-info btn-sm gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        // Cards View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batchAttendance.map((record) => {
            const student = students.find((s) => s._id === record.studentId);

            return (
              <div
                key={record._id}
                className="card bg-base-100 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="card-body">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="avatar">
                      <div className="w-12 h-12 rounded-full">
                        <img src={student?.image} alt={student?.name} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{student?.name}</h3>
                      <p className="text-sm text-gray-400">{record.date}</p>
                    </div>
                  </div>

                  <div className="divider my-2"></div>

                  <div className="flex justify-center">
                    {record.status === "present" ? (
                      <div className="badge badge-success badge-lg gap-2 p-4">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">Present</span>
                      </div>
                    ) : (
                      <div className="badge badge-error badge-lg gap-2 p-4">
                        <XCircle className="w-5 h-5" />
                        <span className="font-semibold">Absent</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AttendanceList;
