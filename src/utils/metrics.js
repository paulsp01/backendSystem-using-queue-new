const client = require("prom-client");

// Create a Registry to register the metrics
const register = new client.Registry();

// Create a counter metric for tracking the number of requests
const requestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

register.registerMetric(requestCounter);

// Create a histogram metric for tracking response times
const responseTimeHistogram = new client.Histogram({
  name: "http_response_time_seconds",
  help: "Histogram for tracking response times in seconds",
  labelNames: ["method", "route", "status_code"],
});

register.registerMetric(responseTimeHistogram);

// Expose the metrics endpoint
const metricsMiddleware = async (req, res, next) => {
  if (req.path === "/metrics") {
    res.set("Content-Type", register.contentType);
    return res.end(await register.metrics());
  }
  next();
};

// Increment the counter and record response time for each request
const trackMetricsMiddleware = (req, res, next) => {
  const end = responseTimeHistogram.startTimer({
    method: req.method,
    route: req.route?.path || req.path,
    status_code: res.statusCode,
  });
  res.on("finish", () => {
    requestCounter.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode,
    });
    end();
  });
  next();
};

module.exports = {
  metricsMiddleware,
  trackMetricsMiddleware,
  register,
};
