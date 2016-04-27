<?php
/*
スクリプトを出力, またはsessionStorageから取り出すよう指示する (JavaScript)
Input: (key|id)
key: sessionStorageのキーを表す文字列
id: Script ID
*/

require_once '../../preload.php';

// Get script
$key = filter_input(INPUT_GET, 'key');
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

if (isset($key)) {
  $script = "eval(sessionStorage.getItem('$key') || '');\n";
} elseif (isset($id)) {
  $stmt	= $dbh->prepare('SELECT "RawCode" FROM "Script" WHERE "ID"=:id');
  $stmt->bindValue(':id', $id, PDO::PARAM_INT);
  $stmt->execute();
  $script	= $stmt->fetch(PDO::FETCH_COLUMN);
}

?>
function HackforPlayInitializeRestaging() {
<?php echo $script; ?>
}
