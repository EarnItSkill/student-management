import { Save, User, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAppContext } from "../../context/useAppContext";

const StudentForm = ({ student, onClose, onSuccess }) => {
  const { addStudent, updateStudent } = useAppContext();
  const isEdit = !!student;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: student || {
      name: "",
      email: "",
      phone: "",
      password: "student123",
      image: "",
    },
  });

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
      <div className="modal-box max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-2xl flex items-center gap-2">
            <User className="w-6 h-6 text-primary" />
            {isEdit ? "Edit Student" : "Add New Student"}
          </h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Full Name *</span>
            </label>
            <input
              type="text"
              placeholder="Enter student name"
              className={`input input-bordered ${
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

          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Email *</span>
            </label>
            <input
              type="email"
              placeholder="student@example.com"
              className={`input input-bordered ${
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
              <span className="label-text font-semibold">Phone *</span>
            </label>
            <input
              type="tel"
              placeholder="01700000000"
              className={`input input-bordered ${
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

          {/* Password (only for new students) */}
          {!isEdit && (
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Password *</span>
              </label>
              <input
                type="password"
                placeholder="Enter password"
                className={`input input-bordered ${
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
              <span className="label-text font-semibold">
                Image URL (Optional)
              </span>
            </label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              className="input input-bordered"
              {...register("image")}
            />
          </div>

          {/* Actions */}
          <div className="modal-action">
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
