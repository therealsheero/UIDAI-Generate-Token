const db = require("../models/db");
const { ADMIN_USERNAME, ADMIN_PASSWORD } =
  require("../utils/admin.config");
const { ADMIN_TOKEN } = require("../utils/admin.config");
const MASTER_SERVICES = [
  "DoB",
  "Name",
  "Aadhaar Suspended",
  "Advised to visit RO",
  "Gender",
  "None of the above",
  "Lost Aadhaar",
  "Biometric Issue"
];
// exports.getTodaySummary = (req, res) => {
//   const today = new Date().toISOString().split("T")[0];

//   db.all(
//     `
//     SELECT
//       mode,
//       COUNT(*) AS total,
//       SUM(CASE WHEN visited = 1 THEN 1 ELSE 0 END) AS visited,
//       SUM(CASE WHEN visited = 0 THEN 1 ELSE 0 END) AS pending
//     FROM tokens
//     WHERE date = ?
//     GROUP BY mode
//     `,
//     [today],
//     (err, rows) => {
//       if (err) return res.status(500).json({ message: "DB error" });
//       res.json(rows);
//     }
//   );
// };

exports.getTodayPhysicalReferenceEntries =
  (req, res) => {

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
exports.getPrioritySettings = (req, res) => {

  db.all("SELECT * FROM priority_rules", (err, rules) => {

    if (err) return res.status(500).json({message:"DB error"});

    db.all("SELECT district FROM priority_districts", (err2, districts) => {

      if (err2) return res.status(500).json({message:"DB error"});

      res.json({
        rules,
        districts
      });

    });

  });

};

exports.updatePriorityRules = (req,res)=>{

  const {child_age_limit, senior_age_limit, female_priority_age} = req.body;

  const queries = [
    ["child_age_limit",child_age_limit],
    ["senior_age_limit",senior_age_limit],
    ["female_priority_age",female_priority_age]
  ];

  queries.forEach(q=>{
    db.run(
      `UPDATE priority_rules SET rule_value=? WHERE rule_key=?`,
      [q[1],q[0]]
    );
  });

  res.json({success:true});

};

exports.addPriorityDistrict = (req,res)=>{

  const {district} = req.body;

  db.run(
    `INSERT INTO priority_districts(district) VALUES(?)`,
    [district],
    err=>{
      if(err) return res.status(500).json({message:"DB error"});
      res.json({success:true});
    }
  );

};

exports.deletePriorityDistrict = (req,res)=>{

  const {district} = req.body;

  db.run(
    `DELETE FROM priority_districts WHERE district=?`,
    [district],
    err=>{
      if(err) return res.status(500).json({message:"DB error"});
      res.json({success:true});
    }
  );

};

exports.addHoliday = (req, res) => {
  const { date, reason} = req.body;

  if (!date) {
    return res.status(400).json({ message: "Date required" });
  }

  db.run(
    `INSERT OR REPLACE INTO holidays (date, reason)
     VALUES (?, ?)`,
    [date, reason || "Declared Holiday"],
    err => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json({ success: true });
    }
  );
};
exports.deleteHoliday = (req, res) => {
  const { date } = req.body;

  db.run(
    `DELETE FROM holidays WHERE date = ?`,
    [date],
    err => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json({ success: true });
    }
  );
};

exports.getHolidays = (req, res) => {

  const today = new Date().toISOString().split("T")[0];

  db.all(
    `
    SELECT *
    FROM holidays
    WHERE date >= ?
    ORDER BY date ASC
    LIMIT 3;
    `,
    [today],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json(rows);
    }
  );
};
// exports.getTokensByDate = (req, res) => {
//   const { date } = req.query;

//   if (!date) {
//     return res.status(400).json({ message: "Date required" });
//   }
//   const merged = [
//   ...tokenRows,
//   ...physicalRows
// ];
// merged.sort(
//   (a, b) =>
//     new Date(a.created_at) -
//     new Date(b.created_at)
// );
//   db.all(
//     `
//     SELECT
//       *,
//       substr(token, -6, 3) AS token_count,
//       substr(token, -2) AS token_type
//     FROM tokens
//     WHERE date = ?
//     ORDER BY id ASC

//     SELECT
//   id,
//   token,
//   name,
//   mobile,
//   gender,
//   age,
//   district,
//   service_type,
//   token_type,
//   reference_of,

//   created_at,
//   created_at AS entry_time,
//   created_at AS visited_at,

//   '-' AS expected_time,

//   'physical_reference' AS source_type

// FROM physical_reference_entries

