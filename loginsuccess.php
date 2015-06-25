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
	if ($user_id) {
		$_SESSION['UserID'] = $user_id;
	}
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