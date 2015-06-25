<?php

require_once 'common.php';
require_once 'twitteroauth/autoload.php';

use Abraham\TwitterOAuth\TwitterOAuth;

try {

	require_once 'preload.php';

	require_once 'sessionsettings.php';
	session_start();
	$access_token = $_SESSION['access_token'];

	$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);

	$twitter = $connection->get("account/verify_credentials");
	$json = json_encode($twitter);

	// Accountと照合
	$stmt	= $dbh->prepare('SELECT "UserID" FROM "Account" WHERE "Type"=:twitter AND "ExternalID"=:twitter_id');
	$stmt->bindValue(":twitter", 'twitter', PDO::PARAM_STR);
	$stmt->bindValue(":twitter_id", $twitter->id, PDO::PARAM_INT);
	$stmt->execute();

	$user_id = $stmt->fetch(PDO::FETCH_COLUMN, 0);
	if (!$user_id) {

		// 初回ログイン
		$stmt	= $dbh->prepare('INSERT INTO "User" ("Nickname","TimezoneName","TimezoneOffset","AcceptLanguage","ProfileImageURL","Registered") VALUES(:nickname,:timezone_name,:timezone_offset,:accept_language,:profile_image_url,:gmt)');
		$stmt->bindValue(":nickname", $twitter->screen_name, PDO::PARAM_STR);
		$stmt->bindValue(":timezone_name", $twitter->time_zone, PDO::PARAM_STR);
		$stmt->bindValue(":timezone_offset", $twitter->utc_offset, PDO::PARAM_INT);
		$stmt->bindValue(":accept_language", $_SERVER['HTTP_ACCEPT_LANGUAGE'], PDO::PARAM_STR);
		$stmt->bindValue(":profile_image_url", $twitter->profile_image_url, PDO::PARAM_STR);
		$stmt->bindValue(":gmt", gmdate("Y-m-d H:i:s") . '+00:00', PDO::PARAM_STR);
		$stmt->execute();

		$user_id	= $dbh->lastInsertId('User');

		// アカウント作成
		$stmt	= $dbh->prepare('INSERT INTO "Account" ("UserID","Type","State","Email","Hashed","ExternalID","Registered") VALUES (:user_id,:twitter,:connected,:email,:hashed,:twitter_id,:gmt)');
		$stmt->bindValue(":user_id", $user_id, PDO::PARAM_INT);
		$stmt->bindValue(":twitter", 'twitter', PDO::PARAM_STR);
		$stmt->bindValue(":connected", 'connected', PDO::PARAM_STR);
		$stmt->bindValue(":email", '', PDO::PARAM_STR);
		$stmt->bindValue(":hashed", '', PDO::PARAM_STR);
		$stmt->bindValue(":twitter_id", $twitter->id, PDO::PARAM_INT);
		$stmt->bindValue(":gmt", gmdate("Y-m-d H:i:s") . '+00:00', PDO::PARAM_STR);
		$stmt->execute();
	}

	$_SESSION['UserID'] = $user_id;
	session_commit();

} catch (Exception $e) {
	require_once 'exception/tracedata.php';
	traceData($e);

	header('Location: e');
}

 ?>

 <!DOCTYPE html>
 <html>
 <head>
 	<meta charset="utf-8">
 	<meta http-equiv="X-UA-Compatible" content="IE=edge">
 	<title></title>
 </head>
 <body>
 	<?php echo $user_id; ?>
 	<script type="text/javascript" charset="utf-8">
 	var json = <?php echo $json; ?>;
 	console.log(json);
 	</script>
 </body>
 </html>