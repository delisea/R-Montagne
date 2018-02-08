<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';
include_once '../objects/beacon.php';

$database = new Database();
$db = $database->getConnection();

$beacon = new Beacon($db);

$stmt = $beacon->read();
$num = $stmt->rowCount();

if ($num > 0) {

	$beacons_arr = array();
	$beacons_arr["records"] = array();

	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		extract($row);

		$beacon_item = array(
			"idBeacon" => $idBeacon,
			"position" => $position
		);

		array_push($beacons_arr["records"], $beacon_item);
	}

	echo json_encode($beacons_arr);
} else {
	echo json_encode(
		array("message" => "No beacons found.")
	);
}
?>