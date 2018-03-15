<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

if (isset($_POST['session'])) {

	session_id($_POST['session']);
	session_start();

	if (isset($_SESSION['id'])) {
		$arr = array();
		$arr['trackers'] = array();

		$query = 'SELECT t.idTracker, l.idLicense, MAX(l.end) AS end  FROM Tracker AS t LEFT JOIN TrackerLicenseTemp AS l ON t.idTracker=l.idTracker WHERE t.idUser='.$_SESSION['id'].' GROUP BY t.idTracker';

		$stmt = $db->prepare($query);
		$stmt->execute();
                $date = new DateTime();

			while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

				$entry = array(
					'idTracker' => $row['idTracker'],
					'idLicense' => $row['idLicense'],
					'end' => ($row['end'] === NULL)?NULL:round(($row['end']-$date->getTimestamp())/(3600*24),1),
					'ended' => ($row['end'] === NULL || $row['end']<$date->getTimestamp())
				);

				array_push($arr['trackers'], $entry);
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