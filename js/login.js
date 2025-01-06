document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent form from submitting the default way

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Send data to PHP for validation
  fetch('login.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'username': username,
      'password': password
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Redirect to index.html on successful login
        window.location.href = 'index.html';
      } else {
        // Show error message
        document.getElementById('loginError').style.display = 'block';
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
});
