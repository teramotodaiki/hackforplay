<?php
/**
 * Dev kit tools
 * CONFIDENCIAL
*/
try {

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

	require_once '../preload.php';

  $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
  if (isset($id)) {
    // Tool view
    $stmt = $dbh->prepare('SELECT "Title","RawCode" FROM "Stage" INNER JOIN "Script" ON "Stage"."ScriptID"="Script"."ID" WHERE "Stage"."ID"=:id');
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    $stage = $stmt->fetch(PDO::FETCH_ASSOC) or die("Invalid stage id $id");
    include 'view.php';
  }

} catch (Exception $e) {

	require_once '../exception/tracedata.php';
	traceData($e);

}
?>
