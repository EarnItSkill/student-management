import {
  Calendar,
  CheckCircle,
  Filter,
  Plus,
  Search,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../../context/useAppContext";

const AttendanceList = ({ onAdd }) => {
  const { attendance, students, batches } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [batchFilter, setBatchFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  // Filter attendance
  const filteredAttendance = attendance?.filter((record) => {
    const student = students?.find((s) => s._id === record.studentId);
    const batch = batches?.find((b) => b._id === record.batchId);

    const matchesSearch =
      student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch?.batchName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBatch =
      batchFilter === "all" || record.batchId === batchFilter;
    const matchesDate = !dateFilter || record.date === dateFilter;

    return matchesSearch && matchesBatch && matchesDate;
  });

  // Calculate stats
  const presentCount = filteredAttendance.filter(
    (a) => a.status === "present"
  ).length;
  const absentCount = filteredAttendance.filter(
    (a) => a.status === "absent"
  ).length;
  const attendanceRate =
    filteredAttendance.length > 0
      ? ((presentCount / filteredAttendance.length) * 100).toFixed(1)
      : 0;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Attendance Management</h2>
        <button onClick={onAdd} className="btn btn-primary gap-2">
          <Plus className="w-5 h-5" />
          Mark Attendance
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-primary">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="stat-title">Attendance Rate</div>
          <div className="stat-value text-primary">{attendanceRate}%</div>
          <div className="stat-desc">
            {presentCount}/{filteredAttendance.length} present
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

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="form-control">
          <div className="input-group">
            <span className="bg-base-200">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search by student or batch..."
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

        <div className="form-control">
          <div className="input-group">
            <span className="bg-base-200">
              <Calendar className="w-5 h-5" />
            </span>
            <input
              type="date"
              className="input input-bordered w-full"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      {filteredAttendance.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No attendance records found</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-lg shadow-lg">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Date</th>
                <th>Student</th>
                <th>Batch</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((record) => {
                const student = students.find(
                  (s) => s._id === record.studentId
                );
                const batch = batches.find((b) => b._id === record.batchId);

                return (
                  <tr key={record._id}>
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
                    <td className="text-sm">{batch?.batchName}</td>
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceList;
