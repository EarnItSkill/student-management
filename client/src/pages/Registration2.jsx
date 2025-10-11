import {
  ArrowLeft,
  CheckCircle,
  GraduationCap,
  Image as ImageIcon,
  Lock,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import { useAppContext } from "../context/useAppContext";

const Registration = () => {
  const { addStudent, students } = useAppContext();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Generate next student ID
  const generateStudentId = () => {
    if (students.length === 0) {
      return "STU-0001";
    }

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
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      studentId: "",
      name: "",
      email: "",
      phone: "",
      password: "",
      gender: "",
      eiin: "",
      address: "",
      image: "",
    },
  });

  // Set student ID when students data is loaded
  useEffect(() => {
    if (students && students.length >= 0) {
      setValue("studentId", generateStudentId());
    }
  }, [students, setValue]);

  // Watch form values for step validation
  const watchName = watch("name");
  const watchEmail = watch("email");
  const watchPhone = watch("phone");
  const watchGender = watch("gender");
  const watchAddress = watch("address");
  const watchEiin = watch("eiin");
  const watchPassword = watch("password");

  const onSubmit = async (data) => {
    try {
      await addStudent(data);
      setIsSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 10000);
    } catch (error) {
      console.error("Error registering student:", error);
      alert("Registration failed. Please try again.");
    }
  };

  // Check if current step is complete
  const isStepComplete = (step) => {
    switch (step) {
      case 1:
        return watchName && watchEmail && watchPhone && watchGender;
      case 2:
        return watchAddress && watchEiin;
      case 3:
        return watchPassword;
      default:
        return false;
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <div className="card w-full max-w-md bg-base-100 shadow-2xl animate-bounce-in">
            <div className="card-body items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-success to-success/70 flex items-center justify-center mb-6 animate-scale-in">
                <CheckCircle className="w-14 h-14 text-white" />
              </div>
              <h2 className="card-title text-3xl mb-2">
                🎉 Registration Successful!
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                আপনার রেজিস্ট্রেশন সফল হয়েছে!
                <br />
                আপনি এখন লগিন করতে পারবেন।
              </p>
              <div className="stats shadow mb-4">
                <div className="stat place-items-center">
                  <div className="stat-title">Your Student ID</div>
                  <div className="stat-value text-primary text-2xl">
                    {watch("studentId")}
                  </div>
                </div>
              </div>
              <div className="divider">Redirecting to login in 10s...</div>
              <Link
                to="/login"
                className="btn btn-primary btn-wide btn-lg gap-2"
              >
                <User className="w-5 h-5" />
                Login Now
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/" className="btn btn-ghost gap-2 mb-6 hover:bg-base-200">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        {/* Main Registration Card */}
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="avatar placeholder mb-4">
              <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-full w-20 shadow-lg ">
                <GraduationCap className="w-10 h-10" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">Student Registration</h1>
            <p className="text-gray-600 text-lg">
              নতুন শিক্ষার্থী হিসেবে রেজিস্ট্রেশন করুন
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <ul className="steps steps-horizontal w-full">
              <li className={`step ${currentStep >= 1 ? "step-primary" : ""}`}>
                <div className="flex flex-col items-center">
                  <User className="w-5 h-5 mb-1" />
                  <span className="text-xs md:text-sm">Personal Info</span>
                </div>
              </li>
              <li className={`step ${currentStep >= 2 ? "step-primary" : ""}`}>
                <div className="flex flex-col items-center">
                  <MapPin className="w-5 h-5 mb-1" />
                  <span className="text-xs md:text-sm">Contact Details</span>
                </div>
              </li>
              <li className={`step ${currentStep >= 3 ? "step-primary" : ""}`}>
                <div className="flex flex-col items-center">
                  <Lock className="w-5 h-5 mb-1" />
                  <span className="text-xs md:text-sm">Account Setup</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Form Card */}
          <div className="card bg-base-100 shadow-2xl">
            <div className="card-body p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">
                          Personal Information
                        </h3>
                        <p className="text-sm text-gray-600">
                          আপনার ব্যক্তিগত তথ্য দিন
                        </p>
                      </div>
                    </div>

                    {/* Student ID Display */}
                    <div className="alert alert-info">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5" />
                        <div>
                          <div className="font-semibold">Your Student ID</div>
                          <div className="text-2xl font-bold">
                            {watch("studentId")}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div className="form-control flex flex-col">
                        <label className="label">
                          <span className="label-text font-semibold flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" />
                            Full Name *
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Md. Karim Rahman"
                          className={`input input-bordered input-lg w-full ${
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
                      <div className="form-control flex flex-col">
                        <label className="label">
                          <span className="label-text font-semibold flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary" />
                            Gender *
                          </span>
                        </label>
                        <select
                          className={`select select-bordered select-lg w-full ${
                            errors.gender ? "select-error" : ""
                          }`}
                          {...register("gender", {
                            required: "Gender is required",
                          })}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">👦 Male (ছেলে)</option>
                          <option value="female">👧 Female (মেয়ে)</option>
                        </select>
                        {errors.gender && (
                          <label className="label">
                            <span className="label-text-alt text-error">
                              {errors.gender.message}
                            </span>
                          </label>
                        )}
                      </div>

                      {/* Email */}
                      <div className="form-control flex flex-col">
                        <label className="label">
                          <span className="label-text font-semibold flex items-center gap-2">
                            <Mail className="w-4 h-4 text-primary" />
                            Email *
                          </span>
                        </label>
                        <input
                          type="email"
                          placeholder="student@example.com"
                          className={`input input-bordered input-lg w-full ${
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
                      <div className="form-control flex flex-col">
                        <label className="label">
                          <span className="label-text font-semibold flex items-center gap-2">
                            <Phone className="w-4 h-4 text-primary" />
                            Phone Number *
                          </span>
                        </label>
                        <input
                          type="tel"
                          placeholder="01700000000"
                          className={`input input-bordered input-lg w-full ${
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
                  </div>
                )}

                {/* Step 2: Contact Details */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">Contact Details</h3>
                        <p className="text-sm text-gray-600">
                          ঠিকানা এবং প্রতিষ্ঠানের তথ্য
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-8">
                      {/* Address */}
                      <div className="form-control flex flex-col w-1/2">
                        <label className="label">
                          <span className="label-text font-semibold flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            Address *
                          </span>
                        </label>
                        <textarea
                          placeholder="e.g., House #123, Road #5, Dhanmondi, Dhaka"
                          className={`textarea textarea-bordered textarea-lg h-16 w-full ${
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

                      {/* EIIN */}
                      <div className="form-control flex flex-col w-1/2">
                        <label className="label">
                          <span className="label-text font-semibold flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-primary" />
                            School/College EIIN *
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., 123456"
                          className={`input input-bordered input-lg w-full ${
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
                    </div>
                  </div>
                )}

                {/* Step 3: Account Setup */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">Account Setup</h3>
                        <p className="text-sm text-gray-600">
                          পাসওয়ার্ড এবং প্রোফাইল ছবি
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Password */}
                      <div className="form-control flex flex-col">
                        <label className="label">
                          <span className="label-text font-semibold flex items-center gap-2">
                            <Lock className="w-4 h-4 text-primary" />
                            Password *
                          </span>
                        </label>
                        <input
                          type="password"
                          placeholder="Enter password"
                          className={`input input-bordered input-lg w-full ${
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

                      {/* Image URL */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-primary" />
                            Profile Image URL (Optional)
                          </span>
                        </label>
                        <input
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          className="input input-bordered input-lg w-full"
                          {...register("image")}
                        />
                        <label className="label">
                          <span className="label-text-alt text-gray-500">
                            Leave empty for default avatar
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="card bg-base-200 mt-6">
                      <div className="card-body">
                        <h4 className="font-bold mb-2">Registration Summary</h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>Name:</strong> {watchName || "N/A"}
                          </p>
                          <p>
                            <strong>Email:</strong> {watchEmail || "N/A"}
                          </p>
                          <p>
                            <strong>Phone:</strong> {watchPhone || "N/A"}
                          </p>
                          <p>
                            <strong>Gender:</strong>{" "}
                            {watchGender
                              ? watchGender === "male"
                                ? "Male"
                                : "Female"
                              : "N/A"}
                          </p>
                          <p>
                            <strong>EIIN:</strong> {watchEiin || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-6 border-t">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="btn btn-outline btn-lg gap-2"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Previous
                    </button>
                  )}

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className={`btn btn-primary btn-lg gap-2 ${
                        currentStep === 1 ? "ml-auto" : ""
                      }`}
                      disabled={!isStepComplete(currentStep)}
                    >
                      Next
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-success btn-lg gap-2 ml-auto"
                      disabled={isSubmitting || !isStepComplete(3)}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Registering...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Complete Registration
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>

              {/* Login Link */}
              <div className="text-center mt-6 pt-6 border-t">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="link link-primary font-semibold text-lg"
                  >
                    Login here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce-in {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out 0.3s both;
        }
      `}</style>
    </div>
  );
};

export default Registration;
