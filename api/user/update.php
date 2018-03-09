<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

if (isset($_POST['session']) && isset($_POST['name']) && isset($_POST['firstName']) && isset($_POST['email']) && isset($_POST['phone']) && isset($_POST['address'])) {
	
	session_id($_POST['session']);
	session_start();

	if (isset($_SESSION['id'])) {

		$id = $_SESSION['id'];
		$name = htmlspecialchars(strip_tags($_POST['name']));
		$firstName = htmlspecialchars(strip_tags($_POST['firstName']));
		$email = htmlspecialchars(strip_tags($_POST['email']));
		$phone = htmlspecialchars(strip_tags($_POST['phone']));
		$address = htmlspecialchars(strip_tags($_POST['address']));

		$query = 'UPDATE User as u SET u.name=:name, u.firstName=:firstName, u.email=:email, u.phone=:phone, u.address=:address WHERE u.id=:id';

		$stmt = $db->prepare($query);
		$stmt->bindParam('id', $id);
		$stmt->bindParam('name', $name);
		$stmt->bindParam('firstName', $firstName);
		$stmt->bindParam('email', $email);
		$stmt->bindParam('phone', $phone);
		$stmt->bindParam('address', $address);

		if ($stmt->execute()) {
			echo json_encode(
				array('success' => 1, 'message' => 'User successfully updated')
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