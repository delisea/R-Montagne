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
		$trackers = array();
                $date = new DateTime();

		$query = 'SELECT t.idTracker FROM Tracker AS t LEFT JOIN (SELECT idTracker, MAX(end) AS me FROM TrackerLicenseTemp GROUP BY idTracker) AS l ON t.idTracker=l.idTracker WHERE t.idUser='.$_SESSION['id'].' AND (me IS NULL OR me < '.$date->getTimestamp().')';

		$stmt = $db->prepare($query);
		$stmt->execute();

			while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
				array_push($trackers, $row['idTracker']);
			}

if(count($trackers) >= $_POST['licenses']) {
//TODO check map
for ($i = 0; $i < $_POST['licenses']; $i++) {
  $query = 'INSERT INTO TrackerLicenseTemp(idTracker, IdMap, end) VALUES ('.$trackers[$i].', '.$_POST['map'].', '.($_POST['days']*3600*24+$date->getTimestamp()).')'; 
  $stmt = $db->prepare($query);
  $stmt->execute();
}

echo json_encode(array('success' => 1));

}
else {
echo json_encode(
			array('success' => 0, 'message' => 'Trackers not activated, only ' . count($trackers) . ' free.')
		);
}
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