const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const dbPath = path.join(__dirname, 'kisan_procurement.db');
const db = new DatabaseSync(dbPath);

// Enable WAL mode & foreign keys
db.exec('PRAGMA journal_mode = WAL;');

function initDatabase() {
  // Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL DEFAULT 'FARMER',
      district TEXT,
      state TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Centres Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS centres (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      district TEXT NOT NULL,
      state TEXT NOT NULL,
      capacity_qtl INTEGER NOT NULL DEFAULT 500
    );
  `);

  // Crops Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS crops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      msp_rate_per_qtl REAL NOT NULL
    );
  `);

  // Slots Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS slots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      centre_id INTEGER NOT NULL,
      slot_date TEXT NOT NULL,
      time_window TEXT NOT NULL,
      max_capacity INTEGER NOT NULL DEFAULT 30,
      booked_count INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (centre_id) REFERENCES centres(id)
    );
  `);

  // Bookings Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      farmer_id INTEGER NOT NULL,
      farmer_name TEXT NOT NULL,
      farmer_phone TEXT NOT NULL,
      centre_id INTEGER NOT NULL,
      centre_name TEXT NOT NULL,
      crop_id INTEGER NOT NULL,
      crop_name TEXT NOT NULL,
      msp_rate REAL NOT NULL,
      slot_id INTEGER NOT NULL,
      booking_date TEXT NOT NULL,
      time_window TEXT NOT NULL,
      estimated_qtl REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'BOOKED',
      token_number TEXT,
      arrived_at DATETIME,
      quality_checked_at DATETIME,
      weighed_at DATETIME,
      completed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (farmer_id) REFERENCES users(id),
      FOREIGN KEY (centre_id) REFERENCES centres(id),
      FOREIGN KEY (crop_id) REFERENCES crops(id),
      FOREIGN KEY (slot_id) REFERENCES slots(id)
    );
  `);

  // Quality Inspections Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS quality_inspections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id TEXT NOT NULL,
      moisture_pct REAL NOT NULL,
      foreign_matter_pct REAL NOT NULL,
      grade TEXT NOT NULL,
      status TEXT NOT NULL,
      notes TEXT,
      inspected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (booking_id) REFERENCES bookings(id)
    );
  `);

  // Weighments Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS weighments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id TEXT NOT NULL,
      gross_weight_kg REAL NOT NULL,
      tare_weight_kg REAL NOT NULL,
      net_weight_kg REAL NOT NULL,
      net_weight_qtl REAL NOT NULL,
      weighed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (booking_id) REFERENCES bookings(id)
    );
  `);

  // Payments Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id TEXT NOT NULL,
      total_qtl REAL NOT NULL,
      msp_rate REAL NOT NULL,
      gross_amount REAL NOT NULL,
      net_amount REAL NOT NULL,
      bank_ref TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PROCESSED',
      processed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (booking_id) REFERENCES bookings(id)
    );
  `);

  console.log('Database initialized successfully.');
}

initDatabase();

module.exports = db;
