// header behavior

$(document).ready(function(){
    $('.nav-link').hover(
        function() {
            // On mouse enter, set the text color to white and background color for the hovered link
            $(this).css('color', 'white');
            $(this).css('background-color', '#5AB2FF');
        },
        function() {
            // On mouse leave, restore the text color and background for non-active links
            if (!$(this).hasClass('active')) {
                $(this).css('color', 'black').css('background-color', 'transparent');
            } else {
                // Restore the active link styles specifically
                $(this).css('color', 'black').css('background-color', 'transparent');
            }
        }
    );
  
    // Ensure the active link color is initially set correctly
    $('.nav-link.active').css('color', 'black').css('background-color', 'transparent');
  });

// index.html (sign in page) connection

$(document).ready(function() {
    $('#loginForm').on('submit', function(event) {
        event.preventDefault();
        const username = $('#username').val();
        const password = $('#password').val();

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        $.ajax({
            url: 'http://localhost:8000/account/login',
            method: 'POST',
            processData: false,
            contentType: false,
            data: formData,
            success: function(data) {
                alert('Login successful: ' + data.username);
                // Redirect or perform actions after successful login
            },
            error: function() {
                alert('Login failed');
            }
        });
    });
});

// chemical-org.html (request form) connection

$(document).ready(function() {
    $('#requestForm').on('submit', function(event) {
        event.preventDefault();
        
        const formData = new FormData(this);

        $.ajax({
            url: 'http://localhost:8000/submit-request',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
                alert('Request submitted successfully: ' + JSON.stringify(data));
            },
            error: function() {
                alert('Failed to submit the request');
            }
        });
    });
});

// drug-interaction.html connection

// Wait for the DOM to fully load before running the script
document.addEventListener('DOMContentLoaded', (event) => {
    // Get references to the necessary DOM elements
    const drugInput = document.getElementById('drug_input');
    const addDrugBtn = document.getElementById('add_drug_btn');
    const drugList = document.getElementById('drug_list');
    const checkInteractionsBtn = document.getElementById('check_interactions_btn');
    const interactionResults = document.getElementById('interaction_results');

    // Initialize a counter to keep track of the number of drug entries
    let count = 0;
    const maxEntries = 3; // Define the maximum number of drug entries allowed

    // Event listener for the "Add" button click event
    addDrugBtn.addEventListener('click', () => {
        // Check if the current count is less than the maximum allowed entries
        if (count < maxEntries) {
            const value = drugInput.value; // Get the input value
            if (value) {
                // If there is a value, create a new div to display the drug
                const newDiv = document.createElement('div');
                newDiv.textContent = value; // Set the text content to the input value
                drugList.appendChild(newDiv); // Append the new div to the drug list
                count++; // Increment the counter
                drugInput.value = ''; // Clear the input field
            } else {
                alert('Please enter a value.'); // Alert if the input field is empty
            }
        } else {
            alert('You have reached the maximum number of entries.'); // Alert if max entries reached
        }
    });

    // Event listener for the "Check Interactions" button click event
    checkInteractionsBtn.addEventListener('click', async () => {
        // Ensure at least two drugs have been added before checking interactions
        if (drugs.length < 2) {
            alert("Please add at least two drugs to check interactions.");
            return;
        }

        try {
            // Send a POST request to the backend with the list of drugs
            const response = await fetch('http://your-backend-url/check_interactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ drugs: drugs }) // Convert the drugs array to a JSON string
            });

            const data = await response.json(); // Parse the JSON response from the server
            interactionResults.innerHTML = ''; // Clear previous interaction results

            if (data && data.length > 0) {
                // Loop through the interactions and display each one
                data.forEach(interaction => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'interaction-item';
                    resultItem.innerHTML = `
                        <strong>${interaction.drug_ref_1} - ${interaction.drug_ref_2}:</strong>
                        <span>${interaction.interaction}</span>
                    `;
                    interactionResults.appendChild(resultItem); // Append each result to the results div
                });
            } else {
                interactionResults.innerHTML = '<div>No interactions found.</div>'; // Display message if no interactions found
            }
        } catch (error) {
            console.error('Error checking interactions:', error); // Log any errors to the console
            interactionResults.innerHTML = '<div>Error checking interactions.</div>'; // Display error message
        }
    });
});

// side-effects.html connection
$(document).ready(function () {
    $('#predictionForm').on('submit', function (e) {
        e.preventDefault();

        var drug1Id = $('#drug1Id').val();
        var drug2Id = $('#drug2Id').val();
        var sideEffectId = $('#sideEffectId').val();

        $.ajax({
            url: 'http://127.0.0.1:8000/predict',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                drug1_id: drug1Id,
                drug2_id: drug2Id,
                side_effect_id: sideEffectId
            }),
            success: function (response) {
                $('#result').html(`
                    <strong>Drug 1 Name:</strong> ${response.drug1_name}<br>
                    <strong>Drug 2 Name:</strong> ${response.drug2_name}<br>
                    <strong>Side Effect Name:</strong> ${response.side_effect_name}<br>
                    <strong>Predicted Label:</strong> ${response.predicted_label}<br>
                    <strong>Predicted Score:</strong> ${response.predicted_score}
                `);
            },
            error: function () {
                $('#result').html('<strong>Error:</strong> Could not retrieve prediction.');
            }
        });
    });
});

// drug-lookup.html connection
const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');

        searchInput.addEventListener('input', async (event) => {
            const searchKey = event.target.value;
            if (searchKey.length < 3) {
                searchResults.innerHTML = '';  // Clear search results if search key is less than 3 characters
                return;
            }

            // Fetch search results from FastAPI route
            const response = await fetch(`http://drugguardian.servehttp.com/drugs?search_key=${searchKey}`);
            const data = await response.json();
            console.log(data); // Debug: Log the received data

            // Display search results
            searchResults.innerHTML = '';
            if (data.results && data.results.length > 0) {
                data.results.forEach(drug => {
                    const drugInfo = document.createElement('li');
                    drugInfo.classList.add('list-group-item');
                    drugInfo.innerHTML = `
                        <strong>Brand Name:</strong> ${drug.brand_name}<br>
                        <strong>Drug Ref:</strong> ${drug.drug_ref}<br>
                        <strong>Drug Name:</strong> ${drug.drug_name}<br>
                    `;
                    searchResults.appendChild(drugInfo);
                });
            } else {
                console.log("No results found");
                searchResults.innerHTML = '<li class="list-group-item">No results found</li>';
            }
        });











