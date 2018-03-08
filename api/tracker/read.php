<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';
include_once '../objects/tracker.php';

$database = new Database();
$db = $database->getConnection();

$tracker = new Tracker($db);

$stmt = $tracker->read();
$num = $stmt->rowCount();

if($num>0) {

	$trackers_arr=array();
	$trackers_arr["records"]=array();

	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		extract($row);

		$tracker_item=array(
			"idTracker" => $idTracker,
			"idUser" => $idUser
		);

		array_push($trackers_arr["records"], $tracker_item);
	}

	echo json_encode($trackers_arr);
} else {
	echo json_encode(
		array("message" => "No trackers found.")
	);
}
?>