<?php
/*
ステージに対してコメントとタグづけを同時に行う
Input:	stage_id , message , tags(Array) , thumb , timezone , (attendance-token)
Output:　missing-stage , missing-message , already-comment , database-error
*/

require_once '../preload.php';

try {

	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

	$stageid	= filter_input(INPUT_POST, 'stageid', FILTER_VALIDATE_INT);

	// ステージが存在するか？
	$stmt	= $dbh->prepare('SELECT "Title" FROM "Stage" WHERE "ID"=:stageid');
	$stmt->bindValue(":stageid", $stageid, PDO::PARAM_INT);
	$stmt->execute();
	$stage	= $stmt->fetch();
	if (!$stage) {
		exit('missing-stage');
	}

	// すでにコメントされていないか？
	if ($session_userid) {
		$stmt			= $dbh->prepare('SELECT "ID" FROM "CommentData" WHERE "StageID"=:stageid AND "UserID"=:userid AND "State"!=:removed');
		$stmt->bindValue(":stageid", $stageid, PDO::PARAM_INT);
		$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
		$stmt->bindValue(":removed", 'removed', PDO::PARAM_STR);
		$stmt->execute();
		$old_comment	= $stmt->fetch();

		if ($old_comment) {
			exit('already-comment');
		}
	}

	// サムネイルを作成
	$thumb	= filter_input(INPUT_POST, 'thumb');

	if ($thumb) {
		$thumb = preg_replace('/data:[^,]+,/i', '', $thumb); //ヘッダに「data:image/png;base64,」が付いているので、それは外す
		$thumb = base64_decode($thumb); //残りのデータはbase64エンコードされているので、デコードする
		$image = imagecreatefromstring($thumb); //まだ文字列の状態なので、画像リソース化
		imagesavealpha($image, TRUE); // 透明色の有効

		// random name
		$bytes 	= openssl_random_pseudo_bytes(16); // 16bytes (32chars)
		$thumb_url	= '/s/thumbs/'.bin2hex($bytes).'.png'; // binaly to hex
		imagepng($image, '..' . $thumb_url); // 相対パス
	}else{
		$thumb_url = NULL;
	}

	// メッセージを挿入
	$message	= filter_input(INPUT_POST, 'message');
	if (!$message) {
		exit('missing-message');
	}
	$timezone		= filter_input(INPUT_POST, 'timezone', FILTER_VALIDATE_REGEXP, array("options"=>array("regexp"=>"/^(\+|\-)[0-1][0-9]:00$/")));
	if($timezone === FALSE || $timezone === NULL){
		$timezone	= '+00:00';
	}

	$stmt		= $dbh->prepare('INSERT INTO "CommentData" ("StageID","UserID","Message","Thumbnail","State","Registered") VALUES(:stageid,:userid,:message,:thumbnail,:published,:gmt)');

	$stmt->bindValue(":stageid", $stageid, PDO::PARAM_INT);
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->bindValue(":message", $message, PDO::PARAM_STR);
	$stmt->bindValue(":thumbnail", $thumb_url, PDO::PARAM_STR);
	$stmt->bindValue(":published", 'published', PDO::PARAM_STR);
	$stmt->bindValue(":gmt", gmdate("Y-m-d H:i:s") . $timezone, PDO::PARAM_STR);
	$flag		= $stmt->execute();

	if (!$flag) {
		// 挿入失敗
		exit('database-error');
	}

	// タグをつける
	$comment_id	= $dbh->lastInsertId("CommentData");
	$tags		= filter_input(INPUT_POST, 'tags');

	$stmt_se	= $dbh->prepare('SELECT "ID" FROM "StageTagData" WHERE "IdentifierString"=:value');
	$stmt_in	= $dbh->prepare('INSERT INTO "StageTagMap" ("StageID","TagID","CommentID","Registered") VALUES(:stageid,:tag_id,:comment_id,:gmt)');

	foreach (explode(',', $tags) as $key => $value) {

		// タグIDの取得
		$stmt_se->bindValue(":value", $value, PDO::PARAM_STR);
		$stmt_se->execute();
		$tag_id	= $stmt_se->fetch(PDO::FETCH_COLUMN, 0);

		if ($tag_id) {

			// タグの追加
			$stmt_in->bindValue(":stageid", $stageid, PDO::PARAM_INT);
			$stmt_in->bindValue(":tag_id", $tag_id, PDO::PARAM_INT);
			$stmt_in->bindValue(":comment_id", $comment_id, PDO::PARAM_INT);
			$stmt_in->bindValue(":gmt", gmdate("Y-m-d H:i:s") . $timezone, PDO::PARAM_STR);
			$stmt_in->execute();
		}

	}

} catch (Exception $e) {

	require_once '../exception/tracedata.php';
	traceData($e);
	die('database-error');
}
?>