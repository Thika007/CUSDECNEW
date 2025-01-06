<?php
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "custrack";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Disable ONLY_FULL_GROUP_BY mode
    $conn->exec("SET @@sql_mode = REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY','')");

    if (isset($_GET['Instance_ID'])) {
        $instanceID = $_GET['Instance_ID'];

        $stmt = $conn->prepare("SELECT  cp.ctn_nbr, cp.destination, cp.scanned, uat.op_name, MAX(uat.op_date_time) AS op_date_time 
                                FROM custrack.sad_general_segment sgs
                                LEFT JOIN custrack.container_pass cp ON cp.sad_ins = sgs.Instance_ID
                                LEFT JOIN custrack.un_asyctn_track uat ON uat.instance_id = cp.instance_id
                                WHERE sgs.Instance_ID = :instanceID
                                GROUP BY cp.ctn_nbr, cp.destination, cp.scanned"); 
        $stmt->bindParam(':instanceID', $instanceID, PDO::PARAM_STR);
        $stmt->execute();

        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!$results) {
            echo json_encode(['error' => 'No data found']);
        } else {
            echo json_encode($results);
        }
    }
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
$conn = null;
?>