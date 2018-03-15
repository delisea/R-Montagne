<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

if (isset($_POST['session']) && isset($_POST['map'])) {
	
	session_id($_POST['session']);
	session_start();

	if (isset($_SESSION['id'])) {

		$id = $_SESSION['id'];
		$map = htmlspecialchars(strip_tags($_POST['map']));

		$arr = array();
		if($_SESSION['rescuer'])
			$query = 'SELECT date, latitude, longitude, alert FROM `Historic` WHERE map = :map AND alert = 1';
		else
			$query = 'SELECT date, latitude, longitude, alert FROM Historic AS h INNER JOIN TrackerLicenseTemp as t INNER JOIN User AS u ON h.idLicense = t.idLicense AND u.id = t.idUser WHERE u.id=:id AND h.map=:map ORDER BY h.date DESC';
		//$query = 'SELECT h.date, h.latitude, h.longitude, h.alert, h.map FROM Historic as h, Tracker as t, User as u WHERE u.id=t.idUser AND t.idTracker=h.idTracker AND u.id=:id AND h.map=:map ORDER BY h.date DESC';

		$stmt = $db->prepare($query);
		if(!$_SESSION['rescuer'])
			$stmt->bindParam('id', $id);
		$stmt->bindParam('map', $map);
		$stmt->execute();
		$num = $stmt->rowCount();

		if ($num > 0) {
			$self = array();

			while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
				extract($row);

				$entry = array(
					'date' => $date,
					'latitude' => $latitude,
					'longitude' => $longitude,
					'alert' => $alert,
					'map' => $map
				);

				array_push($self, $entry);
			}

			$arr['self'] = $self;
		} else {
			$arr['self'] = array();
		}



		if(!$_SESSION['rescuer']) {
			$query = 'SELECT date FROM Historic AS h INNER JOIN TrackerLicenseTemp as t INNER JOIN User AS u ON h.idLicense = t.idLicense AND u.id = t.idUser WHERE u.id=:id ORDER BY h.date DESC LIMIT 1';
			$stmt = $db->prepare($query);	

			$stmt->bindParam('id', $id);
			$stmt->execute();

			if ($row = $stmt->fetch(PDO::FETCH_ASSOC))
				$arr['last'] = $row;
			else
				$arr['last'] = array('date' => 0);
		}


		
		if($_SESSION['rescuer'] || count($arr['self']) > 0 /* TODO: && date < timestamp + x */) {
		//$query = 'SELECT h.idTracker, h.date, h.latitude, h.latitude, h.longitude, h.alert, h.map FROM Historic as h, (SELECT h.idTracker, MAX(h.date) as md FROM Historic as h WHERE idTracker!=:id GROUP BY h.idTracker) as hm WHERE h.date=hm.md AND h.map=:map';
		$query = 'SELECT latitude, longitude, alert, date, hi.idLicense AS idTracker FROM Historic As hi INNER JOIN (SELECT h.idLicense, MAX(date) AS da FROM Historic AS h INNER JOIN TrackerLicenseTemp as t INNER JOIN User AS u ON h.idLicense = t.idLicense AND u.id = t.idUser WHERE u.id!=:id AND h.map=:map GROUP BY idUser) AS Ma ON hi.date=Ma.da AND hi.idLicense=Ma.idLicense';

		$stmt = $db->prepare($query);
		$stmt->bindParam('id', $id);
		$stmt->bindParam('map', $map);
		$stmt->execute();

			$others = array();

			while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
				extract($row);

				$entry = array(
					'idTracker' => $idTracker,
					'date' => $date,
					'latitude' => $latitude,
					'longitude' => $longitude,
					'alert' => $alert,
					'map' => $map
				);

				array_push($others, $entry);
			}

			$arr['others'] = $others;
		} else {
			$arr['others'] = array();
		}

		$query = 'SELECT b.id, b.latitude, b.longitude, b.map FROM Beacon as b WHERE b.map=:map';

		$stmt = $db->prepare($query);
		$stmt->bindParam('map', $map);
		$stmt->execute();
		$num = $stmt->rowCount();

		if ($num > 0) {
			$beacons = array();

			while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
				extract($row);

				$entry = array(
					'id' => $id,
					'latitude' => $latitude,
					'longitude' => $longitude,
					'map' => $map
				);

				array_push($beacons, $entry);
			}

			$arr['beacons'] = $beacons;
		} else {
			$arr['beacons'] = array();
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