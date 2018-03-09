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

        $arr = array();
        $arr['users'] = array();

        $query = 'SELECT id, name, firstName, username, email, phone, address, rescuer FROM User';

        $stmt = $db->prepare($query);
        $stmt->execute();
        $num = $stmt->rowCount();

        if (num > 0) {

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

                extract($row);

                $entry = array(
                    'id' => $id,
                    'name' => $name,
                    'firstName' => $firstName,
                    'username' => $username,
                    'email' => $email,
                    'phone' => $phone,
                    'address' => $address,
                    'rescuer' => $rescuer
                );

                array_push($arr['users'], $entry);
            }
        }

        $arr['success'] = 1;
        echo json_encode($arr);
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