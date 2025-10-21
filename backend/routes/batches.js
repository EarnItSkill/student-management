const express = require("express");
const {
  getAllBatches,
  addBatch,
  updateBatch,
  deleteBatch,
} = require("../controllers/batchController");

const router = express.Router();

router.get("/", getAllBatches);
router.post("/", addBatch);
router.patch("/:id", updateBatch);
router.delete("/:id", deleteBatch);

module.exports = router;
