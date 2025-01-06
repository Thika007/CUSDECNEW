document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const instanceID = urlParams.get('Instance_ID');
  const containerCount = urlParams.get('Container_Count');

  if (instanceID) {
    fetch(`ownerfetchData.php?Instance_ID=${instanceID}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          // Populate owner details
          document.getElementById('exporterName').textContent = data.Exporter_Name || 'N/A';
          document.getElementById('declarantName').textContent = data.Declarant_Name || 'N/A';

          const formattedInvoiceValue = parseFloat(data.Invoice_Value).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
          document.getElementById('invoiceValue').textContent = formattedInvoiceValue || 'N/A';
          document.getElementById('exportCty').textContent = data.Export_Cty || 'N/A';

          // Populate the items table if it exists
          const itemsTable = document.getElementById('itemsTable');
          if (itemsTable && Array.isArray(data.items)) {
            data.items.forEach((item, index) => {
              const row = document.createElement('tr');
              row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.HS_Code}</td>
                <td>${item.Item_Description}</td>
              `;
              itemsTable.appendChild(row);
            });
          } else {
            console.warn("Element with ID 'itemsTable' not found or 'items' is not an array.");
          }

          // Display CUSDEC No based on Container Count
          const officeCode = data.Office_Code || 'N/A';
          const ser = data.Ser || 'N/A';
          const regNo = data.Reg_No || 'N/A';
          const regDate = data.Reg_Date || 'N/A';
          const cusdecNO = document.getElementById('cusdecNO');

          if (cusdecNO) {
            cusdecNO.innerHTML = containerCount > 0
              ? `<tr><td data-label="cusdec no">${officeCode} ${ser} ${regNo} of ${regDate}</td></tr>`
              : `<tr><td data-label="cusdec no">${officeCode} ${ser} ${regNo} of ${regDate} - LCL</td></tr>`;
          }

          // Add event listener for the "Yes I Do" button
          const ownButton = document.getElementById('own');
          ownButton?.addEventListener('click', () => {
            fetch('updateOwnership.php', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: `Instance_ID=${encodeURIComponent(instanceID)}&confirmation=1`
            })
              .then(response => response.json())
              .then(result => {
                if (result.success) {
                  window.location.href = `timeline.html?Instance_ID=${encodeURIComponent(data.Instance_ID)}&Consignee_Name=${encodeURIComponent(data.Consignee_Name)}&Office_Code=${encodeURIComponent(data.Office_Code)}&Ser=${encodeURIComponent(data.Ser)}&Reg_No=${encodeURIComponent(data.Reg_No)}&Reg_Date=${encodeURIComponent(data.Reg_Date)}&Container_Count=${encodeURIComponent(data.Container_Count)}`;
                } else {
                  console.error(result.error);
                }
              })
              .catch(error => console.error('Error updating ownership:', error));
          });

          // Add event listener for the "No I Don't" button
          const notOwnerButton = document.getElementById('nown');
          notOwnerButton?.addEventListener('click', () => {
            const notOwnerModal = document.getElementById('notOwnerModal');
            if (notOwnerModal) {
              notOwnerModal.style.display = "block";

              document.getElementById('Office_Code').textContent = data.Office_Code || 'N/A';
              document.getElementById('Reg_No').textContent = data.Reg_No || 'N/A';
              document.getElementById('Reg_Date').textContent = data.Reg_Date || 'N/A';

              // Close modal when clicking outside or on the close button
              window.onclick = function (event) {
                if (event.target == notOwnerModal) {
                  notOwnerModal.style.display = "none";
                }
              };
              const closeButton = document.getElementsByClassName("close")[0];
              closeButton.onclick = function () {
                notOwnerModal.style.display = "none";
              };

              // Redirect to previous page when clicking "Continue"
              const continueButton = document.getElementsByClassName("continue")[0];
              continueButton.onclick = function () {
                window.history.back();
              };
            }
          });
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  } else {
    console.error("Instance_ID not found in URL parameters.");
  }
});
