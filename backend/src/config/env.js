const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const rootDir = path.resolve(__dirname, "..", "..");

const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3001,
  dbPath: process.env.DB_PATH
    ? path.resolve(rootDir, process.env.DB_PATH)
    : path.resolve(rootDir, "data", "homelab.db"),
  corsOrigin: process.env.CORS_ORIGIN || "*",
};

module.exports = config;
