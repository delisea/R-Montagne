    <?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
     
    include_once '../config/database.php';
     
    $database = new Database();
    $db = $database->getConnection();
     
    		$query = 'INSERT INTO `Map`() VALUES ()';
     
    		$stmt = $db->prepare($query);
     
                    $stmt->execute();
     
                    $lid = $db->lastInsertId();
    		$query = 'INSERT INTO NetworkLicense SET id=:id, idMap=:idb';
     
    		$stmt = $db->prepare($query);
    		$stmt->bindValue('id', 2000000+$lid);
    		$stmt->bindParam('idb', $lid);
     
    		if ($stmt->execute()) {
    			echo json_encode(
    				array('success' => 1, 'message' => 'Tracker successfully created')
    			);
    		} else {
    			echo json_encode(
    				array('success' => 0, 'message' => 'An error has occured')
    			);
    		}
     