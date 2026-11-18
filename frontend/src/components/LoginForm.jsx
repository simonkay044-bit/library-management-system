import { useState } from "react";
import { login } from "../api.js";
import Message from "./Message.jsx";

function LoginForm({ onLogin }) {
  const [membershipId, setMembershipId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!membershipId.trim() || !password) {
      setError("Please enter your membership ID and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const user = await login(membershipId.trim(), password);
      onLogin(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="card login-card" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        placeholder="Membership ID"
        value={membershipId}
        onChange={(e) => setMembershipId(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      <Message text={error} />
      <p className="hint">Default admin: ADMIN001 / admin123</p>
    </form>
  );
}

export default LoginForm;
