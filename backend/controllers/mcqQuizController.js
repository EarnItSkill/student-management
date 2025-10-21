import { ObjectId } from "mongodb";

export default function mcqQuizController(mcqQuizzesCollection) {
  return {
    // CREATE - Submit a new MCQ Quiz Attempt
    submitQuiz: async (req, res) => {
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
    },

    // READ - Get all MCQ Quiz Attempts
    getAll: async (req, res) => {
      try {
        const cursor = mcqQuizzesCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching MCQ quizzes:", error);
        res.status(500).send({ error: "Failed to fetch MCQ quizzes" });
      }
    },

    // READ - Get single MCQ attempt by id
    getById: async (req, res) => {
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
    },

    // READ - Get MCQ Attempts by Student and Batch
    getByStudentAndBatch: async (req, res) => {
      try {
        const { studentId, batchId } = req.params;
        const cursor = mcqQuizzesCollection.find({ studentId, batchId });
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching student attempts:", error);
        res.status(500).send({ error: "Failed to fetch attempts" });
      }
    },

    // READ - Check if Student has attempted a specific chapter
    checkAttempt: async (req, res) => {
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
    },

    // READ - Get Leaderboard by Chapter and Batch
    getLeaderboard: async (req, res) => {
      try {
        const { chapter, batchId } = req.params;

        const cursor = mcqQuizzesCollection
          .find({ chapter, batchId })
          .sort({ score: -1, submittedAt: 1 });

        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).send({ error: "Failed to fetch leaderboard" });
      }
    },

    // UPDATE - Update a single MCQ attempt
    updateAttempt: async (req, res) => {
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
    },

    // DELETE - Delete a single MCQ attempt
    deleteAttempt: async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await mcqQuizzesCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.error("Error deleting attempt:", error);
        res.status(500).send({ error: "Failed to delete attempt" });
      }
    },
  };
}
