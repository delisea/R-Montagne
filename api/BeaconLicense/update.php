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
		if($_SESSION['admin']) {
			$query = 'UPDATE `BeaconLicense` SET `idUser`='.$_SESSION['id'].' WHERE `id`='.$_POST['license'].' AND idUser IS NULL';
			$stmt = $db->prepare($query);
                        $stmt->execute();
			if($stmt->rowCount() > 0) {
				$query = 'UPDATE `Beacon` SET `latitude`='.$_POST['latitude'].',`longitude`='.$_POST['longitude'].',`map`='.$_POST['map'].' WHERE `id`='.$_POST['license'];
				$stmt = $db->prepare($query);
				$stmt->execute();
				echo json_encode(
					array('success' => 1, 'message' => 'Add Beacon License succeed.')
				);
			}
			else {
				echo json_encode(
					array('success' => 0, 'message' => 'Add Beacon License failed.')
				);
			}
		}
		else {
			echo json_encode(
				array('success' => 0, 'message' => 'Only Network Administrator can use Beacon License.')
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