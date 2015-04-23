<?php
/*
Sign in/Sign upにかかわらず、ひとまずメールアドレスの存在チェックを行う
Input:	メールアドレス(POST)
Output:	invalid , available または reserved-{service} の配列を格納したJSONデータ
Data:
invalid : 無効なメールアドレス
available : メールアドレスが存在しない（利用可能）
{["Type": (hackforplayなどのサービス名)],,} : すでに登録されているサービス名
*/

require_once '../preload.php';

$email 	= filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
if($email == FALSE){
	exit('invalid');
}

try {
	$stmt 	= $dbh->prepare('SELECT "Type" FROM "Account" WHERE "Email"=:Email AND "State"=:connected');
	$stmt->bindValue(":Email", $email, PDO::PARAM_STR);
	$stmt->bindValue(":connected", "connected", PDO::PARAM_STR);
	$stmt->execute();

	$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
	if($result == NULL){
		exit('available');
	}else{
		$json = json_encode($result);
		exit($json);
	}
} catch (PDOException $e) {
	print_r($e);
	die();
}

 ?>