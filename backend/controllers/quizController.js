const { ObjectId } = require("mongodb");
const connectDB = require("../db/connectDB");

exports.getAllQuizzes = async (req, res) => {
  try {
    const db = await connectDB();
    const quizzes = await db.collection("quizzes").find().toArray();
    res.send(quizzes);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch quizzes", error });
  }
};

exports.addQuiz = async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection("quizzes").insertOne(req.body);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to add quiz", error });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db
      .collection("quizzes")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to update quiz", error });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db
      .collection("quizzes")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to delete quiz", error });
  }
};
