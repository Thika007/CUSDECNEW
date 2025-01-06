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
    // Fetch general details from sad_general_segment
    $query = $conn->prepare("SELECT Exporter_Name, Declarant_Name, Consignee_Name, Invoice_Value, Export_Cty, Instance_ID, Office_Code, Reg_No, Ser, Container_Count, Reg_Date 
    FROM sad_general_segment WHERE Instance_ID = ?");
    $query->bind_param('d', $instanceID);
    $query->execute();
    $result = $query->get_result();
    $generalDetails = $result->fetch_assoc();

    // Fetch items from sad_item
    $itemQuery = $conn->prepare("SELECT HS_Code, Item_Description FROM sad_item WHERE Instance_ID = ?");
    $itemQuery->bind_param('d', $instanceID);
    $itemQuery->execute();
    $itemResult = $itemQuery->get_result();

    $items = [];
    while ($item = $itemResult->fetch_assoc()) {
        $items[] = $item;
    }

    // Combine both results
    $response = array_merge($generalDetails, ['items' => $items]);

    // Return JSON response
    echo json_encode($response);
}

$conn->close();
?>