const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET /transactions  (newest first)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM transactions ORDER BY created_at DESC, id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch transactions." });
  }
});

// POST /transactions
// body: { book_id, type: "ADD_STOCK" | "BORROW", quantity, user_id? }
// Updates stock and logs the transaction atomically.
router.post("/", async (req, res) => {
  const { book_id, type, user_id } = req.body;
  const quantity = Number(req.body.quantity);

  if (!book_id || !Number.isInteger(Number(book_id))) {
    return res.status(400).json({ error: "Please choose a book." });
  }
  if (!["ADD_STOCK", "BORROW"].includes(type)) {
    return res.status(400).json({ error: "Type must be ADD_STOCK or BORROW." });
  }
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({ error: "Quantity must be a whole number above 0." });
  }
  if (user_id && !Number.isInteger(Number(user_id))) {
    return res.status(400).json({ error: "Invalid member." });
  }

  // One client = one connection, so BEGIN ... COMMIT covers all the queries below
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // FOR UPDATE locks the row so two people cannot borrow the last copy at once
    const bookResult = await client.query("SELECT * FROM books WHERE id = $1 FOR UPDATE", [
      book_id,
    ]);
    if (bookResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Book not found." });
    }
    const book = bookResult.rows[0];

    if (type === "BORROW" && book.quantity < quantity) {
      await client.query("ROLLBACK");
      return res
        .status(400)
        .json({ error: `Only ${book.quantity} cop${book.quantity === 1 ? "y" : "ies"} in stock.` });
    }

    let userName = null;
    if (user_id) {
      const userResult = await client.query("SELECT name FROM users WHERE id = $1", [user_id]);
      if (userResult.rows.length > 0) userName = userResult.rows[0].name;
    }

    const delta = type === "ADD_STOCK" ? quantity : -quantity;
    await client.query("UPDATE books SET quantity = quantity + $1 WHERE id = $2", [delta, book_id]);

    const inserted = await client.query(
      `INSERT INTO transactions (book_id, user_id, book_title, user_name, type, quantity)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [book_id, user_id || null, book.title, userName, type, quantity]
    );

    await client.query("COMMIT");
    res.status(201).json(inserted.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Failed to record transaction." });
  } finally {
    client.release();
  }
});

module.exports = router;
