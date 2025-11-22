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

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // ========================
  // Authentication State - localStorage থেকে initialize করুন
  // ========================
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("authToken");
  });

  // Data States
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [mcqResult, setMcqResult] = useState([]);
  const [rankingStudents, setRankingStudents] = useState([]);
  const [mcqQuizzes, setMcqQuizzes] = useState([]);
  const [mcqExamResult, setMcqExamResult] = useState([]);
  const [chapterSchedules, setChapterSchedules] = useState([]);
  const [cqQuestions, setCqQuestions] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState([]);

  // Loading State
  const [loading, setLoading] = useState(true);

  // For Dashboard
  const [isSideMenu, setIsSideMenu] = useState(true);

  // ========================
  // Axios Interceptor Setup (একবার চলাবে)
  // ========================
  useEffect(() => {
    // Request Interceptor - Token যোগ করুন
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor - Error হ্যান্ডেল করুন
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // ✅ 401 এ logout করুন
        if (error.response?.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("currentUser");
          setCurrentUser(null);
          setIsAuthenticated(false);
          window.location.href = "/login";
          toast.error("সেশন এক্সপায়ার হয়েছে, আবার লগইন করুন");
        }
        return Promise.reject(error);
      }
    );

    // Cleanup
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // ========================
  // localStorage এর সাথে currentUser sync রাখুন
  // ========================
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  // ========================
  // localStorage এর সাথে isAuthenticated sync রাখুন
  // ========================
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.removeItem("authToken");
    }
  }, [isAuthenticated]);

  // ========================
  // রিলোডের পর localStorage থেকে পুনরুদ্ধার করুন
  // ========================
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("currentUser");

    if (token && user) {
      setCurrentUser(JSON.parse(user));
      setIsAuthenticated(true);
    }
  }, []);

  // ========================
  // ডেটা লোড করুন (শুধুমাত্র logged in হলে)
  // ========================

  useEffect(() => {
    const getRankingData = async () => {
      try {
        const promises = [
          axios.get(`${import.meta.env.VITE_API_URL}/courses`), // public user এখানেও যাবে
        ];

        if (isAuthenticated && currentUser) {
          promises.push(
            axios.get(`${import.meta.env.VITE_API_URL}/batches`),
            axios.get(`${import.meta.env.VITE_API_URL}/enrollments`),
            axios.get(`${import.meta.env.VITE_API_URL}/attendance`),
            axios.get(`${import.meta.env.VITE_API_URL}/quizzes`),
            axios.get(`${import.meta.env.VITE_API_URL}/chapter-schedules`),
            axios.get(`${import.meta.env.VITE_API_URL}/cq-questions`),
            axios.get(`${import.meta.env.VITE_API_URL}/ranking-students`),
            axios.get(`${import.meta.env.VITE_API_URL}/results`),
            axios.get(`${import.meta.env.VITE_API_URL}/payments`),
            axios.get(`${import.meta.env.VITE_API_URL}/mcqquizzes`)
          );

          if (currentUser.role === "admin") {
            promises.push(
              axios.get(`${import.meta.env.VITE_API_URL}/students`)
            );
          }
        }

        const results = await Promise.allSettled(promises);

        // index অনুযায়ী ডাটা সেট করো
        setCourses(results[0]?.value?.data || []);
        if (isAuthenticated && currentUser) {
          setBatches(results[1]?.value?.data || []);
          setEnrollments(results[2]?.value?.data || []);
          setAttendance(results[3]?.value?.data || []);
          setQuizzes(results[4]?.value?.data || []);
          setChapterSchedules(results[5]?.value?.data || []);
          setCqQuestions(results[6]?.value?.data || []);
          setRankingStudents(results[7]?.value?.data || []);
          setMcqResult(results[8]?.value?.data || []);
          setPayments(results[9]?.value?.data || []);
          setMcqExamResult(results[10]?.value?.data || []);

          if (currentUser.role === "admin") {
            setStudents(results[11]?.value?.data || []);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };

    getRankingData();
  }, [isAuthenticated, currentUser]);

  // ============== Authentication Functions ==============

  const login = async (identifier, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        { identifier, password }
      );

      if (response.data.success) {
        const { user, token } = response.data;

        // ✅ State update করুন
        setCurrentUser(user);
        setIsAuthenticated(true);

        // ✅ localStorage এ রাখুন
        localStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.setItem("authToken", token);

        toast.success("লগইন সফল হয়েছে!");
        return { success: true, user };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "লগইন ব্যর্থ হয়েছে";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("authToken");
    toast.success("লগআউট সফল হয়েছে");
  };

  // ============== Student CRUD Functions ==============

  // const addStudent = async (newStudent) => {
  //   try {
  //     if (!newStudent.password || newStudent.password.length < 6) {
  //       toast.error("পাসওয়ার্ড কমপক্ষে ৬ ক্যারেক্টার হতে হবে");
  //       return null;
  //     }

  //     const studentData = {
  //       ...newStudent,
  //       role: "student",
  //       image:
  //         newStudent.image ||
  //         (newStudent.gender === "male"
  //           ? "https://i.ibb.co/LbG04VL/male.jpg"
  //           : "https://i.ibb.co/gFdhJ5Js/female.jpg"),
  //     };

  //     const response = await axios.post(
  //       `${import.meta.env.VITE_API_URL}/student`,
  //       studentData
  //     );

  //     setStudents((prev) => [...prev, response.data.data]);

  //     toast.success("ছাত্রটি সফলভাবে যোগ করা হয়েছে!", {
  //       icon: <UserPlus className="text-green-500" />,
  //     });

  //     return response.data.data;
  //   } catch (error) {
  //     if (error.response?.status === 400) {
  //       toast.error(error.response.data.message);
  //     } else {
  //       toast.error("ছাত্র যোগ করতে ব্যর্থ হয়েছে!", {
  //         icon: <XCircle className="text-red-500" />,
  //       });
  //     }
  //     return null;
  //   }
  // };

  const addStudent = async (newStudent) => {
    try {
      if (!newStudent.password || newStudent.password.length < 6) {
        toast.error("পাসওয়ার্ড কমপক্ষে ৬ ক্যারেক্টার হতে হবে");
        return { success: false, type: "validation" };
      }

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

      // list update
      setStudents((prev) => [...prev, response.data.data]);

      toast.success("ছাত্রটি সফলভাবে যোগ করা হয়েছে!", {
        icon: <UserPlus className="text-green-500" />,
      });

      return response.data; // 🔥 এখানে মূল পরিবর্তন
    } catch (error) {
      if (error.response?.status === 400) {
        return error.response.data; // 🔥 Backend-এর error UI-তে পাঠানো
      } else {
        return {
          success: false,
          type: "server",
          message: "Server error!",
        };
      }
    }
  };

  const updateStudent = async (id, updatedData) => {
    try {
      // ✅ PATCH ব্যবহার করুন
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/student/${id}`,
        updatedData
      );

      setStudents((prev) =>
        prev.map((s) => (s._id === id ? { ...s, ...updatedData } : s))
      );

      toast.success("ছাত্রের তথ্য সফলভাবে আপডেট হয়েছে!", {
        icon: <Pencil className="text-blue-500" />,
      });

      return response.data;
    } catch (error) {
      console.error("Failed to update student:", error);
      toast.error("ছাত্রের তথ্য আপডেট করতে ব্যর্থ হয়েছে!", {
        icon: <XCircle className="text-red-500" />,
      });
      throw error;
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/student/${id}`);

      setStudents((prev) => prev.filter((s) => s._id !== id));

      toast.success("ছাত্রটি সফলভাবে মুছে ফেলা হয়েছে!", {
        icon: <Trash2 className="text-orange-500" />,
      });
    } catch (error) {
      console.error("Failed to delete student:", error);
      toast.error("ছাত্র মুছে ফেলতে ব্যর্থ হয়েছে!", {
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

      setCourses([...courses, response.data.data]);

      toast.success("সফলতার সাথে কোর্স তৈরি হয়েছে!", {
        icon: <BookPlus className="text-green-500" />,
      });

      return response.data.data;
    } catch (error) {
      console.error("Error adding course:", error);

      toast.error("কোর্স তৈরি করতে ব্যর্থ হয়েছে!", {
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

      setCourses(
        courses.map((course) =>
          course._id === id ? { ...course, ...updatedData } : course
        )
      );

      toast.success("সফলতার সাথে কোর্স আপডেট হয়েছে!", {
        icon: <Pencil className="text-blue-500" />,
      });

      return response.data;
    } catch (error) {
      console.error("Error updating course:", error);

      toast.error("কোর্স আপডেট করতে ব্যর্থ হয়েছে!", {
        icon: <XCircle className="text-red-500" />,
      });

      throw error;
    }
  };

  const deleteCourse = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/courses/${id}`);
      setCourses(courses.filter((c) => c._id !== id));

      toast.success("সফলতার সাথে কোর্স ডিলিট হয়েছে!", {
        icon: <Trash2 className="text-orange-500" />,
      });
    } catch (error) {
      console.error("Error deleting course:", error);

      toast.error("কোর্স ডিলিট করতে সমস্যা হয়েছে!", {
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

      setBatches((prevBatches) => [...prevBatches, response.data.data]);

      toast.success("সফলতার সাথে নতুন ব্যাচ যোগ হয়েছে!", {
        icon: <Layers className="text-green-500" />,
      });

      return response.data.data;
    } catch (error) {
      console.error("API-এর মাধ্যমে নতুন ব্যাচ যোগ করার সময় ত্রুটি:", error);

      toast.error("ব্যাচ যোগ করতে ব্যর্থ হয়েছে!", {
        icon: <XCircle className="text-red-500" />,
      });

      throw error;
    }
  };

  const updateBatch = async (batchId, updatedBatchData) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/batch/${batchId}`,
        updatedBatchData
      );

      setBatches((prevBatches) => {
        return prevBatches.map((batch) =>
          batch._id === batchId ? { ...batch, ...updatedBatchData } : batch
        );
      });

      toast.success("ব্যাচ সফলভাবে আপডেট হয়েছে!", {
        icon: <Pencil className="text-blue-500" />,
      });

      return response.data;
    } catch (error) {
      console.error(
        `API-এর মাধ্যমে ব্যাচ ID: ${batchId} আপডেট করার সময় ত্রুটি:`,
        error
      );

      toast.error(" ব্যাচ আপডেট করতে ব্যর্থ হয়েছে!", {
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

      toast.success("ব্যাচ সফলভাবে ডিলিট হয়েছে!", {
        icon: <Trash2 className="text-orange-500" />,
      });

      return true;
    } catch (error) {
      console.error(
        `API-এর মাধ্যমে ব্যাচ ID: ${batchId} ডিলিট করার সময় ত্রুটি:`,
        error
      );

      toast.error("ব্যাচ ডিলিট করতে সমস্যা হয়েছে!", {
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

      setEnrollments((prevEnrollments) => [
        ...prevEnrollments,
        response.data.data,
      ]);

      setBatches((prevBatches) =>
        prevBatches.map((b) =>
          b._id === batchId
            ? { ...b, enrolledStudents: b.enrolledStudents + 1 }
            : b
        )
      );

      return response.data.data;
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

      const deletedEnrollment = response.data.data;
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

      setPayments((prevPayments) => [...prevPayments, response.data.data]);

      return response.data.data;
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

      setPayments((prevPayments) =>
        prevPayments.map((p) => (p._id === id ? { ...p, ...updatedData } : p))
      );

      return response.data;
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

      setPayments((prevPayments) => {
        return prevPayments.filter((payment) => payment._id !== paymentId);
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

      setAttendance((prevAttendance) => [
        ...prevAttendance,
        response.data.data,
      ]);

      return response.data.data;
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

      setQuizzes((prevQuizzes) => [...prevQuizzes, response.data.data]);

      return response.data.data;
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

      setQuizzes((prevQuizzes) =>
        prevQuizzes.map((q) => (q._id === id ? { ...q, ...dataToSend } : q))
      );

      return response.data;
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

  const submitMcq = async (quizId, submissionData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/results`,
        {
          quizId: quizId,
          ...submissionData,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Result submit error:", error);
      throw error;
    }
  };

  const fetchStudentResults = async (studentId) => {
    try {
      const id = studentId || currentUser?._id;

      if (!id) {
        console.error("Student ID not found");
        return [];
      }

      // ✅ Token headers সহ request পাঠান
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/results/student/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data || [];
    } catch (error) {
      console.error("Student results fetch error:", error);
      return [];
    }
  };

  // ============== MCQ Quiz Functions ==============

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

  // ============== Chapter Schedule Functions ==============

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

      setChapterSchedules(chapterSchedules.filter((s) => s._id !== scheduleId));
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  const toggleScheduleStatus = async (scheduleId) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/chapter-schedule/${scheduleId}/toggle`
      );

      const updatedSchedules = chapterSchedules.map((s) =>
        s._id === scheduleId ? { ...s, isActive: response.data.isActive } : s
      );
      setChapterSchedules(updatedSchedules);

      return response.data;
    } catch (error) {
      console.error("Error toggling schedule:", error);
    }
  };

  // ============== CQ Question Functions ==============

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
    }
  };

  const reorderCqQuestions = async (chapter, courseId, reorderedIds) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/cq-question/reorder`,
        {
          chapter,
          courseId,
          reorderedIds, // Array of CQ IDs in new order
        }
      );

      // Update local state with new order
      const updatedCqs = cqQuestions.map((cq) => {
        const newOrder = reorderedIds.indexOf(cq._id);
        return newOrder !== -1 ? { ...cq, order: newOrder } : cq;
      });

      setCqQuestions(updatedCqs);
      return response.data;
    } catch (error) {
      console.error("Error reordering CQ questions:", error);
      throw error;
    }
  };

  // ======================= Payment Info =======================
  const addPaymentInfo = async (newPayment) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/payment-info`,
        newPayment,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPaymentInfo((prevPaymentInfo) => [
        ...prevPaymentInfo,
        response.data.data,
      ]);

      return response.data.data;
    } catch (error) {
      console.error("API-এর মাধ্যমে নতুন পেমেন্ট যোগ করার সময় ত্রুটি:", error);
      throw error;
    }
  };

  const getPaymentInfo = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/payment-info`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPaymentInfo(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("পেমেন্ট তথ্য ফেচ করার সময় ত্রুটি:", error);
      throw error;
    }
  };

  const updatePaymentInfo = async (id, updatedData) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/payment-info/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPaymentInfo((prevPaymentInfo) =>
        prevPaymentInfo.map((payment) =>
          payment._id === id ? { ...payment, ...updatedData } : payment
        )
      );

      return response.data.data;
    } catch (error) {
      console.error("পেমেন্ট আপডেট করার সময় ত্রুটি:", error);
      throw error;
    }
  };

  const patchPaymentInfo = async (id, partialData) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/payment-info/${id}`,
        partialData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPaymentInfo((prevPaymentInfo) =>
        prevPaymentInfo.map((payment) =>
          payment._id === id ? { ...payment, ...partialData } : payment
        )
      );

      return response.data.data;
    } catch (error) {
      console.error("পেমেন্ট আপডেট করার সময় ত্রুটি:", error);
      throw error;
    }
  };

  const deletePaymentInfo = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/payment-info/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPaymentInfo((prevPaymentInfo) =>
        prevPaymentInfo.filter((payment) => payment._id !== id)
      );

      return response.data.data;
    } catch (error) {
      console.error("পেমেন্ট ডিলিট করার সময় ত্রুটি:", error);
      throw error;
    }
  };

  const getPaymentInfoByStudentId = async (studentId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/payment-info-by-id/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      console.error("Student ID দিয়ে পেমেন্ট তথ্য খুঁজার সময় ত্রুটি:", error);
      throw error;
    }
  };

  const getPaymentInfoByBkash = async (bkashNo) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/payment-info-by-bkash/${bkashNo}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      console.error(
        "Bkash নম্বর দিয়ে পেমেন্ট তথ্য খুঁজার সময় ত্রুটি:",
        error
      );
      throw error;
    }
  };

  // ========================
  // Context Value
  // ========================
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
    rankingStudents,
    mcqResult,
    loading,
    mcqQuizzes,
    mcqExamResult,
    chapterSchedules,
    cqQuestions,

    // Student Functions
    addStudent,
    updateStudent,
    deleteStudent,

    // Course Functions
    addCourse,
    updateCourse,
    deleteCourse,

    // Batch Functions
    addBatch,
    updateBatch,
    deleteBatch,

    // Enrollment Functions
    enrollStudent,
    unenrollStudent,

    // Payment Functions
    addPayment,
    updatePayment,
    deletePayment,

    // Attendance Functions
    addAttendance,
    updateAttendance,

    // Quiz Functions
    deleteQuiz,
    addQuiz,
    updateQuiz,
    submitMcq,
    fetchStudentResults,

    // MCQ Quiz Functions
    setMcqQuizzes,
    checkQuizAttempt,
    submitQuizAttempt,
    getMcqAttemptsByStudent,

    // Chapter Schedule Functions
    setChapterSchedules,
    getSchedulesByBatch,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    toggleScheduleStatus,

    // CQ Question Functions
    setCqQuestions,
    getCqQuestionsByCourse,
    addCqQuestion,
    updateCqQuestion,
    deleteCqQuestion,
    reorderCqQuestions,

    // Payment Info
    paymentInfo,
    setPaymentInfo,
    addPaymentInfo,
    getPaymentInfo,
    updatePaymentInfo,
    patchPaymentInfo,
    deletePaymentInfo,
    getPaymentInfoByStudentId,
    getPaymentInfoByBkash,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
