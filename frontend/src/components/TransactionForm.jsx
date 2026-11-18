import { useState } from "react";
import Message from "./Message.jsx";

// Form to add stock or borrow (deduct) books.
// Members can only borrow, and always borrow as themselves.
function TransactionForm({ books, users, currentUser, onSubmit }) {
  const isAdmin = currentUser.role === "admin";

  const [bookId, setBookId] = useState("");
  const [type, setType] = useState("BORROW");
  const [quantity, setQuantity] = useState(1);
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccess("");

    const qty = Number(quantity);
    if (!bookId) {
      setError("Please choose a book.");
      return;
    }
    if (!Number.isInteger(qty) || qty <= 0) {
      setError("Quantity must be a whole number above 0.");
      return;
    }
    if (isAdmin && type === "BORROW" && !userId) {
      setError("Please choose who is borrowing the book.");
      return;
    }

    setError("");
    try {
      await onSubmit({
        book_id: Number(bookId),
        type: type,
        quantity: qty,
        // Only borrowing is tied to a member; adding stock is not
        user_id: type !== "BORROW" ? null : isAdmin ? Number(userId) : currentUser.id,
      });
      setSuccess(type === "BORROW" ? "Book borrowed." : "Stock added.");
      setQuantity(1);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Record a transaction</h3>

      <select value={bookId} onChange={(e) => setBookId(e.target.value)}>
        <option value="">-- Choose a book --</option>
        {books.map((b) => (
          <option key={b.id} value={b.id}>
            {b.title} ({b.quantity} in stock)
          </option>
        ))}
      </select>

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="BORROW">Borrow (deduct stock)</option>
        {isAdmin && <option value="ADD_STOCK">Add stock (new arrivals)</option>}
      </select>

      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Quantity"
      />

      {isAdmin && (
        <select value={userId} onChange={(e) => setUserId(e.target.value)}>
          <option value="">-- Member (for borrowing) --</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.membership_id})
            </option>
          ))}
        </select>
      )}

      <button type="submit">Submit</button>
      <Message text={error} />
      <Message text={success} type="success" />
    </form>
  );
}

export default TransactionForm;
