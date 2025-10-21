const { ObjectId } = require("mongodb");
const connectDB = require("../db/connectDB");

// 📋 সব Chapter Schedule লোড
const getAllChapterSchedules = async (req, res) => {
  try {
    const db = await connectDB();
    const schedules = await db.collection("chapterSchedules").find().toArray();
    res.status(200).send(schedules);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to fetch chapter schedules", error });
  }
};

// ➕ নতুন Chapter Schedule যোগ
const addChapterSchedule = async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection("chapterSchedules").insertOne(req.body);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to add chapter schedule", error });
  }
};

// ✏️ নির্দিষ্ট Chapter Schedule আপডেট
const updateChapterSchedule = async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectDB();
    const result = await db
      .collection("chapterSchedules")
      .updateOne({ _id: new ObjectId(id) }, { $set: req.body });

    res.status(200).send(result);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to update chapter schedule", error });
  }
};

// ❌ নির্দিষ্ট Chapter Schedule মুছে ফেলা
const deleteChapterSchedule = async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectDB();
    const result = await db
      .collection("chapterSchedules")
      .deleteOne({ _id: new ObjectId(id) });

    res.status(200).send(result);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to delete chapter schedule", error });
  }
};

module.exports = {
  getAllChapterSchedules,
  addChapterSchedule,
  updateChapterSchedule,
  deleteChapterSchedule,
};
