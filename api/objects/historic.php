<?php
class Historic {
	
	private $conn;
	private $table_name = "Historic";

	public $idTracker;
	public $date;
	public $position;
	public $alert;

	public function __construct($db) {
		$this->conn = $db;
	}

	function read() {

		$query = "SELECT h.idTracker, h.date, h.position, h.alert FROM ".$this->table_name." h";

		$stmt = $this->conn->prepare($query);

		$stmt->execute();

		return $stmt;
	}

	function create() {

		$query = "INSERT INTO ".$this->table_name." SET idTracker=:idTracker, position=:position, alert=:alert";

		$stmt = $this->conn->prepare($query);

		$this->idTracker=htmlspecialchars(strip_tags($this->idTracker));
		$this->position=htmlspecialchars(strip_tags($this->position));
		$this->alert=htmlspecialchars(strip_tags($this->alert));

		$stmt->bindParam(':idTracker', $this->idTracker);
		$stmt->bindParam(':position', $this->position);
		$stmt->bindParam(':alert', $this->alert);
		
		if ($stmt->execute()) {
			return true;
		}
		return false;
	}

	function update() {

		$query = "UPDATE ".$this->table_name." SET position=:position, alert=:alert WHERE idTracker=:idTracker AND date=:date";

		$stmt = $this->conn->prepare($query);

		$this->idTracker=htmlspecialchars(strip_tags($this->idTracker));
		$this->date=htmlspecialchars(strip_tags($this->date));
		$this->position=htmlspecialchars(strip_tags($this->position));
		$this->alert=htmlspecialchars(strip_tags($this->alert));

		$stmt->bindParam(':idTracker', $this->idTracker);
		$stmt->bindParam(':date', $this->date);
		$stmt->bindParam(':position', $this->position);
		$stmt->bindParam(':alert', $this->alert);

		if ($stmt->execute()) {
			return true;
		}
		return false;
	}

	function delete() {

		$query = "DELETE FROM ".$this->table_name." WHERE idTracker=:idTracker AND date=:date";

		$stmt = $this->conn->prepare($query);

		$this->idTracker=htmlspecialchars(strip_tags($this->idTracker));
		$this->date=htmlspecialchars(strip_tags($this->date));

		$stmt->bindParam(':idTracker', $this->idTracker);
		$stmt->bindParam(':date', $this->date);

		if ($stmt->execute()) {
			return true;
		}
		return false;
	}
}
?>