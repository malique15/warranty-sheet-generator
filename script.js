// ----------------- AUTH & SESSION ------------------
let token = localStorage.getItem('token');

function handleLogin() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('warrantySection').style.display = 'block';
        token = data.token;
      } else {
        document.getElementById('loginStatus').innerText = 'Login failed';
      }
    })
    .catch(err => console.error(err));
}

async function handleRegister() {
  const username = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;
  const location = document.getElementById('registerLocation').value;

  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, location })
    });

    const data = await response.json();
    if (response.ok) {
      alert("✅ Registered successfully! Now log in.");
    } else {
      alert("❌ Registration failed: " + data.message);
    }
  } catch (err) {
    console.error(err);
    alert("❌ Error during registration");
  }
}

function logoutUser() {
  localStorage.removeItem('token');
  document.getElementById('loginContainer').style.display = 'block';
  document.getElementById('warrantySection').style.display = 'none';
}

window.onload = () => {
  if (token) {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('warrantySection').style.display = 'block';
  }
};

// --------------- WARRANTY SHEET FUNCTIONS ------------------

function addMachineRow() {
  const formRow = document.querySelector('.warranty-form-row');
  const newRow = formRow.cloneNode(true);
  newRow.querySelectorAll('input').forEach(input => input.value = '');
  newRow.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
  document.getElementById('machineForms').appendChild(newRow);

  // Auto scroll to new row
  setTimeout(() => newRow.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
}

function removeRow(button) {
  const row = button.closest('.warranty-form-row');
  const container = document.getElementById('machineForms');
  if (container.children.length > 1) {
    row.remove();
  }
}

function toggleMachineType(select) {
  const machineTypeSelect = select.parentElement.nextElementSibling.nextElementSibling;
  const label = machineTypeSelect.previousElementSibling;
  if (select.value === 'YES') {
    machineTypeSelect.style.display = 'inline-block';
    label.style.display = 'inline-block';
  } else {
    machineTypeSelect.style.display = 'none';
    label.style.display = 'none';
    machineTypeSelect.selectedIndex = 0;
  }
}

// Print preview & save
function generatePrintPreview() {
  const custName = document.getElementById("custName").value;
  const rows = document.querySelectorAll(".warranty-form-row");

  let warrantyText = `<h1>Warranty Sheet</h1><p><strong>Customer Name:</strong> ${custName}</p>`;

  const warrantyLine1 = "This limited warranty lasts for the specified period and begins on the specified start date.";
  const warrantyLine2 = "Machines that are damaged from improper usage that are obvious will not be covered under warranty.";
  const warrantyLine3 = "Please contact TotalTools repair center ONLY with your receipt as proof of purchase.";
  const warrantyLine4 = "Warranty will be void if the machine is opened by unauthorized persons.";
  const warrantyLine5 = "No diagnostic labor charges for defective warranted parts.";

  rows.forEach((row, index) => {
    const brand = row.querySelector(".brand").value;
    const warrantyPeriod = row.querySelector(".warrantyPeriod").value;
    const model = row.querySelector(".model").value;
    const serialNumber = row.querySelector(".serialNumber").value;
    const twoCycle = row.querySelector(".twoCycle").value;
    const machineType = row.querySelector(".machineType").value;

    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString("default", { month: "long" });
    const year = today.getFullYear();

    warrantyText += `
      <div class="warranty-info">
        <h2>Machine ${index + 1}</h2>
        <p><strong>Brand:</strong> ${brand}</p>
        <p><strong>Warranty Period:</strong> ${warrantyPeriod}</p>
        <p><strong>Model:</strong> ${model}</p>
        <p><strong>Serial Number:</strong> ${serialNumber}</p>
        <p>${warrantyLine1.replace("the specified period", warrantyPeriod).replace("specified start date", `${day} of ${month}, ${year}`)}</p>
    `;

    if (twoCycle === "YES") {
      warrantyText += `<p>Two-cycle usage instructions here...</p>`;
    }

    warrantyText += `
      <p>${warrantyLine2}</p>
      <p>${warrantyLine3}</p>
      <p>${warrantyLine4}</p>
      <p>${warrantyLine5}</p>
    </div>`;

    if (index < rows.length - 1) {
      warrantyText += `<div style="page-break-after: always;"></div>`;
    }
  });

  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
    <head>
      <title>Warranty Print Preview</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1, h2 { text-align: center; }
        .warranty-info { margin-top: 20px; }
      </style>
    </head>
    <body>
      ${warrantyText}
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.onload = () => printWindow.print();

  saveWarrantyToServer();
}

// Save warranty to backend
async function saveWarrantyToServer() {
  const custName = document.getElementById("custName").value;
  const rows = document.querySelectorAll(".warranty-form-row");

  const machineDetails = Array.from(rows).map(row => ({
    brand: row.querySelector(".brand").value,
    warrantyPeriod: row.querySelector(".warrantyPeriod").value,
    model: row.querySelector(".model").value,
    serialNumber: row.querySelector(".serialNumber").value,
    armature: row.querySelector(".armature").value,
    twoCycle: row.querySelector(".twoCycle").value,
    machineType: row.querySelector(".machineType").value,
  }));

  try {
    const response = await fetch("http://localhost:5000/api/warranty/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ customerName: custName, machineDetails })
    });

    const result = await response.json();
    alert(result.msg || "✅ Warranty saved successfully.");
  } catch (error) {
    console.error(error);
    alert("❌ Error saving warranty");
  }
}

