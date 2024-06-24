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
            url: 'http://api.drugguardian.net/account/login',
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
            url: 'http://api.drugguardian.net/submit-request',
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

$(document).ready(function() {
    $('#synergyForm').on('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData(this); // Create a FormData object from the form

        $.ajax({
            url: 'http://api.drugguardian.net/predictSynergy', 
            method: 'POST', // Use POST method
            data: formData, // Send the form data
            processData: false, // Do not process data
            contentType: false, // Do not set content type
            success: function(data) {
                $('#synergy_results').html('<div class="alert alert-success">Synergy score: ' + data.synergy_score + '</div>'); // Display the synergy score
            },
            error: function() {
                $('#synergy_results').html('<div class="alert alert-danger">Failed to predict the synergy score</div>'); // Display error message
            }
        });
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
            url: 'http://api.drugguardian.net/sideEffects',
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











