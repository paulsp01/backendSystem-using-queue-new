const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const queueRoutes = require("./routes/queueRoutes");
const QueueManager = require("./queue/queueManager");
const {
  metricsMiddleware,
  trackMetricsMiddleware,
} = require("./utils/metrics");

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Integrate the metrics middleware
app.use(trackMetricsMiddleware);
app.use(metricsMiddleware);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/queue", queueRoutes);

// Function to start the server
const startServer = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Initialize QueueManager (assuming it involves some asynchronous operations)
    await QueueManager.connect();

    // Start the server only after successful DB and QueueManager initialization
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start the server:", err);
    process.exit(1); // Exit the process if initialization fails
  }
};

// Start the server
startServer();

module.exports = app;
