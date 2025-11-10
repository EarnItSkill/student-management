import axios from "axios";
import { Edit2, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function CourseMakeForm() {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseFee: "",
    courseName: "",
    gender: "all",
    startTime: "",
    endTime: "",
    totalTime: "",
    type: "offline",
    totalMcq: "",
    totalCq: "",
    features: [],
    instructor: "",
  });

  const [featureInput, setFeatureInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ডাটা ফেচ করা
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/make-courses`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCourses(response.data.data);
    } catch (error) {
      console.error("কোর্স ফেচ করতে ত্রুটি:", error);
      setErrorMessage("কোর্স লোড করতে ব্যর্থ হয়েছে");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (editingId) {
        // আপডেট করা
        await axios.put(
          `${import.meta.env.VITE_API_URL}/make-courses/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSuccessMessage("কোর্স সফলভাবে আপডেট হয়েছে!");
      } else {
        // নতুন তৈরি করা
        await axios.post(
          `${import.meta.env.VITE_API_URL}/make-courses`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSuccessMessage("কোর্স সফলভাবে তৈরি হয়েছে!");
      }

      // ডাটা রিফ্রেশ করা
      await fetchCourses();
      handleReset();
      setShowForm(false);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("ত্রুটি:", error);
      setErrorMessage(
        error.response?.data?.message || "কোর্স সংরক্ষণে ব্যর্থ হয়েছে"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (course) => {
    setFormData({
      title: course.title,
      description: course.description,
      courseFee: course.courseFee,
      courseName: course.courseName,
      gender: course.gender,
      startTime: course.startTime,
      endTime: course.endTime,
      totalTime: course.totalTime,
      type: course.type,
      totalMcq: course.totalMcq,
      totalCq: course.totalCq,
      features: course.features,
      instructor: course.instructor,
    });
    setEditingId(course._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("এই কোর্স মুছতে চান?")) {
      return;
    }

    setIsLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/make-course/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSuccessMessage("কোর্স সফলভাবে মুছা হয়েছে!");
      await fetchCourses();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("মুছতে ত্রুটি:", error);
      setErrorMessage("কোর্স মুছতে ব্যর্থ হয়েছে");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      description: "",
      courseFee: "",
      courseName: "",
      gender: "all",
      startTime: "",
      endTime: "",
      totalTime: "",
      type: "offline",
      totalMcq: "",
      totalCq: "",
      features: [],
      instructor: "",
    });
    setEditingId(null);
  };

  // সার্চ ফিল্টার
  const filteredCourses = courses.filter(
    (course) =>
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // পেজিনেশন
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = filteredCourses.slice(
    startIdx,
    startIdx + itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* মেসেজ */}
        {successMessage && (
          <div className="mb-6 bg-green-900/30 border border-green-600 rounded-lg p-4 flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0 h-6 w-6 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-green-400">{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 bg-red-900/30 border border-red-600 rounded-lg p-4 flex items-center gap-3">
            <X className="w-6 h-6 text-red-500" />
            <span className="text-red-400">{errorMessage}</span>
          </div>
        )}

        {/* ফর্ম সেকশন */}
        {showForm ? (
          <div className="rounded-lg shadow-2xl border border-slate-700 bg-slate-800 p-6 md:p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-blue-400">
                {editingId ? "কোর্স সম্পাদনা করুন" : "নতুন কোর্স তৈরি করুন"}
              </h1>
              <button
                onClick={() => {
                  setShowForm(false);
                  handleReset();
                }}
                className="p-2 hover:bg-slate-700 rounded-lg transition"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title এবং Course Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="কোর্সের শিরোনাম"
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Course Name
                  </label>
                  <input
                    type="text"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleInputChange}
                    placeholder="কোর্সের নাম"
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="কোর্সের বিস্তারিত বর্ণনা"
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* Course Fee এবং Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Course Fee (টাকা)
                  </label>
                  <input
                    type="number"
                    name="courseFee"
                    value={formData.courseFee}
                    onChange={handleInputChange}
                    placeholder="যেমন: 5000"
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
                  >
                    <option value="offline">Offline</option>
                    <option value="online">Online</option>
                  </select>
                </div>
              </div>

              {/* Gender এবং Instructor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">সকলের জন্য</option>
                    <option value="male">পুরুষ</option>
                    <option value="female">মহিলা</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Instructor
                  </label>
                  <input
                    type="text"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleInputChange}
                    placeholder="শিক্ষকের নাম"
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Start Time এবং End Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    শুরু সময় (Start Time)
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    শেষ সময় (End Time)
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Total Time */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Total Time (মোট সময়)
                </label>
                <input
                  type="text"
                  name="totalTime"
                  value={formData.totalTime}
                  onChange={handleInputChange}
                  placeholder="যেমন: ৩ মাস"
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Total MCQ এবং Total CQ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Total MCQ
                  </label>
                  <input
                    type="number"
                    name="totalMcq"
                    value={formData.totalMcq}
                    onChange={handleInputChange}
                    placeholder="যেমন: 50"
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Total CQ
                  </label>
                  <input
                    type="number"
                    name="totalCq"
                    value={formData.totalCq}
                    onChange={handleInputChange}
                    placeholder="যেমন: 30"
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Features (বৈশিষ্ট্য)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="বৈশিষ্ট্য লিখুন এবং + বাটন ক্লিক করুন"
                    className="flex-1 px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    যোগ করুন
                  </button>
                </div>

                {formData.features.length > 0 && (
                  <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
                    {formData.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-slate-700 p-3 rounded-lg"
                      >
                        <span className="text-slate-200">{feature}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className="p-1 hover:bg-red-600 rounded transition"
                        >
                          <X className="w-5 h-5 text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition disabled:cursor-not-allowed"
                >
                  {isLoading ? "প্রক্রিয়া করছে..." : "সংরক্ষণ করুন"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    handleReset();
                  }}
                  className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-lg transition border border-slate-600"
                >
                  বাতিল করুন
                </button>
              </div>
            </form>
          </div>
        ) : null}

        {/* কোর্স লিস্ট সেকশন */}
        <div className="rounded-lg shadow-2xl border border-slate-700 bg-slate-800 p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-400">সকল কোর্স</h2>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              নতুন কোর্স যোগ করুন
            </button>
          </div>

          {/* সার্চ বার */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="কোর্স নাম, শিক্ষক বা শিরোনাম দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* কোর্স টেবিল */}
          {isLoading && filteredCourses.length === 0 ? (
            <div className="p-8 text-center text-slate-400">লোড হচ্ছে...</div>
          ) : paginatedCourses.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              কোন কোর্স পাওয়া যায়নি
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700 border-b border-slate-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200">
                      কোর্স নাম
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200">
                      শিক্ষক
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200">
                      ফি
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200">
                      সময়
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200">
                      অ্যাকশন
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCourses.map((course, idx) => (
                    <tr
                      key={course._id}
                      className={`border-b border-slate-700 ${
                        idx % 2 === 0 ? "bg-slate-800" : "bg-slate-750"
                      } hover:bg-slate-700 transition`}
                    >
                      <td className="px-4 py-3 text-sm text-slate-200">
                        {course.courseName}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300">
                        {course.instructor}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-green-400">
                        ৳ {course.courseFee}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300">
                        {course.type}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300">
                        {course.startTime} - {course.endTime}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(course)}
                            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(course._id)}
                            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* পেজিনেশন */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg"
              >
                আগে
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg transition ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-slate-700 hover:bg-slate-600 text-slate-200"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg"
              >
                পরে
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
