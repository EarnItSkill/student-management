const connectDB = require("../db/connectDB");

exports.getLeaderboard = async (req, res) => {
  try {
    const db = await connectDB();
    const leaderboard = await db
      .collection("results")
      .aggregate([
        { $group: { _id: "$studentId", totalScore: { $sum: "$score" } } },
        { $sort: { totalScore: -1 } },
      ])
      .toArray();
    res.send(leaderboard);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch leaderboard", error });
  }
};
