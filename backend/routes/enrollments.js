const express = require("express");
const {
  getAllEnrollments,
  addEnrollment,
  updateEnrollment,
  deleteEnrollment,
} = require("../controllers/enrollmentController");

const router = express.Router();

router.get("/", getAllEnrollments);
router.post("/", addEnrollment);
router.patch("/:id", updateEnrollment);
router.delete("/:id", deleteEnrollment);

module.exports = router;
