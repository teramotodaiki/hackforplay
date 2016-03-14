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

	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

	$type	= filter_input(INPUT_GET, 'type') or die('Missing param type. Add "&type=(ses|sta|pro)" to url');

	// Get (source) stage ID
	switch ($type) {
		case 'ses':
		case 'sta':
			$id	= filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT) or die('Missing param id. Add "&id={STAGE ID}" to url');
			break;
		case 'pro':
			$token	= filter_input(INPUT_GET, 'token') or die('Missing param token. Add "&token={YOUR PROJECT TOKEN}" to url');
			$stmt	= $dbh->prepare('SELECT "ID","SourceStageID" FROM "Project" WHERE "Token"=:token AND "UserID"=:session_userid');
			$stmt->bindValue(':token', $token, PDO::PARAM_STR);
			$stmt->bindValue(':session_userid', $session_userid, PDO::PARAM_INT);
			$stmt->execute();
			$project = $stmt->fetch(PDO::FETCH_ASSOC) or die('Failed to open project');
			$id = $project['SourceStageID'];
		default:
			die("Invalid type $type");
			break;
	}

	// Get source element URL
	$stmt	= $dbh->prepare('SELECT "Src","ScriptID" FROM "Stage" WHERE "ID"=:id');
	$stmt->bindValue(':id', $id, PDO::PARAM_INT);
	$stmt->execute();
	$stage = $stmt->fetch(PDO::FETCH_ASSOC);

  $sourceElement = file_get_contents($stage['Src'], true) or die('Failed to load kit');

	// Get script
	switch ($type) {
		case 'ses':
			$key = filter_input(INPUT_GET, 'key') or die('Missing param key. Add "&key={SESSION STORAGE KEY}" to url');
			$script_src = 'script/?key=' . $key;
			break;
		case 'sta':
			$script_src = 'script/?id=' . $stage['ScriptID'];
			break;
		case 'pro':
			$stmt	= $dbh->prepare('SELECT MAX("ID") FROM "Script" WHERE "ProjectID"=:project_id');
			$stmt->bindValue(':project_id', $project['ID'], PDO::PARAM_INT);
			$stmt->execute();
			$script_id	= $stmt->fetch(PDO::FETCH_COLUMN) or die('Failed to load script');
			$script_src = 'script/?id=' . $script_id;
			break;
	}

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
		<script src="<?php echo $script_src; ?>" id="hackforplay-embed-script" data-func="HackforPlayInitializeRestaging"></script></script>
		<?php echo $sourceElement; ?>
  </head>
  <body>
  </body>
</html>
