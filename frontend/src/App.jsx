import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Books from "./pages/Books.jsx";
import Transactions from "./pages/Transactions.jsx";
import Users from "./pages/Users.jsx";

// Read the saved login (if any) so a page refresh does not log the user out
function loadSavedUser() {
  try {
    const saved = localStorage.getItem("libraryUser");
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
}

function App() {
  const [user, setUser] = useState(loadSavedUser());

  function handleLogin(loggedInUser) {
    setUser(loggedInUser);
    localStorage.setItem("libraryUser", JSON.stringify(loggedInUser));
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem("libraryUser");
  }

  // Pages that need a login are wrapped with this
  function requireLogin(page) {
    return user ? page : <Navigate to="/users" replace />;
  }

  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} />
      <h1>Community Library Management System</h1>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={requireLogin(<Dashboard />)} />
          <Route path="/books" element={requireLogin(<Books user={user} />)} />
          <Route
            path="/transactions"
            element={requireLogin(<Transactions user={user} />)}
          />
          <Route
            path="/users"
            element={<Users user={user} onLogin={handleLogin} />}
          />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
