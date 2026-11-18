import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, addUser, updateUser, deleteUser } from "../api.js";
import LoginForm from "../components/LoginForm.jsx";
import UserForm from "../components/UserForm.jsx";
import Message from "../components/Message.jsx";

// This page does three jobs depending on who is looking:
//  - not logged in -> login form
//  - member        -> a message (only admins manage users)
//  - admin         -> add / update / delete users
function Users({ user, onLogin }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState("");

  const isAdmin = user && user.role === "admin";

  useEffect(() => {
    if (isAdmin) {
      getUsers()
        .then((data) => setUsers(data))
        .catch((err) => setError(err.message));
    }
  }, [isAdmin]);

  function handleLogin(loggedInUser) {
    onLogin(loggedInUser);
    navigate("/dashboard");
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (!isAdmin) {
    return (
      <div>
        <h2>User Management</h2>
        <p className="message error">Only administrators can manage users.</p>
      </div>
    );
  }

  async function handleSave(form) {
    if (editingUser) {
      const updated = await updateUser(editingUser.id, form);
      setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
      setEditingUser(null);
    } else {
      const created = await addUser(form);
      setUsers([...users, created]);
    }
  }

  async function handleDelete(u) {
    if (u.id === user.id) {
      setError("You cannot delete the account you are logged in with.");
      return;
    }
    if (!window.confirm("Delete user " + u.name + "?")) return;
    try {
      await deleteUser(u.id);
      setUsers(users.filter((x) => x.id !== u.id));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2>User Management</h2>
      <UserForm
        key={editingUser ? editingUser.id : "new"}
        editingUser={editingUser}
        onSave={handleSave}
        onCancel={() => setEditingUser(null)}
      />
      <div className="card">
      <h3>All Users ({users.length})</h3>
      <Message text={error} />
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Membership ID</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.membership_id}</td>
                <td>{u.role}</td>
                <td className="actions">
                  <button onClick={() => setEditingUser(u)}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(u)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}

export default Users;
