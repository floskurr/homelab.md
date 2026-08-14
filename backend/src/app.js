const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const config = require("./config/env");
const healthRoutes = require("./routes/health");
const entriesRoutes = require("./routes/entries");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.set("env", config.nodeEnv);

app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));

app.get("/", (req, res) => {
  res.json({
    name: "homelab-backend",
    version: "1.0.0",
    docs: "Use /api/health and /api/entries",
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/entries", entriesRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
