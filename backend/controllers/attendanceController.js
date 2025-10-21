const { ObjectId } = require("mongodb");
const connectDB = require("../db/connectDB");

// 📋 সব Attendance লোড
const getAllAttendance = async (req, res) => {
  try {
    const db = await connectDB();
    const attendance = await db.collection("attendance").find().toArray();
    res.status(200).send(attendance);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to fetch attendance records", error });
  }
};

// ➕ নতুন Attendance যোগ
const addAttendance = async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection("attendance").insertOne(req.body);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to add attendance record", error });
  }
};

// ✏️ নির্দিষ্ট Attendance আপডেট
const updateAttendance = async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectDB();
    const result = await db
      .collection("attendance")
      .updateOne({ _id: new ObjectId(id) }, { $set: req.body });

    res.status(200).send(result);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to update attendance record", error });
  }
};

// ❌ নির্দিষ্ট Attendance মুছে ফেলা
const deleteAttendance = async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectDB();
    const result = await db
      .collection("attendance")
      .deleteOne({ _id: new ObjectId(id) });

    res.status(200).send(result);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to delete attendance record", error });
  }
};

module.exports = {
  getAllAttendance,
  addAttendance,
  updateAttendance,
  deleteAttendance,
};
