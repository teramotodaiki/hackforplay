<?php
/*
スクリプトを出力, またはsessionStorageから取り出すよう指示する (JavaScript)
Input: id
id: Script ID
*/

require_once '../preload.php';

// Get script
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT) or die('Invalid ID');

$stmt	= $dbh->prepare('SELECT "RawCode" FROM "Script" WHERE "ID"=:id');
$stmt->bindValue(':id', $id, PDO::PARAM_INT);
$stmt->execute();
$script	= $stmt->fetch(PDO::FETCH_COLUMN) or die('Script not found');
echo $script;

?>
