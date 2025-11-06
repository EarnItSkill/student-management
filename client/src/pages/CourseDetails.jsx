import {
  ArrowLeft,
  BookMarked,
  Briefcase,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  HelpCircle,
  List,
  Lock,
  Unlock,
  X,
} from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";
import { parseSpecialToJSX } from "../utils/parseSpecialToJSX";
import {
  getClassUnlockDate,
  getClassUnlockDates,
  isClassUnlocked,
} from "../utils/scheduleHelper";

const CourseDetails = () => {
  const { id } = useParams();
  console.log(id);
  const navigate = useNavigate();
  const {
    courses,
    currentUser,
    isAuthenticated,
    batches,
    enrollments,
    quizzes,
  } = useAppContext();

  const [selectedClass, setSelectedClass] = useState(0);
  const [expandedGroups, setExpandedGroups] = useState([0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("topics");

  const location = useLocation();

  const handleBack = () => {
    const fromTab = location.state?.fromTab;

    if (fromTab) {
      localStorage.setItem("activeTab", fromTab);
    }

    navigate(-1);

    setTimeout(() => {
      localStorage.removeItem("activeTab");
    }, 100);
  };

  const course = courses?.find((c) => c._id === id);

  const studentEnrollment = isAuthenticated
    ? enrollments.find(
        (e) => e.studentId === currentUser?._id && e.courseId === id
      )
    : null;

  const studentBatch = studentEnrollment
    ? batches.find((b) => b._id === studentEnrollment.batchId)
    : null;

  const classUnlockDates =
    studentBatch && course?.classes
      ? getClassUnlockDates(
          studentBatch.startDate,
          studentBatch.scheduleType,
          course.classes.length
        )
      : [];

  const today = new Date().toISOString().split("T")[0];

  // Get Quiz for current class
  const selectedClassData = course?.classes[selectedClass];
  const classQuiz = quizzes?.find(
    (q, i) => q.courseId === id && i === selectedClass
    // (q) => q.courseId === id
  );

  const classesPerGroup = 10;
  const groupedClasses = course?.classes
    ? Array.from(
        { length: Math.ceil(course.classes.length / classesPerGroup) },
        (_, groupIndex) => {
          const start = groupIndex * classesPerGroup;
          const end = Math.min(start + classesPerGroup, course.classes.length);
          return {
            groupIndex,
            groupName: `ক্লাস ${start + 1}-${end}`,
            classes: course.classes.slice(start, end),
            startIndex: start,
          };
        }
      )
    : [];

  const toggleGroup = (groupIndex) => {
    setExpandedGroups((prev) =>
      prev.includes(groupIndex)
        ? prev.filter((g) => g !== groupIndex)
        : [...prev, groupIndex]
    );
  };

  const handleClassClick = (classIndex) => {
    setSelectedClass(classIndex);
    setActiveTab("topics");
    setIsSidebarOpen(false);
  };

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
          <button onClick={() => navigate(-1)} className="btn btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const classIsUnlocked =
    !isAuthenticated ||
    !studentBatch ||
    isClassUnlocked(selectedClass, classUnlockDates, today);

  const unlockDate = studentBatch
    ? getClassUnlockDate(selectedClass, classUnlockDates)
    : null;

  return (
    <>
      <div className="min-h-screen bg-base-200 py-8">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-6 flex items-center gap-4">
            <button onClick={handleBack} className="btn btn-ghost gap-2">
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            {isAuthenticated && studentBatch && (
              <div className="mb-4 w-11/12">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="font-semibold">Class Progress</span>
                  <span className="text-sm text-gray-500">
                    Batch: {studentBatch.batchName} | Schedule:{" "}
                    {studentBatch.scheduleType === "SIX_DAYS" &&
                      "শনি - বৃহস্পতিবার"}
                    {studentBatch.scheduleType === "THREE_DAYS_A" &&
                      "শনি, সোম, বুধ"}
                    {studentBatch.scheduleType === "THREE_DAYS_B" &&
                      "রবি, মঙ্গল, বৃহ"}
                    {" | শুরু: "}
                    {new Date(studentBatch.startDate).toLocaleDateString(
                      "en-GB"
                    )}
                    {" | সময়: "}
                    {studentBatch.startTime}
                  </span>
                  <span className="text-gray-400">
                    {
                      course.classes.filter((_, i) =>
                        isClassUnlocked(i, classUnlockDates, today)
                      ).length
                    }{" "}
                    / {course.classes.length} Unlocked
                  </span>
                </div>
                <progress
                  className="progress progress-primary w-full"
                  value={
                    course.classes.filter((_, i) =>
                      isClassUnlocked(i, classUnlockDates, today)
                    ).length
                  }
                  max={course.classes.length}
                ></progress>
              </div>
            )}
          </div>

          {/* Mobile Sidebar Toggle Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="btn btn-primary btn-block gap-2"
            >
              <GraduationCap className="w-5 h-5" />
              ক্লাসের লিস্ট দেখুন ({course.classes.length}টি)
            </button>
          </div>

          {/* Main Content with Sidebar */}
          {course.classes && course.classes.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Main Content Area */}
              <div className="lg:col-span-8">
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    {/* Class Header */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-base-300">
                      <div className="flex items-center gap-3">
                        <div className="badge badge-primary badge-lg">
                          Class {selectedClass + 1}
                        </div>
                        <h2 className="text-3xl font-bold">
                          {selectedClassData?.topic[0]}
                        </h2>
                      </div>
                      {classIsUnlocked ? (
                        studentBatch && (
                          <div className="badge badge-success gap-1">
                            <Unlock className="w-4 h-4" />
                            Unlocked
                          </div>
                        )
                      ) : (
                        <div className="badge badge-error gap-1">
                          <Lock className="w-4 h-4" />
                          Locked
                        </div>
                      )}
                    </div>

                    {/* Lock Notice for non-enrolled users */}
                    {!isAuthenticated && selectedClass >= 2 && (
                      <div className="alert alert-warning mb-6">
                        <Lock className="w-6 h-6" />
                        <div>
                          <h3 className="font-bold">Classes are locked</h3>
                          <div className="text-sm">
                            Please enroll in this course to unlock and access
                            all classes.
                          </div>
                        </div>
                      </div>
                    )}

                    {classIsUnlocked ||
                    (!isAuthenticated && selectedClass < 2) ? (
                      <div className="space-y-6">
                        {/* Video Player */}
                        <div className="card ">
                          <div className="card-body p-0">
                            {selectedClassData?.videoUrl ? (
                              <video
                                className="h-96"
                                width="100%"
                                height="auto"
                                controls
                                className="rounded-lg"
                              >
                                <source
                                  src={selectedClassData.videoUrl}
                                  type="video/mp4"
                                />
                                Your browser does not support the video tag.
                              </video>
                            ) : (
                              <div className="h-96 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg">
                                <div className="text-center">
                                  <svg
                                    className="w-16 h-16 mx-auto mb-4 text-gray-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  <p className="text-gray-400 font-semibold">
                                    ভিডিও উপলব্ধ নেই
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 border-b border-base-300 flex-wrap">
                          <button
                            onClick={() => setActiveTab("topics")}
                            className={`px-4 py-2 font-semibold transition-all ${
                              activeTab === "topics"
                                ? "border-b-2 border-primary text-primary"
                                : "text-base-content hover:text-primary"
                            }`}
                          >
                            Topics
                          </button>
                          <button
                            onClick={() => setActiveTab("qa")}
                            className={`px-4 py-2 font-semibold transition-all ${
                              activeTab === "qa"
                                ? "border-b-2 border-primary text-primary"
                                : "text-base-content hover:text-primary"
                            }`}
                          >
                            Q & A
                          </button>
                          <button
                            onClick={() => setActiveTab("homework")}
                            className={`px-4 py-2 font-semibold transition-all ${
                              activeTab === "homework"
                                ? "border-b-2 border-primary text-primary"
                                : "text-base-content hover:text-primary"
                            }`}
                          >
                            hWork
                          </button>
                          <button
                            onClick={() => setActiveTab("iword")}
                            className={`px-4 py-2 font-semibold transition-all ${
                              activeTab === "iword"
                                ? "border-b-2 border-primary text-primary"
                                : "text-base-content hover:text-primary"
                            }`}
                          >
                            iWord
                          </button>
                          <button
                            onClick={() => setActiveTab("mcq")}
                            className={`px-4 py-2 font-semibold transition-all ${
                              activeTab === "mcq"
                                ? "border-b-2 border-primary text-primary"
                                : "text-base-content hover:text-primary"
                            }`}
                          >
                            MCQ
                          </button>
                        </div>

                        {/* Tab Content */}
                        <div className="space-y-6">
                          {/* Topics Tab */}
                          {activeTab === "topics" && (
                            <>
                              {selectedClassData?.topic &&
                              selectedClassData.topic.length > 0 ? (
                                <div className="card bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
                                  <div className="card-body">
                                    <h3 className="card-title text-lg flex items-center gap-2 mb-4">
                                      <List className="w-5 h-5 text-primary" />
                                      Topics (বিষয়সমূহ)
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {selectedClassData.topic
                                        .slice(1)
                                        .map((topic, index) => (
                                          <div
                                            key={index}
                                            className="flex items-center gap-3 p-3 bg-base-100 rounded-lg"
                                          >
                                            <div className="avatar placeholder">
                                              <div className="bg-primary text-white rounded-full w-8 ps-3 pt-2">
                                                <span className="text-sm ">
                                                  {index + 1}
                                                </span>
                                              </div>
                                            </div>
                                            <span className="font-semibold">
                                              {topic}
                                            </span>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="alert alert-info">
                                  <span>কোন টপিক নেই।</span>
                                </div>
                              )}
                            </>
                          )}

                          {/* Q&A Tab */}
                          {activeTab === "qa" && (
                            <>
                              {selectedClassData?.quesAns &&
                              selectedClassData.quesAns.length > 0 ? (
                                <div className="card bg-gradient-to-br from-secondary/5 to-secondary/10 border-2 border-secondary/20">
                                  <div className="card-body">
                                    <h3 className="card-title text-lg flex items-center gap-2 mb-4">
                                      <HelpCircle className="w-5 h-5 text-secondary" />
                                      Questions & Answers (প্রশ্ন ও উত্তর)
                                    </h3>
                                    <div className="space-y-3">
                                      {selectedClassData.quesAns.map(
                                        (qa, index) => (
                                          <div
                                            key={qa.id || index}
                                            className="collapse collapse-plus bg-base-100"
                                          >
                                            <input type="checkbox" />
                                            <div className="collapse-title font-semibold">
                                              <div className="flex items-start gap-2">
                                                <span className="text-secondary">
                                                  Q{index + 1}.
                                                </span>
                                                <span>
                                                  {parseSpecialToJSX(
                                                    qa.question
                                                  )}
                                                </span>
                                              </div>
                                            </div>
                                            <div className="collapse-content">
                                              <div className="alert alert-success mt-2">
                                                <CheckCircle className="w-5 h-5" />
                                                <span>
                                                  <strong>উত্তর:</strong>{" "}
                                                  {parseSpecialToJSX(qa.answer)}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="alert alert-info">
                                  <span>কোন প্রশ্ন ও উত্তর নেই।</span>
                                </div>
                              )}
                            </>
                          )}

                          {/* Homework Tab */}
                          {activeTab === "homework" && (
                            <>
                              {selectedClassData?.homeWork &&
                              selectedClassData.homeWork.length > 0 ? (
                                <div className="card bg-gradient-to-br from-accent/5 to-accent/10 border-2 border-accent/20">
                                  <div className="card-body">
                                    <h3 className="card-title text-lg flex items-center gap-2 mb-4">
                                      <Briefcase className="w-5 h-5 text-accent" />
                                      Homework (হোমওয়ার্ক)
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {selectedClassData.homeWork.map(
                                        (hw, index) => (
                                          <div
                                            key={hw.id || index}
                                            className="card bg-base-100"
                                          >
                                            <div className="card-body p-4">
                                              <h4 className="font-bold mb-2">
                                                {parseSpecialToJSX(hw.title)}
                                              </h4>
                                              <p className="text-md text-gray-500">
                                                {parseSpecialToJSX(hw.task)}
                                              </p>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="alert alert-info">
                                  <span>কোন হোমওয়ার্ক নেই।</span>
                                </div>
                              )}
                            </>
                          )}

                          {/* Important Words Tab */}
                          {activeTab === "iword" && (
                            <>
                              {selectedClassData?.someWord &&
                              selectedClassData.someWord.length > 0 ? (
                                <div className="card bg-gradient-to-br from-info/5 to-info/10 border-2 border-info/20">
                                  <div className="card-body">
                                    <h3 className="card-title text-lg flex items-center gap-2 mb-4">
                                      <BookMarked className="w-5 h-5 text-info" />
                                      Important Words (গুরুত্বপূর্ণ শব্দ)
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedClassData?.someWord.map(
                                        (word, index) => (
                                          <div
                                            key={index}
                                            className="badge badge-info badge-lg p-3"
                                          >
                                            <span className="font-bold">
                                              {word}
                                            </span>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="alert alert-info">
                                  <span>কোন গুরুত্বপূর্ণ শব্দ নেই।</span>
                                </div>
                              )}
                            </>
                          )}

                          {/* MCQ Tab */}
                          {activeTab === "mcq" && (
                            <>
                              {classQuiz && classQuiz.questions.length > 0 ? (
                                <div className="card bg-gradient-to-br from-warning/5 to-warning/10 border-2 border-warning/20">
                                  <div className="card-body">
                                    <h3 className="card-title text-lg flex items-center gap-2 mb-4">
                                      <HelpCircle className="w-5 h-5 text-warning" />
                                      MCQ - {classQuiz.title}
                                    </h3>
                                    <div className="mb-4">
                                      <span className="badge badge-warning me-3">
                                        এখানে অংশগ্রণ করা যাবে না। দেখে শুনে
                                        বুঝে শিখে নেন।
                                      </span>
                                      <span className="badge badge-warning">
                                        প্রয়োজনে খাতা-কমল ব্যবহার করুন।
                                      </span>
                                    </div>
                                    <div className="space-y-6">
                                      {classQuiz.questions.map((q, qIndex) => (
                                        <div
                                          key={q.id}
                                          className="bg-base-100 p-4 rounded-lg"
                                        >
                                          <h4 className="font-bold mb-4">
                                            Q{qIndex + 1}.{" "}
                                            {parseSpecialToJSX(q.question)}
                                          </h4>
                                          <div className="space-y-2 grid grid-cols-2 gap-3">
                                            {q.options.map(
                                              (option, optIndex) => (
                                                <label
                                                  key={optIndex}
                                                  className="border border-gray-500 flex items-center gap-3 p-2 hover:bg-base-200 rounded-lg cursor-pointer"
                                                >
                                                  <input
                                                    type="radio"
                                                    name={`q-${qIndex}`}
                                                    className="radio border border-gray-200"
                                                    disabled
                                                  />
                                                  <span>
                                                    {parseSpecialToJSX(option)}
                                                  </span>
                                                </label>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="alert alert-info">
                                  <span>এই ক্লাসের জন্য কোন MCQ নেই।</span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="alert alert-error">
                        <Lock className="w-6 h-6" />
                        <div>
                          <h3 className="font-bold">Class Locked</h3>
                          <div className="text-sm">
                            {unlockDate
                              ? `This class will unlock on ${new Date(
                                  unlockDate
                                ).toLocaleDateString("en-GB", {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}`
                              : "Enroll in this course to unlock classes"}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Sidebar - Class Navigation */}
              <div className="lg:col-span-4 hidden lg:block">
                <div className="card bg-base-100 shadow-xl sticky top-4">
                  <div className="card-body p-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
                    <h2 className="card-title text-lg mb-4 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      ক্লাসের লিস্ট
                      <span className="badge badge-primary badge-sm ml-auto">
                        {course.classes.length}টি
                      </span>
                    </h2>

                    <div className="space-y-2">
                      {groupedClasses.map((group) => (
                        <div
                          key={group.groupIndex}
                          className="border border-base-300 rounded-lg"
                        >
                          {/* Group Header */}
                          <button
                            onClick={() => toggleGroup(group.groupIndex)}
                            className="w-full flex items-center justify-between p-3 hover:bg-base-200 rounded-lg transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              {expandedGroups.includes(group.groupIndex) ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                              <span className="font-semibold">
                                {group.groupName}
                              </span>
                            </div>
                            <div className="badge badge-sm badge-ghost">
                              {group.classes.length}
                            </div>
                          </button>

                          {/* Group Classes */}
                          {expandedGroups.includes(group.groupIndex) && (
                            <div className="px-2 pb-2 space-y-1">
                              {group.classes.map((classItem, idx) => {
                                const classIndex = group.startIndex + idx;
                                const isSelected = selectedClass === classIndex;
                                const isUnlocked =
                                  !isAuthenticated ||
                                  !studentBatch ||
                                  isClassUnlocked(
                                    classIndex,
                                    classUnlockDates,
                                    today
                                  );

                                return (
                                  <button
                                    key={classItem.id}
                                    onClick={() => handleClassClick(classIndex)}
                                    disabled={
                                      !isUnlocked &&
                                      isAuthenticated &&
                                      studentBatch
                                    }
                                    className={`w-full text-left p-3 rounded-lg transition-all ${
                                      isSelected
                                        ? "bg-primary text-primary-content shadow-md"
                                        : isUnlocked
                                        ? "hover:bg-base-200"
                                        : "opacity-50 cursor-not-allowed"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <div
                                          className={`badge badge-sm flex-shrink-0 ${
                                            isSelected
                                              ? "badge-primary-content"
                                              : "badge-ghost"
                                          }`}
                                        >
                                          {classIndex + 1}
                                        </div>
                                        <span className="text-sm font-medium truncate">
                                          {classItem.topic[0]}
                                        </span>
                                      </div>
                                      {isUnlocked ? (
                                        <Unlock className="w-4 h-4 text-success flex-shrink-0 ml-2" />
                                      ) : (
                                        <Lock className="w-4 h-4 text-error flex-shrink-0 ml-2" />
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Mobile Sidebar Drawer */}
              <div
                className={`drawer absolute right-4 drawer-end lg:hidden ${
                  isSidebarOpen ? "drawer-open" : ""
                }`}
              >
                <input
                  id="my-drawer"
                  type="checkbox"
                  className="drawer-toggle"
                  checked={isSidebarOpen}
                  onChange={() => setIsSidebarOpen(!isSidebarOpen)}
                />
                <div className="drawer-side z-50">
                  <label
                    htmlFor="my-drawer"
                    className="drawer-overlay"
                    onClick={() => setIsSidebarOpen(false)}
                  ></label>
                  <div className="menu p-4 w-80 min-h-full bg-base-100">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-bold flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        ক্লাসের লিস্ট
                      </h2>
                      <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="btn btn-sm btn-circle btn-ghost"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      {groupedClasses.map((group) => (
                        <div
                          key={group.groupIndex}
                          className="border border-base-300 rounded-lg"
                        >
                          <button
                            onClick={() => toggleGroup(group.groupIndex)}
                            className="w-full flex items-center justify-between p-3 hover:bg-base-200 rounded-lg transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              {expandedGroups.includes(group.groupIndex) ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                              <span className="font-semibold">
                                {group.groupName}
                              </span>
                            </div>
                            <div className="badge badge-sm badge-ghost">
                              {group.classes.length}
                            </div>
                          </button>

                          {expandedGroups.includes(group.groupIndex) && (
                            <div className="px-2 pb-2 space-y-1">
                              {group.classes.map((classItem, idx) => {
                                const classIndex = group.startIndex + idx;
                                const isSelected = selectedClass === classIndex;
                                const isUnlocked =
                                  !isAuthenticated ||
                                  !studentBatch ||
                                  isClassUnlocked(
                                    classIndex,
                                    classUnlockDates,
                                    today
                                  );

                                return (
                                  <button
                                    key={classItem.id}
                                    onClick={() => {
                                      handleClassClick(classIndex);
                                      setIsSidebarOpen(false);
                                    }}
                                    disabled={
                                      !isUnlocked &&
                                      isAuthenticated &&
                                      studentBatch
                                    }
                                    className={`w-full text-left p-3 rounded-lg transition-all ${
                                      isSelected
                                        ? "bg-primary text-primary-content shadow-md"
                                        : isUnlocked
                                        ? "hover:bg-base-200"
                                        : "opacity-50 cursor-not-allowed"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <div
                                          className={`badge badge-sm flex-shrink-0 ${
                                            isSelected
                                              ? "badge-primary-content"
                                              : "badge-ghost"
                                          }`}
                                        >
                                          {classIndex + 1}
                                        </div>
                                        <span className="text-sm font-medium truncate">
                                          {classItem.topic[0]}
                                        </span>
                                      </div>
                                      {isUnlocked ? (
                                        <Unlock className="w-4 h-4 text-success flex-shrink-0 ml-2" />
                                      ) : (
                                        <Lock className="w-4 h-4 text-error flex-shrink-0 ml-2" />
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CourseDetails;
