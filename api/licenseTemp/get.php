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

		$arr = array();

		$query = 'SELECT idLicense, end FROM `TrackerLicenseTemp` WHERE idUser=:id ORDER BY end DESC';

		$stmt = $db->prepare($query);
		$stmt->bindParam('id', $_SESSION['id']);
		$stmt->execute();

		$num = $stmt->rowCount();

                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
			extract($row);
			$entry = array(
	             		'idLicense' => $idLicense,
				'endDate' => $end
			);
			array_push($arr, $entry);
	        }
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