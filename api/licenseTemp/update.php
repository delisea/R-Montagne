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
		if($_POST['license'] < 1000000) {
			$query = 'UPDATE `TrackerLicenseTemp` SET `idUser`=:id WHERE `idLicense`=:idLicense AND idUser IS NULL';

			$stmt = $db->prepare($query);
			$stmt->bindParam('id', $_SESSION['id']);
			$stmt->bindParam('idLicense', $_POST['license']);
			if(!$_SESSION['rescuer']) {
				$stmt->execute();
				if($stmt->rowCount() > 0) {
					if($_SESSION['user']) {
						$query = 'UPDATE `User` SET `user`=1 WHERE `id`=:idUser';
						$stmt = $db->prepare($query);
						$stmt->bindParam('idUser', $_SESSION['id']);
						$_SESSION['user'] = 1;
						$stmt->execute();
					}
					echo json_encode(array('success' => 1 , 'message' => 'Success'));
				}
				else 
					echo json_encode(array('success' => 0 , 'message' => 'Assignation temporary tracker failed.'));
			}
			else 
				echo json_encode(array('success' => 0 , 'message' => 'Admin and Rescuer cannot use temporary licence.'));
		}
		else if($_POST['license'] < 2000000) {
			$query = 'UPDATE `TrackerLicense` SET `idUser`=:id WHERE `id`=:idLicense AND idUser IS NULL';

			$stmt = $db->prepare($query);
			$stmt->bindParam('id', $_SESSION['id']);
			$stmt->bindParam('idLicense', $_POST['license']);
			if(!$_SESSION['user'] && (!$_SESSION['rescuer'] || $_SESSION['admin'])) {
				$stmt->execute();
				if($stmt->rowCount() > 0) {
					$row = $stmt->fetch(PDO::FETCH_ASSOC);
					if(!$_SESSION['admin']) {
						$query = 'UPDATE `User` SET `admin`=1, `rescuer`=1 WHERE `id`=:idUser';
						$stmt = $db->prepare($query);
						$stmt->bindParam('idUser', $_SESSION['id']);
						$_SESSION['admin'] = 1;
						$_SESSION['rescuer'] = 1;
						$stmt->execute();
					}
					$query = 'UPDATE `Tracker` SET `idUser`=:idUser WHERE `idTracker`=:idTracker';
					$stmt = $db->prepare($query);
					$stmt->bindParam('idUser', $_SESSION['id']);
					$track = $_POST['license']%1000000;
					$stmt->bindParam('idTracker', $track);
					$stmt->execute();
					echo json_encode(array('success' => 1 , 'message' => 'Success'));
				}
				else 
					echo json_encode(array('success' => 0 , 'message' => 'Assignation tracker failed.'));
			}
			else echo json_encode(array('success' => 0 , 'message' => 'User cannot use tracker licence.'));
		}
		else if($_POST['license'] < 3000000) {
			$query = 'UPDATE `NetworkLicense` SET `idUser`=:id WHERE `id`=:idLicense AND idUser IS NULL';

			$stmt = $db->prepare($query);
			$stmt->bindParam('id', $_SESSION['id']);
			$stmt->bindParam('idLicense', $_POST['license']);
			if(!$_SESSION['user'] && (!$_SESSION['rescuer'] || $_SESSION['admin'])) {
				$stmt->execute();
				if($stmt->rowCount() > 0) {
					$row = $stmt->fetch(PDO::FETCH_ASSOC);
					if(!$_SESSION['admin']) {
						$query = 'UPDATE `User` SET `admin`=1, `rescuer`=1 WHERE `id`=:idUser';
						$stmt = $db->prepare($query);
						$stmt->bindParam('idUser', $_SESSION['id']);
						$_SESSION['admin'] = 1;
						$_SESSION['rescuer'] = 1;
						$stmt->execute();
					}
					$query = "INSERT INTO `Watch`(`idUser`, `idMap`) VALUES (:id,:idMap)";
					$stmt = $db->prepare($query);
					$stmt->bindParam('id', $_SESSION['id']);
					$track = $_POST['license']%1000000;
					$stmt->bindParam('idMap', $track);
					$stmt->execute();
					echo json_encode(array('success' => 1 , 'message' => 'Success'));
				}
				else 
					echo json_encode(array('success' => 0 , 'message' => 'Assignation network failed.'));
			}
			else echo json_encode(array('success' => 0 , 'message' => 'User cannot use network licence.'));
		}
		else {
			$query = 'UPDATE `RescuerLicense` SET `idUser`=:id WHERE `id`=:idLicense AND idUser IS NULL';

			$stmt = $db->prepare($query);
			$stmt->bindParam('id', $_SESSION['id']);
			$stmt->bindParam('idLicense', $_POST['license']);
			if(!$_SESSION['user'] && !$_SESSION['admin']) {
				$stmt->execute();
				if($stmt->rowCount() > 0) {
					$row = $stmt->fetch(PDO::FETCH_ASSOC);
					if(!$_SESSION['rescuer']) {
						$query = 'UPDATE `User` SET `rescuer`=1 WHERE `id`=:idUser';
						$stmt = $db->prepare($query);
						$stmt->bindParam('idUser', $_SESSION['id']);
						$_SESSION['rescuer'] = 1;
						$stmt->execute();
					}
					$query = "INSERT INTO `Watch`(`idUser`, `idMap`) VALUES (:id,:idMap)";
					$stmt = $db->prepare($query);
					$stmt->bindParam('id', $_SESSION['id']);
					$track = $_POST['license']%1000;
					$stmt->bindParam('idMap', $track);
					$stmt->execute();
					echo json_encode(array('success' => 1 , 'message' => 'Success'));
				}
				else 
					echo json_encode(array('success' => 0 , 'message' => 'Assignation map failed.'));
			}
			else echo json_encode(array('success' => 0 , 'message' => 'User and admin cannot use Map Assignation licence.'));
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