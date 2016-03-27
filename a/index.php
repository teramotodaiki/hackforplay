<?php

try {
	require_once '../preload.php';

	// ユーザー名・パスワード
	$accept_page_username	= 'hackforplay';
	$accept_page_password	= 'Wbjgqdp6vLq7tFv';

	switch (true) {
	    case !isset($_SERVER['PHP_AUTH_USER'], $_SERVER['PHP_AUTH_PW']):
	    case $_SERVER['PHP_AUTH_USER'] !== $accept_page_username:
	    case $_SERVER['PHP_AUTH_PW']   !== $accept_page_password:
	        header('WWW-Authenticate: Basic realm="Enter username and password."');
	        header('Content-Type: text/plain; charset=utf-8');
	        die('Sorry!! but in this page, visitors are limited browsing');
	}

	header('Content-Type: text/html; charset=utf-8');

	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

	// パビリオン一覧を取得
	$stmt		= $dbh->prepare('SELECT "ID","DisplayName","KitStageID" FROM "Pavilion"');
	$stmt->execute();
	$pavilion	= $stmt->fetchAll(PDO::FETCH_ASSOC);

	include 'view.php';

} catch (Exception $e) {
	Rollbar::report_exception($e);
}

?>
