<?php

function mailWithSendGrid($address, $tmpkey)
{
	require_once("../sendgrid-php/sendgrid-php.php");

	$sendgrid = new SendGrid('azure_6e7a2cecf7a9b88492fedbe609465546@azure.com', '8kPZ01rAB5ZkAsu');
	$email = new SendGrid\Email();
	$email
	    ->addTo($address)
	    ->setFrom('noreply@hackforplay.xyz')
	    ->setSubject('メールアドレスの登録 - HackforPlay')
	    ->setText('仮パスワード：' . $tmpkey)
	    ->setHtml('仮パスワード： <strong>' . $tmpkey . '</strong>');

	$sendgrid->send($email);

	// Or catch the error

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