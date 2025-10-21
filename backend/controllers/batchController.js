const { ObjectId } = require("mongodb");
const connectDB = require("../db/connectDB");

exports.getAllBatches = async (req, res) => {
  try {
    const db = await connectDB();
    const batches = await db.collection("batches").find().toArray();
    res.send(batches);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch batches", error });
  }
};

exports.addBatch = async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection("batches").insertOne(req.body);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to add batch", error });
  }
};

exports.updateBatch = async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db
      .collection("batches")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to update batch", error });
  }
};

exports.deleteBatch = async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db
      .collection("batches")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to delete batch", error });
  }
};
