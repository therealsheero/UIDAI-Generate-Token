const db = require("../models/db");
const {
  DEFAULT_APPOINTMENT_SLOTS,
  DEFAULT_WALKIN_SLOTS
} = require("../utils/constants");

//function ensureDayRow(date) {
//  return new Promise((resolve, reject) => {
//    db.run(
//      `
//      INSERT INTO daily_slots
//      (
//        date,
//        appointment_total,
//        appointment_booked,
//        walkin_total,
//        walkin_booked
//      )
//      VALUES (?, ?, 0, ?, 0)
//      ON CONFLICT(date) DO UPDATE SET
//        appointment_total = excluded.appointment_total,
//        walkin_total = excluded.walkin_total
//      `,
//      [date, DEFAULT_APPOINTMENT_SLOTS, DEFAULT_WALKIN_SLOTS],
//      err => (err ? reject(err) : resolve())
//    );
//  });
//}

function ensureDayRow(date) {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO daily_slots
      (
        date,
        appointment_total,
        appointment_booked,
        walkin_total,
        walkin_booked
      )
      VALUES (?, ?, 0, ?, 0)
      ON CONFLICT(date) DO NOTHING
      `,
      [date, DEFAULT_APPOINTMENT_SLOTS, DEFAULT_WALKIN_SLOTS],
      err => (err ? reject(err) : resolve())
    );
  });
}
  
//async function reserveSlot(date, mode) {
//  await ensureDayRow(date);
//
//  return new Promise((resolve, reject) => {
//    const bookedCol =
//      mode === "A" ? "appointment_booked" : "walkin_booked";
//    const totalCol =
//      mode === "A" ? "appointment_total" : "walkin_total";
//
//    db.get(
//      `
//      SELECT ${bookedCol}, ${totalCol}
//      FROM daily_slots
//      WHERE date = ?
//      `,
//      [date],
//      (err, row) => {
//        if (err || !row) {
//          return reject(new Error("Invalid date"));
//        }
//
//        if (row[bookedCol] >= row[totalCol]) {
//          return reject(new Error("No slots available"));
//        }
//
//        db.run(
//          `
//          UPDATE daily_slots
//          SET ${bookedCol} = ${bookedCol} + 1
//          WHERE date = ?
//          `,
//          [date],
//          err => {
//            if (err) reject(err);
//            else resolve();
//          }
//        );
//      }
//    );
//  });
//}
async function reserveSlot(date, mode) {
  await ensureDayRow(date);

  return new Promise((resolve, reject) => {

    const bookedCol =
      mode === "A" ? "appointment_booked" : "walkin_booked";

    const totalCol =
      mode === "A" ? "appointment_total" : "walkin_total";

    const sql = `
      UPDATE daily_slots
      SET ${bookedCol} = ${bookedCol} + 1
      WHERE date = ?
      AND ${bookedCol} < ${totalCol}
    `;

    db.run(sql, [date], function (err) {

      if (err) {
        return reject(err);
      }

      // If no row updated ? slots already full
      if (this.changes === 0) {
        return reject(new Error("No slots available"));
      }

      resolve();
    });
  });
}
module.exports = {
  reserveSlot
};
