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

	session_id($_POST['session']);
	session_start();

	if (isset($_SESSION['id'])) {
		$query = 'DELETE FROM `MapPolygon` WHERE `IdMap`='.$_POST['map'];
		$stmt = $db->prepare($query);
		$stmt->execute();
		$query = 'INSERT INTO `MapPolygon`(`IdMap`, `longitude`, `latitude`, `ordre`) VALUES ('.$_POST['map'].',:longitude,:latitude,:order)';
		$stmt = $db->prepare($query);
		$stmt->bindParam(':latitude', $latitude);
		$stmt->bindParam(':longitude', $longitude);
		$stmt->bindParam(':order', $order);
		$order = 0;
                $points = json_decode($_POST['points']);
		foreach ($points as $latlon) {
			$latitude = $latlon[1];
			$longitude = $latlon[0];
			$order = $order + 1;
		    $stmt->execute();
		}
		/*$lats = json_decode($_POST['latitude']);
		$lons = json_decode($_POST['longitude']);
		foreach ($lats as $key => $latitude) {
			$longitude = $lons[$key];
			$order = $order + 1;
		    $stmt->execute();
		}*/
		echo json_encode(
			array('success' => 1, 'message' => 'Save succed!.')
		);
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