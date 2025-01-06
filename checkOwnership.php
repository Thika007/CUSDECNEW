<?php
header('Content-Type: application/json');

// Database connection details
$server = 'localhost';
$username = 'root';
$password = 'root';
$database = 'custrack';

// Create connection
$conn = new mysqli($server, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

// Get Instance_ID from query string
$instanceID = isset($_GET['Instance_ID']) ? $_GET['Instance_ID'] : '';

if ($instanceID) {
    // Check if the Instance_ID exists in the ownership table
    $query = $conn->prepare("SELECT COUNT(*) as count FROM ownership WHERE Instance_ID = ?");
    $query->bind_param('d', $instanceID);
    $query->execute();
    $result = $query->get_result();
    $row = $result->fetch_assoc();

    // Return whether the Instance_ID exists
    echo json_encode(['exists' => $row['count'] > 0]);
} else {
    echo json_encode(['exists' => false]);
}

$conn->close();
?>