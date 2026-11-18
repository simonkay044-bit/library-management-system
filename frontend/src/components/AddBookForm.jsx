import { useState } from "react";
import Message from "./Message.jsx";

const emptyForm = { title: "", author: "", genre: "", isbn: "", quantity: "" };

// One form for both adding and updating a book (like my earlier version).
// When "editingBook" is set we are updating that book.
// The parent gives the form a "key" so it starts fresh for each book.
function AddBookForm({ editingBook, onSave, onCancel }) {
  const [form, setForm] = useState(
    editingBook
      ? {
          title: editingBook.title,
          author: editingBook.author,
          genre: editingBook.genre,
          isbn: editingBook.isbn,
          quantity: editingBook.quantity,
        }
      : emptyForm
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    if (!form.title.trim() || !form.author.trim() || !form.genre.trim() || !String(form.isbn).trim()) {
      return "Please fill in all the fields";
    }
    const qty = Number(form.quantity);
    if (form.quantity === "" || !Number.isInteger(qty) || qty < 0) {
      return "Quantity must be a whole number (0 or more)";
    }
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setError("");
    setSaving(true);
    try {
      await onSave({ ...form, quantity: Number(form.quantity) });
      setForm(emptyForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card">
      <h3>{editingBook ? "Update Book" : "Add Book"}</h3>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <input name="author" placeholder="Author" value={form.author} onChange={handleChange} />
        <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} />
        <input name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} />
        <input
          name="quantity"
          type="number"
          min="0"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
        />

        <Message text={error} />

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : editingBook ? "Save Changes" : "Add Book"}
        </button>
        {editingBook && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}

export default AddBookForm;