// WHERE date(created_at, 'localtime') = ?
//     `,
//     [date],
//     (err, rows) => {
//       if (err) {
//         return res.status(500).json({ message: "DB error" });
//       }
//       res.json(rows);
//     }
//   );
// };
exports.getTokensByDate = (req, res) => {

  const { date } = req.query;

  if (!date) {
    return res.status(400).json({
      message: "Date required"
    });
  }

  db.all(
    `
    SELECT
      *,
      'normal' AS source_type
    FROM tokens
    WHERE date = ?
    `,
    [date],

    (err, tokenRows) => {

      if (err) {
        return res.status(500).json({
          message: "DB error"
        });
      }

      db.all(
        `
        SELECT
          id,
          token,
          substr(created_at,1,10) AS date,
          name,
          mobile,
          aadhaar_last4,
          gender,
          age,
          district,
          service_type,
          token_type,
          reference_of,

          created_at,

          created_at AS entry_time,
          created_at AS visited_at,

          'physical_reference' AS source_type

        FROM physical_reference_entries

        WHERE substr(created_at,1,10) = ?
        `,
        [date],

        (err2, physicalRows) => {

          if (err2) {
            return res.status(500).json({
              message: "DB error"
            });
          }


          const merged = [
            ...tokenRows,
            ...physicalRows
          ];


          // merged.sort(
          //   (a, b) =>
          //     new Date(a.created_at) -
          //     new Date(b.created_at)
          // );

          res.json(merged);

        }
      );

    }
  );

};

exports.adminLogin = (req, res) => {
  const { username, password } = req.body;

  if (
    username === ADMIN_USERNAME &&
    password === ADMIN_PASSWORD
  ) {
    return res.json({
      success: true,
      token: "ADMIN_SESSION"
    });
  }

  res.status(401).json({ message: "Invalid credentials" });
};


exports.getCalendarOverview = (req, res) => {
  const today = new Date();
  const start = new Date(today);
  const end = new Date(today);

  start.setDate(today.getDate() - 3);
  end.setDate(today.getDate() + 8);

  const startDate = start.toISOString().split("T")[0];
  const endDate = end.toISOString().split("T")[0];

  db.all(
    `
    SELECT
  ds.date,
  ds.appointment_booked,
  ds.appointment_total,
  ds.walkin_booked,
  ds.walkin_total,
  COALESCE(dtc.tokens_per_hour, 40) AS tokens_per_hour
FROM daily_slots ds
LEFT JOIN daily_token_counters dtc ON ds.date = dtc.date
LEFT JOIN holidays h ON ds.date = h.date
WHERE ds.date BETWEEN ? AND ?
AND h.date IS NULL
AND strftime('%w', ds.date) NOT IN ('0','6')
ORDER BY ds.date ASC

    `,
    [startDate, endDate],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
      }
      res.json(rows);
    }
  );
};



exports.updateTokensPerHour = (req, res) => {
  const { date, tokens_per_hour } = req.body;

  if (!date || !tokens_per_hour) {
    return res.status(400).json({ message: "Missing data" });
  }

  db.run(
    `
    INSERT INTO daily_token_counters (date, tokens_per_hour)
    VALUES (?, ?)
    ON CONFLICT(date)
    DO UPDATE SET tokens_per_hour = excluded.tokens_per_hour
    `,
    [date, tokens_per_hour],
    err => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json({ success: true });
    }
  );
};

exports.updateSlots = (req, res) => {
  const { date, appointment_total, walkin_total } = req.body;

  if (!date) {
    return res.status(400).json({ message: "Date required" });
  }

  db.run(
    `
    UPDATE daily_slots
    SET appointment_total = ?,
        walkin_total = ?,
        carry_forward_done = 0
    WHERE date = ?
    `,
    [appointment_total, walkin_total, date],
    err => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json({ success: true });
    }
  );
};
function formatHour(h) {
  const hour = h > 12 ? h - 12 : h;
  const ampm = h >= 12 ? "PM" : "AM";
  return `${hour} ${ampm}`;
}

exports.getDateDashboard = (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: "Date required" });
  }
  const summaryQuery = `
    SELECT
      mode,
      COUNT(*) AS total,
      SUM(CASE WHEN visited = 1 THEN 1 ELSE 0 END) AS visited,
      SUM(CASE WHEN visited = 0 THEN 1 ELSE 0 END) AS not_visited
    FROM tokens
    WHERE date = ?
    GROUP BY mode
  `;
  const genderQuery = `
  SELECT
    gender,
    COUNT(*) AS total,
    SUM(CASE WHEN visited = 1 THEN 1 ELSE 0 END) AS visited,
    SUM(CASE WHEN visited = 0 THEN 1 ELSE 0 END) AS not_visited
  FROM tokens
  WHERE date = ?
  GROUP BY gender
`;
  const ageQuery = `
  SELECT
    SUM(CASE WHEN age BETWEEN 0 AND 5 THEN 1 ELSE 0 END) AS age_0_5,
    SUM(CASE WHEN age BETWEEN 0 AND 5 AND visited = 1 THEN 1 ELSE 0 END) AS age_0_5_visited,
    SUM(CASE WHEN age BETWEEN 0 AND 5 AND visited = 0 THEN 1 ELSE 0 END) AS age_0_5_not,

    SUM(CASE WHEN age BETWEEN 6 AND 15 THEN 1 ELSE 0 END) AS age_6_15,
    SUM(CASE WHEN age BETWEEN 6 AND 15 AND visited = 1 THEN 1 ELSE 0 END) AS age_6_15_visited,
    SUM(CASE WHEN age BETWEEN 6 AND 15 AND visited = 0 THEN 1 ELSE 0 END) AS age_6_15_not,

    SUM(CASE WHEN age BETWEEN 16 AND 23 THEN 1 ELSE 0 END) AS age_16_23,
    SUM(CASE WHEN age BETWEEN 16 AND 23 AND visited = 1 THEN 1 ELSE 0 END) AS age_16_23_visited,
    SUM(CASE WHEN age BETWEEN 16 AND 23 AND visited = 0 THEN 1 ELSE 0 END) AS age_16_23_not,

    SUM(CASE WHEN age >= 24 THEN 1 ELSE 0 END) AS age_24_plus,
    SUM(CASE WHEN age >= 24 AND visited = 1 THEN 1 ELSE 0 END) AS age_24_plus_visited,
    SUM(CASE WHEN age >= 24 AND visited = 0 THEN 1 ELSE 0 END) AS age_24_plus_not
  FROM tokens
  WHERE date = ?
`;
  
