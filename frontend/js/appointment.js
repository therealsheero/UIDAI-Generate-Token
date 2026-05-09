document.addEventListener("DOMContentLoaded",() => {


const calendar = document.getElementById("calendar");
const slotInfo = document.getElementById("slotInfo");
const formWrapper = document.getElementById("formWrapper");
const form = document.getElementById("bookingForm");
const statusText = document.getElementById("status");

const walkinWasFull = localStorage.getItem("walkinFull") === "true";
const agreeCheck =
  document.getElementById("agreeCheck");

const submitBtn =
  document.getElementById("submitBtn");

agreeCheck.addEventListener("change", () => {

  submitBtn.disabled =
    !agreeCheck.checked;

});
let selectedDate = null;
function getDeviceId() {
  let deviceId = localStorage.getItem("device_id");

  if (!deviceId) {
    deviceId = "DEV-" + crypto.randomUUID();
    localStorage.setItem("device_id", deviceId);
  }

  return deviceId;
}

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

function isTodayAppointmentAllowed(selectedDate) {
  const now = new Date();
  const ist = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  const todayStr = ist.toISOString().split("T")[0];

  if (selectedDate !== todayStr) {
    return true;
  }

  const currentMinutes = ist.getHours() * 60 + ist.getMinutes();
  const limitMinutes = 6 * 60;

  return currentMinutes <= limitMinutes;
}

function isValidIndianMobile(mobile) {

  return /^[6-9]\d{9}$/.test(mobile);
}

function disableTodayInCalendar() {
  const today = new Date().toISOString().split("T")[0];

  document.querySelectorAll(".calendar-day").forEach(day => {
    if (day.dataset.date === today) {
      day.classList.add("disabled");
      day.onclick = null;
      day.innerHTML += "<br><small>Walk-in only</small>";
    }
  });
}
function shouldDisableTodayAppointment() {
  const now = new Date();
  const ist = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  const mins = ist.getHours() * 60 + ist.getMinutes();
  return mins > 16 * 60;
}


async function loadAvailability() {

  calendar.innerHTML = "Loading...";

  try {

    const distance = Number(localStorage.getItem("distance_meters") || 9999);
    const disableToday = distance <= 100;

    const res = await fetch(
      `http://localhost:5000/api/availability?disableToday=${disableToday}`
    );

    const data = await res.json();

    calendar.innerHTML = "";
    const now = new Date();
    const ist = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    const currentMinutes = ist.getHours() * 60 + ist.getMinutes();
    const after10AM = currentMinutes > 6 * 60;

    const todayStr = ist.toISOString().split("T")[0];

    data.forEach(d => {

      const div = document.createElement("div");
      div.dataset.date = d.date;

      div.className = `calendar-day ${
        d.status === "AVAILABLE"
          ? "available"
          : d.status === "FULL"
          ? "full"
          : "holiday"
      }`;

      const dateObj = new Date(d.date);

      div.innerHTML = `
        <strong>${dateObj.toDateString()}</strong><br>
        Slots available:
        <small>${d.available_slots}</small>
      `;

      if (d.date === todayStr && after10AM) {

        div.classList.remove("available");
        div.classList.add("full");

        div.innerHTML = `
          <strong>${dateObj.toDateString()}</strong><br>
          <small style="color:red; font-weight:bold;">
            Closed for today
          </small>
        `;

        div.onclick = null;
      }

      else if (d.status === "AVAILABLE") {

        div.onclick = () => {

          selectedDate = d.date;

          document
            .querySelectorAll(".calendar-day")
            .forEach(el => el.classList.remove("selected"));

          div.classList.add("selected");

          slotInfo.style.display = "block";
          slotInfo.innerHTML = `
            🟢 <strong>${d.available_slots}</strong>
            appointment slots available
          `;

          formWrapper.style.display = "block";
          statusText.innerText = "Please fill appointment form";
        };
      }

      calendar.appendChild(div);
    });
    if (walkinWasFull) {
      statusText.innerText =
        "Walk-in slots are full. Appointment booking available from tomorrow.";

      disableTodayInCalendar();

      localStorage.removeItem("walkinFull");
    }

  } catch {
    console.error();
    calendar.innerHTML = "Unable to load calendar";
  }
}

form.addEventListener("submit", async (e) => {

  e.preventDefault();
localStorage.removeItem("tokenData");


  localStorage.removeItem("tokenData");

  const mobileValue = document.getElementById("mobile").value.trim();

  if (!isValidIndianMobile(mobileValue)) {
    statusText.innerText =
      "❌ Enter a valid Indian mobile number (starts with 6–9)";
    return;
  }

  if (!selectedDate) {
    statusText.innerText = "Please select appointment date";
    return;
  }

  if (!isTodayAppointmentAllowed(selectedDate)) {
    statusText.innerText =
      "⛔ Appointments for today can be booked only till 6:00 AM / आज की नियुक्ति केवल 6 बजे तक बुक की जा सकती है";
    return;
  }
  const nameValue = document.getElementById("name").value.trim();

  const nameRegex = /^[A-Za-z\s]{2,50}$/;
  
  if (!nameRegex.test(nameValue)) {
    statusText.innerText =
      "❌ Name should contain only alphabets.";
    return;
  }

  const payload = {
    mode: "A",
    device_id: getDeviceId(),
    selected_date: selectedDate,
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

loadAvailability();

});
