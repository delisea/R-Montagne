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

if (isset($_POST['username'])) {

    $user->username = $_POST['username'];

    $stmt = $user->findByUsername();
    $num = $stmt->rowCount();

    if ($num > 0) {

        $users_arr = array();
        $users_arr["records"] = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $user_item = array(
                "id" => $id,
                "name" => $name,
                "firstName" => $firstName,
                "username" => $username,
                "email" => $email,
                "phone" => $phone,
                "address" => $address
            );
     
            array_push($users_arr["records"], $user_item);
        }
     
        echo json_encode($users_arr);
    } else {
        echo json_encode(
            array("message" => "No users found.")
        );
    }
} else {
    echo json_encode(
        array("message" => "No users found.")
    );
}
?>