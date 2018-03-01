<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

if (isset($_POST['username'])) {

	$username = htmlspecialchars(strip_tags($_POST['username']));

	if (isset($_POST['password'])) {

		$password = htmlspecialchars(strip_tags($_POST['password']));

		$query = "SELECT u.name, u.firstName, u.username, u.email, u.phone, u.address, u.rescuer FROM  User as u WHERE username=:username AND password=:password";

		$stmt = $db->prepare($query);
		$stmt->bindParam('username', $username);
		$stmt->bindParam('password', $password);
		$stmt->execute();
		$num = $stmt->rowCount();

		if ($num > 0) {

			$arr = array();

			$row = $stmt->fetch(PDO::FETCH_ASSOC);
			extract($row);

			$user = array(
				"name" => $name,
				"firstName" => $firstName,
				"username" => $username,
				"email" => $email,
				"phone" => $phone,
				"address" => $address,
				"rescuer" => $rescuer
			);

			$arr['success'] = 1;
			$arr['user'] = $user;

			session_start();
			$arr['session'] = session_id();

			echo json_encode($arr);
		} else {
			echo json_encode(
				array('success' => 0, 'text' => 'Bad username or password')
			);
		}
	} else {
		echo json_encode(
			array('success' => 0, 'text' => 'No password given')
		);
	}
} else {
	echo json_encode(
		array('success' => 0, 'text' => 'No username given')
	);
}