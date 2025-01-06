$(document).ready(function () {
    const dataTable = $('#dataTable').DataTable({
        info: false,
        ordering: false,
        paging: false,
        searching: true // Enable searching
    });

    const searchButton = document.getElementById('searchButton');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorAlert = document.getElementById('errorAlert');
    const tableBody = document.getElementById('tableBody');

    searchButton.addEventListener('click', fetchData);

    function fetchData() {
        const query = document.getElementById('searchBar').value.trim();
        if (query) {
            loadingSpinner.style.display = 'inline-block';
            errorAlert.style.display = 'none';

            fetch(`fetchData.php?Consignee_TIN=${query}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    tableBody.innerHTML = ''; // Clear existing data
                    data.forEach(row => {
                        const tr = document.createElement('tr');
                        tr.setAttribute('data-instance-id', row.Instance_ID);
                        tr.innerHTML = `
                            <td style="font-size: small;" style="text-align: center;">${row.Consignee_Name}</td>
                            <td style="text-align: center;">${row.Office_Code}</td>
                            <td style="text-align: center;">${row.Reg_Date}</td>
                            <td style="text-align: center;">${row.Ser}</td>
                            <td style="text-align: center;">${row.Reg_No}</td>
                            <td style="font-size: small;" style="text-align: center;">${row.Declarant_Name}</td>    
                                 
                        `;
                        tr.addEventListener('dblclick', () => {
                            if (row.has_ownership) {
                                // Redirect to timeline.html with query parameters
                                window.location.href = `timeline.html?Instance_ID=${row.Instance_ID}&Consignee_Name=${row.Consignee_Name}
                                &Office_Code=${row.Office_Code}&Ser=${row.Ser}&Reg_No=${row.Reg_No}&Reg_Date=${row.Reg_Date}&Container_Count=${row.Container_Count}`;
                            } else {
                                // Redirect to owner.html if ownership does not exist
                                window.location.href = `owner.html?Instance_ID=${row.Instance_ID}`;
                            }
                        });

                        tableBody.appendChild(tr);
                    });

                    // Refresh the DataTable to show new data
                    dataTable.clear().rows.add(tableBody.rows).draw();
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    errorAlert.style.display = 'block';
                })
                .finally(() => {
                    loadingSpinner.style.display = 'none';
                });
        } else {
            tableBody.innerHTML = '';
        }
    }
});