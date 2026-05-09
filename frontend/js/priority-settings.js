const adminToken = localStorage.getItem("adminToken");

if (!adminToken) {
  window.location.href = "admin-login.html";
}
async function loadSettings() {

  const res = await fetch("http://localhost:5000/api/admin/priority-settings", {
    headers: { "x-admin-token": adminToken }
  });

  const data = await res.json();

  const rules = {};
  data.rules.forEach(r => rules[r.rule_key] = r.rule_value);

  document.getElementById("childAge").value = rules.child_age_limit;
  document.getElementById("seniorAge").value = rules.senior_age_limit;
  document.getElementById("femaleAge").value = rules.female_priority_age;

  renderDistricts(data.districts);
}

const districts = [
  "Agra","Aligarh","Ambedkar Nagar","Amethi","Amroha",
  "Auraiya","Ayodhya","Azamgarh","Baghpat","Bahraich",
  "Ballia","Balrampur","Banda","Barabanki","Bareilly",
  "Basti","Bhadohi","Bijnor","Budaun","Bulandshahr",
  "Chandauli","Chitrakoot","Deoria","Etah","Etawah",
  "Farrukhabad","Fatehpur","Firozabad","Gautam Buddha Nagar",
  "Ghaziabad","Ghazipur","Gonda","Gorakhpur","Hamirpur",
  "Hapur","Hardoi","Hathras","Jalaun","Jaunpur",
  "Jhansi","Kannauj","Kanpur Dehat","Kanpur Nagar",
  "Kasganj","Kaushambi","Kheri","Kushinagar","Lalitpur",
  "Lucknow","Maharajganj","Mahoba","Mainpuri","Mathura",
  "Mau","Meerut","Mirzapur","Moradabad","Muzaffarnagar",
  "Pilibhit","Pratapgarh","Prayagraj","Raebareli","Rampur",
  "Saharanpur","Sambhal","Sant Kabir Nagar","Shahjahanpur",
  "Shamli","Shravasti","Siddharthnagar","Sitapur",
  "Sonbhadra","Sultanpur","Unnao","Varanasi"
];

function loadDistrictDropdown() {
  const select = document.getElementById("districtSelect");
  select.innerHTML = "";

  districts.forEach(d => {
    const option = document.createElement("option");
    option.value = d;
    option.textContent = d;
    select.appendChild(option);
  });
}

function renderDistricts(districts) {
  const list = document.getElementById("districtList");
  list.innerHTML = "";

  districts.forEach(d => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${d.district}
      <button class="removeBtn" style="margin-left:10px;padding:4px 10px;border:none;background:#d9534f;color:white;border-radius:4px;cursor:pointer;" onclick="deleteDistrict('${d.district}')">
  Remove
</button>
    `;
    li.style.display = "flex";
li.style.justifyContent = "space-between";
li.style.alignItems = "center";

    list.appendChild(li);
  });
}

async function saveRules() {

  const child_age_limit = document.getElementById("childAge").value;
  const senior_age_limit = document.getElementById("seniorAge").value;
  const female_priority_age = document.getElementById("femaleAge").value;

  await fetch("http://localhost:5000/api/admin/update-priority-rules", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": adminToken
    },
    body: JSON.stringify({
      child_age_limit,
      senior_age_limit,
      female_priority_age
    })
  });

  alert("Rules updated");
}

async function addDistrict() {

  const district = document.getElementById("districtSelect").value;

  if (!district) {
    alert("Select district");
    return;
  }

  await fetch("http://localhost:5000/api/admin/add-priority-district", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": adminToken
    },
    body: JSON.stringify({ district })
  });

  loadSettings();
}

async function deleteDistrict(district) {

  await fetch("http://localhost:5000/api/admin/delete-priority-district", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": adminToken
    },
    body: JSON.stringify({ district })
  });

  loadSettings();
}

async function loadHolidays() {

  const res = await fetch("http://localhost:5000/api/admin/holidays", {
    headers: { "x-admin-token": adminToken }
  });

  const data = await res.json();

  const list = document.getElementById("holidayList");
  list.style.listStyle = "none";   
list.style.paddingLeft = "0";    
  list.innerHTML = "";

  data.forEach(h => {
    const li = document.createElement("li");

    li.innerHTML = `
      <b>${h.date}</b> - ${h.reason}
      <button class="removeBtn" style="margin-left:10px;padding:4px 10px;border:none;background:#d9534f;color:white;border-radius:4px;cursor:pointer;" onclick="deleteHoliday('${h.date}')">
  Remove
</button>
    `;
    li.style.display = "flex";
li.style.justifyContent = "space-between";
li.style.alignItems = "center";

    list.appendChild(li);
  });
}

async function addHoliday() {

  const date = document.getElementById("holidayDate").value;
  const reason = document.getElementById("holidayReason").value;
//  const type = "Declared";

  if (!date) {
    alert("Select date");
    return;
  }

  await fetch("http://localhost:5000/api/admin/add-holiday", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": adminToken
    },
    body: JSON.stringify({ date, reason})
  });

  loadHolidays();
}

async function deleteHoliday(date) {

  await fetch("http://localhost:5000/api/admin/delete-holiday", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": adminToken
    },
    body: JSON.stringify({ date })
  });

  loadHolidays();
}


loadDistrictDropdown();
loadSettings();
loadHolidays();
