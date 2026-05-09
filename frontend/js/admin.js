
const adminToken = localStorage.getItem("adminToken");
if (!adminToken) {
  window.location.href = "admin-login.html";
}

let currentTokensPerHour = 40; 
let districtChartInstance = null;
const calendar = document.getElementById("calendar");
const table = document.getElementById("tokenTable");
const tableHeading = document.getElementById("tableHeading");
const tbody = table.querySelector("tbody");
const actions = document.getElementById("tableActions");

let currentDate = null;
let currentTableData = [];

function openPrioritySettings() {
  window.location.href = "priority-settings.html";
}

function getExpectedTime(tokenNumber, tokensPerHour) {

  const n = Number(tokenNumber);

  let slotIndex = Math.floor((n - 1) / tokensPerHour);

  if (slotIndex > 7) slotIndex = 7;

  const startHour = 10 + slotIndex;
  const endHour = startHour + 1;

  const format = h => {
    const hour = h > 12 ? h - 12 : h;
    const ampm = h >= 12 ? "PM" : "AM";
    return `${hour} ${ampm}`;
  };

  return `${format(startHour)} - ${format(endHour)}`;
}
function getTimeTaken(entry, visited) {

  const start = new Date(entry);
  const end = new Date(visited);

  const diffMs = end - start;

  const mins = Math.floor(diffMs / 60000);

  if (mins < 60) {
    return mins + " mins";
  }

  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;

  return `${hrs} hr ${rem} mins`;
}

