-- Library Management System schema (PostgreSQL)
--
-- 1) Create the database once (in a terminal):
--        createdb -U postgres library_db
--    (or in psql:  CREATE DATABASE library_db;)
-- 2) Create the tables:
--        psql -U postgres -d library_db -f schema.sql

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  membership_id VARCHAR(50)  NOT NULL UNIQUE,
  role          VARCHAR(10)  NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS books (
  id         SERIAL PRIMARY KEY,
  title      VARCHAR(200) NOT NULL,
  author     VARCHAR(150) NOT NULL,
  genre      VARCHAR(80)  NOT NULL,
  isbn       VARCHAR(30)  NOT NULL UNIQUE,
  quantity   INTEGER      NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Transaction history. book_title is a snapshot so the log stays readable
-- even if the book or user is later deleted.
CREATE TABLE IF NOT EXISTS transactions (
  id         SERIAL PRIMARY KEY,
  book_id    INTEGER REFERENCES books(id) ON DELETE SET NULL,
  user_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
  book_title VARCHAR(200) NOT NULL,
  user_name  VARCHAR(100),
  type       VARCHAR(10)  NOT NULL CHECK (type IN ('ADD_STOCK', 'BORROW')),
  quantity   INTEGER      NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
