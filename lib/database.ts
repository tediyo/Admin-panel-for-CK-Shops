import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'admin.db');

// Ensure data directory exists
import fs from 'fs';
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  -- Users table for admin authentication
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Home section content
  CREATE TABLE IF NOT EXISTS home_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section TEXT NOT NULL,
    field TEXT NOT NULL,
    value TEXT NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(section, field)
  );

  -- Highlight cards
  CREATE TABLE IF NOT EXISTS highlight_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    price TEXT,
    badge TEXT,
    is_popular BOOLEAN DEFAULT 0,
    is_seasonal BOOLEAN DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Coffee history timeline
  CREATE TABLE IF NOT EXISTS coffee_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Coffee fun facts
  CREATE TABLE IF NOT EXISTS coffee_facts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fact TEXT NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Display settings
  CREATE TABLE IF NOT EXISTS display_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Menu items
  CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    rating REAL DEFAULT 0,
    image_url TEXT,
    is_popular BOOLEAN DEFAULT 0,
    is_new BOOLEAN DEFAULT 0,
    prep_time INTEGER,
    calories INTEGER,
    is_vegan BOOLEAN DEFAULT 0,
    is_gluten_free BOOLEAN DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Branches/Locations
  CREATE TABLE IF NOT EXISTS branches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    hours TEXT,
    latitude REAL,
    longitude REAL,
    is_active BOOLEAN DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insert default admin user (password: admin123)
const bcrypt = require('bcryptjs');
const defaultPassword = bcrypt.hashSync('admin123', 10);

db.exec(`
  INSERT OR IGNORE INTO users (username, email, password_hash) 
  VALUES ('admin', 'admin@coffeeshop.com', '${defaultPassword}');
`);

// Insert default display settings
db.exec(`
  INSERT OR IGNORE INTO display_settings (setting_key, setting_value, description) VALUES
  ('show_clocks', 'true', 'Show interactive clocks on home page'),
  ('show_highlights', 'true', 'Show highlight cards section'),
  ('show_history', 'true', 'Show coffee history timeline'),
  ('show_facts', 'true', 'Show coffee fun facts'),
  ('show_hero_animation', 'true', 'Show hero section animations');
`);

// Insert default home content
db.exec(`
  INSERT OR IGNORE INTO home_content (section, field, value) VALUES
  ('hero', 'welcome_text', 'Served with Love'),
  ('hero', 'main_heading', 'Experience the perfect blend of tradition and innovation in every cup. From farm-fresh beans to expertly crafted beverages, we bring you the finest coffee experience.'),
  ('hero', 'rating', '4.9/5 from 500+ customers'),
  ('hero', 'rating_subtitle', 'Loved by many'),
  ('hero', 'primary_button_text', 'Order Now'),
  ('hero', 'secondary_button_text', 'View Menu');
`);

export default db;
