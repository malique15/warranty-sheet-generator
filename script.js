function generatePrintPreview() {
  const custName = document.getElementById("custName").value;
  const rows = document.querySelectorAll(".warranty-form-row");
  let warrantyText = `<h1>Warranty Sheet</h1><p><strong>Customer Name:</strong> ${custName}</p>`;

  // Define mandatory warranty lines
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

    // Start creating the warranty details for each machine
    warrantyText += `
      <div class="warranty-info">
        <h2>Machine ${index + 1}</h2>
        <p><strong>Brand:</strong> ${brand}</p>
        <p><strong>Warranty Period:</strong> ${warrantyPeriod}</p>
        <p><strong>Machine Model:</strong> ${model}</p>
        <p><strong>Serial Number:</strong> ${serialNumber}</p>
        <p>${warrantyLine1.replace("the specified period", warrantyPeriod).replace("specified start date", `${day} of ${month}, ${year}`)}</p>
    `;

    // Add specific text for 2-cycle machines
    if (twoCycle === "YES") {
      warrantyText += `
        <p>For two cycle machines, we recommend 150ml 2 cycle oil per gallon of 90 gasoline. Recommended oils (Stihl, Echo, Poulan) should be used in all machines. If this instruction is not followed, the warranty will be void.</p>
      `;
      if (machineType === "Brush Cutter") {
        warrantyText += `
          <p>Upon purchase of brush cutter, please ensure that the shaft is not bent, shroud and other outer parts are not damaged. Warranty will not cover the above-mentioned items.</p>
        `;
      } else if (machineType === "Chainsaw") {
        warrantyText += `
          <p>Chainsaw bar, chain, engine cover, and outer parts should be inspected by all customers to ensure there is no physical damage.</p>
        `;
      }
    }

    // Add mandatory warranty lines
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

  // Generate the print preview in a new window
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

function addMachineRow() {
  const machineForms = document.getElementById("machineForms");
  const newRow = document.createElement("div");
  newRow.classList.add("warranty-form-row");

  //custom card
  //document.getElementById("machineForms").appendChild("warranty-form-row");

  newRow.innerHTML = `
  <div style="margin-top: 20px;" id="machineForms">
          <div class="warranty-form-row">

            <div class="row-1">

              <div class="brandCont">
                <label for="brand">Brand:</label>
                <div class="customSelect">
                  <select class="brand">
                    <option value="" selected disabled>Select Brand</option>
                    <option value="Fixtec">Fixtec</option>
                    <option value="Stihl">Stihl</option>
                    <option value="DeWalt">DeWalt</option>
                    <option value="Rigid">Rigid</option>
                    <option value="Echo">Echo</option>
                  </select>
                </div>
              </div>

              <div class="warrantyCont">
                <label for="warrantyPeriod">Warranty:</label>
                <div class="customSelect">
                  <select class="warrantyPeriod">
                    <option value="" selected disabled>Select Period</option>
                    <option value="3 Months">3 Months</option>
                    <option value="7 Months">7 Months</option>
                    <option value="1 Year">1 Year</option>
                  </select>
                </div>
              </div>

              <div class="modelCont">
                <label for="model">Model:</label>
                <input type="text" class="model" placeholder="Enter Model" required>
              </div>

              <div class="serialCont">
                <label for="serialNumber">Serial Num:</label>
                <input type="text" class="serialNumber" placeholder="Enter Serial Number" required>
              </div>


            </div>




            <label for="armature">Armature:</label>
            <div class="customSelect">
              <select class="armature">
                <option value="" selected disabled>Select Option</option>
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </div>


            <label for="twoCycle">2-Stroke:</label>
            <div class="customSelect">
              <select class="twoCycle">
                <option value="" selected disabled>Select Option</option>
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </div>


            <label style="display: none;" for="machineType">Machine Type:</label>
            <select style="display: none;" class="machineType">
              <option value="" selected disabled>Select Type</option>
              <option value="Brush Cutter">Brush Cutter</option>
              <option value="Chainsaw">Chainsaw</option>
            </select>

            <!-- Remove button -->
            <button type="button" onclick="removeRow(this)">Remove</button>
          </div>
        </div>`;
  machineForms.appendChild(newRow);
}

function toggleMachineType(selectElement) {
  const row = selectElement.parentNode;
  const twoCycle = row.querySelector(".twoCycle");
  const machineTypeLabel = row.querySelector("label[for='machineType']");
  const machineTypeDropdown = row.querySelector(".machineType");

  if (twoCycle.value === "YES") {
    machineTypeLabel.style.display = "inline";
    machineTypeDropdown.style.display = "inline";
  } else {
    machineTypeLabel.style.display = "none";
    machineTypeDropdown.style.display = "none";
    machineTypeDropdown.value = ""; // Reset machine type if hidden
  }
}

function removeRow(button) {
  const row = button.parentNode;
  row.remove();
}

function resetForm() {
  document.getElementById("warrantyForm").reset();
  const machineForms = document.getElementById("machineForms");
  machineForms.innerHTML = `
    <div class="warranty-form-row">
      <label for="brand">Brand:</label>
      <select class="brand">
        <option value="" selected disabled>Select Brand</option>
        <option value="Fixtec">Fixtec</option>
        <option value="Stihl">Stihl</option>
        <option value="DeWalt">DeWalt</option>
        <option value="Rigid">Rigid</option>
        <option value="Echo">Echo</option>
      </select>
      <label for="warrantyPeriod">Warranty Period:</label>
      <select class="warrantyPeriod">
        <option value="" selected disabled>Select Period</option>
        <option value="3 Months">3 Months</option>
        <option value="7 Months">7 Months</option>
        <option value="1 Year">1 Year</option>
      </select>
      <label for="model">Machine Model:</label>
      <input type="text" class="model" placeholder="Enter Model" required>
      <label for="serialNumber">Serial Number:</label>
      <input type="text" class="serialNumber" placeholder="Enter Serial Number" required>
      <label for="armature">Armature:</label>
      <select class="armature">
        <option value="" selected disabled>Select Option</option>
        <option value="YES">YES</option>
        <option value="NO">NO</option>
      </select>
      <label for="twoCycle">2 Stroke Engine:</label>
      <select class="twoCycle" onchange="toggleMachineType(this)">
        <option value="" selected disabled>Select Option</option>
        <option value="YES">YES</option>
        <option value="NO">NO</option>
      </select>
      <label for="machineType" style="display: none;">Machine Type:</label>
      <select class="machineType" style="display: none;">
        <option value="" selected disabled>Select Type</option>
        <option value="Brush Cutter">Brush Cutter</option>
        <option value="Chainsaw">Chainsaw</option>
      </select>
      <button type="button" onclick="removeRow(this)">Remove</button>
    </div>`;
}
