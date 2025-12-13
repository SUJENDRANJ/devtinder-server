const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

const configDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected".cyan);
  } catch (err) {
    throw new Error(`MongoDB connection failed ${err.message}`);
  }
};

module.exports = configDB;