// Search warranties (now opens modal)
async function searchWarrantiesByDate() {
  const date = document.getElementById('searchDate').value;
  if (!date) return alert('Please select a date.');

  try {
    const response = await fetch(`http://localhost:5000/api/warranty/search?date=${date}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    if (!response.ok) throw new Error("Warranty search failed");
    const warranties = await response.json();

    let html = `<table><tr>
      <th>Customer</th><th>Brand</th><th>Model</th><th>Serial</th><th>Date</th><th>Action</th>
    </tr>`;

    if (warranties.length === 0) {
      html += `<tr><td colspan="6" style="text-align:center;">No warranties found</td></tr>`;
    } else {
      warranties.forEach(w => {
        w.machineDetails.forEach(m => {
          html += `<tr>
            <td>${w.customerName}</td>
            <td>${m.brand}</td>
            <td>${m.model}</td>
            <td>${m.serialNumber}</td>
            <td>${new Date(w.createdAt).toLocaleDateString()}</td>
            <td><button onclick='reprintWarrantyFromData(${JSON.stringify(w)})'>Reprint</button></td>
          </tr>`;
        });
      });
    }

    html += `</table>`;

    // Set modal title & count
    const searchDateFormatted = new Date(date).toLocaleDateString();
    document.getElementById("modalTitle").innerText = `Warranty Search Results for ${searchDateFormatted}`;
    document.getElementById("warrantyCount").innerText = `Total Warranties Found: ${warranties.length}`;

    document.getElementById("searchResultsContainer").innerHTML = html;
    openSearchModal();

  } catch (err) {
    console.error(err);
    alert("Error searching warranties.");
  }
}


// Reprint directly from warranty data
function reprintWarrantyFromData(warranty) {
  let warrantyText = `<h1>Warranty Sheet</h1><p><strong>Customer Name:</strong> ${warranty.customerName}</p>`;
  warranty.machineDetails.forEach((m, index) => {
    warrantyText += `<h2>Machine ${index + 1}</h2><p>${m.brand} - ${m.model}</p>`;
  });

  const printWindow = window.open("", "_blank");
  printWindow.document.write(`<html><body>${warrantyText}</body></html>`);
  printWindow.document.close();
  printWindow.onload = () => printWindow.print();
}

// Modal controls
function openSearchModal() {
  document.getElementById('modalOverlay').style.display = 'block';
  document.getElementById('searchModal').style.display = 'block';
}

function closeSearchModal() {
  document.getElementById('modalOverlay').style.display = 'none';
  document.getElementById('searchModal').style.display = 'none';
}


window.resetForm = function () {
  // Reset form
  document.getElementById('warrantyForm').reset();

  // Keep only one machine form row
  const container = document.getElementById('machineForms');
  while (container.children.length > 1) {
    container.removeChild(container.lastChild);
  }

  // Scroll smoothly to top so the form is visible
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};


