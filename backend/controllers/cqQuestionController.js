const { ObjectId } = require("mongodb");
const connectDB = require("../db/connectDB");

// 📋 সব CQ প্রশ্ন লোড
const getAllCqQuestions = async (req, res) => {
  try {
    const db = await connectDB();
    const cqQuestions = await db.collection("cqQuestions").find().toArray();
    res.status(200).send(cqQuestions);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch CQ questions", error });
  }
};

// ➕ নতুন CQ প্রশ্ন যোগ
const addCqQuestion = async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection("cqQuestions").insertOne(req.body);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to add CQ question", error });
  }
};

// ✏️ নির্দিষ্ট CQ প্রশ্ন আপডেট
const updateCqQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectDB();
    const result = await db
      .collection("cqQuestions")
      .updateOne({ _id: new ObjectId(id) }, { $set: req.body });

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to update CQ question", error });
  }
};

// ❌ নির্দিষ্ট CQ প্রশ্ন মুছে ফেলা
const deleteCqQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectDB();
    const result = await db
      .collection("cqQuestions")
      .deleteOne({ _id: new ObjectId(id) });

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to delete CQ question", error });
  }
};

module.exports = {
  getAllCqQuestions,
  addCqQuestion,
  updateCqQuestion,
  deleteCqQuestion,
};
