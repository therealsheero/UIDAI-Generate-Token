const guard2Token = localStorage.getItem("guard2Token");
if (!guard2Token) {
  window.location.href = "guard-login2.html";
}

const tbody = document.querySelector("#tokenTable tbody");
let currentTableData = [];
let TOKENS_PER_HOUR = 40; 
function isUndoAllowed(visitedAt) {
  if (!visitedAt) return false;

  const visitedTime = new Date(visitedAt).getTime();
  const now = Date.now();
  const diffMinutes = (now - visitedTime) / 60000;

  return diffMinutes <= 10;
}
//function getExpectedTime(tokenNumber) {
//  const n = Number(tokenNumber);
//
//  if (n <= 40) return "10 AM - 11 AM";
//  if (n <= 80) return "11 AM - 12 PM";
//  if (n <= 120) return "12 PM - 1 PM";
//  if (n <= 160) return "2 PM - 3 PM";
//  if (n <= 200) return "3 PM - 4 PM";
//  if (n <= 240) return "4 PM - 5 PM";
//  return "5 PM - 6 PM";
//}
function getExpectedTime(tokenNumber) {

  const n = Number(tokenNumber);
  const slotIndex = Math.floor((n - 1) / TOKENS_PER_HOUR);

  const startHour = 10 + slotIndex;
  const endHour = startHour + 1;

  const format = h => {
    const hour = h > 12 ? h - 12 : h;
    const ampm = h >= 12 ? "PM" : "AM";
    return `${hour} ${ampm}`;
  };

  return `${format(startHour)} - ${format(endHour)}`;
}
async function undoVisited(tokenId) {
  await fetch("http://localhost:5000/api/guard/undo-visit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-guard-token": guard2Token
    },
    body: JSON.stringify({ token_id: tokenId })
  });

  loadTokens();
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
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
    count: parts[0],     // 001
    type: parts[1],      // WN / AP / WL
    aadhaar: parts[2]    // 1234
  };
}
async function markEntry(tokenId) {
  await fetch("http://localhost:5000/api/guard/entry", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-guard-token": guard2Token
    },
    body: JSON.stringify({ token_id: tokenId })
  });

  loadTokens();
}
async function loadTokens() {
    const tphRes = await fetch("http://localhost:5000/api/guard/tokens-per-hour2", {
        headers: { "x-guard-token": guard2Token }
        });

  const tphData = await tphRes.json();
  TOKENS_PER_HOUR = tphData.tokensPerHour || 40;
  tbody.innerHTML = "<tr><td colspan='13'>Loading...</td></tr>";

  const res = await fetch("http://localhost:5000/api/guard/service-tokens", {
    headers: { "x-guard-token": guard2Token }
  });

  if (!res.ok) {
    alert("Session expired");
    logout();
    return;
  }

  const data = await res.json();
  currentTableData = data;
  tbody.innerHTML = "";
  const total = data.length;
  const visited = data.filter(r => r.visited === 1).length;
  const pending = total - visited;

  data.forEach((row, i) => {
    const tr = document.createElement("tr");
    const tokenParts = row.token.split("-");
    const tokenCount = tokenParts[0];
    const expectedTime = getExpectedTime(tokenCount);

    const { count, type } = parseToken(row.token);
    tr.classList.add(type.toLowerCase());
  
let visitedCell = "";

if (row.visited === 1) {

  if (isUndoAllowed(row.visited_at)) {

    visitedCell = `
      Served
      <button onclick="undoVisited(${row.id})">
        Undo
      </button>
    `;

  } else {

    visitedCell = "Served";
  }

} else {

  visitedCell = `
    <button onclick="markVisited(${row.id})">
      Serve
    </button>
  `;
}


    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${formatDateTime(row.created_at)}</td>
      <td>${formatDate(row.date)}</td>
      <td>${count}</td>
      <td>${type}</td>
      <td>${row.name}</td>
      <td>${row.mobile}</td>
      <td>${row.gender}</td>
      <td>${row.age}</td>
      <td>${row.district}</td>
      <td>${row.service_type}</td>
      <td>
  ${
    row.entry_time
      ? formatDateTime(row.entry_time)
      : "-"
  }
</td>
      <td style="text-align:center">${visitedCell}</td>
      <td>
        ${row.visited_at
          ? formatDateTime(row.visited_at)
          : "-"}
      </td>
    `;

    tbody.appendChild(tr);
  });
}
async function markVisited(tokenId) {
  await fetch("http://localhost:5000/api/guard/visit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-guard-token": guard2Token
    },
    body: JSON.stringify({ token_id: tokenId })
  });
  loadTokens();
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
    "Gender",
    "Age",
    "PWD",
    "District",
    "Service"
  ];

  let csv = header.join(",") + "\n";

  currentTableData.forEach((row, i) => {
    const { count, type, aadhaar } = parseToken(row.token);

    const line = [
      i + 1,
      formatDateTime(row.created_at),
      formatDate(row.date),
      count,
      type,
      row.token,
      row.name,
      row.mobile,
      row.gender,
      row.district,
      row.service_type
    ]
      .map(v => `"${String(v ?? "").replace(/"/g, '""')}"`)
      .join(",");

    csv += line + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `guard_tokens_today.csv`;
  a.click();

  URL.revokeObjectURL(url);
}

function logout() {
  localStorage.removeItem("guard2Token");
  window.location.href = "guard-login2.html";
}

loadTokens();


