const db = require("../models/db");
const { GUARD_USERNAME, GUARD_PASSWORD, GUARD2_USERNAME, GUARD2_PASSWORD, GUARD3_USERNAME, GUARD3_PASSWORD } =
  require("../utils/guard.config");
const { GUARD_TOKEN,  GUARD2_TOKEN ,GUARD3_TOKEN} = require("../utils/guard.config");


exports.guardLogin = (req, res) => {

  const { username, password } = req.body;

  // GUARD 1
  if (
    username === GUARD_USERNAME &&
    password === GUARD_PASSWORD
  ) {

    return res.json({
      success: true,
      token: "GUARD_SESSION",
      page: "guard.html"
    });
  }

  // GUARD 2
  if (
    username === GUARD2_USERNAME &&
    password === GUARD2_PASSWORD
  ) {

    return res.json({
      success: true,
      token: "GUARD2_SESSION",
      page: "guard2.html"
    });
  }

  // GUARD 3
  if (
    username === GUARD3_USERNAME &&
    password === GUARD3_PASSWORD
  ) {

    return res.json({
      success: true,
      token: "GUARD3_SESSION",
      page: "guard3.html"
    });
  }

  res.status(401).json({
    message: "Invalid credentials"
  });
};
// exports.guardLogin = (req, res) => {
//   const { username, password } = req.body;

//   if (
//     username === GUARD_USERNAME &&
//     password === GUARD_PASSWORD
//   ) {
//     return res.json({
//       success: true,
//       token: "GUARD_SESSION"
//     });
//   }

//   res.status(401).json({ message: "Invalid credentials" });
// };
// exports.guard2Login = (req, res) => {

//   const { username, password } = req.body;

//   if (
//     username === GUARD2_USERNAME &&
//     password === GUARD2_PASSWORD
//   ) {

//     return res.json({
//       success: true,
//       token: "GUARD2_SESSION"
//     });
//   }

//   res.status(401).json({
//     message: "Invalid credentials"
//   });
// };
// exports.guard3Login = (req, res) => {

//   const { username, password } = req.body;

//   if (
//     username === GUARD3_USERNAME &&
//     password === GUARD3_PASSWORD
//   ) {

//     return res.json({
//       success: true,
//       token: "GUARD3_SESSION"
//     });
//   }

//   res.status(401).json({
//     message: "Invalid credentials"
//   });
// };
// exports.addPhysicalReferenceEntry = (req, res) => {

//   const {
//     name,
//     age,
//     mobile,
//     aadhaar_last4,
//     gender,
//     district,
//     service_type,
//     token_type
//   } = req.body;

//   db.run(
//     `
//     INSERT INTO physical_reference_entries (

//       name,
//       age,
//       mobile,
//       aadhaar_last4,
//       gender,
//       district,
//       service_type,
//       token_type

//     )
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//     `,
//     [
//       name,
//       age,
//       mobile,
//       aadhaar_last4,
//       gender,
//       district,
//       service_type,
//       token_type
//     ],
//     err => {

//       if (err) {
//         return res.status(500).json({
//           message: "DB error"
//         });
//       }

