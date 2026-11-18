const express = require("express");
const pool = require("../db");

const router = express.Router();

// PostgreSQL error code for "unique value already exists"
const UNIQUE_VIOLATION = "23505";

// Ids in the URL must be whole numbers, otherwise PostgreSQL throws an error
function isValidId(id) {
  return /^\d+$/.test(id);
}

function validateBook(body) {
  const { title, author, genre, isbn, quantity } = body;
  if (!title || !author || !genre || !isbn) {
    return "Title, author, genre and ISBN are required.";
  }
  const q = Number(quantity);
  if (!Number.isInteger(q) || q < 0) {
    return "Quantity must be a whole number of 0 or more.";
  }
  return null;
}

// GET /books
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM books ORDER BY title ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

// GET /books/:id
router.get("/:id", async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(404).json({ error: "Book not found." });
  try {
    const result = await pool.query("SELECT * FROM books WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Book not found." });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch book." });
  }
});

// POST /books
router.post("/", async (req, res) => {
  const problem = validateBook(req.body);
  if (problem) return res.status(400).json({ error: problem });

  const { title, author, genre, isbn, quantity } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO books (title, author, genre, isbn, quantity)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title.trim(), author.trim(), genre.trim(), String(isbn).trim(), Number(quantity)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === UNIQUE_VIOLATION) {
      return res.status(409).json({ error: "A book with that ISBN already exists." });
    }
    console.error(err);
    res.status(500).json({ error: "Failed to add book." });
  }
});

// PUT /books/:id
router.put("/:id", async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(404).json({ error: "Book not found." });
  const problem = validateBook(req.body);
  if (problem) return res.status(400).json({ error: problem });

  const { title, author, genre, isbn, quantity } = req.body;
  try {
    const result = await pool.query(
      `UPDATE books
       SET title = $1, author = $2, genre = $3, isbn = $4, quantity = $5
       WHERE id = $6 RETURNING *`,
      [title.trim(), author.trim(), genre.trim(), String(isbn).trim(), Number(quantity), req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Book not found." });
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === UNIQUE_VIOLATION) {
      return res.status(409).json({ error: "A book with that ISBN already exists." });
    }
    console.error(err);
    res.status(500).json({ error: "Failed to update book." });
  }
});

// DELETE /books/:id
router.delete("/:id", async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(404).json({ error: "Book not found." });
  try {
    const result = await pool.query("DELETE FROM books WHERE id = $1", [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Book not found." });
    res.json({ message: "Book deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete book." });
  }
});

module.exports = router;
