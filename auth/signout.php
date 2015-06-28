<?php
/*
セッション情報を空にし、クッキーを削除する
*/

require_once '../preload.php';

session_start();
setcookie(session_name(), '', time() - 1);

session_destroy();
session_commit();

 ?>