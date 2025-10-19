// =====================================================
// FILE: src/pages/StudentCqPage.jsx
// =====================================================
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Eye,
  FileText,
  Grid,
  Image as ImageIcon,
  List,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";
import { parseSpecialToJSX } from "../utils/parseSpecialToJSX";

const StudentCqPage = () => {
  const navigate = useNavigate();
  const { cqQuestions, currentUser, enrollments } = useAppContext();

  const [selectedChapter, setSelectedChapter] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCq, setSelectedCq] = useState(null);

  // Get student's enrollment
  const studentEnrollment = useMemo(() => {
    return enrollments.find((e) => e.studentId === currentUser?._id);
  }, [enrollments, currentUser]);

  // Filter CQs by student's course
  const studentCqs = useMemo(() => {
    if (!studentEnrollment) return [];

    return cqQuestions.filter(
      (cq) => cq.courseId === studentEnrollment.courseId
    );
  }, [cqQuestions, studentEnrollment]);

  // Group by chapter
  const chapterGroups = useMemo(() => {
    const groups = {};

    studentCqs.forEach((cq) => {
      const chapter = cq.chapter || "Unknown";
      if (!groups[chapter]) {
        groups[chapter] = [];
      }
      groups[chapter].push(cq);
    });

    return groups;
  }, [studentCqs]);

  // Get chapters sorted
  const chapters = useMemo(() => {
    return Object.keys(chapterGroups).sort((a, b) => {
      const numA = parseInt(a);
      const numB = parseInt(b);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.localeCompare(b);
    });
  }, [chapterGroups]);

  // Filter CQs by search
  const filteredCqs = useMemo(() => {
    if (!selectedChapter) return [];

    let filtered = chapterGroups[selectedChapter] || [];

    if (searchTerm) {
      filtered = filtered.filter(
        (cq) =>
          cq.stimulusContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cq.questions.some((q) =>
            q.question.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    return filtered;
  }, [selectedChapter, chapterGroups, searchTerm]);

  // CQ Detail Modal Component
  const CqDetailView = ({ cq, onClose }) => (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl max-h-[90vh]">
        <div className="flex justify-between items-center mb-6 pb-4 border-b sticky top-0 bg-base-100 z-10">
          <div>
            <h3 className="font-bold text-2xl">প্রশ্ন বিস্তারিত</h3>
            <p className="text-sm text-gray-600 mt-1">অধ্যায় {cq.chapter}</p>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stimulus */}
        <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 shadow-lg mb-6">
          <div className="card-body">
            <div className="flex items-center gap-2 mb-4">
              {cq.stimulusType === "image" ? (
                <ImageIcon className="w-6 h-6 text-primary" />
              ) : (
                <FileText className="w-6 h-6 text-primary" />
              )}
              <h4 className="text-xl font-bold">উদ্দীপক</h4>
            </div>

            {cq.stimulusType === "image" ? (
              <div className="w-full bg-base-100 rounded-lg overflow-hidden">
                <img
                  src={cq.stimulusContent}
                  alt="Stimulus"
                  className="w-full h-auto"
                />
              </div>
            ) : (
              <div className="p-4 bg-base-100 rounded-lg">
                <p className="whitespace-pre-wrap text-lg">
                  {parseSpecialToJSX(cq.stimulusContent)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          <h4 className="text-xl font-bold">প্রশ্নসমূহ</h4>
          {cq.questions.map((question, index) => (
            <div key={index} className="card bg-base-200 shadow">
              <div className="card-body">
                <div className="flex items-start gap-4">
                  <div className="badge badge-primary badge-lg">
                    {index + 3}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg mb-2">
                      {parseSpecialToJSX(question.question)}
                    </p>
                    {/* <div className="badge badge-ghost">
                      নম্বর: {question.marks}
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t">
          <button onClick={onClose} className="btn btn-primary">
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );

  if (!studentEnrollment) {
    return (
      <div className="min-h-screen bg-base-200 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center py-12">
              <AlertCircle className="w-20 h-20 mx-auto text-warning mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                আপনি কোন ব্যাচে ভর্তি নন
              </h2>
              <p className="text-gray-600 mb-6">
                CQ প্রশ্ন দেখতে প্রথমে একটি ব্যাচে ভর্তি হন
              </p>
              <button
                onClick={() => navigate("/dashboard/student")}
                className="btn btn-primary"
              >
                ড্যাশবোর্ডে ফিরুন
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/dashboard/student")}
            className="btn btn-ghost gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            ড্যাশবোর্ডে ফিরুন
          </button>
          <div className="flex items-center gap-3">
            <BookOpen className="w-10 h-10 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">সৃজনশীল প্রশ্ন (CQ)</h1>
              <p className="text-gray-600">
                অধ্যায়ভিত্তিক প্রশ্ন অনুশীলন করুন
              </p>
            </div>
          </div>
        </div>

        {/* Chapter Selection */}
        {!selectedChapter ? (
          <div>
            {chapters.length === 0 ? (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body text-center py-12">
                  <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">
                    এখনো কোন CQ প্রশ্ন পাওয়া যায়নি
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {chapters.map((chapter) => {
                  const count = chapterGroups[chapter].length;

                  return (
                    <div
                      key={chapter}
                      onClick={() => setSelectedChapter(chapter)}
                      className="card bg-gradient-to-br from-primary/10 to-secondary/10 shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:scale-105"
                    >
                      <div className="card-body">
                        <div className="flex items-center justify-between">
                          <BookOpen className="w-10 h-10 text-primary" />
                          <div className="badge badge-primary badge-lg">
                            {count} প্রশ্ন
                          </div>
                        </div>
                        <h3 className="text-3xl font-bold mt-3">
                          অধ্যায় {chapter}
                        </h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="card bg-base-100 shadow-xl mb-6">
              <div className="card-body">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <button
                    onClick={() => {
                      setSelectedChapter(null);
                      setSearchTerm("");
                    }}
                    className="btn btn-ghost"
                  >
                    ← অধ্যায় তালিকায় ফিরুন
                  </button>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold">
                      অধ্যায় {selectedChapter}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {filteredCqs.length} টি প্রশ্ন
                    </p>
                  </div>

                  <div className="form-control flex-1">
                    <div className="input-group">
                      <span className="bg-base-200">
                        <Search className="w-5 h-5" />
                      </span>
                      <input
                        type="text"
                        placeholder="প্রশ্ন খুঁজুন..."
                        className="input input-bordered w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="btn-group">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`btn ${
                        viewMode === "grid" ? "btn-primary" : ""
                      }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`btn ${
                        viewMode === "list" ? "btn-primary" : ""
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CQ List */}
            {filteredCqs.length === 0 ? (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body text-center py-12">
                  <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">কোন প্রশ্ন পাওয়া যায়নি</p>
                </div>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCqs.map((cq, index) => (
                  <div
                    key={cq._id}
                    className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all"
                  >
                    <div className="card-body">
                      <div className="flex items-center justify-between mb-3">
                        <div className="badge badge-primary badge-lg">
                          প্রশ্ন #{index + 1}
                        </div>
                        {cq.stimulusType === "image" ? (
                          <ImageIcon className="w-6 h-6 text-primary" />
                        ) : (
                          <FileText className="w-6 h-6 text-primary" />
                        )}
                      </div>

                      {cq.stimulusType === "image" ? (
                        <div className="w-full h-40 bg-base-200 rounded-lg overflow-hidden">
                          <img
                            src={cq.stimulusContent}
                            alt="Stimulus"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/300x200?text=Image";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="h-32">
                          <p className="text-sm text-gray-600 line-clamp-5">
                            {parseSpecialToJSX(cq.stimulusContent)}
                          </p>
                        </div>
                      )}

                      <div className="divider my-2"></div>

                      <div className="text-sm">
                        <p className="font-semibold mb-2">প্রশ্ন:</p>
                        {cq.questions.map((q, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 mb-1"
                          >
                            <span className="badge badge-sm">{idx + 1}</span>
                            <p className="text-gray-600 line-clamp-2 flex-1">
                              {parseSpecialToJSX(q.question)}
                            </p>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => setSelectedCq(cq)}
                        className="btn btn-primary btn-sm mt-3 gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        বিস্তারিত দেখুন
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCqs.map((cq, index) => (
                  <div
                    key={cq._id}
                    className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all"
                  >
                    <div className="card-body">
                      <div className="flex items-start gap-4">
                        {/* Index */}
                        <div className="badge badge-primary badge-lg">
                          #{index + 1}
                        </div>

                        {/* Stimulus Preview */}
                        {cq.stimulusType === "image" ? (
                          <div className="w-32 h-32 bg-base-200 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={cq.stimulusContent}
                              alt="Stimulus"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/150?text=Image";
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex-shrink-0">
                            <FileText className="w-12 h-12 text-primary" />
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-1">
                          {cq.stimulusType === "text" && (
                            <div className="mb-3">
                              <p className="font-semibold text-sm text-gray-600 mb-1">
                                উদ্দীপক:
                              </p>
                              <p className="text-sm line-clamp-3">
                                {parseSpecialToJSX(cq.stimulusContent)}
                              </p>
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-sm text-gray-600 mb-2">
                              প্রশ্ন:
                            </p>
                            <div className="space-y-2">
                              {cq.questions.map((q, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-2"
                                >
                                  <span className="badge badge-sm">
                                    {idx + 1}
                                  </span>
                                  <p className="text-sm flex-1">
                                    {parseSpecialToJSX(q.question)}
                                  </p>
                                  <span className="badge badge-ghost badge-sm">
                                    {q.marks} নম্বর
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() => setSelectedCq(cq)}
                          className="btn btn-primary btn-sm gap-2 flex-shrink-0"
                        >
                          <Eye className="w-4 h-4" />
                          বিস্তারিত
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Detail Modal */}
        {selectedCq && (
          <CqDetailView cq={selectedCq} onClose={() => setSelectedCq(null)} />
        )}
      </div>
    </div>
  );
};

export default StudentCqPage;
