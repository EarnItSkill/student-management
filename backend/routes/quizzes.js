const express = require("express");
const {
  getAllQuizzes,
  addQuiz,
  updateQuiz,
  deleteQuiz,
} = require("../controllers/quizController");

const router = express.Router();

router.get("/", getAllQuizzes);
router.post("/", addQuiz);
router.patch("/:id", updateQuiz);
router.delete("/:id", deleteQuiz);

module.exports = router;
