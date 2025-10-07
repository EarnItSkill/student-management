import { Save, User, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAppContext } from "../../context/useAppContext";

const StudentForm = ({ student, onClose, onSuccess }) => {
  const { addStudent, updateStudent, students } = useAppContext();
  const isEdit = !!student;

  // Generate next student ID
  const generateStudentId = () => {
    if (students.length === 0) {
      return "STU-0001";
    }

    // Get all student IDs and extract numbers
    const ids = students
      .map((s) => s.studentId)
      .filter((id) => id && id.startsWith("STU-"))
      .map((id) => parseInt(id.split("-")[1]))
      .filter((num) => !isNaN(num));

    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    const nextId = maxId + 1;

    return `STU-${String(nextId).padStart(4, "0")}`;
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: student || {
      studentId: "",
      name: "",
      email: "",
      phone: "",
      password: "student123",
      gender: "",
      eiin: "",
      address: "",
      image: "",
    },
  });

  // Set student ID for new students
  useEffect(() => {
    if (!isEdit) {
      setValue("studentId", generateStudentId());
    }
  }, [isEdit, setValue]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        updateStudent(student._id, data);
      } else {
        addStudent(data);
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-base-100 z-10 pb-4 border-b">
          <h3 className="font-bold text-2xl flex items-center gap-2">
            <User className="w-6 h-6 text-primary" />
            {isEdit ? "Edit Student" : "Add New Student"}
          </h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Student ID (Read-only for new, hidden for edit) */}
          {!isEdit && (
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base">
                  Student ID
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered bg-base-200"
                readOnly
                {...register("studentId")}
              />
              <label className="label">
                <span className="label-text-alt text-gray-500">
                  Auto-generated student ID
                </span>
              </label>
            </div>
          )}

          {/* Personal Information Section */}
          <div className="divider divider-start text-lg font-bold">
            Personal Information
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base">
                  Full Name *
                </span>
              </label>
              <input
                type="text"
                placeholder="e.g., Md. Karim Rahman"
                className={`input input-bordered w-full ${
                  errors.name ? "input-error" : ""
                }`}
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                })}
              />
              {errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.name.message}
                  </span>
                </label>
              )}
            </div>

            {/* Gender */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base">
                  Gender *
                </span>
              </label>
              <select
                className={`select select-bordered w-full ${
                  errors.gender ? "select-error" : ""
                }`}
                {...register("gender", {
                  required: "Gender is required",
                })}
              >
                <option value="">Select Gender</option>
                <option value="male">Male (ছেলে)</option>
                <option value="female">Female (মেয়ে)</option>
              </select>
              {errors.gender && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.gender.message}
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="divider divider-start text-lg font-bold">
            Contact Information
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base">
                  Email *
                </span>
              </label>
              <input
                type="email"
                placeholder="student@example.com"
                className={`input input-bordered w-full ${
                  errors.email ? "input-error" : ""
                }`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.email.message}
                  </span>
                </label>
              )}
            </div>

            {/* Phone */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base">
                  Phone Number *
                </span>
              </label>
              <input
                type="tel"
                placeholder="01700000000"
                className={`input input-bordered w-full ${
                  errors.phone ? "input-error" : ""
                }`}
                {...register("phone", {
                  required: "Phone is required",
                  pattern: {
                    value: /^01[0-9]{9}$/,
                    message: "Invalid phone number (01XXXXXXXXX)",
                  },
                })}
              />
              {errors.phone && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.phone.message}
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-base">
                Address *
              </span>
            </label>
            <textarea
              placeholder="e.g., House #123, Road #5, Dhanmondi, Dhaka"
              className={`textarea textarea-bordered w-full h-24 ${
                errors.address ? "textarea-error" : ""
              }`}
              {...register("address", {
                required: "Address is required",
                minLength: {
                  value: 10,
                  message: "Address must be at least 10 characters",
                },
              })}
            />
            {errors.address && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.address.message}
                </span>
              </label>
            )}
          </div>

          {/* Institution Information Section */}
          <div className="divider divider-start text-lg font-bold">
            Institution Information
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-base">
                School/College EIIN *
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g., 123456"
              className={`input input-bordered w-full ${
                errors.eiin ? "input-error" : ""
              }`}
              {...register("eiin", {
                required: "EIIN is required",
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: "EIIN must be 6 digits",
                },
              })}
            />
            {errors.eiin && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.eiin.message}
                </span>
              </label>
            )}
            <label className="label">
              <span className="label-text-alt text-gray-500">
                শিক্ষা প্রতিষ্ঠানের EIIN নম্বর (৬ ডিজিটের)
              </span>
            </label>
          </div>

          {/* Account Information Section */}
          <div className="divider divider-start text-lg font-bold">
            Account Information
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password (only for new students) */}
            {!isEdit && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base">
                    Password *
                  </span>
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  className={`input input-bordered w-full ${
                    errors.password ? "input-error" : ""
                  }`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.password.message}
                    </span>
                  </label>
                )}
              </div>
            )}

            {/* Image URL */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base">
                  Profile Image URL (Optional)
                </span>
              </label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                className="input input-bordered w-full"
                {...register("image")}
              />
              <label className="label">
                <span className="label-text-alt text-gray-500">
                  Leave empty for default avatar
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="modal-action pt-6 border-t sticky bottom-0 bg-base-100">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-lg"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isEdit ? "Update" : "Save"} Student
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
