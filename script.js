

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

function generatePrintPreview() {
  const custName = document.getElementById("custName").value;
  const rows = document.querySelectorAll(".warranty-form-row");

  let warrantyText = `<h1>Warranty Sheet</h1><p><strong>Customer Name:</strong> ${custName}</p>`;

  // Mandatory warranty rules
  const warrantyLine1 = "This limited warranty lasts for the specified period and begins on the specified start date.";
  const warrantyLine2 = "Machines that are damaged from improper usage that are obvious will not be covered under warranty. Example: Machine fall and break body parts etc.";
  const warrantyLine3 = "Please contact TotalTools repair center ONLY with your receipt as proof of purchase to maintain warranty integrity. Machines taken in with damages under warranty will be inspected by trained technicians.";
  const warrantyLine4 = "Warranty will be void if the machine is opened by unauthorized persons.";
  const warrantyLine5 = "No diagnostic labor charges for defective warranted parts, which will be replaced at no cost if found defective.";

  rows.forEach((row, index) => {
    const brand = row.querySelector(".brand").value;
    const warrantyPeriod = row.querySelector(".warrantyPeriod").value;
    const model = row.querySelector(".model").value;
    const serialNumber = row.querySelector(".serialNumber").value;
    const armature = row.querySelector(".armature").value;
    const twoCycle = row.querySelector(".twoCycle").value;
    const machineType = row.querySelector(".machineType").value;

    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString("default", { month: "long" });
    const year = today.getFullYear();

    // Start machine block
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
      warrantyText += `
        <p>For two-cycle machines, use 150ml 2-cycle oil per gallon of 90 octane gasoline. Only use recommended oils like Stihl, Echo, or Poulan. Not following this voids warranty.</p>
      `;

      if (machineType === "Brush Cutter") {
        warrantyText += `<p>Ensure the shaft isn't bent and body parts aren't damaged. These aren't covered under warranty.</p>`;
      } else if (machineType === "Chainsaw") {
        warrantyText += `<p>Inspect the bar, chain, and outer cover for damage before purchase. Warranty excludes physical damage.</p>`;
      }
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

  // Open a new print window
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
    <head>
      <title>Warranty Print Preview</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1, h2 { text-align: center; }
        .warranty-info { margin-top: 20px; }
        @media print {
          div { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      ${warrantyText}
      <footer style="margin-top: 30px; font-size: 12px; text-align: center; color: #666;">
        Thank you for your purchase!
      </footer>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.onload = () => printWindow.print();
}


async function saveWarrantyToServer() {
  const custName = document.getElementById("custName").value;
  const rows = document.querySelectorAll(".warranty-form-row");
  const machines = [];

  rows.forEach(row => {
    machines.push({
      brand: row.querySelector(".brand").value,
      warrantyPeriod: row.querySelector(".warrantyPeriod").value,
      model: row.querySelector(".model").value,
      serialNumber: row.querySelector(".serialNumber").value,
      armature: row.querySelector(".armature").value,
      twoCycle: row.querySelector(".twoCycle").value,
      machineType: row.querySelector(".machineType").value
    });
  });

  try {
    const res = await fetch("http://localhost:5000/api/warranty/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ customerName: custName, machines })
    });

    const data = await res.json();
    alert(data.msg || "Warranty saved.");
  } catch (err) {
    console.error("Save failed:", err);
    alert("Error saving warranty");
  }
}

async function searchWarranty() {
  const date = document.getElementById('searchDate').value;
  if (!date) return alert("Please select a date");

  try {
    const res = await fetch(`http://localhost:5000/api/warranty/search?date=${date}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    const tbody = document.querySelector('#warrantyResults tbody');
    tbody.innerHTML = "";

    data.forEach(warranty => {
      warranty.machines.forEach(machine => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${warranty.customerName}</td>
          <td>${machine.brand}</td>
          <td>${machine.model}</td>
          <td>${machine.serialNumber}</td>
          <td>${new Date(warranty.createdAt).toLocaleDateString()}</td>
        `;
        tbody.appendChild(tr);
      });
    });

    if (data.length === 0) {
      alert("No warranties found for this week.");
    }
  } catch (err) {
    console.error("Search failed", err);
    alert("Error searching warranty.");
  }
}

