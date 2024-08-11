// Desc: Connect to MongoDB
// Auth: Duong Ngoc Yen
// Date: 26/07/2023
//---------------------------------------------------------
// Import mongoose
const mongoose = require("mongoose");
// Import config
const config = require("config");
// Get mongoURI from config
const db = config.get("mongoURI");
// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

// Export module
module.exports = connectDB;
