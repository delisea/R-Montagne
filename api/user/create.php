<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../objects/user.php';
 
$database = new Database();
$db = $database->getConnection();
 
$user = new User($db);

if (isset($_POST['name']) && isset($_POST['firstName']) && isset($_POST['username']) && isset($_POST['email']) && isset($_POST['phone']) && isset($_POST['address'])) {
	$user->name = $_POST['name'];
	$user->firstName = $_POST['firstName'];
	$user->username = $_POST['username'];
	$user->email = $_POST['email'];
	$user->phone = $_POST['phone'];
	$user->address = $_POST['address'];

	if ($user->create()) {
	    echo json_encode(
	        array("message" => "User was created.")
	    );
	} else {
	    echo json_encode(
	        array("message" => "Unable to create user.")
	    );
	}
} else {
    echo json_encode(
        array("message" => "Unable to create user.")
    );
}
?>