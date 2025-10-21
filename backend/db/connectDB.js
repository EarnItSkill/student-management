// db/connectDB.js
const { MongoClient } = require("mongodb");
require("dotenv").config();

let db;

async function connectDB() {
  if (db) return db;

  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ndv8bw5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
  const client = new MongoClient(uri);

  await client.connect();
  db = client.db(process.env.DB_NAME);
  console.log("✅ MongoDB Connected Successfully!");
  return db;
}

module.exports = connectDB;
