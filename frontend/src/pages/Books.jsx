import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { getBooks, addBook, updateBook, deleteBook } from "../api.js";
import AddBookForm from "../components/AddBookForm.jsx";
import BookList from "../components/BookList.jsx";
import Message from "../components/Message.jsx";

function Books({ user }) {
  const [books, setBooks] = useState([]);
  // null means we are adding a new book, otherwise we are updating this book
  const [editingBook, setEditingBook] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getBooks()
      .then((data) => setBooks(data))
      .catch((err) => setError(err.message));
  }, []);

  // Only admins manage books
  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // The form shows its own error if this throws
  async function handleSave(book) {
    if (editingBook) {
      const updated = await updateBook(editingBook.id, book);
      setBooks(books.map((b) => (b.id === updated.id ? updated : b)));
      setEditingBook(null);
    } else {
      const created = await addBook(book);
      setBooks([...books, created]);
    }
  }

  async function handleDelete(book) {
    if (!window.confirm("Delete " + book.title + "?")) return;
    try {
      await deleteBook(book.id);
      setBooks(books.filter((b) => b.id !== book.id));
      if (editingBook && editingBook.id === book.id) setEditingBook(null);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2>Book Management</h2>

      <AddBookForm
        key={editingBook ? editingBook.id : "new"}
        editingBook={editingBook}
        onSave={handleSave}
        onCancel={() => setEditingBook(null)}
      />

      <div className="card">
        <h3>All Books</h3>
        <Message text={error} />
        <BookList books={books} onEdit={setEditingBook} onDelete={handleDelete} />
      </div>
    </div>
  );
}

export default Books;
