const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../db");

const router = express.Router();

// PostgreSQL error code for "unique value already exists"
const UNIQUE_VIOLATION = "23505";

// Never send password_hash back to the browser
const PUBLIC_FIELDS = "id, name, membership_id, role, created_at";

function isValidId(id) {
  return /^\d+$/.test(id);
}

// POST /users/login  { membership_id, password }
router.post("/login", async (req, res) => {
  const { membership_id, password } = req.body;
  if (!membership_id || !password) {
    return res.status(400).json({ error: "Membership ID and password are required." });
  }
  try {
    const result = await pool.query("SELECT * FROM users WHERE membership_id = $1", [
      String(membership_id).trim(),
    ]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Invalid membership ID or password." });
    }
    const { password_hash, ...safe } = user;
    res.json(safe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed." });
  }
});

// GET /users
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`SELECT ${PUBLIC_FIELDS} FROM users ORDER BY name ASC`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

// POST /users  { name, membership_id, role, password }
router.post("/", async (req, res) => {
  const { name, membership_id, role, password } = req.body;
  if (!name || !membership_id || !password) {
    return res.status(400).json({ error: "Name, membership ID and password are required." });
  }
  if (password.length < 4) {
    return res.status(400).json({ error: "Password must be at least 4 characters." });
  }
  if (role && !["admin", "member"].includes(role)) {
    return res.status(400).json({ error: "Role must be admin or member." });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, membership_id, role, password_hash)
       VALUES ($1, $2, $3, $4) RETURNING ${PUBLIC_FIELDS}`,
      [name.trim(), String(membership_id).trim(), role || "member", hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === UNIQUE_VIOLATION) {
      return res.status(409).json({ error: "That membership ID is already in use." });
    }
    console.error(err);
    res.status(500).json({ error: "Failed to add user." });
  }
});

// PUT /users/:id  { name, membership_id, role, password? }  (password optional)
router.put("/:id", async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(404).json({ error: "User not found." });
  const { name, membership_id, role, password } = req.body;
  if (!name || !membership_id) {
    return res.status(400).json({ error: "Name and membership ID are required." });
  }
  if (role && !["admin", "member"].includes(role)) {
    return res.status(400).json({ error: "Role must be admin or member." });
  }
  if (password && password.length < 4) {
    return res.status(400).json({ error: "Password must be at least 4 characters." });
  }
  try {
    let result;
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      result = await pool.query(
        `UPDATE users SET name = $1, membership_id = $2, role = $3, password_hash = $4
         WHERE id = $5 RETURNING ${PUBLIC_FIELDS}`,
        [name.trim(), String(membership_id).trim(), role || "member", hash, req.params.id]
      );
    } else {
      result = await pool.query(
        `UPDATE users SET name = $1, membership_id = $2, role = $3
         WHERE id = $4 RETURNING ${PUBLIC_FIELDS}`,
        [name.trim(), String(membership_id).trim(), role || "member", req.params.id]
      );
    }
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found." });
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === UNIQUE_VIOLATION) {
      return res.status(409).json({ error: "That membership ID is already in use." });
    }
    console.error(err);
    res.status(500).json({ error: "Failed to update user." });
  }
});

// DELETE /users/:id
router.delete("/:id", async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(404).json({ error: "User not found." });
  try {
    const result = await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "User not found." });
    res.json({ message: "User deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete user." });
  }
});

module.exports = router;
