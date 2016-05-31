<?php
/*
MODをAMDで管理するステージロード(新仕様)コントローラ
Input: type , (id,key|id|token)
type: 改造コードスクリプトの読み込み方法を表すキー文字列 (local|stage|project)
key: type=local のとき、sessionStorageのキーを表す文字列
id: type=stage|local のとき、ステージのIDを表す数値
token: type=project のとき、プロジェクトトークンの文字列
*/

require_once '../preload.php';

session_start();
$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
session_commit();

$type	= filter_input(INPUT_GET, 'type') or die('Missing param type. Add "&type=(ses|sta|pro)" to url');

// Get (source) stage ID
switch ($type) {
	case 'local':
	case 'stage':
		$id	= filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT) or die('Missing param id. Add "&id={STAGE ID}" to url');
		break;
	case 'project':
		$token	= filter_input(INPUT_GET, 'token') or die('Missing param token. Add "&token={YOUR PROJECT TOKEN}" to url');
		$stmt	= $dbh->prepare('SELECT "ID","SourceStageID" FROM "Project" WHERE "Token"=:token');
		$stmt->bindValue(':token', $token, PDO::PARAM_STR);
		$stmt->execute();
		$project = $stmt->fetch(PDO::FETCH_ASSOC) or die('Failed to open project');
		$id = $project['SourceStageID'];
		break;
	default:
		die("Invalid type $type");
		break;
}

// Get source element URL
$stmt	= $dbh->prepare('SELECT "Src","ScriptID","State","UserID","ProjectID","MajorVersion","MinorVersion" FROM "Stage" WHERE "ID"=:id');
$stmt->bindValue(':id', $id, PDO::PARAM_INT);
$stmt->execute();
$stage = $stmt->fetch(PDO::FETCH_ASSOC) or die('Stage not found');

// Check authorization
if ($stage['State'] === 'rejected') {
	die('This stage is rejected');
} elseif ($stage['State'] === 'private' && $stage['UserID'] != $session_userid) {
	die('This stage is private');
}

// Get project token
switch ($type) {
	case 'local':
		$key = filter_input(INPUT_GET, 'key') or die('Missing param key. Add "&key={SESSION STORAGE KEY}" to url');
		$script_src = 'script/?key=' . $key;
		break;
	case 'stage':
		$stmt = $dbh->prepare('SELECT "Token" FROM "Project" WHERE "ID"=:id');
		$stmt->bindValue(':id', $stage['ProjectID'], PDO::PARAM_INT);
		$stmt->execute();
		$token = $stmt->fetch(PDO::FETCH_COLUMN);
		$version = implode('.', [$stage['MajorVersion'], $stage['MinorVersion']]);
		break;
	case 'project':
		$version = '*';
		break;
}

// Register play log
$referrer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : NULL;
switch ($type) {
	case 'stage':
		// Tokenを生成
		$bytes 	= openssl_random_pseudo_bytes(16); // 16bytes (32chars)
		$playlog_token	= bin2hex($bytes); // binaly to hex
		// Logging
		$stmt	= $dbh->prepare('INSERT INTO "PlayLog" ("Token","UserID","StageID","Referrer","Registered") VALUES (:token,:user_id,:stage_id,:referrer,:gmt)');
		$stmt->bindValue(':token', $playlog_token, PDO::PARAM_STR);
		$stmt->bindValue(':user_id', $session_userid, PDO::PARAM_INT);
		$stmt->bindValue(':stage_id', $id, PDO::PARAM_INT);
		$stmt->bindValue(':referrer', $referrer, PDO::PARAM_STR);
		$stmt->bindValue(':gmt', gmdate('Y-m-d H:i:s'), PDO::PARAM_STR);
		$stmt->execute();
		break;
}

$deps = empty($token) ?
[] :
["~project/$token/$version"];

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
	<style type="text/css">
	body {
		margin: 0;
		background-color: #000;
	}
	textarea.log {
		color: #fff;
		font: bold large sans-serif;
		border: 3px solid #fff;
		border-radius: 10px;
		padding: 10px;
		margin: 3px;
	}
	</style>
	<script src="./lib/require.js"></script>

	<script type="text/javascript">

	require.config({
		baseUrl : '../mods/',
	});
	require.onError = function (e) {
		if ('Hack' in window && typeof Hack.openExternal === 'function') {
			Hack.openExternal('https://error.hackforplay'+
												'?name='+e.name+
												'&message='+e.message);
		}
	};
	require(<?php echo json_encode($deps, JSON_UNESCAPED_SLASHES); ?>,
		function () {
			// Temporary implementation
			if ('Hack' in window) {
				Hack.stageInfo = {
					<?php if (isset($playlog_token)) : ?>
					token: '<?php echo $playlog_token; ?>'
					<?php endif; ?>
				};
				Hack.start();
			}

		}
	);
	</script>
</head>
<body>
</body>
</html>
