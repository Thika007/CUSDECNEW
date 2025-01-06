document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const instanceID = urlParams.get('Instance_ID');

    if (instanceID) {
        fetch(`tax.php?Instance_ID=${instanceID}`)
            .then(response => response.json())
            .then(data => {
                const taxTableBody = document.getElementById('taxTableBody');
                let totalAmount = 0;

                for (const [type, amount] of Object.entries(data)) {
                    const numericAmount = parseFloat(amount) || 0; // Convert to number and handle NaN
                    totalAmount += numericAmount;

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${type}</td>
                        <td>${numericAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    `;
                    taxTableBody.appendChild(tr);
                }

                document.getElementById('totalAmount').innerText = totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            })
            .catch(error => console.error('Error fetching tax data:', error));
    }
});
