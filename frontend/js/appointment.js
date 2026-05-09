
// document.addEventListener("DOMContentLoaded", () => {
// //document.addEventListener("DOMContentLoaded", () => {
// //console.log("JS loaded after dom");
// //const calendar = document.getElementById("calendar");
// //const slotInfo = document.getElementById("slotInfo");
// //const formWrapper = document.getElementById("formWrapper");
// //const form = document.getElementById("bookingForm");
// //const statusText = document.getElementById("status");
// //const walkinWasFull = localStorage.getItem("walkinFull") === "true";
// //
// //let selectedDate = null;
// // function getDeviceId() {
// //   let deviceId = localStorage.getItem("device_id");
// //
// //   if (!deviceId) {
// //     deviceId =
// //       "DEV-" +
// //       crypto.randomUUID(); 
// //     localStorage.setItem("device_id", deviceId);
// //   }
// //
// //   return deviceId;
// // }
// //function disableAppointmentSubmit(msg) {
// //  const submitBtn = document.querySelector("#bookingForm button[type='submit']");
// //  if (submitBtn) {
// //    submitBtn.disabled = true;
// //    submitBtn.style.opacity = "0.6";
// //    submitBtn.style.cursor = "not-allowed";
// //  }
// //
// //  if (statusText && msg) {
// //    statusText.innerText = msg;
// //  }
// //}
// ////
// ////function isAppointmentTimeAllowed() {
// //////  const now = new Date();
// //////  const ist = new Date(
// //////    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
// //////  );
// //////
// //////  const mins = ist.getHours() * 60 + ist.getMinutes();
// //////  return mins >= 6 * 60 && mins <= 23 * 60; // 6 AM – 11 PM
// ////    return true;
// ////}
// //function isTodayAppointmentAllowed(selectedDate) {
// //  const now = new Date();
// //  const ist = new Date(
// //    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
// //  );
// //
// //  const todayStr = ist.toISOString().split("T")[0];
// //
// //  if (selectedDate !== todayStr) return true;
// //
// //  const mins = ist.getHours() * 60 + ist.getMinutes();
// //
// //  return mins <= 10 * 60;
// //}
// ////if (!isAppointmentTimeAllowed()) {
// ////  const statusText = document.getElementById("status");
// ////  // if (statusText) {
// ////  //   statusText.innerText =
// ////  //     "⏰ Appointment booking allowed only between 6:00 AM and 11:00 PM";
// ////  statusText.innerText =
// ////        "Booking allowed only between 6:00 AM and 11:00 PM/ बुकिंग केवल सुबह 6:00 बजे से शाम 11:00 बजे के बीच ही की जा सकती है";
// ////  disableAppointmentSubmit();
// ////  //}
// ////}
// //function isValidIndianMobile(mobile) {
// //  // must be 10 digits and start with 6, 7, 8, or 9
// //  return /^[6-9]\d{9}$/.test(mobile);
// //}
// //
// //function disableTodayInCalendar() {
// //  const today = new Date().toISOString().split("T")[0];
// //
// //  document.querySelectorAll(".calendar-day").forEach(day => {
// //    if (day.dataset.date === today) {
// //      day.classList.add("disabled");
// //      day.onclick = null;
// //      day.innerHTML += "<br><small>Walk-in only</small>";
// //    }
// //  });
// //}
// ////function shouldDisableTodayAppointment() {
// ////  const now = new Date();
// ////  const ist = new Date(
// ////    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }
// ////  );
// ////
// ////  const mins = ist.getHours() * 60 + ist.getMinutes();
// ////  return mins > 10 * 60; // after 10:00 AM
// ////}
// //function shouldHideToday() {
// //  const now = new Date();
// //  const ist = new Date(
// //    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
// //  );
// //
// //  const mins = ist.getHours() * 60 + ist.getMinutes();
// //
// //  return mins > 10 * 60;   // after 10:00 AM hide today
// //}
// //
// //
// //async function loadAvailability() {
// //  calendar.innerHTML = "Loading...";
// //
// //  try {
// //    const res = await fetch("/api/availability?disableToday=true");
// //    const data = await res.json();
// //  
// //
// //    calendar.innerHTML = "";
// //
// //    data.forEach(d => {
// //    const todayStr = new Date().toISOString().split("T")[0];
// //      // const disableToday = shouldHideToday();
// //      if (shouldHideToday() && d.date === todayStr) {
// //  return; // 👈 Skip rendering today completely
// //}
// //      const div = document.createElement("div");
// //      div.dataset.date = d.date;
// //
// //      div.className = `calendar-day ${
// //        d.status === "AVAILABLE"
// //          ? "available"
// //          : d.status === "FULL"
// //          ? "full"
// //          : "holiday"
// //      }`;
// //
// //      const dateObj = new Date(d.date);
// //      div.innerHTML = `
// //        <strong>${dateObj.toDateString()}</strong><br>Slots available:
// //        <small>${d.available_slots}</small>
// //      `;
// //
// //
// ////      if (d.status === "AVAILABLE") {
// ////        div.onclick = () => {
// ////          selectedDate = d.date;
// ////        const todayStr = new Date().toISOString().split("T")[0];
// ////        const disableToday = shouldDisableTodayAppointment();
// //
// ////        if (
// ////          d.status === "AVAILABLE" &&
// ////          !(disableToday && d.date === todayStr)
// ////        ) {
// //          if (d.status === "AVAILABLE"){
// //          div.onclick = () => {
// //            selectedDate = d.date;
// //
// //
// //          document
// //            .querySelectorAll(".calendar-day")
// //            .forEach(el => el.classList.remove("selected"));
// //
// //          div.classList.add("selected");
// //
// //          slotInfo.style.display = "block";
// //          slotInfo.innerHTML = `
// //            🟢 <strong>${d.available_slots}</strong>
// //            appointment slots available
// //          `;
// //
// //          formWrapper.style.display = "block";
// //          statusText.innerText = "Please fill appointment form";
// //        };
// //      }
// //
// //      calendar.appendChild(div);
// ////      if (disableToday && d.date === todayStr) {
// ////        div.classList.add("disabled");
// ////        div.innerHTML += "<br><small>Closed for today</small>";
// ////      }
// //
// //    });
// //
// //    // 🚨 HANDLE WALK-IN FULL REDIRECT CASE
// //    if (walkinWasFull) {
// //      statusText.innerText =
// //        "ℹ️ Walk-in slots are full. Appointment booking available from tomorrow.";
// //
// //      disableTodayInCalendar();
// //
// //      // clear flag so refresh doesn't keep disabling
// //      localStorage.removeItem("walkinFull");
// //    }
// //
// //  } catch (err){
// //    console.error(err);
// //    calendar.innerHTML = "Unable to load calendar";
// //  }
// //}
// //
// //// =============================
// //// FORM SUBMIT (APPOINTMENT)
// //// =============================
// //form.addEventListener("submit", async (e) => {
// //  e.preventDefault();
// ////   if (!otpVerified) {
// ////   statusText.innerText = "Please verify OTP first";
// ////   return;
// //// }
// //localStorage.removeItem("tokenData");
// //  console.log("🚀 SUBMIT CLICKED");
// //  const mobileValue = document.getElementById("mobile").value.trim();
// //
// //  if (!isValidIndianMobile(mobileValue)) {
// //    statusText.innerText =
// //      "❌ Enter a valid Indian mobile number (starts with 6–9)";
// //    return;
// //  }
// //
// //  if (!selectedDate) {
// //    statusText.innerText = "Please select appointment date";
// //    return;
// //  }
// //  if (!isTodayAppointmentAllowed(selectedDate)) {
// //  statusText.innerText =
// //    "⛔ Appointments for today can be booked only till 10:00 AM / आज की नियुक्ति केवल सुबह10:00 बजे तक बुक की जा सकती है";
// //  return;
// //}
// //  const payload = {
// //    mode: "A", // ✅ FIXED
// //    device_id: getDeviceId(),
// //    selected_date: selectedDate,
// //    name: document.getElementById("name").value.trim(),
// //    mobile: mobileValue,
// //    aadhaar_last4: document.getElementById("aadhaar").value.trim(),
// //    gender: document.getElementById("gender").value,
// //    age: Number(document.getElementById("age").value),
// ////    divyang: document.getElementById("divyang").value,
// //    district: document.getElementById("district").value,
// //    service_type: document.getElementById("service_type").value,
// //    qrc: document.getElementById("qrc").value.trim()
// //  };
// //
// //  statusText.innerText = "Processing...";
// //  localStorage.removeItem("tokenData");
// //
// //  try {
// //    const res = await fetch("/api/generate-token", {
// //      method: "POST",
// //      headers: { "Content-Type": "application/json" },
// //      body: JSON.stringify(payload)
// //    });
// //
// //    const result = await res.json();
// //
// //    if (!res.ok) {
// //      statusText.innerText = result.message;
// //      return;
// //    }
// //
// //    localStorage.setItem(
// //      "tokenData",
// //      JSON.stringify({ ...payload, ...result })
// //    );
// //
// //    window.location.href = "confirmation.html";
// //
// //  } catch (err){
// //    statusText.innerText = "Server not reachable";
// //  }
// //});
// //
// //// =============================
// //// INIT
// //// =============================
// //loadAvailability();
// //});


