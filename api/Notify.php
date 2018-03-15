<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

//include_once '../config/database.php';

function sendGCM($message, $target) {


    //$url = 'https://r-montagne.firebaseio.com/message_list.json';
$url = 'https://r-montagne.firebaseio.com/alerts/'.$target.'.json';
$date = new DateTime();
    $fields = '{"id_tracker" : '.$message.', "map" : '.$target.', "time" : '.$date->getTimestamp().'}';//'{"user_id" : "jack", "text" : "Ahoy!"}';

    $ch = curl_init ();
    curl_setopt ( $ch, CURLOPT_URL, $url );
    curl_setopt ( $ch, CURLOPT_POST, true );
    curl_setopt ( $ch, CURLOPT_POSTFIELDS, $fields );

    $result = curl_exec ( $ch );
    echo $result;
    curl_close ( $ch );
}

if (isset($_GET['target']) && isset($_GET['message'])) {
sendGCM($_GET['message'], $_GET['target']);
}