async function searchWarrantiesByDate() {
  const dateInput = document.getElementById("searchDate").value;
  if (!dateInput) {
    alert("Please select a date");
    return;
  }

  const response = await fetch(`http://localhost:5000/api/warranty/search?date=${dateInput}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  const tableBody = document.querySelector("#warrantyTable tbody");
  tableBody.innerHTML = ""; // clear old results

  if (data.length === 0) {
    alert("No warranties found for that week.");
    document.getElementById("searchResults").style.display = "none";
    return;
  }

  data.forEach(warranty => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${warranty.customerName}</td>
      <td>${new Date(warranty.createdAt).toLocaleDateString()}</td>
      <td>${warranty.machines.length}</td>
      <td><button onclick='reprintWarranty(${JSON.stringify(warranty)})'>Reprint</button></td>
    `;
    tableBody.appendChild(row);
  });

  document.getElementById("searchResults").style.display = "block";



}

function toggleSearchPanel() {
  const panel = document.getElementById('searchResults');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}


function reprintWarranty(warranty) {
  let warrantyText = `<h1>Warranty Sheet</h1><p><strong>Customer Name:</strong> ${warranty.customerName}</p>`;

  const warrantyLine1 = "This limited warranty lasts for the specified period and begins on the specified start date.";
  const warrantyLine2 = "Machines that are damaged from improper usage that are obvious will not be covered under warranty. Example: Machine fall and break body parts etc.";
  const warrantyLine3 = "Please contact TotalTools repair center ONLY with your receipt as proof of purchase to maintain warranty integrity. Machines taken in with damages under warranty will be inspected by trained technicians.";
  const warrantyLine4 = "Warranty will be void if the machine is opened by unauthorized persons.";
  const warrantyLine5 = "No diagnostic labor charges for defective warranted parts, which will be replaced at no cost if found defective.";

  warranty.machines.forEach((m, index) => {
    const createdAt = new Date(warranty.createdAt);
    const day = createdAt.getDate();
    const month = createdAt.toLocaleString("default", { month: "long" });
    const year = createdAt.getFullYear();

    warrantyText += `
      <div class="warranty-info">
        <h2>Machine ${index + 1}</h2>
        <p><strong>Brand:</strong> ${m.brand}</p>
        <p><strong>Warranty Period:</strong> ${m.warrantyPeriod}</p>
        <p><strong>Machine Model:</strong> ${m.model}</p>
        <p><strong>Serial Number:</strong> ${m.serialNumber}</p>
        <p>${warrantyLine1.replace("the specified period", m.warrantyPeriod).replace("specified start date", `${day} of ${month}, ${year}`)}</p>
    `;

    if (m.twoCycle === "YES") {
      warrantyText += `
        <p>For two cycle machines, we recommend 150ml 2 cycle oil per gallon of 90 gasoline. Recommended oils (Stihl, Echo, Poulan) should be used in all machines. If this instruction is not followed, the warranty will be void.</p>
      `;
      if (m.machineType === "Brush Cutter") {
        warrantyText += `
          <p>Upon purchase of brush cutter, please ensure that the shaft is not bent, shroud and other outer parts are not damaged. Warranty will not cover the above-mentioned items.</p>
        `;
      } else if (m.machineType === "Chainsaw") {
        warrantyText += `
          <p>Chainsaw bar, chain, engine cover, and outer parts should be inspected by all customers to ensure there is no physical damage.</p>
        `;
      }
    }

    warrantyText += `
      <p>${warrantyLine2}</p>
      <p>${warrantyLine3}</p>
      <p>${warrantyLine4}</p>
      <p>${warrantyLine5}</p>
      </div>
    `;

    if (index < warranty.machines.length - 1) {
      warrantyText += `<div style="page-break-after: always;"></div>`;
    }
  });

  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
    <head>
      <title>Warranty Sheet Print Preview</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1, h2 { text-align: center; }
        .warranty-info { margin-top: 20px; }
        @media print {
          div { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      ${warrantyText}
      <footer style="margin-top: 30px; font-size: 12px; text-align: center; color: #666;">
        Thank you for your purchase!
      </footer>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.onload = function () {
    printWindow.print();
  };
}



function resetForm() {
  document.getElementById('warrantyForm').reset();
  const container = document.getElementById('machineForms');
  while (container.children.length > 1) {
    container.removeChild(container.lastChild);
  }
}


