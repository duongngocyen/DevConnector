const mongoose = require("mongoose");

// Create Schema
const UserSchema = new mongoose.Schema({
  // Name
  name: {
    type: String,
    required: true,
  },
  // Email
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // Password
  password: {
    type: String,
    required: true,
  },
  // Avatar
  avatar: {
    type: String,
  },
  // Date
  date: {
    type: Date,
    default: Date.now,
  },
});

// Export module
module.exports = User = mongoose.model("user", UserSchema);
