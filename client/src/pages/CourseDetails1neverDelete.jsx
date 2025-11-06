import {
  ArrowLeft,
  BookMarked,
  BookOpen,
  Briefcase,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  DollarSign,
  GraduationCap,
  HelpCircle,
  List,
  Lock,
  Unlock,
  X,
} from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/common/DashboardLayout";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import { useAppContext } from "../context/useAppContext";
import { parseSpecialToJSX } from "../utils/parseSpecialToJSX";
import {
  getClassUnlockDate,
  getClassUnlockDates,
  isClassUnlocked,
} from "../utils/scheduleHelper";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courses, currentUser, isAuthenticated, batches, enrollments } =
    useAppContext();

  const [selectedClass, setSelectedClass] = useState(0);
  const [expandedGroups, setExpandedGroups] = useState([0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const location = useLocation();

  const handleBack = () => {
    const fromTab = location.state?.fromTab;

    if (fromTab) {
      // Back করার আগে localStorage এ tab রাখো
      localStorage.setItem("activeTab", fromTab);
    }

    // আগের পেজে ফিরে যাও
    navigate(-1);

    // navigate হওয়ার পর localStorage থেকে ট্যাব মুছে ফেলতে সামান্য delay
    setTimeout(() => {
      localStorage.removeItem("activeTab");
    }, 100); // 100ms delay দিলে আগের পেজ ট্যাব ধরতে পারে
  };

  const course = courses?.find((c) => c._id === id);

  // Find student's batch for this course (if enrolled)
  const studentEnrollment = isAuthenticated
    ? enrollments.find(
        (e) => e.studentId === currentUser?._id && e.courseId === id
      )
    : null;

  const studentBatch = studentEnrollment
    ? batches.find((b) => b._id === studentEnrollment.batchId)
    : null;

  // Calculate class unlock dates if student is enrolled
  const classUnlockDates =
    studentBatch && course?.classes
      ? getClassUnlockDates(
          studentBatch.startDate,
          studentBatch.scheduleType,
          course.classes.length
        )
      : [];

  const today = new Date().toISOString().split("T")[0];

  // Group classes (10 per group)
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

  const selectedClassData = course.classes[selectedClass];
  const classIsUnlocked =
    !isAuthenticated ||
    !studentBatch ||
    isClassUnlocked(selectedClass, classUnlockDates, today);

  const unlockDate = studentBatch
    ? getClassUnlockDate(selectedClass, classUnlockDates)
    : null;

  const ContentWrapper = ({ children }) => {
    if (isAuthenticated) {
      return <DashboardLayout>{children}</DashboardLayout>;
    }
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-base-200 py-8">{children}</div>
        <Footer />
      </>
    );
  };

  return (
    <ContentWrapper>
      <div className="container mx-auto px-4">
        <div className="flex justify-start gap-3">
          {/* Back Button */}
          {/* <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost gap-2 mb-6 w-1/12"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button> */}
          {/* New */}
          <button
            onClick={handleBack}
            className="btn btn-ghost gap-2 mb-6 w-1/12"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          {/* Class Progress (if enrolled) */}
          {isAuthenticated && studentBatch && (
            <div className="mb-4 w-11/12">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold">Class Progress</span>
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
        {/* Enrollment Info Banner (if logged in) */}
        {isAuthenticated && studentBatch && (
          <div className="alert alert-info shadow-lg mb-6">
            <div>
              <div>
                <div className="text-sm">
                  Batch: {studentBatch.batchName} | Schedule:{" "}
                  {studentBatch.scheduleType === "SIX_DAYS" &&
                    "শনি - বৃহস্পতিবার"}
                  {studentBatch.scheduleType === "THREE_DAYS_A" &&
                    "শনি, সোম, বুধ"}
                  {studentBatch.scheduleType === "THREE_DAYS_B" &&
                    "রবি, মঙ্গল, বৃহ"}
                  {" | শুরু: "}
                  {new Date(studentBatch.startDate).toLocaleDateString("en-GB")}
                  {" | সময়: "}
                  {studentBatch.startTime}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Hero Section */}
        {!currentUser && (
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <figure className="lg:h-full">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover rounded-l-2xl"
                />
              </figure>
              <div className="card-body">
                <div className="badge badge-primary mb-2">Course Details</div>
                <h1 className="card-title text-4xl font-bold mb-4">
                  {course.title}
                </h1>
                <p className="text-lg text-gray-400 mb-6">
                  {course.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="stat bg-base-200 rounded-lg">
                    <div className="stat-figure text-primary">
                      <Clock className="w-8 h-8" />
                    </div>
                    <div className="stat-title">Duration</div>
                    <div className="stat-value text-2xl">{course.duration}</div>
                  </div>

                  <div className="stat bg-base-200 rounded-lg">
                    <div className="stat-figure text-success">
                      <DollarSign className="w-8 h-8" />
                    </div>
                    <div className="stat-title">Fee</div>
                    <div className="stat-value text-2xl">৳{course.fee}</div>
                  </div>
                </div>

                {/* Class Progress (if enrolled) */}
                {isAuthenticated && studentBatch && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold">Class Progress</span>
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

                {!isAuthenticated && (
                  <button
                    onClick={() => navigate("/login")}
                    className="btn btn-primary btn-lg gap-2"
                  >
                    <BookOpen className="w-5 h-5" />
                    Enroll Now
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

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

        {/* Classes Section with Right Sidebar */}
        {course.classes && course.classes.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Content Area (Left & Center) */}
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
                        {selectedClassData.topic[0]}
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
                          Please enroll in this course to unlock and access all
                          classes.
                        </div>
                      </div>
                    </div>
                  )}

                  {classIsUnlocked ||
                  (!isAuthenticated && selectedClass < 2) ? (
                    <div className="space-y-6">
                      {/* Topics Section */}
                      {selectedClassData.topic &&
                        selectedClassData.topic.length > 0 && (
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
                        )}

                      {/* Questions & Answers Section */}
                      {selectedClassData.quesAns &&
                        selectedClassData.quesAns.length > 0 && (
                          <div className="card bg-gradient-to-br from-secondary/5 to-secondary/10 border-2 border-secondary/20">
                            <div className="card-body">
                              <h3 className="card-title text-lg flex items-center gap-2 mb-4">
                                <HelpCircle className="w-5 h-5 text-secondary" />
                                Questions & Answers (প্রশ্ন ও উত্তর)
                              </h3>
                              <div className="space-y-3">
                                {selectedClassData.quesAns.map((qa, index) => (
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
                                          {parseSpecialToJSX(qa.question)}
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
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                      {/* Homework Section */}
                      {selectedClassData.homeWork &&
                        selectedClassData.homeWork.length > 0 && (
                          <div className="card bg-gradient-to-br from-accent/5 to-accent/10 border-2 border-accent/20">
                            <div className="card-body">
                              <h3 className="card-title text-lg flex items-center gap-2 mb-4">
                                <Briefcase className="w-5 h-5 text-accent" />
                                Homework (হোমওয়ার্ক)
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {selectedClassData.homeWork.map((hw, index) => (
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
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                      {/* Important Words Section */}
                      {selectedClassData.someWord &&
                        selectedClassData.someWord.length > 0 && (
                          <div className="card bg-gradient-to-br from-info/5 to-info/10 border-2 border-info/20">
                            <div className="card-body">
                              <h3 className="card-title text-lg flex items-center gap-2 mb-4">
                                <BookMarked className="w-5 h-5 text-info" />
                                Important Words (গুরুত্বপূর্ণ শব্দ)
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {selectedClassData.someWord.map(
                                  (word, index) => (
                                    <div
                                      key={index}
                                      className="badge badge-info badge-lg p-3"
                                    >
                                      <span className="font-bold">{word}</span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        )}
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
            {/* <div className="lg:col-span-4"> */}
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
                    {groupedClasses
                      .slice(0, !isAuthenticated ? 1 : groupedClasses.length)
                      .map((group) => (
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
                              {group.classes
                                .slice(
                                  0,
                                  !isAuthenticated ? 2 : group.classes.length
                                )
                                .map((classItem, idx) => {
                                  const classIndex = group.startIndex + idx;
                                  const isSelected =
                                    selectedClass === classIndex;
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
                                      onClick={() =>
                                        handleClassClick(classIndex)
                                      }
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
                                            {/* {classItem.topic[0].split(":")[1] || */}
                                            {classItem.topic[0] ||
                                              classItem.topic[0]}
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

                  {/* Sidebar content copy করুন */}
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
                                    setIsSidebarOpen(false); // Close drawer on selection
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
                                        {classItem.topic[0].split(":")[1] ||
                                          classItem.topic[0]}
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
    </ContentWrapper>
  );
};

export default CourseDetails;
