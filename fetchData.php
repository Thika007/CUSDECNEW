<?php

header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "custrack";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if (isset($_GET['Consignee_TIN'])) {
    $Consignee_TIN = $conn->real_escape_string($_GET['Consignee_TIN']);
    $sql = "SELECT Instance_ID, Declarant_Name, Consignee_Name, Reg_Year, Office_Code, Reg_Date, Reg_No, Container_Count, Ser
            FROM sad_general_segment
            WHERE Consignee_TIN = '$Consignee_TIN'
            LIMIT 1000";

    $result = $conn->query($sql);

    $data = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // Check if Instance_ID exists in ownership table
            $instanceID = $row['Instance_ID'];
            $ownershipQuery = $conn->prepare("SELECT COUNT(*) as count FROM ownership WHERE Instance_ID = ?");
            $ownershipQuery->bind_param('d', $instanceID);
            $ownershipQuery->execute();
            $ownershipResult = $ownershipQuery->get_result();
            $ownershipRow = $ownershipResult->fetch_assoc();

            // Add ownership information to the row
            $row['has_ownership'] = $ownershipRow['count'] > 0; // true if exists, false otherwise
            $data[] = $row;
        }
    }

    echo json_encode($data);
}

$conn->close();
?>