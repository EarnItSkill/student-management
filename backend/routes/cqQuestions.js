const express = require("express");
const {
  getAllCqQuestions,
  addCqQuestion,
  updateCqQuestion,
  deleteCqQuestion,
} = require("../controllers/cqQuestionController");

const router = express.Router();

router.get("/", getAllCqQuestions);
router.post("/", addCqQuestion);
router.patch("/:id", updateCqQuestion);
router.delete("/:id", deleteCqQuestion);

module.exports = router;
