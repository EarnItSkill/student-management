import axios from "axios";
import {
  BookPlus,
  Layers,
  Pencil,
  Trash2,
  UserPlus,
  XCircle,
} from "lucide-react";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

// Import local JSON data
// import attendanceData from "../data/attendance.json";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Data States
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [mcqQuizzes, setMcqQuizzes] = useState([]);
  const [chapterSchedules, setChapterSchedules] = useState([]);
  const [cqQuestions, setCqQuestions] = useState([]);

  // Loading State
  const [loading, setLoading] = useState(true);

  // For Dashboard
  const [isSideMenu, setIsSideMenu] = useState(true);

  // Load data from local JSON on mount

  useEffect(() => {
    const getData = async () => {
      try {
        const students = await axios.get(
          `${import.meta.env.VITE_API_URL}/students`
        );
        setStudents(students?.data);

        const courses = await axios.get(
          `${import.meta.env.VITE_API_URL}/courses`
        );
        setCourses(courses.data);

        const batches = await axios.get(
          `${import.meta.env.VITE_API_URL}/batches`
        );
        setBatches(batches.data);

        const enrollments = await axios.get(
          `${import.meta.env.VITE_API_URL}/enrollments`
        );
        setEnrollments(enrollments.data);

        const payments = await axios.get(
          `${import.meta.env.VITE_API_URL}/payments`
        );
        setPayments(payments.data);

        const attendance = await axios.get(
          `${import.meta.env.VITE_API_URL}/attendance`
        );
        setAttendance(attendance.data);

        const quizzes = await axios.get(
          `${import.meta.env.VITE_API_URL}/quizzes`
        );
        setQuizzes(quizzes.data);

        const mcqQuizzes = await axios.get(
          `${import.meta.env.VITE_API_URL}/mcqquizzes`
        );
        setMcqQuizzes(mcqQuizzes?.data);

        const schedules = await axios.get(
          `${import.meta.env.VITE_API_URL}/chapter-schedules`
        );
        setChapterSchedules(schedules?.data);

        const cqs = await axios.get(
          `${import.meta.env.VITE_API_URL}/cq-questions`
        );
        setCqQuestions(cqs?.data);

        // Check if user is logged in (from localStorage)
        const savedUser = localStorage.getItem("currentUser");
        if (savedUser) {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
          setIsAuthenticated(true);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
      setLoading(false);
    };
    getData();
  }, []);

  // ============== Authentication Functions ==============

  const login = (identifier, password) => {
    // Check admin login
    if (identifier === "mrmozammal@gmail.com" && password === "admin123") {
      const adminUser = {
        id: 0,
        name: "মো. মোজাম্মেল হক",
        email: "mrmozammal@gmail.com",
        role: "admin",
        image: "https://avatars.githubusercontent.com/u/31990245?v=4",
      };
      setCurrentUser(adminUser);
      setIsAuthenticated(true);
      localStorage.setItem("currentUser", JSON.stringify(adminUser));
      return { success: true, user: adminUser };
    }

    // Check student login (email or phone)
    const student = students.find(
      (s) =>
        (s.email === identifier || s.phone === identifier) &&
        s.password === password
    );

    if (student) {
      const user = { ...student };
      delete user.password; // Remove password from user object
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem("currentUser", JSON.stringify(user));
      return { success: true, user };
    }

    return { success: false, message: "ইমেইল বা ফোন/পাসওয়ার্ড সঠিক নয়" };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentUser");
  };

  // ============== Student CRUD Functions ==============

  const addStudent = async (newStudent) => {
    try {
      const studentData = {
        ...newStudent,
        role: "student",
        image:
          newStudent.image ||
          (newStudent.gender === "male"
            ? "https://i.ibb.co/LbG04VL/male.jpg"
            : "https://i.ibb.co/gFdhJ5Js/female.jpg"),
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/student`,
        studentData
      );

      const createdStudent = response.data;
      setStudents((prev) => [...prev, createdStudent]);

      // ✅ সফল ম্যাসেজ
      toast.success("ছাত্রটি সফলভাবে যোগ করা হয়েছে!", {
        icon: <UserPlus className="text-green-500" />,
      });

      return createdStudent;
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("ছাত্র যোগ করতে ব্যর্থ হয়েছে!", {
          icon: <XCircle className="text-red-500" />,
        });
      }
    }
  };

  const updateStudent = async (id, updatedData) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/student/${id}`,
        updatedData
      );

      const updatedStudent = response.data;

      setStudents((prev) =>
        prev.map((s) => (s._id === id ? updatedStudent : s))
      );

      toast.success("ছাত্রের তথ্য সফলভাবে আপডেট হয়েছে!", {
        icon: <Pencil className="text-blue-500" />,
      });

      return updatedStudent;
    } catch (error) {
      console.error("Failed to update student:", error);
      toast.error("ছাত্রের তথ্য আপডেট করতে ব্যর্থ হয়েছে!", {
        icon: <XCircle className="text-red-500" />,
      });
      throw error;
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/student/${id}`);

      setStudents((prev) => prev.filter((s) => s._id !== id));

      toast.success("ছাত্রটি সফলভাবে মুছে ফেলা হয়েছে!", {
        icon: <Trash2 className="text-orange-500" />,
      });
    } catch (error) {
      console.error("Failed to delete student:", error);
      toast.error("ছাত্র মুছে ফেলতে ব্যর্থ হয়েছে!", {
        icon: <XCircle className="text-red-500" />,
      });
      throw error;
    }
  };

  // ============== Course CRUD Functions ==============

  const addCourse = async (newCourse) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/courses`,
        newCourse
      );

      setCourses([...courses, response.data]);

      // ✅ সফল toast
      toast.success("সফলতার সাথে কোর্স তৈরি হয়েছে!", {
        icon: <BookPlus className="text-green-500" />,
      });

      return response.data;
    } catch (error) {
      console.error("Error adding course:", error);

      // ❌ ব্যর্থ toast
      toast.error("কোর্স তৈরি করতে ব্যর্থ হয়েছে!", {
        icon: <XCircle className="text-red-500" />,
      });

      throw error;
    }
  };

  const updateCourse = async (id, updatedData) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/course/${id}`,
        updatedData
      );

      const updatedCourseFromServer = response.data;

      setCourses(
        courses.map((course) =>
          course._id === id ? updatedCourseFromServer : course
        )
      );

      // ✅ সফল toast
      toast.success("সফলতার সাথে কোর্স আপডেট হয়েছে!", {
        icon: <Pencil className="text-blue-500" />,
      });

      return updatedCourseFromServer;
    } catch (error) {
      console.error("Error updating course:", error);

      // ❌ ব্যর্থ toast
      toast.error("কোর্স আপডেট করতে ব্যর্থ হয়েছে!", {
        icon: <XCircle className="text-red-500" />,
      });

      throw error;
    }
  };

  const deleteCourse = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/courses/${id}`);
      setCourses(courses.filter((c) => c._id !== id));

      // ✅ সফল toast
      toast.success("সফলতার সাথে কোর্স ডিলিট হয়েছে!", {
        icon: <Trash2 className="text-orange-500" />,
      });
    } catch (error) {
      console.error("Error deleting course:", error);

      // ❌ ব্যর্থ toast
      toast.error("কোর্স ডিলিট করতে সমস্যা হয়েছে!", {
        icon: <XCircle className="text-red-500" />,
      });
    }
  };

  // ============== Batch CRUD Functions ==============

  const addBatch = async (newBatch) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/batches`,
        newBatch
      );

      const batchWithId = response.data;

      setBatches((prevBatches) => {
        return [...prevBatches, batchWithId];
      });

      // ✅ সফল toast
      toast.success("সফলতার সাথে নতুন ব্যাচ যোগ হয়েছে!", {
        icon: <Layers className="text-green-500" />,
      });

      return batchWithId;
    } catch (error) {
      console.error("API-এর মাধ্যমে নতুন ব্যাচ যোগ করার সময় ত্রুটি:", error);

      // ❌ ব্যর্থ toast
      toast.error("ব্যাচ যোগ করতে ব্যর্থ হয়েছে!", {
        icon: <XCircle className="text-red-500" />,
      });

      throw error;
    }
  };

  const updateBatch = async (batchId, updatedBatchData) => {
    console.log(batchId, updatedBatchData);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/batch/${batchId}`,
        updatedBatchData
      );

      const updatedBatch = response.data;
      console.log(updatedBatch);

      setBatches((prevBatches) => {
        return prevBatches.map((batch) =>
          batch._id === batchId ? updatedBatch : batch
        );
      });

      // ✅ সফল toast
      toast.success("ব্যাচ সফলভাবে আপডেট হয়েছে!", {
        icon: <Pencil className="text-blue-500" />,
      });

      return updatedBatch;
    } catch (error) {
      console.error(
        `API-এর মাধ্যমে ব্যাচ ID: ${batchId} আপডেট করার সময় ত্রুটি:`,
        error
      );

      // ❌ ব্যর্থ toast
      toast.error(" ব্যাচ আপডেট করতে ব্যর্থ হয়েছে!", {
        icon: <XCircle className="text-red-500" />,
      });

      throw error;
    }
  };

  const deleteBatch = async (batchId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/batches/${batchId}`);

      setBatches((prevBatches) => {
        return prevBatches.filter((batch) => batch._id !== batchId);
      });

      // ✅ সফল toast
      toast.success("ব্যাচ সফলভাবে ডিলিট হয়েছে!", {
        icon: <Trash2 className="text-orange-500" />,
      });

      return true;
    } catch (error) {
      console.error(
        `API-এর মাধ্যমে ব্যাচ ID: ${batchId} ডিলিট করার সময় ত্রুটি:`,
        error
      );

      // ❌ ব্যর্থ toast
      toast.error("ব্যাচ ডিলিট করতে সমস্যা হয়েছে!", {
        icon: <XCircle className="text-red-500" />,
      });

      throw error;
    }
  };

  // ============== Enrollment Functions ==============

  const enrollStudent = async (studentId, batchId, courseId) => {
    const enrollmentData = {
      studentId,
      batchId,
      courseId,
      enrollDate: new Date().toISOString().split("T")[0],
      status: "active",
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/enrollments`,
        enrollmentData
      );

      const newEnrollment = response.data;

      setEnrollments((prevEnrollments) => [...prevEnrollments, newEnrollment]);

      setBatches((prevBatches) =>
        prevBatches.map((b) =>
          b._id === batchId
            ? { ...b, enrolledStudents: b.enrolledStudents + 1 }
            : b
        )
      );

      return newEnrollment;
    } catch (error) {
      console.error("API-এর মাধ্যমে ছাত্র নথিভুক্ত করার সময় ত্রুটি:", error);

      throw error;
    }
  };

  const unenrollStudent = async (enrollmentId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/enrollments/${enrollmentId}`
      );

      const deletedEnrollment = response.data;
      const batchId = deletedEnrollment.batchId;

      setEnrollments((prevEnrollments) =>
        prevEnrollments.filter((e) => e._id !== enrollmentId)
      );

      setBatches((prevBatches) =>
        prevBatches.map((b) =>
          b._id === batchId
            ? { ...b, enrolledStudents: b.enrolledStudents - 1 }
            : b
        )
      );

      return true;
    } catch (error) {
      console.error(
        `API-এর মাধ্যমে এনরোলমেন্ট ID: ${enrollmentId} ডিলিট করার সময় ত্রুটি:`,
        error
      );

      throw error;
    }
  };

  // ============== Payment Functions ==============

  const addPayment = async (newPayment) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/payments`,
        newPayment
      );

      const paymentWithId = response.data;

      setPayments((prevPayments) => [...prevPayments, paymentWithId]);

      return paymentWithId;
    } catch (error) {
      console.error("API-এর মাধ্যমে নতুন পেমেন্ট যোগ করার সময় ত্রুটি:", error);

      throw error;
    }
  };

  const updatePayment = async (id, updatedData) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/payments/${id}`,
        updatedData
      );

      const updatedPayment = response.data;

      setPayments((prevPayments) =>
        prevPayments.map((p) => (p._id === id ? updatedPayment : p))
      );

      return updatedPayment;
    } catch (error) {
      console.error(
        `API-এর মাধ্যমে পেমেন্ট ID: ${id} আপডেট করার সময় ত্রুটি:`,
        error
      );

      throw error;
    }
  };

  const deletePayment = async (paymentId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/payments/${paymentId}`
      );

      setPayments((prevBatches) => {
        return prevBatches.filter((payment) => payment._id !== paymentId);
      });

      return true;
    } catch (error) {
      console.error(
        `API-এর মাধ্যমে ব্যাচ ID: ${paymentId} ডিলিট করার সময় ত্রুটি:`,
        error
      );

      throw error;
    }
  };

  // ============== Attendance Functions ==============

  const addAttendance = async (newAttendance) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/attendances`,
        newAttendance
      );

      const attendanceWithId = response.data;

      setAttendance((prevAttendance) => [...prevAttendance, attendanceWithId]);

      return attendanceWithId;
    } catch (error) {
      console.error(
        "API-এর মাধ্যমে অ্যাটেন্ডেন্স যোগ করার সময় ত্রুটি:",
        error
      );

      throw error;
    }
  };

  const updateAttendance = (id, updatedData) => {
    setAttendance(
      attendance.map((a) => (a.id === id ? { ...a, ...updatedData } : a))
    );
  };

  // ============== Quiz Functions ==============

  const addQuiz = async (newQuiz) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/quizzes`,
        newQuiz
      );

      const quizWithId = response.data;

      setQuizzes((prevQuizzes) => [...prevQuizzes, quizWithId]);

      return quizWithId;
    } catch (error) {
      console.error("API-এর মাধ্যমে নতুন কুইজ যোগ করার সময় ত্রুটি:", error);

      throw error;
    }
  };

  const updateQuiz = async (id, updatedData) => {
    const { results, ...dataToSend } = updatedData;

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/quizzes/${id}`,
        dataToSend
      );

      const updatedQuiz = response.data;

      setQuizzes((prevQuizzes) =>
        prevQuizzes.map((q) => (q._id === id ? updatedQuiz : q))
      );

      return updatedQuiz;
    } catch (error) {
      console.error(
        `API-এর মাধ্যমে কুইজ ID: ${id} আপডেট করার সময় ত্রুটি:`,
        error
      );

      throw error;
    }
  };

  const deleteQuiz = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/quizzes/${id}`);

      setQuizzes((prevQuizzes) => prevQuizzes.filter((q) => q._id !== id));

      return true;
    } catch (error) {
      console.error(
        `API-এর মাধ্যমে কুইজ ID: ${id} ডিলিট করার সময় ত্রুটি:`,
        error
      );

      throw error;
    }
  };

  // const submitQuiz = async (quizId, studentId, score, answers) => {
  //   const newResult = {
  //     studentId: studentId,
  //     score: score,
  //     answers: answers,

  //     submittedAt: new Date().toISOString(),
  //   };

  const submitQuiz = async (quizId, newResult) => {
    console.log(quizId);
    console.log(newResult);
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/quizzes/${quizId}/submit`,
        newResult
      );

      const updatedQuiz = response.data;

      setQuizzes((prevQuizzes) =>
        prevQuizzes.map((q) => (q._id === quizId ? updatedQuiz : q))
      );

      return updatedQuiz;
    } catch (error) {
      console.error(
        `API-এর মাধ্যমে কুইজ ID: ${quizId} সাবমিট করার সময় ত্রুটি:`,
        error
      );
      throw error;
    }
  };

  // ================================== mcq Quizzes
  // Functions যোগ করুন (return এর আগে)
  const checkQuizAttempt = async (studentId, batchId, chapter) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/mcqquizzes/check`,
        {
          params: { studentId, batchId, chapter },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error checking quiz attempt:", error);
      return { hasAttempted: false, attempt: null };
    }
  };

  const submitQuizAttempt = async (attemptData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/mcqquiz`,
        attemptData
      );

      // Update local state
      setMcqQuizzes([...mcqQuizzes, response.data.attempt]);

      return response.data;
    } catch (error) {
      console.error("Error submitting quiz:", error);
      throw error;
    }
  };

  const getMcqAttemptsByStudent = async (studentId, batchId) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/mcqquizzes/student/${studentId}/batch/${batchId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching attempts:", error);
      return [];
    }
  };

  // Chapter
  // Functions (return এর আগে)
  const getSchedulesByBatch = async (batchId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/chapter-schedules/batch/${batchId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching schedules:", error);
      return [];
    }
  };

  const createSchedule = async (scheduleData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/chapter-schedule`,
        scheduleData
      );
      setChapterSchedules([...chapterSchedules, response.data.schedule]);
      return response.data;
    } catch (error) {
      console.error("Error creating schedule:", error);
      throw error;
    }
  };

  const updateSchedule = async (scheduleId, scheduleData) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/chapter-schedule/${scheduleId}`,
        scheduleData
      );

      // Update local state
      const updatedSchedules = chapterSchedules.map((s) =>
        s._id === scheduleId ? { ...s, ...scheduleData } : s
      );
      setChapterSchedules(updatedSchedules);

      return response.data;
    } catch (error) {
      console.error("Error updating schedule:", error);
      throw error;
    }
  };

  const deleteSchedule = async (scheduleId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/chapter-schedule/${scheduleId}`
      );

      // Update local state
      setChapterSchedules(chapterSchedules.filter((s) => s._id !== scheduleId));
    } catch (error) {
      console.error("Error deleting schedule:", error);
      throw error;
    }
  };

  const toggleScheduleStatus = async (scheduleId) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/chapter-schedule/${scheduleId}/toggle`
      );

      // Update local state
      const updatedSchedules = chapterSchedules.map((s) =>
        s._id === scheduleId ? { ...s, isActive: response.data.isActive } : s
      );
      setChapterSchedules(updatedSchedules);

      return response.data;
    } catch (error) {
      console.error("Error toggling schedule:", error);
      throw error;
    }
  };

  // CQ ==============================================
  const getCqQuestionsByCourse = async (courseId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/cq-questions/course/${courseId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching CQ questions:", error);
      return [];
    }
  };

  const addCqQuestion = async (cqData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/cq-question`,
        cqData
      );
      setCqQuestions([...cqQuestions, response.data.cq]);
      return response.data;
    } catch (error) {
      console.error("Error adding CQ question:", error);
      throw error;
    }
  };

  const updateCqQuestion = async (cqId, cqData) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/cq-question/${cqId}`,
        cqData
      );

      const updatedCqs = cqQuestions.map((cq) =>
        cq._id === cqId ? { ...cq, ...cqData } : cq
      );
      setCqQuestions(updatedCqs);

      return response.data;
    } catch (error) {
      console.error("Error updating CQ question:", error);
      throw error;
    }
  };

  const deleteCqQuestion = async (cqId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/cq-question/${cqId}`);

      setCqQuestions(cqQuestions.filter((cq) => cq._id !== cqId));
    } catch (error) {
      console.error("Error deleting CQ question:", error);
      throw error;
    }
  };

  // Context value
  const value = {
    // Dashboard
    isSideMenu,
    setIsSideMenu,

    // Auth
    currentUser,
    isAuthenticated,
    login,
    logout,

    // Data
    students,
    courses,
    batches,
    enrollments,
    payments,
    attendance,
    quizzes,
    loading,
    mcqQuizzes,
    chapterSchedules,
    cqQuestions,

    // CRUD Functions
    deleteQuiz,
    addQuiz,
    updateQuiz,
    addStudent,
    updateStudent,
    deleteStudent,
    addCourse,
    updateCourse,
    deleteCourse,
    addBatch,
    updateBatch,
    deleteBatch,
    enrollStudent,
    unenrollStudent,
    addPayment,
    updatePayment,
    deletePayment,
    addAttendance,
    updateAttendance,
    submitQuiz,

    setMcqQuizzes,
    checkQuizAttempt,
    submitQuizAttempt,
    getMcqAttemptsByStudent,

    setChapterSchedules,
    getSchedulesByBatch,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    toggleScheduleStatus,

    setCqQuestions,
    getCqQuestionsByCourse,
    addCqQuestion,
    updateCqQuestion,
    deleteCqQuestion,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