function renderSummaryTable(data) {
  const container = document.getElementById("dashboardBoxes");
  container.innerHTML = "";

  let html = `
    <table style="width:100%; border-collapse:collapse; background:white; font-size:12px;">
    <tr>
      <th style="padding:4px; font-weight:bold;">Sr No.</th>
      <th style="padding:4px; font-weight:bold;">Parameter</th>
      <th style="padding:4px; font-weight:bold;">Visited</th>
      <th style="padding:4px; font-weight:bold;">Not Visited</th>
      <th style="padding:4px; font-weight:bold;">Total</th>
    </tr>

  `;

  let sr = 1;



 data.gender.forEach(g => {
   html += `
     <tr style="background: #f1f8e9;">
       <td>${sr++}</td>
       <td>${g.gender}</td>
       <td style="color:green">${g.visited}</td>
       <td style="color:red">${g.not_visited}</td>
       <td>${g.total}</td>
     </tr>
   `;
 });


html += `

    <tr style ="background: #f3e5f5;">
      <td>${sr++}</td>
      <td>Age 0-5</td>
      <td style="color:green">${data.age.age_0_5_visited}</td>
      <td style="color:red">${data.age.age_0_5_not}</td>
      <td>${data.age.age_0_5}</td>
    </tr>
    <tr style ="background: #f3e5f5;">
      <td>${sr++}</td>
      <td>Age 6-15</td>
      <td style="color:green">${data.age.age_6_15_visited}</td>
      <td style="color:red">${data.age.age_6_15_not}</td>
      <td>${data.age.age_6_15}</td>
    </tr>
    <tr style ="background: #f3e5f5;">
      <td>${sr++}</td>
      <td>Age 16-23</td>
      <td style="color:green">${data.age.age_16_23_visited}</td>
      <td style="color:red">${data.age.age_16_23_not}</td>
      <td>${data.age.age_16_23}</td>
    </tr>
    <tr style ="background: #f3e5f5;">
      <td>${sr++}</td>
      <td>Age 24+</td>
      <td style="color:green">${data.age.age_24_plus_visited}</td>
      <td style="color:red">${data.age.age_24_plus_not}</td>
      <td>${data.age.age_24_plus}</td>
    </tr>
  `;

  html += `</table>`;

  html += `

    <table style="width:100%; border-collapse:collapse; background:white; font-size:12px;">
      <tr>
        <th style="padding:4px; font-weight:bold;">Sr No.</th>
        <th style="padding:4px; font-weight:bold;">Parameter</th>
        <th style="padding:4px; font-weight:bold;">Visited</th>
        <th style="padding:4px; font-weight:bold;">Not Visited</th>
        <th style="padding:4px; font-weight:bold;">Total</th>
      </tr>

  `;
  const serviceColors = [
  "#e8f5e9",
  "#e3f2fd",
  "#fff8e1",
  "#fce4ec",
  "#ede7f6",
  "#e0f7fa"
];

  data.services.forEach((s, index) => {
    const bg = serviceColors[index % serviceColors.length];
    html += `
      <tr style="background:${bg};">
        <td>${index + 1}</td>
        <td>${s.service_type}</td>
        <td style="color:green">${s.visited}</td>
        <td style="color:red">${s.not_visited}</td>
        <td>${s.total}</td>
      </tr>
    `;
  });

  html += `</table>`;



function getTokenTypeColor(tokenType) {
 if (tokenType === "AP") return "#fce4ec";
 if (tokenType === "AL") return "#e3f2fd";
 if (tokenType === "AN") return "#ffffff";

 if (tokenType === "WP") return "#fce4ec";
 if (tokenType === "WL") return "#e3f2fd";
 if (tokenType === "WN") return "#ffffff";

 return "#ffffff";
}

let apTypes = ["AP", "AL", "AN"];
let wlTypes = ["WP", "WL", "WN","PT","RT"];

let apData = data.tokenTypes.filter(t => apTypes.includes(t.token_type));
let wlData = data.tokenTypes.filter(t => wlTypes.includes(t.token_type));

let apVisited = 0, apNot = 0, apTotal = 0;
let wlVisited = 0, wlNot = 0, wlTotal = 0;

html += `
<table style="width:100%; border-collapse:collapse; background:white;">
<tr style="background:#f2f2f2;">
  <th>Sr No.</th>
  <th>Token Type</th>
  <th>Visited</th>
  <th>Not Visited</th>
  <th>Total</th>
  <th>Completion %</th>
</tr>
`;

let srNo = 1;


apData.forEach(t => {
  apVisited += t.visited;
  apNot += t.not_visited;
  apTotal += t.total;

  const bg = getTokenTypeColor(t.token_type);

  html += `
  <tr style="background:${bg};">
    <td>${srNo++}</td>
    <td>${t.token_type}</td>
    <td>${t.visited}</td>
    <td>${t.not_visited}</td>
    <td>${t.total}</td>
    <td>${t.total ? ((t.visited/t.total)*100).toFixed(1) : 0}%</td>
  </tr>
  `;
});

html += `
<tr style="background:#ffd8cc; font-weight:bold;">
  <td colspan="2">Appointment Subtotal</td>
  <td>${apVisited}</td>
  <td>${apNot}</td>
  <td>${apTotal}</td>
  <td>${apTotal ? ((apVisited/apTotal)*100).toFixed(1) : 0}%</td>
</tr>
`;

wlData.forEach(t => {
  wlVisited += t.visited;
  wlNot += t.not_visited;
  wlTotal += t.total;

  const bg = getTokenTypeColor(t.token_type);

  html += `
  <tr style="background:${bg};">
    <td>${srNo++}</td>
    <td>${t.token_type}</td>
    <td>${t.visited}</td>
    <td>${t.not_visited}</td>
    <td>${t.total}</td>
    <td>${t.total ? ((t.visited/t.total)*100).toFixed(1) : 0}%</td>
  </tr>
  `;
});

html += `
<tr style="background:#cdeccd; font-weight:bold;">
  <td colspan="2">Walk-in Subtotal</td>
  <td>${wlVisited}</td>
  <td>${wlNot}</td>
  <td>${wlTotal}</td>
  <td>${wlTotal ? ((wlVisited/wlTotal)*100).toFixed(1) : 0}%</td>
</tr>
`;

// GRAND TOTAL
const grandVisited = apVisited + wlVisited;
const grandNot = apNot + wlNot;
const grandTotal = apTotal + wlTotal;

html += `
<tr style="background:#f9f9f9; font-weight:bold;">
  <td colspan="2">Grand Total</td>
  <td>${grandVisited}</td>
  <td>${grandNot}</td>
  <td>${grandTotal}</td>
  <td>${grandTotal ? ((grandVisited/grandTotal)*100).toFixed(1) : 0}%</td>
</tr>
`;

html += `</table>`;

html += `
<table style="width:100%; border-collapse:collapse; background:white;">
<tr style="background:#f2f2f2;">
  <th>Sr No.</th>
  <th>Time Slot</th>
  <th>Visited</th>
</tr>
`;

data.hourlyStats.forEach((h, index) => {

  html += `
    <tr>
      <td>${index + 1}</td>
      <td>${h.label}</td>
      <td style="color:green">${h.visited}</td>
    </tr>
  `;
});

html += `</table>`;



const ctx = document.getElementById("districtChart");


if (districtChartInstance) {
  districtChartInstance.destroy();
}

if (ctx && data.districts && data.districts.length > 0) {
  districtChartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: data.districts.map(d => d.district),
      datasets: [{
        data: data.districts.map(d => d.total),
        backgroundColor: [
          "#4CAF50",
          "#2196F3",
          "#FF9800",
          "#9C27B0",
          "#F44336",
          "#00BCD4",
          "#8BC34A",
          "#FFEB3B",
          "#E91E63",
          "#3F51B5"
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
          text: "Visited Distribution by District"
        }
      }
    }
  });
}

  container.innerHTML = html;
}

