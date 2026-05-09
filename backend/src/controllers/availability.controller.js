const db = require("../models/db");
const {
  DEFAULT_APPOINTMENT_SLOTS,
  DEFAULT_WALKIN_SLOTS
} = require("../utils/constants");
function ensureDateRange(startDate, days) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
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
    `);

    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];

      stmt.run(
        dateStr,
        DEFAULT_APPOINTMENT_SLOTS,
        DEFAULT_WALKIN_SLOTS
      );
    }

    stmt.finalize(err => (err ? reject(err) : resolve()));
  });
}
//exports.getAvailability = async (req, res) => {
//  try {
//    const disableToday = req.query.disableToday === "true";
//    const daysAhead = 30;
//
//    const start = new Date();
//    if (disableToday) {
//      start.setDate(start.getDate() + 1);
//    }
//
//    const startDateStr = start.toISOString().split("T")[0];
//
//    await ensureDateRange(start, daysAhead);
//
//    db.all(
//      `
//      SELECT
//        date,
//        appointment_total,
//        appointment_booked
//      FROM daily_slots
//      WHERE date >= ?
//      ORDER BY date ASC
//      LIMIT ?
//      `,
//      [startDateStr, daysAhead],
//      (err, rows) => {
//        if (err) {
//          console.error(err);
//          return res.status(500).json({ message: "DB error" });
//        }
//
//        const result = rows.map(r => {
//          const d = new Date(r.date);
//          const day = d.getDay();
//          const isHoliday = day === 0 || day === 6;
//
//          const available = isHoliday
//            ? 0
//            : r.appointment_total - r.appointment_booked;
//
//          return {
//            date: r.date,
//            appointment_total: r.appointment_total,
//            appointment_booked: r.appointment_booked,
//            available_slots: available,
//            status: isHoliday
//              ? "HOLIDAY"
//              : available <= 0
//              ? "FULL"
//              : "AVAILABLE"
//          };
//        });
//
//        res.json(result);
//      }
//    );
//  } catch (e) {
//    console.error(e);
//    res.status(500).json({ message: "Availability error" });
//  }
//};
exports.getAvailability = async (req, res) => {
  try {
    const disableToday = req.query.disableToday === "true";
    const daysAhead = 30;

    const start = new Date();
    if (disableToday) start.setDate(start.getDate() + 1);

    const startDateStr = start.toISOString().split("T")[0];

    // ensure 30 days exist
    await ensureDateRange(start, daysAhead);
        db.all(
      `
        SELECT
          d.date,
          d.appointment_total,
          d.appointment_booked,
          h.reason AS holiday_reason
        FROM daily_slots d
        LEFT JOIN holidays h ON h.date = d.date
        WHERE d.date >= ?
        ORDER BY d.date ASC
        `,
        [startDateStr],
        (err, rows) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "DB error" });
          }
      
          const workingDays = [];
      
          for (let r of rows) {
            const dateObj = new Date(r.date);
            const day = dateObj.getDay();
      
            const isWeekend = day === 0 || day === 6;
            const isGazettedHoliday = !!r.holiday_reason;
            const isHoliday = isWeekend || isGazettedHoliday;
      
            if (isHoliday) continue;   // 🔥 Skip holidays completely
      
            const available =
              r.appointment_total - r.appointment_booked;
      
            workingDays.push({
              date: r.date,
              appointment_total: r.appointment_total,
              appointment_booked: r.appointment_booked,
              available_slots: available,
              status: available <= 0 ? "FULL" : "AVAILABLE",
              holiday_reason: null
            });
      
            if (workingDays.length === 7) break;  // 🔥 Stop at 15 working days
          }
      
          res.json(workingDays);
        }
      );


//    db.all(
//      `
//      SELECT
//        d.date,
//        d.appointment_total,
//        d.appointment_booked,
//        h.reason AS holiday_reason
//      FROM daily_slots d
//      LEFT JOIN holidays h ON h.date = d.date
//      WHERE d.date >= ?
//      ORDER BY d.date ASC
//      LIMIT ?
//      `,
//      [startDateStr, daysAhead],
//      (err, rows) => {
//        if (err) {
//          console.error(err);
//          return res.status(500).json({ message: "DB error" });
//        }
//
//        const result = rows.map(r => {
//          const dateObj = new Date(r.date);
//          const day = dateObj.getDay();
//
//          const isWeekend = day === 0 || day === 6;
//          const isGazettedHoliday = !!r.holiday_reason;
//          const isHoliday = isWeekend || isGazettedHoliday;
//
//          const available = isHoliday
//            ? 0
//            : r.appointment_total - r.appointment_booked;
//
//          return {
//            date: r.date,
//            appointment_total: r.appointment_total,
//            appointment_booked: r.appointment_booked,
//            available_slots: available,
//            status: isHoliday
//              ? "HOLIDAY"
//              : available <= 0
//              ? "FULL"
//              : "AVAILABLE",
//            holiday_reason: r.holiday_reason || null
//          };
//        });
//
//        res.json(result);
//      }
//    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Availability error" });
  }
}


