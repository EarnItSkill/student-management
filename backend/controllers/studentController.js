const { ObjectId } = require("mongodb");
const connectDB = require("../db/connectDB");

exports.getAllStudents = async (req, res) => {
  try {
    const db = await connectDB();
    const students = await db.collection("students").find().toArray();
    res.send(students);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch students", error });
  }
};

exports.addStudent = async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection("students").insertOne(req.body);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to add student", error });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db
      .collection("students")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to update student", error });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db
      .collection("students")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to delete student", error });
  }
};
