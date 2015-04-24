<?php
/*
セッション情報を空にし、クッキーを削除する
*/

session_start();
setcookie(session_name(), '', time() - 1);

session_destroy();
session_commit();

 ?>