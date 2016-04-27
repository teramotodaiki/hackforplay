<?php
/*
ペーパーログインIDまたはメールアドレス とパスワードをPOSTで取得し、サインインを行う
Input:
{
	email: ペーパーログインIDまたはメールアドレス,
	password: パスワード,
	// ref: もといたページのURL
}
Successed:	もといたページに遷移する
Failed:		ログイン専用ページに移動する
*/

try {

	require_once '../preload.php';

	// ペーパーログインIDまたはメールアドレス, trueと評価できる値ならEmailとして、falseならIDとして扱う
	$email 	= filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
	$password = filter_input(INPUT_POST, 'password');

	$type	= $email ? 'hackforplay' : 'paperlogin';

	// アカウントを確認
	$stmt 	= $dbh->prepare('SELECT "ID","UserID","Hashed" FROM "Account" WHERE "Email"=:email AND "Type"=:hackforplay AND "State"=:connected');
	$stmt->bindValue(":email", filter_input(INPUT_POST, 'email'));
	$stmt->bindValue(":hackforplay", $type);
	$stmt->bindValue(":connected", "connected");
	$stmt->execute();
	$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

	if(!$result){
		header('Location: ../login/?state=unregistered');
		exit;
	}

	// パスワードを照会する
	$confirmed = NULL;
	foreach ($result as $key => $value) {
		if(password_verify($password, $value['Hashed'])){
			$confirmed = $value;
			break;
		}
	}

	if($confirmed === NULL){
		header('Location: ../login/?state=incorrect');
		exit;
	}

	// セッションをつくる
	session_start();
	$_SESSION['UserID'] = $confirmed['UserID'];
	session_commit();

	// サインイン成功
	header('Location: ' . $_SERVER['HTTP_REFERER']);
	exit;

} catch (Exception $e) {
	header('Location: ../e');
	throw $e;
	die;
}

?>
