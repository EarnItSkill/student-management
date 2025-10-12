import {
  BookOpen,
  Calendar,
  ChevronDown,
  Clock,
  Save,
  Search,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAppContext } from "../../context/useAppContext";

// Searchable Select Component
const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder,
  renderOption,
  error,
  label,
  required,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter((option) =>
      renderOption(option).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm, renderOption]);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="form-control" ref={dropdownRef}>
      <label className="label">
        <span className="label-text font-semibold">{label}</span>
        {required && <span className="label-text-alt text-error">*</span>}
      </label>

      <div className="relative">
        <div
          className={`input input-bordered w-full flex items-center justify-between cursor-pointer ${
            error ? "input-error" : ""
          } ${isOpen ? "border-primary" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={selectedOption ? "" : "text-gray-400"}>
            {selectedOption ? renderOption(selectedOption) : placeholder}
          </span>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-base-100 border-2 border-primary rounded-lg shadow-xl max-h-80 overflow-hidden">
            {/* Search Input */}
            <div className="p-2 border-b sticky top-0 bg-base-100">
              <div className="input-group">
                <span className="bg-base-200 px-3">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Type to search..."
                  className="input input-sm input-bordered w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            {/* Options List */}
            <div className="overflow-y-auto max-h-60">
              {filteredOptions.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No results found
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`p-3 cursor-pointer hover:bg-primary hover:text-white transition-colors ${
                      option.value === value
                        ? "bg-primary/20 font-semibold"
                        : ""
                    } ${
                      option.disabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => {
                      if (!option.disabled) {
                        onChange(option.value);
                        setIsOpen(false);
                        setSearchTerm("");
                      }
                    }}
                  >
                    {renderOption(option)}
                  </div>
                ))
              )}
            </div>

            {/* Results Count */}
            <div className="p-2 border-t bg-base-200 text-xs text-gray-600 text-center">
              {filteredOptions.length} result(s) found
            </div>
          </div>
        )}
      </div>

      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
};

