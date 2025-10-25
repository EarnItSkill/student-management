import {
  AlertCircle,
  Award,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  DollarSign,
  Filter,
  Search,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../../context/useAppContext";
import { dayToName } from "../../utils/dayToName";

const BatchDetailsPage = () => {
  const { batches, enrollments, students } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [searchBy, setSearchBy] = useState("all"); // all, sBatchId, batchName

  // Filter batches based on search
  const filteredBatches = batches.filter((batch) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();

    if (searchBy === "sBatchId") {
      return batch.sBatchId.toLowerCase().includes(searchLower);
    } else if (searchBy === "batchName") {
      return batch.batchName.toLowerCase().includes(searchLower);
    } else {
      // Search in both
      return (
        batch.sBatchId.toLowerCase().includes(searchLower) ||
        batch.batchName.toLowerCase().includes(searchLower)
      );
    }
  });

  // Get enrolled students for a batch
  const getEnrolledStudents = (batchId) => {
    const batchEnrollments = enrollments.filter((e) => e.batchId === batchId);
    return batchEnrollments
      .map((enrollment) => {
        return students.find((s) => s._id === enrollment.studentId);
      })
      .filter(Boolean);
  };

  // Calculate batch statistics
  const getBatchStats = (batch) => {
    const enrolled = getEnrolledStudents(batch._id);
    const maleCount = enrolled.filter((s) => s.gender === "male").length;
    const femaleCount = enrolled.filter((s) => s.gender === "female").length;
    const occupancyRate = ((enrolled.length / batch.totalSeats) * 100).toFixed(
      1
    );

    return {
      enrolled: enrolled.length,
      maleCount,
      femaleCount,
      occupancyRate,
      availableSeats: batch.totalSeats - enrolled.length,
    };
  };

  // Format date in Bengali
  const formatDateBengali = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("bn-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            ব্যাচ বিস্তারিত তথ্য
          </h1>
          <p className="text-gray-400">
            সকল ব্যাচের সম্পূর্ণ তথ্য দেখুন এবং পরিচালনা করুন
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Search Type Selector */}
              <div className="md:col-span-3">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    সার্চ টাইপ
                  </span>
                </label>
                <select
                  value={searchBy}
                  onChange={(e) => setSearchBy(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="all">সব</option>
                  <option value="sBatchId">Batch ID</option>
                  <option value="batchName">Batch Name</option>
                </select>
              </div>

              {/* Search Input */}
              <div className="md:col-span-7">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    খুঁজুন
                  </span>
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={
                      searchBy === "sBatchId"
                        ? "Batch ID দিয়ে খুঁজুন..."
                        : searchBy === "batchName"
                        ? "Batch Name দিয়ে খুঁজুন..."
                        : "Batch ID বা Name দিয়ে খুঁজুন..."
                    }
                    className="input input-bordered w-full pl-12"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Result Count */}
              <div className="md:col-span-2 flex items-end">
                <div className="stat bg-primary/10 rounded-lg p-4 w-full">
                  <div className="stat-value text-primary text-2xl">
                    {filteredBatches.length}
                  </div>
                  <div className="stat-desc text-xs">ব্যাচ পাওয়া গেছে</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Batch List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBatches.length === 0 ? (
            <div className="col-span-2 card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center py-12">
                <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-400">
                  কোনো ব্যাচ পাওয়া যায়নি
                </h3>
                <p className="text-gray-500">অন্য কিছু দিয়ে খুঁজে দেখুন</p>
              </div>
            </div>
          ) : (
            filteredBatches.map((batch) => {
              const stats = getBatchStats(batch);
              const isSelected = selectedBatch?._id === batch._id;

              return (
                <div
                  key={batch._id}
                  className={`card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 ${
                    isSelected ? "border-primary" : "border-transparent"
                  }`}
                  onClick={() => setSelectedBatch(isSelected ? null : batch)}
                >
                  <div className="card-body p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h2 className="card-title text-xl mb-2">
                          {batch.batchName}
                        </h2>
                        <div className="badge badge-primary badge-lg">
                          {batch.sBatchId}
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-6 h-6 transition-transform ${
                          isSelected ? "rotate-90" : ""
                        }`}
                      />
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4 ">
                      <div className="stat bg-blue-50 rounded-lg p-3">
                        <div className="stat-title text-xs text-sky-600">
                          মোট সিট
                        </div>
                        <div className="stat-value text-blue-600 text-2xl">
                          {batch.totalSeats}
                        </div>
                      </div>
                      <div className="stat bg-green-50 rounded-lg p-3">
                        <div className="stat-title text-xs text-sky-600">
                          এনরোল
                        </div>
                        <div className="stat-value text-green-600 text-2xl">
                          {stats.enrolled}
                        </div>
                      </div>
                    </div>

                    {/* Occupancy Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold">অকুপেন্সি রেট</span>
                        <span className="font-bold text-primary">
                          {stats.occupancyRate}%
                        </span>
                      </div>
                      <progress
                        className="progress progress-primary w-full"
                        value={stats.occupancyRate}
                        max="100"
                      ></progress>
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDateBengali(batch.startDate)} -{" "}
                          {formatDateBengali(batch.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{batch.startTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-bold">
                          {batch.courseFee} টাকা
                        </span>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isSelected && (
                      <div className="mt-6 pt-6 border-t space-y-4 animate-fadeIn">
                        {/* Instructor */}
                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                          <Award className="w-8 h-8 text-purple-500" />
                          <div>
                            <p className="text-xs text-gray-400">শিক্ষক</p>
                            <p className="font-bold text-purple-700">
                              {batch.instructor}
                            </p>
                          </div>
                        </div>

                        {/* Gender Distribution */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="stat bg-blue-50 rounded-lg p-3">
                            <div className="stat-title text-xs text-sky-500">
                              পুরুষ
                              {console.log(stats)}
                            </div>
                            <div className="stat-value text-blue-600 text-xl">
                              {stats.maleCount}
                            </div>
                          </div>
                          <div className="stat bg-pink-50 rounded-lg p-3">
                            <div className="stat-title text-xs text-sky-500">
                              মহিলা
                            </div>
                            <div className="stat-value text-pink-600 text-xl">
                              {stats.femaleCount}
                            </div>
                          </div>
                          <div className="stat bg-orange-50 rounded-lg p-3">
                            <div className="stat-title text-xs text-sky-500">
                              খালি
                            </div>
                            <div className="stat-value text-orange-600 text-xl">
                              {stats.availableSeats +
                                stats.maleCount +
                                stats.femaleCount}
                            </div>
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="space-y-2">
                          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-400 mr-6">
                              Schedule Type:
                            </span>
                            <span className="font-bold  text-pink-400">
                              {dayToName(batch.scheduleType)}
                            </span>
                          </div>
                          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-400 mr-6">
                              Gender:
                            </span>
                            <span className="font-bold capitalize text-pink-400">
                              {batch.gender === "male"
                                ? "ছেলে"
                                : batch.gender === "female"
                                ? "মেয়ে"
                                : "উভয়"}
                            </span>
                          </div>
                        </div>

                        {/* Enrolled Students List */}
                        <div className="pt-4 border-t">
                          <h3 className="font-bold mb-3 flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            এনরোলকৃত ছাত্র/ছাত্রী ({stats.enrolled})
                          </h3>
                          {stats.enrolled === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">
                              এখনো কেউ এনরোল করেনি
                            </p>
                          ) : (
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                              {getEnrolledStudents(batch._id).map((student) => (
                                <div
                                  key={student._id}
                                  className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:border-primary transition-all"
                                >
                                  <div className="avatar">
                                    <div className="w-10 h-10 rounded-full">
                                      <img
                                        src={student.image}
                                        alt={student.name}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-semibold text-sm">
                                      {student.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {student.studentId}
                                    </p>
                                  </div>
                                  <div className="badge badge-sm">
                                    {student.gender === "male"
                                      ? "ছেলে"
                                      : "মেয়ে"}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Click to expand hint */}
                    {!isSelected && (
                      <div className="text-center mt-4 pt-4 border-t">
                        <span className="text-xs text-gray-500">
                          বিস্তারিত দেখতে ক্লিক করুন
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchDetailsPage;