// document.addEventListener("DOMContentLoaded",() => {


// const calendar = document.getElementById("calendar");
// const slotInfo = document.getElementById("slotInfo");
// const formWrapper = document.getElementById("formWrapper");
// const form = document.getElementById("bookingForm");
// const statusText = document.getElementById("status");

// const walkinWasFull = localStorage.getItem("walkinFull") === "true";

// let selectedDate = null;
// //function normalizeDropdownValues(selectId) {
// //  const select = document.getElementById(selectId);
// //
// //  Array.from(select.options).forEach(opt => {
// //    const english = opt.text.split("/")[0].trim();
// //    opt.value = english;
// //  });
// //}
// //
// //normalizeDropdownValues("district");
// //normalizeDropdownValues("service_type");
// function getDeviceId() {
//   let deviceId = localStorage.getItem("device_id");

//   if (!deviceId) {
//     deviceId = "DEV-" + crypto.randomUUID();
//     localStorage.setItem("device_id", deviceId);
//   }

//   return deviceId;
// }



// function isTodayAppointmentAllowed(selectedDate) {
//   const now = new Date();
//   const ist = new Date(
//     now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
//   );

//   const todayStr = ist.toISOString().split("T")[0];

//   if (selectedDate !== todayStr) {
//     return true;
//   }

