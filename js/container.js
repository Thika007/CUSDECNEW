document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const instanceID = urlParams.get('Instance_ID');

    if (instanceID) {
        fetch(`fetchContainerData.php?Instance_ID=${instanceID}`)
            .then(response => response.json())
            .then(data => {
                console.log('Fetched data:', data);

                if (Array.isArray(data)) {
                    const tableBody = document.querySelector('#operationTable tbody');
                    tableBody.innerHTML = ''; // Clear existing table rows

                    data.forEach(operation => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td style="text-align: center;" >${operation.ctn_nbr}</td>
                            <td style="text-align: center;" >${operation.destination}</td>
                            <td style="text-align: center;" >${operation.scanned ? 'Yes' : 'No'}</td>
                            <td style="text-align: center;" >${operation.op_name}</td>
                            <td style="text-align: center;" >${new Date(operation.op_date_time).toLocaleDateString()}</td>
                            <td style="text-align: center;" >${new Date(operation.op_date_time).toLocaleTimeString()}</td>
                        `;
                        tableBody.appendChild(row);
                    });
                } else if (data.error) {
                    console.error('Error:', data.error);
                    // Optionally, display the error message to the user
                    // alert('An error occurred while fetching data: ' + data.error); 
                } else {
                    console.error('Unexpected data format:', data);
                }
            })
            .catch(error => {
                console.error('Error fetching operation data:', error);
                // Optionally, display a generic error message to the user
                // alert('An error occurred while fetching data.'); 
            });
    }
});