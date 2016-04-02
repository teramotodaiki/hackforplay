<?php
/*
メールを送信したのち、新しくユーザーを作成し、アカウントを関連づける。NULLは許されない
Input: 	email , gender, nickname , password , birthday , experience_days
Output: JSON:{invalid-inputs} , reserved , sendmail-error , success のいずれか
*/

require_once '../preload.php';

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

// ユーザーを追加（このとき、ひとつのユーザーに複数の有効なHackforPlayアカウントが紐付かないように気をつける）
// セッション情報があれば、今後それを使って同じユーザーIDを使ってもよい
$stmt 	= $dbh->prepare('INSERT INTO "User" ("Gender","Nickname","Birthday","ExperienceDays","TimezoneName","TimezoneOffset","AcceptLanguage","Registered") VALUES(:gender,:nickname,:birthday,:experience_days,NULL,NULL,:accept_language,:gmt)');
$stmt->bindValue(":gender", $gender, PDO::PARAM_STR);
$stmt->bindValue(":nickname", $nickname, PDO::PARAM_STR);
$stmt->bindValue(":birthday", $birthday, PDO::PARAM_STR);
$stmt->bindValue(":experience_days", $experience_days, PDO::PARAM_INT);
$stmt->bindValue(":accept_language", $accept_language, PDO::PARAM_STR);
$stmt->bindValue(":gmt", gmdate("Y-m-d H:i:s"), PDO::PARAM_STR);
$stmt->execute();

$userid = $dbh->lastInsertId();

// アカウントと関連づけ
$stmt 	= $dbh->prepare('INSERT INTO "Account" ("UserID","Type","State","Email","Hashed","Registered") VALUES(:userid,:hackforplay,:unconfirmed,:email,:hashed,:gmt)');
$stmt->bindValue(":userid", $userid, PDO::PARAM_INT);
$stmt->bindValue(":hackforplay", "hackforplay");
$stmt->bindValue(":unconfirmed", "unconfirmed");
$stmt->bindValue(":email", $email);
$stmt->bindValue(":hashed", $hashed);
$stmt->bindValue(":gmt", gmdate("Y-m-d H:i:s"));
$stmt->execute();

exit("success");

?>