//   const currentMinutes = ist.getHours() * 60 + ist.getMinutes();
//   const limitMinutes = 6 * 60;

//   return currentMinutes <= limitMinutes;
// }


// if (!isAppointmentTimeAllowed()) {
//   const statusText = document.getElementById("status");
//   // if (statusText) {
//   //   statusText.innerText =
//   //     "Appointment booking allowed only between 6:00 AM and 11:00 PM";
//   statusText.innerText =
//         "Booking allowed only between 6:00 AM and 11:00 PM/ बुकिंग केवल सुबह 6:00 बजे से शाम 11:00 बजे के बीच ही की जा सकती है";
//   disableAppointmentSubmit();
//   //}
// }
// function isValidIndianMobile(mobile) {
//   //validate mobile number format
// function isValidIndianMobile(mobile) {

//   return /^[6-9]\d{9}$/.test(mobile);
// }

// function disableTodayInCalendar() {
//   const today = new Date().toISOString().split("T")[0];

//   document.querySelectorAll(".calendar-day").forEach(day => {
//     if (day.dataset.date === today) {
//       day.classList.add("disabled");
//       day.onclick = null;
//       day.innerHTML += "<br><small>Walk-in only</small>";
//     }
//   });
// }
// function shouldDisableTodayAppointment() {
//   const now = new Date();
//   const ist = new Date(
//     now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
//   );

//   const mins = ist.getHours() * 60 + ist.getMinutes();
//   return mins > 16 * 60; //block at 4:00pm as office closes as 6:00pm :)
// }


// async function loadAvailability() {

//   calendar.innerHTML = "Loading...";

//   try {

//     const distance = Number(localStorage.getItem("distance_meters") || 9999);
//     const disableToday = distance <= 100;

//     const res = await fetch(
//       `http://localhost:5000/api/availability?disableToday=${disableToday}`
//     );

//     const data = await res.json();

//     calendar.innerHTML = "";

//     // 🔥 Get current IST time
//     const now = new Date();
//     const ist = new Date(
//       now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
//     );
//     const currentMinutes = ist.getHours() * 60 + ist.getMinutes();
//     const after10AM = currentMinutes > 6 * 60;

