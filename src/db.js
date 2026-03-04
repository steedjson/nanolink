const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./nanolink.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    short_code TEXT UNIQUE NOT NULL,
    long_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    click_count INTEGER DEFAULT 0
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    short_code TEXT,
    referer TEXT,
    ip TEXT,
    geo_location TEXT,
    visited_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

module.exports = db;
