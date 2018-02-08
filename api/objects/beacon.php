<?php
class Beacon {

	private $conn;
	private $table_name = "Beacon";

	public $idBeacon;
	public $position;

	public function __construct($db) {
		$this->conn = $db;
	}

	function read() {

		$query = "SELECT b.idBeacon, b.position FROM ".$this->table_name." b";

		$stmt = $this->conn->prepare($query);

		$stmt->execute();

		return $stmt;
	}

	function create() {

		$query = "INSERT INTO ".$this->table_name." SET idBeacon=:idBeacon, position=:position";

		$stmt = $this->conn->prepare($query);

		$this->idBeacon=htmlspecialchars(strip_tags($this->idBeacon));
		$this->position=htmlspecialchars(strip_tags($this->position));

		$stmt->bindParam(":idBeacon", $this->idBeacon);
		$stmt->bindParam(":position", $this->position);

		if ($stmt->execute()) {
			return true;
		}
		return false;
	}

	function update() {

		$query = "UPDATE ".$this->table_name." SET position=:position WHERE idBeacon=:idBeacon";

		$stmt = $this->conn->prepare($query);

		$this->idBeacon=htmlspecialchars(strip_tags($this->idBeacon));
		$this->position=htmlspecialchars(strip_tags($this->position));

		$stmt->bindParam(':idBeacon', $this->idBeacon);
		$stmt->bindParam(':position', $this->position);

		if ($stmt->execute()) {
			return true;
		}
		return false;
	}

	function delete() {

		$query = "DELETE FROM ".$this->table_name." WHERE idBeacon=:idBeacon";

		$stmt = $this->conn->prepare($query);

		$this->idBeacon=htmlspecialchars(strip_tags($this->idBeacon));

		$stmt->bindParam(':idBeacon', $this->idBeacon);

		if($stmt->execute()) {
			return true;
		}
		return false;
	}
}