//     const todayStr = ist.toISOString().split("T")[0];

//     data.forEach(d => {

//       const div = document.createElement("div");
//       div.dataset.date = d.date;

//       div.className = `calendar-day ${
//         d.status === "AVAILABLE"
//           ? "available"
//           : d.status === "FULL"
//           ? "full"
//           : "holiday"
//       }`;

//       const dateObj = new Date(d.date);

//       div.innerHTML = `
//         <strong>${dateObj.toDateString()}</strong><br>
//         Slots available:
//         <small>${d.available_slots}</small>
//       `;

//       // 🔥 NEW LOGIC — AFTER 10 AM MAKE TODAY RED & DISABLED
//       if (d.date === todayStr && after10AM) {

//         div.classList.remove("available");
//         div.classList.add("full");

//         div.innerHTML = `
//           <strong>${dateObj.toDateString()}</strong><br>
//           <small style="color:red; font-weight:bold;">
//             Closed for today
//           </small>
//         `;

//         div.onclick = null;
//       }

//       else if (d.status === "AVAILABLE") {

//         div.onclick = () => {

//           selectedDate = d.date;

//           document
//             .querySelectorAll(".calendar-day")
//             .forEach(el => el.classList.remove("selected"));

//           div.classList.add("selected");

//           slotInfo.style.display = "block";
//           slotInfo.innerHTML = `
//             🟢 <strong>${d.available_slots}</strong>
//             appointment slots available
//           `;

//           formWrapper.style.display = "block";
//           statusText.innerText = "Please fill appointment form";
//         };
//       }

//       calendar.appendChild(div);
//     });
//     if (walkinWasFull) {
//       statusText.innerText =
//         "Walk-in slots are full. Appointment booking available from tomorrow.";

//       disableTodayInCalendar();


//     if (walkinWasFull) {
//       statusText.innerText =
//         "ℹ️ Walk-in slots are full. Appointment booking available from the next working day.";

//       disableTodayInCalendar();

//       localStorage.removeItem("walkinFull");
//     }

//   } catch {
//     console.error();
//     calendar.innerHTML = "Unable to load calendar";
//   }
// }

// form.addEventListener("submit", async (e) => {

//   e.preventDefault();
// localStorage.removeItem("tokenData");


//   localStorage.removeItem("tokenData");

//   const mobileValue = document.getElementById("mobile").value.trim();

//   if (!isValidIndianMobile(mobileValue)) {
//     statusText.innerText =
//       "❌ Enter a valid Indian mobile number (starts with 6–9)";
//     return;
//   }

//   if (!selectedDate) {
//     statusText.innerText = "Please select appointment date";
//     return;
//   }

//   if (!isTodayAppointmentAllowed(selectedDate)) {
//     statusText.innerText =
//       "⛔ Appointments for today can be booked only till 6:00 AM / आज की नियुक्ति केवल 6 बजे तक बुक की जा सकती है";
//     return;
//   }

//   const payload = {
//     mode: "A",
//     device_id: getDeviceId(),
//     selected_date: selectedDate,
//     name: document.getElementById("name").value.trim(),
//     mobile: mobileValue,
//     aadhaar_last4: document.getElementById("aadhaar").value.trim(),
//     gender: document.getElementById("gender").value,
//     age: Number(document.getElementById("age").value),
//     district: document.getElementById("district").value,
//     service_type: document.getElementById("service_type").value,
//     qrc: document.getElementById("qrc").value.trim(),
//     distance_meters: Number(localStorage.getItem("distance_meters") || 0)
//   };

//   statusText.innerText = "Processing...";
//   localStorage.removeItem("tokenData");

//   try {

//     const res = await fetch("http://localhost:5000/api/generate-token", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload)
//     });

//     const result = await res.json();

//     if (!res.ok) {
//       statusText.innerText = result.message;
//       return;
//     }

//     localStorage.setItem(
//       "tokenData",
//       JSON.stringify({ ...payload, ...result })
//     );

//     window.location.href = "confirmation.html";

//   } catch {
//     statusText.innerText = "Server not reachable";
//   }

// });

// loadAvailability();


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
    // device_id: getDeviceId(),
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