<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Max-Age: 3600');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

if (isset($_POST['name']) && isset($_POST['firstName']) && isset($_POST['username']) && isset($_POST['email']) && isset($_POST['phone']) && isset($_POST['address']) && isset($_POST['password']) && isset($_POST['rescuer'])) {

	$name = htmlspecialchars(strip_tags($_POST['name']));
	$firstName = htmlspecialchars(strip_tags($_POST['firstName']));
	$username = htmlspecialchars(strip_tags($_POST['username']));
	$email = htmlspecialchars(strip_tags($_POST['email']));
	$phone = htmlspecialchars(strip_tags($_POST['phone']));
	$address = htmlspecialchars(strip_tags($_POST['address']));
	$password = htmlspecialchars(strip_tags($_POST['password']));

	$query = 'INSERT INTO User SET name=:name, firstName=:firstName, username=:username, email=:email, phone=:phone, address=:address, password=:password';

	if ($_POST['rescuer'])
		$query .= ', rescuer=1';

	$stmt = $db->prepare($query);
	$stmt->bindParam('name', $name);
	$stmt->bindParam('firstName', $firstName);
	$stmt->bindParam('username', $username);
	$stmt->bindParam('email', $email);
	$stmt->bindParam('phone', $phone);
	$stmt->bindParam('address', $address);
	$stmt->bindParam('password', $password);
	if ($stmt->execute()) {
		echo json_encode(
			array('success' => 1, 'text' => 'User successfully created')
		);
	} else {
		echo json_encode(
			array('success' => 0, 'text' => 'User cannot be created')
		);
	}
} else {
	echo json_encode(
		array('success' => 0, 'text' => 'Missing parameter(s)')
	);
}