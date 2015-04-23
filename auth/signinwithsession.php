<?php
/*
セッション情報をもとにサインインを行う
Input:
Output: no-session , success
*/

session_cache_limiter('private');
session_cache_expire(30);

session_start();
if (isset($_SESSION['ID'])) {
	exit("success");
}else{
	exit("no-session");
}

 ?>