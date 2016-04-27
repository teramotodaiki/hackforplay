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
			if (!headers_sent()) {
				header('HTTP/1.0 500 Internal Server Error');
				echo json_encode([
					'message' => $e->getMessage(),
					'file' => $e->getFile(),
					'line' => $e->getLine()
				]);
			}
		}
		set_exception_handler('json_like_dump');
		set_error_handler(function ($severity, $message, $file, $line) {
			if (error_reporting() === 0) return;
			json_like_dump(new ErrorException($message, 0, $severity, $file, $line));
		});
		register_shutdown_function(function(){
			$e = error_get_last();
			if ($e !== NULL)
				json_like_dump($e);
    });
		break;
}

// Session
require_once 'session/sethundler.php';

// 暗号化キーの生成
$encription_key = pack('H*', "29fdebae5e1d48b54763051cef08bc55abe017e2ffb2a00a3bcb04b7e103a0cd");

?>
