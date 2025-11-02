const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 9000;

const corsOptions = {
  origin: [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "http://localhost:5174",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ndv8bw5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// ========================
// JWT Middleware - টোকেন ভেরিফাই করার জন্য
// ========================
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send({
      success: false,
      message: "টোকেন প্রয়োজন",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "টোকেন অবৈধ বা এক্সপায়ার হয়েছে",
    });
  }
};

// ========================
// Admin Middleware
// ========================
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).send({
      success: false,
      message: "শুধুমাত্র Admin এই অপারেশন করতে পারবেন",
    });
  }
  next();
};

async function run() {
  try {
    // Collections
    const studentCollection = client
      .db(process.env.DB_NAME)
      .collection("students");
    const coursesCollection = client
      .db(process.env.DB_NAME)
      .collection("courses");
    const batchCollection = client
      .db(process.env.DB_NAME)
      .collection("batches");
    const enrollmentCollection = client
      .db(process.env.DB_NAME)
      .collection("enrollments");
    const paymentCollection = client
      .db(process.env.DB_NAME)
      .collection("payments");
    const attendanceCollection = client
      .db(process.env.DB_NAME)
      .collection("attendance");
    const quizzesCollection = client
      .db(process.env.DB_NAME)
      .collection("quizzes");
    const resultsCollection = client
      .db(process.env.DB_NAME)
      .collection("results");
    const mcqQuizzesCollection = client
      .db(process.env.DB_NAME)
      .collection("mcqQuizzes");
    const chapterSchedulesCollection = client
      .db(process.env.DB_NAME)
      .collection("chapterSchedules");
    const cqQuestionsCollection = client
      .db(process.env.DB_NAME)
      .collection("cqQuestions");

    // =========================
    // AUTHENTICATION
    // =========================

    // লগইন
    app.post("/login", async (req, res) => {
      try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
          return res.status(400).send({
            success: false,
            message: "ইমেইল/ফোন এবং পাসওয়ার্ড প্রয়োজন",
          });
        }

        // Admin চেক
        if (identifier === process.env.ADMIN_EMAIL) {
          if (password === process.env.ADMIN_PASSWORD) {
            const adminUser = {
              id: 0,
              name: "মো. মোজাম্মেল হক",
              email: process.env.ADMIN_EMAIL,
              role: "admin",
              image: "https://avatars.githubusercontent.com/u/31990245?v=4",
            };

            const token = jwt.sign(adminUser, process.env.JWT_SECRET, {
              expiresIn: "30d",
            });

            return res.send({
              success: true,
              user: adminUser,
              token: token,
            });
          } else {
            return res.status(401).send({
              success: false,
              message: "ইমেইল বা পাসওয়ার্ড সঠিক নয়",
            });
          }
        }

        // Student চেক
        const student = await studentCollection.findOne({
          $or: [{ email: identifier }, { phone: identifier }],
        });

        if (!student) {
          return res.status(401).send({
            success: false,
            message: "ইমেইল বা ফোন/পাসওয়ার্ড সঠিক নয়",
          });
        }

        const isValidPassword = await bcrypt.compare(
          password,
          student.password
        );

        if (!isValidPassword) {
          return res.status(401).send({
            success: false,
            message: "ইমেইল বা ফোন/পাসওয়ার্ড সঠিক নয়",
          });
        }

        const { password: _, ...userWithoutPassword } = student;

        const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });

        res.send({
          success: true,
          user: userWithoutPassword,
          token: token,
        });
      } catch (error) {
        console.error("Login error:", error);
        res.status(500).send({
          success: false,
          message: "সার্ভার এরর হয়েছে",
        });
      }
    });

    // =========================
    // STUDENTS
    // =========================

    // নতুন ছাত্র যোগ (Public - Admin থেকে)
    app.post("/student", async (req, res) => {
      try {
        const newStudent = req.body;

        const existingStudent = await studentCollection.findOne({
          $or: [{ email: newStudent.email }, { phone: newStudent.phone }],
        });

        if (existingStudent) {
          return res.status(400).send({
            success: false,
            message:
              "এই ইমেইল বা ফোন নম্বর দিয়ে ইতিমধ্যে রেজিস্ট্রেশন করা হয়েছে",
          });
        }

        if (!newStudent.password || newStudent.password.length < 6) {
          return res.status(400).send({
            success: false,
            message: "পাসওয়ার্ড কমপক্ষে ৬ ক্যারেক্টার হতে হবে",
          });
        }

        const hashedPassword = await bcrypt.hash(newStudent.password, 10);

        const studentToInsert = {
          ...newStudent,
          password: hashedPassword,
        };

        const result = await studentCollection.insertOne(studentToInsert);

        res.send({
          success: true,
          message: "ছাত্র সফলভাবে যোগ করা হয়েছে",
          data: { ...studentToInsert, _id: result.insertedId },
        });
      } catch (error) {
        console.error("Student Insert Error:", error);
        res.status(500).send({
          success: false,
          message: "সার্ভার ত্রুটি! আবার চেষ্টা করুন",
        });
      }
    });

    // // সব ছাত্র পাওয়া (Admin only)
    app.get("/students", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const result = await studentCollection.find().toArray();

        const studentsWithoutPasswords = result.map((student) => {
          const { password: _, ...userWithoutPassword } = student;
          return userWithoutPassword;
        });

        res.send(studentsWithoutPasswords);
      } catch (error) {
        res.status(500).send({
          success: false,
          message: "সার্ভার এরর হয়েছে",
        });
      }
    });

    // আমার প্রোফাইল (Protected)
    app.get("/student-profile", verifyToken, async (req, res) => {
      try {
        const student = await studentCollection.findOne({
          _id: new ObjectId(req.user._id),
        });

        if (!student) {
          return res.status(404).send({
            success: false,
            message: "ছাত্র পাওয়া যায়নি",
          });
        }

        const { password: _, ...userWithoutPassword } = student;

        res.send({
          success: true,
          user: userWithoutPassword,
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          message: "সার্ভার এরর হয়েছে",
        });
      }
    });

    // ছাত্র আপডেট (Protected)
    app.patch("/student/:id", verifyToken, async (req, res) => {
      try {
        const studentId = req.params.id;
        const updateData = req.body;

        if (req.user._id !== studentId && req.user.role !== "admin") {
          return res.status(403).send({
            success: false,
            message: "আপনি এই প্রোফাইল আপডেট করতে পারবেন না",
          });
        }

        if (updateData.password) {
          if (updateData.password.length < 6) {
            return res.status(400).send({
              success: false,
              message: "পাসওয়ার্ড কমপক্ষে ৬ ক্যারেক্টার হতে হবে",
            });
          }
          updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const result = await studentCollection.updateOne(
          { _id: new ObjectId(studentId) },
          { $set: updateData }
        );

        res.send({
          success: true,
          message: "ছাত্র তথ্য সফলভাবে আপডেট হয়েছে",
          data: result,
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          message: "সার্ভার এরর হয়েছে",
        });
      }
    });

    // ছাত্র ডিলিট (Admin only)
    app.delete("/student/:id", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const id = req.params.id;
        const result = await studentCollection.deleteOne({
          _id: new ObjectId(id),
        });

        res.send({
          success: true,
          message: "ছাত্র ডিলিট হয়েছে",
          data: result,
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          message: "সার্ভার এরর",
        });
      }
    });

    // =========================
    // COURSES
    // =========================

    app.post("/courses", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const result = await coursesCollection.insertOne(req.body);
        res.send({
          success: true,
          message: "কোর্স যোগ হয়েছে",
          data: { ...req.body, _id: result.insertedId },
        });
      } catch (error) {
        res.status(500).send({ success: false, message: "সার্ভার এরর" });
      }
    });

    app.get("/courses", verifyToken, async (req, res) => {
      try {
        const result = await coursesCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ success: false, message: "সার্ভার এরর" });
      }
    });

    app.get("/course/:id", verifyToken, async (req, res) => {
      try {
        const course = await coursesCollection.findOne({
          _id: new ObjectId(req.params.id),
        });
        res.send(course);
      } catch (error) {
        res.status(500).send({ success: false, message: "সার্ভার এরর" });
      }
    });

    app.put("/course/:id", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const updatedData = req.body;
        delete updatedData._id;

        const result = await coursesCollection.updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: updatedData }
        );

        res.send({
          success: true,
          message: "কোর্স আপডেট হয়েছে",
          data: result,
        });
      } catch (error) {
        res.status(500).send({ success: false, message: "সার্ভার এরর" });
      }
    });

    app.delete("/courses/:id", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const result = await coursesCollection.deleteOne({
          _id: new ObjectId(req.params.id),
        });
        res.send({
          success: true,
          message: "কোর্স ডিলিট হয়েছে",
          data: result,
        });
      } catch (error) {
        res.status(500).send({ success: false, message: "সার্ভার এরর" });
      }
    });

    // =========================
    // BATCHES
    // =========================

    app.post("/batches", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const result = await batchCollection.insertOne(req.body);
        res.send({
          success: true,
          message: "ব্যাচ যোগ হয়েছে",
          data: { ...req.body, _id: result.insertedId },
        });
      } catch (error) {
        res.status(500).send({ success: false, message: "সার্ভার এরর" });
      }
    });

    app.get("/batches", verifyToken, async (req, res) => {
      try {
        const result = await batchCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ success: false, message: "সার্ভার এরর" });
      }
    });

    app.get("/batch/:id", verifyToken, async (req, res) => {
      try {
        const batch = await batchCollection.findOne({
          _id: new ObjectId(req.params.id),
        });
        res.send(batch);
      } catch (error) {
        res.status(500).send({ success: false, message: "সার্ভার এরর" });
      }
    });

    app.put("/batch/:id", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const incomingData = req.body;
        let updateDoc = {};

        const isUpdateOperator = Object.keys(incomingData).some((key) =>
          key.startsWith("$")
        );

        if (isUpdateOperator) {
          updateDoc = incomingData;
        } else {
          const updatedDataForSet = { ...incomingData };
          delete updatedDataForSet._id;
          updateDoc = { $set: updatedDataForSet };
        }

        const result = await batchCollection.updateOne(
          { _id: new ObjectId(req.params.id) },
          updateDoc
        );

        if (result.matchedCount > 0) {
          const updatedBatch = await batchCollection.findOne({
            _id: new ObjectId(req.params.id),
          });
          res.send(updatedBatch);
        } else {
          res.status(404).send({ message: "ব্যাচ পাওয়া যায়নি" });
        }
      } catch (error) {
        res.status(500).send({ success: false, message: "সার্ভার এরর" });
      }
    });

    app.delete("/batches/:id", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const result = await batchCollection.deleteOne({
          _id: new ObjectId(req.params.id),
        });
        res.send({
          success: true,
          message: "ব্যাচ ডিলিট হয়েছে",
          data: result,
        });
      } catch (error) {
        res.status(500).send({ success: false, message: "সার্ভার এরর" });
      }
    });

    // =========================
    // ENROLLMENTS
    // =========================

    app.post("/enrollments", verifyToken, async (req, res) => {
      try {
        const result = await enrollmentCollection.insertOne(req.body);
        res.send({
          success: true,
          message: "এনরোল হয়েছে",
          data: { ...req.body, _id: result.insertedId },
        });
      } catch (error) {
        res.status(500).send({ success: false, message: "সার্ভার এরর" });
      }
    });

    app.get("/enrollments", verifyToken, async (req, res) => {
      try {
        const result = await enrollmentCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ success: false, message: "সার্ভার এরর" });
      }
    });

    // ✅ ছাত্রের নিজের এনরোলমেন্ট দেখা
    app.get("/my-enrollments", verifyToken, async (req, res) => {
      try {
        const enrollments = await enrollmentCollection
          .find({ studentId: req.user._id })
          .toArray();

        const enrollmentsWithCourses = await Promise.all(
          enrollments.map(async (enrollment) => {
            const course = await coursesCollection.findOne({
              _id: new ObjectId(enrollment.courseId),
            });
            return {
              ...enrollment,
              course: course,
            };
          })
        );

        res.send({
          success: true,
          data: enrollmentsWithCourses,
        });
      } catch (error) {
        res.status(500).send({ success: false, message: "সার্ভার এরর" });
      }
    });

    app.delete("/enrollments/:id", verifyToken, async (req, res) => {
      try {
        const enrollment = await enrollmentCollection.findOne({
          _id: new ObjectId(req.params.id),
        });

        if (!enrollment) {
          return res.status(404).send({
            success: false,
            message: "এনরোলমেন্ট পাওয়া যায়নি",
          });
        }

        if (
          enrollment.studentId !== req.user._id &&
          req.user.role !== "admin"
        ) {
          return res.status(403).send({
            success: false,
            message: "এই এনরোলমেন্ট ডিলিট করতে পারবেন না",
          });
        }

        const result = await enrollmentCollection.deleteOne({
          _id: new ObjectId(req.params.id),
        });

        res.send({
          success: true,
          message: "এনরোলমেন্ট ডিলিট হয়েছে",
          data: result,
        });
      } catch (error) {
        res.status(500).send({ success: false, message: "সার্ভার এরর" });
      }
    });

    // =========================
    // PAYMENTS
    // =========================

    app.post("/payments", verifyToken, async (req, res) => {
      try {
        const result = await paymentCollection.insertOne(req.body);
        res.send({
          success: true,
          message: "পেমেন্ট যোগ হয়েছে",
          data: { ...req.body, _id: result.insertedId },
        });
      } catch (error) {
        res.status(500).send({ success: false, message: "সার্ভার এরর" });
      }
    });

    app.get("/payments", verifyToken, async (req, res) => {
      try {
        let query = {};

        // Student নিজের payment দেখতে পাবে
        if (req.user.role !== "admin") {
          query = { studentId: req.user._id };
        }

        const result = await paymentCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ success: false, message: "সার্ভার এরর" });
      }
    });

    app.put("/payments/:id", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const updatedData = req.body;
        delete updatedData._id;

        const result = await paymentCollection.updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: updatedData }
        );

        res.send({
          success: true,
          message: "পেমেন্ট আপডেট হয়েছে",
          data: result,
        });
      } catch (error) {
        res.status(500).send({ success: false, message: "সার্ভার এরর" });
      }
    });

    app.delete("/payments/:id", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const result = await paymentCollection.deleteOne({
          _id: new ObjectId(req.params.id),
        });

        res.send({
          success: true,
          message: "পেমেন্ট ডিলিট হয়েছে",
          data: result,
        });
      } catch (error) {
        res.status(500).send({ success: false, message: "সার্ভার এরর" });
      }
    });

    // =========================
    // ATTENDANCE
    // =========================

    app.post("/attendances", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const newAttendance = {
          ...req.body,
          date: new Date().toISOString().split("T")[0],
        };

        const result = await attendanceCollection.insertOne(newAttendance);

        res.send({
          success: true,
          message: "অ্যাটেন্ডেন্স যোগ হয়েছে",
          data: { ...newAttendance, _id: result.insertedId },
        });
      } catch (error) {
        res.status(500).send({ success: false, message: "সার্ভার এরর" });
      }
    });

    app.get("/attendance", verifyToken, async (req, res) => {
      try {
        const result = await attendanceCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ success: false, message: "সার্ভার এরর" });
      }
    });

    app.put("/attendance/:id", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const updatedData = req.body;
        delete updatedData._id;

        const result = await attendanceCollection.updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: updatedData }
        );

        res.send({
          success: true,
          message: "অ্যাটেন্ডেন্স আপডেট হয়েছে",
          data: result,
        });
      } catch (error) {
        res.status(500).send({ success: false, message: "সার্ভার এরর" });
      }
    });

    app.delete(
      "/attendance/:id",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        try {
          const result = await attendanceCollection.deleteOne({
            _id: new ObjectId(req.params.id),
          });

          res.send({
            success: true,
            message: "অ্যাটেন্ডেন্স ডিলিট হয়েছে",
            data: result,
          });
        } catch (error) {
          res.status(500).send({ success: false, message: "সার্ভার এরর" });
        }
      }
    );

    // =========================
    // QUIZZES
    // =========================

    app.post("/quizzes", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const newQuiz = { ...req.body, results: [] };
        const result = await quizzesCollection.insertOne(newQuiz);

        res.send({
          success: true,
          message: "কুইজ যোগ হয়েছে",
          data: { ...newQuiz, _id: result.insertedId },
        });
      } catch (error) {
        res.status(500).send({ success: false, message: "সার্ভার এরর" });
      }
    });

    app.get("/quizzes", verifyToken, async (req, res) => {
      try {
        const result = await quizzesCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ success: false, message: "সার্ভার এরর" });
      }
    });

    app.patch("/quizzes/:id", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const updatedData = req.body;
        delete updatedData._id;
        delete updatedData.results;

        const result = await quizzesCollection.updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: updatedData }
        );

        res.send({
          success: true,
          message: "কুইজ আপডেট হয়েছে",
          data: result,
        });
      } catch (error) {
        res.status(500).send({ success: false, message: "সার্ভার এরর" });
      }
    });

    app.delete("/quizzes/:id", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const result = await quizzesCollection.deleteOne({
          _id: new ObjectId(req.params.id),
        });

        res.send({
          success: true,
          message: "কুইজ ডিলিট হয়েছে",
          data: result,
        });
      } catch (error) {
        res.status(500).send({ success: false, message: "সার্ভার এরর" });
      }
    });

    // ✅ Ranking Page এর জন্য - সকলে MCQ অংশগ্রহণকারী ছাত্র/ছাত্রীর নাম ও ইমেজ পাবে
    app.get("/ranking-students", verifyToken, async (req, res) => {
      try {
        const result = await studentCollection
          .find()
          .project({
            _id: 1,
            name: 1,
            image: 1,
            eiin: 1,
            gender: 1,
          })
          .toArray();

        res.send(result);
      } catch (error) {
        res.status(500).send({
          success: false,
          message: "সার্ভার এরর হয়েছে",
        });
      }
    });

    // =========================
    // RESULTS
    // =========================

    app.post("/results", verifyToken, async (req, res) => {
      try {
        const result = await resultsCollection.insertOne(req.body);
        res.send({
          success: true,
          message: "রেজাল্ট সাবমিট হয়েছে",
          data: { ...req.body, _id: result.insertedId },
        });
      } catch (error) {
        res.status(500).send({ success: false, message: "সার্ভার এরর" });
      }
    });

    app.get("/results", verifyToken, async (req, res) => {
      try {
        const result = await resultsCollection
          .find({})
          .sort({ submittedAt: -1 })
          .toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ success: false, message: "সার্ভার এরর" });
      }
    });

    app.get("/results/student/:studentId", verifyToken, async (req, res) => {
      try {
        const result = await resultsCollection
          .find({ studentId: req.params.studentId })
          .sort({ submittedAt: -1 })
          .toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ success: false, message: "সার্ভার এরর" });
      }
    });

    app.get("/results/quiz/:quizId", verifyToken, async (req, res) => {
      try {
        const result = await resultsCollection
          .find({ quizId: req.params.quizId })
          .sort({ submittedAt: -1 })
          .toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ success: false, message: "সার্ভার এরর" });
      }
    });

    app.get("/results/batch/:batchId", verifyToken, async (req, res) => {
      try {
        const result = await resultsCollection
          .find({ batchId: req.params.batchId })
          .sort({ submittedAt: -1 })
          .toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ success: false, message: "সার্ভার এরর" });
      }
    });

    // =========================
    // MCQ QUIZZES
    // =========================

    app.post("/mcqquiz", verifyToken, async (req, res) => {
      try {
        const {
          studentId,
          batchId,
          chapter,
          totalQuestions,
          correctAnswers,
          wrongAnswers,
          score,
          answers,
          questions,
          submittedAt,
          timeTaken,
        } = req.body;

        if (!studentId || !batchId || !chapter) {
          return res.status(400).send({ error: "Missing required fields" });
        }

        const existingAttempt = await mcqQuizzesCollection.findOne({
          studentId,
          batchId,
          chapter,
        });

        if (existingAttempt) {
          return res.status(400).send({
            error: "You have already attempted this chapter quiz",
            attemptId: existingAttempt._id,
          });
        }

        const newAttempt = {
          studentId,
          batchId,
          chapter,
          totalQuestions,
          correctAnswers,
          wrongAnswers,
          score,
          answers,
          questions,
          submittedAt: submittedAt || new Date().toISOString(),
          timeTaken: timeTaken || 0,
          createdAt: new Date().toISOString(),
        };

        const result = await mcqQuizzesCollection.insertOne(newAttempt);
        res.send({
          success: true,
          message: "Quiz submitted successfully",
          attemptId: result.insertedId,
          attempt: { ...newAttempt, _id: result.insertedId },
        });
      } catch (error) {
        console.error("Error submitting quiz:", error);
        res.status(500).send({ error: "Failed to submit quiz" });
      }
    });

    app.get("/mcqquizzes", verifyToken, async (req, res) => {
      try {
        const result = await mcqQuizzesCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch MCQ quizzes" });
      }
    });

    app.get("/mcqquiz/:id", verifyToken, async (req, res) => {
      try {
        const attempt = await mcqQuizzesCollection.findOne({
          _id: new ObjectId(req.params.id),
        });

        if (!attempt) {
          return res.status(404).send({ error: "Attempt not found" });
        }

        res.send(attempt);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch attempt" });
      }
    });

    app.get(
      "/mcqquizzes/student/:studentId/batch/:batchId",
      verifyToken,
      async (req, res) => {
        try {
          const { studentId, batchId } = req.params;
          const result = await mcqQuizzesCollection
            .find({ studentId, batchId })
            .toArray();
          res.send(result);
        } catch (error) {
          res.status(500).send({ error: "Failed to fetch attempts" });
        }
      }
    );

    app.get("/mcqquizzes/check", verifyToken, async (req, res) => {
      try {
        const { studentId, batchId, chapter } = req.query;

        if (!studentId || !batchId || !chapter) {
          return res.status(400).send({ error: "Missing required parameters" });
        }

        const attempt = await mcqQuizzesCollection.findOne({
          studentId,
          batchId,
          chapter,
        });

        res.send({
          hasAttempted: !!attempt,
          attempt: attempt || null,
        });
      } catch (error) {
        res.status(500).send({ error: "Failed to check attempt" });
      }
    });

    app.put("/mcqquiz/:id", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const updatedData = req.body;
        delete updatedData._id;

        const result = await mcqQuizzesCollection.updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: { ...updatedData, updatedAt: new Date().toISOString() } }
        );

        res.send({
          success: true,
          message: "Attempt updated",
          data: result,
        });
      } catch (error) {
        res.status(500).send({ error: "Failed to update attempt" });
      }
    });

    app.delete("/mcqquiz/:id", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const result = await mcqQuizzesCollection.deleteOne({
          _id: new ObjectId(req.params.id),
        });

        res.send({
          success: true,
          message: "Attempt deleted",
          data: result,
        });
      } catch (error) {
        res.status(500).send({ error: "Failed to delete attempt" });
      }
    });

    // =========================
    // CHAPTER SCHEDULES
    // =========================

    app.post(
      "/chapter-schedule",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        try {
          const { batchId, chapter, startDate, endDate } = req.body;

          if (!batchId || !chapter || !startDate || !endDate) {
            return res.status(400).send({ error: "Missing required fields" });
          }

          const existingSchedule = await chapterSchedulesCollection.findOne({
            batchId,
            chapter,
          });

          if (existingSchedule) {
            return res.status(400).send({
              error: "Schedule already exists for this batch and chapter",
              scheduleId: existingSchedule._id,
            });
          }

          const newSchedule = {
            batchId,
            chapter,
            startDate,
            endDate,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const result = await chapterSchedulesCollection.insertOne(
            newSchedule
          );

          res.send({
            success: true,
            message: "Schedule created successfully",
            schedule: { ...newSchedule, _id: result.insertedId },
          });
        } catch (error) {
          res.status(500).send({ error: "Failed to create schedule" });
        }
      }
    );

    app.get("/chapter-schedules", verifyToken, async (req, res) => {
      try {
        const result = await chapterSchedulesCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch schedules" });
      }
    });

    app.get(
      "/chapter-schedules/batch/:batchId",
      verifyToken,
      async (req, res) => {
        try {
          const { batchId } = req.params;
          const result = await chapterSchedulesCollection
            .find({ batchId })
            .toArray();
          res.send(result);
        } catch (error) {
          res.status(500).send({ error: "Failed to fetch schedules" });
        }
      }
    );

    app.get("/chapter-schedule/:id", verifyToken, async (req, res) => {
      try {
        const schedule = await chapterSchedulesCollection.findOne({
          _id: new ObjectId(req.params.id),
        });

        if (!schedule) {
          return res.status(404).send({ error: "Schedule not found" });
        }

        res.send(schedule);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch schedule" });
      }
    });

    app.put(
      "/chapter-schedule/:id",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        try {
          const updatedData = req.body;
          delete updatedData._id;

          const result = await chapterSchedulesCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { ...updatedData, updatedAt: new Date().toISOString() } }
          );

          if (result.matchedCount === 0) {
            return res.status(404).send({ error: "Schedule not found" });
          }

          res.send({
            success: true,
            message: "Schedule updated successfully",
          });
        } catch (error) {
          res.status(500).send({ error: "Failed to update schedule" });
        }
      }
    );

    app.delete(
      "/chapter-schedule/:id",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        try {
          const result = await chapterSchedulesCollection.deleteOne({
            _id: new ObjectId(req.params.id),
          });

          if (result.deletedCount === 0) {
            return res.status(404).send({ error: "Schedule not found" });
          }

          res.send({
            success: true,
            message: "Schedule deleted successfully",
          });
        } catch (error) {
          res.status(500).send({ error: "Failed to delete schedule" });
        }
      }
    );

    app.patch(
      "/chapter-schedule/:id/toggle",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        try {
          const schedule = await chapterSchedulesCollection.findOne({
            _id: new ObjectId(req.params.id),
          });

          if (!schedule) {
            return res.status(404).send({ error: "Schedule not found" });
          }

          await chapterSchedulesCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            {
              $set: {
                isActive: !schedule.isActive,
                updatedAt: new Date().toISOString(),
              },
            }
          );

          res.send({
            success: true,
            message: "Schedule status updated",
            isActive: !schedule.isActive,
          });
        } catch (error) {
          res.status(500).send({ error: "Failed to toggle schedule" });
        }
      }
    );

    // =========================
    // CQ QUESTIONS
    // =========================

    app.post("/cq-question", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const { courseId, chapter, stimulusType, stimulusContent, questions } =
          req.body;

        if (
          !courseId ||
          !chapter ||
          !stimulusType ||
          !stimulusContent ||
          !questions
        ) {
          return res.status(400).send({ error: "Missing required fields" });
        }

        if (questions.length !== 2) {
          return res
            .status(400)
            .send({ error: "Exactly 2 questions are required" });
        }

        const newCQ = {
          courseId,
          chapter,
          stimulusType,
          stimulusContent,
          questions,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const result = await cqQuestionsCollection.insertOne(newCQ);

        res.send({
          success: true,
          message: "CQ question created successfully",
          cq: { ...newCQ, _id: result.insertedId },
        });
      } catch (error) {
        res.status(500).send({ error: "Failed to create CQ question" });
      }
    });

    app.get("/cq-questions", verifyToken, async (req, res) => {
      try {
        const result = await cqQuestionsCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch CQ questions" });
      }
    });

    app.get("/cq-questions/course/:courseId", verifyToken, async (req, res) => {
      try {
        const { courseId } = req.params;
        const result = await cqQuestionsCollection.find({ courseId }).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch CQ questions" });
      }
    });

    app.get("/cq-question/:id", verifyToken, async (req, res) => {
      try {
        const cq = await cqQuestionsCollection.findOne({
          _id: new ObjectId(req.params.id),
        });

        if (!cq) {
          return res.status(404).send({ error: "CQ question not found" });
        }

        res.send(cq);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch CQ question" });
      }
    });

    app.put("/cq-question/:id", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const updatedData = req.body;
        delete updatedData._id;

        const result = await cqQuestionsCollection.updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: { ...updatedData, updatedAt: new Date().toISOString() } }
        );

        if (result.matchedCount === 0) {
          return res.status(404).send({ error: "CQ question not found" });
        }

        res.send({
          success: true,
          message: "CQ question updated successfully",
        });
      } catch (error) {
        res.status(500).send({ error: "Failed to update CQ question" });
      }
    });

    app.delete(
      "/cq-question/:id",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        try {
          const result = await cqQuestionsCollection.deleteOne({
            _id: new ObjectId(req.params.id),
          });

          if (result.deletedCount === 0) {
            return res.status(404).send({ error: "CQ question not found" });
          }

          res.send({
            success: true,
            message: "CQ question deleted successfully",
          });
        } catch (error) {
          res.status(500).send({ error: "Failed to delete CQ question" });
        }
      }
    );

    // Health check
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
