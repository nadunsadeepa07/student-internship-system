// config/db.js
// Serverless-safe Mongoose connection (cached across warm invocations)

const mongoose = require("mongoose");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/internshipDB";

// `global` persists across warm serverless invocations on the same instance,
// so we reuse the connection instead of reconnecting on every request.
let cached = global.mongooseConnection;

if (!cached) {
  cached = global.mongooseConnection = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, {
        serverSelectionTimeoutMS: 15000,
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        console.log("MongoDB Connected");
        return mongooseInstance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // Reset so the next request can retry instead of being stuck on a
    // rejected promise forever.
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

module.exports = connectDB;