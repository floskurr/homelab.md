const express = require("express");
const db = require("../config/db");

const router = express.Router();

const allowedTypes = new Set([
  "Server",
  "Virtual Machine",
  "Container / LXC",
  "Network Device",
  "Storage / NAS",
  "UPS / Power",
  "Other",
]);

function parseBoolean(value) {
  if (value === true || value === 1 || value === "1" || value === "true") {
    return 1;
  }
  return 0;
}

function validateEntryPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return "Request body must be a JSON object.";
  }

  if (!payload.name || typeof payload.name !== "string") {
    return "Field 'name' is required and must be a string.";
  }

  if (
    !payload.type ||
    typeof payload.type !== "string" ||
    !allowedTypes.has(payload.type)
  ) {
    return "Field 'type' is required and must be a supported entry type.";
  }

  return null;
}

router.get("/", (req, res) => {
  const rows = db
    .prepare(
      `SELECT id, name, type, ip, system, notes, parent_id, power_source_id, private, created_at, updated_at
       FROM entries
       ORDER BY name COLLATE NOCASE ASC`,
    )
    .all();

  res.json({ data: rows });
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const row = db
    .prepare(
      `SELECT id, name, type, ip, system, notes, parent_id, power_source_id, private, created_at, updated_at
       FROM entries
       WHERE id = ?`,
    )
    .get(id);

  if (!row) {
    return res.status(404).json({ message: "Entry not found." });
  }

  return res.json({ data: row });
});

router.post("/", (req, res) => {
  const validationError = validateEntryPayload(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const stmt = db.prepare(
    `INSERT INTO entries (name, type, ip, system, notes, parent_id, power_source_id, private)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  );

  const result = stmt.run(
    req.body.name.trim(),
    req.body.type,
    req.body.ip || null,
    req.body.system || null,
    req.body.notes || null,
    req.body.parent_id ?? null,
    req.body.power_source_id ?? null,
    parseBoolean(req.body.private),
  );

  const created = db
    .prepare(
      `SELECT id, name, type, ip, system, notes, parent_id, power_source_id, private, created_at, updated_at
       FROM entries
       WHERE id = ?`,
    )
    .get(result.lastInsertRowid);

  return res.status(201).json({ data: created });
});

router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare("SELECT id FROM entries WHERE id = ?").get(id);
  if (!existing) {
    return res.status(404).json({ message: "Entry not found." });
  }

  const validationError = validateEntryPayload(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  db.prepare(
    `UPDATE entries
     SET name = ?, type = ?, ip = ?, system = ?, notes = ?, parent_id = ?, power_source_id = ?, private = ?
     WHERE id = ?`,
  ).run(
    req.body.name.trim(),
    req.body.type,
    req.body.ip || null,
    req.body.system || null,
    req.body.notes || null,
    req.body.parent_id ?? null,
    req.body.power_source_id ?? null,
    parseBoolean(req.body.private),
    id,
  );

  const updated = db
    .prepare(
      `SELECT id, name, type, ip, system, notes, parent_id, power_source_id, private, created_at, updated_at
       FROM entries
       WHERE id = ?`,
    )
    .get(id);

  return res.json({ data: updated });
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const result = db.prepare("DELETE FROM entries WHERE id = ?").run(id);

  if (result.changes === 0) {
    return res.status(404).json({ message: "Entry not found." });
  }

  return res.status(204).send();
});

module.exports = router;
