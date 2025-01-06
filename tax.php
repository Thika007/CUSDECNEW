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

if (isset($_GET['Instance_ID'])) {
    $instanceID = $conn->real_escape_string($_GET['Instance_ID']);
    
    $sql = "SELECT tax_lin_cod, SUM(tax_lin_amt) as total_amount 
            FROM sad_tax 
            WHERE instance_id = '$instanceID' AND tax_lin_mop = '1'
            GROUP BY tax_lin_cod";
    
    $result = $conn->query($sql);

    $data = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $data[$row['tax_lin_cod']] = $row['total_amount'];
        }
    }

    echo json_encode($data);
}

$conn->close();
?>
