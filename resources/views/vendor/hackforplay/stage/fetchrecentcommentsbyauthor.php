<?php
/*
最大$max_fetch_length件までのリミット値を受け取り、その個数だけの、ユーザーが作成したステージに対するコメントを、新しいものから順に出力する
Input:	start , length , (attendance-token)
Output:	no-session , parse-error , JSON:{information_of_comments}
information_of_comments:
{
values : [
	ID : このコメントのID,
	StageID : コメントしたステージのID,
	Hashtag : コメントのハッシュタグ,
	Message : コメントの内容,
	Thumbnail : コメントのサムネイル画像のURL,
	Registered : コメントをした日時(GMT+Timezone)
	Tags : [
		IdentifierString : タグの識別子
		DisplayString : タグをラベルとして表示する場合の文字
		LabelColor : タグをラベルとして表示する場合の背景色
	](,,,[]),
	Nickname : ユーザーのニックネーム (or NULL),
	Gender : ユーザーの性別,
	ProfileImageURL : ユーザーのアイコン画像のURL
](,,,[])
}
*/

require_once '../preload.php';

session_start();
$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
session_commit();

if (!isset($session_userid)) {
	exit('no-session');
}

// 最大値を設定
$max_fetch_length 	= 100;
$input_max_fetch_length = filter_input(INPUT_POST, 'length', FILTER_VALIDATE_INT);
if ($input_max_fetch_length !== FALSE && $input_max_fetch_length !== NULL) {
	$max_fetch_length 	= min($max_fetch_length, $input_max_fetch_length);
}
$fetch_start		= filter_input(INPUT_POST, 'start', FILTER_VALIDATE_INT);
if (!$fetch_start) {
	$fetch_start	= 0;
}

// コメント一覧を取得
// SQL Serverでは LIMIT 句が使えないので、一旦全データを取得している いずれ直すべき
$result = array();
$stmt	= $dbh->prepare('SELECT c."ID",c."StageID",c."UserID",c."Message",c."Thumbnail",c."Registered",s."Title" FROM "CommentData" AS c INNER JOIN "Stage" AS s ON c."StageID"=s."ID" WHERE c."State"=:published AND s."UserID"=:userid ORDER BY c."Registered" DESC');
$stmt->bindValue(":published", 'published', PDO::PARAM_STR);
$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
$stmt->execute();

$result	= $stmt->fetchAll(PDO::FETCH_ASSOC);
$result = array_slice($result, 0, $max_fetch_length);

// タグのリストを取得
$stmt			= $dbh->prepare('SELECT "ID","IdentifierString","DisplayString","LabelColor" FROM "StageTagData"');
$stmt->execute();
$tag_value_list	= $stmt->fetchAll(PDO::FETCH_GROUP | PDO::FETCH_ASSOC);

// $result にタグの情報を付加（関連付け）
$stmt	= $dbh->prepare('SELECT "TagID" from "StageTagMap" WHERE "CommentID"=:comment_id');
foreach ($result as $key => $value) {

	$stmt->bindValue(":comment_id", $value['ID'], PDO::PARAM_INT);
	$stmt->execute();
	$tag_id_list			= $stmt->fetchAll(PDO::FETCH_COLUMN, 0);

	$result[$key]['Tags']	= array();
	foreach ($tag_id_list as $index => $tag_id) {
		array_push($result[$key]['Tags'], isset($tag_value_list[$tag_id]) ? $tag_value_list[$tag_id][0] : array());
	}
}

// ユーザー情報を取得
$stmt	= $dbh->prepare('SELECT "Nickname","Gender","ProfileImageURL" FROM "User" WHERE "ID"=:user_id');
foreach ($result as $key => $value) {

	if ($value['UserID']) {

		$stmt->bindValue(":user_id", $value['UserID'], PDO::PARAM_INT);
		$stmt->execute();
		$user	= $stmt->fetch(PDO::FETCH_ASSOC);

		if ($user) {
			$result[$key]['Nickname'] = $user['Nickname'];
			$result[$key]['Gender'] = $user['Gender'];
			$result[$key]['ProfileImageURL'] = $user['ProfileImageURL'];
		}

	} else {
		$result[$key]['Nickname'] = $result[$key]['Gender'] = $result[$key]['ProfileImageURL'] = NULL;
	}
}


// ハッシュタグを作成 (ハッシュタグに使用できない文字を削る)
foreach ($result as $key => $value) {

	$pattern					= '/[^0-9A-Za-z〃々ぁ-ゖ゛-ゞァ-ヺーヽヾ一-龥０-９Ａ-Ｚａ-ｚｦ-ﾟ]/u';
	$hashtag					= preg_replace($pattern, '', $value['Title']);
	if ($hashtag === '') {
		$hashtag 				= 'hackforplay';
	}
	$result[$key]['Hashtag']	= '#' . $hashtag;
}

// 出力
$information_of_stages = new stdClass();
$information_of_stages->values = $result;
$json = json_encode($information_of_stages);

if ($json === FALSE) {
	exit('parse-error');
}

echo $json;

?>
