<?php
/*
Mypage ユーザーごとのページ。自分のページ（ownview）を見る場合はセッションが必要
ユーザーの情報の閲覧や更新は非同期なAPIを用いる
*/

require_once '../preload.php';

// 自分自身のページ（ID）か？
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if($id === FALSE){
	exit();
}

if (isset($session_userid) && ($id == $session_userid || $id == NULL)) {
	include 'ownview.php';
}elseif ($id != NULL) {
	include 'othersview.php';
}else{
	header('Location:../');
}

?>