<?php
// Database connection settings
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "custrack";

$instanceID = $_GET['Instance_ID'];

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->prepare("
        SELECT t.op_name, t.op_date_time
        FROM un_asybrk_track t 
        JOIN un_asybrk_ied i ON t.ied_id = i.ied_id 
        WHERE i.instance_id = :instanceID
    ");
    $stmt->bindParam(':instanceID', $instanceID, PDO::PARAM_INT);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result);

} catch(PDOException $e) {
    echo json_encode([]);
}
$conn = null;
?>
