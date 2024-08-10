// utils/metrics.js
const client = require("prom-client");

// Create a Registry to register the metrics
const register = new client.Registry();

// Define some custom metrics
const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "code"],
  buckets: [50, 100, 200, 300, 400, 500, 1000], // Duration buckets
});

// Register the custom metrics
register.registerMetric(httpRequestDurationMicroseconds);

// Default metrics
client.collectDefaultMetrics({ register });

// Middleware to track request duration
const trackMetricsMiddleware = (req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on("finish", () => {
    end({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      code: res.statusCode,
    });
  });
  next();
};

// Middleware to expose metrics
const metricsMiddleware = async (req, res, next) => {
  if (req.path === "/metrics") {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } else {
    next();
  }
};





const axios = require("axios");

axios
  .get("http://localhost:3000/api/search", {
    headers: { Authorization: `Bearer YOUR_API_KEY` },
  })
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });

module.exports = { metricsMiddleware, trackMetricsMiddleware };
