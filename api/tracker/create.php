<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../objects/tracker.php';

$database = new Database();
$db = $database->getConnection();

$tracker = new Tracker($db);

if (isset($_POST['idTracker']) && isset($_POST['idUser'])) {
	$tracker->idTracker = $_POST['idTracker'];
	$tracker->idUser = $_POST['idUser'];

	if ($tracker->create()) {
		echo json_encode(
			array("message" => "Tracker was created.")
		);
	} else {
		echo json_encode(
			array("message" => "Unable to create tracker.")
		);
	}
} else {
	echo json_encode(
		array("message" => "Unable to create tracker.")
	);
}
?>