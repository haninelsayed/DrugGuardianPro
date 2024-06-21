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
        const email = $('#email').val();
        const password = $('#password').val();

        $.ajax({
            url: 'http://localhost:8000/auth/login',
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(email + ':' + password),
                'Content-Type': 'application/json'
            },
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

document.getElementById('email').addEventListener('focus', function() {
    console.log('Email input focused');
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

$(document).ready(function() {
    let drugs = [];

    $('#drug-input').on('input', function() {
        const query = $(this).val();
        if (query.length > 1) {
            $.ajax({
                url: 'http://localhost:8000/autocomplete',
                method: 'GET',
                data: { query: query },
                success: function(data) {
                    $('#drug-input').autocomplete({
                        source: data
                    });
                }
            });
        }
    });

    $('#add-drug-btn').on('click', function() {
        const drugName = $('#drug-input').val();
        if (drugName && !drugs.includes(drugName)) {
            drugs.push(drugName);
            $('#drug-list').append(`<span class="badge bg-primary m-1">${drugName}</span>`);
            $('#drug-input').val('');
            checkInteractions();
        }
    });

    function checkInteractions() {
        if (drugs.length > 1) {
            $.ajax({
                url: 'http://localhost:8000/predict_interaction',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(drugs),
                success: function(data) {
                    $('#interaction-results').empty();
                    if (data.message) {
                        $('#interaction-results').append(`<p>${data.message}</p>`);
                    } else {
                        data.forEach(interaction => {
                            $('#interaction-results').append(`<p><strong>${interaction.drugs.join(' + ')}:</strong> ${interaction.interaction}</p>`);
                        });
                    }
                }
            });
        }
    }
});



