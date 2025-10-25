const express = require("express");
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

// Moza123@#$

app.use(cors(corsOptions));

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ndv8bw5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // =========================
    // Collections
    // =========================

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

    // New -------------
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
    // About Students
    // =========================

    // CREATE (Add a new Student)
    // app.post("/student", async (req, res) => {
    //   const newStudent = req.body;
    //   const result = await studentCollection.insertOne(newStudent);
    //   res.send(result);
    // });

    // app.post("/student", async (req, res) => {
    //   try {
    //     const newStudent = req.body;

    //     // ইমেল আছে কিনা চেক করুন
    //     const existingStudent = await studentCollection.findOne({
    //       email: newStudent.email,
    //     });

    //     if (existingStudent) {
    //       return res.status(400).send({
    //         success: false,
    //         message: "এই ইমেইল দিয়ে ইতিমধ্যে রেজিস্ট্রেশন করা হয়েছে",
    //       });
    //     }

    //     // ২️⃣ নতুন ছাত্র সেভ করুন
    //     const result = await studentCollection.insertOne(newStudent);

    //     res.send({
    //       success: true,
    //       message: "ছাত্র সফলভাবে যোগ করা হয়েছে",
    //       data: result,
    //     });
    //   } catch (error) {
    //     console.error("Student Insert Error:", error);
    //     res.status(500).send({
    //       success: false,
    //       message: "সার্ভার ত্রুটি! আবার চেষ্টা করুন",
    //     });
    //   }
    // });

    app.post("/student", async (req, res) => {
      try {
        const newStudent = req.body;

        // ইমেল আছে কিনা চেক করুন
        // const existingStudent = await studentCollection.findOne({
        //  email: newStudent.email,
        //  });

        // ✅ Email অথবা Phone ইতিমধ্যে আছে কি না চেক
        const existingStudent = await studentCollection.findOne({
          $or: [{ email: newStudent.email }, { phone: newStudent.phone }],
        });

        if (existingStudent) {
          return res.status(400).send({
            success: false,
            message:
              "এই ইমেইল বা ফোন নম্বর দিয়ে ইতিমধ্যে রেজিস্ট্রেশন করা হয়েছে",
          });
        }

        // ✅ নতুন স্টুডেন্ট সেভ করা
        const result = await studentCollection.insertOne(newStudent);

        res.send({
          success: true,
          message: "ছাত্র সফলভাবে যোগ করা হয়েছে",
          data: result,
        });
      } catch (error) {
        console.error("Student Insert Error:", error);
        res.status(500).send({
          success: false,
          message: "সার্ভার ত্রুটি! আবার চেষ্টা করুন",
        });
      }
    });

    // READ (Get all Students)
    app.get("/students", async (req, res) => {
      const cursor = studentCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // READ: Get single student by id
    app.get("/student/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const student = await studentCollection.findOne(query);
      res.send(student);
    });

    // Delete a single student
    app.delete("/student/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await studentCollection.deleteOne(query);
      res.send(result);
    });

    // Update a single student
    app.put("/student/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;

      delete updatedData._id;

      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: updatedData,
      };

      const result = await studentCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    // =========================
    // About Course
    // =========================

    // CREATE (Add a new course)
    app.post("/courses", async (req, res) => {
      const newCourse = req.body;
      const result = await coursesCollection.insertOne(newCourse);
      res.send(result);
    });

    // READ (Get all courses)
    app.get("/courses", async (req, res) => {
      const cursor = coursesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get a single Course by ID
    app.get("/course/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const course = await coursesCollection.findOne(query);
      res.send(course);
    });

    // app.get("/course/:id", async (req, res) => {
    //   try {
    //     const id = req.params.id;

    //     // Check if ID is valid ObjectId
    //     if (!ObjectId.isValid(id)) {
    //       return res.status(400).send({ error: "Invalid course ID" });
    //     }

    //     const query = { _id: new ObjectId(id) };
    //     const course = await coursesCollection.findOne(query);

    //     if (!course) {
    //       return res.status(404).send({ error: "Course not found" });
    //     }

    //     res.send(course);
    //   } catch (error) {
    //     console.error("Error fetching course:", error);
    //     res.status(500).send({ error: "Failed to fetch course" });
    //   }
    // });

    // Update a single course
    app.put("/course/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;

      delete updatedData._id;

      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: updatedData,
      };

      const result = await coursesCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    app.delete("/courses/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await coursesCollection.deleteOne(query);

        if (result.deletedCount === 1) {
          res
            .status(200)
            .send({ success: true, message: "Course deleted successfully" });
        } else {
          res.status(404).send({ success: false, message: "Course not found" });
        }
      } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).send({ success: false, message: "Server error" });
      }
    });

    // =========================
    // Add Batches
    // =========================

    // CREATE (Add a new course)
    app.post("/batches", async (req, res) => {
      const newCourse = req.body;
      const result = await batchCollection.insertOne(newCourse);
      res.send(result);
    });

    // READ (Get all courses)
    app.get("/batches", async (req, res) => {
      const cursor = batchCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get a single Course by ID
    app.get("/batch/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const course = await batchCollection.findOne(query);
      res.send(course);
    });

    // Delete a single cours
    app.delete("/batches/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await batchCollection.deleteOne(query);
      res.send(result);
    });

    // // Update a single course
    // app.put("/batch/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const updatedData = req.body;

    //   delete updatedData._id;

    //   const query = { _id: new ObjectId(id) };
    //   const updateDoc = {
    //     $set: updatedData,
    //   };

    //   const result = await batchCollection.updateOne(query, updateDoc);
    //   res.send(result);
    // });

    // // Update a single batch
    // app.put("/batch/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const updateDoc = req.body; // ফ্রন্ট-এন্ড থেকে {$inc: {totalSeats: -1, enrolledStudents: 1}} আসবে

    //   const query = { _id: new ObjectId(id) };

    //   // ফ্রন্ট-এন্ড থেকে আসা updateDoc-এ যদি $inc থাকে, তবে সেটি সরাসরি ব্যবহার করুন
    //   // অন্যথায়, পুরনো $set লজিক ব্যবহার করুন (যদি অন্যান্য ফিল্ড আপডেট করতে হয়)
    //   const result = await batchCollection.updateOne(query, updateDoc);

    //   // আপডেট হওয়ার পর সর্বশেষ ডকুমেন্টটি ফ্রন্ট-এন্ডে ফেরত পাঠানোর জন্য
    //   const updatedBatch = await batchCollection.findOne(query);

    //   if (result.matchedCount > 0) {
    //     res.send(updatedBatch); // আপডেট করা ব্যাচ ফেরত পাঠান
    //   } else {
    //     res.status(404).send({ message: "Batch not found" });
    //   }
    // });

    // Update a single batch
    app.put("/batch/:id", async (req, res) => {
      const id = req.params.id;
      const incomingData = req.body;
      let updateDoc = {};

      const query = { _id: new ObjectId(id) };

      // ১. incomingData-তে কোনো MongoDB অপারেটর (যেমন: $, $inc) আছে কি না তা পরীক্ষা করা।
      const isUpdateOperator = Object.keys(incomingData).some((key) =>
        key.startsWith("$")
      );

      if (isUpdateOperator) {
        // ২. যদি অপারেটর থাকে, তবে এটি সরাসরি {$inc: { ... }} বা {$set: { ... }} হিসেবে ব্যবহার করা হবে।
        // এই লজিকটি এনরোলমেন্ট ও আন-এনরোলমেন্টের জন্য ব্যবহৃত হবে।
        updateDoc = incomingData;
      } else {
        // ৩. যদি কোনো অপারেটর না থাকে, তবে এটি একটি সাধারণ ব্যাচ আপডেট হিসেবে বিবেচিত হবে।
        // এই ক্ষেত্রে, আপনার পুরনো লজিক অনুযায়ী ডেটাকে $set এর ভেতরে মোড়ানো হবে।

        // _id রিমুভ করে নতুন একটি অবজেক্ট তৈরি করা
        const updatedDataForSet = { ...incomingData };
        delete updatedDataForSet._id;

        updateDoc = {
          $set: updatedDataForSet,
        };
      }

      try {
        // ৪. আপডেট অপারেশন চালানো।
        const result = await batchCollection.updateOne(query, updateDoc);

        // ৫. আপডেট নিশ্চিত হওয়ার পর সর্বশেষ ডকুমেন্টটি ফ্রন্ট-এন্ডে ফেরত পাঠানো।
        // এটি AppContext.jsx-এর setBatches লজিকের জন্য প্রয়োজনীয়।
        if (result.matchedCount > 0) {
          const updatedBatch = await batchCollection.findOne(query);
          res.send(updatedBatch);
        } else {
          res.status(404).send({ message: "Batch not found" });
        }
      } catch (error) {
        console.error(`Error updating batch ID: ${id}:`, error);
        res
          .status(500)
          .send({ message: "Failed to update batch", error: error.message });
      }
    });

    // =========================
    // Add Enrollments
    // =========================

    // CREATE (Add a new course)
    app.post("/enrollments", async (req, res) => {
      const newCourse = req.body;
      const result = await enrollmentCollection.insertOne(newCourse);
      res.send(result);
    });

    // READ (Get all courses)
    app.get("/enrollments", async (req, res) => {
      const cursor = enrollmentCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Delete a single cours
    app.delete("/enrollments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await enrollmentCollection.deleteOne(query);
      res.send(result);
    });

    // =========================
    // Add Payments
    // =========================

    // CREATE (Add a new course)
    app.post("/payments", async (req, res) => {
      const newCourse = req.body;
      const result = await paymentCollection.insertOne(newCourse);
      res.send(result);
    });

    // READ (Get all courses)
    app.get("/payments", async (req, res) => {
      const cursor = paymentCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Delete a single cours
    app.delete("/payments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await paymentCollection.deleteOne(query);
      res.send(result);
    });

    // Update a single course
    app.put("/payments/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;

      delete updatedData._id;

      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: updatedData,
      };

      const result = await paymentCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    // =========================
    // Add Attendance
    // =========================

    // POST: /attendances
    app.post("/attendances", async (req, res) => {
      const newAttendance = req.body;
      // সার্ভার থেকে তারিখ সেট করা হলো
      newAttendance.date = new Date().toISOString().split("T")[0];

      try {
        const result = await attendanceCollection.insertOne(newAttendance);
        const attendanceWithId = await attendanceCollection.findOne({
          _id: result.insertedId,
        });

        res.status(201).send(attendanceWithId);
      } catch (error) {
        res.status(500).send({ message: "Failed to record attendance", error });
      }
    });

    // READ (Get all courses)
    app.get("/attendance", async (req, res) => {
      const cursor = attendanceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Delete a single cours
    app.delete("/attendance/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await attendanceCollection.deleteOne(query);
      res.send(result);
    });

    // Update a single course
    app.put("/attendance/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;

      delete updatedData._id;

      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: updatedData,
      };

      const result = await attendanceCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    // =========================
    // Add Quizzes
    // =========================

    // READ (Get all courses)
    app.get("/quizzes", async (req, res) => {
      const cursor = quizzesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/quizzes", async (req, res) => {
      const newQuiz = req.body;

      newQuiz.results = [];

      try {
        const result = await quizzesCollection.insertOne(newQuiz);

        const quizWithId = await quizzesCollection.findOne({
          _id: result.insertedId,
        });

        res.status(201).send(quizWithId);
      } catch (error) {
        console.error("Failed to add quiz:", error);
        res
          .status(500)
          .send({ message: "Failed to add quiz", error: error.message });
      }
    });

    app.patch("/quizzes/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;

      try {
        const objectId = new ObjectId(id);

        delete updatedData._id;

        if (updatedData.results) {
          delete updatedData.results;
        }

        const query = { _id: objectId };
        const updateDoc = { $set: updatedData };

        const updateResult = await quizzesCollection.updateOne(
          query,
          updateDoc
        );

        if (updateResult.matchedCount === 0) {
          return res.status(404).send({ message: "Quiz not found" });
        }

        const updatedQuiz = await quizzesCollection.findOne(query);
        res.send(updatedQuiz);
      } catch (error) {
        if (error.name === "BSONTypeError") {
          return res.status(400).send({ message: "Invalid Quiz ID format." });
        }
        console.error("Server Error during quiz update:", error);
        res.status(500).send({
          message: "Failed to update quiz due to server error.",
          error: error.message,
        });
      }
    });

    // Delete Quizz
    // DELETE: /quizzes/:id
    app.delete("/quizzes/:id", async (req, res) => {
      const id = req.params.id;

      try {
        const objectId = new ObjectId(id);
        const query = { _id: objectId };

        // 1. কুইজ রেকর্ডটি ডাটাবেজ থেকে ডিলিট করা
        const result = await quizzesCollection.deleteOne(query);

        if (result.deletedCount === 1) {
          // 2. সফলভাবে ডিলিট হলে 200 OK বা 204 No Content রেসপন্স পাঠানো
          res.status(200).send({ message: "Quiz deleted successfully" });
        } else {
          // 3. ID ভ্যালিড কিন্তু ডকুমেন্ট না পেলে
          res.status(404).send({ message: "Quiz not found" });
        }
      } catch (error) {
        // 4. ত্রুটি হ্যান্ডেলিং
        if (error.name === "BSONTypeError") {
          return res.status(400).send({ message: "Invalid Quiz ID format." });
        }
        console.error("Server Error during quiz deletion:", error);
        res.status(500).send({
          message: "Failed to delete quiz due to server error.",
          error: error.message,
        });
      }
    });

    // PATCH: /quizzes/:id/submit
    app.patch("/quizzes/:id/submit", async (req, res) => {
      const quizId = req.params.id;
      const newResult = req.body; // ফ্রন্টএন্ড থেকে আসা নতুন রেজাল্ট অবজেক্ট

      try {
        const objectId = new ObjectId(quizId);
        const query = { _id: objectId };

        // $push অপারেটর ব্যবহার করে results অ্যারেতে নতুন রেজাল্ট যোগ করা
        const updateDoc = {
          $push: { results: newResult },
        };

        // FindOneAndUpdate ব্যবহার করে আপডেট হওয়া ডকুমেন্টটি ফেরত নেওয়া হলো
        const result = await quizzesCollection.findOneAndUpdate(
          query,
          updateDoc,
          // { returnDocument: "after" } // আপডেটের পর নতুন ডকুমেন্টটি ফেরত দিন
          { returnOriginal: false }
        );

        if (result.value) {
          // সফল হলে আপডেট হওয়া ডকুমেন্টটি ফ্রন্টএন্ডে ফেরত দিন
          res.send(result.value);
        } else {
          res.status(404).send({ message: "Quiz not found" });
        }
      } catch (error) {
        // ত্রুটি হ্যান্ডেলিং
        if (error.name === "BSONTypeError") {
          return res.status(400).send({ message: "Invalid Quiz ID format." });
        }
        console.error("Server Error during quiz submission:", error);
        res.status(500).send({
          message: "Failed to submit quiz due to server error.",
          error: error.message,
        });
      }
    });

    // =========================
    // About MCQ Quiz Attempts
    // =========================

    // CREATE - Submit a new MCQ Quiz Attempt
    app.post("/mcqquiz", async (req, res) => {
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

        // Validation
        if (!studentId || !batchId || !chapter) {
          return res.status(400).send({ error: "Missing required fields" });
        }

        // Check if already attempted
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

        // Create new attempt
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

    // READ - Get all MCQ Quiz Attempts
    app.get("/mcqquizzes", async (req, res) => {
      try {
        const cursor = mcqQuizzesCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching MCQ quizzes:", error);
        res.status(500).send({ error: "Failed to fetch MCQ quizzes" });
      }
    });

    // READ - Get single MCQ attempt by id
    app.get("/mcqquiz/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const attempt = await mcqQuizzesCollection.findOne(query);

        if (!attempt) {
          return res.status(404).send({ error: "Attempt not found" });
        }

        res.send(attempt);
      } catch (error) {
        console.error("Error fetching attempt:", error);
        res.status(500).send({ error: "Failed to fetch attempt" });
      }
    });

    // READ - Get MCQ Attempts by Student and Batch
    app.get(
      "/mcqquizzes/student/:studentId/batch/:batchId",
      async (req, res) => {
        try {
          const { studentId, batchId } = req.params;
          const cursor = mcqQuizzesCollection.find({ studentId, batchId });
          const result = await cursor.toArray();
          res.send(result);
        } catch (error) {
          console.error("Error fetching student attempts:", error);
          res.status(500).send({ error: "Failed to fetch attempts" });
        }
      }
    );

    // READ - Check if Student has attempted a specific chapter
    app.get("/mcqquizzes/check", async (req, res) => {
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
        console.error("Error checking attempt:", error);
        res.status(500).send({ error: "Failed to check attempt" });
      }
    });

    // READ - Get Leaderboard by Chapter and Batch
    app.get(
      "/mcqquizzes/leaderboard/chapter/:chapter/batch/:batchId",
      async (req, res) => {
        try {
          const { chapter, batchId } = req.params;

          const cursor = mcqQuizzesCollection
            .find({ chapter, batchId })
            .sort({ score: -1, submittedAt: 1 }); // Highest score first

          const result = await cursor.toArray();
          res.send(result);
        } catch (error) {
          console.error("Error fetching leaderboard:", error);
          res.status(500).send({ error: "Failed to fetch leaderboard" });
        }
      }
    );

    // UPDATE - Update a single MCQ attempt (Admin only)
    app.put("/mcqquiz/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updatedData = req.body;

        delete updatedData._id;

        const query = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: { ...updatedData, updatedAt: new Date().toISOString() },
        };

        const result = await mcqQuizzesCollection.updateOne(query, updateDoc);
        res.send(result);
      } catch (error) {
        console.error("Error updating attempt:", error);
        res.status(500).send({ error: "Failed to update attempt" });
      }
    });

    // DELETE - Delete a single MCQ attempt (Admin only)
    app.delete("/mcqquiz/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await mcqQuizzesCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.error("Error deleting attempt:", error);
        res.status(500).send({ error: "Failed to delete attempt" });
      }
    });

    // =========================
    // About Chapter Schedules (Admin)
    // =========================

    // CREATE - Add a new Chapter Schedule
    app.post("/chapter-schedule", async (req, res) => {
      try {
        const { batchId, chapter, startDate, endDate } = req.body;

        // Validation
        if (!batchId || !chapter || !startDate || !endDate) {
          return res.status(400).send({ error: "Missing required fields" });
        }

        // Check if schedule already exists for this batch and chapter
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

        // Create new schedule
        const newSchedule = {
          batchId,
          chapter,
          startDate,
          endDate,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const result = await chapterSchedulesCollection.insertOne(newSchedule);
        res.send({
          success: true,
          message: "Schedule created successfully",
          scheduleId: result.insertedId,
          schedule: { ...newSchedule, _id: result.insertedId },
        });
      } catch (error) {
        console.error("Error creating schedule:", error);
        res.status(500).send({ error: "Failed to create schedule" });
      }
    });

    // READ - Get all Chapter Schedules
    app.get("/chapter-schedules", async (req, res) => {
      try {
        const cursor = chapterSchedulesCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching schedules:", error);
        res.status(500).send({ error: "Failed to fetch schedules" });
      }
    });

    // READ - Get schedules by Batch ID
    app.get("/chapter-schedules/batch/:batchId", async (req, res) => {
      try {
        const { batchId } = req.params;
        const cursor = chapterSchedulesCollection.find({ batchId });
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching batch schedules:", error);
        res.status(500).send({ error: "Failed to fetch schedules" });
      }
    });

    // READ - Get single schedule by ID
    app.get("/chapter-schedule/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const schedule = await chapterSchedulesCollection.findOne(query);

        if (!schedule) {
          return res.status(404).send({ error: "Schedule not found" });
        }

        res.send(schedule);
      } catch (error) {
        console.error("Error fetching schedule:", error);
        res.status(500).send({ error: "Failed to fetch schedule" });
      }
    });

    // UPDATE - Update a Chapter Schedule
    app.put("/chapter-schedule/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updatedData = req.body;

        delete updatedData._id;

        const query = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: { ...updatedData, updatedAt: new Date().toISOString() },
        };

        const result = await chapterSchedulesCollection.updateOne(
          query,
          updateDoc
        );

        if (result.matchedCount === 0) {
          return res.status(404).send({ error: "Schedule not found" });
        }

        res.send({ success: true, message: "Schedule updated successfully" });
      } catch (error) {
        console.error("Error updating schedule:", error);
        res.status(500).send({ error: "Failed to update schedule" });
      }
    });

    // DELETE - Delete a Chapter Schedule
    app.delete("/chapter-schedule/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await chapterSchedulesCollection.deleteOne(query);

        if (result.deletedCount === 0) {
          return res.status(404).send({ error: "Schedule not found" });
        }

        res.send({ success: true, message: "Schedule deleted successfully" });
      } catch (error) {
        console.error("Error deleting schedule:", error);
        res.status(500).send({ error: "Failed to delete schedule" });
      }
    });

    // TOGGLE - Toggle schedule active status
    app.patch("/chapter-schedule/:id/toggle", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };

        const schedule = await chapterSchedulesCollection.findOne(query);
        if (!schedule) {
          return res.status(404).send({ error: "Schedule not found" });
        }

        const updateDoc = {
          $set: {
            isActive: !schedule.isActive,
            updatedAt: new Date().toISOString(),
          },
        };

        await chapterSchedulesCollection.updateOne(query, updateDoc);
        res.send({
          success: true,
          message: "Schedule status updated",
          isActive: !schedule.isActive,
        });
      } catch (error) {
        console.error("Error toggling schedule:", error);
        res.status(500).send({ error: "Failed to toggle schedule" });
      }
    });

    // =================================================================

    // CREATE - Add a new CQ Question
    app.post("/cq-question", async (req, res) => {
      try {
        const {
          courseId,
          chapter,
          stimulusType, // "text" or "image"
          stimulusContent, // text content or image URL
          questions, // Array of 2 questions
        } = req.body;

        // Validation
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

        // Create new CQ
        const newCQ = {
          courseId,
          chapter,
          stimulusType,
          stimulusContent,
          questions, // [{ question: "...", marks: 5 }, { question: "...", marks: 5 }]
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const result = await cqQuestionsCollection.insertOne(newCQ);
        res.send({
          success: true,
          message: "CQ question created successfully",
          cqId: result.insertedId,
          cq: { ...newCQ, _id: result.insertedId },
        });
      } catch (error) {
        console.error("Error creating CQ:", error);
        res.status(500).send({ error: "Failed to create CQ question" });
      }
    });

    // READ - Get all CQ Questions
    app.get("/cq-questions", async (req, res) => {
      try {
        const cursor = cqQuestionsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching CQ questions:", error);
        res.status(500).send({ error: "Failed to fetch CQ questions" });
      }
    });

    // READ - Get CQ Questions by Course ID
    app.get("/cq-questions/course/:courseId", async (req, res) => {
      try {
        const { courseId } = req.params;
        const cursor = cqQuestionsCollection.find({ courseId });
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching CQ questions:", error);
        res.status(500).send({ error: "Failed to fetch CQ questions" });
      }
    });

    // READ - Get CQ Questions by Chapter
    app.get("/cq-questions/chapter/:chapter", async (req, res) => {
      try {
        const { chapter } = req.params;
        const cursor = cqQuestionsCollection.find({ chapter });
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching CQ questions:", error);
        res.status(500).send({ error: "Failed to fetch CQ questions" });
      }
    });

    // READ - Get single CQ Question by ID
    app.get("/cq-question/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const cq = await cqQuestionsCollection.findOne(query);

        if (!cq) {
          return res.status(404).send({ error: "CQ question not found" });
        }

        res.send(cq);
      } catch (error) {
        console.error("Error fetching CQ question:", error);
        res.status(500).send({ error: "Failed to fetch CQ question" });
      }
    });

    // UPDATE - Update a CQ Question
    app.put("/cq-question/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updatedData = req.body;

        delete updatedData._id;

        const query = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: { ...updatedData, updatedAt: new Date().toISOString() },
        };

        const result = await cqQuestionsCollection.updateOne(query, updateDoc);

        if (result.matchedCount === 0) {
          return res.status(404).send({ error: "CQ question not found" });
        }

        res.send({
          success: true,
          message: "CQ question updated successfully",
        });
      } catch (error) {
        console.error("Error updating CQ question:", error);
        res.status(500).send({ error: "Failed to update CQ question" });
      }
    });

    // DELETE - Delete a CQ Question
    app.delete("/cq-question/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await cqQuestionsCollection.deleteOne(query);

        if (result.deletedCount === 0) {
          return res.status(404).send({ error: "CQ question not found" });
        }

        res.send({
          success: true,
          message: "CQ question deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting CQ question:", error);
        res.status(500).send({ error: "Failed to delete CQ question" });
      }
    });

    // =================================================================

    // New -----------------------------

    // POST: নতুন result submit করা
    app.post("/results", async (req, res) => {
      const resultData = req.body;

      try {
        const result = await resultsCollection.insertOne(resultData);

        if (result.insertedId) {
          res.status(201).send({
            message: "Result submitted successfully",
            resultId: result.insertedId,
          });
        } else {
          res.status(500).send({ message: "Failed to submit result" });
        }
      } catch (error) {
        console.error("Error submitting result:", error);
        res.status(500).send({
          message: "Server error",
          error: error.message,
        });
      }
    });

    // GET: সব results পাওয়া
    app.get("/results", async (req, res) => {
      try {
        const results = await resultsCollection
          .find({})
          .sort({ submittedAt: -1 })
          .toArray();

        res.send(results);
      } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).send({ message: "Failed to fetch results" });
      }
    });

    // GET: /results/student/:studentId (একজন student-এর সব results)
    app.get("/results/student/:studentId", async (req, res) => {
      try {
        const results = await resultsCollection
          .find({ studentId: req.params.studentId })
          .sort({ submittedAt: -1 })
          .toArray();

        res.send(results);
      } catch (error) {
        console.error("Error fetching student results:", error);
        res.status(500).send({ message: "Failed to fetch results" });
      }
    });

    // GET: /results/quiz/:quizId (একটি quiz-এর সব results)
    app.get("/results/quiz/:quizId", async (req, res) => {
      try {
        const results = await resultsCollection
          .find({ quizId: req.params.quizId })
          .sort({ submittedAt: -1 })
          .toArray();

        res.send(results);
      } catch (error) {
        console.error("Error fetching quiz results:", error);
        res.status(500).send({ message: "Failed to fetch results" });
      }
    });

    // GET: /results/batch/:batchId (একটি batch-এর সব results)
    app.get("/results/batch/:batchId", async (req, res) => {
      try {
        const results = await resultsCollection
          .find({ batchId: req.params.batchId })
          .sort({ submittedAt: -1 })
          .toArray();

        res.send(results);
      } catch (error) {
        console.error("Error fetching batch results:", error);
        res.status(500).send({ message: "Failed to fetch results" });
      }
    });

    // New --------------------------------

    // Send a ping to confirm a successful connection
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
