const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const pool = require("./db");
const booksRouter = require("./routes/books");
const transactionsRouter = require("./routes/transactions");
const usersRouter = require("./routes/users");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/books", booksRouter);
app.use("/transactions", transactionsRouter);
app.use("/users", usersRouter);

app.get("/", (req, res) => res.json({ message: "Library API is running." }));

// Create a default admin account the first time the server starts
async function seedAdmin() {
  const result = await pool.query("SELECT COUNT(*) AS n FROM users");
  // PostgreSQL returns COUNT as a string, so convert it
  if (Number(result.rows[0].n) === 0) {
    const hash = await bcrypt.hash("admin123", 10);
    await pool.query(
      "INSERT INTO users (name, membership_id, role, password_hash) VALUES ($1, $2, 'admin', $3)",
      ["Administrator", "ADMIN001", hash]
    );
    console.log("Seeded default admin -> membership ID: ADMIN001, password: admin123");
  }
}

const PORT = process.env.PORT || 5000;

pool
  .query("SELECT 1")
  .then(seedAdmin)
  .then(() => {
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Could not connect to the database:", err.message);
    console.error("Check your .env settings and that schema.sql has been run.");
    process.exit(1);
  });
