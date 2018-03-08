<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

if (isset($_POST['map'])) {
	$map = htmlspecialchars(strip_tags($_POST['map']));

	$arr = array();

	$query = 'SELECT m.name, m.topLeftLatitude, m.topLeftLongitude, m.bottomRightLatitude, m.bottomRightLongitude, m.centerLatitude, m.centerLongitude, m.zoom FROM Map as m WHERE m.id=:id';

	$stmt = $db->prepare($query);
	$stmt->bindParam('id', $map);
	$stmt->execute();

	$num = $stmt->rowCount();

	if ($num > 0) {

		$row = $stmt->fetch(PDO::FETCH_ASSOC);

		extract($row);

		$entry = array(
			'name' => $name,
			'topLeftLatitude' => $topLeftLatitude,
			'topLeftLongitude' => $topLeftLongitude,
			'bottomRightLatitude' => $bottomRightLatitude,
			'bottomRightLongitude' => $bottomRightLongitude,
			'centerLatitude' => $centerLatitude,
			'centerLongitude' => $centerLongitude,
			'zoom' => $zoom
		);

		$arr['success'] = 1;
		$arr['map'] = $entry;

		echo json_encode($arr);
	} else {
		echo json_encode(
			array('success' => 0, 'text' => 'No map for id given')
		);
	}
} else {
	echo json_encode(
		array('success' => 0, 'text' => 'No map id given')
	);
}