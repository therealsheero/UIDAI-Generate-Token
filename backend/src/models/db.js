const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "appointments.db");
console.log("Using DB at:", dbPath);
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database connection failed", err);
  } else {
    console.log("SQLite database connected");
  }
});
module.exports = db;
