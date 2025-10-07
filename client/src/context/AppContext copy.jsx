import axios from "axios";
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

  const login = (email, password) => {
    // Check admin login
    if (email === "mrmozammal@gmail.com" && password === "admin123") {
      const adminUser = {
        id: 0,
        name: "Admin",
        email: "mrmozammal@gmail.com",
        role: "admin",
        image: "https://avatars.githubusercontent.com/u/31990245?v=4",
      };
      setCurrentUser(adminUser);
      setIsAuthenticated(true);
      localStorage.setItem("currentUser", JSON.stringify(adminUser));
      return { success: true, user: adminUser };
    }

    // Check student login
    const student = students.find(
      (s) => s.email === email && s.password === password
    );

    if (student) {
      const user = { ...student };
      delete user.password; // Remove password from user object
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem("currentUser", JSON.stringify(user));
      return { success: true, user };
    }

    return { success: false, message: "Invalid email or password" };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentUser");
  };

  // ============== Student CRUD Functions ==============

  const addStudent = async (newStudent) => {
    try {
      // optional: generate image if not provided
      const studentData = {
        ...newStudent,
        role: "student",
        image:
          newStudent.image ||
          `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      };

      // 🔹 Step 1: send to backend
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/student`,
        studentData
      );

      // 🔹 Step 2: get the created student from API response
      const createdStudent = response.data;

      // 🔹 Step 3: update local state
      setStudents((prev) => [...prev, createdStudent]);

      return createdStudent;
    } catch (error) {
      console.error("Failed to add student:", error);
      throw error;
    }
  };

  const updateStudent = async (id, updatedData) => {
    try {
      // 🔹 Step 1: API তে ডাটা পাঠাও (PUT বা PATCH)
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/student/${id}`,
        updatedData
      );

      // 🔹 Step 2: API থেকে আপডেটেড student অবজেক্ট নাও
      const updatedStudent = response.data;
      // 🔹 Step 3: লোকাল স্টেট আপডেট করো
      setStudents((prev) =>
        prev.map((s) => (s._id === id ? updatedStudent : s))
      );

      return updatedStudent;
    } catch (error) {
      console.error("Failed to update student:", error);
      throw error;
    }
  };

  const deleteStudent = async (id) => {
    try {
      // 🔹 Step 1: Delete from backend
      await axios.delete(`${import.meta.env.VITE_API_URL}/student/${id}`);

      // 🔹 Step 2: Update local state after successful deletion
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      console.error("Failed to delete student:", error);
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

      toast.success("সপলতার সহিত কোর্স তৈরী হয়েছে");

      return response.data;
    } catch (error) {
      console.error("Error adding course:", error);

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

      toast.success("সপলতার সহিত কোর্স আপডেট হয়েছে।");

      return updatedCourseFromServer;
    } catch (error) {
      console.error("Error updating course:", error);

      throw error;
    }
  };

  // const deleteCourse = async (id) => {
  //   try {
  //     await axios.delete(`${import.meta.env.VITE_API_URL}/courses/${id}`);

  //     setCourses(courses.filter((c) => c._id !== id));

  //     toast.success("সপলতার সহিত কোর্স ডিলিট হয়েছে।");
  //   } catch (error) {
  //     console.error("Error deleting course:", error);

  //     throw error;
  //   }
  // };

  const deleteCourse = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/courses/${id}`);
      setCourses(courses.filter((c) => c._id !== id));
      toast.success("সফলতার সহিত কোর্স ডিলিট হয়েছে।");
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("কোর্স ডিলিট করতে সমস্যা হয়েছে!");
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

      return batchWithId;
    } catch (error) {
      console.error("API-এর মাধ্যমে নতুন ব্যাচ যোগ করার সময় ত্রুটি:", error);

      throw error;
    }
  };

  const updateBatch = async (batchId, updatedBatchData) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/batch/${batchId}`,
        updatedBatchData
      );

      const updatedBatch = response.data;

      setBatches((prevBatches) => {
        return prevBatches.map((batch) =>
          batch._id === batchId ? updatedBatch : batch
        );
      });

      return updatedBatch;
    } catch (error) {
      console.error(
        `API-এর মাধ্যমে ব্যাচ ID: ${batchId} আপডেট করার সময় ত্রুটি:`,
        error
      );

      throw error;
    }
  };

  const deleteBatch = async (batchId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/batches/${batchId}`);

      setBatches((prevBatches) => {
        return prevBatches.filter((batch) => batch._id !== batchId);
      });

      return true;
    } catch (error) {
      console.error(
        `API-এর মাধ্যমে ব্যাচ ID: ${batchId} ডিলিট করার সময় ত্রুটি:`,
        error
      );

      throw error;
    }
  };

  // ============== Enrollment Functions ==============

  const enrollStudent = async (studentId, batchId) => {
    const enrollmentData = {
      studentId,
      batchId,
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
