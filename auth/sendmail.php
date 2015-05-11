<?php

function mailWithSendGrid($address, $tmpkey, $encription_key)
{
	// tmpkeyの暗号化
	$iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC);
    $iv = mcrypt_create_iv($iv_size, MCRYPT_RAND);
	$encrypt = mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $encription_key, $tmpkey, MCRYPT_MODE_CBC, $iv);
	$sendkey = base64_encode($iv . $encrypt);

	if($_SERVER['SERVER_NAME'] === 'localhost'){
		$url = 'http://localhost:8888/auth/confirmfromlink.php?e=' . urlencode($address) . '&p=' . urlencode($sendkey);
	}else{
		$url = 'https://' . $_SERVER['SERVER_NAME'] . '/auth/confirmfromlink.php?e=' . urlencode($address) . '&p=' . urlencode($sendkey);
	}

	require_once("../sendgrid-php/sendgrid-php.php");

	$sendgrid = new SendGrid('azure_6e7a2cecf7a9b88492fedbe609465546@azure.com', '8kPZ01rAB5ZkAsu');
	$email = new SendGrid\Email();
	$email
	    ->addTo($address)
	    ->setFrom('noreply@hackforplay.xyz')
	    ->setSubject('メールアドレスの登録 - HackforPlay')
	    ->setText('仮パスワード：' . $tmpkey . ' またはこちらのリンク：' . $url)
	    ->setHtml('仮パスワード： <strong>' . $tmpkey . '</strong><br>' .
	    			'または<a href="' . $url . '" title="こちらのリンク">こちらのリンク</a>');

	try {
	    $sendgrid->send($email);
	} catch(\SendGrid\Exception $e) {
	    echo $e->getCode();
	    foreach($e->getErrors() as $er) {
	        echo $er;
	    }
	    // リリース時はこちらにする
	    // die('sendmail-error');
	}

}

?>