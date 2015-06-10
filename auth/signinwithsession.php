<?php
/*
セッション情報をもとにサインインを行う
Input:
Output: no-session , success
*/

session_cache_limiter('private_no_expire');
session_cache_expire(48 * 60); // 48時間セッション継続
session_set_cookie_params(48 * 60 * 60);
session_start();
if (isset($_SESSION['UserID'])) {
	exit("success");
}else{
	exit("no-session");
}

session_commit();

 ?>