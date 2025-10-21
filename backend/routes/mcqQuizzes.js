import express from "express";
import mcqQuizController from "../controllers/mcqQuizController.js";

export default function mcqQuizRoutes(mcqQuizzesCollection) {
  const router = express.Router();
  const controller = mcqQuizController(mcqQuizzesCollection);

  router.post("/mcqquiz", controller.submitQuiz);
  router.get("/mcqquizzes", controller.getAll);
  router.get("/mcqquiz/:id", controller.getById);
  router.get(
    "/mcqquizzes/student/:studentId/batch/:batchId",
    controller.getByStudentAndBatch
  );
  router.get("/mcqquizzes/check", controller.checkAttempt);
  router.get(
    "/mcqquizzes/leaderboard/chapter/:chapter/batch/:batchId",
    controller.getLeaderboard
  );
  router.put("/mcqquiz/:id", controller.updateAttempt);
  router.delete("/mcqquiz/:id", controller.deleteAttempt);

  return router;
}
