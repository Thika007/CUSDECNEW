<?php
// Database connection details
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "custrack";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $fname = $_POST['first-Name'];
    $lname = $_POST['last-Name'];
    $nic = $_POST['NIC'];
    $email = $_POST['email'];
    $username = $_POST['user-Name'];
    $password = $_POST['password'];
    $rePassword = $_POST['re-password'];

    // Check if passwords match
    if ($password !== $rePassword) {
        echo json_encode(["success" => false, "message" => "Passwords do not match"]);
        exit;
    }

    // Hash the password for security
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Set the current datetime for created and modified dates
    $create_date = date('Y-m-d H:i:s');
    $modified_date = $create_date;

    // Insert the data into the `user` table
    $sql = "INSERT INTO user (fname, lname, nic, email, username, password, status, create_date, modified_date)
            VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssssss", $fname, $lname, $nic, $email, $username, $hashedPassword, $create_date, $modified_date);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "User registered successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error: " . $stmt->error]);
    }

    $stmt->close();
}

$conn->close();
?>
