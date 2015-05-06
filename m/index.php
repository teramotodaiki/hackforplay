<?php
/*
Mypage ユーザーごとのページ。自分のページ（ownview）を見る場合はセッションが必要
ユーザーの情報の閲覧や更新は非同期なAPIを用いる
*/

require_once '../preload.php';

// 自分自身のページ（ID）か？
$id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
if($id = FALSE){
	exit();
}
session_start();
if (isset($_SESSION['UserID'])) {
	$userid = $_SESSION['UserID'];
}
session_commit();

if (isset($userid) && ($id == $userid || $id == NULL)) {
	include 'ownview.php';
}elseif ($id != NULL) {
	include 'othersview.php';
}else{
	header('Location:../');
}

?>