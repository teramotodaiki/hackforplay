<?php
$to      = $email;
$subject = 'メールアドレスの登録 - HackforPlay';
$message =
	// 'こんにちは。ハックフォープレイ開発者の寺本大輝です！' .
	// 'このメールは、 https://hackforplay.xyz にご入力いただいたメールアドレスに対して送信されています。' .
	// 'このまま登録する場合は、次の仮パスワードをハックフォープレイで入力するか、リンクにアクセスしてください。' .
	'仮パスワード：' . $tmpkey . '\n' .
	'リンク：（準備中）' . date("c");
$headers = 'From: noreply@hackforplay.xyz \r\n' . 'X-Mailer: PHP/' . phpversion();

$result = mail($to, $subject, $message, $headers);
if(!$result){
	die("sendmail-error");
}
?>