if(isset($Param->session)) {
	session_id($Param->session);
	session_start();
}