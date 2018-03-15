<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
 
$database = new Database();
$db = $database->getConnection();

function sendGCM($message, $target) {

	//$url = 'https://r-montagne.firebaseio.com/message_list.json';
	$url = 'https://r-montagne.firebaseio.com/alerts/'.$target.'.json';
	$date = new DateTime();
	$fields = '{"id_tracker" : '.$message.', "map" : '.$target.', "time" : '.$date->getTimestamp().'}';//'{"user_id" : "jack", "text" : "Ahoy!"}';

	$ch = curl_init ();
	curl_setopt ( $ch, CURLOPT_URL, $url );
	curl_setopt ( $ch, CURLOPT_POST, true );
	curl_setopt ( $ch, CURLOPT_POSTFIELDS, $fields );

	$result = curl_exec ( $ch );
	echo $result;
	curl_close ( $ch );
}
function sendGCMR($message, $target, $lat, $lon, $al) {
     
     
        //$url = 'https://r-montagne.firebaseio.com/message_list.json';
    $url = 'https://r-montagne.firebaseio.com/refresh/'.$target.'.json';
    $date = new DateTime();
        $fields = '{"lat" : '.$lat.',"lon" : '.$lon.',"id_tracker" : '.$message.', "map" : '.$target.', "time" : '.$date->getTimestamp().', "al" : '.$al.'}';//'{"user_id" : "jack", "text" : "Ahoy!"}';
     
        $ch = curl_init ();
        curl_setopt ( $ch, CURLOPT_URL, $url );
        curl_setopt ( $ch, CURLOPT_POST, true );
        curl_setopt ( $ch, CURLOPT_POSTFIELDS, $fields );
     
        $result = curl_exec ( $ch );
        echo $result;
        curl_close ( $ch );
    }
     


if (isset($_POST['id']) && isset($_POST['latitude']) && isset($_POST['longitude']) && isset($_POST['alert']) && isset($_POST['map'])) {

	$id = htmlspecialchars(strip_tags($_POST['id']));
	$map = htmlspecialchars(strip_tags($_POST['map']));

	$query = 'SELECT idLicense, end FROM TrackerLicenseTemp WHERE idTracker=:id AND idMap=:map ORDER BY end DESC';

	$stmt = $db->prepare($query);
	$stmt->bindParam('id', $id);
	$stmt->bindParam('map', $map);
	$stmt->execute();
	$row = $stmt->fetch(PDO::FETCH_ASSOC);
	extract($row);
	$entry = array(
		'idLicense' => $idLicense,
		'end' => $end
	);

	$latitude = htmlspecialchars(strip_tags($_POST['latitude']));
	$longitude = htmlspecialchars(strip_tags($_POST['longitude']));
	$alert = htmlspecialchars(strip_tags($_POST['alert']));

	$query = 'INSERT INTO Historic SET idLicense=:id, latitude=:latitude, longitude=:longitude, alert=:alert, map=:map';

	$stmt = $db->prepare($query);
	$stmt->bindParam('id', $entry['idLicense']);
	$stmt->bindParam('latitude', $latitude);
	$stmt->bindParam('longitude', $longitude);
	$stmt->bindParam('alert', $alert);
	$stmt->bindParam('map', $map);
	if ($stmt->execute()) {
		echo json_encode(
			array('success' => 1, 'message' => 'Historic entry successfully created')
		);
		if ($alert == '1') {

			sendGCM($entry['idLicense'], $map);
		}
  sendGCMR($entry['idLicense'], $map, $latitude, $longitude, $alert);
	} else {
		echo json_encode(
			array('success' => 0, 'message' => 'An error has occured')
		);
	}
} else {
	echo json_encode(
		array('success' => 0, 'message' => 'Invalid parameters')
	);
}