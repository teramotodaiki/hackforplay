<?php
/*
Embed frame の起点となるスクリプト. 任意のキットをロードし、改造コードスクリプトを埋め込む
Input: type , (id,key|id|token)
  type: 改造コードスクリプトの読み込み方法を表す3文字のアルファベット (ses|sta|pro)
  key: type=ses のとき、sessionStorageのキーを表す文字列
  src: type=ses のとき、キットごとのローカルスクリプトをロードするHTML要素. <head>内に埋め込まれる. /embed/{src}/index.php となるような相対パス.
  id: type=sta|ses のとき、ステージのIDを表す数値
  token: type=pro のとき、プロジェクトトークンの文字列
*/

require_once '../preload.php';

try {

	$id	= filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

	$stmt	= $dbh->prepare('SELECT "Src" FROM "Stage" WHERE "ID"=:id');
	$stmt->bindValue(':id', $id, PDO::PARAM_INT);
	$stmt->execute();
	$stage = $stmt->fetch(PDO::FETCH_ASSOC);

  $sourceElement = file_get_contents($stage['Src'], true) or die('Failed to load kit');

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	exit('Error loading frame');
}

?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="IE=Edge">
    <meta name="viewport" content="width=device-width, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <title></title>
    <?php echo $sourceElement; ?>
  </head>
  <body>
  </body>
</html>
