<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../objects/beacon.php';

$database = new Database();
$db = $database->getConnection();

$beacon = new Beacon($db);

if (isset($_POST['idBeacon'])) {
	$beacon->idBeacon = $_POST['idBeacon'];

	if ($beacon->delete()) {
		echo json_encode(
			array("message" => "Beacon was deleted.")
		);
	} else {
		echo json_encode(
			array("message" => "Unable to delete beacon.")
		);
	}
} else {
	echo json_encode(
		array("message" => "Unable to delete beacon.")
	);
}
?>