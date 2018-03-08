<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../objects/historic.php';
 
$database = new Database();
$db = $database->getConnection();

$historic = new Historic($db);

if (isset($_POST['idTracker']) && isset($_POST['date'])) {
	$historic->idTracker = $_POST['idTracker'];
	$historic->date = $_POST['date'];

	if ($historic->delete()) {
		echo json_encode(
			array("message" => "Historic entry was deleted.")
		);
	} else {
		echo json_encode(
			array("message" => "Unable to delete historic entry")
		);
	}
} else {
	echo json_encode(
		array("message" => "Unable to delete historic entry")
	);
}
?>