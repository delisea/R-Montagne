<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

if (isset($_POST['session']) && isset($_POST['password'])) {

	session_id($_POST['session']);
	session_start();

	if (isset($_SESSION['id'])) {

		$id = $_SESSION['id'];
		$password = htmlspecialchars(strip_tags($_POST['password']));

		$query = 'UPDATE User as u SET u.password=:password WHERE u.id=:id';

		$stmt = $db->prepare($query);
		$stmt->bindParam('id', $id);
		$stmt->bindParam('password', $password);

		if ($stmt->execute()) {
			echo json_encode(
				array('success' => 1, 'message' => 'User\'s password successfully updated')
			);
		} else {
			echo json_encode(
				array('success' => 0, 'message' => 'An error has occured')
			);
		}
	} else {
		echo json_encode(
			array('success' => 0, 'message' => 'Invalid session'))
	}
} else {
	echo json_encode(
		array('success' => 0, 'message' => 'Invalid parameters')
	);
}