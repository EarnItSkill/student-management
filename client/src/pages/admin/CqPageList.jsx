// =====================================================
// FILE 1: src/pages/admin/CqPageList.jsx
// Admin CQ List Page
// =====================================================
import {
  BookOpen,
  Eye,
  FileText,
  Grid,
  Image as ImageIcon,
  List,
  Plus,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CqDetailModal from "../../components/cq/CqDetailModal";
import { useAppContext } from "../../context/useAppContext";

const CqPageList = () => {
  const navigate = useNavigate();
  const { cqQuestions, courses } = useAppContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [selectedCq, setSelectedCq] = useState(null);

  // Group by chapter
  const chapterGroups = useMemo(() => {
    const groups = {};

    cqQuestions.forEach((cq) => {
      const chapter = cq.chapter || "Unknown";
      if (!groups[chapter]) {
        groups[chapter] = [];
      }
      groups[chapter].push(cq);
    });

    return groups;
  }, [cqQuestions]);

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

  // Filter CQs by chapter and search
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Creative Questions (CQ)</h2>
          <p className="text-gray-600 mt-1">
            Manage chapter-wise creative questions
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/admin/cq/add")}
          className="btn btn-primary gap-2"
        >
          <Plus className="w-5 h-5" />
          Add CQ Question
        </button>
      </div>

      {/* Chapter Selection */}
      {!selectedChapter ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {chapters.map((chapter) => {
            const count = chapterGroups[chapter].length;

            return (
              <div
                key={chapter}
                onClick={() => setSelectedChapter(chapter)}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:scale-105"
              >
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <BookOpen className="w-8 h-8 text-primary" />
                    <div className="badge badge-primary">{count} CQs</div>
                  </div>
                  <h3 className="text-2xl font-bold mt-2">Chapter {chapter}</h3>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          {/* Toolbar */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <button
                  onClick={() => {
                    setSelectedChapter(null);
                    setSearchTerm("");
                  }}
                  className="btn btn-ghost"
                >
                  ← Back to Chapters
                </button>

                <div className="form-control flex-1">
                  <div className="input-group">
                    <span className="bg-base-200">
                      <Search className="w-5 h-5" />
                    </span>
                    <input
                      type="text"
                      placeholder="Search in stimulus or questions..."
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
                <p className="text-gray-500">
                  No CQ questions found for Chapter {selectedChapter}
                </p>
              </div>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCqs.map((cq) => (
                <div key={cq._id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex items-center justify-between mb-3">
                      {cq.stimulusType === "image" ? (
                        <ImageIcon className="w-6 h-6 text-primary" />
                      ) : (
                        <FileText className="w-6 h-6 text-primary" />
                      )}
                      <div className="badge badge-primary">
                        Ch. {cq.chapter}
                      </div>
                    </div>

                    {cq.stimulusType === "image" ? (
                      <div className="w-full h-32 bg-base-200 rounded-lg overflow-hidden">
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
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {cq.stimulusContent}
                      </p>
                    )}

                    <div className="divider my-2"></div>

                    <div className="text-sm space-y-1">
                      <p className="font-semibold">Questions:</p>
                      {cq.questions.map((q, idx) => (
                        <p key={idx} className="text-gray-600 line-clamp-1">
                          {idx + 1}. {q.question}
                        </p>
                      ))}
                    </div>

                    <button
                      onClick={() => setSelectedCq(cq)}
                      className="btn btn-primary btn-sm mt-3 gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="space-y-4">
                  {filteredCqs.map((cq) => (
                    <div
                      key={cq._id}
                      className="card bg-base-200 shadow hover:shadow-lg transition-all"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-start gap-4">
                          {cq.stimulusType === "image" ? (
                            <div className="w-24 h-24 bg-base-300 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={cq.stimulusContent}
                                alt="Stimulus"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src =
                                    "https://via.placeholder.com/100?text=Img";
                                }}
                              />
                            </div>
                          ) : (
                            <FileText className="w-12 h-12 text-primary flex-shrink-0" />
                          )}

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="badge badge-primary">
                                Ch. {cq.chapter}
                              </div>
                              <div className="badge badge-ghost">
                                {cq.stimulusType === "image" ? "Image" : "Text"}
                              </div>
                            </div>

                            {cq.stimulusType === "text" && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {cq.stimulusContent}
                              </p>
                            )}

                            <div className="text-sm">
                              <p className="font-semibold mb-1">Questions:</p>
                              {cq.questions.map((q, idx) => (
                                <p key={idx} className="text-gray-600">
                                  {idx + 1}. {q.question}
                                </p>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={() => setSelectedCq(cq)}
                            className="btn btn-primary btn-sm gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {selectedCq && (
        <CqDetailModal cq={selectedCq} onClose={() => setSelectedCq(null)} />
      )}
    </div>
  );
};

export default CqPageList;
