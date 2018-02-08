<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';
include_once '../objects/historic.php';
 
$database = new Database();
$db = $database->getConnection();

$historic = new Historic($db);

$stmt = $historic->read();
$num = $stmt->rowCount();

if ($num > 0) {

	$historics_arr = array();
	$historics_arr["records"] = array();

	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		extract($row);

		$historic_item = array(
			"idTracker" => $idTracker,
			"date" => $date,
			"position" => $position,
			"alert" => $alert
		);

		array_push($historics_arr["records"], $historic_item);
	}

	echo json_encode($historics_arr);
} else {
	echo json_encode(
		array("message" => "No historic entry found.")
	);
}
?>