async function loadDashboard(date) {

  const res = await fetch(
    `http://localhost:5000/api/admin/dashboard?date=${date}`,
    {
      headers: { "x-admin-token": adminToken }
    }
  );

  const data = await res.json();
  currentTokensPerHour = data.tokensPerHour || 40;


  renderSummaryTable(data);
}



function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function formatDateTime(dt) {
  return new Date(dt).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

function parseToken(token) {
  const parts = token.split("-");
  return {

    count: parts[0],     //get token number - 001
    type: parts[1],      //get token type - WN / AP / WL
    aadhaar: parts[2]    //get aadhaar last four digits - 1234 

  };
}


function refreshCurrent() {
  if (currentDate) {
    loadTokens(currentDate);
  } else {
    loadCalendar();
  }
}
async function saveTokensPerHour(date) {
  const input = document.getElementById(`tph-${date}`);
  const value = Number(input.value);

  if (!value || value <= 0) {
    alert("Enter valid number");
    return;
  }

  await fetch("http://localhost:5000/api/admin/set-tokens-per-hour", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": adminToken
    },
    body: JSON.stringify({
      date,
      tokens_per_hour: value
    })
  });

  alert("Updated successfully");
}

async function loadCalendar() {
  calendar.innerHTML = "Loading...";

  const res = await fetch("http://localhost:5000/api/admin/calendar", {
    headers: { "x-admin-token": adminToken }
  });

  if (!res.ok) {
    calendar.innerHTML = "Failed to load calendar";
    return;
  }

  const data = await res.json();

  if (!Array.isArray(data)) {
    console.error("Calendar API did not return array:", data);
    calendar.innerHTML = "Invalid calendar data";
    return;
  }

  calendar.innerHTML = "";

  data.forEach(d => {
    const div = document.createElement("div");
    div.className = "date-box";

div.innerHTML = `
  <b>${d.date}</b><br>
  Appointment: ${d.appointment_booked}/${d.appointment_total}<br>
  Walk-in: ${d.walkin_booked}/${d.walkin_total}<br><br>

  <small>Tokens / Hour:</small><br>
  <input type="number" 
         value="${d.tokens_per_hour || 40}" 
         min="1"
         style="width:60px;"
         id="tph-${d.date}">
  <button class="mini-btn save-btn" onclick="saveTokensPerHour('${d.date}')">
    Save
  </button>
`;
div.innerHTML += `
  <br>
  <button class="mini-btn edit-btn"
    onclick="editSlots('${d.date}', ${d.appointment_total}, ${d.walkin_total}); event.stopPropagation();">
    Edit Slots
  </button>
`;

    div.onclick = () => loadTokens(d.date);
    calendar.appendChild(div);
  });
}
async function editSlots(date, ap, wl) {


  const newAp = prompt("Enter Appointment Slots:", ap);
  if (newAp === null) return;

  const newWl = prompt("Enter Walk-in Slots:", wl);
  if (newWl === null) return;

  await fetch("http://localhost:5000/api/admin/update-slots", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": adminToken
    },
    body: JSON.stringify({
      date,
      appointment_total: Number(newAp),
      walkin_total: Number(newWl)
    })
  });

  alert("Slots updated");
  loadCalendar();
}