// ================================
// 🚶 WALK-IN AVAILABILITY
// ================================
//exports.getWalkinAvailability = (req, res) => {
//  const today = new Date().toISOString().split("T")[0];
//
//  db.get(
//    `
//    SELECT walkin_total, walkin_booked
//    FROM daily_slots
//    WHERE date = ?
//    `,
//    [today],
//    (err, row) => {
//      if (err || !row) {
//        return res.status(500).json({ message: "DB error" });
//      }
//
//      const available = Math.max(
//        row.walkin_total - row.walkin_booked,
//        0
//      );
//
//      res.json({
//        date: today,
//        total_slots: row.walkin_total,
//        used_slots: row.walkin_booked,
//        available_slots: available
//      });
//    }
//  );
//};


// 2nd approach


//exports.getWalkinAvailability = (req, res) => {
//
//  const now = new Date();
//  const ist = new Date(
//    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
//  );
//
//  const hour = ist.getHours();
//
//  const today = ist.toISOString().split("T")[0];
//
//  db.get(
//    `
//    SELECT
//      appointment_total,
//      appointment_booked,
//      walkin_total,
//      walkin_booked
//    FROM daily_slots
//    WHERE date = ?
//    `,
//    [today],
//    (err, row) => {
//
//      if (err || !row) {
//        return res.status(500).json({ message: "DB error" });
//      }
//
//      let effectiveWalkinTotal = row.walkin_total;
//      if (hour > 6) {
//
//        const remainingAppointments =
//          row.appointment_total - row.appointment_booked;
//
//        effectiveWalkinTotal =
//          row.walkin_total + Math.max(remainingAppointments, 0);
//      }
//
//      const available = Math.max(
//        effectiveWalkinTotal - row.walkin_booked,
//        0
//      );
//
//      res.json({
//        date: today,
//        total_slots: effectiveWalkinTotal,
//        used_slots: row.walkin_booked,
//        available_slots: available
//      });
//    }
//  );
//};


// maybe the final approach

exports.getWalkinAvailability = (req, res) => {

  const now = new Date();
  const ist = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  const hour = ist.getHours();
  const today = ist.toISOString().split("T")[0];

  db.get(
    `
    SELECT
      appointment_total,
      appointment_booked,
      walkin_total,
      walkin_booked,
      carry_forward_done
    FROM daily_slots
    WHERE date = ?
    `,
    [today],
    (err, row) => {

      if (err || !row) {
        return res.status(500).json({ message: "DB error" });
      }

      // 🔹 After 6 AM move remaining appointment slots to walk-in (ONLY ONCE)
//      if (hour >= 6 && row.appointment_total > row.appointment_booked) {
//
//        const remaining =
//          row.appointment_total - row.appointment_booked;
//
//        db.run(
//          `
//          UPDATE daily_slots
//          SET
//            walkin_total = walkin_total + ?,
//            appointment_total = appointment_booked
//          WHERE date = ?
//          `,
//          [remaining, today]
//        );
//
//        // update local values so response is correct
//        row.walkin_total += remaining;
//        row.appointment_total = row.appointment_booked;
//      }
        if (hour >= 6 && !row.carry_forward_done) {
        
          const remaining =
            row.appointment_total - row.appointment_booked;
        
          const carryForward = Math.min(
            Math.max(remaining, 0),
            20
          );
        
          db.run(`
            UPDATE daily_slots
            SET
              walkin_total = walkin_total + ?,
              appointment_total = appointment_booked,
              carry_forward_done = 1
            WHERE date = ?
          `, [carryForward, today]);
        
          // reflect immediately in response
          row.walkin_total += carryForward;
          row.appointment_total = row.appointment_booked;
        }
      const available = Math.max(
        row.walkin_total - row.walkin_booked,
        0
      );

      res.json({
        date: today,
        total_slots: row.walkin_total,
        used_slots: row.walkin_booked,
        available_slots: available
      });
    }
  );
};
