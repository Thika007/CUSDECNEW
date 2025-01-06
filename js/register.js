document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');

  form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const formData = new FormData(form);

    // Send the data to the PHP script
    fetch('register.php', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('User registered successfully!');
          form.reset(); // Clear the form
        } else {
          alert('Error: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
});
