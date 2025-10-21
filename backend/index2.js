const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 9000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// Routes
app.use("/students", require("./routes/students"));
app.use("/courses", require("./routes/courses"));
app.use("/batches", require("./routes/batches"));
app.use("/payments", require("./routes/payments"));
app.use("/quizzes", require("./routes/quizzes"));
app.use("/leaderboard", require("./routes/leaderboard"));
app.use("/enrollments", require("./routes/enrollments"));
app.use("/attendance", require("./routes/attendance"));
app.use("/mcq-quizzes", require("./routes/mcqQuizzes"));
app.use("/chapter-schedules", require("./routes/chapterSchedules"));
app.use("/cq-questions", require("./routes/cqQuestions"));

// Root Route
app.get("/", (req, res) => {
  res.send("🚀 Training Center API is Running Successfully!");
});

// 404 Handler
app.use((req, res) => {
  res.status(404).send({ success: false, message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err);
  res
    .status(500)
    .send({ success: false, message: "Server Error", error: err.message });
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
