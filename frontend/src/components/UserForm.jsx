import { useState } from "react";
import Message from "./Message.jsx";

const emptyForm = { name: "", membership_id: "", role: "member", password: "" };

// Used for both adding a new user and editing an existing one.
// The parent gives this form a "key", so React builds a fresh form (with the
// right starting values) every time we switch between users.
function UserForm({ editingUser, onSave, onCancel }) {
  const [form, setForm] = useState(
    editingUser
      ? {
          name: editingUser.name,
          membership_id: editingUser.membership_id,
          role: editingUser.role,
          password: "",
        }
      : emptyForm
  );
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.membership_id.trim()) {
      setError("Name and membership ID are required.");
      return;
    }
    if (!editingUser && form.password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }
    if (editingUser && form.password && form.password.length < 4) {
      setError("New password must be at least 4 characters.");
      return;
    }
    try {
      await onSave(form);
      setForm(emptyForm);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>{editingUser ? "Update user" : "Add a new user"}</h3>
      <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} />
      <input
        name="membership_id"
        placeholder="Membership ID"
        value={form.membership_id}
        onChange={handleChange}
      />
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="member">Member</option>
        <option value="admin">Admin</option>
      </select>
      <input
        name="password"
        type="password"
        placeholder={editingUser ? "New password (leave blank to keep)" : "Password"}
        value={form.password}
        onChange={handleChange}
      />
      <div className="actions">
        <button type="submit">
          {editingUser ? "Update User" : "Add User"}
        </button>
        {editingUser && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
      <Message text={error} />
    </form>
  );
}

export default UserForm;
