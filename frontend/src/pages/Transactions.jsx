import { useState, useEffect } from "react";
import { getBooks, getUsers, getTransactions, addTransaction } from "../api.js";
import TransactionForm from "../components/TransactionForm.jsx";
import TransactionHistory from "../components/TransactionHistory.jsx";
import Message from "../components/Message.jsx";

function Transactions({ user }) {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  // Load everything this page needs
  async function loadData() {
    try {
      const [b, u, t] = await Promise.all([getBooks(), getUsers(), getTransactions()]);
      setBooks(b);
      setUsers(u);
      setTransactions(t);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit(transaction) {
    await addTransaction(transaction);
    // Reload so stock levels and the history log are up to date
    await loadData();
  }

  // Members only see their own borrowing history; admins see everything
  const visible =
    user.role === "admin" ? transactions : transactions.filter((t) => t.user_id === user.id);

  return (
    <div>
      <h2>Transactions</h2>
      <Message text={error} />
      <TransactionForm books={books} users={users} currentUser={user} onSubmit={handleSubmit} />
      <div className="card">
        <h3>{user.role === "admin" ? "Transaction History" : "My Borrowing History"}</h3>
        <TransactionHistory transactions={visible} />
      </div>
    </div>
  );
}

export default Transactions;
