<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

if (isset($_POST['session']) && isset($_POST['latitude']) && isset($_POST['longitude']) && isset($_POST['map'])) {

	session_id($_POST['session']);
	session_start();

	if (isset($_SESSION['id'])) {

		$latitude = htmlspecialchars(strip_tags($_POST['latitude']));
		$longitude = htmlspecialchars(strip_tags($_POST['longitude']));
		$map = htmlspecialchars(strip_tags($_POST['map']));

		$query = 'INSERT INTO Beacon SET latitude=:latitude, longitude=:longitude, map=:map';

		$stmt = $db->prepare($query);
		$stmt->bindParam('latitude', $latitude);
		$stmt->bindParam('longitude', $longitude);
		$stmt->bindParam('map', $map);

		if ($stmt->execute()) {
			echo json_encode(
				array('success' => 1, 'message' => 'Beacon successfully created')
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