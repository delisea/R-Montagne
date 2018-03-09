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

	session_id($_POST['sessoin']);
	session_start();

	if (isset($_SESSION['id'])) {

		$arr = array();
		$arr['historics'] = array();

		$query = 'SELECT idTracker, date, latitude, longitude, alert, map FROM Historic';

		$stmt = $db->prepare($query);
		$stmt->execute();
		$num = $stmt->rowCount();

		if (num > 0) {

			while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

				extract($row);

				$entry = array(
					'idTracker' => $idTracker,
					'date' => $date,
					'latitude' => $latitude,
					'longitude' => $longitude,
					'alert' => $alert,
					'map' => $map
				);

				array_push($arr['historics'], $entry);
			}
		}

		$arr['success'] = 1;
		echo json_encode($arr);
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