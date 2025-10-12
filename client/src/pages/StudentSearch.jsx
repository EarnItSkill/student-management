import { BookOpen, Eye, Filter, Mail, Phone, Search, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";

const StudentSearch = () => {
  const navigate = useNavigate();
  const { students, batches, enrollments } = useAppContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterBatch, setFilterBatch] = useState("");

  // Search and filter logic
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone.includes(searchTerm);

    if (!filterBatch) return matchesSearch;

    const studentBatches = enrollments
      .filter((e) => e.studentId === student._id)
      .map((e) => e.batchId);

    return matchesSearch && studentBatches.includes(filterBatch);
  });

  return (
    <div className="space-y-6 p-6 bg-base-200 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">ছাত্র-ছাত্রী খুঁজুন</h1>
        <div className="badge badge-primary badge-lg">
          মোট: {filteredStudents.length}
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">সার্চ করুন</span>
              </label>
              <div className="input-group">
                <span className="bg-primary text-white">
                  <Search className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  placeholder="নাম, আইডি, ইমেইল বা ফোন নম্বর..."
                  className="input input-bordered w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Batch Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">ব্যাচ ফিল্টার</span>
              </label>
              <div className="input-group">
                <span className="bg-secondary text-white">
                  <Filter className="w-5 h-5" />
                </span>
                <select
                  className="select select-bordered w-full"
                  value={filterBatch}
                  onChange={(e) => setFilterBatch(e.target.value)}
                >
                  <option value="">সকল ব্যাচ</option>
                  {batches.map((batch) => (
                    <option key={batch._id} value={batch._id}>
                      {batch.batchName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Students List */}
      {filteredStudents.length === 0 ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center py-20">
            <User className="w-20 h-20 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">কোন ছাত্র পাওয়া যায়নি</h2>
            <p className="text-gray-500">অন্য কিছু দিয়ে সার্চ করে দেখুন</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => {
            const studentEnrollments = enrollments.filter(
              (e) => e.studentId === student._id
            );

            return (
              <div
                key={student._id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
              >
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img src={student.image} alt={student.name} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="card-title text-lg">{student.name}</h3>
                      <div className="badge badge-primary badge-sm">
                        {student.studentId}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="truncate">{student.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>{student.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span>{studentEnrollments.length} টি ব্যাচ</span>
                    </div>
                  </div>

                  <div className="card-actions justify-end mt-4">
                    <button
                      className="btn btn-primary btn-sm gap-2"
                      onClick={() =>
                        navigate(`/dashboard/admin/students/${student._id}`)
                      }
                    >
                      <Eye className="w-4 h-4" />
                      বিস্তারিত দেখুন
                    </button>
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

export default StudentSearch;
