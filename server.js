require("dotenv").config(); // Load .env variables
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const colors = require("colors");
const connectDb = require("./config/connectDb");
const path = require("path");

// ✅ Connect to MongoDB
connectDb();

const app = express();

// ✅ Middlewares
app.use(morgan("dev"));
app.use(express.json());

// ✅ CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*", // Use CLIENT_URL in Render env
    credentials: true,
  })
);

// ✅ API Routes
app.use("/api/v1", require("./routes/transactionRoutes"));
app.use("/api/v1/users", require("./routes/userRoute"));

// ✅ Serve React frontend (production only)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./client/build")));

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API running in development mode...");
  });
}

// ✅ Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`.cyan.bold)
);
