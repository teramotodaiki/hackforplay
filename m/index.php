<?php
/*
Mypage ユーザーごとのページ。自分のページ（ownview）を見る場合はセッションが必要
ユーザーの情報の閲覧や更新は非同期なAPIを用いる
*/

try {

	require_once '../preload.php';

	// ステージ一覧をフェッチする開始位置
	$fetch_start_id		= filter_input(INPUT_GET, 'start', FILTER_VALIDATE_INT);
	if (!$fetch_start_id) {
		$fetch_start_id	= 0;
	}

	// 自分自身のページ（ID）か？
	$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
	if($id === FALSE){
		exit();
	}

	if (isset($session_userid) && ($id === $session_userid || $id === NULL)) {
		include 'ownview.php';
	}elseif ($id !== NULL) {
		include 'othersview.php';
	}else{
		header('Location:../');
	}

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}
?>