async function loadTokens(date) {
  
  currentDate = date;
  await loadDashboard(date);

  tbody.innerHTML = "Loading...";

  table.style.display = "table";

  tableHeading.innerText =
    "Token Details for " + formatDate(date);

  tableHeading.style.display = "block";

  actions.style.display = "flex";

  const res = await fetch(
    `http://localhost:5000/api/admin/tokens?date=${date}`,
    {
      headers: {
        "x-admin-token": adminToken
      }
    }
  );

  const data = await res.json();

  document.getElementById("dashboardHeading").style.display = "block";

  document.getElementById("dashboardHeading").innerText =
    "Dashboard Summary for " + formatDate(date);

  currentTableData = data;

  tbody.innerHTML = "";

  let previousSource = null;

  data.forEach((row, i) => {

    if (
  row.source_type === "physical_reference" &&
  previousSource !== row.source_type
) {

      const dividerRow = document.createElement("tr");

      dividerRow.innerHTML = `
        <td colspan="16"
            style="
              background:#1e293b;
              color:white;
              text-align:center;
              font-weight:bold;
              font-size:14px;
              padding:12px;
            ">
          ${
            row.source_type === "physical_reference"
              ? "PHYSICAL / REFERENCE TOKENS"
              : "NORMAL TOKENS"
          }
        </td>
      `;

      tbody.appendChild(dividerRow);

      previousSource = row.source_type;
    }
    const tr = document.createElement("tr");

    const tokenValue = row.token || "-";

    const tokenParts =
      tokenValue.includes("-")
        ? tokenValue.split("-")
        : [tokenValue, "-", "-"];

    const tokenCount = tokenParts[0] || "-";

    const tokenType =
      tokenParts[1] ||
      row.token_type ||
      "-";

    const expectedTime =
      row.source_type === "physical_reference"
        ? "-"
        : getExpectedTime(
            tokenCount,
            currentTokensPerHour
          );

    const aadhaar = tokenParts[2];

    if (tokenType === "AP")
      tr.style.background = "#fce4ec";

    else if (tokenType === "AL")
      tr.style.background = "#e3f2fd";

    else if (tokenType === "AN")
      tr.style.background = "#ffffe0";

    else if (tokenType === "WP")
      tr.style.background = "#fce4ec";

    else if (tokenType === "WL")
      tr.style.background = "#e3f2fd";

    else if (tokenType === "WN")
      tr.style.background = "#ffffff";

    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${formatDateTime(row.created_at)}</td>
      <td>${formatDate(row.date)}</td>
      <td>${tokenCount}</td>
      <td>${tokenType}</td>
      <td>${row.eid || "-"}</td>
      <td>${row.name}</td>
      <td>${row.mobile}</td>
      <td>${row.gender}</td>
      <td>${row.age}</td>
      <td>${
        row.district
          ? row.district.split("/")[0].trim()
          : "-"
      }</td>

      <td>${
        row.service_type
          ? row.service_type.split("/")[0].trim()
          : "-"
      }</td>

      <td>${expectedTime}</td>

      <td style="
        color:${row.entry_time ? 'blue' : 'red'};
        font-weight:bold;
      ">
        ${
          row.entry_time
            ? formatDateTime(row.entry_time)
            : "Not Entered"
        }
      </td>

      <td style="
        color:${row.visited_at ? 'green' : 'red'};
        font-weight:bold;
      ">
        ${
          row.visited_at
            ? formatDateTime(row.visited_at)
            : "Not Visited"
        }
      </td>

      <td>
        ${
          row.entry_time && row.visited_at
            ? getTimeTaken(
                row.entry_time,
                row.visited_at
              )
            : "-"
        }
      </td>

      <td>${row.reference_of || "-"}</td>
    `;

    tbody.appendChild(tr);

  });
}

function downloadCSV() {
  if (!currentTableData.length) {
    alert("No data to export");
    return;
  }

  const header = [
    "S.No",
    "Token Created",
    "Appointment / Walk-in Date",
    "Token Count",
    "Token Type",
    "Full Token",
    "Name",
    "Mobile",
    "Service Type",
    "Gender",
    "Age",
    "District",
    "Reference Of",
    "Entry Time",
    "Visited Time"
  ];

  let csv = header.join(",") + "\n";

  currentTableData.forEach((row, i) => {
    // const { count, type, aadhaar } = parseToken(row.token);
const safeToken = row.token || "-";

const { count, type, aadhaar } =
  safeToken.includes("-")
    ? parseToken(safeToken)
    : {
        count: safeToken,
        type: row.token_type || "-",
        aadhaar: "-"
      };
    const cleanService = row.service_type
  ? row.service_type.split("/")[0].trim()
  : "";

    const cleanDistrict = row.district
      ? row.district.split("/")[0].trim()
      : "";

    const line = [
      i + 1,
      formatDateTime(row.created_at),
      row.date,
      count,
      type,
      row.token,
      row.name,
      row.mobile,
      cleanService,      
      row.gender,
      row.age,
      cleanDistrict,
      row.reference_of || "-",
      row.entry_time ? formatDateTime(row.entry_time) : "Not Entered",
      row.visited_at ? formatDateTime(row.visited_at) : "Not Visited"
    ]
      .map(v => `"${String(v ?? "").replace(/"/g, '""')}"`)
      .join(",");

    csv += line + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `tokens_${currentDate}.csv`;
  a.click();

  URL.revokeObjectURL(url);
}

function logout() {
  localStorage.removeItem("adminToken");
  window.location.href = "admin-login.html";
}
loadCalendar();
// loadPhysicalEntries();