const tokenTypeQuery = `

SELECT
  token_type,

  SUM(total) AS total,
  SUM(visited) AS visited,
  SUM(not_visited) AS not_visited

FROM (

  SELECT
    token_type,
    COUNT(*) AS total,

    SUM(
      CASE WHEN visited = 1
      THEN 1 ELSE 0 END
    ) AS visited,

    SUM(
      CASE WHEN visited = 0
      THEN 1 ELSE 0 END
    ) AS not_visited

  FROM tokens

  WHERE date = ?

  GROUP BY token_type

  UNION ALL

  SELECT
      CASE
    WHEN token_type = 'Reference'
      THEN 'RT'

    WHEN token_type = 'Physical Token'
      THEN 'PT'

    ELSE token_type
  END AS token_type,
    COUNT(*) AS total,

    COUNT(*) AS visited,

    0 AS not_visited

  FROM physical_reference_entries

  WHERE substr(created_at,1,10) = ?

  GROUP BY token_type

)

GROUP BY token_type

ORDER BY token_type

`;



  db.all(summaryQuery, [date], (err, summaryRows) => {
    if (err) return res.status(500).json({ message: "DB error" });

    db.all(genderQuery, [date], (err, genderRows) => {
      if (err) return res.status(500).json({ message: "DB error" });

      db.get(ageQuery, [date], (err, ageRow) => {
        if (err) return res.status(500).json({ message: "DB error" });

        db.all(serviceQuery, [date], (err, serviceRows) => {
          if (err) return res.status(500).json({ message: "DB error" });
          
          db.all(districtQuery, [date], (err, districtRows) => {
              if (err) return res.status(500).json({ message: "DB error" });

                db.all(tokenTypeQuery, [date, date], (err, tokenTypeRows) => {
                  if (err) return res.status(500).json({ message: "DB error" });

                  db.get(
                `SELECT tokens_per_hour FROM daily_token_counters WHERE date = ?`,
                [date],
                (err, tphRow) => {
                  if (err) return res.status(500).json({ message: "DB error" });

                  const tokensPerHour = tphRow?.tokens_per_hour || 40;
                  const cleanedServices = serviceRows.map(row => {
                    const english = row.service_type
                      ? row.service_type.split("/")[0].trim()
                      : "";

                    return {
                      service_type: english,
                      total: row.total,
                      visited: row.visited,
                      not_visited: row.not_visited
                    };
                  });

          db.all(
  `
  SELECT visited_at
  FROM tokens
  WHERE date = ?
  AND visited = 1
  AND visited_at IS NOT NULL
  `,
  [date],
  (err, visitedRows) => {
    if (err) return res.status(500).json({ message: "DB error" });

    const brackets = {
      before_12: { label: "9 AM to 12 PM", visited: 0 },
      between_12_3: { label: "12 PM to 3 PM", visited: 0 },
      after_3: { label: "3 PM to 6 PM", visited: 0 }
    };

    visitedRows.forEach(row => {
      const hour = new Date(row.visited_at + "Z")
        .toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          hour12: false
        });

      const h = parseInt(hour);

      if (h < 12) {
        brackets.before_12.visited++;
      } else if (h >= 12 && h < 15) {
        brackets.between_12_3.visited++;
      } else {
        brackets.after_3.visited++;
      }
    });

    const bracketArray = Object.values(brackets);

    res.json({
      summary: summaryRows,
      gender: genderRows,
      age: ageRow,
      services: cleanedServices,
      districts: districtRows,
      tokenTypes: tokenTypeRows,
      tokensPerHour: tokensPerHour,
      hourlyStats: bracketArray   // ? keep same key so frontend works
    });
  }
);
            });
            });
          });
        });
      });
    });
  });
};
exports.getTokensPerHourPublic = (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: "Date required" });
  }

  db.get(
    `SELECT tokens_per_hour FROM daily_token_counters WHERE date = ?`,
    [date],
    (err, row) => {
      if (err) {
        return res.status(500).json({ message: "DB error" });
      }

      res.json({
        tokensPerHour: row?.tokens_per_hour || 40
      });
    }
  );
};
