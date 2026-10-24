-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Authors table
CREATE TABLE IF NOT EXISTS authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(100) DEFAULT 'Author',
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Affirmations table
CREATE TABLE IF NOT EXISTS affirmations (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  author_id INTEGER REFERENCES authors(id) ON DELETE SET NULL,
  cover_image TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table for CMS authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_affirmations_slug ON affirmations(slug);
CREATE INDEX IF NOT EXISTS idx_affirmations_category ON affirmations(category_id);
CREATE INDEX IF NOT EXISTS idx_affirmations_published ON affirmations(is_published);
CREATE INDEX IF NOT EXISTS idx_affirmations_created ON affirmations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
