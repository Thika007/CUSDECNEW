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

// Get parameters from the request
$instanceID = isset($_POST['Instance_ID']) ? $_POST['Instance_ID'] : '';
$confirmation = isset($_POST['confirmation']) ? $_POST['confirmation'] : 0; // Default to 0 if not set
$confirmUserId = 1; // You can set this to the actual user ID based on your authentication logic

if ($instanceID) {
    // Insert or update the ownership record
    $query = $conn->prepare("INSERT INTO ownership (Instance_ID, confirmation, confirm_date, confirm_user_id) VALUES (?, ?, NOW(), ?) ON DUPLICATE KEY UPDATE confirmation = ?, confirm_date = NOW(), confirm_user_id = ?");
    $query->bind_param('iiiii', $instanceID, $confirmation, $confirmUserId, $confirmation, $confirmUserId);
    
    if ($query->execute()) {
        echo json_encode(['success' => true, 'message' => 'Ownership updated successfully.']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Database error: ' . $conn->error]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Instance_ID is required.']);
}

$conn->close();
?>