<?php
class Database{

    private $host = "sql4.cluster1.easy-hebergement.net";
    private $db_name = "closed5";
    private $username = "closed5";
    private $password = "pouted2";
    public $conn;

    public function getConnection(){
 
        $this->conn = null;
 
        try{
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
        }catch(PDOException $exception){
            echo "Connection error: " . $exception->getMessage();
        }
 
        return $this->conn;
    }
}
?>