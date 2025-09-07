require("dotenv").config(); // Load .env variables
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const colors = require("colors");
const connectDb = require("./config/connectDb");
const path = require("path");

console.log("Loaded PORT:", process.env.PORT); // Debugging Log
console.log("Loaded MONGO_URL:", process.env.MONGO_URL); // Debugging Log

// Connect to Database
connectDb();

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// ✅ API Routes first
app.use("/api/v1", require("./routes/transactionRoutes"));
app.use("/api/v1/users", require("./routes/userRoute"));

// ✅ React build (only in production)
app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// Server Port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`.cyan.bold)
);
