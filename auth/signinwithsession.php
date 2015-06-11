<?php
/*
セッション情報をもとにサインインを行う
Input:
Output: no-session , success
*/

require_once '../sessionsettings.php';
session_start();
if (isset($_SESSION['UserID'])) {
	exit("success");
}else{
	exit("no-session");
}

session_commit();

 ?>