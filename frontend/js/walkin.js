const slotInfo = document.getElementById("slotInfo");
const statusText = document.getElementById("status");
const infoText = document.getElementById("infoText");
const form = document.getElementById("bookingForm");
const formWrapper = document.getElementById("formWrapper");


const distance = Number(localStorage.getItem("distance_meters") || 9999);
function fillTimeDropdowns() {

  const hour =
    document.getElementById("eid_hour");

  const minute =
    document.getElementById("eid_minute");

  const second =
    document.getElementById("eid_second");

  for (let i = 0; i < 60; i++) {

    const val =
      String(i).padStart(2, "0");

    if (i < 24) {
      hour.innerHTML +=
        `<option value="${val}">${val}</option>`;
    }

    minute.innerHTML +=
      `<option value="${val}">${val}</option>`;

    second.innerHTML +=
      `<option value="${val}">${val}</option>`;
  }
}

fillTimeDropdowns();
function getDeviceId() {
  let deviceId = localStorage.getItem("device_id");

  if (!deviceId) {
    deviceId =
      "DEV-" +
      crypto.randomUUID();
    localStorage.setItem("device_id", deviceId);
  }

  return deviceId;
}

//function disableWalkinSubmit(msg) {
//  const submitBtn = document.querySelector("#bookingForm button[type='submit']");
//  if (submitBtn) {
//    submitBtn.disabled = true;
//    submitBtn.style.opacity = "0.6";
//    submitBtn.style.cursor = "not-allowed";
//  }
//
//  if (statusText && msg) {
//    statusText.innerText = msg;
//  }
//}
function disableWalkinForm(msg) {
  if (form) {
    const elements = form.querySelectorAll("input, select, button, textarea");
    elements.forEach(el => {
      el.disabled = true;
    });

    form.style.opacity = "0.6";
    form.style.pointerEvents = "none";
  }

  if (statusText && msg) {
    statusText.innerText = msg;
  }
}

function isWalkinTimeAllowed() {
  const now = new Date();
  const ist = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  const mins = ist.getHours() * 60 + ist.getMinutes();
  return mins >= 6 * 60 && mins <= 23 * 60;
}

if (!isWalkinTimeAllowed()) {
  const statusText = document.getElementById("status");
  disableWalkinForm(
    "Walk-in booking allowed only between 6:00 AM and 4:00 PM/ बुकिंग केवल सुबह7:00 बजे से शाम 6:00 बजे के बीच ही की जा सकती है।"
  );
}
function isTodayHoliday() {
  const today = new Date();
  const day = today.getDay();
  return day === 0 || day === 6;
}

if (isTodayHoliday()) {
  disableWalkinSubmit(
    "❌ Walk-in service not available on holidays / weekends"
  );
}

function isValidIndianMobile(mobile) {
  return /^[6-9]\d{9}$/.test(mobile);
}

function isBefore11IST() {
  const now = new Date();
  const ist = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  return ist.getHours() < 11;
}


if (isBefore11IST()) {

  // BEFORE 11 no geofencing
  infoText.innerText = "✅ Walk-in booking available";

  formWrapper.style.display = "block";

} else {

  // AFTER 11 apply geofencing
  if (distance > 100) {
    infoText.innerText =
      "❌ Walk-in allowed only inside office premises";

    formWrapper.style.display = "none";
  } else {
    infoText.innerText =
      "✅ You are inside office premises";

    formWrapper.style.display = "block";
  }

}
async function loadWalkinAvailability() {
  try {
    const res = await fetch("http://localhost:5000/api/walkin-availability");
    const data = await res.json();

    if (data.available_slots <= 0) {
      localStorage.setItem("walkinFull", "true");

      statusText.innerText =
        "❌ Walk-in slots are full. Redirecting to appointment booking...";

      setTimeout(() => {
        window.location.href = "appointment.html";
      }, 1500);

      return;
    }

    localStorage.removeItem("walkinFull");

    slotInfo.innerHTML = `
      🟢 <strong>${data.available_slots} </strong>
      walk-in slots available today
    `;

    formWrapper.style.display = "block";

  } catch {
    slotInfo.innerText = "Unable to load walk-in availability";
  }
}
form.addEventListener("submit", async (e) => {
  e.preventDefault();
localStorage.removeItem("tokenData");
  const mobileValue = document.getElementById("mobile").value.trim();

  if (!isValidIndianMobile(mobileValue)) {
    statusText.innerText =
      "❌ Enter a valid Indian mobile number (starts with 6–9)";
    return;
  }

  const payload = {
    mode: "W",
    device_id: getDeviceId(),
    name: document.getElementById("name").value.trim(),
    mobile: mobileValue,
    aadhaar_last4: document.getElementById("aadhaar").value.trim(),
    gender: document.getElementById("gender").value,
    age: Number(document.getElementById("age").value),
    district: document.getElementById("district").value,
    service_type: document.getElementById("service_type").value,
    qrc: document.getElementById("qrc").value.trim(),
    distance_meters: Number(localStorage.getItem("distance_meters") || 0),
    enrollment_no: document.getElementById("enrollment_no").value,
    eid_date: document.getElementById("eid_date").value,
    eid_time:
  `${document.getElementById("eid_hour").value}:` +
  `${document.getElementById("eid_minute").value}:` +
  `${document.getElementById("eid_second").value}`,
  };

  statusText.innerText = "Processing...";
  localStorage.removeItem("tokenData");

  try {
    const res = await fetch("http://localhost:5000/api/generate-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (!res.ok) {
      statusText.innerText = result.message;
      return;
    }
    localStorage.setItem(
      "tokenData",
      JSON.stringify({ ...payload, ...result })
    );

    window.location.href = "confirmation.html";

  } catch {
    statusText.innerText = "Server not reachable";
  }
});

loadWalkinAvailability();