//       res.json({
//         success: true
//       });
//     }
//   );
// };
exports.addPhysicalReferenceEntry = (req, res) => {

  const {
    name,
    age,
    mobile,
    aadhaar_last4,
    gender,
    district,
    service_type,
    reference_of,
    token_type
  } = req.body;

  const today = new Date()
    .toISOString()
    .split("T")[0];

  db.get(
    `
    SELECT COUNT(*) AS count
    FROM physical_reference_entries
    WHERE date(created_at) = ?
    `,
    [today],
    (err, row) => {

      if (err) {
        return res.status(500).json({
          message: "DB error"
        });
      }

      const nextSeq = row.count + 1;

      const seq =
        String(nextSeq).padStart(3, "0");

      const typeCode =
        token_type === "Reference"
          ? "RT"
          : "PT";

      const token =
        `${seq}-${typeCode}-${aadhaar_last4}`;

      db.run(
        `
        INSERT INTO physical_reference_entries (

          token,
          name,
          age,
          mobile,
          aadhaar_last4,
          gender,
          district,
          service_type,
          reference_of,
          token_type

        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          token,
          name,
          age,
          mobile,
          aadhaar_last4,
          gender,
          district,
          service_type,
          reference_of,
          token_type
        ],
        err => {

          if (err) {
            return res.status(500).json({
              message: "DB error"
            });
          }

          res.json({
            success: true,
            token
          });
        }
      );
    }
  );
};
exports.getTodayPhysicalReferenceEntries = (req, res) => {

  const today = new Date()
    .toISOString()
    .split("T")[0];

  db.all(
    `
    SELECT *
    FROM physical_reference_entries
    WHERE date(created_at) = ?
    `,
    [today],
    (err, rows) => {

      if (err) {
        return res.status(500).json({
          message: "DB error"
        });
      }

      res.json(rows);
    }
  );
};
exports.getTokensPerHourToday = (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  db.get(
    `SELECT tokens_per_hour FROM daily_token_counters WHERE date = ?`,
    [today],
    (err, row) => {
      if (err) return res.status(500).json({ message: "DB error" });

      res.json({
        tokensPerHour: row?.tokens_per_hour || 40
      });
    }
  );
};
exports.getTokensPerHourToday2 = (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  db.get(
    `SELECT tokens_per_hour FROM daily_token_counters WHERE date = ?`,
    [today],
    (err, row) => {
      if (err) return res.status(500).json({ message: "DB error" });

      res.json({
        tokensPerHour: row?.tokens_per_hour || 40
      });
    }
  );
};
// TODAY TOKENS ONLY
exports.undoEntry = (req, res) => {
  const { token_id } = req.body;

  db.run(
    `
    UPDATE tokens
    SET entry_marked = 0,
        entry_time = NULL
    WHERE id = ?
      AND entry_marked = 1
      AND datetime(entry_time) >= datetime('now','localtime','-10 minutes')
    `,
    [token_id],
    function(err) {

      if (err) {
        return res.status(500).json({ message: "DB error" });
      }

      if (this.changes === 0) {
        return res.status(403).json({
          message: "Undo window expired"
        });
      }

      res.json({ success: true });
    }
  );
};
exports.markEntry = (req, res) => {
  const { token_id } = req.body;

  db.run(
    `
    UPDATE tokens
    SET entry_marked = 1,
        entry_time = datetime('now', 'localtime')
    WHERE id = ?
    `,
    [token_id],
    err => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json({ success: true });
    }
  );
};
exports.getEntryTokens = (req, res) => {

  const today = new Date().toISOString().split("T")[0];

  db.all(
    `
    SELECT *
    FROM tokens
    WHERE date = ?
    AND (
      entry_marked = 0
      OR (
        entry_marked = 1
        AND datetime(entry_time) >= datetime('now','localtime','-10 minutes')
      )
    )
    ORDER BY created_at ASC
    `,
    [today],
    (err, rows) => {

      if (err) {
        return res.status(500).json({
          message: "DB error"
        });
      }

      res.json(rows);
    }
  );
};
exports.getServiceTokens = (req, res) => {

  const today = new Date().toISOString().split("T")[0];

  db.all(
    `
    SELECT *
    FROM tokens
    WHERE date = ?
    AND entry_marked = 1
    AND (
      visited = 0
      OR (
        visited = 1
        AND datetime(visited_at) >= datetime('now','localtime','-10 minutes')
      )
    )
    ORDER BY created_at ASC
    `,
    [today],
    (err, rows) => {

      if (err) {
        return res.status(500).json({
          message: "DB error"
        });
      }

      res.json(rows);
    }
  );
};






// exports.getTodayTokens = (req, res) => {
//   const today = new Date().toISOString().split("T")[0];

  // db.all(
  //   `
  //   SELECT *
  //   FROM tokens
  //   WHERE date = ?
  //   AND (
  //     visited = 0
  //     OR (visited = 1 AND datetime(visited_at) >= datetime('now', '-10 minutes'))
  //   )
  //   ORDER BY created_at ASC
  //   `,
//   db.all(
//     `
//     SELECT *
//     FROM tokens
//     WHERE date = ?
//       AND (
//   entry_marked = 0
//   OR (entry_marked = 1 AND visited = 0)
//   OR (visited = 1 AND datetime(visited_at) >= datetime('now', 'localtime','-1 minutes'))
// )
//     ORDER BY created_at ASC
//     `,
//     [today],
//     (err, rows) => {
//       if (err) return res.status(500).json({ message: "DB error" });
//       res.json(rows);
//     }
//   );
// };
exports.markVisited = (req, res) => {
  const { token_id } = req.body;

  db.run(
    `
    UPDATE tokens
    SET visited = 1,
        visited_at = datetime('now', 'localtime')
    WHERE id = ?
    `,
    [token_id],
    err => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json({ success: true });
    }
  );
};
exports.undoVisited = (req, res) => {
  const { token_id } = req.body;

  db.run(
    `
    UPDATE tokens
    SET visited = 0,
        visited_at = NULL
    WHERE id = ?
      AND visited = 1
      AND datetime(visited_at) >= datetime('now', 'localtime','-1 minutes')
    `,
    [token_id],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "DB error" });
      }

      if (this.changes === 0) {
        return res.status(403).json({
          message: "Undo window expired"
        });
      }

      res.json({ success: true });
    }
  );
};


