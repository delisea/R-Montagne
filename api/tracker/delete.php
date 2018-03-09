<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

if (isset($_POST['session']) && isset($_POST['idTracker'])) {

	session_id($_POST['session']);
	session_start();

	if (isset($_SESSION['id'])) {

		$idTracker = htmlspecialchars(strip_tags($_POST['idTracker']));

		$query = 'DELETE FROM Tracker WHERE idTracker=:idTracker';

		$stmt = $db->prepare($query);
		$stmt->bindParam('idTracker', $idTracker);

		if ($stmt->execute()) {
			echo json_encode(
				array('success' => 1, 'message' => 'Tracker successfully deleted')
			);
		} else {
			echo json_encode(
				array('success' => 0, 'message' => 'An error has occured')
			);
		}
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