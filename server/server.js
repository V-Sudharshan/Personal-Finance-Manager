require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

// Test API
app.get("/", (req, res) => {
  res.send("<h1>Backend is Running</h1>");
});

// User Routes
app.post("/api/v1/users/register", (req, res) => {
  res.json({ message: "User Registered (Backend not connected to DB yet)" });
});

app.post("/api/v1/users/login", (req, res) => {
  res.json({ message: "User Logged In (Backend not connected to DB yet)" });
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
