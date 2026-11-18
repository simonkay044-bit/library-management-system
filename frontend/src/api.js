// All communication with the Express backend goes through this file (Fetch API).
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(path, method = "GET", body) {
  const options = {
    method: method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(API_URL + path, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // The backend sends { error: "message" } when something goes wrong
    throw new Error(data.error || "Something went wrong. Please try again.");
  }
  return data;
}

// Books
export const getBooks = () => request("/books");
export const addBook = (book) => request("/books", "POST", book);
export const updateBook = (id, book) => request("/books/" + id, "PUT", book);
export const deleteBook = (id) => request("/books/" + id, "DELETE");

// Transactions
export const getTransactions = () => request("/transactions");
export const addTransaction = (t) => request("/transactions", "POST", t);

// Users
export const login = (membership_id, password) =>
  request("/users/login", "POST", { membership_id, password });
export const getUsers = () => request("/users");
export const addUser = (user) => request("/users", "POST", user);
export const updateUser = (id, user) => request("/users/" + id, "PUT", user);
export const deleteUser = (id) => request("/users/" + id, "DELETE");
