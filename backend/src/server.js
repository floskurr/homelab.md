const app = require("./app");
const config = require("./config/env");
const { runMigrations } = require("./db/migrate");

runMigrations();

app.listen(config.port, () => {
  console.log(`homelab-backend listening on http://localhost:${config.port}`);
});
