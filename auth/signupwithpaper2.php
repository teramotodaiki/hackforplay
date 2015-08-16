<?php
/*
IDとパスワードを生成し、新しいユーザーとアカウントを作成する。IDとパスワードをJSONで返す。
Input: timezone
Output: JSON:{information_of_account} , parse-error
information_of_account {
	id: ID
	password: パスワード
}
*/

require_once '../preload.php';

try {

	// Javascriptで取得したブラウザのタイムゾーン
	$timezone = filter_input(INPUT_POST, 'timezone', FILTER_VALIDATE_REGEXP, array("options"=>array("regexp"=>"/^(\+|\-)[0-1][0-9]:00$/")));
	if($timezone === FALSE || $timezone === NULL){
		$timezone = '+00:00';
	}
	$accept_language	= $_SERVER['HTTP_ACCEPT_LANGUAGE'];

	// アカウント情報の生成
	$information_of_account	= new stdClass;

	// IDを生成する

	// $digit桁のランダムな数値を生成する。あまり大きな数には使用できない
	function generate_random_number($digit)
	{
		$gen_random = '';
		for ($i=0; $i < $digit; $i++) {
			$gen_random .= $i === 0 ? 1 + base_convert(bin2hex(openssl_random_pseudo_bytes(3)), 16, 10) % 9 :
							 			base_convert(bin2hex(openssl_random_pseudo_bytes(3)), 16, 10) % 10;
		}
		return $gen_random;
	}

	// 生成
	$stmt	= $dbh->prepare('SELECT COUNT(*) FROM "Account" WHERE "Type"=:paperlogin AND "Email"=:gen_id AND "State"=:connected');
	$gen_id = null;

	while ($gen_id === null) {
		// 仮IDを生成する
		$gen_id	= generate_random_number(8); // 8桁の数字

		// 衝突確認
		$stmt->bindValue(":paperlogin", 'paperlogin', PDO::PARAM_STR);
		$stmt->bindValue(":gen_id", $gen_id, PDO::PARAM_STR);
		$stmt->bindValue(":connected", 'connected', PDO::PARAM_STR);
		$stmt->execute();
		$result	= $stmt->fetch(PDO::FETCH_COLUMN, 0);
		if ($result > 0) {
			$gen_id	= null; // 再生成
		}
	}
	$information_of_account->id = $gen_id;

	// 仮パスワードを生成する
	$tmpkey	= generate_random_number(4); // 4桁の数字
	$hashed = password_hash($tmpkey, PASSWORD_DEFAULT);

	$information_of_account->password = $tmpkey;

	// ユーザーを追加
	$stmt 	= $dbh->prepare('INSERT INTO "User" ("Nickname","AcceptLanguage","Registered") VALUES(:undefined,:accept_language,:gmt)');
	$stmt->bindValue(":undefined", 'undefined', PDO::PARAM_STR);
	$stmt->bindValue(":accept_language", $accept_language, PDO::PARAM_STR);
	$stmt->bindValue(":gmt", gmdate("Y-m-d H:i:s") . $timezone, PDO::PARAM_STR);
	$stmt->execute();

	$userid = $dbh->lastInsertId('User');

	// アカウントと関連づけ
	$stmt 	= $dbh->prepare('INSERT INTO "Account" ("UserID","Type","State","Email","Hashed","Registered") VALUES(:userid,:paperlogin,:connected,:gen_id,:hashed,:gmt)');
	$stmt->bindValue(":userid", $userid, PDO::PARAM_INT);
	$stmt->bindValue(":paperlogin", "paperlogin");
	$stmt->bindValue(":connected", "connected");
	$stmt->bindValue(":gen_id", $information_of_account->id);
	$stmt->bindValue(":hashed", $hashed);
	$stmt->bindValue(":gmt", gmdate("Y-m-d H:i:s") . $timezone);
	$stmt->execute();

	$json	= json_encode($information_of_account);
	if (!$json) {
		exit('parse-error');
	}

	echo $json;

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}
?>