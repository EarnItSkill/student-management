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

    // =========================
    // About Students
    // =========================

    // CREATE (Add a new Student)
    app.post("/student", async (req, res) => {
      const newStudent = req.body;
      const result = await studentCollection.insertOne(newStudent);
      res.send(result);
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

    // Delete a single cours
    app.delete("/courses/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coursesCollection.deleteOne(query);
      res.send(result);
    });

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

    // Update a single course
    app.put("/batch/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;

      delete updatedData._id;

      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: updatedData,
      };

      const result = await batchCollection.updateOne(query, updateDoc);
      res.send(result);
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

      console.log("PATCH request received for ID:", id);
      console.log("Data to update:", updatedData);

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
          { returnDocument: "after" } // আপডেটের পর নতুন ডকুমেন্টটি ফেরত দিন
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

    // =================================================================

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
