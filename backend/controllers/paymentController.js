const { ObjectId } = require("mongodb");
const connectDB = require("../db/connectDB");

exports.getAllPayments = async (req, res) => {
  try {
    const db = await connectDB();
    const payments = await db.collection("payments").find().toArray();
    res.send(payments);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch payments", error });
  }
};

exports.addPayment = async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection("payments").insertOne(req.body);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to add payment", error });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db
      .collection("payments")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to update payment", error });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db
      .collection("payments")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to delete payment", error });
  }
};
