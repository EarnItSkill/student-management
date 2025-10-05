import {
  ArrowLeft,
  BookMarked,
  BookOpen,
  Briefcase,
  CheckCircle,
  Clock,
  DollarSign,
  HelpCircle,
  List,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/common/DashboardLayout";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import { useAppContext } from "../context/useAppContext";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courses, currentUser, isAuthenticated } = useAppContext();

  const course = courses.find((c) => c._id === id);

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

        {/* Topics Section */}
        {course.topic && course.topic.length > 0 && (
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <h2 className="card-title text-2xl flex items-center gap-2 mb-6">
                <List className="w-6 h-6 text-primary" />
                Course Topics (বিষয়সমূহ)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {course.topic.map((topic, index) => (
                  <div
                    key={index}
                    className="card bg-gradient-to-br from-primary/10 to-primary/5 shadow"
                  >
                    <div className="card-body p-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-primary text-white rounded-full w-10">
                            <span className="text-lg">{index + 1}</span>
                          </div>
                        </div>
                        <h3 className="font-bold text-lg">{topic}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Questions & Answers Section */}
        {course.quesAns && course.quesAns.length > 0 && (
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <h2 className="card-title text-2xl flex items-center gap-2 mb-6">
                <HelpCircle className="w-6 h-6 text-secondary" />
                Questions & Answers (প্রশ্ন ও উত্তর)
              </h2>
              <div className="space-y-4">
                {course.quesAns.map((qa) => (
                  <div
                    key={qa.id}
                    className="collapse collapse-plus bg-base-200"
                  >
                    <input type="checkbox" />
                    <div className="collapse-title text-lg font-semibold">
                      <div className="flex items-start gap-2">
                        <span className="text-primary">Q{qa.id}.</span>
                        <span>{qa.question}</span>
                      </div>
                    </div>
                    <div className="collapse-content">
                      <div className="alert alert-success mt-2">
                        <CheckCircle className="w-5 h-5" />
                        <span>
                          <strong>Answer:</strong> {qa.answer}
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
        {course.homeWork && course.homeWork.length > 0 && (
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <h2 className="card-title text-2xl flex items-center gap-2 mb-6">
                <Briefcase className="w-6 h-6 text-accent" />
                Homework (হোমওয়ার্ক)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.homeWork.map((hw) => (
                  <div key={hw.id} className="card bg-base-200 shadow">
                    <div className="card-body p-4">
                      <h3 className="font-bold text-lg mb-2">{hw.title}</h3>
                      <p className="text-sm text-gray-600">{hw.task}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Important Words Section */}
        {course.someWord && course.someWord.length > 0 && (
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <h2 className="card-title text-2xl flex items-center gap-2 mb-6">
                <BookMarked className="w-6 h-6 text-info" />
                Important Words (গুরুত্বপূর্ণ শব্দ)
              </h2>
              <div className="flex flex-wrap gap-3">
                {course.someWord.map((word, index) => (
                  <div
                    key={index}
                    className="badge badge-lg badge-info gap-2 p-4"
                  >
                    <span className="font-bold">{word}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ContentWrapper>
  );
};

export default CourseDetails;
