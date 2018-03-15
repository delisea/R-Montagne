<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
 
$database = new Database();
$db = $database->getConnection();

if (isset($_POST['session']) && isset($_POST['id']) && isset($_POST['date'])) {

	session_id($_POST['session']);
	session_start();

	if (isset($_SESSION['id']) {

		$id = htmlspecialchars(strip_tags($_POST['id']));
		$date = htmlspecialchars(strip_tags($_POST['date']));

		$query = 'DELETE FROM Historic WHERE idTracker=:id AND date=:date';

		$stmt = $db->prepare($query);
		$stmt->bindParam('id', $id);
		$stmt->bindParam('date', $date);

		if ($stmt->execute()) {
			echo json_encode(
				array('success' => 1, 'message' => 'Historic entry successfully deleted')
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