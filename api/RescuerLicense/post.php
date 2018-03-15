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
		if(isset($_POST['map'])) {
		$query = 'SELECT `id` FROM `RescuerLicense` WHERE idMap='.$_POST['map'].' ORDER BY id DESC LIMIT 1';
		$stmt = $db->prepare($query);
		$stmt->execute();

		if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$idl = (round($row['id']/1000)+1)*1000 + $_POST['map'] ;
		}
		else
			$idl = 3000000 + $_POST['map'] ;



			$query = 'INSERT INTO RescuerLicense(id, IdMap) VALUES ('.$idl.', '.$_POST['map'].')';

			$stmt = $db->prepare($query);
			$stmt->execute();
			echo json_encode(
				array('success' => 1, 'license' => $idl)
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