import { NavLink, useNavigate } from "react-router-dom";

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  function handleLogout() {
    onLogout();
    navigate("/users");
  }

  return (
    <nav className="navbar">
      <span className="brand">Community Library</span>

      {user ? (
        <div className="links">
          <NavLink to="/dashboard">Dashboard</NavLink>
          {user.role === "admin" && <NavLink to="/books">Books</NavLink>}
          <NavLink to="/transactions">Transactions</NavLink>
          <NavLink to="/users">Users</NavLink>
          <span className="who">
            {user.name} ({user.role})
          </span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="links">
          <NavLink to="/users">Login</NavLink>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
