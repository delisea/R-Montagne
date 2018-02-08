<?php
class User {

    private $conn;
    private $table_name = "User";

    public $id;
    public $name;
    public $firstName;
    public $username;
    public $email;
    public $phone;
    public $address;

    public function __construct($db) {
        $this->conn = $db;
    }

    function read() {
    
        $query = "SELECT u.id, u.name, u.firstName, u.username, u.email, u.phone, u.address FROM ".$this->table_name." u";
    
        $stmt = $this->conn->prepare($query);

        $stmt->execute();
     
        return $stmt;
    }

    function create() {
    
        $query = "INSERT INTO ".$this->table_name." SET name=:name, firstName=:firstName, username=:username, email=:email, phone=:phone, address=:address";
    
        $stmt = $this->conn->prepare($query);
    
        $this->name=htmlspecialchars(strip_tags($this->name));
        $this->firstName=htmlspecialchars(strip_tags($this->firstName));
        $this->username=htmlspecialchars(strip_tags($this->username));
        $this->email=htmlspecialchars(strip_tags($this->email));
        $this->phone=htmlspecialchars(strip_tags($this->phone));
        $this->address=htmlspecialchars(strip_tags($this->address));
    
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":firstName", $this->firstName);
        $stmt->bindParam(":username", $this->username);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":address", $this->address);
    
        if ($stmt->execute()){
            return true;
        }
        return false;
    }

    function update() {
    
        $query = "UPDATE ".$this->table_name." SET name=:name, firstName=:firstName, username=:username, email=:email, phone=:phone, address=:address WHERE id=:id";
    
        $stmt = $this->conn->prepare($query);
    
        $this->id=htmlspecialchars(strip_tags($this->id));
        $this->name=htmlspecialchars(strip_tags($this->name));
        $this->firstName=htmlspecialchars(strip_tags($this->firstName));
        $this->username=htmlspecialchars(strip_tags($this->username));
        $this->email=htmlspecialchars(strip_tags($this->email));
        $this->phone=htmlspecialchars(strip_tags($this->phone));
        $this->address=htmlspecialchars(strip_tags($this->address));
    
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':firstName', $this->firstName);
        $stmt->bindParam(':username', $this->username);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':phone', $this->phone);
        $stmt->bindParam(':address', $this->address);
    
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    function delete() {
    
        $query = "DELETE FROM ".$this->table_name." WHERE id=:id";
    
        $stmt = $this->conn->prepare($query);
    
        $this->id=htmlspecialchars(strip_tags($this->id));
    
        $stmt->bindParam(':id', $this->id);
    
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    function findByUsername() {

        $query = "SELECT u.id, u.name, u.firstName, u.username, u.email, u.phone, u.address FROM ".$this->table_name." u WHERE username=:username";

        $stmt = $this->conn->prepare($query);

        $this->username=htmlspecialchars(strip_tags($this->username));

        $stmt->bindParam(':username', $this->username);

        $stmt->execute();

        return $stmt;
    }
}
?>