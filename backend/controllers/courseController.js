const { ObjectId } = require("mongodb");
const connectDB = require("../db/connectDB");

exports.getAllCourses = async (req, res) => {
  try {
    const db = await connectDB();
    const courses = await db.collection("courses").find().toArray();
    res.send(courses);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch courses", error });
  }
};

exports.addCourse = async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection("courses").insertOne(req.body);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to add course", error });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db
      .collection("courses")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to update course", error });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db
      .collection("courses")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to delete course", error });
  }
};
