<?php
// environment type
switch ($_SERVER['SERVER_NAME']) {
	case 'localhost': $environment = 'localhost'; break;
	case 'hackforplay-staging.azurewebsites.net': $environment = 'staging'; break;
	default: $environment = 'production'; break;
}

// Exception/Error Handlers
error_reporting(E_ALL);
switch ($environment) {
	case 'staging':
	case 'production':
		// rollbar https://rollbar.com/docs/notifier/rollbar-php/
		require_once 'lib/rollbar.php';
		// installs global error and exception handlers
		Rollbar::init(array(
			'access_token' => '4e7ac652993446f9b9c93cf379995509',
			'environment' => $environment,
			'root' => $_SERVER['DOCUMENT_ROOT']
		));
		break;
	default:
		function json_like_dump ($e) {
			echo "{\n";
			echo "\tmessage: \"{$e->getMessage()}\",\n";
			echo "\tfile: \"{$e->getFile()}\",\n";
			echo "\tline: \"{$e->getLine()}\"\n";
			echo "}";
		}
		set_exception_handler('json_like_dump');
		set_error_handler(function ($severity, $message, $file, $line) {
			json_like_dump(new ErrorException($message, 0, $severity, $file, $line));
		});
		register_shutdown_function(function(){
			$e = error_get_last();
			if ($e !== NULL)
				json_like_dump($e);
    });
		break;
}

// 1.Generate PDO object (connecting mysql)
$pdo = null;
$useLocalDB = true;
if(($useLocalDB && $environment === 'localhost')){
	$dbh 	= new PDO("mysql:dbname=hackforplay-localhost;host=localhost;charset=utf8", 'hackforplay', 'RtPF7JRSZ5XzFasc');
	$dbh->exec("SET sql_mode='ANSI_QUOTES'");
}elseif($environment === 'staging'){
	// error_reporting(0);
	$dbh = new PDO ( "sqlsrv:server = tcp:yadw63xtf8.database.secure.windows.net,1433; Database = hackforplay-staging", "hackforplay@yadw63xtf8", "9PFLn21u9TkiqlKx3ceAbawXSGsBPGT");
}else{
	// error_reporting(0);
	$dbh = new PDO ( "sqlsrv:server = tcp:yadw63xtf8.database.secure.windows.net,1433; Database = hackforplay", "hackforplay@yadw63xtf8", "9PFLn21u9TkiqlKx3ceAbawXSGsBPGT");
}
$dbh->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );

// Session
require_once 'session/sethundler.php';

// 暗号化キーの生成
$encription_key = pack('H*', "29fdebae5e1d48b54763051cef08bc55abe017e2ffb2a00a3bcb04b7e103a0cd");

?>
