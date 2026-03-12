const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "..", "data.db");
let db;

async function initDb() {
  const SQL = await initSqlJs();

  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run("PRAGMA journal_mode = WAL;");
  db.run("PRAGMA foreign_keys = ON;");

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    display_name TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS flights (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    user_email TEXT NOT NULL,
    airline TEXT,
    airline_code TEXT,
    flight_number TEXT,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    departure_date TEXT NOT NULL,
    return_date TEXT,
    fare_class TEXT,
    price_paid REAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    booking_ref TEXT,
    passengers INTEGER DEFAULT 1,
    status TEXT DEFAULT 'active',
    raw_email TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS price_checks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flight_id TEXT NOT NULL,
    current_price REAL,
    source TEXT DEFAULT 'amadeus',
    checked_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flight_id TEXT NOT NULL,
    price_paid REAL NOT NULL,
    price_found REAL NOT NULL,
    savings REAL NOT NULL,
    sent_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS claims (
    id TEXT PRIMARY KEY,
    flight_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    airline_code TEXT,
    price_paid REAL NOT NULL,
    price_found REAL NOT NULL,
    savings REAL NOT NULL,
    status TEXT DEFAULT 'detected',
    claim_method TEXT,
    claim_ref TEXT,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  // Migration: add user_id to flights if missing (existing installs)
  try {
    const cols = db.exec("PRAGMA table_info(flights)");
    if (cols.length > 0) {
      const hasUserId = cols[0].values.some((row) => row[1] === "user_id");
      if (!hasUserId) {
        db.run("ALTER TABLE flights ADD COLUMN user_id TEXT REFERENCES users(id)");
      }
    }
  } catch (e) {
    // Column already exists or fresh install
  }

  db.run("CREATE INDEX IF NOT EXISTS idx_flights_user_id ON flights(user_id)");

  saveToDisk();
  return db;
}

function saveToDisk() {
  if (!db) return;
  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

function getDb() {
  return db;
}

function run(sql, params = []) {
  db.run(sql, params);
  saveToDisk();
}

function getOne(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  let row = null;
  if (stmt.step()) {
    row = stmt.getAsObject();
  }
  stmt.free();
  return row;
}

function getAll(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

module.exports = { initDb, getDb, run, getOne, getAll, saveToDisk };
