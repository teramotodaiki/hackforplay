<?php
function createNewMail()
{
	require_once("../sendgrid-php/sendgrid-php.php");
	$GLOBALS['SENDGRID_INSTANCE'] = new SendGrid('azure_6e7a2cecf7a9b88492fedbe609465546@azure.com', '8kPZ01rAB5ZkAsu');
	return new SendGrid\Email();
}
function trySending($email)
{
	try {
	    $GLOBALS['SENDGRID_INSTANCE']->send($email);
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