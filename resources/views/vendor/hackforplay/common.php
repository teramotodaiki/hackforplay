<?php
define( 'CONSUMER_KEY', 'mzE0V1O7ERhRgWm0BbN10sn69' );
define( 'CONSUMER_SECRET', 'FkK3GrAtCS4dYF3NC1zU9FVvZTsSH5zzMVsMRjviRbIGWfrI04' );
if ($_SERVER['SERVER_NAME'] === 'localhost') {
	define( 'OAUTH_CALLBACK', 'http://localhost:' . $_SERVER['SERVER_PORT'] . '/callback.php' );
} else {
	define( 'OAUTH_CALLBACK', 'https://' . $_SERVER['SERVER_NAME'] . '/callback.php' );
}
 ?>