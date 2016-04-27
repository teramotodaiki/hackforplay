<?php
/**
 * /stages/
 * POST (query:String)
 * queryの値によって処理を振り分ける
*/

require_once '../preload.php';

$query = filter_input(INPUT_POST, 'query') or die('invalid-query');

$fname = "./$query.php";
if (file_exists($fname)) {
  require_once $fname;
} else {
  die('query-not-found');
}

?>
