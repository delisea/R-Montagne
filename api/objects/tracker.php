<?php
class Tracker{

	private $conn;
	private $table_name = "Tracker";

	public $idTracker;
	public $idUser;

	public function __construct($db) {
		$this->conn = $db;
	}

	function read() {

		$query = "SELECT t.idTracker, t.idUser FROM ".$this->table_name." t";

		$stmt = $this->conn->prepare($query);

		$stmt->execute();

		return $stmt;
	}

	function create() {

		$query = "INSERT INTO ".$this->table_name." SET idTracker=:idTracker, idUser=:idUser";

		$stmt = $this->conn->prepare($query);

		$this->idTracker=htmlspecialchars(strip_tags($this->idTracker));
		$this->idUser=htmlspecialchars(strip_tags($this->idUser));

		$stmt->bindParam(":idTracker", $this->idTracker);
		$stmt->bindParam(":idUser", $this->idUser);
		
		if($stmt->execute()) {
			return true;
		}
		return false;
	}

	function update() {

		$query = "UPDATE ".$this->table_name." SET idUser=:idUser WHERE idTracker=:idTracker";

		$stmt = $this->conn->prepare($query);

		$this->idTracker=htmlspecialchars(strip_tags($this->idTracker));
		$this->idUser=htmlspecialchars(strip_tags($this->idUser));

		$stmt->bindParam(':idTracker', $this->idTracker);
		$stmt->bindParam(':idUser', $this->idUser);

		if ($stmt->execute()) {
			return true;
		}
		return false;
	}

	function delete() {

		$query = "DELETE FROM ".$this->table_name." WHERE idTracker=:idTracker";

		$stmt = $this->conn->prepare($query);

		$this->idTracker=htmlspecialchars(strip_tags($this->idTracker));

		$stmt->bindParam(':idTracker', $this->idTracker);

		if($stmt->execute()) {
			return true;
		}
		return false;
	}
}
?>