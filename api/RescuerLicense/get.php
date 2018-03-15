<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

if (isset($_POST['session'])) {

	session_id($_POST['session']);
	session_start();

	if (isset($_SESSION['id'])) {
		$query = 'SELECT r.id FROM RescuerLicense AS r LEFT JOIN `NetworkLicense` ON r.idMap=NetworkLicense.idMap WHERE NetworkLicense.idUser='.$_SESSION['id'];
		$stmt = $db->prepare($query);
		$stmt->execute();

		$arr= array();
		while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
			array_push($arr, $row['id']) ;
		}

		echo json_encode(
			array('success' => 1, 'license' => $arr)
		);
	} else {
		echo json_encode(
			array('success' => 0, 'message' => 'Invalid session')
		);
	}
} else {
	echo json_encode(
		array('success' => 0, 'message' => 'Invalid parameters')
	);
}