const db = require("../models/db");
function pad(num) {
  return num.toString().padStart(3, "0");
}
function getPriorityFlag(age, gender, divyang) {
  if (divyang === "Yes") return "P";
  if (age >= 60) return "P";
  if (gender === "Female" && age >= 50) return "P";
  return "N";
}

async function generateDailyToken(
  name,
  mobile,
  aadhaar_last4,
  date,
  age,
  gender,
  divyang,
  mode,
  tokenType  
) {
  const priority = getPriorityFlag(age, gender, divyang);
  await new Promise((resolve, reject) => {
    db.run(
      `INSERT OR IGNORE INTO daily_token_counters (date, last_token)
       VALUES (?, 0)`,
      [date],
      err => (err ? reject(err) : resolve())
    );
  });

  const seq = await new Promise((resolve, reject) => {
  db.get(
    `
    UPDATE daily_token_counters
    SET last_token = last_token + 1
    WHERE date = ?
    RETURNING last_token
    `,
    [date],
    (err, row) => {
      if (err) reject(err);
      else resolve(row.last_token);
    }
  );
});

  //purane counters phir bhi rakhe taki admin analysis easy rahe
  const map = {
    AP: "ap_count",
    AN: "an_count",
    WP: "wp_count",
    WN: "wn_count",
    WL: "wl_count",
    AL: "al_count" 
  };

  const col = map[tokenType];
  if (col) {
    db.run(
      `UPDATE daily_token_counters SET ${col} = ${col} + 1 WHERE date = ?`,
      [date]
    );
  }

  const padded = pad(seq);
  return {
    token: `${padded}-${tokenType}-${aadhaar_last4}`,
    token_seq: seq,
    priority
  };
}


module.exports = {
  generateDailyToken
};
  
