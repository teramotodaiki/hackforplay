<?php
/**
* Dev kit tools
* CONFIDENCIAL
*/
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
  include 'view.php';
} else {
	// Menu view
	include 'menu.php';
}

?>
