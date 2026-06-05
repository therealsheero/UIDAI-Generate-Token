const db = require("../models/db");
const { reserveSlot } = require("../services/slot.service");
const { generateDailyToken } = require("../services/token.service");

function normalizeDistrict(d) {
  return d.split("/")[0].trim();
}


function isWeekend(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDay();
  return day === 0 || day === 6; // shanivar and ravivar chutti
}
function isGazettedHoliday(dateStr) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT 1 FROM holidays WHERE date = ?`,
      [dateStr],
      (err, row) => {
        if (err) return reject(err);
        resolve(!!row);
      }
    );
  });
}
function generateEID(
  enrollmentNo,
  eidDate,
  eidTime
) {
  const enroll =
    enrollmentNo.replace(/\D/g, "");
  const [year, month, day] =
    eidDate.split("-");
  const datePart =
    `${year}${month}${day}`;
  const timePart =
    eidTime.replace(/:/g, "");
  return enroll + datePart + timePart;
}
exports.generateToken = async (req, res) => {
  const {
    device_id,
    name,
    mobile,
    aadhaar_last4,
    age,
    gender,
    divyang,
    district,
    service_type,
    qrc,
    mode, 
    selected_date,
    enrollment_no,
    eid_date,
    eid_time
    
  } = req.body;
//  const cleanDistrict = cleanValue(district);
//constServiceType = cleanValue(service_type);

  if (!name || !mobile || !aadhaar_last4 || !qrc || !district || !mode) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const mobileRegex = /^[6-9][0-9]{9}$/;

  if (!mobileRegex.test(mobile)) {
    return res.status(400).json({
      message: "Invalid mobile number. Must start with 6,7,8,9"
    });
  }
  const nameRegex = /^[A-Za-z\s]{2,50}$/;

if (!nameRegex.test(name)) {
  return res.status(400).json({
    message: "Invalid name. Only alphabets allowed."
  });
}
const enrollDigits =
  enrollment_no.replace(/\D/g, "");

if (enrollDigits.length !== 14) {

  return res.status(400).json({
    message:
      "Enrollment number must contain 14 digits"
  });
}
  const qrcRegex = /^S[A-Za-z0-9]+000$/;
  if(!qrcRegex.test(qrc)){
    return res.status(400).json({ message: "Invalid QRC format. Must start with S and end with 000."});
  }
  try {
// transaction shuru




      await new Promise((resolve, reject) =>
        db.run("BEGIN IMMEDIATE TRANSACTION", err => err ? reject(err) : resolve())
      );
    const qrcExists = await new Promise((resolve, reject) => {
      db.get(
        "SELECT id FROM tokens WHERE qrc = ?",
        [qrc],
        (err, row) => err ? reject(err) : resolve(!!row)
      );
    });

    if (qrcExists) {
      throw new Error("This QRC has already been used");
    }
    const qrcCountForMobile = await new Promise((resolve,reject)=>{ db.get("SELECT COUNT(DISTINCT qrc) AS count FROM tokens WHERE mobile =?",[mobile],(err,row)=>(err ?reject(err):resolve(row.count)));
    });
    if(qrcCountForMobile >=2){ 
     throw new Error("Only 2 QRCs allowed per mobile number.");
    }
//validating mobile limit
    const tokenCount = await new Promise((resolve, reject) => {
      db.get(
        "SELECT COUNT(*) AS count FROM tokens WHERE mobile = ?",
        [mobile],
        (err, row) => err ? reject(err) : resolve(row.count)
      );
    });

    if (tokenCount >= 3) {
      throw new Error("Maximum 3 tokens allowed per mobile number");
    }
    let bookingDate;

    if (mode === "W") {
      bookingDate = new Date().toISOString().split("T")[0];
      const isWeekendDay = isWeekend(bookingDate);
      const isHoliday = await isGazettedHoliday(bookingDate);
      if (isWeekendDay || isHoliday) {
        throw new Error("Walk-in tokens cannot be generated on holidays");
      }
      if (selected_date) {
        throw new Error("Walk-in cannot have appointment date");
      }
    } else {
      if (!selected_date) {
        throw new Error("Appointment date is required");
      }
      bookingDate = selected_date;
    }
    const deviceTokenExists = await new Promise((resolve, reject) => {
  db.get(
    `
    SELECT id
    FROM tokens
    WHERE device_id = ?
      AND date = ?
    `,
    [device_id, bookingDate],
    (err, row) => {
      if (err) reject(err);
      else resolve(!!row);
    }
  );
});

if (deviceTokenExists) {
  throw new Error(
    "Only one token per device is allowed per day"
  );
}
    await reserveSlot(bookingDate, mode);

    const cleanDistrict = normalizeDistrict(district);

const districts = await new Promise((resolve,reject)=>{
  db.all(
    "SELECT district FROM priority_districts",
    (err,rows)=> err?reject(err):resolve(rows)
  );
});

const longDistance = districts.map(d=>d.district);
const isLongDistance = longDistance.includes(cleanDistrict);
const rules = await new Promise((resolve,reject)=>{
  db.all("SELECT * FROM priority_rules",
  (err,rows)=> err?reject(err):resolve(rows));
});

const ruleMap = {};
rules.forEach(r=> ruleMap[r.rule_key] = r.rule_value);

const childAge = ruleMap.child_age_limit;
const seniorAge = ruleMap.senior_age_limit;
const femaleAge = ruleMap.female_priority_age;

let tokenType;

if (mode === "A") {

  const now = new Date();
  const ist = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  const todayIST = ist.toISOString().split("T")[0];

  const isToday = bookingDate === todayIST;
  const before10 = ist.getHours() < 6; // 6 AM 

  if (age <= childAge || age >= seniorAge) {
    tokenType = "AP";
  } 
  else if (gender === "Female" && age >= femaleAge) {
    tokenType = "AP";
  } 
  else if (isToday && before10 && isLongDistance) {
    tokenType = "AL";
  } 
  else {
    tokenType = "AN";
  }
}
else {

  if (age <= childAge || age >= seniorAge) {
    tokenType = "WP";
  }  
  else if (gender === "Female" && age >= femaleAge) {
    tokenType = "WP";
  }
  else if (isLongDistance) {
    tokenType = "WL";
  }
  else {
    tokenType = "WN";
  }
}
    const { token, token_seq, priority } = await generateDailyToken(
      name,
      mobile,
      aadhaar_last4,
      bookingDate,
      age,
      gender,
      divyang,
      mode,
      tokenType
    );
    await new Promise((resolve, reject) => {
      db.run(
        `
        INSERT INTO tokens
        (
          token, token_seq, name, mobile, aadhaar_last4,
          age, gender, divyang,
          district, service_type, qrc,
          date, mode, priority,device_id, token_type, distance_meters,eid
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)
        `,
        [
          token,
          token_seq,
          name,
          mobile,
          aadhaar_last4,
          age,
          gender,
          divyang,
          cleanDistrict,
          service_type,
          qrc,
          bookingDate,
          mode,
          priority,
          device_id,
          tokenType,
          req.body.distance_meters || 0,
          eid
        ],
        err => err ? reject(err) : resolve()
      );
    });
    await new Promise((resolve, reject) =>
      db.run("COMMIT", err => err ? reject(err) : resolve())
    );

    res.status(201).json({
      message: "Token generated successfully",
      token,
      date: bookingDate,
      mode,
      priority
    });

  } catch (err) {
    await new Promise(resolve =>
      db.run("ROLLBACK", () => resolve())
    );

    console.error("Booking failed:", err.message);
    res.status(400).json({ message: err.message });
  }
};
