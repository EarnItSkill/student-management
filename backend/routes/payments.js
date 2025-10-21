const express = require("express");
const {
  getAllPayments,
  addPayment,
  updatePayment,
  deletePayment,
} = require("../controllers/paymentController");

const router = express.Router();

router.get("/", getAllPayments);
router.post("/", addPayment);
router.patch("/:id", updatePayment);
router.delete("/:id", deletePayment);

module.exports = router;
