const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const queueRoutes = require("./routes/queueRoutes");
const QueueManager = require("./queue/queueManager");
const { metricsMiddleware, trackMetricsMiddleware } = require('./utils/metrics');

// Integrate the metrics middleware
app.use(trackMetricsMiddleware);
app.use(metricsMiddleware);


dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/queue", queueRoutes);


// Integrate the metrics middleware
app.use(trackMetricsMiddleware);
app.use(metricsMiddleware);


const startServer = async () => {
  await QueueManager.connect();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

module.exports = app;
