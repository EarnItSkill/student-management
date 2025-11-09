import { BookOpen, DollarSign, TrendingUp } from "lucide-react";
import { useState } from "react";
import McqRankPage from "./McqRankPage";
import StudentQuizPage from "./StudentQuizPage";
import StudentQuizResults from "./StudentQuizResults";

const McqPage = () => {
  const [activeTab, setActiveTab] = useState("mcq");

  // Get current student's enrollment
  return (
    <div className="min-h-screen bg-base-200 p-2">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="tabs tabs-boxed mb-6 bg-base-100 p-2 shadow-lg overflow-x-auto flex-nowrap">
          <a
            role="tab"
            className={`tab gap-2 whitespace-nowrap ${
              activeTab === "mcq" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("mcq")}
          >
            <TrendingUp className="w-4 h-4" />
            MCQ Exam
          </a>
          <a
            role="tab"
            className={`tab gap-2 whitespace-nowrap ${
              activeTab === "result" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("result")}
          >
            <BookOpen className="w-4 h-4" />
            MCQ Result
          </a>
          <a
            role="tab"
            className={`tab gap-2 whitespace-nowrap ${
              activeTab === "rank" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("rank")}
          >
            <DollarSign className="w-4 h-4" />
            MCQ Exam Rank
          </a>
        </div>
        <div>{activeTab === "mcq" && <StudentQuizPage />}</div>
        <div>{activeTab === "result" && <StudentQuizResults />}</div>
        <div>{activeTab === "rank" && <McqRankPage />}</div>
      </div>
    </div>
  );
};

export default McqPage;
