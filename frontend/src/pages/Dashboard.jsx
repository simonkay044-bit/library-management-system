import { useState, useEffect } from "react";
import { getBooks, getUsers } from "../api.js";
import StatCard from "../components/StatCard.jsx";
import BookList, { LOW_STOCK_LIMIT } from "../components/BookList.jsx";
import Message from "../components/Message.jsx";

function Dashboard() {
  const [books, setBooks] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load the books and users once when the page opens
  useEffect(() => {
    Promise.all([getBooks(), getUsers()])
      .then(([bookData, userData]) => {
        setBooks(bookData);
        setUserCount(userData.length);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Work out the numbers for the boxes at the top
  let totalCopies = 0;
  let lowCount = 0;
  for (let i = 0; i < books.length; i++) {
    totalCopies = totalCopies + books[i].quantity;
    if (books[i].quantity < LOW_STOCK_LIMIT) {
      lowCount = lowCount + 1;
    }
  }

  const shown = books.filter((b) => {
    const text = (b.title + " " + b.author + " " + b.genre + " " + b.isbn).toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div>
      <h2>Dashboard</h2>
      <Message text={error} />

      <div className="stats">
        <StatCard number={books.length} label="Total Books" />
        <StatCard number={totalCopies} label="Total Copies" />
        <StatCard number={userCount} label="Users" />
        <StatCard number={lowCount} label="Low Stock" />
      </div>

      <div className="card">
        <h3>Book Availability</h3>
        <p>Books with fewer than {LOW_STOCK_LIMIT} copies are highlighted in red.</p>
        <input
          placeholder="Search by title, author, genre or ISBN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {loading ? <p>Loading...</p> : <BookList books={shown} />}
      </div>
    </div>
  );
}

export default Dashboard;
