import {
  ArrowLeft,
  BookMarked,
  BookOpen,
  Briefcase,
  CheckCircle,
  Clock,
  DollarSign,
  GraduationCap,
  HelpCircle,
  List,
  Lock,
  Unlock,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
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
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost gap-2 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Enrollment Info Banner (if logged in) */}
        {isAuthenticated && studentBatch && (
          <div className="alert alert-info shadow-lg mb-6">
            <div>
              <BookOpen className="w-6 h-6" />
              <div>
                <h3 className="font-bold">You are enrolled in this course!</h3>
                <div className="text-sm">
                  Batch: {studentBatch.batchName} | Schedule:{" "}
                  {studentBatch.scheduleType === "SIX_DAYS" &&
                    "শনি - বৃহস্পতিবার"}
                  {studentBatch.scheduleType === "THREE_DAYS_A" &&
                    "শনি, সোম, বুধ"}
                  {studentBatch.scheduleType === "THREE_DAYS_B" &&
                    "রবি, মঙ্গল, বৃহ"}
                  {" | Start: "}
                  {new Date(studentBatch.startDate).toLocaleDateString("en-GB")}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
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
              <p className="text-lg text-gray-600 mb-6">{course.description}</p>

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
                    <span className="text-gray-600">
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

        {/* Classes Accordion Section */}
        {course.classes && course.classes.length > 0 && (
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <h2 className="card-title text-3xl flex items-center gap-2 mb-6">
                <GraduationCap className="w-8 h-8 text-primary" />
                Course Classes (ক্লাসের বিবরণ){" "}
                <span className="text-sm text-orange-500">
                  মোট ক্লাস: {course.classes.length}টি
                </span>
              </h2>

              {/* Lock Notice for non-enrolled users */}
              {!isAuthenticated && (
                <div className="alert alert-warning mb-4">
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

              <div className="space-y-4">
                {course.classes
                  .slice(0, !isAuthenticated ? 2 : course.classes.length)
                  .map((classItem, classIndex) => {
                    // Check if class is unlocked for enrolled student
                    const classIsUnlocked =
                      !isAuthenticated ||
                      !studentBatch ||
                      isClassUnlocked(classIndex, classUnlockDates, today);

                    const unlockDate = studentBatch
                      ? getClassUnlockDate(classIndex, classUnlockDates)
                      : null;

                    return (
                      <div
                        key={classItem.id}
                        className={`collapse collapse-arrow border-2 ${
                          classIsUnlocked
                            ? "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
                            : "bg-base-300 border-base-300 opacity-60"
                        }`}
                      >
                        <input
                          type="radio"
                          name="class-accordion"
                          disabled={!classIsUnlocked}
                        />
                        <div className="collapse-title text-xl font-bold">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`badge badge-lg ${
                                  classIsUnlocked
                                    ? "badge-primary"
                                    : "badge-ghost"
                                }`}
                              >
                                Class {classIndex + 1}
                              </div>
                              <span>{classItem.topic[0]}</span>
                            </div>

                            {/* Lock/Unlock Status */}
                            <div className="flex items-center gap-2">
                              {!classIsUnlocked ? (
                                <>
                                  <Lock className="w-5 h-5 text-error" />
                                  {unlockDate && (
                                    <span className="text-sm text-error font-normal">
                                      Unlocks on{" "}
                                      {new Date(unlockDate).toLocaleDateString(
                                        "en-GB",
                                        {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                        }
                                      )}
                                    </span>
                                  )}
                                </>
                              ) : (
                                studentBatch && (
                                  <div className="badge badge-success gap-1">
                                    <Unlock className="w-3 h-3" />
                                    Unlocked
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>

                        {classIsUnlocked ? (
                          <div className="collapse-content">
                            <div className="space-y-6 mt-4">
                              {/* Topics Section */}
                              {classItem.topic &&
                                classItem.topic.length > 0 && (
                                  <div className="card bg-base-100 shadow">
                                    <div className="card-body">
                                      <h3 className="card-title text-lg flex items-center gap-2 mb-4">
                                        <List className="w-5 h-5 text-primary" />
                                        Topics (বিষয়সমূহ)
                                      </h3>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {classItem.topic
                                          .slice(1, classItem.topic.length)
                                          .map((topic, index) => (
                                            <div
                                              key={index}
                                              className="flex items-center gap-3 p-3 bg-base-200 rounded-lg"
                                            >
                                              <div className="avatar placeholder">
                                                <div className="bg-primary text-white rounded-full w-8">
                                                  <span className="text-sm block h-8 text-center pt-1">
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
                              {classItem.quesAns &&
                                classItem.quesAns.length > 0 && (
                                  <div className="card bg-base-100 shadow">
                                    <div className="card-body">
                                      <h3 className="card-title text-lg flex items-center gap-2 mb-4">
                                        <HelpCircle className="w-5 h-5 text-secondary" />
                                        Questions & Answers (প্রশ্ন ও উত্তর)
                                      </h3>
                                      <div className="space-y-3">
                                        {classItem.quesAns.map((qa, index) => (
                                          <div
                                            key={qa.id || index}
                                            className="collapse collapse-plus bg-base-200"
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
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}

                              {/* Homework Section */}
                              {classItem.homeWork &&
                                classItem.homeWork.length > 0 && (
                                  <div className="card bg-base-100 shadow">
                                    <div className="card-body">
                                      <h3 className="card-title text-lg flex items-center gap-2 mb-4">
                                        <Briefcase className="w-5 h-5 text-accent" />
                                        Homework (হোমওয়ার্ক)
                                      </h3>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {classItem.homeWork.map((hw, index) => (
                                          <div
                                            key={hw.id || index}
                                            className="card bg-base-200"
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
                              {classItem.someWord &&
                                classItem.someWord.length > 0 && (
                                  <div className="card bg-base-100 shadow">
                                    <div className="card-body">
                                      <h3 className="card-title text-lg flex items-center gap-2 mb-4">
                                        <BookMarked className="w-5 h-5 text-info" />
                                        Important Words (গুরুত্বপূর্ণ শব্দ)
                                      </h3>
                                      <div className="flex flex-wrap gap-2">
                                        {classItem.someWord.map(
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
                                )}
                            </div>
                          </div>
                        ) : (
                          <div className="collapse-content">
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
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    </ContentWrapper>
  );
};

export default CourseDetails;
