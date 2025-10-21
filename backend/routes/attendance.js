const express = require("express");
const {
  getAllAttendance,
  addAttendance,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");

const router = express.Router();

router.get("/", getAllAttendance);
router.post("/", addAttendance);
router.patch("/:id", updateAttendance);
router.delete("/:id", deleteAttendance);

module.exports = router;
