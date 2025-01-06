<?php
session_start();
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "custrack";

try {
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Retrieve data from POST request
    $inputUsername = $_POST['username'];
    $inputPassword = $_POST['password'];

    // Prepare SQL statement
    $stmt = $conn->prepare("SELECT * FROM user WHERE username = ?");
    $stmt->bind_param("s", $inputUsername);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        // Check if the passwords match
        if (password_verify($inputPassword, $user['password'])) {
            // Successful login
            $_SESSION['user_id'] = $user['id']; // Storing user ID in session

            echo json_encode(['success' => true]);
        } else {
            // Incorrect password
            echo json_encode(['success' => false]);
        }
    } else {
        // Username not found
        echo json_encode(['success' => false]);
    }

    // Close the statement and connection
    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
