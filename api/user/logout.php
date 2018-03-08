<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if (isset($_POST['session'])) {

	session_id($_POST['session']);
	session_start();
	session_destroy();

	echo json_encode(
		array('success' => 1)
	);
} else {
	echo json_encode(
		array('success' => 0)
	);
}