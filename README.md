# Library Management System

## Project Description

This is my Library Management System project for Individual Assignment 2. I created this web application using React for the frontend, Express.js for the backend, and PostgreSQL for the database.

The purpose of this system is to help a library manage its books, users, and book availability. It also allows users to borrow books and keeps a record of transactions.

This project is an improved version of my previous library management system. The main difference is that this version uses a database instead of local storage.

## Technologies Used

- **React.js** – Used to create the user interface.
- **CSS** – Used for styling the application.
- **React Router** – Used for navigation between pages.
- **React Hooks** – Used for managing data and updating components.
- **Node.js and Express.js** – Used to create the backend API.
- **PostgreSQL** – Used to store books, users, and transactions.
- **Fetch API** – Used to communicate between the frontend and backend.

## Features

### 1. Dashboard
The dashboard displays information about the library, including:
- Total number of books
- Total available copies
- Total users
- Books with low stock
- Search functionality to find books

### 2. Book Management
The system allows an administrator to:
- Add new books
- Update book information
- Delete books
- View all available books

Each book contains a title, author, genre, ISBN, and quantity.

### 3. User Management
The system allows an administrator to:
- Add new users
- Update user details
- Delete users
- View registered users

Users can also log in using their membership ID and password.

### 4. Transactions
The transactions page allows users to:
- Borrow books
- Add new stock
- View transaction history

When a book is borrowed, its available quantity decreases. When stock is added, the quantity increases.

### 5. Database
I used PostgreSQL to store the information.

The database contains three main tables:
- `books` – Stores book information.
- `users` – Stores registered users.
- `transactions` – Stores borrowing and stock transactions.

## Project Structure

```text
library-system/
├── backend/
│   ├── routes/
│   ├── db.js
│   ├── schema.sql
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── index.html
│   └── package.json
│
└── README.md
```

## How to Run the Project

### Step 1: Set Up the Database

1. Open pgAdmin 4.
2. Create a PostgreSQL database called `library_db`.
3. Open the Query Tool.
4. Run the SQL code from `backend/schema.sql`.

### Step 2: Start the Backend

Open a terminal in the backend folder and run:

```bash
npm install
npm run dev
```

Before starting the backend, create a `.env` file using `.env.example` and enter your PostgreSQL connection details.

The backend runs at:

`http://localhost:5000`

### Step 3: Start the Frontend

Open another terminal in the frontend folder and run:

```bash
npm install
npm run dev
```

The frontend runs at:

`http://localhost:5173`

## React Concepts Used

In this assignment, I used:

- `useState` to manage information entered in forms and displayed on pages.
- `useEffect` to load information from the backend.
- Reusable React components for forms, navigation, and tables.
- React Router to navigate between the different pages.
- Controlled forms with validation for user input.
- Fetch API to send and receive data from the Express backend.

## Testing

I tested the main functions of the system, including:

- Adding, updating, and deleting books.
- Adding, updating, and deleting users.
- Borrowing books and checking whether the quantity decreases.
- Adding stock and checking whether the quantity increases.
- Checking transaction history.
- Checking whether information is saved in PostgreSQL.
- Checking whether the dashboard updates after changes.

The functions I tested were working correctly.

## Conclusion

This assignment helped me understand how the frontend, backend, and database work together in a full-stack application.

I used React to create the interface, Express.js to handle requests, and PostgreSQL to store the information. I also used the Fetch API to connect the frontend to the backend.

The system allows the library to manage books, users, and transactions in one application.