import { ArrowLeft, CheckCircle, Save, User } from "lucide-react";
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

  const onSubmit = async (data) => {
    try {
      await addStudent(data);
      setIsSuccess(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 10000);
    } catch (error) {
      console.error("Error registering student:", error);
      alert("Registration failed. Please try again.");
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="card w-full max-w-md bg-base-100 shadow-2xl">
            <div className="card-body items-center text-center">
              <div className="w-20 h-20 rounded-full bg-success flex items-center justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h2 className="card-title text-2xl mb-2">
                রেজিস্ট্রেশন সফলতার সহিত সম্পন্ন হয়েছে।
              </h2>
              <h3 className="text-2xl rounded-2xl">
                {" "}
                আপনার আইডি:{" "}
                <span className="font-bold text-green-700">
                  {generateStudentId()}
                </span>
              </h3>
              <p className="text-gray-600 mb-4">
                আপনার রেজিস্ট্রেশন সফল হয়েছে। আপনি এখন লগিন করতে পারবেন।
              </p>
              <div className="divider">Redirecting to login...</div>
              <Link to="/login" className="btn btn-primary btn-wide">
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
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/" className="btn btn-ghost gap-2 mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        {/* Registration Form Card */}
        <div className="card max-w-4xl mx-auto bg-base-100 shadow-2xl">
          <div className="card-body">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="avatar placeholder mb-4">
                <div className="bg-primary text-white rounded-full w-16">
                  <User className="w-8 h-8 ms-4 mt-4" />
                </div>
              </div>
              <h2 className="card-title text-3xl justify-center mb-2">
                ছাত্র/ছাত্রী রেজিস্ট্রেশন ফরম
              </h2>
              <p className="text-gray-600">
                নতুন শিক্ষার্থী হিসেবে রেজিস্ট্রেশন করুন
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Student ID (Read-only) */}
              <div className="form-control flex gap-2">
                <label className="label">
                  <span className="label-text font-semibold">
                    ছাত্র/ছাত্রীর আইডি
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered bg-base-200 font-bold"
                  readOnly
                  {...register("studentId")}
                />
                <label className="label">
                  <span className="label-text-alt text-gray-500">
                    এই আইডি অটো তৈরী হবে। (এটা মনে রাখুন)
                  </span>
                </label>
              </div>

              {/* Personal Information */}
              <div className="divider divider-start text-lg font-bold">
                ব্যক্তিগত তথ্য
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="form-control flex flex-col">
                  <label className="label">
                    <span className="label-text font-semibold">পুরো নাম *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: মো. আবদুল করিম"
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
                <div className="form-control flex flex-col">
                  <label className="label">
                    <span className="label-text font-semibold">জেন্ডার *</span>
                  </label>
                  <select
                    className={`select select-bordered w-full ${
                      errors.gender ? "select-error" : ""
                    }`}
                    {...register("gender", {
                      required: "Gender is required",
                    })}
                  >
                    <option value="">জেন্ডার নির্বাচন</option>
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

              {/* Contact Information */}
              <div className="divider divider-start text-lg font-bold">
                যোগাযোগের তথ্য
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="form-control flex flex-col">
                  <label className="label">
                    <span className="label-text font-semibold">ইমেইল *</span>
                  </label>
                  <input
                    type="email"
                    placeholder="student@example.com"
                    className={`input input-bordered w-full ${
                      errors.email ? "input-error" : ""
                    }`}
                    {...register("email", {
                      required: "ইমেইল বাধ্যতামূলক",
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
                    <span className="label-text font-semibold">
                      মোবাইল নাম্বার *
                    </span>
                  </label>
                  <input
                    type="tel"
                    placeholder="01700000000"
                    className={`input input-bordered w-full ${
                      errors.phone ? "input-error" : ""
                    }`}
                    {...register("phone", {
                      required: "মোবাইল নাম্বার বাধ্যতামূলক",
                      pattern: {
                        value: /^01[0-9]{9}$/,
                        message: "ভুল মোবাইল নাম্বার (01XXXXXXXXX)",
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
              <div className="form-control flex flex-col">
                <label className="label">
                  <span className="label-text font-semibold">ঠিকানা *</span>
                </label>
                <textarea
                  placeholder="যেমন: খলিলপুর, ভোরাজগতপুর, লালমাই, কুমিল্লা।"
                  className={`textarea textarea-bordered h-16 w-full ${
                    errors.address ? "textarea-error" : ""
                  }`}
                  {...register("address", {
                    required: "ঠিকানা দেওয়া বাধ্যতামূলক",
                    minLength: {
                      value: 10,
                      message: "ঠিকানা কমপক্ষে ১০ বর্ণের হতে হবে।",
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

              {/* Institution Information */}
              <div className="divider divider-start text-lg font-bold">
                প্রাতিষ্ঠানের তথ্য:
              </div>

              <div className="form-control flex flex-col">
                <label className="label">
                  <span className="label-text font-semibold">
                    স্কুল/কলেজ EIIN *
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

              {/* Account Information */}
              <div className="divider divider-start text-lg font-bold">
                Account Information
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div className="form-control flex flex-col">
                  <label className="label">
                    <span className="label-text font-semibold">Password *</span>
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

                {/* Image URL */}
                <div className="form-control flex flex-col">
                  <label className="label">
                    <span className="label-text font-semibold">
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

              {/* Submit Button */}
              <div className="card-actions justify-end pt-6 border-t">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      রেজিষ্ট্রার হচ্ছে ...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      রেজিষ্ট্রার
                    </>
                  )}
                </button>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  রেজিষ্ট্রেশন করা আছে?{" "}
                  <Link to="/login" className="link link-primary font-semibold">
                    লগইন করুন
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
