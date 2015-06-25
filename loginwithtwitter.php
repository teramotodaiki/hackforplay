<?php
define( 'CONSUMER_KEY', 'mzE0V1O7ERhRgWm0BbN10sn69' );
define( 'CONSUMER_SECRET', 'FkK3GrAtCS4dYF3NC1zU9FVvZTsSH5zzMVsMRjviRbIGWfrI04' );
define( 'OAUTH_CALLBACK', 'https://' . $_SERVER['SERVER_NAME'] . '/callback.php' );

echo OAUTH_CALLBACK;


// login
session_start();
require_once 'twitteroauth/autoload.php';

use Abraham\TwitterOAuth\TwitterOAuth;

//TwitterOAuth をインスタンス化
$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET);

//コールバックURLをここでセット
$request_token = $connection->oauth('oauth/request_token', array('oauth_callback' => OAUTH_CALLBACK));

//callback.phpで使うのでセッションに入れる
$_SESSION['oauth_token'] = $request_token['oauth_token'];
$_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];

//Twitter.com 上の認証画面のURLを取得( この行についてはコメント欄も参照 )
$url = $connection->url('oauth/authenticate', array('oauth_token' => $request_token['oauth_token']));

//Twitter.com の認証画面へリダイレクト
header( 'location: '. $url );


 ?>