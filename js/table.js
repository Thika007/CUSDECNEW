document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('searchBar');
    const tableBody = document.getElementById('tableBody');

    // Load data into the table (mock data for example)
    const data = [
        { Reg_No: '001', Declarant_Name: 'John Doe', Reg_Year: '2024', Office_Code: 'A1', Reg_Date: '2024-01-01' },
        { Reg_No: '002', Declarant_Name: 'Jane Smith', Reg_Year: '2023', Office_Code: 'B2', Reg_Date: '2023-05-12' },
        // Add more data here
    ];

    function populateTable(data) {
        tableBody.innerHTML = '';
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.Reg_No}</td>
                <td>${row.Declarant_Name}</td>
                <td>${row.Reg_Year}</td>
                <td>${row.Office_Code}</td>
                <td>${row.Reg_Date}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // Filter function
    searchBar.addEventListener('keyup', () => {
        const searchTerm = searchBar.value.toLowerCase();
        const filteredData = data.filter(row => 
            row.Reg_No.toLowerCase().includes(searchTerm) ||
            row.Declarant_Name.toLowerCase().includes(searchTerm) ||
            row.Reg_Year.toLowerCase().includes(searchTerm) ||
            row.Office_Code.toLowerCase().includes(searchTerm) ||
            row.Reg_Date.toLowerCase().includes(searchTerm)
        );
        populateTable(filteredData);
    });

    // Populate the table initially
    populateTable(data);
});
