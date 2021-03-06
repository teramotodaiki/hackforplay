<?php
/*
セッションを確認し、ペーパーログインユーザーであることを確かめる
メールを送信したのち、新しくユーザーを作成し、アカウントを関連づける。NULLは許されない
Input: 	email , gender, nickname , password , birthday , experience_days
Output: JSON:{invalid-inputs} , no-session , unauthorized , reserved , sendmail-error , success のいずれか
*/

require_once '../preload.php';

// セッションを確認
session_start();
$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
session_commit();

if (!$session_userid) {

	exit('no-session');

}

$stmt	= $dbh->prepare('SELECT "ID" FROM "Account" WHERE "UserID"=:user_id AND "Type"=:type AND "State"=:connected');

// メールアドレスの設定の有無を確認
$stmt->bindValue(":user_id", $session_userid, PDO::PARAM_INT);
$stmt->bindValue(":type", 'hackforplay', PDO::PARAM_STR);
$stmt->bindValue(":connected", 'connected', PDO::PARAM_STR);
$stmt->execute();

if ($stmt->fetch()) {

	// すでにメールアドレスが設定されている
	exit('unauthorized');

}

// Input value
$invalid_inputs = array();
$email				= filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
if ($email === FALSE || $email === NULL) {
	array_push($invalid_inputs, 'email');
}
$gender				= filter_input(INPUT_POST, 'gender');
if($gender !== "male" && $gender !== "female"){
	array_push($invalid_inputs, 'gender');
}
$nickname			= filter_input(INPUT_POST, 'nickname');
if($nickname === NULL){
	array_push($invalid_inputs, 'nickname');
}
function formatBirthday($value)
{
	$datetime		= DateTime::createFromFormat('Y-m-d', $value);
	if ($datetime === FALSE) {
		return FALSE;
	}else{
		return $datetime->format('Y-m-d');
	}
}
$birthday			= filter_input(INPUT_POST, 'birthday', FILTER_CALLBACK, array('options' => 'formatBirthday'));
if ($birthday === NULL || $birthday === FALSE) {
	array($invalid_inputs, 'birth_year');
}
$experience_days	= filter_input(INPUT_POST, 'experience_days', FILTER_VALIDATE_INT);
if ($experience_days === NULL || $experience_days === FALSE) {
	array($invalid_inputs, 'experience_days');
}

if(count($invalid_inputs) > 0){
	exit(json_encode($invalid_inputs));
}

$accept_language	= $_SERVER['HTTP_ACCEPT_LANGUAGE'];

// 同じメールアドレスでアカウントが作られていないか
$stmt 	= $dbh->prepare('SELECT "Type" FROM "Account" WHERE "Type"=:hackforplay AND "Email"=:email AND "State"=:connected');
$stmt->bindValue(":hackforplay", "hackforplay");
$stmt->bindValue(":email", $email);
$stmt->bindValue(":connected", "connected");
$stmt->execute();
$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
if(!empty($result)){
	exit("reserved");
}

// 仮パスワードを生成する
$bytes 	= openssl_random_pseudo_bytes(4); // 4bytes (8chars)
$tmpkey	= bin2hex($bytes); // binaly to hex
$hashed = password_hash($tmpkey, PASSWORD_DEFAULT);

// tmpkeyの暗号化
$iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC);
$iv = mcrypt_create_iv($iv_size, MCRYPT_RAND);
$encrypt = mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $encription_key, $tmpkey, MCRYPT_MODE_CBC, $iv);
$sendkey = base64_encode($iv . $encrypt);

if($_SERVER['SERVER_NAME'] === 'localhost'){
	$url = 'http://localhost:8888/auth/confirmfromlink.php?e=' . urlencode($email) . '&p=' . urlencode($sendkey);
}else{
	$url = 'https://' . $_SERVER['SERVER_NAME'] . '/auth/confirmfromlink.php?e=' . urlencode($email) . '&p=' . urlencode($sendkey);
}

// メール送信
require_once 'sendmail.php';
$sendGridMail = createNewMail();
$sendGridMail
    ->addTo($email)
    ->setFrom('noreply@hackforplay.xyz')
    ->setSubject('メールアドレスの登録 - HackforPlay')
    ->setText('仮パスワード：' . $tmpkey . ' またはこちらのリンク：' . $url)
    ->setHtml('仮パスワード： <strong>' . $tmpkey . '</strong><br>' .
    			'または<a href="' . $url . '" title="こちらのリンク">こちらのリンク</a>');
trySending($sendGridMail);

// ユーザー情報を更新
$stmt 	= $dbh->prepare('UPDATE "User" SET "Gender"=:gender,"Nickname"=:nickname,"Birthday"=:birthday,"ExperienceDays"=:experience_days,"AcceptLanguage"=:accept_language,"Registered"=:gmt WHERE "ID"=:userid');
$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
$stmt->bindValue(":gender", $gender, PDO::PARAM_STR);
$stmt->bindValue(":nickname", $nickname, PDO::PARAM_STR);
$stmt->bindValue(":birthday", $birthday, PDO::PARAM_STR);
$stmt->bindValue(":experience_days", $experience_days, PDO::PARAM_INT);
$stmt->bindValue(":accept_language", $accept_language, PDO::PARAM_STR);
$stmt->bindValue(":gmt", gmdate("Y-m-d H:i:s"), PDO::PARAM_STR);
$stmt->execute();

// アカウントと関連づけ
$stmt 	= $dbh->prepare('INSERT INTO "Account" ("UserID","Type","State","Email","Hashed","Registered") VALUES(:userid,:hackforplay,:unconfirmed,:email,:hashed,:gmt)');
$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
$stmt->bindValue(":hackforplay", "hackforplay", PDO::PARAM_STR);
$stmt->bindValue(":unconfirmed", "unconfirmed", PDO::PARAM_STR);
$stmt->bindValue(":email", $email, PDO::PARAM_STR);
$stmt->bindValue(":hashed", $hashed, PDO::PARAM_STR);
$stmt->bindValue(":gmt", gmdate("Y-m-d H:i:s"), PDO::PARAM_STR);
$stmt->execute();

exit("success");

?>
