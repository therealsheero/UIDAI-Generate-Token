const db = require("./db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS daily_slots (
      date TEXT PRIMARY KEY,
      appointment_total INTEGER,
      appointment_booked INTEGER DEFAULT 0,
      walkin_total INTEGER,
      walkin_booked INTEGER DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT,
      name TEXT,
      mobile TEXT,
      aadhaar_last4 TEXT,
      age INTEGER,
      gender TEXT,
      divyang TEXT,
      district TEXT,
      service_type TEXT,
      qrc TEXT UNIQUE,
      date TEXT,
      mode TEXT,
      priority TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS daily_token_counters (
      date TEXT PRIMARY KEY,
      priority_count INTEGER DEFAULT 0,
      normal_count INTEGER DEFAULT 0,
      wp_count INTEGER DEFAULT 0,
      wn_count INTEGER DEFAULT 0,
      ap_count INTEGER DEFAULT 0,
      an_count INTEGER DEFAULT 0
    )
  `);
  db.run(`
  CREATE TABLE IF NOT EXISTS otp_verifications (
    mobile TEXT PRIMARY KEY,
    otp TEXT,
    expires_at INTEGER,
    attempts INTEGER DEFAULT 0,
    verified INTEGER DEFAULT 0
  )
`);


  console.log("Tables initialized correctly");
});
