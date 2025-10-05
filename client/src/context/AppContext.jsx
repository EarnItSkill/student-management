import axios from "axios";
import { createContext, useEffect, useState } from "react";

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
        console.log(error);
      }
      setLoading(false);
    };
    getData();
  }, []);

  useEffect(() => {
    const loadData = () => {
      try {
        // setAttendance(attendanceData);

        // // Check if user is logged in (from localStorage)
        // const savedUser = localStorage.getItem("currentUser");
        // if (savedUser) {
        //   const user = JSON.parse(savedUser);
        //   setCurrentUser(user);
        //   setIsAuthenticated(true);
        // }

        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };

    // TODO: Replace with API later
    loadData();
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
        image: "https://i.pravatar.cc/150?img=33",
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
      console.log(updatedStudent);
      // 🔹 Step 3: লোকাল স্টেট আপডেট করো
      setStudents((prev) =>
        prev.map((s) => (s._id === id ? updatedStudent : s))
      );
      console.log(students);

      console.log(`Student with id ${id} updated successfully`);
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

      console.log(`Student with id ${id} deleted successfully`);
    } catch (error) {
      console.error("Failed to delete student:", error);
      throw error;
    }
  };

  // ============== Course CRUD Functions ==============

  const addCourse = async (newCourse) => {
    try {
      // API-তে নতুন কোর্স ডেটা POST করা হচ্ছে
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/courses`,
        newCourse // এখানে newCourse অবজেক্টটি API-তে পাঠানো হচ্ছে
      );
      console.log(response);

      // সার্ভার থেকে রেসপন্স হিসেবে আসা নতুন কোর্সটি দিয়ে state আপডেট করা হচ্ছে
      // সাধারণত, সার্ভার নতুন কোর্স অবজেক্টটি তার ডাটাবেস-জেনারেটেড id সহ ফেরত পাঠায়
      setCourses([...courses, response.data]);

      // নতুন কোর্সটি ফেরত দেওয়া হচ্ছে, যাতে UI তে তাৎক্ষণিকভাবে ব্যবহার করা যায়
      return response.data;
    } catch (error) {
      console.error("Error adding course:", error);
      // এখানে আপনি ইউজারকে এরর নোটিফিকেশন দেখাতে পারেন
      throw error; // এররটি কলিং ফাংশনে পাঠানো হচ্ছে
    }
  };

  const updateCourse = async (id, updatedData) => {
    try {
      // সার্ভারে কোর্স ডেটা আপডেট করার জন্য PUT রিকোয়েস্ট পাঠানো হচ্ছে
      // আপনি চাইলে axios.patch() ও ব্যবহার করতে পারেন
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/course/${id}`,
        updatedData
      );
      console.log(response);

      // সার্ভার থেকে রেসপন্স হিসেবে আসা সম্পূর্ণ আপডেটেড কোর্স অবজেক্ট
      const updatedCourseFromServer = response.data;

      // state-এর মধ্যে থাকা পুরনো কোর্সটিকে সার্ভার থেকে পাওয়া নতুন কোর্স দিয়ে প্রতিস্থাপন করা হচ্ছে
      setCourses(
        courses.map((course) =>
          course.id === id ? updatedCourseFromServer : course
        )
      );

      // আপডেটেড কোর্সটি রিটার্ন করা হচ্ছে
      return updatedCourseFromServer;
    } catch (error) {
      console.error("Error updating course:", error);
      // এখানে ইউজারকে এরর নোটিফিকেশন দেখাতে পারেন
      throw error;
    }
  };

  const deleteCourse = async (id) => {
    try {
      // সার্ভারে কোর্স ডিলিট করার জন্য DELETE রিকোয়েস্ট পাঠানো হচ্ছে
      await axios.delete(`${import.meta.env.VITE_API_URL}/courses/${id}`);

      // রিকোয়েস্ট সফল হলে, state থেকে ওই কোর্সটি বাদ দেওয়া হচ্ছে
      setCourses(courses.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Error deleting course:", error);
      // এখানে আপনি ইউজারকে এরর নোটিফিকেশন দেখাতে পারেন
      throw error;
    }
  };

  // ============== Batch CRUD Functions ==============

  // const addBatch = (newBatch) => {
  //   // TODO: Replace with API later
  //   const batchWithId = {
  //     ...newBatch,
  //     id: batches.length > 0 ? Math.max(...batches.map((b) => b.id)) + 1 : 1,
  //     enrolledStudents: 0,
  //   };
  //   setBatches([...batches, batchWithId]);
  //   return batchWithId;
  // };

  // const addBatch = async (newBatch) => {
  //   try {
  //     // ফাংশনটিকে async করা হয়েছে কারণ এর মধ্যে await ব্যবহার করা হয়েছে।

  //     // 1. API কল করে নতুন ব্যাচ তৈরি করা হচ্ছে
  //     const response = await axios.post(
  //       `${import.meta.env.VITE_API_URL}/batches`,
  //       newBatch
  //     );

  //     // 2. API থেকে সফলভাবে তৈরি হওয়া ব্যাচ অবজেক্টটি (যার মধ্যে নতুন ID আছে) নেওয়া হচ্ছে
  //     const batchWithId = response.data;

  //     // 3. স্থানীয় স্টেট (local state) আপডেট করা হচ্ছে
  //     // সাধারণত, setBatches-কে ফাংশনাল আপডেট (functional update) হিসেবে ব্যবহার করা নিরাপদ:
  //     setBatches((prevBatches) => [...prevBatches, batchWithId]);

  //     // 4. নতুন তৈরি হওয়া ব্যাচ অবজেক্টটি রিটার্ন করা হচ্ছে
  //     return batchWithId;
  //   } catch (error) {
  //     // API কলে কোনো সমস্যা হলে, তা এখানে হ্যান্ডেল করা হবে
  //     console.error("API-এর মাধ্যমে নতুন ব্যাচ যোগ করার সময় ত্রুটি:", error);
  //     // ত্রুটিটি আরও প্রচার (propagate) করার জন্য throw করা যেতে পারে
  //     throw error;
  //   }
  // };

  const addBatch = async (newBatch) => {
    try {
      // 1. API কল করে নতুন ব্যাচ তৈরি করা হচ্ছে
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/batches`,
        newBatch // নতুন ব্যাচের অবজেক্টটি ব্যাকএন্ডে পাঠানো হচ্ছে
      );
      console.log(newBatch);
      // 2. API থেকে তৈরি হওয়া নতুন ব্যাচ অবজেক্টটি নেওয়া হচ্ছে
      const batchWithId = response.data;

      // 3. ✨ ফাংশনাল আপডেট (Functional Update) ব্যবহার করে স্টেট আপডেট:
      //    'prevBatches' গ্যারান্টিযুক্তভাবে স্টেটের সর্বশেষ ভ্যালু ধারণ করে।
      setBatches((prevBatches) => {
        // পূর্বের অ্যারের সব উপাদান এবং নতুন ব্যাচটি যোগ করে একটি নতুন অ্যারে রিটার্ন করা হচ্ছে
        return [...prevBatches, batchWithId];
      });

      // 4. নতুন তৈরি হওয়া ব্যাচ অবজেক্টটি রিটার্ন করা হচ্ছে
      return batchWithId;
    } catch (error) {
      // API কলে কোনো সমস্যা হলে, তা এখানে হ্যান্ডেল করা হবে
      console.error("API-এর মাধ্যমে নতুন ব্যাচ যোগ করার সময় ত্রুটি:", error);
      // ত্রুটিটি আরও প্রচার (propagate) করা হচ্ছে
      throw error;
    }
  };

  // const updateBatch = (id, updatedData) => {
  //   // TODO: Replace with API later
  //   setBatches(
  //     batches.map((b) => (b._id === id ? { ...b, ...updatedData } : b))
  //   );
  // };

  const updateBatch = async (batchId, updatedBatchData) => {
    try {
      // 1. API কল করে নির্দিষ্ট ID-এর ব্যাচটি আপডেট করা হচ্ছে
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/batch/${batchId}`,
        updatedBatchData
      );

      // 2. API থেকে সার্ভারে সফলভাবে আপডেট হওয়া ডেটা নেওয়া হচ্ছে
      const updatedBatch = response.data;

      // 3. ✨ ফাংশনাল আপডেট (Functional Update) ব্যবহার করে স্টেট আপডেট:
      //    পুরোনো ব্যাচটিকে নতুন আপডেট হওয়া ব্যাচ দিয়ে প্রতিস্থাপন (replace) করা হচ্ছে।
      setBatches((prevBatches) => {
        return prevBatches.map((batch) =>
          // যদি ব্যাচের ID ম্যাচ করে, তাহলে নতুন ডেটা দিয়ে প্রতিস্থাপন করা হবে
          batch._id === batchId ? updatedBatch : batch
        );
      });

      // 4. আপডেট হওয়া ব্যাচ অবজেক্টটি রিটার্ন করা হচ্ছে
      return updatedBatch;
    } catch (error) {
      // API কলে কোনো সমস্যা হলে, তা এখানে হ্যান্ডেল করা হবে
      console.error(
        `API-এর মাধ্যমে ব্যাচ ID: ${batchId} আপডেট করার সময় ত্রুটি:`,
        error
      );
      // ত্রুটিটি আরও প্রচার (propagate) করা হচ্ছে
      throw error;
    }
  };

  // const deleteBatch = (id) => {
  //   // TODO: Replace with API later
  //   setBatches(batches.filter((b) => b.id !== id));
  // };

  const deleteBatch = async (batchId) => {
    try {
      // 1. API কল করে নির্দিষ্ট ID-এর ব্যাচটি ডিলিট করা হচ্ছে
      await axios.delete(`${import.meta.env.VITE_API_URL}/batches/${batchId}`);

      // API সফলভাবে রেসপন্স দিলে (সাধারণত 200 বা 204 স্ট্যাটাস কোড)

      // 2. ✨ ফাংশনাল আপডেট (Functional Update) ব্যবহার করে স্টেট আপডেট:
      //    যে ব্যাচটির ID ডিলিট করা হয়েছে, সেটিকে বাদ দিয়ে বাকি ব্যাচগুলো দিয়ে স্টেট আপডেট করা হচ্ছে।
      setBatches((prevBatches) => {
        // filter() ব্যবহার করে ডিলিট হওয়া ব্যাচটিকে বাদ দেওয়া হচ্ছে
        return prevBatches.filter((batch) => batch._id !== batchId);
      });

      // 3. ডিলিট সফল হয়েছে বোঝানোর জন্য কিছু রিটার্ন করা যেতে পারে (যেমন: true)
      return true;
    } catch (error) {
      // API কলে কোনো সমস্যা হলে, তা এখানে হ্যান্ডেল করা হবে
      console.error(
        `API-এর মাধ্যমে ব্যাচ ID: ${batchId} ডিলিট করার সময় ত্রুটি:`,
        error
      );
      // ত্রুটিটি আরও প্রচার (propagate) করা হচ্ছে
      throw error;
    }
  };

  // ============== Enrollment Functions ==============

  // const enrollStudent = (studentId, batchId) => {
  //   // TODO: Replace with API later
  //   const newEnrollment = {
  //     id:
  //       enrollments.length > 0
  //         ? Math.max(...enrollments.map((e) => e.id)) + 1
  //         : 1,
  //     studentId,
  //     batchId,
  //     enrollDate: new Date().toISOString().split("T")[0],
  //     status: "active",
  //   };
  //   setEnrollments([...enrollments, newEnrollment]);

  //   // Update batch enrolled count
  //   setBatches(
  //     batches.map((b) =>
  //       b.id === batchId
  //         ? { ...b, enrolledStudents: b.enrolledStudents + 1 }
  //         : b
  //     )
  //   );

  //   return newEnrollment;
  // };

  const enrollStudent = async (studentId, batchId) => {
    console.log(studentId, batchId);
    // API-তে পাঠানোর জন্য ডেটা প্রস্তুত করা হচ্ছে
    const enrollmentData = {
      studentId,
      batchId,
      enrollDate: new Date().toISOString().split("T")[0], // তারিখ ব্যাকএন্ডেও সেট করা যেতে পারে
      status: "active", // স্ট্যাটাস ব্যাকএন্ডেও সেট করা যেতে পারে
    };

    try {
      // 1. API কল করে নতুন এনরোলমেন্ট তৈরি করা হচ্ছে
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/enrollments`,
        enrollmentData // এনরোলমেন্ট ডেটা API-তে পাঠানো হচ্ছে
      );

      // 2. API থেকে সফলভাবে তৈরি হওয়া এনরোলমেন্ট অবজেক্টটি (যার মধ্যে নতুন ID আছে) নেওয়া হচ্ছে
      const newEnrollment = response.data;

      // --- স্টেট আপডেট শুরু ---

      // 3. ✨ এনরোলমেন্ট স্টেট আপডেট (Functional Update)
      // নতুন এনরোলমেন্ট অবজেক্টটি 'enrollments' অ্যারেতে যোগ করা হচ্ছে।
      setEnrollments((prevEnrollments) => [...prevEnrollments, newEnrollment]);

      // 4. ✨ ব্যাচ স্টেট আপডেট (Functional Update)
      // সংশ্লিষ্ট ব্যাচের 'enrolledStudents' কাউন্ট 1 বাড়ানো হচ্ছে।
      setBatches((prevBatches) =>
        prevBatches.map((b) =>
          b._id === batchId
            ? { ...b, enrolledStudents: b.enrolledStudents + 1 }
            : b
        )
      );

      // --- স্টেট আপডেট শেষ ---

      // 5. নতুন এনরোলমেন্ট অবজেক্টটি রিটার্ন করা হচ্ছে
      return newEnrollment;
    } catch (error) {
      // API কলে কোনো সমস্যা হলে, তা এখানে হ্যান্ডেল করা হবে
      console.error("API-এর মাধ্যমে ছাত্র নথিভুক্ত করার সময় ত্রুটি:", error);
      // ত্রুটিটি আরও প্রচার (propagate) করা হচ্ছে
      throw error;
    }
  };

  // const unenrollStudent = (enrollmentId) => {
  //   // TODO: Replace with API later
  //   const enrollment = enrollments.find((e) => e.id === enrollmentId);
  //   if (enrollment) {
  //     setBatches(
  //       batches.map((b) =>
  //         b.id === enrollment.batchId
  //           ? { ...b, enrolledStudents: b.enrolledStudents - 1 }
  //           : b
  //       )
  //     );
  //   }
  //   setEnrollments(enrollments.filter((e) => e.id !== enrollmentId));
  // };

  const unenrollStudent = async (enrollmentId) => {
    try {
      // 1. API কল করে নির্দিষ্ট ID-এর এনরোলমেন্ট ডিলিট করা হচ্ছে
      // আমরা ধরে নিচ্ছি যে API ডিলিট হওয়া এনরোলমেন্ট অবজেক্টটি রেসপন্স হিসেবে দেবে।
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/enrollments/${enrollmentId}`
      );

      // 2. API থেকে ডিলিট হওয়া এনরোলমেন্ট অবজেক্টটি নেওয়া হচ্ছে (যেখানে batchId আছে)
      const deletedEnrollment = response.data; // অথবা response.data.enrollment
      const batchId = deletedEnrollment.batchId;

      // --- স্টেট আপডেট শুরু ---

      // 3. ✨ এনরোলমেন্ট স্টেট আপডেট (Functional Update)
      // ডিলিট হওয়া এনরোলমেন্টটিকে 'enrollments' অ্যারে থেকে বাদ দেওয়া হচ্ছে।
      setEnrollments((prevEnrollments) =>
        prevEnrollments.filter((e) => e._id !== enrollmentId)
      );

      // 4. ✨ ব্যাচ স্টেট আপডেট (Functional Update)
      // সংশ্লিষ্ট ব্যাচের 'enrolledStudents' কাউন্ট 1 কমানো হচ্ছে।
      setBatches((prevBatches) =>
        prevBatches.map((b) =>
          b._id === batchId
            ? { ...b, enrolledStudents: b.enrolledStudents - 1 }
            : b
        )
      );

      // --- স্টেট আপডেট শেষ ---

      // 5. ডিলিট সফল হয়েছে বোঝানোর জন্য কিছু রিটার্ন করা যেতে পারে (যেমন: true)
      return true;
    } catch (error) {
      // API কলে কোনো সমস্যা হলে, তা এখানে হ্যান্ডেল করা হবে
      console.error(
        `API-এর মাধ্যমে এনরোলমেন্ট ID: ${enrollmentId} ডিলিট করার সময় ত্রুটি:`,
        error
      );
      // ত্রুটিটি আরও প্রচার (propagate) করা হচ্ছে
      throw error;
    }
  };

  // ============== Payment Functions ==============

  // const addPayment = (newPayment) => {
  //   // TODO: Replace with API later
  //   const paymentWithId = {
  //     ...newPayment,
  //     id: payments.length > 0 ? Math.max(...payments.map((p) => p.id)) + 1 : 1,
  //     paymentDate: new Date().toISOString().split("T")[0],
  //   };
  //   setPayments([...payments, paymentWithId]);
  //   return paymentWithId;
  // };

  const addPayment = async (newPayment) => {
    // পেমেন্টের ডেটা API-তে পাঠানোর জন্য প্রস্তুত করা হচ্ছে
    // newPayment অবজেক্টে studentId, amount, method, enrollmentId ইত্যাদি থাকতে পারে।

    // মনে রাখবেন: paymentDate জেনারেট করা বা ID জেনারেট করার কাজ এখন ব্যাকএন্ড করবে।

    try {
      // 1. API কল করে নতুন পেমেন্ট রেকর্ড তৈরি করা হচ্ছে
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/payments`,
        newPayment // পেমেন্টের ডেটা API-তে পাঠানো হচ্ছে
      );

      // 2. API থেকে সফলভাবে তৈরি হওয়া পেমেন্ট অবজেক্টটি (যার মধ্যে _id, paymentDate ইত্যাদি আছে) নেওয়া হচ্ছে
      const paymentWithId = response.data;

      // 3. ✨ ফাংশনাল আপডেট (Functional Update) ব্যবহার করে স্টেট আপডেট:
      // নতুন পেমেন্ট অবজেক্টটি 'payments' অ্যারেতে যোগ করা হচ্ছে।
      setPayments((prevPayments) => [...prevPayments, paymentWithId]);

      // 4. নতুন পেমেন্ট অবজেক্টটি রিটার্ন করা হচ্ছে
      return paymentWithId;
    } catch (error) {
      // API কলে কোনো সমস্যা হলে, তা এখানে হ্যান্ডেল করা হবে
      console.error("API-এর মাধ্যমে নতুন পেমেন্ট যোগ করার সময় ত্রুটি:", error);
      // ত্রুটিটি আরও প্রচার (propagate) করা হচ্ছে
      throw error;
    }
  };

  // const updatePayment = (id, updatedData) => {
  //   // TODO: Replace with API later
  //   setPayments(
  //     payments.map((p) => (p._id === id ? { ...p, ...updatedData } : p))
  //   );
  // };

  const updatePayment = async (id, updatedData) => {
    // এখানে id হলো পেমেন্ট রেকর্ডের _id

    try {
      // 1. API কল করে নির্দিষ্ট ID-এর পেমেন্ট রেকর্ডটি আপডেট করা হচ্ছে
      const response = await axios.put(
        // আংশিক আপডেটের জন্য PATCH ব্যবহার করা হলো
        `${import.meta.env.VITE_API_URL}/payments/${id}`, // URL-এ পেমেন্ট ID পাঠানো হচ্ছে
        updatedData // যে ডেটাগুলো আপডেট করতে হবে, শুধু সেগুলো পাঠানো হচ্ছে
      );

      // 2. API থেকে সফলভাবে আপডেট হওয়া পেমেন্ট অবজেক্টটি নেওয়া হচ্ছে
      const updatedPayment = response.data;

      // 3. ✨ ফাংশনাল আপডেট (Functional Update) ব্যবহার করে স্টেট আপডেট:
      //    পুরোনো পেমেন্টটিকে নতুন আপডেট হওয়া পেমেন্ট দিয়ে প্রতিস্থাপন (replace) করা হচ্ছে।
      setPayments((prevPayments) =>
        prevPayments.map((p) =>
          // যদি পেমেন্টের ID ম্যাচ করে, তবে নতুন ডেটা দিয়ে প্রতিস্থাপন করা হবে
          p._id === id ? updatedPayment : p
        )
      );

      // 4. আপডেট হওয়া পেমেন্ট অবজেক্টটি রিটার্ন করা হচ্ছে
      return updatedPayment;
    } catch (error) {
      // API কলে কোনো সমস্যা হলে, তা এখানে হ্যান্ডেল করা হবে
      console.error(
        `API-এর মাধ্যমে পেমেন্ট ID: ${id} আপডেট করার সময় ত্রুটি:`,
        error
      );
      // ত্রুটিটি আরও প্রচার (propagate) করা হচ্ছে
      throw error;
    }
  };

  // ============== Attendance Functions ==============

  // const addAttendance = (newAttendance) => {
  //   // TODO: Replace with API later
  //   const attendanceWithId = {
  //     ...newAttendance,
  //     id:
  //       attendance.length > 0
  //         ? Math.max(...attendance.map((a) => a.id)) + 1
  //         : 1,
  //     date: new Date().toISOString().split("T")[0],
  //   };
  //   setAttendance([...attendance, attendanceWithId]);
  //   return attendanceWithId;
  // };

  const addAttendance = async (newAttendance) => {
    // newAttendance অবজেক্টে studentId, batchId, status, ইত্যাদি থাকতে পারে।

    // মনে রাখবেন: 'date' জেনারেট করা বা 'id' জেনারেট করার কাজ এখন ব্যাকএন্ড করবে।

    try {
      // 1. API কল করে নতুন অ্যাটেন্ডেন্স রেকর্ড তৈরি করা হচ্ছে
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/attendances`,
        newAttendance // অ্যাটেন্ডেন্স ডেটা API-তে পাঠানো হচ্ছে
      );

      // 2. API থেকে সফলভাবে তৈরি হওয়া অ্যাটেন্ডেন্স অবজেক্টটি (যার মধ্যে _id, date ইত্যাদি আছে) নেওয়া হচ্ছে
      const attendanceWithId = response.data;

      // 3. ✨ ফাংশনাল আপডেট (Functional Update) ব্যবহার করে স্টেট আপডেট:
      // নতুন অ্যাটেন্ডেন্স অবজেক্টটি 'attendance' অ্যারেতে যোগ করা হচ্ছে।
      setAttendance((prevAttendance) => [...prevAttendance, attendanceWithId]);

      // 4. নতুন অ্যাটেন্ডেন্স অবজেক্টটি রিটার্ন করা হচ্ছে
      return attendanceWithId;
    } catch (error) {
      // API কলে কোনো সমস্যা হলে, তা এখানে হ্যান্ডেল করা হবে
      console.error(
        "API-এর মাধ্যমে অ্যাটেন্ডেন্স যোগ করার সময় ত্রুটি:",
        error
      );
      // ত্রুটিটি আরও প্রচার (propagate) করা হচ্ছে
      throw error;
    }
  };

  const updateAttendance = (id, updatedData) => {
    // TODO: Replace with API later
    setAttendance(
      attendance.map((a) => (a.id === id ? { ...a, ...updatedData } : a))
    );
  };

  // ============== Quiz Functions ==============

  // const addQuiz = (newQuiz) => {
  //   // TODO: Replace with API later
  //   const quizWithId = {
  //     ...newQuiz,
  //     id: quizzes.length > 0 ? Math.max(...quizzes.map((q) => q.id)) + 1 : 1,
  //     results: [],
  //   };
  //   setQuizzes([...quizzes, quizWithId]);
  //   return quizWithId;
  // };

  const addQuiz = async (newQuiz) => {
    // newQuiz অবজেক্টে quizName, courseId, questions, ইত্যাদি থাকতে পারে।

    // মনে রাখবেন: 'id' জেনারেট করা এবং 'results' অ্যারে ইনিশিয়ালাইজ করার কাজ এখন ব্যাকএন্ড করবে।

    try {
      // 1. API কল করে নতুন কুইজ রেকর্ড তৈরি করা হচ্ছে
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/quizzes`,
        newQuiz // কুইজের ডেটা API-তে পাঠানো হচ্ছে
      );

      // 2. API থেকে সফলভাবে তৈরি হওয়া কুইজ অবজেক্টটি (যার মধ্যে _id, results: [] ইত্যাদি আছে) নেওয়া হচ্ছে
      const quizWithId = response.data;

      // 3. ✨ ফাংশনাল আপডেট (Functional Update) ব্যবহার করে স্টেট আপডেট:
      // নতুন কুইজ অবজেক্টটি 'quizzes' অ্যারেতে যোগ করা হচ্ছে।
      setQuizzes((prevQuizzes) => [...prevQuizzes, quizWithId]);

      // 4. নতুন কুইজ অবজেক্টটি রিটার্ন করা হচ্ছে
      return quizWithId;
    } catch (error) {
      // API কলে কোনো সমস্যা হলে, তা এখানে হ্যান্ডেল করা হবে
      console.error("API-এর মাধ্যমে নতুন কুইজ যোগ করার সময় ত্রুটি:", error);
      // ত্রুটিটি আরও প্রচার (propagate) করা হচ্ছে
      throw error;
    }
  };

  // const updateQuiz = (id, updatedData) => {
  //   // TODO: Replace with API later
  //   setQuizzes(
  //     quizzes.map((q) => {
  //       if (q.id === id) {
  //         // Keep existing results when updating
  //         return {
  //           ...q,
  //           ...updatedData,
  //           results: q.results, // Don't overwrite results
  //         };
  //       }
  //       return q;
  //     })
  //   );
  // };

  const updateQuiz = async (id, updatedData) => {
    // এখানে id হলো কুইজ রেকর্ডের _id

    // updatedData থেকে নিশ্চিত করতে হবে যেন কোনোভাবেই results ফিল্ড না যায়
    const { results, ...dataToSend } = updatedData;

    console.log("Updating quiz with ID:", id);

    try {
      // 1. API কল করে নির্দিষ্ট ID-এর কুইজ রেকর্ডটি আপডেট করা হচ্ছে
      const response = await axios.patch(
        // আংশিক আপডেটের জন্য PATCH ব্যবহার করা হলো
        `${import.meta.env.VITE_API_URL}/quizzes/${id}`, // URL-এ কুইজ ID পাঠানো হচ্ছে
        dataToSend // শুধু কুইজের নাম, প্রশ্ন ইত্যাদির ডেটা পাঠানো হচ্ছে
      );

      // 2. API থেকে সফলভাবে আপডেট হওয়া কুইজ অবজেক্টটি নেওয়া হচ্ছে
      const updatedQuiz = response.data;

      // 3. ✨ ফাংশনাল আপডেট (Functional Update) ব্যবহার করে স্টেট আপডেট:
      //    পুরোনো কুইজটিকে নতুন আপডেট হওয়া কুইজ দিয়ে প্রতিস্থাপন করা হচ্ছে।
      setQuizzes((prevQuizzes) =>
        prevQuizzes.map((q) =>
          // যদি কুইজের ID ম্যাচ করে, তবে নতুন ডেটা দিয়ে প্রতিস্থাপন করা হবে
          q._id === id ? updatedQuiz : q
        )
      );

      // 4. আপডেট হওয়া কুইজ অবজেক্টটি রিটার্ন করা হচ্ছে
      return updatedQuiz;
    } catch (error) {
      // API কলে কোনো সমস্যা হলে, তা এখানে হ্যান্ডেল করা হবে
      console.error(
        `API-এর মাধ্যমে কুইজ ID: ${id} আপডেট করার সময় ত্রুটি:`,
        error
      );
      // ত্রুটিটি আরও প্রচার (propagate) করা হচ্ছে
      throw error;
    }
  };

  // const deleteQuiz = (id) => {
  //   // TODO: Replace with API later
  //   setQuizzes(quizzes.filter((q) => q.id !== id));
  // };

  const deleteQuiz = async (id) => {
    // এখানে id হলো কুইজ রেকর্ডের _id

    try {
      // 1. API কল করে নির্দিষ্ট ID-এর কুইজ রেকর্ডটি ডিলিট করা হচ্ছে
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/quizzes/${id}` // URL-এ কুইজ ID পাঠানো হচ্ছে
      );

      // API থেকে সাধারণত ডিলিট রেজাল্ট আসে, কিন্তু সফল হলে ফ্রন্টএন্ড স্টেট আপডেট করবে

      // 2. ✨ ফাংশনাল আপডেট (Functional Update) ব্যবহার করে স্টেট আপডেট:
      //    ডিলিট হওয়া কুইজটিকে 'quizzes' অ্যারে থেকে বাদ দেওয়া হচ্ছে।
      setQuizzes(
        (prevQuizzes) => prevQuizzes.filter((q) => q._id !== id) // MongoDB-এর জন্য _id ব্যবহার করা হলো
      );

      // 3. ডিলিট সফল হয়েছে বোঝানোর জন্য কিছু রিটার্ন করা যেতে পারে (যেমন: true)
      return true;
    } catch (error) {
      // API কলে কোনো সমস্যা হলে, তা এখানে হ্যান্ডেল করা হবে
      console.error(
        `API-এর মাধ্যমে কুইজ ID: ${id} ডিলিট করার সময় ত্রুটি:`,
        error
      );
      // ত্রুটিটি আরও প্রচার (propagate) করা হচ্ছে
      throw error;
    }
  };

  const submitQuiz = (quizId, studentId, score) => {
    // TODO: Replace with API later
    setQuizzes(
      quizzes.map((q) => {
        if (q.id === quizId) {
          const newResult = {
            studentId,
            score,
            submittedAt: new Date().toISOString(),
          };
          return {
            ...q,
            results: [...q.results, newResult],
          };
        }
        return q;
      })
    );
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
    addAttendance,
    updateAttendance,
    submitQuiz,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
