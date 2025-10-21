const express = require("express");
const {
  getAllChapterSchedules,
  addChapterSchedule,
  updateChapterSchedule,
  deleteChapterSchedule,
} = require("../controllers/chapterScheduleController");

const router = express.Router();

router.get("/", getAllChapterSchedules);
router.post("/", addChapterSchedule);
router.patch("/:id", updateChapterSchedule);
router.delete("/:id", deleteChapterSchedule);

module.exports = router;
