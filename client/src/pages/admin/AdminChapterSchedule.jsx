// =====================================================
// FILE: src/pages/admin/AdminChapterSchedule.jsx
// =====================================================
import {
  Calendar,
  Edit,
  Plus,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useAppContext } from "../../context/useAppContext";
import ScheduleFormModal from "./ScheduleFormModal";

const AdminChapterSchedule = () => {
  const {
    batches,
    courses,
    quizzes,
    chapterSchedules,
    deleteSchedule,
    toggleScheduleStatus,
  } = useAppContext();

  const [selectedBatch, setSelectedBatch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Get unique chapters from quizzes
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

  // Filter schedules by selected batch
  const filteredSchedules = useMemo(() => {
    if (!selectedBatch) return chapterSchedules;
    return chapterSchedules.filter((s) => s.batchId === selectedBatch);
  }, [chapterSchedules, selectedBatch]);

  // Get batch name
  const getBatchName = (batchId) => {
    const batch = batches.find((b) => b._id === batchId);
    const course = courses.find((c) => c._id === batch?.courseId);
    return batch ? `${batch.batchName} - ${course?.title}` : "Unknown";
  };

  // Handle delete
  const handleDelete = async (scheduleId) => {
    try {
      await deleteSchedule(scheduleId);
      setDeleteConfirm(null);
    } catch (error) {
      alert("Schedule delete করতে সমস্যা হয়েছে");
    }
  };

  // Handle toggle status
  const handleToggle = async (scheduleId) => {
    try {
      await toggleScheduleStatus(scheduleId);
    } catch (error) {
      alert("Status change করতে সমস্যা হয়েছে");
    }
  };

  // Handle edit
  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setShowForm(true);
  };

  // Handle add new
  const handleAddNew = () => {
    setEditingSchedule(null);
    setShowForm(true);
  };

  // Close form
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSchedule(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Chapter Schedule Management</h2>
          <p className="text-gray-600 mt-1">
            Set quiz schedules for each chapter by batch
          </p>
        </div>
        <button onClick={handleAddNew} className="btn btn-primary gap-2">
          <Plus className="w-5 h-5" />
          Add Schedule
        </button>
      </div>

      {/* Batch Filter */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="form-control max-w-md">
            <label className="label">
              <span className="label-text font-semibold">Filter by Batch</span>
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
        </div>
      </div>

      {/* Schedules List */}
      {filteredSchedules.length === 0 ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No schedules found</p>
            <button onClick={handleAddNew} className="btn btn-primary mt-4">
              Create First Schedule
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchedules.map((schedule) => {
            const isActive = schedule.isActive;
            const startDate = new Date(schedule.startDate);
            const endDate = new Date(schedule.endDate);
            const now = new Date();
            const isOngoing = now >= startDate && now <= endDate;
            const isUpcoming = now < startDate;
            const isExpired = now > endDate;

            return (
              <div
                key={schedule._id}
                className={`card shadow-xl border-2 ${
                  !isActive
                    ? "border-base-300 bg-base-200 opacity-60"
                    : isOngoing
                    ? "border-success bg-success/5"
                    : isUpcoming
                    ? "border-info bg-info/5"
                    : "border-error bg-error/5"
                }`}
              >
                <div className="card-body">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold">
                        Chapter {schedule.chapter}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {getBatchName(schedule.batchId)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      {isActive && (
                        <>
                          {isOngoing && (
                            <div className="badge badge-success badge-sm">
                              Ongoing
                            </div>
                          )}
                          {isUpcoming && (
                            <div className="badge badge-info badge-sm">
                              Upcoming
                            </div>
                          )}
                          {isExpired && (
                            <div className="badge badge-error badge-sm">
                              Expired
                            </div>
                          )}
                        </>
                      )}
                      {!isActive && (
                        <div className="badge badge-ghost badge-sm">
                          Inactive
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="divider my-2"></div>

                  {/* Dates */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-semibold">
                        {startDate.toLocaleDateString("en-GB")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">End Date:</span>
                      <span className="font-semibold">
                        {endDate.toLocaleDateString("en-GB")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <button
                        onClick={() => handleToggle(schedule._id)}
                        className={`btn btn-xs gap-1 ${
                          isActive ? "btn-success" : "btn-ghost"
                        }`}
                      >
                        {isActive ? (
                          <>
                            <ToggleRight className="w-4 h-4" />
                            Active
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4" />
                            Inactive
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(schedule)}
                      className="btn btn-info btn-sm flex-1 gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(schedule._id)}
                      className="btn btn-error btn-sm flex-1 gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <ScheduleFormModal
          schedule={editingSchedule}
          onClose={handleCloseForm}
          availableChapters={availableChapters}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete this schedule? This action cannot
              be undone.
            </p>
            <div className="modal-action">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="btn btn-error gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChapterSchedule;
