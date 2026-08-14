const fs = require("fs");
const config = require("../config/env");
const { runMigrations } = require("./migrate");
const db = require("../config/db");

db.close();

if (fs.existsSync(config.dbPath)) {
  fs.rmSync(config.dbPath);
}

runMigrations();
console.log("Database reset completed.");
