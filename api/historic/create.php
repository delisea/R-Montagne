<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../objects/historic.php';
 
$database = new Database();
$db = $database->getConnection();

if (isset($_POST['id']) && isset($_POST['latitude']) && isset($_POST['longitude']) && isset($_POST['alert']) && isset($_POST['map'])) {

	$id = htmlspecialchars(strip_tags($_POST['id']));
	$latitude = htmlspecialchars(strip_tags($_POST['latitude']));
	$longitude = htmlspecialchars(strip_tags($_POST['longitude']));
	$alert = htmlspecialchars(strip_tags($_POST['alert']));
	$map = htmlspecialchars(strip_tags($_POST['map']));

	$query = 'INSERT INTO Historic SET idTracker=:id, latitude=:latitude, longitude=:longitude, alert=:alert, map=:map';

	$stmt = $db->prepare($query);
	$stmt->bindParam('id', $id);
	$stmt->bindParam('latitude', $latitude);
	$stmt->bindParam('longitude', $longitude);
	$stmt->bindParam('alert', $alert);
	$stmt->bindParam('map', $map);
	if ($stmt->execute()) {
		echo json_encode(
			array('success' => 1)
		);
	} else {
		echo json_encode(
			array('success' => 2)
		);
	}
} else {
	echo json_encode(
		array('success' => 0)
	);
}