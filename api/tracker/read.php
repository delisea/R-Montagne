<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

if (isset($_POST['session'])) {

	session_id($_POST['session']);
	session_start();

	if (isset($_SESSION['id'])) {

		$arr = array();
		$arr['trackers'] = array();

		$query = 'SELECT idTracker, idUser FROM Tracker';

		$stmt = $db->prepare($query);
		$stmt->execute();
		$num = $stmt->rowCount();

		if (num > 0) {

			while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

				extract($row);

				$entry = array(
					'idTracker', $idTracker,
					'idUser', $idUser
				);

				array_push($arr['trackers'], $entry);
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