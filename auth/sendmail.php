<?php
$to      = $email;
$subject = date("s").'メールアドレスの登録 - HackforPlay';
$message =
	// 'こんにちは。ハックフォープレイ開発者の寺本大輝です！' .
	// 'このメールは、 https://hackforplay.xyz にご入力いただいたメールアドレスに対して送信されています。' .
	// 'このまま登録する場合は、次の仮パスワードをハックフォープレイで入力するか、リンクにアクセスしてください。' .
	'仮パスワード：' . $tmpkey . '' .
	'リンク：（準備中）' . date("s");
$headers = 'From: admin@hackforplay.xyz \r\n' . 'X-Mailer: PHP/' . phpversion();

$result = mb_send_mail($to, $subject, $message, $headers);
if(!$result){
	die("sendmail-error");
}
echo $email;
?>