const EnrollmentForm = ({ onClose, onSuccess }) => {
  const { students, batches, courses, enrollStudent, updateBatch } =
    useAppContext();

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      studentId: "",
      batchId: "",
    },
  });

  const selectedBatchId = watch("batchId");
  const selectedStudentId = watch("studentId");

  // Prepare student options (sorted - latest first)
  const studentOptions = useMemo(() => {
    return [...students]
      .sort((a, b) => b._id.localeCompare(a._id))
      .map((student) => ({
        value: student._id,
        label: `${student.name} - ${student.email}`,
        data: student,
      }));
  }, [students]);

  // Prepare batch options (sorted - latest first)
  const batchOptions = useMemo(() => {
    return [...batches]
      .sort((a, b) => b._id.localeCompare(a._id))
      .map((batch) => {
        const course = courses.find((c) => c._id === batch.courseId);
        const isFull = batch.enrolledStudents >= batch.totalSeats;
        return {
          value: batch._id,
          label: `${batch.batchName} - ${course?.title}${
            isFull ? " (Full)" : ""
          }`,
          disabled: isFull,
          data: batch,
        };
      });
  }, [batches, courses]);

  const selectedBatch = batches.find((b) => b._id === selectedBatchId);
  const selectedCourse = courses.find((c) => c._id === selectedBatch?.courseId);
  const selectedStudent = students.find((s) => s._id === selectedStudentId);

  // Get schedule display text
  const getScheduleText = (scheduleType) => {
    const scheduleMap = {
      SIX_DAYS: "সপ্তাহে ৬ দিন (শনি-বৃহ)",
      THREE_DAYS_A: "৩ দিন (শনি, সোম, বুধ)",
      THREE_DAYS_B: "৩ দিন (রবি, মঙ্গল, বৃহ)",
      WEEKEND: "সপ্তাহান্তে (শুক্র, শনি)",
      CUSTOM: "কাস্টম শিডিউল",
    };
    return scheduleMap[scheduleType] || scheduleType;
  };

  // Format time
  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // const onSubmit = async (data) => {
  //   try {
  //     // নির্বাচিত ব্যাচ খুঁজে বের করা
  //     const selectedBatch = batches.find((b) => b._id === data.batchId);

  //     // ব্যাচের courseId বের করা
  //     const courseId = selectedBatch?.courseId;

  //     // যদি courseId পাওয়া যায়, তাহলে Enroll Student ফাংশনকে studentId, batchId, এবং courseId দিয়ে কল করা
  //     if (courseId) {
  //       enrollStudent(data.studentId, data.batchId, courseId);
  //       onSuccess?.();
  //       onClose();
  //     } else {
  //       // courseId না পাওয়া গেলে এরর হ্যান্ডলিং (ঐচ্ছিক)
  //       console.error("Course ID not found for the selected batch.");
  //     }
  //   } catch (error) {
  //     console.error("Error enrolling student:", error);
  //   }
  // };

  const onSubmit = async (data) => {
    try {
      // নির্বাচিত ব্যাচ খুঁজে বের করা
      const selectedBatch = batches.find((b) => b._id === data.batchId);

      if (selectedBatch) {
        // ১. MongoDB-তে ব্যাচ আপডেটের জন্য ডাটা প্রস্তুত করা
        const batchUpdateData = {
          // $inc অপারেটর ব্যবহার করতে হলে সার্ভারে একটি নির্দিষ্ট structure পাঠাতে হবে।
          // তবে যেহেতু আপনি ফ্রন্ট-এন্ড থেকে একটি সম্পূর্ণ অবজেক্ট updateDoc হিসেবে পাঠাচ্ছেন,
          // আমরা ফ্রন্ট-এন্ডেই local update করে MongoDB-কে $set ব্যবহার করতে বলতে পারি,
          // অথবা সবচেয়ে ভালো হয়, সার্ভারেই $inc ব্যবহার করা।
          // আমরা এখানে সার্ভারে $inc ব্যবহারের জন্য একটি নির্দেশ পাঠাবো।
          // Enrollment-এর জন্য: totalSeats -1 এবং enrolledStudents +1
          $inc: {
            totalSeats: -1,
            enrolledStudents: 1,
          },
        };

        // ২. স্টুডেন্টকে এনরোল করা (আপনার বিদ্যমান লজিক)
        const courseId = selectedBatch.courseId;
        await enrollStudent(data.studentId, data.batchId, courseId); // ধরে নিচ্ছি এটি একটি async ফাংশন

        // ৩. ব্যাচের সিট কাউন্ট আপডেট করা
        // এখানে আমরা সার্ভারে একটি বিশেষ অনুরোধ পাঠাচ্ছি $inc ব্যবহার করার জন্য
        await updateBatch(data.batchId, batchUpdateData);

        onSuccess?.();
        onClose();
      } else {
        console.error("Course ID not found for the selected batch.");
      }
    } catch (error) {
      console.error("Error enrolling student:", error);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b sticky top-0 bg-base-100 z-10">
          <div>
            <h3 className="font-bold text-2xl flex items-center gap-2">
              <UserCheck className="w-7 h-7 text-primary" />
              Enroll Student
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Add a student to a batch
            </p>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Student Selection Section */}
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Select Student
              </h4>

              {/* Searchable Student Select */}
              <Controller
                name="studentId"
                control={control}
                rules={{ required: "Student is required" }}
                render={({ field }) => (
                  <SearchableSelect
                    options={studentOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Choose a student"
                    renderOption={(option) => option.label}
                    error={errors.studentId?.message}
                    label="Student"
                    required
                  />
                )}
              />

              {/* Selected Student Info */}
              {selectedStudent && (
                <div className="alert alert-info mt-4">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-12 h-12 rounded-full">
                        <img
                          src={selectedStudent.image}
                          alt={selectedStudent.name}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{selectedStudent.name}</div>
                      <div className="text-sm">{selectedStudent.email}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Batch Selection Section */}
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Select Batch
              </h4>

              {/* Searchable Batch Select */}
              <Controller
                name="batchId"
                control={control}
                rules={{ required: "Batch is required" }}
                render={({ field }) => (
                  <SearchableSelect
                    options={batchOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Choose a batch"
                    renderOption={(option) => option.label}
                    error={errors.batchId?.message}
                    label="Batch"
                    required
                  />
                )}
              />
            </div>
          </div>

          {/* Batch Details */}
          {selectedBatch && selectedCourse && (
            <div className="card bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg border-2 border-primary/20">
              <div className="card-body">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Batch Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <BookOpen className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-600">Course</div>
                        <div className="font-semibold">
                          {selectedCourse.title}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Calendar className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-600">Schedule</div>
                        <div className="font-semibold">
                          {getScheduleText(selectedBatch.scheduleType)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Clock className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-600">Class Time</div>
                        <div className="font-semibold">
                          {formatTime(selectedBatch.startTime)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-600">Duration</div>
                        <div className="font-semibold">
                          {new Date(selectedBatch.startDate).toLocaleDateString(
                            "en-GB"
                          )}{" "}
                          -{" "}
                          {new Date(selectedBatch.endDate).toLocaleDateString(
                            "en-GB"
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Users className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-600">
                          Available Seats
                        </div>
                        <div className="font-semibold">
                          {selectedBatch.totalSeats -
                            selectedBatch.enrolledStudents}{" "}
                          / {selectedBatch.totalSeats}
                          <span className="badge badge-success badge-sm ml-2">
                            {selectedBatch.totalSeats -
                              selectedBatch.enrolledStudents}{" "}
                            left
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 text-2xl mt-0.5">৳</div>
                      <div>
                        <div className="text-sm text-gray-600">Course Fee</div>
                        <div className="font-semibold text-success text-lg">
                          ৳{selectedCourse.fee}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedBatch.instructor && (
                  <>
                    <div className="divider my-2"></div>
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-primary" />
                      <div>
                        <span className="text-sm text-gray-600">
                          Instructor:{" "}
                        </span>
                        <span className="font-semibold">
                          {selectedBatch.instructor}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 sticky bottom-0 bg-base-100 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Enrolling...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Enroll Student
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollmentForm;
