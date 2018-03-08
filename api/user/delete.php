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

if (isset($_POST['id'])) {
	$user->id = $_POST['id'];

	if ($user->delete()) {
	    echo json_encode(
        	array("message" => "User was deleted.")
    );
	} else {
	    echo json_encode(
        	array("message" => "Unable to delete user.")
    	);
	}
} else {
    echo json_encode(
        array("message" => "Unable to delete user.")
    );
}
?>