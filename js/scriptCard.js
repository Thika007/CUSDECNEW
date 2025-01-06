document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('searchBar');
    const searchButton = document.getElementById('searchButton');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorAlert = document.getElementById('errorAlert');
    const cardContainer = document.getElementById('cardContainer');
    const filterContainer = document.getElementById('filterContainer');
    const filterBar = document.getElementById('filterBar');

    let cardsData = []; // To store the loaded cards data

    searchButton.addEventListener('click', fetchData);
    searchBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            fetchData();
        }
    });

    function fetchData() {
        const query = searchBar.value.trim();
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
                    cardContainer.innerHTML = '';
                    cardsData = data; // Store the data for filtering
                    if (cardsData.length > 0) {
                        filterContainer.style.display = 'block'; // Show the filter bar
                    } else {
                        filterContainer.style.display = 'none'; // Hide the filter bar if no data
                    }
                    displayCards(cardsData); // Display all cards initially
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    errorAlert.style.display = 'block';
                })
                .finally(() => {
                    loadingSpinner.style.display = 'none';
                });
        } else {
            cardContainer.innerHTML = '';
            filterContainer.style.display = 'none'; // Hide the filter bar if search query is empty
        }
    }

    function displayCards(data) {
        cardContainer.innerHTML = ''; // Clear existing cards
        data.forEach(row => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <p class="card-title">${row.Office_Code} ${row.Ser || ''} ${row.Reg_No}</p>
                <p class="card-title">${row.Reg_Date}</p>
                <p class="card-title">Declarant</p>
                <p class="small-desc">${row.Declarant_Name}</p>
            `;

            // Add click event to check ownership and redirect accordingly
            card.addEventListener('click', () => {
                checkOwnership(row.Instance_ID)
                    .then(result => {
                        if (result.exists) {
                            // Redirect to timeline.html with query parameters
                            window.location.href = `timeline.html?Instance_ID=${row.Instance_ID}&Office_Code=${row.Office_Code}&Reg_No=${row.Reg_No}&Container_Count=${row.Container_Count}`;
                        } else {
                            // Redirect to owner.html if ownership does not exist
                            window.location.href = `owner.html?Instance_ID=${row.Instance_ID}`;
                        }
                    })
                    .catch(error => console.error('Error checking ownership:', error));
            });

            cardContainer.appendChild(card);
        });
    }

    // Function to check if an Instance_ID exists in the ownership table
    function checkOwnership(instanceID) {
        return fetch(`checkOwnership.php?Instance_ID=${instanceID}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            });
    }

    // Add event listener for filtering cards
    filterBar.addEventListener('input', () => {
        const searchTerm = filterBar.value.toLowerCase();
        const filteredData = cardsData.filter(row =>
            (row.Office_Code && row.Office_Code.toLowerCase().includes(searchTerm)) ||
            (row.Reg_No && row.Reg_No.toLowerCase().includes(searchTerm)) ||
            (row.Ser && row.Ser.toLowerCase().includes(searchTerm)) ||
            (row.Reg_Date && row.Reg_Date.toLowerCase().includes(searchTerm)) ||
            (row.Declarant_Name && row.Declarant_Name.toLowerCase().includes(searchTerm))
        );
        displayCards(filteredData); // Display only filtered cards
    });
});