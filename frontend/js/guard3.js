const guard3Token = localStorage.getItem("guard3Token");
if (!guard3Token) {
  window.location.href = "guard-login3.html";
}
  async function loadEntries() {

  const res = await fetch(
    "http://localhost:5000/api/guard/physical-reference-entry",
    {
      headers: {
        "x-guard-token": guard3Token
      }
    }
  );

  const rows = await res.json();
  console.log(rows);
  const tbody =
    document.querySelector("#entryTable tbody");

  tbody.innerHTML = rows.map(r => `

    <tr>
      <td>${r.token}</td>
      <td>${r.name}</td>
      <td>${r.age}</td>
      <td>${r.mobile}</td>
      <td>${r.gender}</td>
      <td>${r.district}</td>
      <td>${r.service_type}</td>
      <td>${r.token_type}</td>
      <td>${r.created_at}</td>
      <td>${r.reference_of}</td>
    </tr>

  `).join("");
}

loadEntries();
document
  .getElementById("entryForm")
  .addEventListener("submit", async e => {

    e.preventDefault();

    const payload = {

      name:
        document.getElementById("name").value,

      age:
        document.getElementById("age").value,

      mobile:
        document.getElementById("mobile").value,

      aadhaar_last4:
        document.getElementById("aadhaar").value,

      gender:
        document.getElementById("gender").value,

      district:
        document.getElementById("district").value,

      service_type:
        document.getElementById("service_type").value,
      
      reference_of:
        document.getElementById("reference_of").value,

      token_type:
        document.getElementById("token_type").value
    };

    await fetch(
      "http://localhost:5000/api/guard/physical-reference-entry",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "x-guard-token": guard3Token
        },

        body: JSON.stringify(payload)
      }
    );

    e.target.reset();

    loadEntries();
  });
  function logout() {
  localStorage.removeItem("guard3Token");
  window.location.href = "guard-login3.html";
}