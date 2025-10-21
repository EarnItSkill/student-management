const express = require("express");
const {
  getAllCourses,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const router = express.Router();

router.get("/", getAllCourses);
router.post("/", addCourse);
router.patch("/:id", updateCourse);
router.delete("/:id", deleteCourse);

module.exports = router;
