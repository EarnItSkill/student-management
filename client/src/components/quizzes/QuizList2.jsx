import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle,
  Edit,
  Eye,
  Grid,
  List as ListIcon,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../../context/useAppContext";
import ConfirmModal from "../common/ConfirmModal";

const QuizList = ({ onEdit, onAdd }) => {
  const { quizzes, batches, courses, deleteQuiz } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");

  // নেভিগেশন স্টেট: নির্বাচিত ব্যাচ টাইপ গ্রুপ (যেমন: "Ict") ধরে রাখার জন্য
  const [selectedBatchTypeGroup, setSelectedBatchTypeGroup] = useState(null);

  // নেভিগেশন স্টেট: নির্বাচিত চ্যাপ্টার নাম ধরে রাখার জন্য
  const [selectedChapter, setSelectedChapter] = useState(null);

  const [quizSearchTerm, setQuizSearchTerm] = useState("");
  const [viewType, setViewType] = useState("grid");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, quiz: null });
  const [viewModal, setViewModal] = useState({ isOpen: false, quiz: null });

  // 1. Group quizzes by batch and calculate stats
  // (এই অংশটি অপরিবর্তিত, কারণ এটি প্রতি ব্যাচের তথ্য ঠিকভাবে যোগ করে)
  const batchesWithQuizzes = batches.map((batch) => {
    const batchQuizzes = quizzes.filter(
      (quiz) => quiz.courseId === batch.courseId || quiz.batchId === batch._id
    );
    const course = courses.find((c) => c._id === batch.courseId);
    return {
      ...batch,
      quizzes: batchQuizzes,
      course: course,
      // এই সংখ্যাগুলো ঠিক আছে, কারণ এগুলো প্রতি ব্যাচের জন্য আলাদাভাবে গণনা করা হচ্ছে
      totalQuestions: batchQuizzes.reduce(
        (sum, q) => sum + q.questions.length,
        0
      ),
      totalSubmissions: batchQuizzes.reduce(
        (sum, q) => sum + q.results.length,
        0
      ),
    };
  });

  // 👈 ফিক্সড লজিক: batchType অনুযায়ী গ্রুপ করা এবং ডুপ্লিকেট কুইজ গণনা এড়িয়ে যাওয়া (RENDER 1-এর জন্য)
  const groupedBatches = batchesWithQuizzes.reduce((acc, batch) => {
    const type = batch.batchType || "Others";
    if (!acc[type]) {
      acc[type] = {
        batchType: type,
        batches: [],
        uniqueQuizIds: new Set(), // 👈 নতুন: ইউনিক কুইজ আইডি ট্র্যাক করার জন্য
        totalQuizzes: 0,
        totalQuestions: 0,
        totalSubmissions: 0,
      };
    }
    acc[type].batches.push(batch);

    // ডুপ্লিকেট কুইজ এড়িয়ে সঠিক গণনা করা
    batch.quizzes.forEach((quiz) => {
      if (!acc[type].uniqueQuizIds.has(quiz._id)) {
        acc[type].uniqueQuizIds.add(quiz._id);
        // শুধুমাত্র ইউনিক কুইজের সংখ্যা এবং অন্যান্য ডেটা যোগ করা হলো
        acc[type].totalQuizzes += 1;
        acc[type].totalQuestions += quiz.questions.length;
        acc[type].totalSubmissions += quiz.results.length; // সাবমিশন যেহেতু কুইজের সাথে যুক্ত, তাই এটিও ইউনিক হবে
      }
    });

    return acc;
  }, {});

  const batchTypeGroups = Object.values(groupedBatches);

  // RENDER 1-এর জন্য সার্চ লজিক
  const filteredBatchTypeGroups = batchTypeGroups.filter((group) =>
    group.batchType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // RENDER 2-এর জন্য ডেটা প্রসেসিং (Group থেকে Chapter List)
  const groupData = selectedBatchTypeGroup
    ? batchTypeGroups.find((g) => g.batchType === selectedBatchTypeGroup)
    : null;

  let chapterList = [];
  let quizzesForSelectedGroup = [];
  let currentBatchForQuizAdd = null;

  if (groupData) {
    // 👈 ফিক্সড লজিক: নির্বাচিত গ্রুপের সমস্ত ইউনিক কুইজ সংগ্রহ করা
    const allQuizzesInGroup = groupData.batches.flatMap(
      (batch) => batch.quizzes
    );
    const uniqueQuizMap = new Map();

    allQuizzesInGroup.forEach((quiz) => {
      uniqueQuizMap.set(quiz._id, quiz); // আইডি ব্যবহার করে ডুপ্লিকেট বাদ দেওয়া
    });

    quizzesForSelectedGroup = Array.from(uniqueQuizMap.values()); // ইউনিক কুইজের তালিকা

    // ইউনিক কুইজ থেকে চ্যাপ্টার এবং কুইজগুলো গ্রুপ করা
    const chaptersWithQuizzes = quizzesForSelectedGroup.reduce((acc, quiz) => {
      const chapterName = quiz.chapter || "Uncategorized";
      if (!acc[chapterName]) {
        acc[chapterName] = {
          name: chapterName,
          quizzes: [],
          totalQuestions: 0,
          totalSubmissions: 0,
        };
      }
      // চ্যাপ্টার লজিক ঠিক করতে কুইজের সাথে ডেটা যুক্ত করা হলো
      acc[chapterName].quizzes.push(quiz);
      acc[chapterName].totalQuestions += quiz.questions.length;
      acc[chapterName].totalSubmissions += quiz.results.length;
      return acc;
    }, {});

    chapterList = Object.values(chaptersWithQuizzes).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: "base",
      })
    );

    // কুইজ অ্যাড করার জন্য গ্রুপের প্রথম ব্যাচ আইডি নেওয়া
    currentBatchForQuizAdd = groupData.batches[0]?._id;
  }

  // RENDER 3-এর জন্য ডেটা প্রসেসিং (Chapter List থেকে Quiz List)
  const chapterQuizzes =
    selectedChapter && quizzesForSelectedGroup.length > 0
      ? chapterList
          .find((c) => c.name === selectedChapter)
          ?.quizzes.filter((quiz) =>
            quiz.title.toLowerCase().includes(quizSearchTerm.toLowerCase())
          )
      : [];

  // নেভিগেশন এবং ইউটিলিটি ফাংশন (অপরিবর্তিত)
  const handleDelete = (quiz) => {
    setDeleteModal({ isOpen: true, quiz });
  };

  const confirmDelete = () => {
    if (deleteModal.quiz) {
      deleteQuiz(deleteModal.quiz._id);
      setDeleteModal({ isOpen: false, quiz: null });
    }
  };

  const handleBackToGroups = () => {
    setSelectedBatchTypeGroup(null);
    setSelectedChapter(null);
    setSearchTerm("");
    setQuizSearchTerm("");
  };

  const handleBackToChapters = () => {
    setSelectedChapter(null);
    setQuizSearchTerm("");
  };

  // --- RENDER LOGIC ---

  // ====================================================================
  // RENDER 1: Batch Type Group List View
  // ====================================================================

  if (!selectedBatchTypeGroup) {
    const totalQuizzes = batchTypeGroups.reduce(
      (sum, g) => sum + g.totalQuizzes,
      0
    );
    const totalQuestions = batchTypeGroups.reduce(
      (sum, g) => sum + g.totalQuestions,
      0
    );

    return (
      <div>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold">
            Quizzes Management - Select Batch Type (Group View)
          </h2>
        </div>

        {/* Stats - Overall */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-figure text-primary">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Batch Types</div>
            <div className="stat-value text-primary">
              {batchTypeGroups.length}
            </div>
          </div>
          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-figure text-success">
              <Award className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Unique Quizzes</div>
            <div className="stat-value text-success">{totalQuizzes}</div>
          </div>
          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-figure text-info">
              <Award className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Questions (Unique)</div>
            <div className="stat-value text-info">{totalQuestions}</div>
          </div>
        </div>

        {/* Search Input */}
        <div className="form-control mb-6">
          <div className="input-group">
            <span className="bg-base-200">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search by Batch Type (e.g. Ict, Office)..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Batch Type Group Cards */}
        {filteredBatchTypeGroups.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No batch types found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBatchTypeGroups.map((group) => (
              <div
                key={group.batchType}
                onClick={() => {
                  setSelectedBatchTypeGroup(group.batchType);
                  setSearchTerm("");
                }}
                className="card bg-gradient-to-br from-secondary/10 to-secondary/5 shadow-xl hover:shadow-2xl transition-all cursor-pointer border-2 border-secondary/20 hover:border-secondary/50"
              >
                <div className="card-body">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="card-title text-2xl text-secondary">
                        {group.batchType}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Group of {group.batches.length} Batches
                      </p>
                    </div>
                    <BookOpen className="w-8 h-8 text-secondary flex-shrink-0" />
                  </div>

                  <div className="divider my-2"></div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Total Unique Quizzes:
                      </span>
                      <span className="badge badge-primary">
                        {group.totalQuizzes}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Total Unique Questions:
                      </span>
                      <span className="badge badge-success">
                        {group.totalQuestions}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Submissions:</span>
                      <span className="badge badge-info">
                        {group.totalSubmissions}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <button className="btn btn-secondary btn-sm w-full">
                      View Chapters
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ====================================================================
  // RENDER 2: Chapter List View (Selected Batch Type Group)
  // ====================================================================

  if (selectedBatchTypeGroup && !selectedChapter) {
    // এই ভিউতে এখন সঠিক (Unique) ডেটা দেখাচ্ছে
    const totalQuizzesInGroup = groupData.totalQuizzes;
    const totalQuestionsInGroup = groupData.totalQuestions;
    const totalSubmissionsInGroup = groupData.totalSubmissions;

    return (
      <div>
        {/* Header with Back Button (to Batch Type Groups) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToGroups}
              className="btn btn-ghost btn-sm gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Batch Types
            </button>
            <div>
              <h2 className="text-2xl font-bold text-secondary">
                Chapters for: {selectedBatchTypeGroup}
              </h2>
              <p className="text-sm text-gray-400">
                {groupData.batches.length} Batches Covered (Unique Quizzes:{" "}
                {groupData.totalQuizzes})
              </p>
            </div>
          </div>
          {/* Add Quiz Button - Enabled */}
          <button
            onClick={() => onAdd({ batchId: currentBatchForQuizAdd })}
            className="btn btn-primary gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Quiz
          </button>
        </div>

        {/* Stats for this Group */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-figure text-primary">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Chapters</div>
            <div className="stat-value text-primary">{chapterList.length}</div>
          </div>
          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-figure text-success">
              <Award className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Unique Quizzes</div>
            <div className="stat-value text-success">{totalQuizzesInGroup}</div>
          </div>
          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-figure text-info">
              <Award className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Unique Questions</div>
            <div className="stat-value text-info">{totalQuestionsInGroup}</div>
          </div>
        </div>

        {/* Search Input for Chapters/Quizzes */}
        <div className="form-control mb-6">
          <div className="input-group">
            <span className="bg-base-200">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search chapters or quizzes..."
              className="input input-bordered w-full"
              value={quizSearchTerm}
              onChange={(e) => setQuizSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Chapter List Grid */}
        {chapterList.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">
              No quizzes or chapters found for this batch type.
            </p>
            <button
              onClick={() => onAdd({ batchId: currentBatchForQuizAdd })}
              className="btn btn-primary btn-sm mt-4 gap-2"
            >
              <Plus className="w-4 h-4" />
              Add First Quiz
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapterList
              .filter((chapter) =>
                chapter.name
                  .toLowerCase()
                  .includes(quizSearchTerm.toLowerCase())
              )
              .map((chapter) => (
                <div
                  key={chapter.name}
                  // 👈 ফিক্সড: চ্যাপ্টার কার্ডে ক্লিক করলে কুইজ লিস্ট লোড হবে
                  onClick={() => setSelectedChapter(chapter.name)}
                  className="card bg-base-100 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-base-200 hover:border-info/50"
                >
                  <div className="card-body">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="card-title text-lg">
                          Chapter: {chapter.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {selectedBatchTypeGroup} Group
                        </p>
                      </div>
                      <BookOpen className="w-8 h-8 text-info flex-shrink-0" />
                    </div>

                    <div className="divider my-2"></div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quizzes:</span>
                        <span className="badge badge-info">
                          {chapter.quizzes.length}{" "}
                          {/* এখন এটি ইউনিক কুইজের সংখ্যা দেখাচ্ছে */}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Questions:</span>
                        <span className="badge badge-success">
                          {chapter.totalQuestions}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Submissions:</span>
                        <span className="badge badge-primary">
                          {chapter.totalSubmissions}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 text-center">
                      <button className="btn btn-info btn-sm w-full">
                        View Quizzes
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    );
  }

  // ====================================================================
  // RENDER 3: Quiz List for Selected Chapter
  // ====================================================================

  const totalChapterQuestions = chapterQuizzes.reduce(
    (sum, q) => sum + q.questions.length,
    0
  );
  const totalChapterSubmissions = chapterQuizzes.reduce(
    (sum, q) => sum + q.results.length,
    0
  );

  return (
    <div>
      {/* Header with Back Button (to Chapters) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackToChapters}
            className="btn btn-ghost btn-sm gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Chapters
          </button>
          <div>
            <h2 className="text-2xl font-bold">
              Chapter: {selectedChapter} Quizzes
            </h2>
            <p className="text-sm text-gray-400">
              {selectedBatchTypeGroup} Group
            </p>
          </div>
        </div>
        <button
          onClick={() =>
            onAdd({ batchId: currentBatchForQuizAdd, chapter: selectedChapter })
          }
          className="btn btn-primary gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Quiz
        </button>
      </div>

      {/* Chapter Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-primary">
            <Award className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Quizzes (Chapter)</div>
          <div className="stat-value text-primary">{chapterQuizzes.length}</div>
        </div>
        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-success">
            <Award className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Questions (Chapter)</div>
          <div className="stat-value text-success">{totalChapterQuestions}</div>
        </div>
        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-figure text-info">
            <Award className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Submissions (Chapter)</div>
          <div className="stat-value text-info">{totalChapterSubmissions}</div>
        </div>
      </div>

      {/* Search and View Toggle */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="form-control flex-1">
          <div className="input-group flex items-center gap-3">
            <span className="bg-base-200">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search quizzes..."
              className="input input-bordered w-full"
              value={quizSearchTerm}
              onChange={(e) => setQuizSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="btn-group">
          <button
            className={`btn ${viewType === "grid" ? "btn-active" : ""}`}
            onClick={() => setViewType("grid")}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            className={`btn ${viewType === "table" ? "btn-active" : ""}`}
            onClick={() => setViewType("table")}
          >
            <ListIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Results Count */}
      {quizSearchTerm && (
        <div className="alert alert-info mb-4">
          <span>
            Found {chapterQuizzes.length} quiz(es) matching "{quizSearchTerm}"
          </span>
        </div>
      )}

      {/* Quizzes Display */}
      {chapterQuizzes.length === 0 ? (
        <div className="text-center py-12">
          <Award className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">
            {quizSearchTerm
              ? "No quizzes found matching your search"
              : `No quizzes found for ${selectedChapter} chapter`}
          </p>
          {!quizSearchTerm && (
            <button
              onClick={() =>
                onAdd({
                  batchId: currentBatchForQuizAdd,
                  chapter: selectedChapter,
                })
              }
              className="btn btn-primary btn-sm mt-4 gap-2"
            >
              <Plus className="w-4 h-4" />
              Add First Quiz
            </button>
          )}
        </div>
      ) : viewType === "grid" ? (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapterQuizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="card bg-base-100 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="card-body border rounded-2xl border-gray-500">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="card-title text-lg">{quiz.title}</h3>
                    <div className="badge badge-accent badge-sm mt-2">
                      Chapter {quiz.chapter}
                    </div>
                  </div>
                  <Award className="w-8 h-8 text-primary flex-shrink-0" />
                </div>

                <div className="divider my-2"></div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Questions:</span>
                    <span className="font-semibold">
                      {quiz.questions.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Marks:</span>
                    <span className="font-semibold">{quiz.totalMarks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Submissions:</span>
                    <span className="font-semibold">{quiz.results.length}</span>
                  </div>
                </div>

                <div className="card-actions justify-end mt-4 gap-2">
                  <button
                    onClick={() => setViewModal({ isOpen: true, quiz })}
                    className="btn btn-ghost btn-sm gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => onEdit(quiz)}
                    className="btn btn-info btn-sm gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(quiz)}
                    className="btn btn-error btn-sm gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Table View
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Quiz Title</th>
                <th>Chapter</th>
                <th>Questions</th>
                <th>Total Marks</th>
                <th>Submissions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {chapterQuizzes.map((quiz, index) => (
                <tr key={quiz._id} className="hover">
                  <td>{index + 1}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      <span className="font-semibold">{quiz.title}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-accent">
                      Chapter {quiz.chapter}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-primary">
                      {quiz.questions.length}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-success">
                      {quiz.totalMarks}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-info">
                      {quiz.results.length}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewModal({ isOpen: true, quiz })}
                        className="btn btn-ghost btn-xs gap-1"
                        title="View Quiz"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(quiz)}
                        className="btn btn-info btn-xs gap-1"
                        title="Edit Quiz"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(quiz)}
                        className="btn btn-error btn-xs gap-1"
                        title="Delete Quiz"
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

      {/* Delete Confirmation Modal (অপরিবর্তিত) */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, quiz: null })}
        onConfirm={confirmDelete}
        title="Delete Quiz"
        message={`Are you sure you want to delete "${deleteModal.quiz?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />

      {/* View Quiz Modal (অপরিবর্তিত) */}
      {viewModal.isOpen && viewModal.quiz && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-xl">{viewModal.quiz.title}</h3>
                <p className="text-sm text-gray-600">Quiz Preview</p>
              </div>
              <button
                onClick={() => setViewModal({ isOpen: false, quiz: null })}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            {/* Quiz Stats */}
            <div className="stats shadow mb-4 w-full">
              <div className="stat">
                <div className="stat-title">Total Questions</div>
                <div className="stat-value text-primary">
                  {viewModal.quiz.questions.length}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Total Marks</div>
                <div className="stat-value text-success">
                  {viewModal.quiz.totalMarks}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Submissions</div>
                <div className="stat-value text-info">
                  {viewModal.quiz.results?.length || 0}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {viewModal.quiz.questions.map((q, index) => {
                const correctAnswers = q.correctAnswers || [];
                const hasMultipleCorrect = correctAnswers.length > 1;

                return (
                  <div key={q.id} className="card bg-base-200 shadow-lg">
                    <div className="card-body p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-lg flex-1">
                          {index + 1}. {q.question}
                        </h4>
                        {hasMultipleCorrect && (
                          <div className="badge badge-info badge-lg gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Multiple Answers
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 mt-2">
                        {q.options.map((option, optIndex) => {
                          const isCorrect = correctAnswers.includes(optIndex);

                          return (
                            <div
                              key={optIndex}
                              className={`p-3 rounded-lg border-2 transition-all ${
                                isCorrect
                                  ? "bg-success text-white border-success font-semibold"
                                  : "bg-base-100 border-base-300"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold">
                                    {String.fromCharCode(65 + optIndex)}.
                                  </span>
                                  <span>{option}</span>
                                </div>
                                {isCorrect && (
                                  <div className="flex items-center gap-1">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="text-sm font-bold">
                                      Correct
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Show correct answers summary */}
                      <div className="divider my-2"></div>
                      <div className="alert alert-warning py-2">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-semibold">
                          Correct Answer{correctAnswers.length > 1 ? "s" : ""}:{" "}
                          {correctAnswers
                            .map((idx) => String.fromCharCode(65 + idx))
                            .join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="modal-action">
              <button
                onClick={() => setViewModal({ isOpen: false, quiz: null })}
                className="btn btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizList;
