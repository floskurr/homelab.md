const db = require("../config/db");

function runMigrations() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      ip TEXT,
      system TEXT,
      notes TEXT,
      parent_id INTEGER,
      power_source_id INTEGER,
      private INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (parent_id) REFERENCES entries(id) ON DELETE SET NULL,
      FOREIGN KEY (power_source_id) REFERENCES entries(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_entries_name ON entries(name);
    CREATE INDEX IF NOT EXISTS idx_entries_type ON entries(type);
    CREATE INDEX IF NOT EXISTS idx_entries_parent_id ON entries(parent_id);
    CREATE INDEX IF NOT EXISTS idx_entries_power_source_id ON entries(power_source_id);

    CREATE TRIGGER IF NOT EXISTS trg_entries_updated_at
    AFTER UPDATE ON entries
    FOR EACH ROW
    BEGIN
      UPDATE entries
      SET updated_at = datetime('now')
      WHERE id = OLD.id;
    END;
  `);
}

if (require.main === module) {
  runMigrations();
  console.log("Database migrations completed.");
}

module.exports = { runMigrations };
