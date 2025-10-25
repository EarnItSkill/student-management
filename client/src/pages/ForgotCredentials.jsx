import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  MessageCircle,
  Phone,
  Search,
  Send,
  ShieldCheck,
  User,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";

const ForgotCredentials = () => {
  const { students } = useAppContext();
  const [selectedOption, setSelectedOption] = useState(""); // 'password', 'uid', or 'instant'
  const [recoveryMethod, setRecoveryMethod] = useState(""); // 'email' or 'phone'
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    studentId: "",
    searchEmail: "",
    searchPhone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [foundStudent, setFoundStudent] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      toast.success("আপনার তথ্য সফলভাবে পাঠানো হয়েছে!");
    }, 2000);
  };

  // Instant Search Function
  const handleInstantSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const student = students.find(
        (s) =>
          s.email === formData.searchEmail || s.phone === formData.searchPhone
      );
      setIsLoading(false);
      const isValid =
        (student.phone === formData.searchPhone &&
          formData.searchEmail === "") ||
        (student.email === formData.searchEmail && student.phone === "");

      if (isValid) {
        setFoundStudent(student);
        toast.success("ছাত্র খুঁজে পাওয়া গেছে!");
      } else {
        setFoundStudent(null);
        toast.error("কোনো ছাত্র খুঁজে পাওয়া যায়নি!");
      }
    }, 1000);
  };

  const handleReset = () => {
    setSelectedOption("");
    setRecoveryMethod("");
    setFormData({
      email: "",
      phone: "",
      studentId: "",
      searchEmail: "",
      searchPhone: "",
    });
    setIsSuccess(false);
    setFoundStudent(null);
  };

  const contactInfo = {
    phone: "01515667293",
    whatsapp: "01914708856",
    email: "mrmozammal@gmail.com",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Back Button */}
        <Link
          to="/login"
          className="btn btn-ghost gap-2 mb-4 hover:bg-white/50"
        >
          <ArrowLeft className="w-5 h-5" />
          লগইন পেজে ফিরে যান
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Main Form */}
          <div className="card bg-white shadow-2xl">
            <div className="card-body p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
                  <ShieldCheck className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  তথ্য পুনরুদ্ধার করুন
                </h1>
                <p className="text-gray-400 mt-2">
                  আপনার হারিয়ে যাওয়া তথ্য ফিরে পেতে সাহায্য করুন
                </p>
              </div>

              {!isSuccess && !foundStudent ? (
                <>
                  {/* Step 1: Select What to Recover */}
                  {!selectedOption && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        কি পুনরুদ্ধার করতে চান?
                      </h3>

                      {/* Instant Search Option */}
                      <button
                        onClick={() => setSelectedOption("instant")}
                        className="w-full card bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border-2 border-emerald-200 hover:border-emerald-400 transition-all duration-300"
                      >
                        <div className="card-body p-6 flex-row items-center gap-4">
                          <div className="bg-emerald-500 p-4 rounded-full">
                            <Search className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-left flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-lg text-emerald-700">
                                তাৎক্ষণিক খুঁজুন
                              </h3>
                              <span className="badge badge-success badge-sm">
                                দ্রুততম
                              </span>
                            </div>
                            <p className="text-sm text-gray-400">
                              এখানেই আপনার তথ্য দেখুন (ইমেইল/ফোন দরকার)
                            </p>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => setSelectedOption("password")}
                        className="w-full card bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300"
                      >
                        <div className="card-body p-6 flex-row items-center gap-4">
                          <div className="bg-blue-500 p-4 rounded-full">
                            <Lock className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-left flex-1">
                            <h3 className="font-bold text-lg text-blue-700">
                              পাসওয়ার্ড ভুলে গেছেন?
                            </h3>
                            <p className="text-sm text-gray-400">
                              নতুন পাসওয়ার্ড পেতে এখানে ক্লিক করুন
                            </p>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => setSelectedOption("uid")}
                        className="w-full card bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-2 border-purple-200 hover:border-purple-400 transition-all duration-300"
                      >
                        <div className="card-body p-6 flex-row items-center gap-4">
                          <div className="bg-purple-500 p-4 rounded-full">
                            <User className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-left flex-1">
                            <h3 className="font-bold text-lg text-purple-700">
                              Student ID ভুলে গেছেন?
                            </h3>
                            <p className="text-sm text-gray-400">
                              আপনার Student ID খুঁজে পেতে এখানে ক্লিক করুন
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  )}

                  {/* Instant Search Form */}
                  {selectedOption === "instant" && (
                    <form onSubmit={handleInstantSearch} className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <button
                          type="button"
                          onClick={() => setSelectedOption("")}
                          className="btn btn-ghost btn-sm btn-circle"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <h3 className="text-lg font-semibold text-gray-700">
                          তাৎক্ষণিক খুঁজুন
                        </h3>
                      </div>

                      <div className="alert alert-info">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-sm">
                          আপনার ইমেইল অথবা ফোন নম্বর দিয়ে সরাসরি তথ্য দেখুন
                        </span>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">
                            ইমেইল অ্যাড্রেস
                          </span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            placeholder="your.email@example.com"
                            className="input input-bordered w-full pl-12"
                            value={formData.searchEmail}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                searchEmail: e.target.value,
                                searchPhone: "",
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="divider">অথবা</div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">
                            মোবাইল নম্বর
                          </span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            placeholder="01XXXXXXXXX"
                            className="input input-bordered w-full pl-12"
                            value={formData.searchPhone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                searchPhone: e.target.value,
                                searchEmail: "",
                              })
                            }
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={
                          isLoading ||
                          (!formData.searchEmail && !formData.searchPhone)
                        }
                        className="btn btn-success w-full btn-lg gap-2"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            খুঁজছি...
                          </>
                        ) : (
                          <>
                            <Search className="w-5 h-5" />
                            খুঁজুন
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* Step 2: Select Recovery Method */}
                  {(selectedOption === "password" ||
                    selectedOption === "uid") &&
                    !recoveryMethod && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <button
                            onClick={() => setSelectedOption("")}
                            className="btn btn-ghost btn-sm btn-circle"
                          >
                            <ArrowLeft className="w-4 h-4" />
                          </button>
                          <h3 className="text-lg font-semibold text-gray-700">
                            কীভাবে পেতে চান?
                          </h3>
                        </div>

                        <button
                          onClick={() => setRecoveryMethod("email")}
                          className="w-full card bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-2 border-green-200 hover:border-green-400 transition-all duration-300"
                        >
                          <div className="card-body p-6 flex-row items-center gap-4">
                            <div className="bg-green-500 p-4 rounded-full">
                              <Mail className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-left flex-1">
                              <h3 className="font-bold text-lg text-green-700">
                                ইমেইলের মাধ্যমে
                              </h3>
                              <p className="text-sm text-gray-400">
                                আপনার ইমেইলে পাঠান
                              </p>
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => setRecoveryMethod("phone")}
                          className="w-full card bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 border-2 border-orange-200 hover:border-orange-400 transition-all duration-300"
                        >
                          <div className="card-body p-6 flex-row items-center gap-4">
                            <div className="bg-orange-500 p-4 rounded-full">
                              <Phone className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-left flex-1">
                              <h3 className="font-bold text-lg text-orange-700">
                                ফোন নম্বরের মাধ্যমে
                              </h3>
                              <p className="text-sm text-gray-400">
                                SMS এর মাধ্যমে পাঠান
                              </p>
                            </div>
                          </div>
                        </button>
                      </div>
                    )}

                  {/* Step 3: Enter Details */}
                  {(selectedOption === "password" ||
                    selectedOption === "uid") &&
                    recoveryMethod && (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                          <button
                            type="button"
                            onClick={() => setRecoveryMethod("")}
                            className="btn btn-ghost btn-sm btn-circle"
                          >
                            <ArrowLeft className="w-4 h-4" />
                          </button>
                          <h3 className="text-lg font-semibold text-gray-700">
                            আপনার তথ্য দিন
                          </h3>
                        </div>

                        {/* Email Input */}
                        {recoveryMethod === "email" && (
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-semibold">
                                ইমেইল অ্যাড্রেস
                              </span>
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="email"
                                placeholder="your.email@example.com"
                                className="input input-bordered w-full pl-12"
                                value={formData.email}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    email: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                          </div>
                        )}

                        {/* Phone Input */}
                        {recoveryMethod === "phone" && (
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-semibold">
                                মোবাইল নম্বর
                              </span>
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="tel"
                                placeholder="01XXXXXXXXX"
                                className="input input-bordered w-full pl-12"
                                value={formData.phone}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    phone: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                          </div>
                        )}

                        {/* Student ID Input (only for password recovery) */}
                        {selectedOption === "password" && (
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-semibold">
                                Student ID (ঐচ্ছিক)
                              </span>
                            </label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="text"
                                placeholder="STU-0001"
                                className="input input-bordered w-full pl-12"
                                value={formData.studentId}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    studentId: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="btn btn-primary w-full btn-lg gap-2"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              পাঠানো হচ্ছে...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5" />
                              পাঠান
                            </>
                          )}
                        </button>
                      </form>
                    )}
                </>
              ) : foundStudent ? (
                /* Instant Search Result */
                <div className="space-y-6">
                  <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full shadow-lg mx-auto mb-4 animate-bounce">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </div>

                  <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">
                    তথ্য পাওয়া গেছে!
                  </h2>

                  <div className="card bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-purple-200">
                    <div className="card-body p-6 space-y-4">
                      <div className="flex gap-4">
                        <div className="avatar">
                          <div className="w-20 h-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img
                              src={foundStudent.image}
                              alt={foundStudent.name}
                            />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">
                            {foundStudent.name}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {foundStudent.role === "student"
                              ? foundStudent.name
                              : "প্রশাসক"}
                          </p>
                        </div>
                      </div>

                      <div className="divider"></div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <User className="w-5 h-5 text-purple-500" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500">Student ID</p>
                            <p className="font-bold text-purple-700">
                              {foundStudent.studentId}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <Mail className="w-5 h-5 text-blue-500" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500">ইমেইল</p>
                            <p className="font-bold text-blue-700 text-sm">
                              {foundStudent.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <Phone className="w-5 h-5 text-green-500" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500">ফোন</p>
                            <p className="font-bold text-green-700" dir="ltr">
                              {foundStudent.phone}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <Lock className="w-5 h-5 text-orange-500" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500">পাসওয়ার্ড</p>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-orange-700 font-mono">
                                {showPassword
                                  ? foundStudent.password
                                  : "••••••••"}
                              </p>
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="btn btn-ghost btn-xs"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="alert alert-warning mt-4">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-sm">
                          নিরাপত্তার জন্য পাসওয়ার্ড পরিবর্তন করার পরামর্শ
                          দেওয়া হচ্ছে
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleReset}
                      className="btn btn-outline flex-1 border border-blue-700 text-blue-700 bg-blue-100"
                    >
                      আবার খুঁজুন
                    </button>
                    <Link to="/login" className="btn btn-primary flex-1">
                      লগইন করুন
                    </Link>
                  </div>
                </div>
              ) : (
                /* Success Message for Email/Phone Recovery */
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full shadow-lg animate-bounce">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-green-600 mb-2">
                      সফলভাবে পাঠানো হয়েছে!
                    </h2>
                    <p className="text-gray-400">
                      আপনার {recoveryMethod === "email" ? "ইমেইলে" : "ফোনে"}{" "}
                      তথ্য পাঠানো হয়েছে। অনুগ্রহ করে চেক করুন।
                    </p>
                  </div>

                  <div className="alert alert-info">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">
                      যদি না পান, তাহলে স্প্যাম ফোল্ডার চেক করুন অথবা আমাদের
                      সাথে যোগাযোগ করুন।
                    </span>
                  </div>

                  <button
                    onClick={handleReset}
                    className="btn btn-outline border-blue-500 text-blue-500 btn-lg"
                  >
                    আবার চেষ্টা করুন
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Contact Support */}
          <div className="space-y-6">
            {/* Help Card */}
            <div className="card bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl">
              <div className="card-body p-8">
                <h2 className="card-title text-2xl mb-4">
                  <KeyRound className="w-8 h-8" />
                  সাহায্য প্রয়োজন?
                </h2>
                <p className="mb-6">
                  যদি আপনার তথ্য পুনরুদ্ধার করতে সমস্যা হয়, তাহলে আমাদের সাথে
                  সরাসরি যোগাযোগ করুন। আমরা সাহায্য করতে প্রস্তুত!
                </p>

                <div className="space-y-4">
                  {/* Phone */}
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="card bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300"
                  >
                    <div className="card-body p-4 flex-row items-center gap-3">
                      <Phone className="w-6 h-6" />
                      <div>
                        <p className="text-sm opacity-90">ফোন করুন</p>
                        <p className="font-bold" dir="ltr">
                          {contactInfo.phone}
                        </p>
                      </div>
                    </div>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${contactInfo.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300"
                  >
                    <div className="card-body p-4 flex-row items-center gap-3">
                      <MessageCircle className="w-6 h-6" />
                      <div>
                        <p className="text-sm opacity-90">WhatsApp</p>
                        <p className="font-bold" dir="ltr">
                          {contactInfo.whatsapp}
                        </p>
                      </div>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="card bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300"
                  >
                    <div className="card-body p-4 flex-row items-center gap-3">
                      <Mail className="w-6 h-6" />
                      <div>
                        <p className="text-sm opacity-90">ইমেইল করুন</p>
                        <p className="font-bold text-sm truncate">
                          {contactInfo.email}
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Security Tips */}
            <div className="card bg-white shadow-xl">
              <div className="card-body p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-400">
                  <ShieldCheck className="w-6 h-6  text-green-500" />
                  নিরাপত্তা টিপস
                </h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>শক্তিশালী পাসওয়ার্ড ব্যবহার করুন (৮+ অক্ষর)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>পাসওয়ার্ড কারো সাথে শেয়ার করবেন না</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>নিয়মিত পাসওয়ার্ড পরিবর্তন করুন</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>সন্দেহজনক লিংকে ক্লিক করবেন না</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotCredentials;
