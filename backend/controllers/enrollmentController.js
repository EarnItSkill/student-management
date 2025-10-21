const { ObjectId } = require("mongodb");
const connectDB = require("../db/connectDB");

// 📋 সব Enrollment লোড
const getAllEnrollments = async (req, res) => {
  try {
    const db = await connectDB();
    const enrollments = await db.collection("enrollments").find().toArray();
    res.status(200).send(enrollments);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch enrollments", error });
  }
};

// ➕ নতুন Enrollment যোগ
const addEnrollment = async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection("enrollments").insertOne(req.body);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to add enrollment", error });
  }
};

// ✏️ নির্দিষ্ট Enrollment আপডেট
const updateEnrollment = async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectDB();
    const result = await db
      .collection("enrollments")
      .updateOne({ _id: new ObjectId(id) }, { $set: req.body });

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to update enrollment", error });
  }
};

// ❌ নির্দিষ্ট Enrollment মুছে ফেলা
const deleteEnrollment = async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectDB();
    const result = await db
      .collection("enrollments")
      .deleteOne({ _id: new ObjectId(id) });

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to delete enrollment", error });
  }
};

module.exports = {
  getAllEnrollments,
  addEnrollment,
  updateEnrollment,
  deleteEnrollment,
};
