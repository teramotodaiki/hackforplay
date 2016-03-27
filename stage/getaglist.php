<?php
/*
タグのリストを取得する
Input:	(attendance-token)
Output:	parse-error , JSON:{information_of_tags}
information_of_tags:
{
	values : [
		IdentifierString : 識別子
		DisplayString : ラベルとして表示する場合の文字
		LabelColor : ラベルとして表示する場合の背景色
	]
}
*/

require_once '../preload.php';

try {

	// タグをすべて取得
	$stmt	= $dbh->prepare('SELECT "IdentifierString","DisplayString","LabelColor" FROM "StageTagData"');
	$stmt->execute();

	$tags 	= $stmt->fetchAll(PDO::FETCH_ASSOC);

	// JSONで返す
	$information_of_tags 			= new stdClass;
	$information_of_tags->values	= $tags;
	$json	= json_encode($information_of_tags);
	if (!$json) {
		// なんらかのエラー
		exit('parse-error');
	}

	echo $json;

} catch (Exception $e) {
	Rollbar::report_exception($e);
	die('database-error');
}
?>
