// Desc: Entry point for the application
// Auth: Duong Ngoc Yen
// Date: 26/07/2023
//---------------------------------------------------------
// Import express
const express = require("express");
// Import connectDB
const connectDB = require("./config/db");
// Create app
const app = express();
// Connect to database
connectDB();
// Init middleware
app.use(express.json({ extended: false }));

// Init middleware
app.get("/", (req, res) => res.send("API Running"));

// Define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

// Define routes
const PORT = process.env.PORT || 5000;
// Listen to port
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
